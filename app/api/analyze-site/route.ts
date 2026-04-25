import { NextRequest, NextResponse } from 'next/server'

type Field = {
  id: string
  label: string
  type: string
  required?: boolean
  options?: { value: string; label: string }[]
}

function cleanHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function meta(html: string, name: string): string {
  const patterns = [
    new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]+property=["']${name}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${name}["'][^>]*>`, 'i'),
  ]
  for (const pattern of patterns) {
    const match = html.match(pattern)?.[1]
    if (match) return match.trim()
  }
  return ''
}

function pageSnapshot(html: string, url: string): string {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || ''
  const description = meta(html, 'description') || meta(html, 'og:description')
  const siteName = meta(html, 'og:site_name')
  const headings = [...html.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi)]
    .map(match => cleanHtml(match[1]))
    .filter(Boolean)
    .slice(0, 25)
  const links = [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map(match => ({ href: match[1], text: cleanHtml(match[2]) }))
    .filter(link => link.text && link.href && !link.href.startsWith('#') && !link.href.startsWith('mailto:') && !link.href.startsWith('tel:'))
    .slice(0, 80)
  const text = cleanHtml(html).slice(0, 12000)

  return [
    `URL: ${url}`,
    siteName ? `Site name: ${siteName}` : '',
    title ? `Title: ${title}` : '',
    description ? `Description: ${description}` : '',
    headings.length ? `Headings:\n${headings.map(h => `- ${h}`).join('\n')}` : '',
    links.length ? `Important links:\n${links.map(link => `- ${link.text}: ${link.href}`).join('\n')}` : '',
    `Visible page text:\n${text}`,
  ].filter(Boolean).join('\n\n')
}

function extractJsonObject(value: string) {
  try {
    return JSON.parse(value)
  } catch {
    const start = value.indexOf('{')
    const end = value.lastIndexOf('}')
    if (start === -1 || end === -1 || end <= start) return null
    try {
      return JSON.parse(value.slice(start, end + 1))
    } catch {
      return null
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url, apiKey, model, featureTitle, featureTagline, fields, productContext } = await req.json() as {
      url?: string
      apiKey?: string
      model?: string
      featureTitle?: string
      featureTagline?: string
      fields?: Field[]
      productContext?: string
    }

    if (!apiKey) return NextResponse.json({ error: 'API key is required.' }, { status: 401 })
    if (!url) return NextResponse.json({ error: 'URL is required.' }, { status: 400 })

    let parsed: URL
    try {
      parsed = new URL(url.startsWith('http') ? url : `https://${url}`)
    } catch {
      return NextResponse.json({ error: 'Enter a valid URL.' }, { status: 400 })
    }

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return NextResponse.json({ error: 'Only http and https URLs are supported.' }, { status: 400 })
    }

    const page = await fetch(parsed.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MarketingSkillsBot/1.0)',
        Accept: 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
    })

    if (!page.ok) {
      return NextResponse.json({ error: `Could not fetch site: ${page.status}` }, { status: 502 })
    }

    const html = await page.text()
    const snapshot = pageSnapshot(html, parsed.toString())
    const fieldSpec = (fields || []).map(f => ({
      id: f.id,
      label: f.label,
      type: f.type,
      required: Boolean(f.required),
      options: f.options?.map(o => o.value),
    }))

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://marketingskills.app',
        'X-Title': 'Marketing Skills App',
      },
      body: JSON.stringify({
        model: model || 'openai/gpt-5.5',
        messages: [
          {
            role: 'system',
            content: 'You analyze websites for marketing work. Infer only what the page supports. Ask concise clarification questions only for important missing context. Return only valid JSON.',
          },
          {
            role: 'user',
            content: `Feature: ${featureTitle}
Feature purpose: ${featureTagline}

Existing product context:
${productContext || 'None'}

Form fields to fill:
${JSON.stringify(fieldSpec, null, 2)}

Website snapshot:
${snapshot}

Return this JSON shape:
{
  "profile": {
    "companyName": "string",
    "oneLiner": "string",
    "category": "string",
    "targetAudience": "string",
    "primaryOffer": "string",
    "keyBenefits": ["string"],
    "positioning": "string",
    "tone": "string",
    "currentCtas": ["string"],
    "importantPages": [{ "label": "string", "url": "string" }],
    "contentGaps": ["string"]
  },
  "summary": "short useful context about the business, audience, offer, positioning, and page",
  "suggestedValues": { "fieldId": "value inferred for that field" },
  "questions": [{ "id": "q1", "question": "specific question", "why": "why this matters" }]
}

Rules:
- suggestedValues keys must match field ids exactly.
- For select/radio/multiselect fields, use the allowed option values when possible.
- Ask at most 5 questions.
- Do not ask questions already answered by the website.`,
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: errorText || 'OpenRouter API error' }, { status: response.status })
    }

    const json = await response.json()
    const content = json.choices?.[0]?.message?.content || ''
    const analysis = extractJsonObject(content)
    if (!analysis) return NextResponse.json({ error: 'Model returned invalid analysis.' }, { status: 502 })

    return NextResponse.json({ ...analysis, url: parsed.toString() })
  } catch (err) {
    console.error('Analyze site API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

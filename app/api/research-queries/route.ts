import { NextRequest, NextResponse } from 'next/server'

function extractJson(value: string) {
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
    const { apiKey, model, researchType, queryHint, featureTitle, featureGoal, siteProfile } = await req.json() as {
      apiKey?: string
      model?: string
      researchType?: 'serp' | 'trends'
      queryHint?: string
      featureTitle?: string
      featureGoal?: string
      siteProfile?: unknown
    }

    if (!apiKey) return NextResponse.json({ error: 'API key is required.' }, { status: 401 })
    if (!queryHint) return NextResponse.json({ error: 'Query hint is required.' }, { status: 400 })

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
            content: 'You create highly relevant Google research queries for one specific website. Return only valid JSON.',
          },
          {
            role: 'user',
            content: `Research type: ${researchType || 'serp'}
Workflow query hint: ${queryHint}
Feature: ${featureTitle}
Feature goal: ${featureGoal}

Active site profile:
${JSON.stringify(siteProfile || {}, null, 2)}

Generate concrete Google queries that are directly relevant to this website. Do not output generic placeholders.

Rules:
- If the site profile is weak, infer from URL/company/category where possible.
- For SERP, generate buyer/search-intent queries that reveal competitors, alternatives, comparisons, pain points, and page formats.
- For Trends, generate short trend terms, not long questions.
- Avoid unrelated broad terms.
- Return 3-5 queries max.

Return JSON:
{
  "queries": ["string"],
  "reasoning": "short explanation of why these queries are relevant"
}`,
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
    const parsed = extractJson(content)
    if (!parsed?.queries?.length) {
      return NextResponse.json({ error: 'Model did not return queries.' }, { status: 502 })
    }

    return NextResponse.json({
      queries: parsed.queries.slice(0, 5),
      reasoning: parsed.reasoning || '',
    })
  } catch (err) {
    console.error('Research queries API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'

type ResearchType = 'serp' | 'trends'

function normalizeSerpItems(items: Record<string, unknown>[]) {
  return items.slice(0, 20).map((item, index) => ({
    position: item.position || item.rank || item.organicPosition || index + 1,
    title: item.title || item.name || '',
    url: item.url || item.link || '',
    snippet: item.description || item.snippet || item.text || '',
    query: item.searchQuery || item.query || '',
  }))
}

function normalizeTrendItems(items: Record<string, unknown>[]) {
  return items.slice(0, 30).map(item => ({
    term: item.searchTerm || item.query || item.keyword || '',
    timeRange: item.timeRange || item.date || '',
    interest: item.interest || item.value || item.interestOverTime || item.timelineData || '',
    relatedQueries: item.relatedQueries || item.risingQueries || item.topQueries || [],
    relatedTopics: item.relatedTopics || item.risingTopics || item.topTopics || [],
    region: item.geo || item.region || item.country || '',
  }))
}

export async function POST(req: NextRequest) {
  try {
    const { type, query, token, country, language } = await req.json() as {
      type?: ResearchType
      query?: string
      token?: string
      country?: string
      language?: string
    }

    if (!token) return NextResponse.json({ error: 'Apify API token is required.' }, { status: 401 })
    if (!query?.trim()) return NextResponse.json({ error: 'Research query is required.' }, { status: 400 })

    const researchType = type || 'serp'
    const actorId = researchType === 'trends'
      ? 'apify~google-trends-scraper'
      : 'apify~google-search-scraper'

    const input = researchType === 'trends'
      ? {
          searchTerms: query.split('\n').map(q => q.trim()).filter(Boolean).slice(0, 5),
          timeRange: 'today 12-m',
          viewedFrom: country || 'US',
        }
      : {
          queries: query.split('\n').map(q => q.trim()).filter(Boolean).slice(0, 5).join('\n'),
          resultsPerPage: 10,
          maxPagesPerQuery: 1,
          countryCode: country || 'us',
          languageCode: language || 'en',
          perplexitySearch: {
            enablePerplexity: false,
            returnImages: false,
            returnRelatedQuestions: true,
          },
          chatGptSearch: {
            enableChatGpt: false,
          },
          maximumLeadsEnrichmentRecords: 0,
        }

    const endpoint = new URL(`https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items`)
    endpoint.searchParams.set('token', token)
    endpoint.searchParams.set('format', 'json')
    endpoint.searchParams.set('clean', 'true')
    endpoint.searchParams.set('timeout', '120')
    endpoint.searchParams.set('maxItems', researchType === 'trends' ? '30' : '20')

    const response = await fetch(endpoint.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: errorText || 'Apify API error' }, { status: response.status })
    }

    const items = await response.json() as Record<string, unknown>[]
    const normalized = researchType === 'trends'
      ? normalizeTrendItems(items)
      : normalizeSerpItems(items)

    return NextResponse.json({
      type: researchType,
      query,
      actorId,
      count: normalized.length,
      items: normalized,
      rawSample: items.slice(0, 3),
      createdAt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Apify research API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

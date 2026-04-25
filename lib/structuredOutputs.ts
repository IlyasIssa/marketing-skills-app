const SCHEMAS: Record<string, string> = {
  'copy-generator': `{
  "headlines": [{ "text": "string", "rationale": "string" }],
  "subheadlines": ["string"],
  "heroParagraph": "string",
  "benefitSections": [{ "heading": "string", "body": "string" }],
  "ctas": ["string"],
  "strategyNotes": ["string"]
}`,
  'seo-auditor': `{
  "executiveSummary": ["string"],
  "findings": [{ "severity": "Critical | High Priority | Quick Win | Improvement", "issue": "string", "impact": "string", "fix": "string" }],
  "technicalChecklist": [{ "task": "string", "priority": "string" }],
  "actionPlan30Days": [{ "week": "string", "tasks": ["string"] }]
}`,
  'email-campaign-builder': `{
  "sequenceGoal": "string",
  "emails": [{ "day": "string", "subject": "string", "previewText": "string", "body": "string", "cta": "string", "job": "string" }],
  "strategyNotes": ["string"]
}`,
  'ab-test-designer': `{
  "hypothesis": "string",
  "control": "string",
  "variant": "string",
  "sampleSize": { "perVariant": "string", "assumptions": "string" },
  "durationEstimate": "string",
  "metrics": [{ "type": "Primary | Secondary | Guardrail", "name": "string", "notes": "string" }],
  "iceScore": { "impact": "string", "confidence": "string", "effort": "string", "total": "string" },
  "analysisPlan": ["string"]
}`,
  'schema-generator': `{
  "schemaType": "string",
  "jsonLd": {},
  "implementationSteps": ["string"],
  "validationChecklist": ["string"],
  "notes": ["string"]
}`,
}

export function supportsStructuredOutput(slug: string): boolean {
  return slug in SCHEMAS
}

export function withStructuredOutputInstructions(slug: string, prompt: string): string {
  const schema = SCHEMAS[slug]
  if (!schema) return prompt

  return `${prompt}

Return only valid JSON. Do not wrap it in markdown fences. Do not include commentary before or after the JSON.
Use this exact shape, keeping arrays populated with useful items:
${schema}`
}

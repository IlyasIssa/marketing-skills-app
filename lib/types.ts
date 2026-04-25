export type FieldType = 'text' | 'textarea' | 'select' | 'multiselect' | 'radio'

export interface FieldOption {
  value: string
  label: string
}

export interface Field {
  id: string
  label: string
  type: FieldType
  placeholder?: string
  options?: FieldOption[]
  required?: boolean
  hint?: string
  rows?: number
}

export interface Category {
  slug: string
  label: string
  color: string
  icon: string
}

export interface Feature {
  slug: string
  title: string
  tagline: string
  category: string
  icon: string
  fields: Field[]
  systemPrompt: string
  buildPrompt: (values: Record<string, string>, productContext: string) => string
}

export interface ProductContext {
  productName: string
  oneLiner: string
  category: string
  businessModel: string
  targetCompanies: string
  decisionMakers: string
  primaryUseCase: string
  coreProblem: string
  keyDifferentiators: string
  directCompetitors: string
  brandTone: string
  keyMetrics: string
}

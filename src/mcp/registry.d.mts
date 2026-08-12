export interface RegistryComponentEvent {
  name: string
  payload?: string
}

export interface RegistryComponent {
  category: string
  categoryLabel: string
  name: string
  slug: string
  title: string
  description: string
  props: Array<Record<string, unknown>>
  slots: string[]
  events: RegistryComponentEvent[]
  code: string
}

export interface Registry {
  package: string
  version: string
  generatedAt: string
  componentCount: number
  composableCount: number
  components: RegistryComponent[]
  composables: string[]
}

export type ComponentSummary = Pick<RegistryComponent, 'name' | 'slug' | 'category' | 'title' | 'description'>
export type ComponentSearchResult = Pick<RegistryComponent, 'name' | 'slug' | 'category' | 'description'>

export declare const CATEGORIES: string[]
export declare function getRegistry(): Registry
export declare function listComponents(options?: { category?: string }): ComponentSummary[]
export declare function getComponent(nameOrSlug?: string): RegistryComponent | null
export declare function searchComponents(query?: string): ComponentSearchResult[]
export declare function listComposables(): string[]

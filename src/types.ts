export interface MillerConfig {
  /**
   * Miller API Url
   */
  apiUrl: string

  /**
   * Current language selected
   */
  lang: string

  /**
   * Availables languages
   */
  langs: string[]

  /**
   * The language used as fallback (optional)
   */
  fallbackLang?: string

  /**
   * Extra headers to inject
   */
  headers?: RequestHeaders
}

export type RequestHeaders = Record<string, string | number | boolean>

export interface MillerImageSizes {
  width: number
  height: number
}

export interface MillerResolution extends MillerImageSizes {
  url: string
}

export interface MillerSubtitle {
  url: string
  type: string
  language: string
  availability: boolean
}

export interface MillerDocumentData {
  date: string
  type: string
  year: number | string
  title: string
  creator: string
  download: string
  end_date: string
  location: string
  snapshot?: MillerImageSizes
  copyright: string
  provenance: string
  start_date: string
  // TODO: Improve typings
  coordinates: any
  description: string
  // TODO: Maybe later improve with intersection
  resolutions?: MillerResolution[]
  type_verbose: string
  translated_urls: string
  reference?: string
  archive_id?: string
  // TODO: Maybe later improve with intersection
  subtitles?: MillerSubtitle[]
}

export interface BaseMillerDocument {
  id: number
  title: string
  slug: string
  url: string
  short_url: string
  snapshot?: string
  type: string
  attachment: string
  data: MillerDocumentData
}

export interface MillerDocumenntInList extends BaseMillerDocument {
  mimetype: string
}

export interface MillerRelatedDocumenntInList {
  document_id: number
}

export interface MillerDocumentDetail extends BaseMillerDocument {
  copyrights: string
  documents: any[]
  locked: boolean
}

// NOTE: Not 100% but for now seems ok =)
export interface MillerFacets {
  [key: string]: { [key: string]: any; count: number }[]
}

export interface MillerFacetsResponse {
  count: number
  facets: MillerFacets
}

export interface MillerPaginatedResponse<Results = any[]> {
  count: number
  next: string | null
  previous: string | null
  results: Results
}

export interface MillerPaginatedResponseWithFacets<Results>
  extends MillerPaginatedResponse<Results> {
  facets: MillerFacets
}

export interface MillerUser {
  username: string
  is_staff: boolean
}

export interface MillerCover {
  id: number
  title: string
  slug: string
  mimetype: string
  type: string
  data: any
  // data:       CoverData;
  url: string
  attachment: string
  snapshot: string
  short_url: string
}

export interface MillerTag {
  id: number
  category: string
  slug: string
  name: string
  status: string
  data: any
}

export interface MillerStoryData {
  color: string
  title: string
  abstract: string
  chapters?: number[]
  background: string
  count_modules?: number
}

export interface MillerStoryWithChaptersData {
  color: string
  title: string
  abstract: string
  chapters: MillerStory[]
  background: string
  count_modules?: number
}

export interface MillerModule {
  module: string
  [key: string]: any
}

export interface MillerModuleContents {
  modules: MillerModule[]
}

export interface BaseMillerStory<TData = any> {
  id: number
  slug: string
  short_url: string
  date: string | null
  date_created: string
  date_last_modified: string
  status: string
  covers: MillerCover[]
  documents: MillerRelatedDocumenntInList[]
  // TODO: Improve type
  authors: any[]
  tags: MillerTag[]
  owner: MillerUser
  data: TData
  contents?: MillerModuleContents
}

export type MillerStory = BaseMillerStory<MillerStoryData>

export type MillerStoryWithChapters =
  BaseMillerStory<MillerStoryWithChaptersData>

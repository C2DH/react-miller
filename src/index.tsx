import { ReactNode, useMemo } from 'react'
import {
  InfiniteData,
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from 'react-query'
import { MillerContext } from './context'
import {
  MillerConfig,
  MillerDocumenntInList,
  MillerDocumentDetail,
  MillerFacetsResponse,
  MillerPaginatedResponse,
  MillerPaginatedResponseWithFacets,
  MillerStory,
} from './types'
import { useGetJSON, useTranslate, useTranslator } from './utils'

export function Miller({
  client,
  apiUrl,
  lang,
  fallbackLang,
  langs,
  headers,
  children,
}: MillerConfig & {
  client: QueryClient
  children: ReactNode
}) {
  const value = useMemo(
    () => ({
      apiUrl,
      lang,
      fallbackLang,
      langs,
      headers,
    }),
    [apiUrl, lang, fallbackLang, langs, headers]
  )
  return (
    <QueryClientProvider client={client}>
      <MillerContext.Provider value={value}>{children}</MillerContext.Provider>
    </QueryClientProvider>
  )
}

type UseQueryOtherResult = Omit<UseQueryResult, 'data'>
type UseQueryMillerOptions = Omit<
  UseQueryOptions<any, any, any, any>,
  'queryKey' | 'queryFn'
> & { params?: Record<string, any> }

const BASE_MILLER_PARAMS: Record<string, any> = {
  parser: 'yaml',
}

export function useDocument(
  id: number,
  options?: UseQueryMillerOptions
): [MillerDocumentDetail | undefined, UseQueryOtherResult] {
  const getJSON = useGetJSON()
  const { params: givenParams, ...queryOptions } = options ?? {}
  const params = {
    ...BASE_MILLER_PARAMS,
    ...givenParams,
  }
  const { data, ...other } = useQuery(
    ['document', id, params],
    ({ signal }) => getJSON(`/document/${id}/`, { params, signal }),
    queryOptions
  )
  return [useTranslate(data), other]
}

export function useDocuments(
  options?: UseQueryMillerOptions
): [
  MillerPaginatedResponseWithFacets<MillerDocumenntInList[]> | undefined,
  UseQueryOtherResult
] {
  const getJSON = useGetJSON()
  const { params: givenParams, ...queryOptions } = options ?? {}
  const params = {
    ...BASE_MILLER_PARAMS,
    ...givenParams,
  }
  const { data, ...other } = useQuery(
    ['documents', params],
    ({ signal }) => getJSON(`/document/`, { params, signal }),
    queryOptions
  )
  return [useTranslate(data), other]
}

export function useDocumentsFacets(
  options?: UseQueryMillerOptions
): [MillerFacetsResponse | undefined, UseQueryOtherResult] {
  const getJSON = useGetJSON()
  const { params: givenParams, ...queryOptions } = options ?? {}
  const params = {
    ...BASE_MILLER_PARAMS,
    facets_only: 1,
    limit: 1,
    ...givenParams,
  }
  const { data, ...other } = useQuery(
    ['documentsFacets', params],
    ({ signal }) => getJSON(`/document/`, { signal, params }),
    queryOptions
  )

  const resultData = data
    ? { facets: data.facets, count: data.count }
    : undefined
  return [resultData, other]
}

type UseInfiniteQueryMillerOptions = Omit<
  UseInfiniteQueryOptions<any, any, any, any, any>,
  'queryKey' | 'queryFn'
> & { params?: Record<string, any> }
type UseInfiniteQueryOtherResult = Omit<UseInfiniteQueryResult, 'data'>

function getNextPageParam(
  lastPage: MillerPaginatedResponse,
  _: MillerPaginatedResponse[]
) {
  if (!lastPage.next) {
    return false
  }
  const parsed = new URLSearchParams(new URL(lastPage.next).search)
  return {
    limit: parsed.get('limit'),
    offset: parsed.get('offset'),
  }
}

export function useInfiniteDocuments(
  options?: UseInfiniteQueryMillerOptions
): [
  (
    | InfiniteData<MillerPaginatedResponseWithFacets<MillerDocumenntInList[]>>
    | undefined
  ),
  UseInfiniteQueryOtherResult
] {
  const getJSON = useGetJSON()
  const { params: givenParams, ...queryOptions } = options ?? {}
  const params = {
    ...BASE_MILLER_PARAMS,
    ...givenParams,
  }
  const { data, ...other } = useInfiniteQuery(
    ['infiniteDocuments', params],
    ({ signal, pageParam }) => {
      return getJSON(`/document/`, {
        signal,
        params: {
          ...params,
          ...pageParam,
        },
      })
    },
    {
      ...queryOptions,
      getNextPageParam,
    }
  )

  const translator = useTranslator()
  const pages = useMemo(
    () => (data ? data.pages.map(translator) : []),
    [data?.pages, translator]
  )
  const dataTranslated = data === undefined ? undefined : { ...data, pages }

  return [dataTranslated, other]
}

export function useStories(
  options?: UseQueryMillerOptions
): [MillerPaginatedResponse<MillerStory[]> | undefined, UseQueryOtherResult] {
  const getJSON = useGetJSON()
  const { params: givenParams, ...queryOptions } = options ?? {}
  const params = {
    ...BASE_MILLER_PARAMS,
    ...givenParams,
  }
  const { data, ...other } = useQuery(
    ['stories', params],
    ({ signal }) => getJSON(`/story/`, { params, signal }),
    queryOptions
  )
  return [useTranslate(data), other]
}

export function useStory(
  idOrSlug: number | string,
  options?: UseQueryMillerOptions
): [MillerStory | undefined, UseQueryOtherResult] {
  const getJSON = useGetJSON()
  const { params: givenParams, ...queryOptions } = options ?? {}
  const params = {
    ...BASE_MILLER_PARAMS,
    ...givenParams,
  }
  const { data, ...other } = useQuery(
    ['story', idOrSlug, params],
    ({ signal }) => getJSON(`/story/${idOrSlug}/`, { params, signal }),
    queryOptions
  )
  return [useTranslate(data), other]
}

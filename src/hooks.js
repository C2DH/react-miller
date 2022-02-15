import { useMemoCompare } from './compare'
import { shallowEqualObjects } from 'shallow-equal'
import { translateMillerInstance } from './translate'
import {
  StoryState,
  StoryCachedState,
  StoriesState,
  StoriesCachedState,
  DocumentState,
  DocumentCachedState,
  DocumentsState,
  DocumentsCachedState,
  DocumentsPaginatedState,
  DocumentsPaginatedCachedState
} from './state'
import { useRunRj, deps } from 'react-rocketjump'

/**
 * @description Grab a story by/slug id from Miller API
 * If config.cached is set, use the CacheStoryState behind the scenes.
 * Document Usage as hook:
 * ```
 *  const { i18n } = useTranslation()
 *  const [homeStory, { error }] = useCacheStory('home', {
 *    parser: 'yaml'
 *  }, {
 *     language: i18n.language,
 *     defaultLanguage: i18n.options.defaultLocale
 *  })
 * ```
 *
 * @param {Number|String} id Story ID or Slug
 * @param {Object} [params] Additional query string params
 * @param {Object} [configs] Language and other configurations
 * @param {Boolean} [shouldCleanBeforeRun]
 * @returns {[Object]}
 */
export function useStory(
  id,
  params = {},
  configs = {},
  shouldCleanBeforeRun = true,
) {
  const {
    language = 'en_GB',
    defaultLanguage = 'en_GB',
    cached = false,
  } = configs
  const memoParams = useMemoCompare(params, shallowEqualObjects)
  if (!id) {
    return [null, { error: 'id not defined', pending: false }]
  }
  const storyId = typeof id === 'number' ? String(id) : id
  // console.info(
  //   'useStory()',
  //   'id:', id,
  //   'memoParams:', memoParams,
  //   'language:', language,
  //   'defaultLanguage:', defaultLanguage,
  //   'cached:', cached
  // )
  const [{ data, error, pending }, actions] = useRunRj(
    cached ? StoryCachedState : StoryState,
    [storyId, memoParams],
    shouldCleanBeforeRun,
    (state) => state,
  )
  const translatedStory = translateMillerInstance(
    data,
    language,
    defaultLanguage,
  )
  return [translatedStory, { error, pending, ...actions }]
}

/**
 * @description load different stories
 * @param {Object} [params] Additional query string params
 * @param {Object} [configs] Language and other configurations
 * @param {Boolean} [shouldCleanBeforeRun]
 * @returns {[Object]}
 */
export function useStories(
  params = { filters: {} },
  configs = {},
  shouldCleanBeforeRun = true,
) {
  const {
    language = 'en_GB',
    defaultLanguage = 'en_GB',
    cached = false,
  } = configs
  const preparedParams = {
    filters: JSON.stringify(params.filters),
  }
  const memoParams = useMemoCompare(preparedParams, shallowEqualObjects)
  const [{ stories, pagination, loading, error }, actions] = useRunRj(
    cached ? StoriesCachedState : StoriesState,
    [memoParams],
    shouldCleanBeforeRun,
  )
  const translatedStories = translateMillerInstance(
    stories,
    language,
    defaultLanguage,
  )
  return [translatedStories, pagination, { error, loading, ...actions }]
}

/**
 * @description Grab a document by/slug id from Miller API. Usage as hook:
 * ```
 *  const { i18n } = useTranslation()
 *  const [homeStory, { error, pending }] = useCacheDocument('id-or-slug', {
 *     language: i18n.language,
 *     defaultLanguage: i18n.options.defaultLocale
 *  })
 * ```
 *
 * @param {Number|String} id Document ID or Slug
 * @param {object} [configs] Language and other configurations
 * @returns {[object]}
 */
export function useDocument(id = null, configs = {}, shouldCleanBeforeRun = true) {
  const {
    language = 'en_GB',
    defaultLanguage = 'en_GB',
    cached = false,
  } = configs;
  const documentId = typeof id === 'number' ? String(id) : id
  const [{ data, error, pending }, actions] = useRunRj(
    cached ? DocumentCachedState : DocumentState,
    [ deps.maybeNull(documentId) ],
    shouldCleanBeforeRun,
  )
  const translatedDocument = translateMillerInstance(
    data,
    language,
    defaultLanguage,
  )
  return [translatedDocument, { error, pending, ...actions }]
}

/**
 * @description Grab a list of documents. Usage as hook:
 * ```
 *  const { i18n } = useTranslation()
 *  const [{ documents, loading, allFacets }, { fetchMore }] = useDocuments({
 *     language: i18n.language,
 *     defaultLanguage: i18n.options.defaultLocale
 *  })
 * ```
 *
 * @param {Object} - params
 * @param {Object} - [configs] Language and other configurations, optional
 * @returns {[Object]}
 */
export function useDocuments(
  params = { filters: {}, q: null },
  configs = {},
  shouldCleanBeforeRun = true,
) {
  const {
    language = 'en_GB',
    defaultLanguage = 'en_GB',
    cached = false,
    paginated = false,
    translated = false
  } = configs;
  const offset = isNaN(params.offset) ? 0 : params.offset;
  const preparedParams = {
    filters: JSON.stringify(params.filters),
    limit: isNaN(params.limit)
      ? 10
      : Math.min(Math.max(-1, params.limit), 1000),
    orderby: typeof params.orderby === 'string' ? params.orderby : undefined,
    facets: typeof params.facets === 'string' ? params.facets : undefined,
    offset
  }
  if (
    typeof params.q === 'string' &&
    params.q.length > 0 &&
    params.q.length < 100
  ) {
    preparedParams.q = params.q
  }
  const memoParams = useMemoCompare(preparedParams, shallowEqualObjects)
  // console.info(
  //   'useDocuments received params:',
  //   memoParams,
  //   'config:',
  //   language,
  //   defaultLanguage,
  // )

  const [{ documents, facets, error, loading, pagination, count }, actions] = useRunRj(
    paginated
      ? (cached ? DocumentsPaginatedCachedState : DocumentsPaginatedState)
      : (cached ? DocumentsCachedState : DocumentsState),
    [ deps.withMeta(memoParams, {append: offset !== 0}) ],
    shouldCleanBeforeRun,
  )
  const translatedDocuments = translated ? translateMillerInstance(
    documents,
    language,
    defaultLanguage,
  ) : documents;
  return [translatedDocuments, pagination, { facets, count, error, loading, ...actions }]
}

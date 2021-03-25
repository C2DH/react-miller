import { useMemoCompare } from './compare'
import { shallowEqualObjects } from 'shallow-equal'
import { translateMillerInstance } from './translate'
import { StoryState, StoriesState, DocumentState } from './state'
import { useRunRj } from 'react-rocketjump'

/**
 * @description Grab a story by/slug id from Miller API don't handle
 * a local state is only a pointer to current cached element. Usage as hook:
 * ```
 *  const { i18n } = useTranslation()
 *  const [homeStory, { error }] = useCacheStory('home', {
 *     language: i18n.language,
 *     defaultLanguage: i18n.options.defaultLocale
 *  })
 * ```
 *
 * @param {Number|String} id Story ID or Slug
 * @param {object} [params] Additional query string params
 * @param {object} [configs] Language and other configurations
 * @returns {[object]}
 */
export function useCachedStory(
  id,
  params = {},
  { language = 'en_GB', defaultLanguage = 'en_GB' },
  shouldCleanBeforeRun = true,
) {
  const memoParams = useMemoCompare(params, shallowEqualObjects)
  console.info('memoParams', memoParams)
  const storyId = typeof id === 'number' ? String(id) : id
  const [{ data, error, pending }, actions] = useRunRj(
    StoryState,
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

export function useCachedStories(
  params = { filters: {} },
  { language = 'en_GB', defaultLanguage = 'en_GB' } = {},
  shouldCleanBeforeRun = true,
) {
  const preparedParams = {
    filters: JSON.stringify(params.filters),
  }
  const memoParams = useMemoCompare(preparedParams, shallowEqualObjects)
  const [
    { stories, pagination, loading, error },
    actions,
  ] = useRunRj(StoriesState, [memoParams, shouldCleanBeforeRun])
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
export function useCachedDocument(
  id,
  { language = 'en_GB', defaultLanguage = 'en_GB' },
  shouldCleanBeforeRun = true,
) {
  const documentId = typeof id === 'number' ? String(id) : id
  const [{ data, error, pending }, actions] = useRunRj(
    DocumentState,
    [documentId],
    shouldCleanBeforeRun,
  )
  const translatedDocument = translateMillerInstance(
    data,
    language,
    defaultLanguage,
  )
  console.info('useCachedDocument', data, translatedDocument)
  return [translatedDocument, { error, pending, ...actions }]
}

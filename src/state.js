import { rj } from 'react-rocketjump'
import rjCache, { SessionStorageStore } from 'react-rocketjump/plugins/cache'
import rjList, {
  limitOffsetPaginationAdapter,
} from 'react-rocketjump/plugins/list'
import { getStory, getStories, getDocument, getDocuments } from './api'

export const StoryState = rj(
  rjCache({
    ns: 'millerStory',
    size: 100,
    store: SessionStorageStore,
  }),
  {
    name: 'MillerStory',
    effect: (id, rawParams = {}) => {
      const { withChapters, language, defaultLanguage, ...params } = rawParams
      return getStory(id, params).then(({ data }) => {
        return data
      })
    },
  },
)

export const StoriesState = rj(
  rjCache({
    ns: 'millerStories',
    size: 50,
  }),
  rjList({
    pageSize: 50,
    pagination: limitOffsetPaginationAdapter,
  }),
  {
    name: 'MillerStories',
    effect: (params) => {
      return getStories(params)
    },
    computed: {
      count: 'getCount',
      stories: 'getList',
    },
  },
)

export const DocumentState = rj(
  // rjCache({
  //   ns: 'MillerDocument',
  //   size: 100,
  //   store: SessionStorageStore,
  // }),
  {
    name: 'MillerDocument',
    effect: (id) => getDocument(id),
  },
)

export const DocumentsState = rj(
  rjList({
    pageSize: 50,
    pagination: limitOffsetPaginationAdapter,
  }),
  {
    name: 'MillerDocuments',
    effect: (params) => {
      return getDocuments(params)
    },
    computed: {
      count: 'getCount',
      documents: 'getList',
    },
  },
)

import { rj } from 'react-rocketjump'
import rjCache, { SessionStorageStore } from 'react-rocketjump/plugins/cache'
import rjList, {
  limitOffsetPaginationAdapter,
} from 'react-rocketjump/plugins/list'
import { getStory, getStories, getDocument, getDocuments } from './api'

export const StoryState = rj({
  name: 'MillerStory',
  effect: (id, params) => getStory(id, params),
})

export const StoryCachedState = rj(
  rjCache({
    ns: 'millerStory',
    size: 100,
    store: SessionStorageStore,
  }),
  {
    name: 'MillerStory',
    effect: (id, params) => getStory(id, params),
  },
)

export const StoriesState = rj(
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

export const StoriesCachedState = rj(
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
  {
    name: 'MillerDocument',
    effect: getDocument
  }
)

export const DocumentCachedState = rj(
  rjCache({
    ns: 'millerDocument',
    size: 100,
    store: SessionStorageStore
  }),
  {
    name: 'MillerDocument',
    effect: getDocument
  }
)

export const DocumentsState = rj(
  rjList({
    pageSize: 50,
    pagination: limitOffsetPaginationAdapter,
  }),
  {
    name: 'MillerDocuments',
    effect: getDocuments,
    computed: {
      count: 'getCount',
      documents: 'getList',
    },
  },
)

export const DocumentsCachedState = rj(
  rjCache({
    ns: 'millerDocuments',
    size: 50
  }),
  rjList({
    pageSize: 50,
    pagination: limitOffsetPaginationAdapter
  }),
  {
    name: 'MillerDocuments',
    effect: getDocuments,
    computed: {
      count: 'getCount',
      documents: 'getList'
    }
  }
)

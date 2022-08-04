import { Fragment, useEffect, useRef } from 'react'
import {
  useDocumentsFacets,
  useGetFlatDocuments,
  useInfiniteDocuments,
  usePrefetchDocument,
} from 'react-miller'
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import DocumentItem from '../components/DocumentItem'

function removeEmptyFilters(deFilters) {
  return Object.keys(deFilters).reduce((out, key) => {
    if (deFilters[key]) {
      out[key] = deFilters[key]
    }
    return out
  }, {})
}

function useFilterRedirect() {
  const location = useLocation()
  const navigate = useNavigate()
  const qsRef = useRef(location.search)
  const filtersOn = location.pathname === '/docs/filter'
  useEffect(() => {
    if (qsRef.current !== location.search) {
      qsRef.current = location.search
      if (location.search !== '' && !filtersOn) {
        navigate(`/docs/filter${location.search}`)
      }
    }
  })
  return filtersOn
}

export default function Documents() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filtersUI = {
    data__type: searchParams.get('data__type', '') ?? '',
    q: searchParams.get('q', '') ?? '',
  }
  const filtersOn = useFilterRedirect()

  const [docsFacets] = useDocumentsFacets({
    params: {
      facets: 'data__type',
    },
  })

  const { q, ...millerFilters } = filtersUI
  const [docGroups, infiniteDocs] = useInfiniteDocuments({
    suspense: !filtersOn,
    keepPreviousData: true,
    params: {
      limit: 30,
      q,
      filters: removeEmptyFilters(millerFilters),
    },
  })

  const getFlatDocs = useGetFlatDocuments()

  const prefetchDocument = usePrefetchDocument()

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <button
          onClick={() => {
            getFlatDocs({ limit: 1000 }).then((flatDocs) => {
              console.log('Flat Docs ~>', flatDocs)
            })
          }}
        >
          Get Flat Docs
        </button>
        <input
          placeholder='Search'
          value={filtersUI.q}
          onChange={(e) =>
            setSearchParams({
              ...filtersUI,
              q: e.target.value,
            })
          }
        />
        {docsFacets && (
          <>
            <div>
              <select
                value={filtersUI.data__type ?? ''}
                onChange={(e) => {
                  setSearchParams({
                    ...filtersUI,
                    data__type: e.target.value,
                  })
                }}
              >
                <option value={''}>-- ALL --</option>
                {docsFacets.facets.data__type.map((f) => (
                  <option key={f.data__type} value={f.data__type}>
                    {f.data__type} ({f.count})
                  </option>
                ))}
              </select>
            </div>
            <div>ALL TOTAL {docsFacets.count}</div>
          </>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {docGroups &&
          docGroups.pages.map((docs, i) => (
            <Fragment key={i}>
              {docs &&
                docs.results.map((doc) => (
                  <div
                    key={doc.id}
                    style={{ width: 150, border: '1px solid deeppink' }}
                  >
                    <DocumentItem
                      doc={doc}
                      onMouseOver={() => {
                        prefetchDocument(doc.id)
                      }}
                    />
                  </div>
                ))}
            </Fragment>
          ))}
      </div>

      <button
        disabled={!infiniteDocs.hasNextPage}
        onClick={() => {
          infiniteDocs.fetchNextPage()
        }}
      >
        Load NEXT!
      </button>
    </div>
  )
}

import { useState } from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import { Miller } from 'react-miller'
import { QueryClient } from 'react-query'
import App from './App'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Languages } from './constants'

const WithMiller = ({
  children,
  defaultLang = Languages[0], // i.e it_IT
  langs = Languages, // i.e ['it_IT', 'de_DE'],
}) => {
  const [lang, setLang] = useState(defaultLang)
  const [disableTranslate, setDisableTranslate] = useState(true)

  const client = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: false,
        refetchIntervalInBackground: false,
        refetchOnMount: false,
        staleTime: Infinity,
        retry: false,
        suspense: true,
      },
    },
  })
  return (
    <Miller
      client={client}
      apiUrl={'/api'}
      langs={langs}
      lang={lang}
      disableTranslate={disableTranslate}
      headers={{
        'X-MILLER-TEST': 'Hello Miller :)',
      }}
    >
      <header className='p-3 bg-dark text-white shadow mb-3'>
        <div className='container'>
          <div className='d-flex flex-wrap align-items-center justify-content-between'>
            <a
              href='/'
              className='d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none'
            >
              MILLER
            </a>
            <div className='text-secondary'>
              <label className='badge'>process.env.PROXY</label>

              {process.env.PROXY}
            </div>

            <div className='text-end'>
              <div className='btn-group my-2 me-2'>
                <a
                  onClick={() => setDisableTranslate(true)}
                  href='#'
                  className={`btn btn-primary btn-sm ${
                    disableTranslate ? 'active' : ''
                  }`}
                >
                  translate OFF
                </a>
                <a
                  onClick={() => setDisableTranslate(false)}
                  href='#'
                  className={`btn btn-primary btn-sm ${
                    disableTranslate ? '' : 'active'
                  }`}
                >
                  translate ON
                </a>
              </div>
              <div className='btn-group my-2'>
                {langs.map((l) => (
                  <a
                    key={l}
                    onClick={() => setLang(l)}
                    href='#'
                    className={`btn btn-primary btn-sm ${
                      l === lang ? 'active' : ''
                    }`}
                  >
                    {l}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </Miller>
  )
}

ReactDOM.render(
  <WithMiller>
    <App />
  </WithMiller>,
  document.getElementById('root')
)

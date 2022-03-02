import ReactDOM from 'react-dom'
import { Miller } from 'react-miller'
import { QueryClient } from 'react-query'
import App from './App'
import { ReactQueryDevtools } from 'react-query/devtools'

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

ReactDOM.render(
  <Miller
    client={client}
    apiUrl={'/api'}
    langs={['de_DE']}
    lang={'en_US'}
    headers={{
      'X-MILLER-TEST': 'Hello Miller :)',
    }}
  >
    <ReactQueryDevtools initialIsOpen={false} />
    <App />
  </Miller>,
  document.getElementById('root')
)

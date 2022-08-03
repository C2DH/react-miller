# React Miller

Basic, powerful react hooks to get `stories`and `documents` from our Miller API (django powered REST api).
THis library is basic a wrapper for react-query(v3.39) adapted to multilanguage translation
and with shortcuts for usual usage.

usage:

Wrap your `App` inside the `Miller` context and initalize a `QueryClient` (see [react-query](https://tanstack.com/query/v4/docs/overview) library)

```javascript
import { Miller } from 'react-miller'
import { QueryClient } from 'react-query'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(
  <Miller
    client={new QueryClient()}
    apiUrl={'/api'}
    langs={langs}
    lang={lang}
    disableTranslate={disableTranslate}
    headers={{
      'X-MILLER-TEST': 'Hello Miller :)',
    }}
  >
    <App />
  </Miller>,
  document.getElementById('root')
)

// ...
```

```javascript
const [data] = useStories({
  params: {
    exclude: {
      tags__slug: 'static',
    },
  },
  suspense: false,
})
```

## Development & API test

Local development allows you to set basic to test the library against different API

```
yarn install

PROXY=http://your-proxy LANGS=en_GB,fr_FR yarn run dev
```

Default env values:

```
PROXY=http://localhost
LANGS=en_GB,fr_FR,de_DE,it_IT
```

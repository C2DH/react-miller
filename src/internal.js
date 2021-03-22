import { createContext } from 'react'

export const MillerContext = createContext({
  cache: false,
  suspense: false,
  lang: null,
  fallbackLang: null,
  langs: [],
  setLang: () => {},
  apiUrl: null,
})

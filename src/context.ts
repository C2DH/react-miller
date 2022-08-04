import { createContext } from 'react'
import { MillerConfig } from './types'

export const MillerContext = createContext<MillerConfig>(null as any)

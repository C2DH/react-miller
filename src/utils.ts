import axios, { AxiosRequestConfig } from 'axios'
import { useCallback, useContext, useMemo } from 'react'
import { MillerContext } from './context'
import {
  MillerModule,
  MillerRelatedDocumenntInList,
  MillerStory,
} from './types'

function isObjectLike(data: any): data is Record<string, null> {
  return data !== null && typeof data === 'object'
}

function encodeParamasForMiller(
  params: Record<string, any> = {}
): Record<string, any> {
  let filters = params.filters
  if (isObjectLike(filters)) {
    filters = JSON.stringify(filters)
  }
  let exclude = params.exclude
  if (isObjectLike(exclude)) {
    exclude = JSON.stringify(exclude)
  }
  return { ...params, filters, exclude }
}

export function useGetJSON() {
  const { apiUrl, headers } = useContext(MillerContext)
  return useCallback(
    <T = any, D = any>(
      path: string,
      req: AxiosRequestConfig<D>
    ): Promise<T> => {
      return axios
        .get(`${apiUrl}${path}`, {
          headers,
          ...req,
          // TODO: Fix encoding of facets avoid facets[]
          params: req.params ? encodeParamasForMiller(req.params) : undefined,
        })
        .then((r) => r.data)
    },
    [apiUrl]
  )
}

function translate(
  data: any,
  lang: string,
  langs: string[],
  fallbackLang?: string
): any {
  // Iteree over them and translate
  if (Array.isArray(data)) {
    return data.map((item) => translate(item, lang, langs, fallbackLang))
  }

  if (isObjectLike(data)) {
    // Empty object return them
    const keys = Object.keys(data)
    if (keys.length === 0) {
      return data
    }
    // CAN TRANSLATE!
    if (data[lang] !== undefined) {
      return data[lang]
    } else if (fallbackLang && data[fallbackLang] !== undefined) {
      // Use fallback lang!
      return data[fallbackLang]
    } else if (langs && langs.length) {
      // Ok at this point check if this objects
      // containts other langs and if return null
      if (
        langs.some((lang) => data[lang] !== undefined && data[lang] !== null)
      ) {
        // NOTE: Returing null isn't total correct but ... Y this breaks more
        // cases lol
        return null
      }
    }
    // Iteree over values
    const obj: Record<string, any> = {}
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      obj[key] = translate(data[key], lang, langs, fallbackLang)
    }
    return obj
  }

  return data
}

export function useTranslator() {
  const { langs, lang, fallbackLang } = useContext(MillerContext)
  return useCallback(
    (data) => translate(data, lang, langs, fallbackLang),
    [lang, langs, fallbackLang]
  )
}

export function useTranslate(data: any) {
  const { langs, lang, fallbackLang } = useContext(MillerContext)
  return useMemo(
    () => translate(data, lang, langs, fallbackLang),
    [lang, langs, fallbackLang, data]
  )
}

export function mapStoryWithRelatedModulesDocuments(
  story: MillerStory
): MillerStory {
  // No modules for this story!
  if (!Array.isArray(story.contents?.modules)) {
    return story
  }

  // Index docs by id
  const documentsById = story.documents.reduce((all, doc) => {
    all[doc.document_id] = doc
    return all
  }, {} as Record<number, MillerRelatedDocumenntInList>)

  // NOTE:
  // Ok at this points typings sucks ... a lot ... but for the module
  // schema isn't so clear ... so for now this makumba works keep it ....
  const mapId = (obj: any) => {
    if (obj.id) {
      const document = documentsById[obj.id] ?? null
      return {
        ...obj,
        document,
      }
    }
    return obj
  }

  const modules = story.contents!.modules.map((mod) => {
    let mappedModule = mapId(mod)
    if (mappedModule.object) {
      mappedModule = {
        ...mappedModule,
        object: mapId(mappedModule.object),
      }
    }
    if (Array.isArray(mappedModule.objects)) {
      mappedModule = {
        ...mappedModule,
        objects: mappedModule.objects.map(mapId),
      }
    }
    if (Array.isArray(mappedModule.speakers)) {
      mappedModule = {
        ...mappedModule,
        speakers: mappedModule.speakers.map(mapId),
      }
    }
    if (Array.isArray(mappedModule.gallery?.objects)) {
      mappedModule = {
        ...mappedModule,
        gallery: {
          ...mappedModule.gallery,
          objects: mappedModule.gallery.objects.map(mapId),
        },
      }
    }
    return mappedModule
  })
  return {
    ...story,
    contents: {
      ...story.contents,
      modules,
    },
  }
}

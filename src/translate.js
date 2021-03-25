export function translateMillerInstance(
  data,
  language,
  defaultLanguage,
  langs = ['fr_FR', 'de_DE'],
) {
  // Primitive types can't translate them
  const dataType = typeof data
  if (
    data === null ||
    data === undefined ||
    ['number', 'string', 'boolean', 'symbol'].includes(dataType)
  ) {
    return data
  }
  // Iteree over them and translate
  if (Array.isArray(data)) {
    return data.map((d) =>
      translateMillerInstance(d, language, defaultLanguage, langs),
    )
  }
  // Empty object return them
  const keys = Object.keys(data)
  if (keys.length === 0) {
    return data
  }
  // CAN TRANSLATE!
  if (data[language] !== undefined) {
    return data[language]
  } else if (defaultLanguage !== null && data[defaultLanguage] !== undefined) {
    // Use fallback lang!
    return data[defaultLanguage]
  } else if (langs && langs.length) {
    // Ok at this point check if this objects
    // containts other langs and if return null
    if (langs.some((lang) => data[lang])) {
      return null
    }
  }
  // Iteree over values
  const obj = {}
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    obj[key] = translateMillerInstance(
      data[key],
      language,
      defaultLanguage,
      langs,
    )
  }
  return obj
}

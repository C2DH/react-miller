# react-miller

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/react-miller.svg)](https://www.npmjs.com/package/react-miller) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A simple piece of code that deals with effects while loading Miller REST api instance.
We make use of the nice library `react-rocketjump`

## Install

```bash
npm install --save react-miller
```

## Usage
Note that `react-miller` hooks require a `language` param. Our implementation is usually coupled together with 'react-i18next' that gives us a nice `useTranslation`
hook, but feel free to use whatever it suits your needs.

### useCachedStory


```jsx
  import React from 'react'
  import { useCachedStory } from 'react-miller'
  import { useTranslation } from 'react-i18next'

  const Home = () => {
    const { t, i18n } = useTranslation()
    const { width, height } = useCurrentWindowDimensions()
    const [homeStory, { error }] = useCachedStory('home', {
      language: i18n.language.split('-').join('_'),
      defaultLanguage: i18n.options.defaultLocale,
    })
    console.info("Home", homeStory, error)
    return (
      <div className="Home">{homeStory.title}</div>
    )
  }

```

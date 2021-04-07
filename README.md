# react-miller

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/react-miller.svg)](https://www.npmjs.com/package/react-miller) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A simple piece of code that deals with effects while loading Miller REST api instance for **stories** and for **documents**

We make use of the nice library [react-rocketjump](https://inmagik.github.io/react-rocketjump/docs/quickstart) to handle side effects, like `pending`, `loading` or to wrap our list endpoints with its convenient [List plugin](https://inmagik.github.io/react-rocketjump/docs/plugin-list).

## Install

```bash
npm install --save react-miller
```


## Usage
Note that `react-miller` hooks require a `language` param. Our implementation is usually coupled together with 'react-i18next' that provide us with a nice `useTranslation`
hook, but feel free to use whatever it suits your needs!

### useStory
Used to retrieve one single story, it is a hook for the the endpoint `/api/story/<id>`)

```jsx
  import React from 'react'
  import { useStory } from 'react-miller'

  const Home = () => {
    const [homeStory, { error }] = useStory('home', {
      language: 'it_IT',
      defaultLanguage: 'en_GB',
      cached: true,
    })
    return (
      <h1 className="Home">{homeStory.title}</h1>
    )
  }

```

### useStories
Used to retrieve multiple stories, with optional filters.

```jsx
  import React from 'react'
  import { useCachedStories } from 'react-miller'

  const ListOfStories = () => {
    const [stories, pagination, { error }] = useStories({
      filters: {
        tags__slug: 'theme'
      }
    }, {
      language: 'it_IT',
      defaultLanguage: 'en_GB',
      cached: true,
    })

    if (!stories) {
      return null
    }

    return (
      <ol className="ListOfStories">
        {stories.map((story) => (
          <li key={story.id}>{story.title}</li>
        )}
      </ol>
    )
  }

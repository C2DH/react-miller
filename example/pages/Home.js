import { useState } from 'react'
import {
  usePrefetchStory,
  usePrefetchStoryWithChapters,
  useStories,
} from 'react-miller'
import { Link } from 'react-router-dom'
import StoryItem from '../components/StoryItem'

export default function Home() {
  const prefetchStory = usePrefetchStory()
  const prefetchStoryWithChapters = usePrefetchStoryWithChapters()
  const [staticStories, { isSuccess: isStaticStoriesSuccess }] = useStories({
    params: {
      filters: {
        tags__slug: 'static',
      },
    },
  })
  const [themeStories, { isSuccess: isThemeStoriesSuccess }] = useStories({
    params: {
      filters: {
        tags__slug: 'theme',
      },
    },
  })
  const [normalStories, { isSuccess: isNormalStoriesSuccess }] = useStories({
    params: {
      exclude: {
        tags__slug__in: ['static', 'theme'],
      },
    },
  })

  return (
    <div className='container'>
      <div className='row mt-3'>
        <div className='col-4'>
          {isStaticStoriesSuccess && (
            <>
              <h3>
                tags__slug <code>static</code>: {staticStories.count}
              </h3>
              <ol>
                {staticStories.results.map((story) => (
                  <li key={story.id}>
                    <StoryItem story={story} debug />
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
        <div className='col-4'>
          {isThemeStoriesSuccess && (
            <>
              <h3>
                tags__slug <code>theme</code>: {themeStories.count}
              </h3>
              <ol>
                {themeStories.results.map((story) => (
                  <li key={story.id}>
                    <StoryItem
                      story={story}
                      debug
                      onMouseOver={() => {
                        prefetchStoryWithChapters(story.slug)
                      }}
                    />
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
        <div className='col-4'>
          {isNormalStoriesSuccess && (
            <>
              <h3>
                not <code>static</code>, not <code>theme</code>:{' '}
                {normalStories.count}
              </h3>
              <ol>
                {normalStories.results.map((story) => (
                  <li key={story.id}>
                    <StoryItem
                      story={story}
                      debug
                      onMouseOver={() => {
                        prefetchStory(story.slug)
                      }}
                    />
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

import { Languages } from '../constants'
import { Link } from 'react-router-dom'

export default function StoryItem({ story, langs, debug }) {
  const translated = typeof story.data.title === 'string'
  return (
    <div>
      {translated
        ? `${story.data.title} (translated)`
        : JSON.stringify(story.data.title, null, 2)}
      <details>
        <summary>{story.slug}</summary>
        <pre>{JSON.stringify(story, null, 2)}</pre>
      </details>
    </div>
  )
}

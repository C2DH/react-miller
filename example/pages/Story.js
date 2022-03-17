import { useStory } from 'react-miller'
import { useParams } from 'react-router-dom'

export default function Story() {
  const { idOrSlug } = useParams()
  const [story] = useStory(idOrSlug)

  return (
    <div>
      {story && (
        <div>
          <h1>{story.data.title}</h1>
          <p>{story.data.abstract}</p>
        </div>
      )}
    </div>
  )
}

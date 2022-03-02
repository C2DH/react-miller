import { useStory } from 'react-miller'

export default function About() {
  const [story] = useStory('about')
  return (
    <div>
      <h1>About!</h1>
      {story && <p>{story.data.abstract}</p>}
    </div>
  )
}

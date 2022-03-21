import { useStories } from 'react-miller'
import { Link } from 'react-router-dom'

export default function Home() {
  const [stories] = useStories({
    params: {
      filters: {
        slug__in: ['outline', 'perspectives', 'explorations', 'about'],
      },
    },
  })

  return (
    <div>
      {stories &&
        stories.results.map((story) => (
          <div key={story.id}>
            <h2>{story.data.title}</h2>
            <p>
              <Link to={`/story/${story.slug}`}>#{story.slug}</Link>
            </p>
          </div>
        ))}
      <div>
        <Link to={'/theme/outline-1'}>Test Theme</Link>
      </div>
    </div>
  )
}

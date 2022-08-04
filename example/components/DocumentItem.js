import { Languages } from '../constants'
import { Link } from 'react-router-dom'

export default function DocumentItem({ doc, debug }) {
  const translated = typeof doc.data.title === 'string'
  return (
    <div>
      {translated
        ? `${doc.data.title} (translated)`
        : JSON.stringify(doc.data.title, null, 2)}
      <details>
        <summary>{doc.slug}</summary>
        <pre>{JSON.stringify(doc, null, 2)}</pre>
      </details>
    </div>
  )
}

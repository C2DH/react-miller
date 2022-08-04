import { useDocument } from 'react-miller'
import { useParams } from 'react-router-dom'

export default function Doc() {
  const { id } = useParams()
  const [doc] = useDocument(id)

  return (
    <div>
      {doc && (
        <div>
          <h1>{doc.data.title}</h1>
          <img style={{ maxWidth: 1000 }} src={doc.attachment} />
        </div>
      )}
    </div>
  )
}

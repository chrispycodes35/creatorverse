import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { addCreator } from '../api/creatorsFetch.js'

export default function AddCreator() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [imageURL, setImageURL] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await addCreator({ name, url, description, imageURL })
      navigate('/creators')
    } catch (err) {
      setError(err?.message ?? String(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="container">
      <h2 className="page-title">Add Creator</h2>

      <form onSubmit={handleSubmit} className="compact-form">
        <div>
          <label htmlFor="name">Name</label>
          <br />
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="url">Channel/Page URL</label>
          <br />
          <input id="url" value={url} onChange={(e) => setUrl(e.target.value)} required />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <br />
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
          />
        </div>

        <div>
          <label htmlFor="imageURL">Image URL (optional)</label>
          <br />
          <input
            id="imageURL"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
          />
        </div>

        {error ? (
          <div>
            <p>Could not add creator:</p>
            <pre>{error}</pre>
          </div>
        ) : null}

        <div className="page-actions" role="group" aria-label="Add creator actions">
          <button type="button" className="secondary" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="btn-success" disabled={isSubmitting}>
            {isSubmitting ? 'Adding…' : 'Add Creator'}
          </button>
        </div>
      </form>
    </main>
  )
}


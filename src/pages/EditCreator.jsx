import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { deleteCreator, fetchCreator, updateCreator } from '../api/creatorsFetch.js'

export default function EditCreator() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [imageURL, setImageURL] = useState('')

  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const row = await fetchCreator(id)
        if (cancelled) return
        setName(row.name ?? '')
        setUrl(row.url ?? '')
        setDescription(row.description ?? '')
        setImageURL(row.imageURL ?? '')
      } catch (e) {
        if (!cancelled) setError(e?.message ?? String(e))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id])

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await updateCreator(id, { name, url, description, imageURL })
      navigate(`/creators/${id}`)
    } catch (err) {
      setError(err?.message ?? String(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete() {
    if (isSubmitting || isDeleting) return
    const ok = window.confirm(
      'Are you sure you want to delete this creator? This cannot be undone.',
    )
    if (!ok) return

    setIsDeleting(true)
    setError(null)
    try {
      await deleteCreator(id)
      navigate('/creators')
    } catch (err) {
      setError(err?.message ?? String(err))
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) return <p>Loading…</p>

  return (
    <main className="container">
      <h2 className="page-title">Edit Creator</h2>

      <article className="edit-creator-card">
        <form onSubmit={handleSubmit} className="compact-form">
        <label htmlFor="name">
          Name
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter creator name"
          />
        </label>

        <label htmlFor="url">
          Channel/Page URL
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            placeholder="https://example.com"
          />
        </label>

        <label htmlFor="description">
          Description
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            placeholder="Enter a description of the creator's content"
          />
        </label>

        <label htmlFor="imageURL">
          Image URL (optional)
          <input
            id="imageURL"
            type="url"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </label>

        {error ? (
          <article className="error-message">
            <strong>Could not save changes:</strong>
            <pre>{error}</pre>
          </article>
        ) : null}

        <div className="page-actions" role="group" aria-label="Edit creator actions">
          <button
            type="button"
            className="secondary"
            onClick={() => navigate(-1)}
            disabled={isSubmitting || isDeleting}
          >
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting || isDeleting}>
            {isSubmitting ? 'Saving…' : 'Save'}
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={handleDelete}
            disabled={isSubmitting || isDeleting}
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
        </form>
      </article>
    </main>
  )
}

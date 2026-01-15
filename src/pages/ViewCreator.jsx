import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { fetchCreator } from '../api/creatorsFetch.js'

export default function ViewCreator() {
  const { id } = useParams()
  const [creator, setCreator] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const row = await fetchCreator(id)
        if (!cancelled) setCreator(row)
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

  if (loading) return <p>Loading…</p>

  if (error) {
    return (
      <main className="container">
        <p>Couldn’t load creator:</p>
        <pre>{error}</pre>
        <p>
          <Link to="/creators">← Back</Link>
        </p>
      </main>
    )
  }

  if (!creator) {
    return (
      <main className="container">
        <p>Creator not found.</p>
        <p>
          <Link to="/creators">← Back</Link>
        </p>
      </main>
    )
  }

  return (
    <main className="container">
      <div className="top-left-actions">
        <Link to="/" role="button" className="secondary">
          Home
        </Link>
        <Link to="/creators" role="button" className="secondary">
          Creators
        </Link>
      </div>

      <article className="view-creator-card">
        <header>
          <h2>{creator.name}</h2>
        </header>

        {creator.imageURL ? (
          <figure className="view-creator-image">
            <img src={creator.imageURL} alt={`${creator.name} avatar`} />
          </figure>
        ) : null}

        <section>
          <h3>Description</h3>
          <p>{creator.description}</p>
        </section>

        <section>
          <h3>Channel/Page</h3>
          <p>
            <a href={creator.url} target="_blank" rel="noreferrer">
              {creator.url}
            </a>
          </p>
        </section>

        <footer className="page-actions">
          <Link to={`/creators/${creator.id}/edit`} role="button">
            Edit Creator Profile
          </Link>
        </footer>
      </article>
    </main>
  )
}

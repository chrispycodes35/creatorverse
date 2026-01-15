import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Card from '../components/Card.jsx'
import { fetchCreators } from '../api/creatorsFetch.js'

export default function ShowCreators() {
  const [creators, setCreators] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchCreators()
        if (!cancelled) setCreators(data)
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
  }, [])

  return (
    <main className="container">
      <div className="top-left-actions">
        <Link to="/" role="button" className="secondary">
          Home
        </Link>
      </div>

      <h2 className="page-title">My Favorite Creators</h2>


      {loading ? <p>Loading…</p> : null}
      {error ? (
        <div>
          <p>Couldn’t load creators:</p>
          <pre>{error}</pre>
        </div>
      ) : null}

      {!loading && !error && creators.length === 0 ? (
        <p>There are no content creators in the database.</p>
      ) : null}

      {!loading && !error && creators.length > 0 ? (
        <div className="grid">
          {creators.map((creator) => (
            <Card key={creator.id} creator={creator} />
          ))}
        </div>
      ) : null}
      
      <div className="page-actions" role="group" aria-label="Creator list actions">
        <Link to="/add-creator" role="button" className="btn-success">
          Add a Creator
        </Link>
      </div>
    </main>
    
  )
}


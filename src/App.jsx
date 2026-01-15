import { useEffect, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'

import AddCreator from './pages/AddCreator.jsx'
import EditCreator from './pages/EditCreator.jsx'
import ShowCreators from './pages/ShowCreators.jsx'
import ViewCreator from './pages/ViewCreator.jsx'
import Card from './components/Card.jsx'
import { fetchCreators } from './api/creatorsFetch.js'

function Home() {
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
      <h1>CreatorVerse</h1>
      
      <div className="home-intro">
        <p>
          Welcome to CreatorVerse! CreatorVerse allows you to add creators, modify creator information, and 
          delete creators.
        </p>
      </div>

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
          {creators.slice(0, 5).map((creator) => (
            <Card key={creator.id} creator={creator} />
          ))}
        </div>
      ) : null}

      <div className="page-actions home-actions" role="group" aria-label="Home actions">
        <Link to="/creators" role="button">
          View all creators
        </Link>
        <Link to="/add-creator" role="button" className="btn-success">
          Add a Creator
        </Link>
      </div>
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/creators" element={<ShowCreators />} />
      <Route path="/creators/:id" element={<ViewCreator />} />
      <Route path="/creators/:id/edit" element={<EditCreator />} />
      <Route path="/add-creator" element={<AddCreator />} />
    </Routes>
  )
}

export default App

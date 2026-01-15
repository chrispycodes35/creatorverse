import { Link } from 'react-router-dom'

export default function Card({ creator }) {
  const id = creator?.id
  const name = creator?.name ?? 'Unknown creator'
  const url = creator?.url ?? ''
  const description = creator?.description ?? ''
  const imageURL = creator?.imageURL ?? ''
  const hasId = id !== null && id !== undefined && String(id).trim() !== ''

  return (
    <article className="creator-card">
      <header>
        <h3 className="creator-card__title">{name}</h3>
      </header>

      <div className="creator-card__media">
        {imageURL ? (
          <img className="creator-card__img" src={imageURL} alt={`${name} avatar`} />
        ) : (
          <div className="creator-card__placeholder" aria-hidden="true">
            {name} avatar
          </div>
        )}
      </div>

      <div className="creator-card__body">
        {description ? <p>{description}</p> : null}

        {url ? (
          <p>
            <a href={url} target="_blank" rel="noreferrer">
              Visit channel/page
            </a>
          </p>
        ) : null}
      </div>

      <footer className="creator-card__actions" aria-label="Creator actions">
        {hasId ? (
          <>
            <Link to={`/creators/${id}`} aria-label="View creator">
              <img
                src="/view_document.svg"
                alt=""
                aria-hidden="true"
                width="40"
                height="40"
              />
            </Link>{' '}
            <Link to={`/creators/${id}/edit`} aria-label="Edit creator profile">
              <img src="/edit.svg" alt="" aria-hidden="true" width="40" height="40" />
            </Link>
          </>
        ) : (
          <span>(Missing creator id)</span>
        )}
      </footer>
    </article>
  )
}

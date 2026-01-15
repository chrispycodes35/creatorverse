import { SUPABASE_KEY, SUPABASE_URL } from '../client.js'

const CREATORS_URL = `${SUPABASE_URL}/rest/v1/creators`

function normalizeCreator(row) {
  if (!row) return row
  return {
    ...row,
    imageURL: row.imageURL ?? row.image_url ?? '',
  }
}

async function readError(res) {
  const text = await res.text()
  try {
    const parsed = JSON.parse(text)
    return parsed?.message ?? text
  } catch {
    return text
  }
}

function baseHeaders() {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
  }
}

function isMissingImageUrlColumnMessage(message) {
  const m = String(message ?? '').toLowerCase()
  return (
    m.includes('imageurl') &&
    (m.includes('does not exist') || m.includes('column') || m.includes('schema cache'))
  )
}

export async function fetchCreators() {
  const url = `${CREATORS_URL}?select=*&order=id.asc`
  const res = await fetch(url, { headers: baseHeaders() })
  if (!res.ok) throw new Error(await readError(res))
  const data = await res.json()
  return (data ?? []).map(normalizeCreator)
}

export async function fetchCreator(id) {
  const url = `${CREATORS_URL}?select=*&id=eq.${encodeURIComponent(id)}`
  const res = await fetch(url, { headers: baseHeaders() })
  if (!res.ok) throw new Error(await readError(res))
  const data = await res.json()
  const row = Array.isArray(data) ? data[0] : data
  if (!row) throw new Error('Creator not found.')
  return normalizeCreator(row)
}

async function postCreator(payload) {
  const res = await fetch(`${CREATORS_URL}?select=*`, {
    method: 'POST',
    headers: {
      ...baseHeaders(),
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) throw new Error(await readError(res))
  const data = await res.json()
  if (Array.isArray(data)) return normalizeCreator(data[0])
  return normalizeCreator(data)
}

export async function addCreator({ name, url, description, imageURL }) {
  const payload = {
    name: String(name ?? '').trim(),
    url: String(url ?? '').trim(),
    description: String(description ?? '').trim(),
    imageURL: String(imageURL ?? '').trim(),
  }

  if (!payload.name || !payload.url || !payload.description) {
    throw new Error('Please provide a name, url, and description.')
  }

  if (!payload.imageURL) delete payload.imageURL

  try {
    return await postCreator(payload)
  } catch (e) {
    // If DB uses snake_case column `image_url`, retry once.
    if (payload.imageURL && isMissingImageUrlColumnMessage(e?.message)) {
      const { imageURL: img, ...rest } = payload
      return await postCreator({ ...rest, image_url: img })
    }
    throw e
  }
}

async function patchCreator(id, payload) {
  const res = await fetch(`${CREATORS_URL}?id=eq.${encodeURIComponent(id)}&select=*`, {
    method: 'PATCH',
    headers: {
      ...baseHeaders(),
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) throw new Error(await readError(res))
  const data = await res.json()
  if (Array.isArray(data)) return normalizeCreator(data[0])
  return normalizeCreator(data)
}

export async function updateCreator(id, { name, url, description, imageURL }) {
  const payload = {
    name: String(name ?? '').trim(),
    url: String(url ?? '').trim(),
    description: String(description ?? '').trim(),
    imageURL: String(imageURL ?? '').trim(),
  }

  if (!payload.name || !payload.url || !payload.description) {
    throw new Error('Please provide a name, url, and description.')
  }

  if (!payload.imageURL) delete payload.imageURL

  try {
    return await patchCreator(id, payload)
  } catch (e) {
    // If DB uses snake_case column `image_url`, retry once.
    if (payload.imageURL && isMissingImageUrlColumnMessage(e?.message)) {
      const { imageURL: img, ...rest } = payload
      return await patchCreator(id, { ...rest, image_url: img })
    }
    throw e
  }
}

export async function deleteCreator(id) {
  const res = await fetch(`${CREATORS_URL}?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: {
      ...baseHeaders(),
      Prefer: 'return=minimal',
    },
  })

  if (!res.ok) throw new Error(await readError(res))
}

import { API_URL } from './api.js'


export async function getProgressByClient(
  clientId,
  period = '',
  value = ''
) {
  const params = new URLSearchParams()

  if (period) {
    params.append('period', period)
  }

  if (value) {
    params.append('value', value)
  }

  let url =
    `${API_URL}/progress/${clientId}`

  const queryString = params.toString()

  if (queryString) {
    url += `?${queryString}`
  }

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      'Greška prilikom dohvaćanja napretka.'
    )
  }

  return response.json()
}


export async function getProgressYears(clientId) {
  const response = await fetch(
    `${API_URL}/progress/${clientId}/years`
  )

  if (!response.ok) {
    throw new Error(
      'Greška prilikom dohvaćanja godina.'
    )
  }

  return response.json()
}


export async function addProgress(
  clientId,
  progressData
) {
  const response = await fetch(
    `${API_URL}/progress/${clientId}`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(progressData)
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      'Podaci nisu ispravno uneseni.'
    )
  }

  return data
}


export async function updateProgress(
  id,
  progressData
) {
  const response = await fetch(
    `${API_URL}/progress/${id}`,
    {
      method: 'PATCH',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(progressData)
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message ||
      'Greška prilikom uređivanja napretka.'
    )
  }

  return data
}


export async function deleteProgressById(id) {
  const response = await fetch(
    `${API_URL}/progress/${id}`,
    {
      method: 'DELETE'
    }
  )

  if (!response.ok) {
    throw new Error(
      'Greška prilikom brisanja napretka.'
    )
  }
}
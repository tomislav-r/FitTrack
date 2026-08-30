export async function getProgressByClient(clientId, period = '') {
  let url = `http://localhost:3000/progress/${clientId}`

  if (period) {
    url += `?period=${period}`
  }

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Greška prilikom dohvaćanja napretka.')
  }

  return response.json()
}


export async function addProgress(clientId, progressData) {
  const response = await fetch(
    `http://localhost:3000/progress/${clientId}`,
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
    throw new Error('Podaci nisu ispravno uneseni.')
  }

  return data
}


export async function deleteProgressById(id) {
  const response = await fetch(
    `http://localhost:3000/progress/${id}`,
    {
      method: 'DELETE'
    }
  )

  if (!response.ok) {
    throw new Error('Greška prilikom brisanja napretka.')
  }
}
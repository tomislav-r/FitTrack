import { API_URL } from './api.js'


export async function getClientById(id) {
  const response = await fetch(
    `${API_URL}/clients/${id}`
  )

  if (!response.ok) {
    throw new Error(
      'Klijent nije pronađen.'
    )
  }

  return response.json()
}


export async function updateClient(
  id,
  clientData
) {
  const response = await fetch(
    `${API_URL}/clients/${id}`,
    {
      method: 'PATCH',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(clientData)
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      'Greška prilikom uređivanja klijenta.'
    )
  }

  return data
}
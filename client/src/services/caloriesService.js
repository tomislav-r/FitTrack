export async function getCaloriesByClient(clientId) {
  const response = await fetch(
    `http://localhost:3000/calories/${clientId}`
  )

  if (!response.ok) {
    throw new Error(
      'Greška prilikom dohvaćanja kalorijskih zapisa.'
    )
  }

  return response.json()
}


export async function addCalories(clientId, caloriesData) {
  const response = await fetch(
    `http://localhost:3000/calories/${clientId}`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(caloriesData)
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error('Podaci nisu ispravno uneseni.')
  }

  return data
}


export async function deleteCaloriesById(id) {
  const response = await fetch(
    `http://localhost:3000/calories/${id}`,
    {
      method: 'DELETE'
    }
  )

  if (!response.ok) {
    throw new Error(
      'Greška prilikom brisanja kalorijskog zapisa.'
    )
  }
}
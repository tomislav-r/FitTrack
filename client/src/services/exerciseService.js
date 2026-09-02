export async function getExercisesByClient(clientId) {
  const response = await fetch(
    `http://localhost:3000/exercises/${clientId}`
  )

  if (!response.ok) {
    throw new Error('Greška prilikom dohvaćanja vježbi.')
  }

  return response.json()
}


export async function addExercise(clientId, exerciseData) {
  const response = await fetch(
    `http://localhost:3000/exercises/${clientId}`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(exerciseData)
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error('Podaci nisu ispravno uneseni.')
  }

  return data
}


export async function deleteExerciseById(id) {
  const response = await fetch(
    `http://localhost:3000/exercises/${id}`,
    {
      method: 'DELETE'
    }
  )

  if (!response.ok) {
    throw new Error('Greška prilikom brisanja vježbe.')
  }
}

export async function updateExercise(id, exerciseData) {
  const response = await fetch(
    `http://localhost:3000/exercises/${id}`,
    {
      method: 'PATCH',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(exerciseData)
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message || 'Greška prilikom uređivanja vježbe.'
    )
  }

  return data
}
export async function getClientById(id) {
  const response = await fetch(
    `http://localhost:3000/clients/${id}`
  )

  if (!response.ok) {
    throw new Error('Klijent nije pronađen.')
  }

  return response.json()
}
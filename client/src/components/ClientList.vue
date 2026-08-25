<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['client-deleted'])

const clients = ref([])

async function getClients() {
  try {
    const response = await fetch('http://localhost:3000/clients')
    clients.value = await response.json()
  } catch (error) {
    console.error('Greška prilikom dohvaćanja klijenata:', error)
  }
}

async function deleteClient(id) {
  try {
    const response = await fetch(
      `http://localhost:3000/clients/${id}`,
      {
        method: 'DELETE'
      }
    )

    if (!response.ok) {
      console.error('Greška prilikom brisanja klijenta.')
      return
    }

    emit('client-deleted')

  } catch (error) {
    console.error('Greška prilikom povezivanja sa serverom:', error)
  }
}

onMounted(() => {
  getClients()
})
</script>

<template>
  <section class="mt-8">
    <h2 class="mb-4 text-2xl font-semibold">
      Klijenti
    </h2>

    <div class="grid gap-4">
        <article
        v-for="client in clients"
        :key="client._id"
        class="rounded-lg bg-white p-4 shadow"
        >
        <h3 class="text-lg font-bold">
            {{ client.firstName }} {{ client.lastName }}
        </h3>

        <p class="text-gray-600">
            {{ client.email }}
        </p>

        <button
            class="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            @click="deleteClient(client._id)"
        >
            Obriši
        </button>
        </article>
    </div>
  </section>
</template>
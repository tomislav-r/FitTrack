<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ProgressForm from '../components/ProgressForm.vue'

const route = useRoute()

const client = ref(null)
const progress = ref([])

const loading = ref(true)
const errorMessage = ref('')

async function getClient() {
  try {
    const response = await fetch(
      `http://localhost:3000/clients/${route.params.id}`
    )

    if (!response.ok) {
      errorMessage.value = 'Klijent nije pronađen.'
      return
    }

    client.value = await response.json()

  } catch (error) {
    console.error(error)
    errorMessage.value = 'Greška prilikom povezivanja sa serverom.'
  } finally {
    loading.value = false
  }
}

async function getProgress() {
  try {
    const response = await fetch(
      `http://localhost:3000/progress/${route.params.id}`
    )

    if (!response.ok) {
      console.error('Greška prilikom dohvaćanja napretka.')
      return
    }

    progress.value = await response.json()

  } catch (error) {
    console.error(
      'Greška prilikom povezivanja sa serverom:',
      error
    )
  }
}

onMounted(() => {
  getClient()
  getProgress()
})
</script>

<template>
  <main class="min-h-screen bg-gray-100 p-8">
    <div class="mx-auto max-w-4xl">

      <RouterLink
        to="/"
        class="mb-6 inline-block text-blue-600 hover:underline"
      >
        ← Natrag na klijente
      </RouterLink>

      <p v-if="loading">
        Učitavanje...
      </p>

      <p
        v-else-if="errorMessage"
        class="text-red-600"
      >
        {{ errorMessage }}
      </p>

      <section
        v-else-if="client"
        class="rounded-lg bg-white p-6 shadow"
      >
        <h1 class="text-3xl font-bold">
          {{ client.firstName }} {{ client.lastName }}
        </h1>

        <div class="mt-6 grid gap-3">
          <p>
            <strong>Email:</strong>
            {{ client.email }}
          </p>

          <p>
            <strong>Visina:</strong>
            {{ client.height || 'Nije unesena' }}
          </p>

          <p>
            <strong>Ciljana težina:</strong>
            {{ client.targetWeight || 'Nije unesena' }}
          </p>

          <p>
            <strong>Cilj:</strong>
            {{ client.goal || 'Nije unesen' }}
          </p>
        </div>
      </section>

      <ProgressForm
        v-if="client"
        :clientId="route.params.id"
        @progress-added="getProgress"
      />
      <!-- napredak klijenta -->
      <section
        v-if="client"
        class="mt-8 rounded-lg bg-white p-6 shadow"
      >
        <h2 class="mb-4 text-2xl font-bold">
          Napredak
        </h2>

        <p
          v-if="progress.length === 0"
          class="text-gray-500"
        >
          Klijent još nema zapisa napretka.
        </p>

        <div
          v-else
          class="grid gap-4"
        >
          <article
            v-for="entry in progress"
            :key="entry._id"
            class="rounded border border-gray-200 p-4"
          >
            <p>
              <strong>Datum:</strong>
              {{ new Date(entry.date).toLocaleDateString() }}
            </p>

            <p>
              <strong>Težina:</strong>
              {{ entry.weight }} kg
            </p>

            <p v-if="entry.waist">
              <strong>Struk:</strong>
              {{ entry.waist }} cm
            </p>

            <p v-if="entry.bodyFat">
              <strong>Body fat:</strong>
              {{ entry.bodyFat }}%
            </p>

            <p v-if="entry.notes">
              <strong>Bilješka:</strong>
              {{ entry.notes }}
            </p>
          </article>
        </div>
      </section>

    </div>
  </main>
</template>
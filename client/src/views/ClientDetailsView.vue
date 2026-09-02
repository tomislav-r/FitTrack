<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import ClientInfo from '../components/ClientInfo.vue'
import EditClientForm from '../components/EditClientForm.vue'

import ProgressForm from '../components/ProgressForm.vue'
import ProgressList from '../components/ProgressList.vue'
import EditProgressForm from '../components/EditProgressForm.vue'

import ExerciseForm from '../components/ExerciseForm.vue'
import ExerciseList from '../components/ExerciseList.vue'
import EditExerciseForm from '../components/EditExerciseForm.vue'

import CaloriesForm from '../components/CaloriesForm.vue'
import CaloriesList from '../components/CaloriesList.vue'
import EditCaloriesForm from '../components/EditCaloriesForm.vue'

import { getClientById } from '../services/clientService.js'

import {
  getProgressByClient,
  deleteProgressById
} from '../services/progressService.js'

import {
  getExercisesByClient,
  deleteExerciseById
} from '../services/exerciseService.js'

import {
  getCaloriesByClient,
  deleteCaloriesById
} from '../services/caloriesService.js'


const route = useRoute()

const client = ref(null)
const progress = ref([])
const exercises = ref([])
const calories = ref([])

const loading = ref(true)
const errorMessage = ref('')

const selectedPeriod = ref('')

const activeSection = ref('progress')

const editingClient = ref(false)
const editingProgress = ref(null)
const editingExercise = ref(null)
const editingCalories = ref(null)


async function getClient() {
  try {
    client.value = await getClientById(
      route.params.id
    )
  } catch (error) {
    console.error(error)
    errorMessage.value = error.message
  }
}


async function getProgress() {
  try {
    progress.value = await getProgressByClient(
      route.params.id,
      selectedPeriod.value
    )
  } catch (error) {
    console.error(error)
  }
}


async function getExercises() {
  try {
    exercises.value = await getExercisesByClient(
      route.params.id
    )
  } catch (error) {
    console.error(error)
  }
}


async function getCalories() {
  try {
    calories.value = await getCaloriesByClient(
      route.params.id
    )
  } catch (error) {
    console.error(error)
  }
}


async function changePeriod(period) {
  selectedPeriod.value = period

  await getProgress()
}


function changeSection(section) {
  activeSection.value = section

  editingProgress.value = null
  editingExercise.value = null
  editingCalories.value = null
}


async function deleteProgress(id) {
  const confirmed = confirm(
    'Želiš li obrisati ovaj zapis napretka?'
  )

  if (!confirmed) {
    return
  }

  try {
    await deleteProgressById(id)

    await getProgress()
  } catch (error) {
    console.error(error)
  }
}


async function deleteExercise(id) {
  const confirmed = confirm(
    'Želiš li obrisati ovu vježbu?'
  )

  if (!confirmed) {
    return
  }

  try {
    await deleteExerciseById(id)

    await getExercises()
  } catch (error) {
    console.error(error)
  }
}


async function deleteCalories(id) {
  const confirmed = confirm(
    'Želiš li obrisati ovaj kalorijski zapis?'
  )

  if (!confirmed) {
    return
  }

  try {
    await deleteCaloriesById(id)

    await getCalories()
  } catch (error) {
    console.error(error)
  }
}


async function handleClientUpdated() {
  await getClient()

  editingClient.value = false
}


async function handleProgressUpdated() {
  await getProgress()

  editingProgress.value = null
}


async function handleExerciseUpdated() {
  await getExercises()

  editingExercise.value = null
}


async function handleCaloriesUpdated() {
  await getCalories()

  editingCalories.value = null
}


async function loadClientData() {
  loading.value = true
  errorMessage.value = ''

  await Promise.all([
    getClient(),
    getProgress(),
    getExercises(),
    getCalories()
  ])

  loading.value = false
}


onMounted(() => {
  loadClientData()
})
</script>


<template>
  <main class="min-h-screen bg-gray-100 px-4 py-8">
    <div class="mx-auto max-w-7xl">

      <!-- POVRATAK -->
      <RouterLink
        to="/"
        class="mb-6 inline-block font-medium text-blue-600 hover:underline"
      >
        ← Natrag na klijente
      </RouterLink>


      <!-- LOADING -->
      <p
        v-if="loading"
        class="text-gray-600"
      >
        Učitavanje...
      </p>


      <!-- ERROR -->
      <p
        v-else-if="errorMessage"
        class="rounded-lg bg-red-100 p-4 text-red-700"
      >
        {{ errorMessage }}
      </p>


      <div v-else-if="client">

        <!-- PODACI KLIJENTA -->
        <ClientInfo
          :client="client"
          @edit-client="editingClient = true"
        />


        <!-- UREĐIVANJE KLIJENTA -->
        <EditClientForm
          v-if="editingClient"
          :client="client"
          @client-updated="handleClientUpdated"
          @cancel="editingClient = false"
        />


        <!-- TABOVI -->
        <div
          class="mt-8 flex flex-wrap gap-2 rounded-xl bg-white p-2 shadow"
        >
          <button
            class="rounded-lg px-5 py-3 font-semibold transition"
            :class="
              activeSection === 'progress'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            "
            @click="changeSection('progress')"
          >
            Napredak
          </button>

          <button
            class="rounded-lg px-5 py-3 font-semibold transition"
            :class="
              activeSection === 'exercises'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            "
            @click="changeSection('exercises')"
          >
            Vježbe
          </button>

          <button
            class="rounded-lg px-5 py-3 font-semibold transition"
            :class="
              activeSection === 'calories'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            "
            @click="changeSection('calories')"
          >
            Kalorije
          </button>
        </div>


        <!-- NAPREDAK -->
        <section
          v-if="activeSection === 'progress'"
          class="mt-6"
        >
          <div class="mb-5">
            <h2 class="text-2xl font-bold text-gray-900">
              Napredak
            </h2>

            <p class="mt-1 text-gray-500">
              Praćenje tjelesnih mjerenja klijenta.
            </p>
          </div>


          <div class="grid items-start gap-6 lg:grid-cols-2">

            <!-- LIJEVO -->
            <div>
              <ProgressList
                :progress="progress"
                :selected-period="selectedPeriod"
                @period-changed="changePeriod"
                @progress-deleted="deleteProgress"
                @progress-edit="editingProgress = $event"
              />
            </div>


            <!-- DESNO -->
            <div class="lg:sticky lg:top-6">

              <EditProgressForm
                v-if="editingProgress"
                :progress-entry="editingProgress"
                @progress-updated="handleProgressUpdated"
                @cancel="editingProgress = null"
              />

              <ProgressForm
                v-else
                :client-id="route.params.id"
                @progress-added="getProgress"
              />

            </div>

          </div>
        </section>


        <!-- VJEŽBE -->
        <section
          v-if="activeSection === 'exercises'"
          class="mt-6"
        >
          <div class="mb-5">
            <h2 class="text-2xl font-bold text-gray-900">
              Vježbe
            </h2>

            <p class="mt-1 text-gray-500">
              Evidencija treninga i rezultata klijenta.
            </p>
          </div>


          <div class="grid items-start gap-6 lg:grid-cols-2">

            <!-- LIJEVO -->
            <div>
              <ExerciseList
                :exercises="exercises"
                @exercise-deleted="deleteExercise"
                @exercise-edit="editingExercise = $event"
              />
            </div>


            <!-- DESNO -->
            <div class="lg:sticky lg:top-6">

              <EditExerciseForm
                v-if="editingExercise"
                :exercise="editingExercise"
                @exercise-updated="handleExerciseUpdated"
                @cancel="editingExercise = null"
              />

              <ExerciseForm
                v-else
                :client-id="route.params.id"
                @exercise-added="getExercises"
              />

            </div>

          </div>
        </section>


        <!-- KALORIJE -->
        <section
          v-if="activeSection === 'calories'"
          class="mt-6"
        >
          <div class="mb-5">
            <h2 class="text-2xl font-bold text-gray-900">
              Kalorije
            </h2>

            <p class="mt-1 text-gray-500">
              Praćenje kalorijskog cilja i dnevnog unosa.
            </p>
          </div>


          <div class="grid items-start gap-6 lg:grid-cols-2">

            <!-- LIJEVO -->
            <div>
              <CaloriesList
                :calories="calories"
                @calories-deleted="deleteCalories"
                @calories-edit="editingCalories = $event"
              />
            </div>


            <!-- DESNO -->
            <div class="lg:sticky lg:top-6">

              <EditCaloriesForm
                v-if="editingCalories"
                :calories-entry="editingCalories"
                @calories-updated="handleCaloriesUpdated"
                @cancel="editingCalories = null"
              />

              <CaloriesForm
                v-else
                :client-id="route.params.id"
                @calories-added="getCalories"
              />

            </div>

          </div>
        </section>

      </div>
    </div>
  </main>
</template>
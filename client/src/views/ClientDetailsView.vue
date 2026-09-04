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
  getProgressYears,
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
const progressYears = ref([])

const exercises = ref([])
const calories = ref([])

const loading = ref(true)
const errorMessage = ref('')

const selectedPeriod = ref('')
const selectedFilterValue = ref('')

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
      selectedPeriod.value,
      selectedFilterValue.value
    )

  } catch (error) {
    console.error(error)
  }
}


async function getAvailableProgressYears() {
  try {
    progressYears.value = await getProgressYears(
      route.params.id
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


async function changeProgressFilter(filter) {
  selectedPeriod.value = filter.period
  selectedFilterValue.value = filter.value

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
    await getAvailableProgressYears()

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


async function handleProgressAdded() {
  await getProgress()
  await getAvailableProgressYears()
}


async function handleProgressUpdated() {
  await getProgress()
  await getAvailableProgressYears()

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
    getAvailableProgressYears(),
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
  <main class="min-h-dvh bg-[#0b0f17] px-4 py-8 text-white">

    <div class="mx-auto max-w-7xl">

      <!-- POVRATAK -->
      <RouterLink
        to="/"
        class="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-white"
      >
        <span>←</span>
        <span>Natrag na klijente</span>
      </RouterLink>


      <!-- LOADING -->
      <div
        v-if="loading"
        class="rounded-2xl border border-[#2b2d30] bg-[#191a1c] p-6"
      >
        <p class="text-sm font-medium text-gray-400">
          Učitavanje podataka...
        </p>
      </div>


      <!-- ERROR -->
      <div
        v-else-if="errorMessage"
        class="rounded-2xl border border-red-900/50 bg-red-950/40 p-5"
      >
        <p class="font-semibold text-red-400">
          {{ errorMessage }}
        </p>
      </div>


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
        <div class="mt-8">

          <div
            class="inline-flex flex-wrap rounded-2xl border border-[#2b2d30] bg-[#191a1c] p-1.5"
          >

            <button
              class="rounded-xl px-5 py-2.5 text-sm font-semibold transition"
              :class="
                activeSection === 'progress'
                  ? 'bg-[#303236] text-white'
                  : 'text-gray-500 hover:bg-[#242628] hover:text-gray-200'
              "
              @click="changeSection('progress')"
            >
              Napredak
            </button>


            <button
              class="rounded-xl px-5 py-2.5 text-sm font-semibold transition"
              :class="
                activeSection === 'exercises'
                  ? 'bg-[#303236] text-white'
                  : 'text-gray-500 hover:bg-[#242628] hover:text-gray-200'
              "
              @click="changeSection('exercises')"
            >
              Vježbe
            </button>


            <button
              class="rounded-xl px-5 py-2.5 text-sm font-semibold transition"
              :class="
                activeSection === 'calories'
                  ? 'bg-[#303236] text-white'
                  : 'text-gray-500 hover:bg-[#242628] hover:text-gray-200'
              "
              @click="changeSection('calories')"
            >
              Kalorije
            </button>

          </div>

        </div>


        <!-- NAPREDAK -->
        <section
          v-if="activeSection === 'progress'"
          class="mt-8"
        >

          <div class="mb-6">

            <p
              class="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Mjerenja
            </p>

            <h2 class="text-3xl font-bold tracking-tight text-white">
              Napredak
            </h2>

            <p class="mt-1 text-sm text-gray-400">
              Praćenje tjelesnih mjerenja klijenta.
            </p>

          </div>


          <div class="grid items-start gap-6 lg:grid-cols-2">

            <!-- LIJEVO -->
            <div>

              <ProgressList
                :progress="progress"
                :years="progressYears"
                :selected-period="selectedPeriod"
                :selected-filter-value="selectedFilterValue"
                @filter-changed="changeProgressFilter"
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
                @progress-added="handleProgressAdded"
              />

            </div>

          </div>

        </section>


        <!-- VJEŽBE -->
        <section
          v-if="activeSection === 'exercises'"
          class="mt-8"
        >

          <div class="mb-6">

            <p
              class="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Trening
            </p>

            <h2 class="text-3xl font-bold tracking-tight text-white">
              Vježbe
            </h2>

            <p class="mt-1 text-sm text-gray-400">
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
          class="mt-8"
        >

          <div class="mb-6">

            <p
              class="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Prehrana
            </p>

            <h2 class="text-3xl font-bold tracking-tight text-white">
              Kalorije
            </h2>

            <p class="mt-1 text-sm text-gray-400">
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
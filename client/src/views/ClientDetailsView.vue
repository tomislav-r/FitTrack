<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import ClientInfo from '../components/ClientInfo.vue'
import ProgressForm from '../components/ProgressForm.vue'
import ProgressList from '../components/ProgressList.vue'
import ExerciseForm from '../components/ExerciseForm.vue'
import ExerciseList from '../components/ExerciseList.vue'
import CaloriesForm from '../components/CaloriesForm.vue'
import CaloriesList from '../components/CaloriesList.vue'

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
    <div class="mx-auto max-w-5xl">

      <RouterLink
        to="/"
        class="mb-6 inline-block font-medium text-blue-600 hover:underline"
      >
        ← Natrag na klijente
      </RouterLink>


      <p
        v-if="loading"
        class="text-gray-600"
      >
        Učitavanje...
      </p>


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
        />


        <!-- DODAVANJE NAPRETKA -->
        <ProgressForm
          :client-id="route.params.id"
          @progress-added="getProgress"
        />


        <!-- PRIKAZ NAPRETKA -->
        <ProgressList
          :progress="progress"
          :selected-period="selectedPeriod"
          @period-changed="changePeriod"
          @progress-deleted="deleteProgress"
        />


        <!-- DODAVANJE VJEŽBE -->
        <ExerciseForm
          :client-id="route.params.id"
          @exercise-added="getExercises"
        />


        <!-- PRIKAZ VJEŽBI -->
        <ExerciseList
          :exercises="exercises"
          @exercise-deleted="deleteExercise"
        />


        <!-- DODAVANJE KALORIJSKOG ZAPISA -->
        <CaloriesForm
          :client-id="route.params.id"
          @calories-added="getCalories"
        />


        <!-- PRIKAZ KALORIJSKIH ZAPISA -->
        <CaloriesList
          :calories="calories"
          @calories-deleted="deleteCalories"
        />

      </div>
    </div>
  </main>
</template>
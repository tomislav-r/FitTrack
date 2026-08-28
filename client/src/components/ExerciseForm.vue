<script setup>
import { ref } from 'vue'

const props = defineProps({
  clientId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['exercise-added'])

const exerciseName = ref('')
const date = ref('')
const sets = ref('')
const reps = ref('')
const weight = ref('')
const notes = ref('')

const message = ref('')
const errorMessage = ref('')

async function addExercise() {
  message.value = ''
  errorMessage.value = ''

  try {
    const response = await fetch(
      `http://localhost:3000/exercises/${props.clientId}`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          exerciseName: exerciseName.value,
          date: date.value,
          sets: Number(sets.value),
          reps: Number(reps.value),
          weight: weight.value ? Number(weight.value) : undefined,
          notes: notes.value
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      errorMessage.value = 'Podaci nisu ispravno uneseni.'
      console.log(data)
      return
    }

    message.value = 'Vježba je uspješno dodana.'

    emit('exercise-added')

    exerciseName.value = ''
    date.value = ''
    sets.value = ''
    reps.value = ''
    weight.value = ''
    notes.value = ''

  } catch (error) {
    console.error(error)

    errorMessage.value = 'Greška prilikom povezivanja sa serverom.'
  }
}
</script>

<template>
  <section class="mt-8 rounded-lg bg-white p-6 shadow">
    <h2 class="mb-4 text-2xl font-bold">
      Dodaj vježbu
    </h2>

    <form
      class="grid gap-4"
      @submit.prevent="addExercise"
    >
      <input
        v-model="exerciseName"
        type="text"
        placeholder="Naziv vježbe"
        class="rounded border border-gray-300 p-3"
      >

      <input
        v-model="date"
        type="date"
        class="rounded border border-gray-300 p-3"
      >

      <input
        v-model="sets"
        type="number"
        min="1"
        placeholder="Broj serija"
        class="rounded border border-gray-300 p-3"
      >

      <input
        v-model="reps"
        type="number"
        min="1"
        placeholder="Broj ponavljanja"
        class="rounded border border-gray-300 p-3"
      >

      <input
        v-model="weight"
        type="number"
        min="0"
        step="0.1"
        placeholder="Težina (kg)"
        class="rounded border border-gray-300 p-3"
      >

      <textarea
        v-model="notes"
        placeholder="Bilješka"
        class="rounded border border-gray-300 p-3"
      ></textarea>

      <button
        type="submit"
        class="rounded bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
      >
        Dodaj vježbu
      </button>
    </form>

    <p
      v-if="message"
      class="mt-4 text-green-600"
    >
      {{ message }}
    </p>

    <p
      v-if="errorMessage"
      class="mt-4 text-red-600"
    >
      {{ errorMessage }}
    </p>
  </section>
</template>
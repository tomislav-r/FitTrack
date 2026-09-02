<script setup>
import { ref } from 'vue'
import { updateExercise } from '../services/exerciseService.js'

const props = defineProps({
  exercise: {
    type: Object,
    required: true
  }
})

const emit = defineEmits([
  'exercise-updated',
  'cancel'
])

const exerciseName = ref(props.exercise.exerciseName || '')

const date = ref(
  props.exercise.date
    ? props.exercise.date.substring(0, 10)
    : ''
)

const sets = ref(props.exercise.sets ?? '')
const reps = ref(props.exercise.reps ?? '')
const weight = ref(props.exercise.weight ?? '')
const notes = ref(props.exercise.notes || '')

const errorMessage = ref('')


async function submitExerciseUpdate() {
  errorMessage.value = ''

  const exerciseData = {
    exerciseName: exerciseName.value,
    date: date.value,
    sets: Number(sets.value),
    reps: Number(reps.value),

    weight: weight.value === ''
      ? null
      : Number(weight.value),

    notes: notes.value
  }

  try {
    await updateExercise(
      props.exercise._id,
      exerciseData
    )

    emit('exercise-updated')

  } catch (error) {
    console.error(error)
    errorMessage.value = error.message
  }
}
</script>

<template>
  <section class="mt-4 rounded-lg bg-gray-50 p-4">
    <h3 class="mb-4 text-lg font-bold">
      Uredi vježbu
    </h3>

    <form
      class="grid gap-3"
      @submit.prevent="submitExerciseUpdate"
    >
      <input
        v-model="exerciseName"
        type="text"
        placeholder="Naziv vježbe"
        class="rounded border border-gray-300 p-3"
        required
      >

      <input
        v-model="date"
        type="date"
        class="rounded border border-gray-300 p-3"
        required
      >

      <input
        v-model="sets"
        type="number"
        min="1"
        placeholder="Broj serija"
        class="rounded border border-gray-300 p-3"
        required
      >

      <input
        v-model="reps"
        type="number"
        min="1"
        placeholder="Broj ponavljanja"
        class="rounded border border-gray-300 p-3"
        required
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

      <div class="flex gap-2">
        <button
          type="submit"
          class="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Spremi
        </button>

        <button
          type="button"
          class="rounded bg-gray-200 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-300"
          @click="emit('cancel')"
        >
          Odustani
        </button>
      </div>
    </form>

    <p
      v-if="errorMessage"
      class="mt-3 text-red-600"
    >
      {{ errorMessage }}
    </p>
  </section>
</template>
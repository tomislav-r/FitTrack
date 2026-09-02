<script setup>
import { ref } from 'vue'
import { updateProgress } from '../services/progressService.js'

const props = defineProps({
  progressEntry: {
    type: Object,
    required: true
  }
})

const emit = defineEmits([
  'progress-updated',
  'cancel'
])

const date = ref(
  props.progressEntry.date
    ? props.progressEntry.date.substring(0, 10)
    : ''
)

const weight = ref(props.progressEntry.weight ?? '')
const waist = ref(props.progressEntry.waist ?? '')
const bodyFat = ref(props.progressEntry.bodyFat ?? '')
const notes = ref(props.progressEntry.notes || '')

const errorMessage = ref('')


async function submitProgressUpdate() {
  errorMessage.value = ''

  const progressData = {
    date: date.value,

    weight: Number(weight.value),

    waist: waist.value === ''
      ? null
      : Number(waist.value),

    bodyFat: bodyFat.value === ''
      ? null
      : Number(bodyFat.value),

    notes: notes.value
  }

  try {
    await updateProgress(
      props.progressEntry._id,
      progressData
    )

    emit('progress-updated')

  } catch (error) {
    console.error(error)
    errorMessage.value = error.message
  }
}
</script>

<template>
  <section class="mt-4 rounded-lg bg-gray-50 p-4">
    <h3 class="mb-4 text-lg font-bold">
      Uredi napredak
    </h3>

    <form
      class="grid gap-3"
      @submit.prevent="submitProgressUpdate"
    >
      <input
        v-model="date"
        type="date"
        class="rounded border border-gray-300 p-3"
        required
      >

      <input
        v-model="weight"
        type="number"
        step="0.1"
        placeholder="Težina"
        class="rounded border border-gray-300 p-3"
        required
      >

      <input
        v-model="waist"
        type="number"
        step="0.1"
        placeholder="Struk"
        class="rounded border border-gray-300 p-3"
      >

      <input
        v-model="bodyFat"
        type="number"
        step="0.1"
        placeholder="Body fat"
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
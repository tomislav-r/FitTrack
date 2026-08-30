<script setup>
import { ref } from 'vue'
import { addCalories } from '../services/caloriesService.js'

const props = defineProps({
  clientId: {
    type: String,
    required: true
  }
})

const emit = defineEmits([
  'calories-added'
])

const date = ref('')
const calorieTarget = ref('')
const caloriesConsumed = ref('')
const notes = ref('')

const message = ref('')
const errorMessage = ref('')


async function submitCalories() {
  message.value = ''
  errorMessage.value = ''

  const caloriesData = {
    date: date.value,
    calorieTarget: Number(calorieTarget.value),
    caloriesConsumed: Number(caloriesConsumed.value),
    notes: notes.value
  }

  try {
    await addCalories(
      props.clientId,
      caloriesData
    )

    message.value =
      'Kalorijski zapis je uspješno dodan.'

    emit('calories-added')

    date.value = ''
    calorieTarget.value = ''
    caloriesConsumed.value = ''
    notes.value = ''

  } catch (error) {
    console.error(error)

    errorMessage.value = error.message
  }
}
</script>

<template>
  <section class="mt-8 rounded-lg bg-white p-6 shadow">
    <h2 class="mb-4 text-2xl font-bold">
      Dodaj kalorijski zapis
    </h2>

    <form
      class="grid gap-4"
      @submit.prevent="submitCalories"
    >
      <input
        v-model="date"
        type="date"
        class="rounded border border-gray-300 p-3"
      >

      <input
        v-model="calorieTarget"
        type="number"
        min="1"
        placeholder="Kalorijski cilj"
        class="rounded border border-gray-300 p-3"
      >

      <input
        v-model="caloriesConsumed"
        type="number"
        min="0"
        placeholder="Unesene kalorije"
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
        Dodaj kalorijski zapis
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
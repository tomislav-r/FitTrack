<script setup>
import { ref } from 'vue'

const props = defineProps({
  clientId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['progress-added'])

const date = ref('')
const weight = ref('')
const waist = ref('')
const bodyFat = ref('')
const notes = ref('')

const message = ref('')
const errorMessage = ref('')

async function addProgress() {
  message.value = ''
  errorMessage.value = ''

  try {
    const response = await fetch(
      `http://localhost:3000/progress/${props.clientId}`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          date: date.value,
          weight: Number(weight.value),
          waist: waist.value ? Number(waist.value) : undefined,
          bodyFat: bodyFat.value ? Number(bodyFat.value) : undefined,
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

    message.value = 'Napredak je uspješno dodan.'

    emit('progress-added')

    date.value = ''
    weight.value = ''
    waist.value = ''
    bodyFat.value = ''
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
      Dodaj napredak
    </h2>

    <form
      class="grid gap-4"
      @submit.prevent="addProgress"
    >
      <input
        v-model="date"
        type="date"
        class="rounded border border-gray-300 p-3"
      >

      <input
        v-model="weight"
        type="number"
        step="0.1"
        placeholder="Težina (kg)"
        class="rounded border border-gray-300 p-3"
      >

      <input
        v-model="waist"
        type="number"
        step="0.1"
        placeholder="Struk (cm)"
        class="rounded border border-gray-300 p-3"
      >

      <input
        v-model="bodyFat"
        type="number"
        step="0.1"
        placeholder="Body fat (%)"
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
        Dodaj napredak
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
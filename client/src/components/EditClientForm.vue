<script setup>
import { ref } from 'vue'
import { updateClient } from '../services/clientService.js'

const props = defineProps({
  client: {
    type: Object,
    required: true
  }
})

const emit = defineEmits([
  'client-updated',
  'cancel'
])

const firstName = ref(props.client.firstName || '')
const lastName = ref(props.client.lastName || '')
const email = ref(props.client.email || '')
const height = ref(props.client.height ?? '')
const targetWeight = ref(props.client.targetWeight ?? '')
const goal = ref(props.client.goal || '')

const errorMessage = ref('')


async function submitClientUpdate() {
  errorMessage.value = ''

  const clientData = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    height: height.value === ''
      ? null
      : Number(height.value),
    targetWeight: targetWeight.value === ''
      ? null
      : Number(targetWeight.value),
    goal: goal.value
  }

  try {
    await updateClient(
      props.client._id,
      clientData
    )

    emit('client-updated')

  } catch (error) {
    console.error(error)
    errorMessage.value = error.message
  }
}
</script>

<template>
  <section class="mt-6 rounded-xl bg-white p-6 shadow">
    <h2 class="mb-4 text-2xl font-bold text-gray-900">
      Uredi podatke klijenta
    </h2>

    <form
      class="grid gap-4 sm:grid-cols-2"
      @submit.prevent="submitClientUpdate"
    >
      <input
        v-model="firstName"
        type="text"
        placeholder="Ime"
        class="rounded border border-gray-300 p-3"
        required
      >

      <input
        v-model="lastName"
        type="text"
        placeholder="Prezime"
        class="rounded border border-gray-300 p-3"
        required
      >

      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="rounded border border-gray-300 p-3"
        required
      >

      <input
        v-model="height"
        type="number"
        min="1"
        step="0.1"
        placeholder="Visina (cm)"
        class="rounded border border-gray-300 p-3"
      >

      <input
        v-model="targetWeight"
        type="number"
        min="1"
        step="0.1"
        placeholder="Ciljana težina (kg)"
        class="rounded border border-gray-300 p-3"
      >

      <textarea
        v-model="goal"
        placeholder="Cilj"
        class="rounded border border-gray-300 p-3 sm:col-span-2"
      ></textarea>

      <div class="flex gap-3 sm:col-span-2">
        <button
          type="submit"
          class="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Spremi promjene
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
      class="mt-4 text-red-600"
    >
      {{ errorMessage }}
    </p>
  </section>
</template>

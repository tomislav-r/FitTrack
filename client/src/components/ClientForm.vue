<script setup>
import { ref } from 'vue'

const emit = defineEmits(['client-added'])

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const height = ref('')
const targetWeight = ref('')
const goal = ref('')

const message = ref('')
const errorMessage = ref('')

async function addClient() {
  message.value = ''
  errorMessage.value = ''

  try {
    const response = await fetch('http://localhost:3000/clients', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        height: height.value ? Number(height.value) : undefined,
        targetWeight: targetWeight.value
          ? Number(targetWeight.value)
          : undefined,
        goal: goal.value
      })
    })

    const data = await response.json()

    if (!response.ok) {
      errorMessage.value = 'Podaci nisu ispravno uneseni.'
      console.log(data)
      return
    }

    message.value = 'Klijent je uspješno dodan.'
    emit('client-added')

    firstName.value = ''
    lastName.value = ''
    email.value = ''
    height.value = ''
    targetWeight.value = ''
    goal.value = ''

  } catch (error) {
    console.error(error)
    errorMessage.value = 'Greška prilikom povezivanja sa serverom.'
  }
}
</script>

<template>
  <section class="mt-8 rounded-lg bg-white p-6 shadow">
    <h2 class="mb-4 text-2xl font-semibold">
      Dodaj klijenta
    </h2>

    <form
      class="grid gap-4"
      @submit.prevent="addClient"
    >
      <input
        v-model="firstName"
        type="text"
        placeholder="Ime"
        class="rounded border border-gray-300 p-3"
      >

      <input
        v-model="lastName"
        type="text"
        placeholder="Prezime"
        class="rounded border border-gray-300 p-3"
      >

      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="rounded border border-gray-300 p-3"
      >

      <input
        v-model="height"
        type="number"
        placeholder="Visina (cm)"
        class="rounded border border-gray-300 p-3"
      >

      <input
        v-model="targetWeight"
        type="number"
        step="0.1"
        placeholder="Ciljana težina (kg)"
        class="rounded border border-gray-300 p-3"
      >

      <textarea
        v-model="goal"
        placeholder="Cilj klijenta"
        class="rounded border border-gray-300 p-3"
      ></textarea>

      <button
        type="submit"
        class="rounded bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
      >
        Dodaj klijenta
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
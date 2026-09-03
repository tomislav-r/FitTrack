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
  <section
    class="mt-6 rounded-3xl border border-[#2b2d30] bg-[#191a1c] p-6"
  >
    <!-- HEADER -->
    <div class="mb-6">
      <p
        class="text-xs font-semibold uppercase tracking-wider text-gray-500"
      >
        Profil klijenta
      </p>

      <h2 class="mt-1 text-xl font-bold text-white">
        Uredi podatke
      </h2>

      <p class="mt-1 text-sm text-gray-500">
        Promijeni osnovne podatke i cilj klijenta.
      </p>
    </div>


    <form
      class="space-y-5"
      @submit.prevent="submitClientUpdate"
    >

      <!-- IME I PREZIME -->
      <div class="grid gap-4 sm:grid-cols-2">

        <div>
          <label
            class="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Ime
          </label>

          <input
            v-model="firstName"
            type="text"
            required
            placeholder="Ime"
            class="w-full rounded-xl border border-[#35373a] bg-[#141516] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-[#5c74ff]"
          >
        </div>


        <div>
          <label
            class="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Prezime
          </label>

          <input
            v-model="lastName"
            type="text"
            required
            placeholder="Prezime"
            class="w-full rounded-xl border border-[#35373a] bg-[#141516] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-[#5c74ff]"
          >
        </div>

      </div>


      <!-- EMAIL -->
      <div>
        <label
          class="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
        >
          Email
        </label>

        <input
          v-model="email"
          type="email"
          required
          placeholder="ime@email.com"
          class="w-full rounded-xl border border-[#35373a] bg-[#141516] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-[#5c74ff]"
        >
      </div>


      <!-- VISINA + TEŽINA -->
      <div class="grid gap-4 sm:grid-cols-2">

        <div>
          <label
            class="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Visina
          </label>

          <div class="relative">
            <input
              v-model="height"
              type="number"
              min="1"
              step="0.1"
              placeholder="180"
              class="w-full rounded-xl border border-[#35373a] bg-[#141516] px-4 py-3 pr-12 text-white outline-none transition placeholder:text-gray-600 focus:border-[#5c74ff]"
            >

            <span
              class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500"
            >
              cm
            </span>
          </div>
        </div>


        <div>
          <label
            class="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Ciljana težina
          </label>

          <div class="relative">
            <input
              v-model="targetWeight"
              type="number"
              min="1"
              step="0.1"
              placeholder="80"
              class="w-full rounded-xl border border-[#35373a] bg-[#141516] px-4 py-3 pr-12 text-white outline-none transition placeholder:text-gray-600 focus:border-[#5c74ff]"
            >

            <span
              class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500"
            >
              kg
            </span>
          </div>
        </div>

      </div>


      <!-- CILJ -->
      <div>
        <label
          class="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
        >
          Cilj
        </label>

        <textarea
          v-model="goal"
          rows="3"
          placeholder="npr. Smanjiti tjelesnu težinu..."
          class="w-full resize-none rounded-xl border border-[#35373a] bg-[#141516] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-[#5c74ff]"
        ></textarea>
      </div>


      <!-- BUTTONI -->
      <div class="grid gap-3 sm:grid-cols-2">

        <button
          type="submit"
          class="rounded-xl bg-[#5065e8] px-4 py-3 font-semibold text-white transition hover:bg-[#6074f0]"
        >
          Spremi promjene
        </button>


        <button
          type="button"
          class="rounded-xl border border-[#35373a] bg-[#242628] px-4 py-3 font-semibold text-gray-300 transition hover:bg-[#303236]"
          @click="emit('cancel')"
        >
          Odustani
        </button>

      </div>

    </form>


    <!-- ERROR -->
    <p
      v-if="errorMessage"
      class="mt-4 rounded-xl bg-red-950/40 px-4 py-3 text-sm font-medium text-red-400"
    >
      {{ errorMessage }}
    </p>

  </section>
</template>
<script setup>
import { ref } from 'vue'
import { API_URL } from '../services/api.js'

const emit = defineEmits([
  'client-added'
])

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
    const response = await fetch(
      `${API_URL}/clients`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,

          height: height.value
            ? Number(height.value)
            : undefined,

          targetWeight: targetWeight.value
            ? Number(targetWeight.value)
            : undefined,

          goal: goal.value
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      errorMessage.value =
        'Podaci nisu ispravno uneseni.'

      console.log(data)
      return
    }

    message.value =
      'Klijent je uspješno dodan.'

    emit('client-added')

    firstName.value = ''
    lastName.value = ''
    email.value = ''
    height.value = ''
    targetWeight.value = ''
    goal.value = ''

  } catch (error) {
    console.error(error)

    errorMessage.value =
      'Greška prilikom povezivanja sa serverom.'
  }
}
</script>


<template>
  <section
    class="rounded-3xl border border-[#2b2d30] bg-[#191a1c] p-6"
  >

    <!-- HEADER -->
    <div class="mb-6">

      <p
        class="text-xs font-semibold uppercase tracking-wider text-gray-500"
      >
        Novi profil
      </p>

      <h2 class="mt-1 text-xl font-bold text-white">
        Dodaj klijenta
      </h2>

      <p class="mt-1 text-sm text-gray-500">
        Unesi osnovne podatke novog klijenta.
      </p>

    </div>


    <form
      class="space-y-4"
      @submit.prevent="addClient"
    >

      <!-- IME I PREZIME -->
      <div class="grid grid-cols-2 gap-3">

        <div>
          <label
            class="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Ime
          </label>

          <input
            v-model="firstName"
            type="text"
            placeholder="Ime"
            required
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
            placeholder="Prezime"
            required
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
          placeholder="klijent@email.com"
          required
          class="w-full rounded-xl border border-[#35373a] bg-[#141516] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-[#5c74ff]"
        >
      </div>


      <!-- VISINA -->
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


      <!-- CILJANA TEŽINA -->
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
          placeholder="npr. Održavanje tjelesne težine..."
          class="w-full resize-none rounded-xl border border-[#35373a] bg-[#141516] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-[#5c74ff]"
        ></textarea>
      </div>


      <!-- BUTTON -->
      <button
        type="submit"
        class="w-full rounded-xl bg-[#5065e8] px-4 py-3 font-semibold text-white transition hover:bg-[#6074f0]"
      >
        Dodaj klijenta
      </button>

    </form>


    <!-- SUCCESS -->
    <p
      v-if="message"
      class="mt-4 rounded-xl bg-emerald-950/40 px-4 py-3 text-sm font-medium text-emerald-400"
    >
      {{ message }}
    </p>


    <!-- ERROR -->
    <p
      v-if="errorMessage"
      class="mt-4 rounded-xl bg-red-950/40 px-4 py-3 text-sm font-medium text-red-400"
    >
      {{ errorMessage }}
    </p>

  </section>
</template>
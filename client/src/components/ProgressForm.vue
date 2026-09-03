<script setup>
import { ref } from 'vue'
import { addProgress } from '../services/progressService.js'

const props = defineProps({
  clientId: {
    type: String,
    required: true
  }
})

const emit = defineEmits([
  'progress-added'
])

const date = ref('')
const weight = ref('')
const waist = ref('')
const bodyFat = ref('')
const notes = ref('')

const message = ref('')
const errorMessage = ref('')


async function submitProgress() {
  message.value = ''
  errorMessage.value = ''

  const progressData = {
    date: date.value,
    weight: Number(weight.value),

    waist: waist.value
      ? Number(waist.value)
      : undefined,

    bodyFat: bodyFat.value
      ? Number(bodyFat.value)
      : undefined,

    notes: notes.value
  }

  try {
    await addProgress(
      props.clientId,
      progressData
    )

    message.value =
      'Napredak je uspješno dodan.'

    emit('progress-added')

    date.value = ''
    weight.value = ''
    waist.value = ''
    bodyFat.value = ''
    notes.value = ''

  } catch (error) {
    console.error(error)
    errorMessage.value = error.message
  }
}
</script>


<template>
  <section
    class="rounded-3xl border border-[#2b2d30] bg-[#191a1c] p-6"
  >
    <div class="mb-6">
      <p
        class="text-xs font-semibold uppercase tracking-wider text-gray-500"
      >
        Novo mjerenje
      </p>

      <h3 class="mt-1 text-xl font-bold text-white">
        Dodaj napredak
      </h3>

      <p class="mt-1 text-sm text-gray-500">
        Zabilježi nova tjelesna mjerenja klijenta.
      </p>
    </div>


    <form
      class="space-y-4"
      @submit.prevent="submitProgress"
    >

      <!-- DATUM -->
      <div>
        <label
          class="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
        >
          Datum
        </label>

        <input
          v-model="date"
          type="date"
          required
          class="w-full rounded-xl border border-[#35373a] bg-[#141516] px-4 py-3 text-white outline-none transition focus:border-[#5c74ff]"
        >
      </div>


      <!-- TEŽINA -->
      <div>
        <label
          class="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
        >
          Težina
        </label>

        <div class="relative">
          <input
            v-model="weight"
            type="number"
            min="0.1"
            step="0.1"
            placeholder="80.5"
            required
            class="w-full rounded-xl border border-[#35373a] bg-[#141516] px-4 py-3 pr-12 text-white outline-none transition placeholder:text-gray-600 focus:border-[#5c74ff]"
          >

          <span
            class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500"
          >
            kg
          </span>
        </div>
      </div>


      <!-- STRUK + BODY FAT -->
      <div class="grid grid-cols-2 gap-3">

        <div>
          <label
            class="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Struk
          </label>

          <div class="relative">
            <input
              v-model="waist"
              type="number"
              min="0.1"
              step="0.1"
              placeholder="90"
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
            Body fat
          </label>

          <div class="relative">
            <input
              v-model="bodyFat"
              type="number"
              min="0"
              max="100"
              step="0.1"
              placeholder="15"
              class="w-full rounded-xl border border-[#35373a] bg-[#141516] px-4 py-3 pr-10 text-white outline-none transition placeholder:text-gray-600 focus:border-[#5c74ff]"
            >

            <span
              class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500"
            >
              %
            </span>
          </div>
        </div>

      </div>


      <!-- BILJEŠKA -->
      <div>
        <label
          class="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
        >
          Bilješka
        </label>

        <textarea
          v-model="notes"
          rows="3"
          placeholder="Opcionalna bilješka..."
          class="w-full resize-none rounded-xl border border-[#35373a] bg-[#141516] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-[#5c74ff]"
        ></textarea>
      </div>


      <button
        type="submit"
        class="w-full rounded-xl bg-[#5065e8] px-4 py-3 font-semibold text-white transition hover:bg-[#6074f0]"
      >
        Dodaj napredak
      </button>

    </form>


    <p
      v-if="message"
      class="mt-4 rounded-xl bg-emerald-950/40 px-4 py-3 text-sm font-medium text-emerald-400"
    >
      {{ message }}
    </p>


    <p
      v-if="errorMessage"
      class="mt-4 rounded-xl bg-red-950/40 px-4 py-3 text-sm font-medium text-red-400"
    >
      {{ errorMessage }}
    </p>

  </section>
</template>
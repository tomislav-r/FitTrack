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
  <section
    class="rounded-3xl border border-[#2b2d30] bg-[#191a1c] p-6"
  >

    <!-- HEADER -->
    <div class="mb-6">

      <p
        class="text-xs font-semibold uppercase tracking-wider text-gray-500"
      >
        Novi unos
      </p>

      <h3 class="mt-1 text-xl font-bold text-white">
        Dodaj kalorije
      </h3>

      <p class="mt-1 text-sm text-gray-500">
        Zabilježi dnevni kalorijski unos klijenta.
      </p>

    </div>


    <form
      class="space-y-4"
      @submit.prevent="submitCalories"
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


      <!-- CILJ + UNOS -->
      <div class="grid grid-cols-2 gap-3">

        <div>

          <label
            class="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Kalorijski cilj
          </label>

          <div class="relative">

            <input
              v-model="calorieTarget"
              type="number"
              min="1"
              placeholder="2500"
              required
              class="w-full rounded-xl border border-[#35373a] bg-[#141516] px-4 py-3 pr-14 text-white outline-none transition placeholder:text-gray-600 focus:border-[#5c74ff]"
            >

            <span
              class="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500"
            >
              kcal
            </span>

          </div>

        </div>


        <div>

          <label
            class="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Uneseno
          </label>

          <div class="relative">

            <input
              v-model="caloriesConsumed"
              type="number"
              min="0"
              placeholder="2400"
              required
              class="w-full rounded-xl border border-[#35373a] bg-[#141516] px-4 py-3 pr-14 text-white outline-none transition placeholder:text-gray-600 focus:border-[#5c74ff]"
            >

            <span
              class="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500"
            >
              kcal
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


      <!-- BUTTON -->
      <button
        type="submit"
        class="w-full rounded-xl bg-[#5065e8] px-4 py-3 font-semibold text-white transition hover:bg-[#6074f0]"
      >
        Dodaj kalorijski zapis
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
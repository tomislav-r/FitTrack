<script setup>
import { ref } from 'vue'
import { addExercise } from '../services/exerciseService.js'

const props = defineProps({
  clientId: {
    type: String,
    required: true
  }
})

const emit = defineEmits([
  'exercise-added'
])

const exerciseName = ref('')
const date = ref('')
const sets = ref('')
const reps = ref('')
const weight = ref('')
const notes = ref('')

const message = ref('')
const errorMessage = ref('')


async function submitExercise() {
  message.value = ''
  errorMessage.value = ''

  const exerciseData = {
    exerciseName: exerciseName.value,
    date: date.value,
    sets: Number(sets.value),
    reps: Number(reps.value),

    weight: weight.value
      ? Number(weight.value)
      : undefined,

    notes: notes.value
  }

  try {
    await addExercise(
      props.clientId,
      exerciseData
    )

    message.value =
      'Vježba je uspješno dodana.'

    emit('exercise-added')

    exerciseName.value = ''
    date.value = ''
    sets.value = ''
    reps.value = ''
    weight.value = ''
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
        Novi zapis
      </p>

      <h3 class="mt-1 text-xl font-bold text-white">
        Dodaj vježbu
      </h3>

      <p class="mt-1 text-sm text-gray-500">
        Zabilježi rezultate odrađenog treninga.
      </p>

    </div>


    <form
      class="space-y-4"
      @submit.prevent="submitExercise"
    >

      <!-- NAZIV -->
      <div>
        <label
          class="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
        >
          Naziv vježbe
        </label>

        <input
          v-model="exerciseName"
          type="text"
          placeholder="npr. Chest Press"
          required
          class="w-full rounded-xl border border-[#35373a] bg-[#141516] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-[#5c74ff]"
        >
      </div>


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


      <!-- SETS / REPS -->
      <div class="grid grid-cols-2 gap-3">

        <div>
          <label
            class="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Serije
          </label>

          <input
            v-model="sets"
            type="number"
            min="1"
            placeholder="4"
            required
            class="w-full rounded-xl border border-[#35373a] bg-[#141516] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-[#5c74ff]"
          >
        </div>


        <div>
          <label
            class="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Ponavljanja
          </label>

          <input
            v-model="reps"
            type="number"
            min="1"
            placeholder="10"
            required
            class="w-full rounded-xl border border-[#35373a] bg-[#141516] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-[#5c74ff]"
          >
        </div>

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
            min="0"
            step="0.1"
            placeholder="100"
            class="w-full rounded-xl border border-[#35373a] bg-[#141516] px-4 py-3 pr-12 text-white outline-none transition placeholder:text-gray-600 focus:border-[#5c74ff]"
          >

          <span
            class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500"
          >
            kg
          </span>

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
        Dodaj vježbu
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
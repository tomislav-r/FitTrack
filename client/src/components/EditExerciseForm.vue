<script setup>
import { ref } from 'vue'
import { updateExercise } from '../services/exerciseService.js'

const props = defineProps({
  exercise: {
    type: Object,
    required: true
  }
})

const emit = defineEmits([
  'exercise-updated',
  'cancel'
])

const exerciseName = ref(
  props.exercise.exerciseName || ''
)

const date = ref(
  props.exercise.date
    ? props.exercise.date.substring(0, 10)
    : ''
)

const sets = ref(
  props.exercise.sets ?? ''
)

const reps = ref(
  props.exercise.reps ?? ''
)

const weight = ref(
  props.exercise.weight ?? ''
)

const notes = ref(
  props.exercise.notes || ''
)

const errorMessage = ref('')


async function submitExerciseUpdate() {
  errorMessage.value = ''

  const exerciseData = {
    exerciseName: exerciseName.value,
    date: date.value,
    sets: Number(sets.value),
    reps: Number(reps.value),

    weight: weight.value === ''
      ? null
      : Number(weight.value),

    notes: notes.value
  }

  try {
    await updateExercise(
      props.exercise._id,
      exerciseData
    )

    emit('exercise-updated')

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
        Uređivanje
      </p>

      <h3 class="mt-1 text-xl font-bold text-white">
        Uredi vježbu
      </h3>

      <p class="mt-1 text-sm text-gray-500">
        Promijeni podatke postojećeg zapisa.
      </p>

    </div>


    <form
      class="space-y-4"
      @submit.prevent="submitExerciseUpdate"
    >

      <div>
        <label
          class="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
        >
          Naziv vježbe
        </label>

        <input
          v-model="exerciseName"
          type="text"
          required
          class="w-full rounded-xl border border-[#35373a] bg-[#141516] px-4 py-3 text-white outline-none transition focus:border-[#5c74ff]"
        >
      </div>


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
            required
            class="w-full rounded-xl border border-[#35373a] bg-[#141516] px-4 py-3 text-white outline-none transition focus:border-[#5c74ff]"
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
            required
            class="w-full rounded-xl border border-[#35373a] bg-[#141516] px-4 py-3 text-white outline-none transition focus:border-[#5c74ff]"
          >
        </div>

      </div>


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
            class="w-full rounded-xl border border-[#35373a] bg-[#141516] px-4 py-3 pr-12 text-white outline-none transition focus:border-[#5c74ff]"
          >

          <span
            class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500"
          >
            kg
          </span>

        </div>
      </div>


      <div>
        <label
          class="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
        >
          Bilješka
        </label>

        <textarea
          v-model="notes"
          rows="3"
          class="w-full resize-none rounded-xl border border-[#35373a] bg-[#141516] px-4 py-3 text-white outline-none transition focus:border-[#5c74ff]"
        ></textarea>
      </div>


      <div class="grid grid-cols-2 gap-3">

        <button
          type="submit"
          class="rounded-xl bg-[#5065e8] px-4 py-3 font-semibold text-white transition hover:bg-[#6074f0]"
        >
          Spremi
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


    <p
      v-if="errorMessage"
      class="mt-4 rounded-xl bg-red-950/40 px-4 py-3 text-sm font-medium text-red-400"
    >
      {{ errorMessage }}
    </p>

  </section>
</template>
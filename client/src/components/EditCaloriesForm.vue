<script setup>
import { ref } from 'vue'
import { updateCalories } from '../services/caloriesService.js'

const props = defineProps({
  caloriesEntry: {
    type: Object,
    required: true
  }
})

const emit = defineEmits([
  'calories-updated',
  'cancel'
])

const date = ref(
  props.caloriesEntry.date
    ? props.caloriesEntry.date.substring(0, 10)
    : ''
)

const calorieTarget = ref(
  props.caloriesEntry.calorieTarget ?? ''
)

const caloriesConsumed = ref(
  props.caloriesEntry.caloriesConsumed ?? ''
)

const notes = ref(
  props.caloriesEntry.notes || ''
)

const errorMessage = ref('')


async function submitCaloriesUpdate() {
  errorMessage.value = ''

  const caloriesData = {
    date: date.value,
    calorieTarget: Number(calorieTarget.value),
    caloriesConsumed: Number(caloriesConsumed.value),
    notes: notes.value
  }

  try {
    await updateCalories(
      props.caloriesEntry._id,
      caloriesData
    )

    emit('calories-updated')

  } catch (error) {
    console.error(error)
    errorMessage.value = error.message
  }
}
</script>

<template>
  <section class="mt-4 rounded-lg bg-gray-50 p-4">
    <h3 class="mb-4 text-lg font-bold">
      Uredi kalorijski zapis
    </h3>

    <form
      class="grid gap-3"
      @submit.prevent="submitCaloriesUpdate"
    >
      <input
        v-model="date"
        type="date"
        class="rounded border border-gray-300 p-3"
        required
      >

      <input
        v-model="calorieTarget"
        type="number"
        min="1"
        placeholder="Kalorijski cilj"
        class="rounded border border-gray-300 p-3"
        required
      >

      <input
        v-model="caloriesConsumed"
        type="number"
        min="0"
        placeholder="Unesene kalorije"
        class="rounded border border-gray-300 p-3"
        required
      >

      <textarea
        v-model="notes"
        placeholder="Bilješka"
        class="rounded border border-gray-300 p-3"
      ></textarea>

      <div class="flex gap-2">
        <button
          type="submit"
          class="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Spremi
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
      class="mt-3 text-red-600"
    >
      {{ errorMessage }}
    </p>
  </section>
</template>
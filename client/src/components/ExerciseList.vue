<script setup>
defineProps({
  exercises: {
    type: Array,
    required: true
  }
})

const emit = defineEmits([
  'exercise-deleted'
])
</script>

<template>
  <section class="mt-10">
    <div class="mb-4">
      <h2 class="text-2xl font-bold text-gray-900">
        Vježbe
      </h2>

      <p class="text-gray-500">
        Evidencija treninga i rezultata klijenta.
      </p>
    </div>

    <div class="rounded-xl bg-white p-6 shadow">
      <p
        v-if="exercises.length === 0"
        class="text-gray-500"
      >
        Klijent još nema zapisanih vježbi.
      </p>

      <div
        v-else
        class="grid gap-4 md:grid-cols-2"
      >
        <article
          v-for="exercise in exercises"
          :key="exercise._id"
          class="rounded-lg border border-gray-200 p-4"
        >
          <h3 class="text-lg font-bold text-gray-900">
            {{ exercise.exerciseName }}
          </h3>

          <p class="mb-2 text-sm text-gray-500">
            {{ new Date(exercise.date).toLocaleDateString() }}
          </p>

          <p>
            <strong>Serije:</strong>
            {{ exercise.sets }}
          </p>

          <p>
            <strong>Ponavljanja:</strong>
            {{ exercise.reps }}
          </p>

          <p v-if="exercise.weight !== undefined">
            <strong>Težina:</strong>
            {{ exercise.weight }} kg
          </p>

          <p
            v-if="exercise.notes"
            class="mt-2 text-gray-600"
          >
            {{ exercise.notes }}
          </p>

          <button
            class="mt-4 rounded bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
            @click="emit('exercise-deleted', exercise._id)"
          >
            Obriši
          </button>
        </article>
      </div>
    </div>
  </section>
</template>
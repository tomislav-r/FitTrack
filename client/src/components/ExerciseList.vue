<script setup>
defineProps({
  exercises: {
    type: Array,
    required: true
  }
})

const emit = defineEmits([
  'exercise-deleted',
  'exercise-edit'
])
</script>

<template>
  <section>
    <div
      class="rounded-3xl border border-[#2b2d30] bg-[#191a1c] p-5"
    >
      <div class="mb-5 flex items-center justify-between">
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-wider text-gray-500"
          >
            Povijest
          </p>

          <h3 class="mt-1 text-lg font-bold text-white">
            Zabilježene vježbe
          </h3>
        </div>

        <div
          class="rounded-xl bg-[#242628] px-3 py-2 text-sm font-semibold text-gray-400"
        >
          {{ exercises.length }}
        </div>
      </div>


      <p
        v-if="exercises.length === 0"
        class="rounded-2xl border border-dashed border-[#343638] p-8 text-center text-sm text-gray-500"
      >
        Klijent još nema zapisanih vježbi.
      </p>


      <div
        v-else
        class="space-y-3"
      >
        <article
          v-for="exercise in exercises"
          :key="exercise._id"
          class="rounded-2xl border border-[#2d2f32] bg-[#141516] p-5 transition hover:border-[#414347]"
        >
          <!-- HEADER -->
          <div class="flex items-start justify-between gap-4">

            <div>
              <h4 class="text-lg font-bold text-white">
                {{ exercise.exerciseName }}
              </h4>

              <p class="mt-1 text-xs font-medium text-gray-500">
                {{ new Date(exercise.date).toLocaleDateString() }}
              </p>
            </div>


            <div
              v-if="exercise.weight !== undefined"
              class="rounded-xl bg-[#242628] px-3 py-2 text-right"
            >
              <p class="text-lg font-bold text-white">
                {{ exercise.weight }}
              </p>

              <p class="text-xs text-gray-500">
                kg
              </p>
            </div>

          </div>


          <!-- STATISTIKA -->
          <div class="mt-5 grid grid-cols-2 gap-3">

            <div class="rounded-xl bg-[#1d1f21] p-3">
              <p
                class="text-xs font-medium uppercase tracking-wide text-gray-500"
              >
                Serije
              </p>

              <p class="mt-1 text-xl font-bold text-white">
                {{ exercise.sets }}
              </p>
            </div>


            <div class="rounded-xl bg-[#1d1f21] p-3">
              <p
                class="text-xs font-medium uppercase tracking-wide text-gray-500"
              >
                Ponavljanja
              </p>

              <p class="mt-1 text-xl font-bold text-white">
                {{ exercise.reps }}
              </p>
            </div>

          </div>


          <!-- BILJEŠKA -->
          <p
            v-if="exercise.notes"
            class="mt-4 text-sm leading-relaxed text-gray-400"
          >
            {{ exercise.notes }}
          </p>


          <!-- ACTIONS -->
          <div
            class="mt-5 flex items-center gap-2 border-t border-[#292b2d] pt-4"
          >
            <button
              class="rounded-xl bg-[#2d3035] px-4 py-2 text-sm font-semibold text-gray-200 transition hover:bg-[#393c41]"
              @click="emit('exercise-edit', exercise)"
            >
              Uredi
            </button>

            <button
              class="rounded-xl px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-950/40"
              @click="emit('exercise-deleted', exercise._id)"
            >
              Obriši
            </button>
          </div>

        </article>
      </div>

    </div>
  </section>
</template>
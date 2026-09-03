<script setup>
defineProps({
  calories: {
    type: Array,
    required: true
  }
})

const emit = defineEmits([
  'calories-deleted',
  'calories-edit'
])


function getProgressPercentage(entry) {
  if (!entry.calorieTarget) {
    return 0
  }

  return Math.min(
    (entry.caloriesConsumed / entry.calorieTarget) * 100,
    100
  )
}


function getRatingClass(rating) {
  if (rating === 'Dobar unos') {
    return 'bg-emerald-950/50 text-emerald-400 border-emerald-900/50'
  }

  if (rating === 'Prosječan unos') {
    return 'bg-amber-950/50 text-amber-400 border-amber-900/50'
  }

  return 'bg-red-950/50 text-red-400 border-red-900/50'
}
</script>


<template>
  <section>
    <div
      class="rounded-3xl border border-[#2b2d30] bg-[#191a1c] p-5"
    >

      <!-- HEADER -->
      <div class="mb-5 flex items-center justify-between">

        <div>
          <p
            class="text-xs font-semibold uppercase tracking-wider text-gray-500"
          >
            Povijest
          </p>

          <h3 class="mt-1 text-lg font-bold text-white">
            Kalorijski zapisi
          </h3>
        </div>

        <div
          class="rounded-xl bg-[#242628] px-3 py-2 text-sm font-semibold text-gray-400"
        >
          {{ calories.length }}
        </div>

      </div>


      <!-- NEMA PODATAKA -->
      <p
        v-if="calories.length === 0"
        class="rounded-2xl border border-dashed border-[#343638] p-8 text-center text-sm text-gray-500"
      >
        Klijent još nema kalorijskih zapisa.
      </p>


      <!-- ZAPISI -->
      <div
        v-else
        class="space-y-3"
      >

        <article
          v-for="entry in calories"
          :key="entry._id"
          class="rounded-2xl border border-[#2d2f32] bg-[#141516] p-5 transition hover:border-[#414347]"
        >

          <!-- DATUM + RATING -->
          <div class="flex items-start justify-between gap-4">

            <div>
              <p
                class="text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Dnevni unos
              </p>

              <p class="mt-1 text-sm font-medium text-gray-400">
                {{ new Date(entry.date).toLocaleDateString() }}
              </p>
            </div>


            <span
              class="rounded-full border px-3 py-1 text-xs font-semibold"
              :class="getRatingClass(entry.rating)"
            >
              {{ entry.rating }}
            </span>

          </div>


          <!-- GLAVNE KALORIJE -->
          <div class="mt-6">

            <div class="flex items-end gap-2">
              <p class="text-4xl font-bold tracking-tight text-white">
                {{ entry.caloriesConsumed }}
              </p>

              <span class="pb-1 text-sm font-medium text-gray-500">
                kcal
              </span>
            </div>

            <p class="mt-1 text-sm text-gray-500">
              od {{ entry.calorieTarget }} kcal dnevnog cilja
            </p>

          </div>


          <!-- PROGRESS BAR -->
          <div class="mt-5">

            <div
              class="mb-2 flex items-center justify-between text-xs text-gray-500"
            >
              <span>
                Dnevni cilj
              </span>

              <span>
                {{
                  Math.round(
                    (entry.caloriesConsumed / entry.calorieTarget) * 100
                  )
                }}%
              </span>
            </div>


            <div
              class="h-2 overflow-hidden rounded-full bg-[#292b2d]"
            >
              <div
                class="h-full rounded-full bg-[#5065e8] transition-all"
                :style="{
                  width: `${getProgressPercentage(entry)}%`
                }"
              ></div>
            </div>

          </div>


          <!-- STATISTIKE -->
          <div class="mt-5 grid grid-cols-2 gap-3">

            <div class="rounded-xl bg-[#1d1f21] p-3">
              <p
                class="text-xs font-medium uppercase tracking-wide text-gray-500"
              >
                Cilj
              </p>

              <div class="mt-1 flex items-end gap-1">
                <p class="text-xl font-bold text-white">
                  {{ entry.calorieTarget }}
                </p>

                <span class="pb-0.5 text-xs text-gray-500">
                  kcal
                </span>
              </div>
            </div>


            <div class="rounded-xl bg-[#1d1f21] p-3">
              <p
                class="text-xs font-medium uppercase tracking-wide text-gray-500"
              >
                Odstupanje
              </p>

              <div class="mt-1 flex items-end gap-1">
                <p class="text-xl font-bold text-white">
                  {{ entry.deviationPercentage }}
                </p>

                <span class="pb-0.5 text-xs text-gray-500">
                  %
                </span>
              </div>
            </div>

          </div>


          <!-- BILJEŠKA -->
          <p
            v-if="entry.notes"
            class="mt-4 text-sm leading-relaxed text-gray-400"
          >
            {{ entry.notes }}
          </p>


          <!-- ACTIONS -->
          <div
            class="mt-5 flex items-center gap-2 border-t border-[#292b2d] pt-4"
          >

            <button
              class="rounded-xl bg-[#2d3035] px-4 py-2 text-sm font-semibold text-gray-200 transition hover:bg-[#393c41]"
              @click="emit('calories-edit', entry)"
            >
              Uredi
            </button>


            <button
              class="rounded-xl px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-950/40"
              @click="emit('calories-deleted', entry._id)"
            >
              Obriši
            </button>

          </div>

        </article>

      </div>

    </div>
  </section>
</template>
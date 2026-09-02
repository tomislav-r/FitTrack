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
</script>

<template>
  <section class="mt-10">
    <div class="mb-4">
      <h2 class="text-2xl font-bold text-gray-900">
        Kalorije
      </h2>

      <p class="text-gray-500">
        Praćenje kalorijskog cilja i dnevnog unosa.
      </p>
    </div>

    <div class="rounded-xl bg-white p-6 shadow">
      <p
        v-if="calories.length === 0"
        class="text-gray-500"
      >
        Klijent još nema kalorijskih zapisa.
      </p>

      <div
        v-else
        class="grid gap-4 md:grid-cols-2"
      >
        <article
          v-for="entry in calories"
          :key="entry._id"
          class="rounded-lg border border-gray-200 p-4"
        >
          <p class="mb-2 font-semibold text-gray-900">
            {{ new Date(entry.date).toLocaleDateString() }}
          </p>

          <p>
            <strong>Cilj:</strong>
            {{ entry.calorieTarget }} kcal
          </p>

          <p>
            <strong>Uneseno:</strong>
            {{ entry.caloriesConsumed }} kcal
          </p>

          <p>
            <strong>Odstupanje:</strong>
            {{ entry.deviationPercentage }}%
          </p>

          <p>
            <strong>Procjena:</strong>
            {{ entry.rating }}
          </p>

          <p
            v-if="entry.notes"
            class="mt-2 text-gray-600"
          >
            {{ entry.notes }}
          </p>

          <button
            class="mt-4 mr-2 rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            @click="emit('calories-edit', entry)"
          >
            Uredi
          </button>

          <button
            class="mt-4 rounded bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
            @click="emit('calories-deleted', entry._id)"
          >
            Obriši
          </button>
        </article>
      </div>
    </div>
  </section>
</template>
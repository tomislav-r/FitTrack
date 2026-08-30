<script setup>
defineProps({
  progress: {
    type: Array,
    required: true
  },

  selectedPeriod: {
    type: String,
    required: true
  }
})

const emit = defineEmits([
  'period-changed',
  'progress-deleted'
])
</script>

<template>
  <section class="mt-8">
    <div class="mb-4">
      <h2 class="text-2xl font-bold text-gray-900">
        Napredak
      </h2>

      <p class="text-gray-500">
        Praćenje težine, struka i tjelesne masti.
      </p>
    </div>

    <div class="rounded-xl bg-white p-6 shadow">
      <div class="mb-6 flex flex-wrap gap-2">

        <button
          class="rounded-lg px-4 py-2"
          :class="
            selectedPeriod === ''
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          "
          @click="emit('period-changed', '')"
        >
          Sve
        </button>

        <button
          class="rounded-lg px-4 py-2"
          :class="
            selectedPeriod === 'day'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          "
          @click="emit('period-changed', 'day')"
        >
          Dan
        </button>

        <button
          class="rounded-lg px-4 py-2"
          :class="
            selectedPeriod === 'week'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          "
          @click="emit('period-changed', 'week')"
        >
          Tjedan
        </button>

        <button
          class="rounded-lg px-4 py-2"
          :class="
            selectedPeriod === 'month'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          "
          @click="emit('period-changed', 'month')"
        >
          Mjesec
        </button>

        <button
          class="rounded-lg px-4 py-2"
          :class="
            selectedPeriod === 'year'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          "
          @click="emit('period-changed', 'year')"
        >
          Godina
        </button>
      </div>

      <p
        v-if="progress.length === 0"
        class="text-gray-500"
      >
        Nema zapisa napretka za odabrano razdoblje.
      </p>

      <div
        v-else
        class="grid gap-4 md:grid-cols-2"
      >
        <article
          v-for="entry in progress"
          :key="entry._id"
          class="rounded-lg border border-gray-200 p-4"
        >
          <p class="mb-2 font-semibold text-gray-900">
            {{ new Date(entry.date).toLocaleDateString() }}
          </p>

          <p>
            <strong>Težina:</strong>
            {{ entry.weight }} kg
          </p>

          <p v-if="entry.waist">
            <strong>Struk:</strong>
            {{ entry.waist }} cm
          </p>

          <p v-if="entry.bodyFat">
            <strong>Body fat:</strong>
            {{ entry.bodyFat }}%
          </p>

          <p
            v-if="entry.notes"
            class="mt-2 text-gray-600"
          >
            {{ entry.notes }}
          </p>

          <button
            class="mt-4 rounded bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
            @click="emit('progress-deleted', entry._id)"
          >
            Obriši
          </button>
        </article>
      </div>
    </div>
  </section>
</template>
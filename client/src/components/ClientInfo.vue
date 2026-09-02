<script setup>
defineProps({
  client: {
    type: Object,
    required: true
  }
})

const emit = defineEmits([
  'edit-client'
])
</script>

<template>
  <section
    class="rounded-3xl border border-[#2b2d30] bg-[#191a1c] p-6 text-white"
  >
    <!-- GORNJI DIO -->
    <div
      class="flex flex-col gap-5 border-b border-[#2b2d30] pb-6 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex items-center gap-4">

        <!-- INICIJALI -->
        <div
          class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#303236] text-lg font-bold"
        >
          {{ client.firstName?.charAt(0) }}
          {{ client.lastName?.charAt(0) }}
        </div>

        <div>
          <p
            class="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500"
          >
            Klijent
          </p>

          <h1 class="text-3xl font-bold tracking-tight">
            {{ client.firstName }} {{ client.lastName }}
          </h1>

          <p class="mt-1 text-sm text-gray-400">
            {{ client.email }}
          </p>
        </div>
      </div>

      <button
        class="rounded-xl border border-[#35373a] bg-[#242628] px-4 py-2.5 text-sm font-semibold text-gray-200 transition hover:bg-[#303236]"
        @click="emit('edit-client')"
      >
        Uredi podatke
      </button>
    </div>


    <!-- PODACI -->
    <div class="mt-6 grid gap-3 sm:grid-cols-3">

      <div class="rounded-2xl bg-[#141516] p-4">
        <p class="text-xs font-medium uppercase tracking-wide text-gray-500">
          Visina
        </p>

        <div class="mt-2 flex items-end gap-1">
          <p class="text-2xl font-bold">
            {{ client.height || '—' }}
          </p>

          <span
            v-if="client.height"
            class="pb-1 text-sm text-gray-500"
          >
            cm
          </span>
        </div>
      </div>


      <div class="rounded-2xl bg-[#141516] p-4">
        <p class="text-xs font-medium uppercase tracking-wide text-gray-500">
          Ciljana težina
        </p>

        <div class="mt-2 flex items-end gap-1">
          <p class="text-2xl font-bold">
            {{ client.targetWeight || '—' }}
          </p>

          <span
            v-if="client.targetWeight"
            class="pb-1 text-sm text-gray-500"
          >
            kg
          </span>
        </div>
      </div>


      <div class="rounded-2xl bg-[#141516] p-4">
        <p class="text-xs font-medium uppercase tracking-wide text-gray-500">
          Cilj
        </p>

        <p class="mt-2 font-semibold text-gray-200">
          {{ client.goal || 'Nije unesen' }}
        </p>
      </div>

    </div>
  </section>
</template>
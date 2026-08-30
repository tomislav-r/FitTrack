<script setup>
defineProps({
  client: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <section class="rounded-xl bg-white p-6 shadow">
    <div class="border-b border-gray-200 pb-4">
      <h1 class="text-3xl font-bold text-gray-900">
        {{ client.firstName }} {{ client.lastName }}
      </h1>

      <p class="mt-1 text-gray-500">
        Podaci i praćenje klijenta
      </p>
    </div>

    <div class="mt-6 grid gap-4 sm:grid-cols-2">
      <div class="rounded-lg bg-gray-50 p-4">
        <p class="text-sm text-gray-500">
          Email
        </p>

        <p class="font-semibold text-gray-900">
          {{ client.email }}
        </p>
      </div>

      <div class="rounded-lg bg-gray-50 p-4">
        <p class="text-sm text-gray-500">
          Visina
        </p>

        <p class="font-semibold text-gray-900">
          {{ client.height ? `${client.height} cm` : 'Nije unesena' }}
        </p>
      </div>

      <div class="rounded-lg bg-gray-50 p-4">
        <p class="text-sm text-gray-500">
          Ciljana težina
        </p>

        <p class="font-semibold text-gray-900">
          {{
            client.targetWeight
              ? `${client.targetWeight} kg`
              : 'Nije unesena'
          }}
        </p>
      </div>

      <div class="rounded-lg bg-gray-50 p-4">
        <p class="text-sm text-gray-500">
          Cilj
        </p>

        <p class="font-semibold text-gray-900">
          {{ client.goal || 'Nije unesen' }}
        </p>
      </div>
    </div>
  </section>
</template>
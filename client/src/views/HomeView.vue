<script setup>
import { ref } from 'vue'
import ClientForm from '../components/ClientForm.vue'
import ClientList from '../components/ClientList.vue'
const clientListKey = ref(0)

function refreshClients() {
  clientListKey.value++
}
</script>

<template>
  <main class="min-h-screen bg-gray-100 p-8">
    <div class="mx-auto max-w-4xl">

      <h1 class="text-4xl font-bold">
        FitTrack
      </h1>

      <p class="mt-2 text-gray-600">
        Aplikacija za praćenje napretka klijenata.
      </p>

      <ClientForm
        @client-added="refreshClients"
      />

      <ClientList
        :key="clientListKey"
        @client-deleted="refreshClients"
      />

    </div>
  </main>
</template>
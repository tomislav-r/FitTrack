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
  <main class="min-h-dvh bg-[#0b0f17] px-4 py-8 text-white">
    <div class="mx-auto max-w-7xl">

      <!-- HEADER -->
      <header class="mb-10">
        <div class="flex items-center gap-4">

          <div
            class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5065e8] text-xl font-bold text-white"
          >
            F
          </div>

          <div>
            <h1 class="text-3xl font-bold tracking-tight text-white">
              FitTrack
            </h1>

            <p class="mt-1 text-sm text-gray-500">
              Upravljanje klijentima i praćenje njihovog napretka.
            </p>
          </div>

        </div>
      </header>


      <!-- GLAVNI SADRŽAJ -->
      <div class="grid items-start gap-6 lg:grid-cols-[1fr_420px]">

        <!-- LIJEVO - KLIJENTI -->
        <ClientList
          :key="clientListKey"
          @client-deleted="refreshClients"
        />


        <!-- DESNO - DODAVANJE -->
        <div class="lg:sticky lg:top-6">
          <ClientForm
            @client-added="refreshClients"
          />
        </div>

      </div>

    </div>
  </main>
</template>
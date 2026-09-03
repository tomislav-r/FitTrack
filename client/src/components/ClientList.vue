<script setup>
import { ref, onMounted } from 'vue'
import { API_URL } from '../services/api.js'

const emit = defineEmits([
  'client-deleted'
])

const clients = ref([])
const loading = ref(true)
const errorMessage = ref('')


async function getClients() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(
      `${API_URL}/clients`
    )

    if (!response.ok) {
      throw new Error(
        'Greška prilikom dohvaćanja klijenata.'
      )
    }

    clients.value = await response.json()

  } catch (error) {
    console.error(error)

    errorMessage.value =
      'Nije moguće dohvatiti klijente.'

  } finally {
    loading.value = false
  }
}


async function deleteClient(id) {
  const confirmed = confirm(
    'Želiš li obrisati ovog klijenta i sve njegove podatke?'
  )

  if (!confirmed) {
    return
  }

  try {
    const response = await fetch(
      `${API_URL}/clients/${id}`,
      {
        method: 'DELETE'
      }
    )

    if (!response.ok) {
      console.error(
        'Greška prilikom brisanja klijenta.'
      )

      return
    }

    emit('client-deleted')

  } catch (error) {
    console.error(
      'Greška prilikom povezivanja sa serverom:',
      error
    )
  }
}


onMounted(() => {
  getClients()
})
</script>


<template>
  <section
    class="rounded-3xl border border-[#2b2d30] bg-[#191a1c] p-5"
  >

    <!-- HEADER -->
    <div class="mb-6 flex items-center justify-between">

      <div>
        <p
          class="text-xs font-semibold uppercase tracking-wider text-gray-500"
        >
          Pregled
        </p>

        <h2 class="mt-1 text-2xl font-bold text-white">
          Klijenti
        </h2>

        <p class="mt-1 text-sm text-gray-500">
          Pregled svih klijenata u sustavu.
        </p>
      </div>


      <div
        class="rounded-xl bg-[#242628] px-3 py-2 text-sm font-semibold text-gray-400"
      >
        {{ clients.length }}
      </div>

    </div>


    <!-- LOADING -->
    <p
      v-if="loading"
      class="rounded-2xl border border-dashed border-[#343638] p-8 text-center text-sm text-gray-500"
    >
      Učitavanje klijenata...
    </p>


    <!-- ERROR -->
    <p
      v-else-if="errorMessage"
      class="rounded-xl bg-red-950/40 px-4 py-3 text-sm font-medium text-red-400"
    >
      {{ errorMessage }}
    </p>


    <!-- PRAZNA LISTA -->
    <div
      v-else-if="clients.length === 0"
      class="rounded-2xl border border-dashed border-[#343638] p-10 text-center"
    >
      <div
        class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#242628] text-lg font-bold text-gray-400"
      >
        +
      </div>

      <h3 class="mt-4 font-semibold text-white">
        Nema klijenata
      </h3>

      <p class="mt-1 text-sm text-gray-500">
        Dodaj prvog klijenta pomoću forme.
      </p>
    </div>


    <!-- KLIJENTI -->
    <div
      v-else
      class="grid gap-4 xl:grid-cols-2"
    >
      <article
        v-for="client in clients"
        :key="client._id"
        class="rounded-2xl border border-[#2d2f32] bg-[#141516] p-5 transition hover:border-[#414347]"
      >

        <!-- PROFIL -->
        <div class="flex items-start gap-4">

          <!-- INICIJALI -->
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#242628] font-bold text-gray-200"
          >
            {{ client.firstName?.charAt(0) }}
            {{ client.lastName?.charAt(0) }}
          </div>


          <div class="min-w-0">
            <h3 class="truncate text-lg font-bold text-white">
              {{ client.firstName }}
              {{ client.lastName }}
            </h3>

            <p class="mt-1 truncate text-sm text-gray-500">
              {{ client.email }}
            </p>
          </div>

        </div>


        <!-- PODACI -->
        <div class="mt-5 grid grid-cols-2 gap-3">

          <div class="rounded-xl bg-[#1d1f21] p-3">
            <p
              class="text-xs font-medium uppercase tracking-wide text-gray-500"
            >
              Visina
            </p>

            <div class="mt-1 flex items-end gap-1">
              <p class="text-lg font-bold text-white">
                {{ client.height ?? '—' }}
              </p>

              <span
                v-if="client.height"
                class="pb-0.5 text-xs text-gray-500"
              >
                cm
              </span>
            </div>
          </div>


          <div class="rounded-xl bg-[#1d1f21] p-3">
            <p
              class="text-xs font-medium uppercase tracking-wide text-gray-500"
            >
              Ciljana težina
            </p>

            <div class="mt-1 flex items-end gap-1">
              <p class="text-lg font-bold text-white">
                {{ client.targetWeight ?? '—' }}
              </p>

              <span
                v-if="client.targetWeight"
                class="pb-0.5 text-xs text-gray-500"
              >
                kg
              </span>
            </div>
          </div>

        </div>


        <!-- CILJ -->
        <div
          v-if="client.goal"
          class="mt-3 rounded-xl bg-[#1d1f21] p-3"
        >
          <p
            class="text-xs font-medium uppercase tracking-wide text-gray-500"
          >
            Cilj
          </p>

          <p class="mt-1 text-sm text-gray-300">
            {{ client.goal }}
          </p>
        </div>


        <!-- ACTIONS -->
        <div
          class="mt-5 flex items-center gap-2 border-t border-[#292b2d] pt-4"
        >

          <RouterLink
            :to="`/clients/${client._id}`"
            class="rounded-xl bg-[#5065e8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#6074f0]"
          >
            Otvori klijenta
          </RouterLink>


          <button
            class="rounded-xl px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-950/40"
            @click="deleteClient(client._id)"
          >
            Obriši
          </button>

        </div>

      </article>
    </div>

  </section>
</template>
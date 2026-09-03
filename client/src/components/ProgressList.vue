<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  progress: {
    type: Array,
    required: true
  },

  years: {
    type: Array,
    required: true
  },

  selectedPeriod: {
    type: String,
    required: true
  },

  selectedFilterValue: {
    type: String,
    default: ''
  }
})


const emit = defineEmits([
  'filter-changed',
  'progress-deleted',
  'progress-edit'
])


const months = [
  { value: '01', label: 'Siječanj' },
  { value: '02', label: 'Veljača' },
  { value: '03', label: 'Ožujak' },
  { value: '04', label: 'Travanj' },
  { value: '05', label: 'Svibanj' },
  { value: '06', label: 'Lipanj' },
  { value: '07', label: 'Srpanj' },
  { value: '08', label: 'Kolovoz' },
  { value: '09', label: 'Rujan' },
  { value: '10', label: 'Listopad' },
  { value: '11', label: 'Studeni' },
  { value: '12', label: 'Prosinac' }
]


const today =
  new Date()
    .toISOString()
    .substring(0, 10)


const currentMonth =
  today.substring(0, 7)


const currentYear =
  today.substring(0, 4)


const currentMonthNumber =
  currentMonth.substring(5, 7)


const selectedDate = ref(
  props.selectedPeriod === 'day' &&
  props.selectedFilterValue
    ? props.selectedFilterValue
    : today
)


const selectedWeekDate = ref(
  props.selectedPeriod === 'week' &&
  props.selectedFilterValue
    ? props.selectedFilterValue
    : today
)


const selectedMonthNumber = ref(
  props.selectedPeriod === 'month' &&
  props.selectedFilterValue
    ? props.selectedFilterValue.substring(5, 7)
    : currentMonthNumber
)


const selectedMonthYear = ref(
  props.selectedPeriod === 'month' &&
  props.selectedFilterValue
    ? props.selectedFilterValue.substring(0, 4)
    : currentYear
)


const selectedYear = ref(
  props.selectedPeriod === 'year' &&
  props.selectedFilterValue
    ? props.selectedFilterValue
    : currentYear
)


watch(
  () => props.years,

  (newYears) => {
    if (newYears.length === 0) {
      return
    }

    const availableYears =
      newYears.map(year => String(year))


    if (
      !availableYears.includes(
        selectedMonthYear.value
      )
    ) {
      selectedMonthYear.value =
        availableYears[0]
    }


    if (
      !availableYears.includes(
        selectedYear.value
      )
    ) {
      selectedYear.value =
        availableYears[0]
    }
  },

  {
    immediate: true
  }
)


function selectPeriod(period) {
  if (period === '') {
    emit('filter-changed', {
      period: '',
      value: ''
    })

    return
  }


  if (period === 'day') {
    emit('filter-changed', {
      period: 'day',
      value: selectedDate.value
    })

    return
  }


  if (period === 'week') {
    emit('filter-changed', {
      period: 'week',
      value: selectedWeekDate.value
    })

    return
  }


  if (period === 'month') {
    if (props.years.length === 0) {
      return
    }

    const value =
      `${selectedMonthYear.value}-${selectedMonthNumber.value}`

    emit('filter-changed', {
      period: 'month',
      value: value
    })

    return
  }


  if (period === 'year') {
    if (props.years.length === 0) {
      return
    }

    emit('filter-changed', {
      period: 'year',
      value: selectedYear.value
    })
  }
}


function applyDayFilter() {
  emit('filter-changed', {
    period: 'day',
    value: selectedDate.value
  })
}


function applyWeekFilter() {
  emit('filter-changed', {
    period: 'week',
    value: selectedWeekDate.value
  })
}


function applyMonthFilter() {
  const value =
    `${selectedMonthYear.value}-${selectedMonthNumber.value}`

  emit('filter-changed', {
    period: 'month',
    value: value
  })
}


function applyYearFilter() {
  emit('filter-changed', {
    period: 'year',
    value: selectedYear.value
  })
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
            Zapisi mjerenja
          </h3>
        </div>


        <div
          class="rounded-xl bg-[#242628] px-3 py-2 text-sm font-semibold text-gray-400"
        >
          {{ progress.length }}
        </div>

      </div>


      <!-- FILTER -->
      <div class="rounded-2xl bg-[#141516] p-2">

        <!-- TABOVI -->
        <div class="flex flex-wrap gap-1">

          <button
            class="rounded-xl px-4 py-2 text-xs font-semibold transition"
            :class="
              selectedPeriod === ''
                ? 'bg-[#303236] text-white'
                : 'text-gray-500 hover:text-gray-200'
            "
            @click="selectPeriod('')"
          >
            Sve
          </button>


          <button
            class="rounded-xl px-4 py-2 text-xs font-semibold transition"
            :class="
              selectedPeriod === 'day'
                ? 'bg-[#303236] text-white'
                : 'text-gray-500 hover:text-gray-200'
            "
            @click="selectPeriod('day')"
          >
            Dan
          </button>


          <button
            class="rounded-xl px-4 py-2 text-xs font-semibold transition"
            :class="
              selectedPeriod === 'week'
                ? 'bg-[#303236] text-white'
                : 'text-gray-500 hover:text-gray-200'
            "
            @click="selectPeriod('week')"
          >
            Tjedan
          </button>


          <button
            class="rounded-xl px-4 py-2 text-xs font-semibold transition"
            :class="
              selectedPeriod === 'month'
                ? 'bg-[#303236] text-white'
                : 'text-gray-500 hover:text-gray-200'
            "
            @click="selectPeriod('month')"
          >
            Mjesec
          </button>


          <button
            class="rounded-xl px-4 py-2 text-xs font-semibold transition"
            :class="
              selectedPeriod === 'year'
                ? 'bg-[#303236] text-white'
                : 'text-gray-500 hover:text-gray-200'
            "
            @click="selectPeriod('year')"
          >
            Godina
          </button>

        </div>


        <!-- DAN -->
        <div
          v-if="selectedPeriod === 'day'"
          class="mt-3 border-t border-[#292b2d] pt-3"
        >
          <label
            class="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Odaberi dan
          </label>

          <input
            v-model="selectedDate"
            type="date"
            class="w-full rounded-xl border border-[#35373a] bg-[#191a1c] px-4 py-3 text-white outline-none transition focus:border-[#5c74ff]"
            @change="applyDayFilter"
          >
        </div>


        <!-- TJEDAN -->
        <div
          v-if="selectedPeriod === 'week'"
          class="mt-3 border-t border-[#292b2d] pt-3"
        >
          <label
            class="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Odaberi datum iz željenog tjedna
          </label>

          <input
            v-model="selectedWeekDate"
            type="date"
            class="w-full rounded-xl border border-[#35373a] bg-[#191a1c] px-4 py-3 text-white outline-none transition focus:border-[#5c74ff]"
            @change="applyWeekFilter"
          >

          <p class="mt-2 text-xs text-gray-600">
            Prikazat će se cijeli tjedan kojem odabrani datum pripada.
          </p>
        </div>


        <!-- MJESEC -->
        <div
          v-if="selectedPeriod === 'month'"
          class="mt-3 border-t border-[#292b2d] pt-3"
        >
          <label
            class="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Odaberi mjesec
          </label>


          <p
            v-if="years.length === 0"
            class="rounded-xl border border-dashed border-[#343638] p-4 text-center text-sm text-gray-500"
          >
            Klijent još nema zapisa napretka.
          </p>


          <div
            v-else
            class="grid gap-3 sm:grid-cols-2"
          >

            <!-- MJESEC -->
            <div>
              <p class="mb-2 text-xs text-gray-600">
                Mjesec
              </p>

              <select
                v-model="selectedMonthNumber"
                class="w-full cursor-pointer rounded-xl border border-[#35373a] bg-[#191a1c] px-4 py-3 text-white outline-none transition focus:border-[#5c74ff]"
                @change="applyMonthFilter"
              >
                <option
                  v-for="month in months"
                  :key="month.value"
                  :value="month.value"
                >
                  {{ month.label }}
                </option>
              </select>
            </div>


            <!-- GODINA -->
            <div>
              <p class="mb-2 text-xs text-gray-600">
                Godina
              </p>

              <select
                v-model="selectedMonthYear"
                class="w-full cursor-pointer rounded-xl border border-[#35373a] bg-[#191a1c] px-4 py-3 text-white outline-none transition focus:border-[#5c74ff]"
                @change="applyMonthFilter"
              >
                <option
                  v-for="year in years"
                  :key="year"
                  :value="String(year)"
                >
                  {{ year }}
                </option>
              </select>
            </div>

          </div>

        </div>


        <!-- GODINA -->
        <div
          v-if="selectedPeriod === 'year'"
          class="mt-3 border-t border-[#292b2d] pt-3"
        >
          <label
            class="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Odaberi godinu
          </label>


          <p
            v-if="years.length === 0"
            class="rounded-xl border border-dashed border-[#343638] p-4 text-center text-sm text-gray-500"
          >
            Klijent još nema zapisa napretka.
          </p>


          <select
            v-else
            v-model="selectedYear"
            class="w-full cursor-pointer rounded-xl border border-[#35373a] bg-[#191a1c] px-4 py-3 text-white outline-none transition focus:border-[#5c74ff]"
            @change="applyYearFilter"
          >
            <option
              v-for="year in years"
              :key="year"
              :value="String(year)"
            >
              {{ year }}
            </option>
          </select>

        </div>

      </div>


      <!-- NEMA ZAPISA -->
      <p
        v-if="progress.length === 0"
        class="mt-5 rounded-2xl border border-dashed border-[#343638] p-8 text-center text-sm text-gray-500"
      >
        Nema zapisa za odabrano razdoblje.
      </p>


      <!-- ZAPISI -->
      <div
        v-else
        class="mt-5 space-y-3"
      >

        <article
          v-for="entry in progress"
          :key="entry._id"
          class="rounded-2xl border border-[#2d2f32] bg-[#141516] p-5 transition hover:border-[#414347]"
        >

          <!-- HEADER -->
          <div class="flex items-start justify-between gap-4">

            <div>

              <p
                class="text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Mjerenje
              </p>

              <p class="mt-1 text-sm font-medium text-gray-400">
                {{ new Date(entry.date).toLocaleDateString() }}
              </p>

            </div>


            <div class="text-right">

              <div class="flex items-end justify-end gap-1">

                <span
                  class="text-3xl font-bold tracking-tight text-white"
                >
                  {{ entry.weight }}
                </span>

                <span class="pb-1 text-sm text-gray-500">
                  kg
                </span>

              </div>

              <p class="mt-1 text-xs text-gray-500">
                Težina
              </p>

            </div>

          </div>


          <!-- MJERENJA -->
          <div class="mt-5 grid grid-cols-2 gap-3">

            <!-- STRUK -->
            <div class="rounded-xl bg-[#1d1f21] p-3">

              <p
                class="text-xs font-medium uppercase tracking-wide text-gray-500"
              >
                Struk
              </p>

              <div class="mt-1 flex items-end gap-1">

                <p class="text-xl font-bold text-white">
                  {{ entry.waist ?? '—' }}
                </p>

                <span
                  v-if="
                    entry.waist !== undefined &&
                    entry.waist !== null
                  "
                  class="pb-0.5 text-xs text-gray-500"
                >
                  cm
                </span>

              </div>

            </div>


            <!-- BODY FAT -->
            <div class="rounded-xl bg-[#1d1f21] p-3">

              <p
                class="text-xs font-medium uppercase tracking-wide text-gray-500"
              >
                Body fat
              </p>

              <div class="mt-1 flex items-end gap-1">

                <p class="text-xl font-bold text-white">
                  {{ entry.bodyFat ?? '—' }}
                </p>

                <span
                  v-if="
                    entry.bodyFat !== undefined &&
                    entry.bodyFat !== null
                  "
                  class="pb-0.5 text-xs text-gray-500"
                >
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
              @click="emit('progress-edit', entry)"
            >
              Uredi
            </button>


            <button
              class="rounded-xl px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-950/40"
              @click="emit('progress-deleted', entry._id)"
            >
              Obriši
            </button>

          </div>

        </article>

      </div>

    </div>
  </section>
</template>
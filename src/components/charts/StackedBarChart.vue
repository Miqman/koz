<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { formatAngka } from '../../utils/formatNumbers'

const props = defineProps({
  data: Array, // Array of objects with name, data, color
  xCategories: Array, // Categories for x-axis
  showAxes: Boolean,
  showYaxes: Boolean,
  showLegend: Boolean,
  heightCustom: String,
  theme: String,
  keterangan: String,
  showBorder: Boolean,
  loading: Boolean,
  maxVisibleItems: {
    type: Number,
    default: 4,
  },
  enablePagination: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['pageChange'])

// Pagination state
const currentPage = ref(1)
const itemsPerPage = props.maxVisibleItems
const chartKey = ref(0) // Add key for force re-render

// Computed properties for pagination
const totalPages = computed(() => {
  if (!props.enablePagination || !props.xCategories) return 1
  return Math.ceil(props.xCategories.length / itemsPerPage)
})

const paginatedCategories = computed(() => {
  if (!props.enablePagination || !props.xCategories) return props.xCategories

  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return props.xCategories.slice(start, end)
})

const paginatedData = computed(() => {
  if (!props.enablePagination || !props.data) return props.data

  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage

  return props.data.map((series) => ({
    ...series,
    data: series.data.slice(start, end),
  }))
})

// Validate data to prevent empty arrays
const validatedData = computed(() => {
  return paginatedData.value.map((series) => ({
    ...series,
    data: series.data.length > 0 ? series.data : [0], // Ensure at least one data point
  }))
})

const validatedCategories = computed(() => {
  return paginatedCategories.value.length > 0 ? paginatedCategories.value : ['No Data']
})

// Chart options
const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    height: props.heightCustom,
    background: 'transparent',
    toolbar: { show: false },
    stacked: true,
    // stackType: '100%',
    zoom: {
      enabled: false,
    },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 300,
      animateGradually: {
        enabled: true,
        delay: 50,
      },
      dynamicAnimation: {
        enabled: true,
        speed: 300,
      },
    },
  },
  colors: validatedData.value.map((item) => item.color),
  grid: { show: props.showBorder },
  dataLabels: {
    enabled: false,
    style: {
      colors: ['#fff'],
    },
  },
  stroke: {
    width: 1,
    colors: ['#fff'],
  },
  plotOptions: {
    bar: {
      horizontal: true,
      // columnWidth: '70%',
      borderRadius: 6,
      borderRadiusApplication: 'end',
      // borderRadiusWhenStacked: 'last',
      // barHeight: '40%',
      // distributed: false,
      // rangeBarGroupRows: true,
    },
  },
  xaxis: {
    categories: validatedCategories.value,
    labels: {
      show: props.showAxes,
      style: {
        colors: 'var(--color-twBlack)',
      },
      rotate: -45,
      trim: true,
      maxHeight: 120,
    },
    axisBorder: { show: props.showBorder },
    axisTicks: { show: props.showBorder },
  },
  yaxis: {
    labels: {
      show: props.showYaxes,
      style: {
        colors: 'var(--color-twBlack)',
      },
      formatter: (value) => {
        const formattedValue = formatAngka(value)
        return formattedValue
      },
    },
  },
  legend: {
    show: props.showLegend,
    position: 'bottom',
    showForSingleSeries: false,
    horizontalAlign: 'center',
    floating: false,
    fontSize: '12px',
    markers: {
      width: 12,
      height: 12,
      radius: 2,
    },
  },
  tooltip: {
    enabled: true,
    theme: props.theme,
    shared: true,
    intersect: false,
    y: {
      formatter: (value) => formatAngka(value),
    },
  },
  fill: {
    opacity: 1,
  },
}))

const series = computed(() =>
  validatedData.value.map((item) => ({
    name: item.name,
    data: item.data,
    color: item.color || '#00C951',
  })),
)

// Pagination methods
const goToPage = async (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // Force chart re-render to prevent SVG path errors
    chartKey.value++
    await nextTick()
    emit('pageChange', page)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
  }
}

// Watch for data changes to reset pagination
watch(
  () => props.data,
  async () => {
    currentPage.value = 1
    chartKey.value++
    await nextTick()
  },
  { deep: true },
)

// Watch for page changes to force re-render
watch(
  () => currentPage.value,
  async () => {
    await nextTick()
  },
)
</script>

<template>
  <q-card flat class="bg-transparent">
    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div v-if="!loading">
        <div class="text-[12px] font-medium text-bgSecondary mb-2" v-if="keterangan">
          {{ keterangan }}
        </div>

        <!-- Chart with key for force re-render -->
        <apexchart
          :key="chartKey"
          type="bar"
          :height="heightCustom"
          :options="chartOptions"
          :series="series"
        />

        <!-- Pagination Controls -->
        <div
          v-if="enablePagination && totalPages > 1"
          class="flex justify-center items-center mt-2 gap-2"
        >
          <q-btn
            flat
            round
            dense
            icon="chevron_left"
            :disable="currentPage === 1"
            @click="prevPage"
            size="sm"
          />

          <div class="flex gap-1">
            <q-btn
              v-for="page in totalPages"
              :key="page"
              flat
              dense
              :label="page"
              :color="currentPage === page ? 'primary' : 'grey-6'"
              :outline="currentPage !== page"
              @click="goToPage(page)"
              size="sm"
              class="min-w-[32px]"
            />
          </div>

          <q-btn
            flat
            round
            dense
            icon="chevron_right"
            :disable="currentPage === totalPages"
            @click="nextPage"
            size="sm"
          />
        </div>

        <!-- Page info -->
        <div
          v-if="enablePagination && totalPages > 1"
          class="text-center text-xs text-gray-500 mt-2"
        >
          Halaman {{ currentPage }} dari {{ totalPages }} ({{ paginatedCategories.length }} dari
          {{ xCategories?.length || 0 }} item)
        </div>
      </div>
    </transition>

    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-card>
</template>

<style scoped>
.min-w-\[32px\] {
  min-width: 32px;
}
</style>

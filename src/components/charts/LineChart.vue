<script setup>
import { computed, onMounted } from 'vue'
import { formatAngka } from '../../utils/formatNumbers'

const props = defineProps({
  data: Array,
  xCategories: Array,
  showAxes: Boolean,
  showLegend: Boolean,
  heightCustom: String,
  theme: String,
  keterangan: String,
  showBorder: Boolean,
  loading: Boolean,
})

const chartOptions = computed(() => ({
  chart: {
    type: 'line',
    height: props.heightCustom,
    background: 'transparent',
    toolbar: { show: false },
    zoom: {
      enabled: false,
    },
  },
  colors: props.data.map((item) => item.color), // Mengambil warna dari series
  grid: { show: props.showBorder },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 3 },
  //   fill: {
  //     type: "gradient",
  //     gradient: { shadeIntensity: 0.5, opacityFrom: 0.6, opacityTo: 0.1 },
  //   },
  xaxis: {
    categories: props.xCategories,
    labels: {
      show: props.showAxes,
      style: {
        colors: 'var(--color-twBlack)',
      },
    },
    axisBorder: { show: props.showBorder },
    axisTicks: { show: props.showBorder },
  },
  yaxis: {
    labels: {
      show: props.showAxes,
      style: {
        colors: 'var(--color-twBlack)', // warna teks y-axis
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
    showForSingleSeries: true,
  },
  tooltip: {
    enabled: true,
    theme: props.theme, // Mengubah tooltip menjadi warna gelap
    y: {
      formatter: (value) => formatAngka(value), // Format angka di tooltip
    },
    // style: {
    //   fontSize: "12px",
    //   background: "#1E293B", // Warna dark blue sesuai tema
    //   color: "#ffffff", // Warna teks putih
    // },
    // x: { show: true },
    // y: {
    //   formatter: (val) => `Rp ${val.toLocaleString()}`,
    // },
  },
}))

const series = computed(() =>
  props.data.map((item) => ({
    name: item.name,
    data: item.data,
    color: item.color || '#00c951', // Menyimpan warna di dalam series
  })),
)
onMounted(() => {})
</script>

<template>
  <q-card flat class="bg-transparent">
    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div v-if="!loading">
        <div class="text-[12px] font-medium text-bgSecondary" v-if="keterangan">
          {{ keterangan }}
        </div>
        <apexchart type="line" :height="heightCustom" :options="chartOptions" :series="series" />
      </div>
    </transition>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-card>
</template>

<style></style>

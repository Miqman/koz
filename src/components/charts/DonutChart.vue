<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: { type: Array, default: () => [] },
  showLegend: Boolean,
  heightCustom: { type: String, default: '280' },
  customLegend: { type: Array, default: () => [] },
})

const chartOptions = computed(() => ({
  chart: {
    type: 'donut',
    height: props.heightCustom,
    toolbar: { show: false },
  },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        labels: {
          show: true,
          total: {
            showAlways: true,
            show: true,
            label: 'CCTV Aktif',
            fontWeight: 600,
            formatter: function (w) {
              return `${w.globals.seriesTotals[0]} %`
              //   return `${w.globals.seriesTotals.reduce((a, b) => {
              //     return a + b
              //   }, 0)} %`
            },
          },
        },
      },
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          show: false,
        },
      },
    },
  ],
  labels: ['Aktif', 'Tidak Aktif'],
  colors: props.data[0].color, // Mengambil warna dari series
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 1 },
  grid: {
    padding: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  },
  legend: {
    show: props.showLegend,
    position: 'bottom',
  },
}))

const series = computed(() => props.data[0].data)
</script>

<template>
  <div class="">
    <apexchart type="donut" :height="heightCustom" :options="chartOptions" :series="series" />
  </div>
</template>

<style></style>

<script setup>
import { computed, watchEffect } from 'vue'
import { formatAngka } from '@/utils/formatNumbers'

const props = defineProps({
  data: Array,
  xCategories: Array,
  showAxes: Boolean,
  showLegend: Boolean,
  heightCustom: String,
  typeChart: String,
  isSingleData: Boolean,
  isOposite: Boolean,
  isClickable: Boolean,
  isHorizontal: Boolean,
})

const chartOptions = computed(() => {
  const base = {
    chart: {
      type: props.typeChart || 'bar',
      toolbar: { show: false },
      animations: { enabled: true },
    },
    plotOptions: {
      bar: {
        horizontal: props.isHorizontal,
        borderRadius: 6,
        borderRadiusApplication: 'end',
        dataLabels: { position: props.isHorizontal ? 'right' : 'top' },
        columnWidth: '40%',
        barHeight: props.isHorizontal ? '60%' : undefined,
      },
    },
    dataLabels: {
      enabled: false,
      formatter: (val) => (val == null ? '' : val),
      offsetY: props.isHorizontal ? 0 : 4,
      offsetX: props.isHorizontal ? -20 : 0,
      style: { fontSize: '11px' },
    },
    legend: { show: props.showLegend },
    grid: { show: props.showAxes, strokeDashArray: 4 },
    tooltip: { enabled: true },
    // default axis settings, will be overridden below
    xaxis: { labels: { show: props.showAxes } },
    yaxis: { labels: { show: props.showAxes } },
    colors: props.data?.[0]?.color ? [props.data[0].color] : undefined,
  }

  if (props.isHorizontal) {
    // Horizontal: kategori di yaxis
    base.yaxis = {
      ...base.yaxis,
      categories: props.xCategories,
    }
    base.xaxis = {
      ...base.xaxis,
      // numeric/value axis
      labels: { show: props.showAxes },
    }
  } else {
    // Vertikal: kategori di xaxis
    base.xaxis = {
      ...base.xaxis,
      categories: props.xCategories,
      labels: { show: props.showAxes, rotate: -45 },
    }
    base.yaxis = {
      ...base.yaxis,
      labels: { show: props.showAxes },
    }
  }

  return base
})

const series = computed(() => {
  if (props.data.length == 1) return props.data
  else
    return props.data.map((item) => ({
      name: item.name,
      data: item.data,
      ...(props.typeChart === 'line' ? { type: item.type } : {}),
      color: item.color || '#62b2e9', // Menyimpan warna di dalam series
    }))
})

const emit = defineEmits(['bar-click'])
function onDataPointSelection(event, chartContext, config) {
  if (!props.isClickable) return
  const seriesIndex = config.seriesIndex
  const dataPointIndex = config.dataPointIndex
  const category = props.xCategories?.[dataPointIndex]
  const value = series.value?.[seriesIndex]?.data?.[dataPointIndex]
  emit('bar-click', { seriesIndex, dataPointIndex, category, value })
}
</script>

<template>
  <div class="">
    <apexchart
      :type="typeChart"
      :height="heightCustom"
      :options="{
        ...chartOptions,
        chart: { ...chartOptions.chart, events: { dataPointSelection: onDataPointSelection } },
      }"
      :series="series"
    />
  </div>
</template>

<style></style>

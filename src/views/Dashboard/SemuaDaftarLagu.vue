<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { moment } from '@/utils/mixing'
import { useDashboardStore } from '@/stores/dashbaord-store'
import { formatDate } from '@/utils/formatDate'
import { useRoute, useRouter } from 'vue-router'
import ListTipeLagu from './components/ListTipeLagu.vue'

const dsbStore = useDashboardStore()
const route = useRoute()
const router = useRouter()

// State
const selectedDate = ref({
  from: moment().startOf('month').format('YYYY-MM-DD'),
  to: moment().endOf('month').format('YYYY-MM-DD'),
})
const selectedMonth = ref(moment().month() + 1)
const monthsOptions = [
  { label: 'Januari', value: 1 },
  { label: 'Februari', value: 2 },
  { label: 'Maret', value: 3 },
  { label: 'April', value: 4 },
  { label: 'Mei', value: 5 },
  { label: 'Juni', value: 6 },
  { label: 'Juli', value: 7 },
  { label: 'Agustus', value: 8 },
  { label: 'September', value: 9 },
  { label: 'Oktober', value: 10 },
  { label: 'November', value: 11 },
  { label: 'Desember', value: 12 },
]
const loading = ref(true)
const dataList = ref([])
const search = ref('')

// computed
const tipeParams = computed(() => {
  return route.params.tipeDaftar
})

const handleMonthChange = (value) => {
  console.log(value, 'value')
  // handle filter by value bulan yaitu 1,2,3 dan seterusnya sampai 12
  const month = value
  const from = moment()
    .month(month - 1)
    .startOf('month')
    .format('YYYY-MM-DD')
  const to = moment()
    .month(month - 1)
    .endOf('month')
    .format('YYYY-MM-DD')
  console.log(from, to, 'from to')
  selectedDate.value.from = from
  selectedDate.value.to = to

  // Update data immediately
  updateData()
}

const payloadDashboard = () => {
  const payload = {
    from: selectedDate.value.from,
    to: selectedDate.value.to,
    search: search.value,
    limit: 10,
    page: 1,
  }
  return payload
}

const getSeringDiputar = async () => {
  console.log('hitt dong')

  loading.value = true
  const payload = payloadDashboard()
  dsbStore
    .getTop5MusikApi(payload.from, payload.to, payload.limit, payload.page, payload.search)
    .then((res) => {
      console.log(res, 'data musik')
      if (res.success) {
        dataList.value = res.data || []
      }
      loading.value = false
    })
}
const getAllMusisiAndWp = async () => {
  loading.value = true
  const payload = payloadDashboard()
  dsbStore
    .getTop5WpMusisiApi(payload.from, payload.to, payload.limit, payload.page, payload.search)
    .then((res) => {
      console.log(res, 'data musik')
      if (res.success) {
        const rawData = res.data
        if (tipeParams.value === 'musisi') {
          dataList.value = rawData?.top_musicians || []
        } else if (tipeParams.value === 'wajib-pajak') {
          dataList.value = rawData?.top_wajib_pajak || []
        }
      }
      loading.value = false
    })
}

const updateData = () => {
  if (tipeParams.value === 'sering-diputar') {
    getSeringDiputar()
  } else if (tipeParams.value === 'musisi') {
    getAllMusisiAndWp()
  } else if (tipeParams.value === 'wajib-pajak') {
    getAllMusisiAndWp()
  }
}

const getParamsTitle = () => {
  const daftarTitle = ['sering-diputar', 'musisi', 'wajib-pajak']
  const tipeDaftar = route.params.tipeDaftar
  console.log(tipeDaftar, 'tipeDaftar')
  if (daftarTitle.includes(tipeDaftar)) {
    if (tipeDaftar === 'sering-diputar') {
      getSeringDiputar()
    } else if (tipeDaftar === 'musisi') {
      getMusisi()
    } else if (tipeDaftar === 'wajib-pajak') {
      getWajibPajak()
    }
  } else {
    router.push({ name: 'not-found' })
  }
}

onMounted(() => {
  getParamsTitle()
})
</script>

<template>
  <q-page class="">
    <!-- Header Card -->
    <div class="flex items-center p-4 gap-2">
      <p class="text-3xl font-semibold">Daftar Lagu</p>
      <q-space></q-space>
      <q-select
        v-model="selectedMonth"
        dense
        class="bg-white"
        :options="monthsOptions"
        outlined
        emit-value
        map-options
        @update:model-value="handleMonthChange"
      />
    </div>

    <div class="container mx-auto space-y-4 p-4">
      <div class="card p-4 space-y-4">
        <div>
          <p class="text-base font-semibold">Daftar Lagu Paling Sering Diputar</p>
          <p class="text-xs text-twSecondary">
            Bulan {{ monthsOptions.find((item) => item.value === selectedMonth)?.label }}
          </p>
        </div>
        <ListTipeLagu :songList="dataList" />
      </div>
    </div>
  </q-page>
</template>

<style scoped></style>

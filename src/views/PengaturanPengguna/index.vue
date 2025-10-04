<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getStatus, moment, wordingRole } from '@/utils/mixing'
import { useRouter } from 'vue-router'
import { useMasterStore } from '@/stores/master-store'
import { useAuthAdminStore } from '@/stores/auth-admin-store'

const router = useRouter()
const masterStore = useMasterStore()
const authStore = useAuthAdminStore()
// const $q = useQuasar()

// State
const selectedDate = ref({
  from: moment().format('YYYY-MM-DD'),
  to: moment().format('YYYY-MM-DD'),
})

const loading = ref(false)
// const isShowFitur = ref(false)
const search = ref('')
const pagination = ref({
  rowsPerPage: 1000,
})

const selectedTipe = ref('')
const selectedMerk = ref('')

const tipeOptions = ref([
  {
    label: 'Perorangan',
    value: 'perorangan',
  },
])

const merkOptions = ref([
  {
    label: 'Jakarta',
    value: 'jakarta',
  },
])

const columns = ref([
  {
    name: 'id_pengguna',
    label: 'ID Pengguna',
    field: 'id_pengguna',
    align: 'left',
    sortable: true,
  },
  { name: 'username', label: 'Username', field: 'username', align: 'left', sortable: true },
  {
    name: 'nama_lengkap',
    label: 'Nama Lengkap',
    field: 'nama_lengkap',
    align: 'left',
    sortable: true,
  },
  { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
  {
    name: 'jabatan',
    label: 'Jabatan',
    field: 'jabatan',
    format: (val) => `${wordingRole(val)}`,
    align: 'left',
    sortable: true,
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    format: (val) => `${getStatus(val)}`,
    align: 'left',
    sortable: true,
  },
])

const rows = ref([
  {
    id: 1,
    id_pengguna: 'US0001',
    username: 'admin',
    nama_lengkap: 'Admin',
    email: 'admin@gmail.com',
    jabatan: 'Admin',
    status: true,
  },
  {
    id: 2,
    id_pengguna: 'US0002',
    username: 'user',
    nama_lengkap: 'User',
    email: 'user@gmail.com',
    jabatan: 'User',
    status: true,
  },
])

//computed
const userRole = computed(() => {
  return authStore.user?.role
})

const isShowFitur = computed(() => {
  return userRole.value !== 3
})

const editPengguna = (row) => {
  router.push(`/pengaturan-pengguna/edit/${row.id_pengguna}`)
}

const detailPerangkat = (row) => {
  console.log('Detail row data:', row)
  console.log('Row ID:', row.id)
  router.push(`/pengaturan-pengguna/${row.id_pengguna}`)
}

const getAllUsers = () => {
  loading.value = true
  masterStore
    .getUsersApi()
    .then((res) => {
      console.log(res, 'data users')
      if (res.success) {
        rows.value =
          res.data.map((item) => ({
            id_pengguna: item.id,
            username: item.username,
            nama_lengkap: item.full_name,
            email: item.email,
            jabatan: item.role,
            status: item.status,
          })) || []
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const updateData = () => {
  getAllUsers()
}

onMounted(() => {
  updateData()
  if (isShowFitur.value) {
    columns.value.push({
      name: 'aksi',
      label: 'Aksi',
      field: 'aksi',
    })
  }
})
</script>

<template>
  <q-page class="">
    <!-- Header Card -->
    <div class="flex items-center p-4 gap-2">
      <p class="text-3xl font-semibold">Pengaturan Pengguna</p>
      <q-space></q-space>
      <!-- <q-select v-model="selectedMonth" dense class="bg-white" :options="monthsOptions" outlined /> -->
    </div>

    <div class="container mx-auto space-y-4 p-4">
      <div class="card p-4 space-y-4">
        <div class="flex items-center">
          <p class="text-base font-semibold">Daftar Pengguna</p>
          <q-space></q-space>
          <q-btn
            v-if="isShowFitur"
            unelevated
            no-caps
            label="Pengguna"
            color="positive"
            icon="o_add"
            class="!rounded-lg"
            to="/pengaturan-pengguna/tambah"
          />
        </div>
        <div class="flex items-center">
          <!-- <div class="grid grid-cols-1 md:grid-cols-3 gap-4" v-if="isShowFitur"> -->
          <!-- select tipe, wilayah, status -->
          <!-- <q-select
              v-model="selectedTipe"
              label="Tipe"
              dense
              class="bg-white w-[219px]"
              :options="tipeOptions"
              outlined
            />
            <q-select
              v-model="selectedMerk"
              label="Merek"
              dense
              class="bg-white w-[219px]"
              :options="merkOptions"
              outlined
            /> -->
          <!-- </div> -->
          <q-space></q-space>
          <q-input v-model="search" dense class="bg-white" placeholder="Pencarian.." outlined />
        </div>
        <div>
          <q-table
            class="my-sticky-virtscroll-table"
            flat
            bordered
            :rows="rows"
            :columns="columns"
            row-key="name"
            :separator="'cell'"
            :loading="loading"
            :filter="search"
            hide-pagination
            virtual-scroll
            v-model:pagination="pagination"
            :rows-per-page-options="[0]"
          >
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <div class="flex justify-center items-center">
                  <q-chip
                    :color="props.row.status ? 'green' : 'red'"
                    :text-color="props.row.status ? 'white' : 'white'"
                    :label="getStatus(props.row.status)"
                    size="sm"
                    dense
                    class="!rounded-lg"
                  />
                </div>
              </q-td>
            </template>
            <template v-slot:body-cell-aksi="props">
              <q-td :props="props">
                <div class="flex justify-center items-center gap-2">
                  <q-btn
                    unelevated
                    flat
                    color="secondary"
                    icon="o_edit"
                    size="xs"
                    dense
                    class="!rounded-lg"
                    @click="editPengguna(props.row)"
                  />
                  <!-- <q-btn
                    unelevated
                    flat
                    color="secondary"
                    icon="o_visibility"
                    size="xs"
                    dense
                    class="!rounded-lg"
                    @click="detailPerangkat(props.row)"
                  /> -->
                </div>
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style></style>
<style scoped></style>
<style lang="sass">
.my-sticky-virtscroll-table
  /* height or max-height is important */
  max-height: 410px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #F1F5F9
    font-size: 14px
    font-weight: 600

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>

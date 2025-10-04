<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DialogConfirm from '@/components/DialogConfirm.vue'
import { useQuasar, SessionStorage } from 'quasar'
import { usePerangkatStore } from '@/stores/perangkat-store'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const perangkatStore = usePerangkatStore()

const loading = ref(false)
const loadingDetail = ref(false)
const showDialogConfirm = ref(false)

const form = ref({
  id_perangkat: '',
  merk: '',
  tipe: '',
  serial_number: '',
  status: 1,
})

const status_options = [
  { label: 'Aktif', value: 1 },
  { label: 'Tidak Aktif', value: 0 },
]

const tipe_options = [
  { label: 'Restoran', value: 'restoran' },
  { label: 'Hotel', value: 'hotel' },
  { label: 'Toko', value: 'toko' },
  { label: 'Lainnya', value: 'lainnya' },
]

//computed
const isEdit = computed(() => route.name === 'editPengaturanPerangkat' && !!route.params.id)
const perangkatId = computed(() => route.params.id)

const submitPerangkat = () => {
  const payload = {
    device_code: form.value.id_perangkat,
    brand: form.value.merk,
    model: form.value.tipe,
    status: form.value.status == 1 ? 'active' : 'inactive',
    serial_number: form.value.serial_number,
  }

  loading.value = true
  if (!isEdit.value) {
    console.log('Creating new perangkat:', payload)

    perangkatStore
      .createPerangkatApi(payload)
      .then((res) => {
        console.log(res, 'data perangkat')
        if (res.success) {
          showDialogConfirm.value = false
          router.push('/pengaturan-perangkat').then(() => {
            $q.notify({
              type: 'positive',
              message: 'Perangkat berhasil ditambahkan',
              position: 'top',
            })
          })
        } else {
          $q.notify({
            type: 'negative',
            message: res.message || 'Gagal menambahkan perangkat',
            position: 'top',
          })
        }
      })
      .catch((error) => {
        console.error('Error creating perangkat:', error)
        $q.notify({
          type: 'negative',
          message: 'Terjadi kesalahan saat menambahkan perangkat',
          position: 'top',
        })
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    console.log('Updating perangkat:', payload)

    perangkatStore
      .updatePerangkatApi(perangkatId.value, payload)
      .then((res) => {
        console.log(res, 'data perangkat')
        if (res.success) {
          showDialogConfirm.value = false
          router.push('/pengaturan-perangkat').then(() => {
            $q.notify({
              type: 'positive',
              message: 'Perangkat berhasil diperbarui',
              position: 'top',
            })
          })
        } else {
          $q.notify({
            type: 'negative',
            message: res.message || 'Gagal memperbarui perangkat',
            position: 'top',
          })
        }
      })
      .catch((error) => {
        console.error('Error updating perangkat:', error)
        $q.notify({
          type: 'negative',
          message: 'Terjadi kesalahan saat memperbarui perangkat',
          position: 'top',
        })
      })
      .finally(() => {
        loading.value = false
      })
  }
}

const btnSubmitPerangkat = () => {
  // Validasi form
  if (!form.value.merk.trim()) {
    $q.notify({
      type: 'negative',
      message: 'Merek tidak boleh kosong',
      position: 'top',
    })
    return
  }

  if (!form.value.tipe) {
    $q.notify({
      type: 'negative',
      message: 'Tipe harus dipilih',
      position: 'top',
    })
    return
  }

  showDialogConfirm.value = true
}

const getPerangkatById = () => {
  if (isEdit.value && perangkatId.value) {
    loadingDetail.value = true
    perangkatStore
      .getPerangkatByidApi(perangkatId.value)
      .then((res) => {
        console.log(res, 'data perangkat detail')
        if (res.success && res.data) {
          const data = res.data
          form.value = {
            id_perangkat: data.device_code || data.id,
            merk: data.brand || data.merk,
            tipe: data.model || data.tipe,
            serial_number: data.serial_number || data.serial_number,
            status: data.status == 'active' ? 1 : 0,
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching perangkat detail:', error)
        $q.notify({
          type: 'negative',
          message: 'Gagal mengambil data perangkat',
          position: 'top',
        })
      })
      .finally(() => {
        loadingDetail.value = false
      })
  }
}

onMounted(() => {
  console.log('mounted')
  getPerangkatById()
})
</script>

<template>
  <q-page class="">
    <!-- Header Card -->
    <div class="flex items-center p-4 gap-2">
      <p class="text-3xl font-semibold">Pengaturan Perangkat</p>
      <q-space></q-space>
      <!-- <q-select v-model="selectedMonth" dense class="bg-white" :options="monthsOptions" outlined /> -->
    </div>

    <div class="container mx-auto space-y-4 p-4">
      <!-- Section1 -->
      <div class="card p-4 space-y-4">
        <div class="mb-2">
          <p class="text-base font-semibold">
            {{ isEdit ? 'Formulir Edit Perangkat' : 'Formulir Perangkat Baru' }}
          </p>
          <p class="text-xs text-twSecondary">
            Silakan isi formulir di bawah ini dengan data yang benar dan dapat dipertanggungjawabkan
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="loadingDetail" class="flex justify-center items-center py-8">
          <q-spinner-dots size="50px" color="primary" />
          <span class="ml-3 text-gray-600">Memuat data perangkat...</span>
        </div>

        <!-- Formulir -->
        <div v-else class="space-y-4 mt-6">
          <!-- ID Wajib Pajak dan NPWPD -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="" class="starlabel">ID Perangkat</label>
              <q-input
                v-model="form.id_perangkat"
                dense
                class="bg-white"
                placeholder="ID Perangkat / code perangkat"
                outlined
                :readonly="isEdit"
              />
              <p v-if="isEdit" class="text-xs text-gray-500 mt-1">Terisi otomatis oleh sistem</p>
            </div>
            <div>
              <label for="" class="starlabel">Merek</label>
              <q-input
                v-model="form.merk"
                dense
                class="bg-white"
                placeholder="Masukkan Merek"
                outlined
              />
            </div>

            <!-- Tipe dan Status -->
            <div>
              <label for="" class="starlabel">Tipe</label>
              <q-input
                v-model="form.tipe"
                dense
                class="bg-white"
                placeholder="Masukkan tipe / model"
                outlined
              />
            </div>
            <div>
              <label for="" class="starlabel">Serial Number</label>
              <q-input
                v-model="form.serial_number"
                dense
                class="bg-white"
                placeholder="Masukkan serial number"
                outlined
              />
            </div>
            <div>
              <label for="" class="starlabel">Status</label>
              <q-select
                v-model="form.status"
                dense
                class="bg-white"
                :options="status_options"
                placeholder="Pilih status"
                emit-value
                map-options
                outlined
              />
            </div>
          </div>

          <!-- Perangkat Terinstal dan Status -->
          <!-- <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="" class="starlabel">Perangkat Terinstal</label>
              <q-select
                v-model="form.perangkat_terinstal"
                dense
                class="bg-white"
                :options="perangkat_options"
                placeholder="Pilih Perangkat"
                outlined
              />
            </div>
            <div>
              <label for="" class="starlabel">Status</label>
              <div class="flex items-center space-x-4">
                <q-toggle v-model="form.status" label="Aktif" />
              </div>
            </div>
          </div> -->
        </div>

        <!-- button batal dan simpan -->
        <div class="flex justify-end gap-2">
          <q-btn
            label="Batal"
            no-caps
            class="!rounded-lg"
            unelevated
            outline
            color="secondary"
            @click="router.back()"
          />
          <q-btn
            label="Simpan"
            no-caps
            class="!rounded-lg"
            unelevated
            color="secondary"
            :loading="loading"
            @click="btnSubmitPerangkat"
          />
        </div>
      </div>
    </div>

    <DialogConfirm
      v-model="showDialogConfirm"
      ref="dialogConfirm"
      :title="isEdit ? 'Konfirmasi Perbaruan Perangkat' : 'Konfirmasi Pembuatan Perangkat Baru'"
      :description="
        isEdit
          ? 'Anda yakin ingin mengupdate perangkat?'
          : 'Anda yakin ingin membuat perangkat baru?'
      "
      position="right"
      :buttons="[
        {
          label: 'Batal',
          outline: true,
          dense: true,
          color: 'primary',
        },
        {
          label: 'Yakin',
          dense: true,
          color: 'primary',
          onClick: submitPerangkat,
          loading: loading,
          closePopup: false,
        },
      ]"
    >
    </DialogConfirm>
  </q-page>
</template>

<style scoped>
:deep(.q-tab-panel) {
  padding: 0 16px 16px 16px;
}

.starlabel::after {
  content: ' *';
  color: red;
}
</style>

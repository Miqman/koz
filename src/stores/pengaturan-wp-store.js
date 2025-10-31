import { defineStore } from 'pinia'
import api from '@/utils/axios'
import { toast } from 'vue3-toastify'

export const usePengaturanWpStore = defineStore('pengaturan-wp-store', {
  state: () => ({
    dataPengaturanWp: null,
  }),
  getters: {},
  actions: {
    async getListPengaturanWpApi() {
      try {
        const response = await api.get(`/api/users`)
        // console.log(response, 'data dashboard')
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
    async getPengaturanWpByIdApi(id) {
      try {
        const response = await api.get(`/api/users/${id}`)
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
    async createPengaturanWpApi(data) {
      try {
        const response = await api.post(`/api/users`, data)
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
    async updatePengaturanWpApi(id, data) {
        //data payload
        // {
        //     "email": "wpafrika3@gmail.com",
        //     "provinsi": "Jawa Barat",
        //     "kabupaten_kota": "Bandung",
        //     "nama": "Kafe Kopi Hitam 0008880",
        //     "alamat": "Jl. Asia Afrika No.10",
        //     "koordinat": "-6.9219,107.6078",
        //     "nopd": "11223f3222sad2222",
        //     "npwpd": "99887722s22sa222222",
        //     "is_active": 0 //0 atau 1
        //   }
      try {
        const response = await api.patch(`/api/users/${id}`, data)
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
    async deletePengaturanWpApi(id) {
      try {
        const response = await api.delete(`/api/users/${id}`)
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },

    async updatePasswordPengaturanWpApi(id, data) {
        //data payload
        // {
        //     "old_password": "p@ssw0rd123!", // bisa tanpa ini
        //     "new_password": "baru123",
        //     "confirm_password": "baru123"
        //   }
      try {
        const response = await api.patch(`/api/users/update-password/${id}`, data)
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
  },
})

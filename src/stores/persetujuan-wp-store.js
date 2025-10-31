import { defineStore } from 'pinia'
import api from '@/utils/axios'
import { toast } from 'vue3-toastify'

export const usePersetujuanWpStore = defineStore('persetujuan-wp-store', {
  state: () => ({
    dataPersetujuanWp: null,
  }),
  getters: {},
  actions: {
    async getListPersetujuanWpApi() {
      try {
        const response = await api.get(`/api/users/pending`)
        // console.log(response, 'data dashboard')
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
    async approvalPersetujuanWpApi(id, data) {
      try {
        const response = await api.patch(`api/users/activate/${id}`, data)
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
  },
})

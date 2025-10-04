import { defineStore } from 'pinia'
import api from '@/utils/axios'
import { toast } from 'vue3-toastify'

export const useWpStore = defineStore('wp-store', {
  state: () => ({
    dataWp: null,
  }),
  getters: {},
  actions: {
    async getWPApi() {
      try {
        const response = await api.get(`/api/v1/venues`)
        // console.log(response, 'data dashboard')
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
    async getWPByidApi(id) {
      try {
        const response = await api.get(`/api/v1/venues/${id}`)
        // console.log(response, 'data dashboard')
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
    async getWPDetailApi(id) {
      try {
        const response = await api.get(`/api/v1/aktifitas-music/venue/${id}`)
        // console.log(response, 'data dashboard')
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },

    // create wp
    async createWpApi(data) {
      try {
        const response = await api.post('/api/v1/venues', data)
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },

    // update wp
    async updateWpApi(id, data) {
      try {
        const response = await api.put(`/api/v1/venues/${id}`, data)
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },

    // delete wp
    async deleteWpApi(id) {
      try {
        const response = await api.delete(`/api/v1/venues/${id}`)
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
  },
})

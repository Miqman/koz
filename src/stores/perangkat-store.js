import { defineStore } from 'pinia'
import api from '@/utils/axios'
import { toast } from 'vue3-toastify'

export const usePerangkatStore = defineStore('perangkat-store', {
  state: () => ({
    dataPerangkat: null,
  }),
  getters: {},
  actions: {
    async getPerangkatApi(search, status, page, limit) {
      try {
        const response = await api.get(
          `/api/v1/devices?page=${page}&limit=${limit}&search=${search}&status=${status}`,
        )
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
    async getPerangkatByidApi(id) {
      try {
        const response = await api.get(`/api/v1/devices/${id}`)
        // console.log(response, 'data dashboard')
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
    async getPerangkatDetailApi(id) {
      try {
        const response = await api.get(`/api/v1/devices/${id}`)
        // console.log(response, 'data dashboard')
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },

    async createPerangkatApi(data) {
      try {
        const response = await api.post('/api/v1/devices', data)
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },

    async updatePerangkatApi(id, data) {
      try {
        const response = await api.put(`/api/v1/devices/${id}`, data)
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },

    async deletePerangkatApi(id) {
      try {
        const response = await api.delete(`/api/v1/devices/${id}`)
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
  },
})

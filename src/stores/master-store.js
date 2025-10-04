import { defineStore } from 'pinia'
import api from '@/utils/axios'
import { toast } from 'vue3-toastify'

export const useMasterStore = defineStore('master-store', {
  state: () => ({
    dataMaster: null,
  }),
  getters: {},
  actions: {
    // Kota / Kabupaten
    async getKotaKabupatenApi() {
      try {
        const response = await api.get(`/api/v1/master-data/kota-kabupaten`)
        // console.log(response, 'data dashboard')
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
    // get by id, create, update, delete
    async getKotaKabupatenByIdApi(id) {
      try {
        const response = await api.get(`/api/v1/master-data/kota-kabupaten/${id}`)
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
    async createKotaKabupatenApi(data) {
      try {
        const response = await api.post(`/api/v1/master-data/kota-kabupaten`, data)
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
    async updateKotaKabupatenApi(id, data) {
      try {
        const response = await api.put(`/api/v1/master-data/kota-kabupaten/${id}`, data)
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
    async deleteKotaKabupatenApi(id) {
      try {
        const response = await api.delete(`/api/v1/master-data/kota-kabupaten/${id}`)
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },

    // Tipe Vanue
    async getTipeVanueApi() {
      try {
        const response = await api.get(`/api/v1/master-data/tipe-venue`)
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
    // get by id, create, update, delete
    async getTipeVanueByIdApi(id) {
      try {
        const response = await api.get(`/api/v1/master-data/tipe-venue/${id}`)
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
    async createTipeVanueApi(data) {
      try {
        const response = await api.post(`/api/v1/master-data/tipe-venue`, data)
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
    async updateTipeVanueApi(id, data) {
      try {
        const response = await api.put(`/api/v1/master-data/tipe-venue/${id}`, data)
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
    async deleteTipeVanueApi(id) {
      try {
        const response = await api.delete(`/api/v1/master-data/tipe-venue/${id}`)
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },

    // users
    async getUsersApi() {
      try {
        const response = await api.get(`/api/v1/users`)
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
    async getUsersByIdApi(id) {
      try {
        const response = await api.get(`/api/v1/users/${id}`)
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
    async createUsersApi(data) {
      try {
        const response = await api.post(`/api/v1/users`, data)
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
    async updateUsersApi(id, data) {
      try {
        const response = await api.put(`/api/v1/users/${id}`, data)
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
    async deleteUsersApi(id) {
      try {
        const response = await api.delete(`/api/v1/users/${id}`)
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
    async updateUserPasswordApi(id, data) {
      try {
        const response = await api.put(`/api/v1/users/${id}/password`, data)
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
  },
})

import { defineStore } from 'pinia'
import api from '@/utils/axios'
import { toast } from 'vue3-toastify'

export const useDashboardStore = defineStore('dashboard-royal', {
  state: () => ({
    dataInfoDashboard: null,
    dataMusikLatest: [],
    musikLatest: [],
  }),
  getters: {},
  actions: {
    // Dashboard Pemutaran Lagu
    async getAktifitasMusikApi(startDate, endDate) {
      try {
        const response = await api.get(
          `/api/v1/aktifitas-music/stats/total?startDate=${startDate}&endDate=${endDate}`,
        )
        // console.log(response, 'data dashboard')
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },

    async getTop5MusikApi(startDate, endDate, limit = 5, page = 1, search = '') {
      try {
        const response = await api.get(
          `/api/v1/aktifitas-music/top-songs?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}&search=${search}`,
        )
        // console.log(response, 'data dashboard')
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },

    async getGraphMusikApi(startDate, endDate) {
      try {
        const response = await api.get(
          `/api/v1/aktifitas-music/stats/hour-ranges?startDate=${startDate}&endDate=${endDate}`,
        )
        // console.log(response, 'data dashboard')
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },

    async getMusikLatestApi(startDate, endDate) {
      try {
        const response = await api.get(
          `/api/v1/aktifitas-music/latest?page=1&limit=3&startDate=${startDate}&endDate=${endDate}`,
        )
        // console.log(response, 'data dashboard')
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },

    async getTop5WpMusisiApi(startDate, endDate) {
      try {
        const response = await api.get(
          `/api/v1/aktifitas-music/top-performers?page=1&limit=5&startDate=${startDate}&endDate=${endDate}`,
        )
        // console.log(response, 'data dashboard')
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },

    // Dashboard Perangkat
    async getPerangkatDashboardStatusApi(startDate, endDate) {
      try {
        const response = await api.get(
          `/api/v1/venues/dashboard/stats?startDate=${startDate}&endDate=${endDate}`,
        )
        // console.log(response, 'data dashboard')
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
    async getLokasiPerangkatApi(search, status, startDate, endDate) {
      try {
        const response = await api.get(
          `/api/v1/venues/dashboard/locations?search=${search}&status=${status}&startDate=${startDate}&endDate=${endDate}`,
        )
        // console.log(response, 'data dashboard')
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },

    // getJenisPerangkatApi
    async getJenisPerangkatApi(brand, type, status, search, page, limit, startDate, endDate) {
      try {
        const response = await api.get(
          `/api/v1/venues/dashboard/device-types?brand=${brand}&type=${type}&status=${status}&search=${search}&page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`,
        )
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
    // getLogPerwatanPerangkatApi
    async getLogPerwatanPerangkatApi(officer, search, page, limit, startDate, endDate) {
      try {
        const response = await api.get(
          `/api/v1/venues/dashboard/maintenance-log?officer=${officer}&search=${search}&page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`,
        )
        return response.data
      } catch (error) {
        console.log(error)
        console.log(error.response)
        return null
      }
    },
  },
})

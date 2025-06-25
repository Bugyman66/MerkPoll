import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

export const useElectionStore = defineStore('election', {
  state: () => ({
    elections: [],
    currentElection: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchElections() {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get(`${API_BASE_URL}/elections`)
        this.elections = response.data || []
        return { elections: response.data || [] }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch elections'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchElection(id) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get(`${API_BASE_URL}/elections/${id}`)
        this.currentElection = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch election'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createElection(electionData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post(`${API_BASE_URL}/elections`, electionData)
        this.elections.unshift(response.data.election)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create election'
        throw error
      } finally {
        this.loading = false
      }
    },

    async submitVote(electionId, voteData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post(`${API_BASE_URL}/vote`, {
          electionId,
          ...voteData
        })
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to submit vote'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})

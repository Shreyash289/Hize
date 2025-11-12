"use client"

import axios from "axios"
import { toast } from "sonner" 

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
})

axiosClient.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    console.error("❌ Request Error:", error)
    toast.error("Request setup failed.")
    return Promise.reject(error)
  }
)

axiosClient.interceptors.response.use(
  (response) => {
    const data = response.data

    if (data?.success && data?.message) {
      toast.success(data.message)
    }

    return response
  },
  (error) => {
    const err = error.response?.data?.error
    const status = error.response?.status

    if (err && err.message) {
      const msg = `${err.message}${err.code ? ` (${err.code})` : ""}`
      if (status >= 500) toast.error(`💥 Server error: ${msg}`)
      else toast.warning(`⚠️ ${msg}`)
    } 
    else if (error.message) {
      toast.error(`Unexpected error: ${error.message}`)
    } else {
      toast.error("An unknown error occurred.")
    }

    console.error("❌ API Error:", error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default axiosClient

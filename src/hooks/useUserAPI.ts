"use client"

import { useState } from "react"
import axiosClient from "@/lib/axiosClient"

export interface IUser {
  _id?: string
  name: string
  regNo: string
  email: string
  department: string
  college: string
  idCard?: string
  idCardStatus?: "pending" | "uploaded"
  createdAt?: string
  updatedAt?: string
}

interface ApiResponse<T> {
  success: boolean
  data?: { user?: T }
  error?: { code?: string; message?: string; details?: string }
}

const API_BASE = "/user" // this gets prefixed with baseURL from axiosClient

export const useUserAPI = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ✅ REGISTER
  const registerUser = async (formData: IUser, file: File | null) => {
    setLoading(true)
    setError(null)
    try {
      const data = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value.toString())
      })
      if (file) data.append("idCard", file)

      const res = await axiosClient.post<ApiResponse<IUser>>(`${API_BASE}/register`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      if (!res.data.success) throw new Error(res.data.error?.message || "Registration failed")

      return res.data.data?.user || null
    } catch (err: any) {
      console.error("❌ Register Error:", err)
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  // ✅ UPDATE
  const updateUser = async (id: string, updates: Partial<IUser>, file?: File) => {
    setLoading(true)
    setError(null)
    try {
      const data = new FormData()
      Object.entries(updates).forEach(([key, value]) => {
        if (value) data.append(key, value.toString())
      })
      if (file) data.append("idCard", file)

      const res = await axiosClient.put<ApiResponse<IUser>>(`${API_BASE}/update/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      if (!res.data.success) throw new Error(res.data.error?.message || "Update failed")

      return res.data.data?.user || null
    } catch (err: any) {
      console.error("❌ Update Error:", err)
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  // ✅ GET USER
  const getUser = async (email: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await axiosClient.get<ApiResponse<IUser>>(`${API_BASE}/${email}`)
      if (!res.data.success) throw new Error(res.data.error?.message || "Failed to fetch user")

      return res.data.data?.user || null
    } catch (err: any) {
      console.error("❌ GetUser Error:", err)
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, registerUser, updateUser, getUser }
}

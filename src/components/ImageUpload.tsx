"use client"

import React, { useState, useRef, useEffect } from "react"
import { Upload, X, Eye, Loader2, RefreshCw } from "lucide-react"

export default function ImageUpload({
  value,
  onChange,
  disabled,
  uploading,
}: {
  value?: string | null
  onChange: (file: File | null) => void
  disabled?: boolean
  uploading?: boolean
}) {
  const [preview, setPreview] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // load preview when backend sends an image URL
  useEffect(() => {
    if (value && typeof value === "string") {
      setPreview(value)
    } else if (!value) {
      setPreview(null)
    }
  }, [value])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      onChange(file)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleReplace = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || uploading}
      />

      {preview ? (
        <div className="relative group">
          <div className="relative w-full h-48 bg-gray-800/50 rounded-lg overflow-hidden border-2 border-gray-700">
            <img src={preview || undefined} alt="ID Card Preview" className="w-full h-full object-cover" />

            {uploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-white">Uploading...</p>
                </div>
              </div>
            )}
          </div>

          {!disabled && !uploading && (
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-lg"
              >
                <Eye className="w-4 h-4 text-white" />
              </button>

              <button
                type="button"
                onClick={handleReplace}
                className="p-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition shadow-lg"
              >
                <RefreshCw className="w-4 h-4 text-white" />
              </button>

              <button
                type="button"
                onClick={handleRemove}
                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition shadow-lg"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
          className="w-full h-48 border-2 border-dashed border-gray-700 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition flex flex-col items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="p-4 bg-gray-800 rounded-full group-hover:bg-gray-700 transition">
            <Upload className="w-8 h-8 text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-white font-medium">Click to upload ID card</p>
            <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 5MB</p>
          </div>
        </button>
      )}

      {showPreview && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <img
              src={preview || undefined}
              alt="ID Card Full Preview"
              className="max-w-full max-h-[90vh] rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  )
}

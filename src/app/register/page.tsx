"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import RegisterForm from "@/components/RegisterForm"
import LoginPopup from "@/components/LoginPopup"
import DynamicBackground from "@/components/DynamicBackground"
import MagneticCursor from "@/components/MagneticCursor"

const EnhancedCountdown = dynamic(() => import("@/components/EnhancedCountdown"), {
  ssr: false,
  loading: () => (
    <div className="w-full md:w-1/2 p-6 flex items-center justify-center">
      <div className="w-full max-w-[900px] aspect-square bg-black/10 rounded-3xl" />
    </div>
  ),
})

export default function RegisterPage() {
  const [isEditMode, setIsEditMode] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  const handleLogin = (data: any) => {
    setUserData(data)
    setIsEditMode(true)
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen p-4 md:p-8 relative">
      <DynamicBackground />
      <MagneticCursor />

      <div className="relative z-10 w-full flex justify-center p-4">
        <RegisterForm userData={userData} isEditMode={isEditMode} onRequestEdit={() => setIsEditMode(true)} />
      </div>

      <div className="w-full md:w-1/2 flex justify-center p-4">
        <EnhancedCountdown />
      </div>

      {isEditMode && <LoginPopup onLogin={handleLogin} onClose={() => setIsEditMode(false)} />}
    </div>
  )
}

"use client"

import Image from "next/image"
import { Mail, Phone } from "lucide-react"
import { useState } from "react"
import type { FacultyContact } from "@/lib/facultyContacts"

export default function FacultyCard({
  coordinator,
  variant = "tile",
  index = 0,
}: {
  coordinator: FacultyContact
  variant?: "tile" | "card"
  index?: number
}) {
  const [imgError, setImgError] = useState(false)

  const initials = coordinator.name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const containerCommon =
    "rounded-3xl bg-gradient-to-br from-black/60 to-zinc-900/60 backdrop-blur-xl border border-orange-500/20"

  if (variant === "card") {
    return (
      <div className={`relative p-8 ${containerCommon} space-y-6`}>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-orange-500/30 bg-white/5 flex items-center justify-center text-2xl text-white">
            {!imgError ? (
              <Image
                src={coordinator.image}
                alt={coordinator.name}
                fill
                className="object-cover"
                sizes="96px"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-orange-600/40">
                {initials}
              </div>
            )}
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">{coordinator.name}</h3>
            <p className="text-slate-400 font-serif">{coordinator.designation || coordinator.role}</p>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-white/10">
          <a
            href={`mailto:${coordinator.email}`}
            className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-600 to-orange-400 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-sm font-mono break-all">{coordinator.email}</span>
          </a>

          <a
            href={`tel:${coordinator.phone.replace(/\s/g, '')}`}
            className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-sm font-mono">{coordinator.phone}</span>
          </a>
        </div>
      </div>
    )
  }

  // variant "tile" used on contact page
  return (
    <div className="clay-card overflow-hidden group">
      <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-secondary via-accent to-muted">
        {!imgError ? (
          <Image
            src={coordinator.image}
            alt={coordinator.name}
            fill
            className="object-cover transition-transform duration-400 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
            priority={index < 3}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary text-white text-3xl">
            {initials}
          </div>
        )}
      </div>
      <div className="p-6 space-y-4">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold">{coordinator.name}</h3>
          <p className="text-muted-foreground font-serif">{coordinator.designation}</p>
          <p className="text-sm text-muted-foreground/80">{coordinator.role}</p>
        </div>
      </div>
    </div>
  )
}
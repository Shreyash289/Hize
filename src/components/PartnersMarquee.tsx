"use client"

import { useState, useEffect } from "react"
import Marquee from "react-fast-marquee"

interface Partner {
  name: string
  logo: string
  url?: string
}

export default function PartnersMarquee() {
  const [partners, setPartners] = useState<Partner[]>([])

  useEffect(() => {
    fetch("/data/partners.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load partners")
        return res.json()
      })
      .then((data) => {
        setPartners(data || [])
      })
      .catch(() => {
        setPartners([])
      })
  }, [])

  if (partners.length === 0) {
    return null
  }

  // Duplicate partners array for seamless loop
  const duplicatedPartners = [...partners, ...partners]

  // Helper function to format URL
  const formatUrl = (url: string) => {
    if (!url) return ""
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url
    }
    return `https://${url}`
  }

  return (
    <div className="relative bg-gradient-to-b from-white via-gray-50 to-white py-12 md:py-16 overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"></div>
      
      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"></div>
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="relative z-10">
        <Marquee
          speed={50}
          gradient={false}
          pauseOnHover={true}
          pauseOnClick={true}
          className="overflow-hidden"
        >
          {duplicatedPartners.map((partner, index) => (
            <div 
              key={`${partner.name}-${index}`} 
              className="mx-8 md:mx-12 flex items-center justify-center group"
            >
              {partner.url ? (
                <a
                  href={formatUrl(partner.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative"
                >
                  <div className="relative px-6 py-4 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-lg hover:border-orange-300/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 group-hover:bg-white">
                    {/* Subtle glow on hover */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 via-orange-400/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:via-orange-400/10 group-hover:to-orange-500/5 transition-all duration-300 opacity-0 group-hover:opacity-100 -z-10 blur-xl"></div>
                    
                    <img
                      alt={partner.name}
                      src={partner.logo}
                      className="h-16 md:h-20 w-auto object-contain transition-all duration-300 filter drop-shadow-sm group-hover:drop-shadow-md"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                </a>
              ) : (
                <div className="relative px-6 py-4 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-lg hover:border-orange-300/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 group-hover:bg-white">
                  {/* Subtle glow on hover */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 via-orange-400/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:via-orange-400/10 group-hover:to-orange-500/5 transition-all duration-300 opacity-0 group-hover:opacity-100 -z-10 blur-xl"></div>
                  
                  <img
                    alt={partner.name}
                    src={partner.logo}
                    className="h-16 md:h-20 w-auto object-contain transition-all duration-300 filter drop-shadow-sm group-hover:drop-shadow-md"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </Marquee>
      </div>
      
      {/* Decorative side gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/50 to-transparent pointer-events-none z-20"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/50 to-transparent pointer-events-none z-20"></div>
    </div>
  )
}


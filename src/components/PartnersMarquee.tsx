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
          speed={80}
          gradient={false}
          pauseOnHover={true}
          pauseOnClick={true}
          className="overflow-hidden"
        >
          {duplicatedPartners.map((partner, index) => {
            const isGradeX = partner.name === "GradeX"
            
            return (
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
                    <div 
                      className={`relative px-6 py-4 rounded-xl backdrop-blur-sm shadow-sm transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${
                        isGradeX 
                          ? "bg-gradient-to-br from-white/95 via-white/90 to-white/95 border-2 border-[#FFD700]/60 hover:border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.25)] hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] group-hover:bg-gradient-to-br group-hover:from-white group-hover:via-white/98 group-hover:to-white"
                          : "bg-white/80 border border-gray-200/50 hover:border-orange-300/50 hover:shadow-lg group-hover:bg-white"
                      }`}
                      style={isGradeX ? { borderColor: 'rgba(255, 215, 0, 0.6)', boxShadow: '0 0 20px rgba(255, 215, 0, 0.25)' } : {}}
                    >
                      {/* Gold glow for GradeX */}
                      {isGradeX && (
                        <>
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFD700]/0 via-[#FFD700]/8 to-[#FFD700]/0 group-hover:from-[#FFD700]/15 group-hover:via-[#FFD700]/20 group-hover:to-[#FFD700]/15 transition-all duration-300 opacity-100 -z-10 blur-xl" style={{ background: 'linear-gradient(to right, rgba(255,215,0,0), rgba(255,215,0,0.08), rgba(255,215,0,0))' }}></div>
                          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#FFD700]/30 via-transparent to-[#FFD700]/30 opacity-0 group-hover:opacity-100 transition-all duration-300 -z-20 blur-sm"></div>
                        </>
                      )}
                      {/* Subtle glow on hover for other partners */}
                      {!isGradeX && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 via-orange-400/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:via-orange-400/10 group-hover:to-orange-500/5 transition-all duration-300 opacity-0 group-hover:opacity-100 -z-10 blur-xl"></div>
                      )}
                      
                      <img
                        alt={partner.name}
                        src={partner.logo}
                        className={`h-16 md:h-20 w-auto object-contain transition-all duration-300 ${
                          isGradeX 
                            ? "filter drop-shadow-[0_2px_8px_rgba(255,215,0,0.3)] group-hover:drop-shadow-[0_4px_12px_rgba(255,215,0,0.5)]"
                            : "filter drop-shadow-sm group-hover:drop-shadow-md"
                        }`}
                        style={isGradeX ? { filter: 'drop-shadow(0 2px 8px rgba(255, 215, 0, 0.3))' } : {}}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  </a>
                ) : (
                  <div 
                    className={`relative px-6 py-4 rounded-xl backdrop-blur-sm shadow-sm transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${
                      isGradeX 
                        ? "bg-gradient-to-br from-white/95 via-white/90 to-white/95 border-2 border-[#FFD700]/60 hover:border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.25)] hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] group-hover:bg-gradient-to-br group-hover:from-white group-hover:via-white/98 group-hover:to-white"
                        : "bg-white/80 border border-gray-200/50 hover:border-orange-300/50 hover:shadow-lg group-hover:bg-white"
                    }`}
                    style={isGradeX ? { borderColor: 'rgba(255, 215, 0, 0.6)', boxShadow: '0 0 20px rgba(255, 215, 0, 0.25)' } : {}}
                  >
                    {/* Gold glow for GradeX */}
                    {isGradeX && (
                      <>
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFD700]/0 via-[#FFD700]/8 to-[#FFD700]/0 group-hover:from-[#FFD700]/15 group-hover:via-[#FFD700]/20 group-hover:to-[#FFD700]/15 transition-all duration-300 opacity-100 -z-10 blur-xl" style={{ background: 'linear-gradient(to right, rgba(255,215,0,0), rgba(255,215,0,0.08), rgba(255,215,0,0))' }}></div>
                        <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#FFD700]/30 via-transparent to-[#FFD700]/30 opacity-0 group-hover:opacity-100 transition-all duration-300 -z-20 blur-sm"></div>
                      </>
                    )}
                    {/* Subtle glow on hover for other partners */}
                    {!isGradeX && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 via-orange-400/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:via-orange-400/10 group-hover:to-orange-500/5 transition-all duration-300 opacity-0 group-hover:opacity-100 -z-10 blur-xl"></div>
                    )}
                    
                    <img
                      alt={partner.name}
                      src={partner.logo}
                      className={`h-16 md:h-20 w-auto object-contain transition-all duration-300 ${
                        isGradeX 
                          ? "filter drop-shadow-[0_2px_8px_rgba(255,215,0,0.3)] group-hover:drop-shadow-[0_4px_12px_rgba(255,215,0,0.5)]"
                          : "filter drop-shadow-sm group-hover:drop-shadow-md"
                      }`}
                      style={isGradeX ? { filter: 'drop-shadow(0 2px 8px rgba(255, 215, 0, 0.3))' } : {}}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </Marquee>
      </div>
      
      {/* Decorative side gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/50 to-transparent pointer-events-none z-20"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/50 to-transparent pointer-events-none z-20"></div>
    </div>
  )
}


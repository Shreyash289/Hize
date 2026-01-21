"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"

interface NavigationProps {
  sections?: string[]
  onSectionClick?: (index: number) => void
  activeSection?: number
  onRegisterClick?: () => void
}

export default function Navigation({ sections, onSectionClick, activeSection, onRegisterClick }: NavigationProps = {}) {
  const pathname = usePathname()
  const isHomepage = pathname === "/"
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    // Use passive listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Generate homepage links dynamically from sections prop, skipping "Hero" (index 0)
  const homepageLinks = sections && sections.length > 0
    ? sections
        .map((label, index) => ({ label, section: index }))
        .filter((_, index) => index > 0) // Skip "Hero" section (index 0)
    : []

  const regularLinks = [
    { href: "/events", label: "Events" },
    { href: "/guests", label: "Guests" },
  ]

  const handleNavClick = (index?: number) => {
    if (isHomepage && index !== undefined && onSectionClick) {
      onSectionClick(index)
    }
    setMobileMenuOpen(false)
  }

  const handleContactClick = () => {
    if (isHomepage && onSectionClick) {
      // Contact is at index 8 in sections array
      onSectionClick(8)
    } else {
      // Navigate to contact page if not on homepage
      window.location.href = "/contact"
    }
    setMobileMenuOpen(false)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-black/60 backdrop-blur-xl border border-orange-500/20 shadow-2xl shadow-orange-500/10"
            : "bg-black/40 backdrop-blur-lg border border-orange-500/10"
        } rounded-xl sm:rounded-2xl mx-auto max-w-7xl`}
      >
        <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-center relative">
          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center gap-1 flex-wrap justify-center max-w-full">
            {isHomepage && sections ? (
              homepageLinks.map((link, idx) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.section)}
                  className={`relative px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    activeSection === link.section
                      ? "text-orange-400 bg-orange-500/10"
                      : "text-gray-300 hover:text-orange-400 hover:bg-white/5"
                  }`}
                >
                  {link.label}
                  {activeSection === link.section && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-lg bg-orange-500/20 border border-orange-500/30 -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))
            ) : (
              <>
                {regularLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      pathname === link.href
                        ? "text-orange-400 bg-orange-500/10"
                        : "text-gray-300 hover:text-orange-400 hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                    {pathname === link.href && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute inset-0 rounded-lg bg-orange-500/20 border border-orange-500/30 -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                ))}
                <button
                  onClick={handleContactClick}
                  className={`relative px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    isHomepage && activeSection === 8
                      ? "text-orange-400 bg-orange-500/10"
                      : "text-gray-300 hover:text-orange-400 hover:bg-white/5"
                  }`}
                >
                  Contact
                  {isHomepage && activeSection === 8 && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-lg bg-orange-500/20 border border-orange-500/30 -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              </>
            )}
            <button
              onClick={() => onRegisterClick?.()}
              className="px-5 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-orange-600 to-orange-400 text-black hover:from-orange-500 hover:to-orange-300 transition-all shadow-lg shadow-orange-500/30 whitespace-nowrap"
            >
              Register
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden absolute right-3 sm:right-4 p-2 rounded-lg text-gray-300 hover:text-orange-400 hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          {/* Mobile Logo - Only on mobile */}
          <Link href="/" className="md:hidden absolute left-3 sm:left-4 flex items-center">
            <Image
              src="/logo_white.png"
              alt="IEEE Computer Society HIZE 2026"
              width={120}
              height={36}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-black/95 backdrop-blur-xl border-l border-orange-500/20 z-50 md:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full pt-24 px-6">
                {isHomepage && sections ? (
                  <div className="flex flex-col gap-2">
                    {homepageLinks.map((link) => (
                      <button
                        key={link.label}
                        onClick={() => handleNavClick(link.section)}
                        className={`text-left px-4 py-3 rounded-lg text-base font-medium transition-all ${
                          activeSection === link.section
                            ? "text-orange-400 bg-orange-500/10 border border-orange-500/30"
                            : "text-gray-300 hover:text-orange-400 hover:bg-white/5"
                        }`}
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {regularLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`px-4 py-3 rounded-lg text-base font-medium transition-all ${
                          pathname === link.href
                            ? "text-orange-400 bg-orange-500/10 border border-orange-500/30"
                            : "text-gray-300 hover:text-orange-400 hover:bg-white/5"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <button
                      onClick={handleContactClick}
                      className={`px-4 py-3 rounded-lg text-base font-medium transition-all ${
                        isHomepage && activeSection === 8
                          ? "text-orange-400 bg-orange-500/10 border border-orange-500/30"
                          : "text-gray-300 hover:text-orange-400 hover:bg-white/5"
                      }`}
                    >
                      Contact
                    </button>
                  </div>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onRegisterClick?.()
                  }}
                  className="mt-6 px-6 py-3 rounded-lg text-base font-bold text-center bg-gradient-to-r from-orange-600 to-orange-400 text-black hover:from-orange-500 hover:to-orange-300 transition-all shadow-lg shadow-orange-500/30 w-full"
                >
                  Register Now
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
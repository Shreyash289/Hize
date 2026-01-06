"use client";

import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  X,
  Calendar,
  MapPin,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

/* -------------------------------
   Types
-------------------------------- */
interface PricingOption {
  id: string;
  label: string;
  basePrice: number;
  url: string;
}

interface RegistrationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

/* -------------------------------
   Constants
-------------------------------- */
const PRICING_OPTIONS: PricingOption[] = [
  {
    id: "srm-ieee",
    label: "IEEE Member (SRM Student)",
    basePrice: 199,
    url: "https://konfhub.com/high-impact-zonal-event-2026",
  },
  {
    id: "srm-non-ieee",
    label: "Non-IEEE Member + SRM Student",
    basePrice: 299,
    url: "https://konfhub.com/high-impact-zonal-event-2026",
  },
  {
    id: "non-srm-ieee",
    label: "IEEE Member (Non-SRM Student)",
    basePrice: 299,
    url: "https://konfhub.com/high-impact-zonal-event-2026",
  },
  {
    id: "non-srm-non-ieee",
    label: "Non-IEEE Member (Non-SRM...)",
    basePrice: 399,
    url: "https://konfhub.com/high-impact-zonal-event-2026",
  },
];

/* -------------------------------
   Animation Variants
-------------------------------- */
const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
  },
};

const mobileSheetVariants: Variants = {
  hidden: { y: "100%" },
  visible: {
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    y: "100%",
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1],
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

/* -------------------------------
   Component
-------------------------------- */
export default function RegistrationPopup({
  isOpen,
  onClose,
}: RegistrationPopupProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [includeGoodies, setIncludeGoodies] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ESC key close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleKeyDown]);

  const handleRegisterOnKonfHub = () => {
    window.open("https://konfhub.com/high-impact-zonal-event-2026", "_blank", "noopener,noreferrer");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="registration-title"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm px-4"
        onClick={onClose}
      >
        {/* Desktop Modal */}
        {!isMobile && (
          <motion.div
            variants={modalVariants}
            className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl bg-black border border-[#FACC15]/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close registration modal"
              className="absolute right-4 top-4 z-10 rounded-full bg-black/80 border border-[#FACC15]/30 p-2 text-white hover:bg-[#FACC15]/10 hover:border-[#FACC15]/50 transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
              {/* Left Panel - Visual */}
              <div className="relative bg-black p-8 lg:p-12 flex flex-col justify-between overflow-hidden">
                {/* Gradient Glow Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FACC15]/20 via-[#F97316]/10 to-transparent opacity-50" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#FACC15]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F97316]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10">
                  {/* Logo */}
                  <div className="mb-8">
                    <Image
                      src="/logo_white.png"
                      alt="HIZE Logo"
                      width={120}
                      height={40}
                      className="h-10 w-auto"
                    />
                  </div>

                  {/* Tagline */}
                  <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                    High Impact.
                    <br />
                    <span className="bg-gradient-to-r from-[#FACC15] to-[#F97316] bg-clip-text text-transparent">
                      Real Innovation.
                    </span>
                  </h2>

                  {/* Event Info */}
                  <div className="space-y-4 mt-8">
                    <div className="flex items-center gap-3 text-gray-300">
                      <Calendar className="h-5 w-5 text-[#FACC15]" />
                      <span className="text-lg">January 2026</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <MapPin className="h-5 w-5 text-[#FACC15]" />
                      <span className="text-lg">SRM IST</span>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="relative z-10 mt-auto">
                  <div className="flex gap-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 bg-gradient-to-r from-[#FACC15] to-[#F97316] rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Panel - Tickets Showcase */}
              <div className="bg-[#0B0B0B] p-8 lg:p-12 flex flex-col overflow-y-auto">
                {/* Header */}
                <div className="mb-8">
                  <h3
                    id="registration-title"
                    className="text-3xl font-bold text-[#FACC15] mb-2"
                  >
                    Event Tickets
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Jan 6 - Jan 28, 2026 • Choose your ticket category
                  </p>
                  {/* EARLYBIRD Discount Banner */}
                  <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-green-600/20 to-green-400/20 border border-green-500/30">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 font-bold text-sm">
                        15% OFF FOR EARLYBIRDS!
                      </span>
                    </div>
                    <p className="text-green-300 text-xs mt-1">
                      Use Coupon Code <span className="font-bold text-green-200 bg-green-900/30 px-2 py-0.5 rounded">"EARLYBIRD"</span> to Avail EarlyBird offers
                    </p>
                  </div>
                </div>

                {/* Goodies Toggle */}
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="mb-6 p-4 rounded-xl border border-[#FACC15]/30 bg-black/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 text-[#FACC15]" />
                      <div>
                        <span className="text-white font-semibold block">
                          Include Goodies
                        </span>
                        <span className="text-gray-400 text-sm">
                          Event swag & exclusive merchandise (+₹400)
                        </span>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-green-400 text-xs font-semibold">
                            ⭐ EARLYBIRD OFFER VALID
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIncludeGoodies(!includeGoodies)}
                      className={`relative w-14 h-7 rounded-full transition-all ${includeGoodies
                        ? "bg-gradient-to-r from-[#FACC15] to-[#F97316]"
                        : "bg-gray-700"
                        }`}
                      aria-label="Toggle goodies"
                    >
                      <div
                        className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${includeGoodies ? "translate-x-7" : "translate-x-0"
                          }`}
                      />
                    </button>
                  </div>
                </motion.div>

                {/* Ticket Options */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                    <h4 className="text-white font-semibold">
                      {includeGoodies ? "With Goodies" : "Base Tickets"}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {PRICING_OPTIONS.map((option, index) => (
                      <motion.div
                        key={option.id}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-xl border border-[#FACC15]/30 bg-black/50 hover:border-[#FACC15]/50 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-white font-semibold text-sm">
                            {option.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                          <Calendar className="h-3 w-3" />
                          <span>Jan 6 - Jan 28, 2026</span>
                        </div>

                        <div className="flex items-start justify-between align-top">
                          <div className="text-gray-400 text-xs flex-shrink-0">
                            {includeGoodies && (
                              <div className="space-y-0.5">
                                <div>Base: ₹{option.basePrice}</div>
                                <div>Goodies: +₹400</div>
                              </div>
                            )}
                          </div>
                          <span className="text-[#FACC15] font-bold text-lg text-right ml-2">
                            ₹{option.basePrice + (includeGoodies ? 400 : 0)}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Register Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRegisterOnKonfHub}
                  className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-[#FACC15] to-[#F97316] text-black hover:shadow-lg hover:shadow-[#F97316]/50 transition-all"
                >
                  Register on KonfHub
                  <ExternalLink className="inline-block ml-2 h-5 w-5" />
                </motion.button>

                {/* Coupon Code Reminder */}
                <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-green-600/10 to-green-400/10 border border-green-500/20">
                  <p className="text-center text-green-300 text-sm">
                    💡 Don't forget to use coupon code <span className="font-bold text-green-200 bg-green-900/40 px-2 py-1 rounded text-xs">"EARLYBIRD"</span> at checkout
                  </p>
                </div>

                <p className="text-center text-gray-500 text-xs mt-2">
                  Redirects to KonfHub for secure registration
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Mobile Bottom Sheet */}
        {isMobile && (
          <>
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/80 -z-10"
              onClick={onClose}
            />
            <motion.div
              variants={mobileSheetVariants}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#0B0B0B] border-t-2 border-[#FACC15]/30 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto overscroll-contain"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-gray-600 rounded-full" />
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="Close registration modal"
                className="absolute right-4 top-4 rounded-full bg-black/80 border border-[#FACC15]/30 p-2 text-white"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Content */}
              <div className="p-4 pb-8 safe-area-inset-bottom">
                {/* Header */}
                <div className="mb-6 text-center">
                  <h3 className="text-2xl font-bold text-[#FACC15] mb-2">
                    Event Tickets
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Jan 6 - Jan 28, 2026 • Choose your ticket category
                  </p>
                  {/* EARLYBIRD Discount Banner */}
                  <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-green-600/20 to-green-400/20 border border-green-500/30">
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 font-bold text-sm">
                        15% OFF FOR EARLYBIRDS!
                      </span>
                    </div>
                    <p className="text-green-300 text-xs mt-1 text-center">
                      Use Coupon Code <span className="font-bold text-green-200 bg-green-900/30 px-2 py-0.5 rounded">"EARLYBIRD"</span> to Avail EarlyBird offers
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#FACC15]" />
                      <span>January 2026</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#FACC15]" />
                      <span>SRM IST</span>
                    </div>
                  </div>
                </div>

                {/* Goodies Toggle */}
                <div className="mb-6 p-4 rounded-xl border border-[#FACC15]/30 bg-black/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 text-[#FACC15]" />
                      <div>
                        <span className="text-white font-semibold text-sm block">
                          Include Goodies
                        </span>
                        <span className="text-gray-400 text-xs">
                          +₹400
                        </span>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-green-400 text-xs font-semibold">
                            ⭐ EARLYBIRD OFFER VALID
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIncludeGoodies(!includeGoodies)}
                      className={`relative w-12 h-6 rounded-full transition-all touch-manipulation ${includeGoodies
                        ? "bg-gradient-to-r from-[#FACC15] to-[#F97316]"
                        : "bg-gray-700"
                        }`}
                      aria-label="Toggle goodies"
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${includeGoodies ? "translate-x-5" : "translate-x-0"
                          }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Ticket Options */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                    <h4 className="text-white font-semibold text-sm">
                      {includeGoodies ? "With Goodies" : "Base Tickets"}
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {PRICING_OPTIONS.map((option, index) => (
                      <motion.div
                        key={option.id}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.1 }}
                        className="p-3 rounded-xl border border-[#FACC15]/30 bg-black/50"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-white font-semibold text-xs leading-tight">
                            {option.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                          <Calendar className="h-3 w-3" />
                          <span>Jan 6 - Jan 28, 2026</span>
                        </div>

                        <div className="flex items-start justify-between align-top">
                          <div className="text-gray-400 text-xs flex-shrink-0">
                            {includeGoodies && (
                              <div className="space-y-0.5">
                                <div>Base: ₹{option.basePrice}</div>
                                <div>Goodies: +₹400</div>
                              </div>
                            )}
                          </div>
                          <span className="text-[#FACC15] font-bold text-right ml-2">
                            ₹{option.basePrice + (includeGoodies ? 400 : 0)}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Register Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRegisterOnKonfHub}
                  className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-[#FACC15] to-[#F97316] text-black transition-all touch-manipulation active:scale-95"
                >
                  Register on KonfHub
                  <ExternalLink className="inline-block ml-2 h-5 w-5" />
                </motion.button>

                {/* Coupon Code Reminder */}
                <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-green-600/10 to-green-400/10 border border-green-500/20">
                  <p className="text-center text-green-300 text-sm">
                    💡 Use coupon code <span className="font-bold text-green-200 bg-green-900/40 px-2 py-1 rounded text-xs">"EARLYBIRD"</span> at checkout
                  </p>
                </div>

                <p className="text-center text-gray-500 text-xs mt-2">
                  Redirects to KonfHub for secure registration
                </p>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

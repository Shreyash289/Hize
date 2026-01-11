"use client";

import { useEffect, useCallback, useState, useRef } from "react";
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
interface RegistrationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

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
  const [isIEEEMember, setIsIEEEMember] = useState(false);
  const [ieeeNumber, setIeeeNumber] = useState("");
  const [isSRMStudent, setIsSRMStudent] = useState(false);
  const [ieeeValidationStatus, setIeeeValidationStatus] = useState<{
    loading: boolean;
    isValid: boolean | null;
    error: string | null;
    nameInitials: string | null;
  }>({
    loading: false,
    isValid: null,
    error: null,
    nameInitials: null,
  });

  // Calculate price based on selections
  const calculatePrice = () => {
    let basePrice = 0;
    
    if (isIEEEMember && isSRMStudent) {
      basePrice = 99;
    } else if (!isIEEEMember && isSRMStudent) {
      basePrice = 149;
    } else if (isIEEEMember && !isSRMStudent) {
      basePrice = 149;
    } else {
      basePrice = 199;
    }
    
    return basePrice + (includeGoodies ? 400 : 0);
  };

  const getPriceLabel = () => {
    if (isIEEEMember && isSRMStudent) {
      return "IEEE Member + SRM Student";
    } else if (!isIEEEMember && isSRMStudent) {
      return "Non-IEEE Member + SRM Student";
    } else if (isIEEEMember && !isSRMStudent) {
      return "IEEE Member + Non-SRM Student";
    } else {
      return "Non-IEEE Member + Non-SRM Student";
    }
  };

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Job polling state
  const [pollingJobId, setPollingJobId] = useState<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Poll job status
  const pollJobStatus = useCallback(async (jobId: string) => {
    try {
      const response = await fetch(`/api/ieee-validate/status?jobId=${encodeURIComponent(jobId)}`);
      const data = await response.json();

      if (data.status === 'completed' && data.result) {
        // Job completed successfully
        const result = data.result;
        setIeeeValidationStatus({
          loading: false,
          isValid: result.isValid || false,
          error: result.error || null,
          nameInitials: result.nameInitials || null,
        });
        setIsIEEEMember(result.isValid || false);
        
        // Stop polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        setPollingJobId(null);
      } else if (data.status === 'failed') {
        // Job failed
        setIeeeValidationStatus({
          loading: false,
          isValid: false,
          error: data.error || 'Validation failed',
          nameInitials: null,
        });
        setIsIEEEMember(false);
        
        // Stop polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        setPollingJobId(null);
      } else if (data.status === 'processing') {
        // Still processing, continue polling
        setIeeeValidationStatus(prev => ({
          ...prev,
          loading: true,
        }));
      } else {
        // Unknown status or not found
        setIeeeValidationStatus({
          loading: false,
          isValid: false,
          error: 'Validation status unknown',
          nameInitials: null,
        });
        setIsIEEEMember(false);
        
        // Stop polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        setPollingJobId(null);
      }
    } catch (error: any) {
      console.error('Polling error:', error);
      // Continue polling on network errors (might be temporary)
    }
  }, []);

  // Validate IEEE membership (creates job and starts polling)
  const validateIEEEMembership = useCallback(async (memberId: string) => {
    if (!memberId || memberId.trim().length < 6) {
      setIeeeValidationStatus({
        loading: false,
        isValid: null,
        error: null,
        nameInitials: null,
      });
      return;
    }

    setIeeeValidationStatus({
      loading: true,
      isValid: null,
      error: null,
      nameInitials: null,
    });

    try {
      const response = await fetch('/api/ieee-validate/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memberId: memberId.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIeeeValidationStatus({
          loading: false,
          isValid: false,
          error: data.error || 'Validation failed',
          nameInitials: null,
        });
        setIsIEEEMember(false);
        return;
      }

      // If already completed (cached result), update immediately
      if (data.status === 'completed' && data.result) {
        const result = data.result;
        setIeeeValidationStatus({
          loading: false,
          isValid: result.isValid || false,
          error: result.error || null,
          nameInitials: result.nameInitials || null,
        });
        setIsIEEEMember(result.isValid || false);
      } else if (data.jobId) {
        // Job created, start polling
        setPollingJobId(data.jobId);
        
        // Start polling immediately
        pollJobStatus(data.jobId);
        
        // Set up polling interval (every 1 second)
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
        pollingIntervalRef.current = setInterval(() => {
          pollJobStatus(data.jobId);
        }, 1000);
      } else {
        setIeeeValidationStatus({
          loading: false,
          isValid: false,
          error: 'Failed to create validation job',
          nameInitials: null,
        });
        setIsIEEEMember(false);
      }
    } catch (error: any) {
      setIeeeValidationStatus({
        loading: false,
        isValid: false,
        error: error.message || 'Failed to validate IEEE membership',
        nameInitials: null,
      });
      setIsIEEEMember(false);
    }
  }, [pollJobStatus]);

  // Cleanup polling when popup closes or unmounts
  useEffect(() => {
    if (!isOpen) {
      // Stop polling when popup closes
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      setPollingJobId(null);
    }
    
    return () => {
      // Cleanup on unmount
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [isOpen]);

  // Debounced validation when IEEE number changes
  useEffect(() => {
    // Don't run if popup is closed
    if (!isOpen) return;
    
    // Clear any existing polling
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setPollingJobId(null);

    if (!ieeeNumber || ieeeNumber.trim().length < 6) {
      setIeeeValidationStatus({
        loading: false,
        isValid: null,
        error: null,
        nameInitials: null,
      });
      return;
    }

    const timeoutId = setTimeout(() => {
      validateIEEEMembership(ieeeNumber);
    }, 1000); // Wait 1 second after user stops typing

    return () => clearTimeout(timeoutId);
  }, [ieeeNumber, validateIEEEMembership, isOpen]);

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
                    Event Registration
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Jan 6 - Jan 28, 2026 • Configure your registration
                  </p>
                </div>

                {/* Registration Form */}
                <div className="space-y-6 mb-8">
                  {/* Goodies Toggle */}
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="p-4 rounded-xl border border-[#FACC15]/30 bg-black/50"
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

                  {/* IEEE Member Toggle */}
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="p-4 rounded-xl border border-[#FACC15]/30 bg-black/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-5 w-5 rounded bg-blue-500 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">IEEE</span>
                        </div>
                        <div>
                          <span className="text-white font-semibold block">
                            IEEE Member
                          </span>
                          <span className="text-gray-400 text-sm">
                            Are you an IEEE member?
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setIsIEEEMember(!isIEEEMember);
                          if (!isIEEEMember) setIeeeNumber("");
                        }}
                        className={`relative w-14 h-7 rounded-full transition-all ${isIEEEMember
                          ? "bg-gradient-to-r from-[#FACC15] to-[#F97316]"
                          : "bg-gray-700"
                          }`}
                        aria-label="Toggle IEEE membership"
                      >
                        <div
                          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${isIEEEMember ? "translate-x-7" : "translate-x-0"
                            }`}
                        />
                      </button>
                    </div>
                    
                    {/* IEEE Number Input */}
                    {isIEEEMember && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3"
                      >
                        <input
                          type="text"
                          placeholder="Enter IEEE Member Number"
                          value={ieeeNumber}
                          onChange={(e) => setIeeeNumber(e.target.value)}
                          className="w-full px-3 py-2 bg-black/70 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#FACC15] focus:outline-none transition-colors"
                        />
                      </motion.div>
                    )}
                  </motion.div>

                  {/* SRM Student Toggle */}
                  <motion.div
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="p-4 rounded-xl border border-[#FACC15]/30 bg-black/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-5 w-5 rounded bg-green-500 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">SRM</span>
                        </div>
                        <div>
                          <span className="text-white font-semibold block">
                            SRM Student
                          </span>
                          <span className="text-gray-400 text-sm">
                            Are you a SRM student?
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsSRMStudent(!isSRMStudent)}
                        className={`relative w-14 h-7 rounded-full transition-all ${isSRMStudent
                          ? "bg-gradient-to-r from-[#FACC15] to-[#F97316]"
                          : "bg-gray-700"
                          }`}
                        aria-label="Toggle SRM student status"
                      >
                        <div
                          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${isSRMStudent ? "translate-x-7" : "translate-x-0"
                            }`}
                        />
                      </button>
                    </div>
                  </motion.div>
                </div>

                {/* Price Summary */}
                <div className="mb-8">
                  <div className="p-6 rounded-xl border-2 border-[#FACC15]/50 bg-gradient-to-br from-[#FACC15]/10 to-[#F97316]/5">
                    <div className="text-center">
                      <h4 className="text-white font-semibold text-lg mb-2">
                        {getPriceLabel()}
                      </h4>
                      <div className="space-y-2 text-sm text-gray-300 mb-4">
                        <div className="flex justify-between">
                          <span>Base Price:</span>
                          <span>₹{calculatePrice() - (includeGoodies ? 400 : 0)}</span>
                        </div>
                        {includeGoodies && (
                          <div className="flex justify-between">
                            <span>Goodies:</span>
                            <span>+₹400</span>
                          </div>
                        )}
                        <div className="border-t border-gray-600 pt-2 flex justify-between font-bold text-lg">
                          <span className="text-white">Total:</span>
                          <span className="text-[#FACC15]">₹{calculatePrice()}</span>
                        </div>
                      </div>
                    </div>
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
                    Event Registration
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Jan 6 - Jan 28, 2026 • Configure your registration
                  </p>
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

                {/* Registration Form */}
                <div className="space-y-4 mb-6">
                  {/* Goodies Toggle */}
                  <div className="p-4 rounded-xl border border-[#FACC15]/30 bg-black/50">
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

                  {/* IEEE Member Toggle */}
                  <div className="p-4 rounded-xl border border-[#FACC15]/30 bg-black/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-5 w-5 rounded bg-blue-500 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">IEEE</span>
                        </div>
                        <div>
                          <span className="text-white font-semibold text-sm block">
                            IEEE Member
                          </span>
                          <span className="text-gray-400 text-xs">
                            Are you an IEEE member?
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (!isIEEEMember) {
                            setIsIEEEMember(true);
                          } else {
                            setIsIEEEMember(false);
                            setIeeeNumber("");
                            setIeeeValidationStatus({
                              loading: false,
                              isValid: null,
                              error: null,
                              nameInitials: null,
                            });
                          }
                        }}
                        className={`relative w-12 h-6 rounded-full transition-all touch-manipulation ${isIEEEMember
                          ? "bg-gradient-to-r from-[#FACC15] to-[#F97316]"
                          : "bg-gray-700"
                          }`}
                        aria-label="Toggle IEEE membership"
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${isIEEEMember ? "translate-x-5" : "translate-x-0"
                            }`}
                        />
                      </button>
                    </div>
                    
                    {/* IEEE Number Input - Always visible for validation */}
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 space-y-2"
                    >
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Enter IEEE Member Number to verify"
                          value={ieeeNumber}
                          onChange={(e) => setIeeeNumber(e.target.value)}
                          className={`w-full px-3 py-2 pr-10 bg-black/70 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors text-sm ${
                            ieeeValidationStatus.isValid === true
                              ? "border-green-500"
                              : ieeeValidationStatus.isValid === false
                              ? "border-red-500"
                              : ieeeValidationStatus.loading
                              ? "border-yellow-500"
                              : "border-gray-600 focus:border-[#FACC15]"
                          }`}
                        />
                          {/* Validation Status Icon */}
                          {ieeeNumber.trim().length >= 6 && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              {ieeeValidationStatus.loading ? (
                                <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                              ) : ieeeValidationStatus.isValid === true ? (
                                <svg
                                  className="w-5 h-5 text-green-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              ) : ieeeValidationStatus.isValid === false ? (
                                <svg
                                  className="w-5 h-5 text-red-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              ) : null}
                            </div>
                          )}
                        </div>
                        
                        {/* Validation Messages */}
                        {ieeeNumber.trim().length >= 6 && (
                          <div className="text-xs">
                            {ieeeValidationStatus.loading && (
                              <p className="text-yellow-400">Validating IEEE membership...</p>
                            )}
                            {ieeeValidationStatus.isValid === true && (
                              <div className="text-green-400">
                                <p>✓ Valid IEEE member</p>
                                {ieeeValidationStatus.nameInitials && (
                                  <p className="text-gray-400 mt-0.5">
                                    {ieeeValidationStatus.nameInitials}
                                  </p>
                                )}
                              </div>
                            )}
                            {ieeeValidationStatus.isValid === false && ieeeValidationStatus.error && (
                              <p className="text-red-400">{ieeeValidationStatus.error}</p>
                            )}
                          </div>
                        )}
                      </motion.div>
                  </div>

                  {/* SRM Student Toggle */}
                  <div className="p-4 rounded-xl border border-[#FACC15]/30 bg-black/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-5 w-5 rounded bg-green-500 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">SRM</span>
                        </div>
                        <div>
                          <span className="text-white font-semibold text-sm block">
                            SRM Student
                          </span>
                          <span className="text-gray-400 text-xs">
                            Are you a SRM student?
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsSRMStudent(!isSRMStudent)}
                        className={`relative w-12 h-6 rounded-full transition-all touch-manipulation ${isSRMStudent
                          ? "bg-gradient-to-r from-[#FACC15] to-[#F97316]"
                          : "bg-gray-700"
                          }`}
                        aria-label="Toggle SRM student status"
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${isSRMStudent ? "translate-x-5" : "translate-x-0"
                            }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="mb-6">
                  <div className="p-4 rounded-xl border-2 border-[#FACC15]/50 bg-gradient-to-br from-[#FACC15]/10 to-[#F97316]/5">
                    <div className="text-center">
                      <h4 className="text-white font-semibold text-sm mb-2">
                        {getPriceLabel()}
                      </h4>
                      <div className="space-y-1 text-xs text-gray-300 mb-3">
                        <div className="flex justify-between">
                          <span>Base Price:</span>
                          <span>₹{calculatePrice() - (includeGoodies ? 400 : 0)}</span>
                        </div>
                        {includeGoodies && (
                          <div className="flex justify-between">
                            <span>Goodies:</span>
                            <span>+₹400</span>
                          </div>
                        )}
                        <div className="border-t border-gray-600 pt-1 flex justify-between font-bold text-sm">
                          <span className="text-white">Total:</span>
                          <span className="text-[#FACC15]">₹{calculatePrice()}</span>
                        </div>
                      </div>
                    </div>
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

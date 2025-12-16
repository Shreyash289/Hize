"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  X,
  Users,
  GraduationCap,
  Building,
  ExternalLink,
} from "lucide-react";

/* -------------------------------
   Types
-------------------------------- */
interface RegistrationOption {
  id: string;
  title: string;
  description: string;
  price: number;
  icon: React.ElementType;
  color: string;
  popular?: boolean;
  url: string;
}

interface RegistrationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

/* -------------------------------
   Data
-------------------------------- */
const registrationOptions: RegistrationOption[] = [
  {
    id: "ieee-srm",
    title: "IEEE Member + SRM Student",
    description: "IEEE members from SRM Institute",
    price: 399,
    icon: Users,
    color: "from-green-500 to-emerald-600",
    popular: true,
    url: "https://unstop.com/p/hize-2026-ieee-members-srmist-students-hize-2026-high-impact-zonal-events-ieee-computer-society-student-branch-srmist-1610165",
  },
  {
    id: "non-ieee-srm",
    title: "Non-IEEE + SRM Student",
    description: "SRM students (non-IEEE members)",
    price: 499,
    icon: GraduationCap,
    color: "from-blue-500 to-blue-600",
    url: "https://unstop.com/p/hize-2026-srmist-students-hize-2026-high-impact-zonal-events-ieee-computer-society-student-branch-srmist-1610224",
  },
  {
    id: "ieee-external",
    title: "IEEE Member + External",
    description: "IEEE members from other institutions",
    price: 799,
    icon: Building,
    color: "from-orange-500 to-orange-600",
    url: "https://unstop.com/conferences/hize-2026-srm-institute-of-science-and-technology-kattankulathur-chennai-1610215",
  },
  {
    id: "non-ieee-external",
    title: "Non-IEEE + External",
    description: "Students from other institutions",
    price: 899,
    icon: ExternalLink,
    color: "from-red-500 to-red-600",
    url: "https://unstop.com/p/hize-2026-hize-2026-high-impact-zonal-events-ieee-computer-society-student-branch-srmist-1610226",
  },
];



/* -------------------------------
   Animation Variants (TS-safe)
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
      duration: 0.25,
      ease: [0.25, 0.1, 0.25, 1], // ✅ TS-safe easing
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

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.25,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};


/* =========================================================
   Component
========================================================= */
export default function RegistrationPopup({
  isOpen,
  onClose,
}: RegistrationPopupProps) {
  /* ESC key close */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  const handleRegister = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
        onClick={onClose}
      >
        <motion.div
          variants={modalVariants}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-orange-500/30 bg-gradient-to-br from-black/90 to-zinc-900/90 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close registration modal"
            className="absolute right-4 top-4 rounded-full bg-orange-600 p-2 text-white hover:bg-orange-500 transition"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="p-6 sm:p-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/20 px-4 py-2 mb-4">
              <Users className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-semibold text-orange-200">
                Event Registration
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 bg-clip-text text-transparent mb-3">
              Register for HIZE 2026
            </h2>

            <p className="text-orange-200/80 max-w-2xl mx-auto">
              Choose your registration category and secure your spot at IEEE CS
              SYP HIZE 2026
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 sm:px-8 pb-6">
            {registrationOptions.map((option) => {
              const Icon = option.icon;

              return (
                <motion.button
                  key={option.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleRegister(option.url)}
                  className={`relative w-full rounded-xl bg-gradient-to-br ${option.color} p-6 text-white shadow-lg hover:shadow-xl transition`}
                >
                  

                  <div className="flex gap-4">
                    <div className="rounded-lg bg-white/20 p-3">
                      <Icon className="h-6 w-6" />
                    </div>

                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-lg">{option.title}</h3>
                      <p className="text-sm text-white/80 mb-3">
                        {option.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black">
                          ₹{option.price}
                        </span>
                        <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-xs">
                          Register on Unstop
                          <ExternalLink className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* What's Included */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="mx-6 sm:mx-8 mb-6 rounded-xl border border-orange-500/20 bg-orange-500/10 p-4"
          >
            <h4 className="font-bold text-orange-400 mb-2">
              What's Included
            </h4>

            <motion.ul
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-orange-200/80"
            >
              {[
                "3-day event access",
                "Workshop materials",
                "Certificate of participation",
                "Networking opportunities",
                "Swag kit",
              ].map((item) => (
                <motion.li
                  key={item}
                  variants={listItemVariants}
                  className="flex items-center gap-2"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Footer */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15 }}
            className="text-center text-sm text-orange-200/60 pb-6"
          >
            <p className="flex justify-center items-center gap-2">
              Powered by{" "}
              <span className="text-orange-400 font-semibold">Unstop</span>
              <ExternalLink className="h-3 w-3" />
            </p>

            <p className="mt-1">
              Need help?{" "}
              <span className="text-orange-400">
                hize2026srmist@gmail.com
              </span>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

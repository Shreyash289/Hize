"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, GraduationCap, Building, ExternalLink } from 'lucide-react';

interface RegistrationOption {
  id: string;
  title: string;
  description: string;
  price: number;
  icon: any;
  color: string;
  popular?: boolean;
  url: string;
}

const registrationOptions: RegistrationOption[] = [
  {
    id: 'ieee-srm',
    title: 'IEEE Member + SRM Student',
    description: 'IEEE members from SRM Institute',
    price: 399,
    icon: Users,
    color: 'from-green-500 to-emerald-600',
    popular: true,
    url: 'https://unstop.com/p/hize-2026-ieee-members-srmist-students-hize-2026-high-impact-zonal-events-ieee-computer-society-student-branch-srmist-1610165'
  },
  {
    id: 'non-ieee-srm',
    title: 'Non-IEEE + SRM Student',
    description: 'SRM students (non-IEEE members)',
    price: 499,
    icon: GraduationCap,
    color: 'from-blue-500 to-blue-600',
    url: 'https://unstop.com/p/hize-2026-srmist-students-hize-2026-high-impact-zonal-events-ieee-computer-society-student-branch-srmist-1610224'
  },
  {
    id: 'ieee-external',
    title: 'IEEE Member + External',
    description: 'IEEE members from other institutions',
    price: 799,
    icon: Building,
    color: 'from-orange-500 to-orange-600',
    url: 'https://unstop.com/conferences/hize-2026-srm-institute-of-science-and-technology-kattankulathur-chennai-1610215'
  },
  {
    id: 'non-ieee-external',
    title: 'Non-IEEE + External',
    description: 'Students from other institutions',
    price: 899,
    icon: ExternalLink,
    color: 'from-red-500 to-red-600',
    url: 'https://unstop.com/p/hize-2026-hize-2026-high-impact-zonal-events-ieee-computer-society-student-branch-srmist-1610226'
  }
];

interface RegistrationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationPopup({ isOpen, onClose }: RegistrationPopupProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleRegister = (optionId: string) => {
    setSelectedOption(optionId);
    const option = registrationOptions.find(opt => opt.id === optionId);

    if (option?.url) {
      // Open Unstop registration page in new tab
      window.open(option.url, '_blank', 'noopener,noreferrer');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative p-6 sm:p-8 bg-gradient-to-br from-black/90 to-zinc-900/90 backdrop-blur-2xl border border-orange-500/30 rounded-2xl shadow-2xl">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-orange-600 hover:bg-orange-500 transition-colors shadow-lg"
              aria-label="Close registration"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-400/30 mb-4"
              >
                <Users className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-semibold text-orange-200">Event Registration</span>
              </motion.div>

              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 bg-clip-text text-transparent mb-4">
                Register for HIZE 2026
              </h2>
              <p className="text-orange-200/80 text-lg max-w-2xl mx-auto">
                Choose your registration category and secure your spot at IEEE CS SYP HIZE 2026
              </p>
            </div>

            {/* Registration Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {registrationOptions.map((option, index) => {
                const IconComponent = option.icon;
                return (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="relative"
                  >
                    {option.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">

                      </div>
                    )}

                    <motion.button
                      onClick={() => handleRegister(option.id)}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full p-6 rounded-xl bg-gradient-to-br ${option.color} text-white shadow-xl hover:shadow-2xl transition-all duration-300 group`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm flex-shrink-0">
                          <IconComponent className="w-6 h-6" />
                        </div>

                        <div className="flex-1 text-left">
                          <h3 className="text-lg font-bold mb-1 group-hover:text-white/90 transition-colors">
                            {option.title}
                          </h3>
                          <p className="text-white/80 text-sm mb-3 leading-relaxed">
                            {option.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-black">
                              ₹{option.price}
                            </div>
                            <div className="flex items-center gap-1 text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
                              <span>Register on Unstop</span>
                              <ExternalLink className="w-3 h-3" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl"
            >
              <h4 className="text-lg font-bold text-orange-400 mb-2">What's Included:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-orange-200/80">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  <span>3-day event access</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  <span>Workshop materials</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  <span>Certificate of participation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  <span>Networking opportunities</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  <span>Swag kit</span>
                </div>
              </div>
            </motion.div>

            {/* Contact Info */}
            <div className="mt-6 text-center text-sm text-orange-200/60 space-y-2">
              <p className="flex items-center justify-center gap-2">
                <span>Powered by</span>
                <span className="text-orange-400 font-semibold">Unstop</span>
                <ExternalLink className="w-3 h-3" />
              </p>
              <p>Need help? Contact us at <span className="text-orange-400">hize2026srmist@gmail.com</span></p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
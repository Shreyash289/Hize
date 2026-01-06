"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface EarlybirdNotificationProps {
  onRegisterClick: () => void;
}

export default function EarlybirdNotification({ onRegisterClick }: EarlybirdNotificationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: 100 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        x: 0,
        y: [0, -5, 0]
      }}
      transition={{ 
        duration: 0.6,
        y: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      className="fixed top-24 right-4 z-40 cursor-pointer group"
      onClick={onRegisterClick}
    >
      {/* Main Badge */}
      <motion.div
        whileHover={{ scale: 1.05, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl blur-lg opacity-60 animate-pulse" />
        
        {/* Badge Container */}
        <div className="relative bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-3 rounded-2xl shadow-2xl border-2 border-white/20">
          {/* Star Icon */}
          <div className="flex items-center justify-center mb-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6 text-white drop-shadow-lg" />
            </motion.div>
          </div>
          
          {/* Text Content */}
          <div className="text-center text-white font-black leading-tight">
            <div className="text-xs mb-1 drop-shadow-md">EARLYBIRD</div>
            <div className="text-lg font-extrabold drop-shadow-md">15% OFF</div>
            <div className="text-[10px] opacity-95 drop-shadow-sm">GOODIES ONLY</div>
          </div>
        </div>
        
        {/* Pulse Ring */}
        <motion.div
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.8, 0, 0.8]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeOut"
          }}
          className="absolute inset-0 border-2 border-orange-400 rounded-2xl"
        />
      </motion.div>
      
      {/* Floating Sparkles */}
      <motion.div
        animate={{ 
          y: [-10, -20, -10],
          x: [0, 5, 0],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{ 
          duration: 2.5, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-2 -right-1 text-yellow-300"
      >
        <div className="w-2 h-2 bg-yellow-300 rounded-full shadow-lg" />
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [-5, -15, -5],
          x: [0, -3, 0],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute -top-1 -left-2 text-orange-300"
      >
        <div className="w-1.5 h-1.5 bg-orange-300 rounded-full shadow-lg" />
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [-8, -18, -8],
          x: [0, 2, 0],
          opacity: [0.5, 0.9, 0.5]
        }}
        transition={{ 
          duration: 2.8, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
        className="absolute top-1 -right-3 text-red-300"
      >
        <div className="w-1 h-1 bg-red-300 rounded-full shadow-lg" />
      </motion.div>
    </motion.div>
  );
}
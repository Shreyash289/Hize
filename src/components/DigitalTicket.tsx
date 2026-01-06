"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, CheckCircle2 } from "lucide-react";
import Image from "next/image";

/* -------------------------------
   Types
-------------------------------- */
interface DigitalTicketProps {
  attendeeName: string;
  category: "SRM" | "Non-SRM";
  ieeeStatus: "IEEE" | "Non-IEEE";
  hasGoodies: boolean;
  ticketId: string;
  qrCodeData?: string; // QR code data/URL
  date?: string;
  venue?: string;
}

/* -------------------------------
   Component
-------------------------------- */
export default function DigitalTicket({
  attendeeName,
  category,
  ieeeStatus,
  hasGoodies,
  ticketId,
  qrCodeData = ticketId, // Default to ticketId if no QR data provided
  date = "January 2026",
  venue = "SRM IST",
}: DigitalTicketProps) {
  // Generate QR code URL (using a QR code API service)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeData)}`;

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-black border-2 border-[#FACC15] rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Diagonal Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                #FACC15 10px,
                #FACC15 20px
              )`,
            }}
          />
        </div>

        {/* Gradient Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FACC15] via-[#F97316] to-[#FACC15]" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FACC15]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#F97316]/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <Image
                src="/logo_white.png"
                alt="HIZE Logo"
                width={100}
                height={30}
                className="h-8 w-auto mb-2"
              />
              <h2 className="text-2xl font-bold text-white">
                High Impact Zonal Event
              </h2>
              <p className="text-gray-400 text-sm">2026</p>
            </div>
            <div className="bg-gradient-to-r from-[#F97316] to-[#FACC15] px-4 py-2 rounded-lg">
              <span className="text-black font-bold text-xs">ENTRY PASS</span>
            </div>
          </div>

          {/* Ticket Info */}
          <div className="space-y-4 mb-6">
            {/* Attendee Name */}
            <div>
              <p className="text-gray-400 text-xs mb-1">Attendee</p>
              <p className="text-white font-bold text-xl">{attendeeName}</p>
            </div>

            {/* Category Badges */}
            <div className="flex flex-wrap gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-[#FACC15]/20 border border-[#FACC15]/50">
                <span className="text-[#FACC15] font-semibold text-sm">
                  {category}
                </span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-[#F97316]/20 border border-[#F97316]/50">
                <span className="text-[#F97316] font-semibold text-sm">
                  {ieeeStatus}
                </span>
              </div>
              {hasGoodies && (
                <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FACC15]/30 to-[#F97316]/30 border border-[#FACC15]/50">
                  <span className="text-[#FACC15] font-semibold text-sm flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    GOODIES
                  </span>
                </div>
              )}
            </div>

            {/* Date & Venue */}
            <div className="space-y-2 pt-2 border-t border-[#FACC15]/20">
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="h-4 w-4 text-[#FACC15]" />
                <span className="text-sm">{date}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="h-4 w-4 text-[#FACC15]" />
                <span className="text-sm">{venue}</span>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white p-4 rounded-xl mb-6 flex items-center justify-center">
            <div className="relative">
              <Image
                src={qrCodeUrl}
                alt="Ticket QR Code"
                width={200}
                height={200}
                className="rounded-lg"
              />
              <div className="absolute inset-0 border-2 border-[#FACC15] rounded-lg pointer-events-none" />
            </div>
          </div>
          <p className="text-center text-gray-400 text-xs mb-6">
            Scan at Entry
          </p>

          {/* Footer */}
          <div className="pt-4 border-t border-[#FACC15]/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 text-xs">Ticket ID</p>
              <p className="text-[#FACC15] font-mono text-xs">{ticketId}</p>
            </div>
            <p className="text-gray-500 text-xs text-center mt-4">
              Non-transferable • Valid for event duration only
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


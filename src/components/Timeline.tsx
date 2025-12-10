"use client";

import { motion } from "framer-motion";
import { memo } from "react";

// Memoized timeline data to prevent re-creation on each render
const timelineData = [
  {
    day: "DAY 0 — 29th JANUARY",
    title: "Hackathon",
    events: [
      { time: "9:30 AM Onwards", label: "Hackathon Kickoff" },
    ],
  },
  {
    day: "DAY 1 — 30th JANUARY",
    title: "Conference Day",
    events: [
      { time: "9:00 AM – 9:30 AM", label: "Registration" },
      { time: "9:30 AM – 9:50 AM", label: "Guest Arrival" },
      { time: "10:00 AM – 10:40 AM", label: "Inauguration" },
      { time: "10:40 AM – 11:00 AM", label: "Tea Break" },
      { time: "11:00 AM – 12:30 PM", label: "Panel Discussion" },
      { time: "12:30 PM – 1:30 PM", label: "Lunch" },
      { time: "1:30 PM – 2:30 PM", label: "Tech Talk — Dr. Gayathri" },
      { time: "2:30 PM – 4:00 PM", label: "Online Quiz — Dr. H. R. Mohan" },
      { time: "4:00 PM – 4:30 PM", label: "Tea Break" },
      { time: "4:30 PM – 6:00 PM", label: "Coding Contest" },
      { time: "6:00 PM – 8:00 PM", label: "Culturals" },
      { time: "8:00 PM – 9:00 PM", label: "Dinner" },
    ],
  },
  {
    day: "DAY 2 — 31st JANUARY",
    title: "Workshops & Showcase",
    events: [
      { time: "8:00 AM – 10:30 AM", label: "Workshop" },
      { time: "10:30 AM – 11:00 AM", label: "Tea Break" },
      { time: "10:30 AM – 1:00 PM", label: "Startup Showcase" },
      { time: "11:00 AM – 12:30 PM", label: "Tech Talk 1 — Shivam Shivam" },
      { time: "12:30 PM – 1:30 PM", label: "Lunch" },
      { time: "1:30 PM – 2:30 PM", label: "Tech Talk 2 — Mr. Balak Awasthy" },
      { time: "2:30 PM – 3:30 PM", label: "Tech Talk 3" },
      { time: "2:30 PM – 3:30 PM", label: "Interview Fair" },
      { time: "3:30 PM – 4:30 PM", label: "Valedictory Ceremony" },
    ],
  },
] as const;

// Optimized animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};

const eventVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Memoized Timeline component for better performance
const Timeline = memo(function Timeline() {
  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
      <div className="space-y-16 md:space-y-20">
        {timelineData.map((block, index) => (
          <motion.div
            key={block.day}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="relative will-change-transform"
          >
            {/* Timeline connector line for non-first items */}
            {index > 0 && (
              <div className="absolute left-8 -top-16 md:-top-20 w-0.5 h-16 md:h-20 bg-gradient-to-b from-orange-500/50 to-transparent" />
            )}

            {/* Timeline dot */}
            <div className="absolute left-6 top-8 w-4 h-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 shadow-[0_0_20px_rgba(255,136,0,0.6)] border-2 border-orange-300/30 z-10" />

            {/* Content card */}
            <motion.div
              className="ml-16 p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl bg-gradient-to-br from-black/80 to-zinc-900/80 border border-orange-500/30 shadow-2xl backdrop-blur-xl relative overflow-hidden will-change-transform"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Subtle glow effect */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-orange-600/20 via-orange-500/20 to-orange-600/20 rounded-3xl blur-xl -z-10" />

              {/* Day header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h3 className="text-orange-300 font-bold text-sm uppercase tracking-wider mb-2 sm:mb-0">
                  {block.day}
                </h3>
                <div className="w-full sm:w-32 h-0.5 bg-gradient-to-r from-orange-500 to-transparent" />
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-8">
                {block.title}
              </h2>

              {/* Events grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {block.events.map((event, i) => (
                  <motion.div
                    key={`${block.day}-${i}`}
                    variants={eventVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
                    className="group p-4 md:p-5 rounded-xl bg-white/5 border border-white/10 hover:border-orange-400/50 hover:bg-white/10 transition-all duration-300 will-change-transform"
                  >
                    <div className="flex flex-col space-y-2">
                      <p className="text-orange-300 text-xs font-bold uppercase tracking-wide">
                        {event.time}
                      </p>
                      <p className="text-white text-sm md:text-base font-medium leading-relaxed">
                        {event.label}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

Timeline.displayName = 'Timeline';

export default Timeline;


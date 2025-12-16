"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { memo, useRef, useState, useMemo } from "react";
import { Calendar, Users, Trophy, Coffee, Mic, Code, Lightbulb, ChevronDown } from "lucide-react";
import { getMobileOptimizedVariants, shouldReduceAnimations, isMobile } from "@/lib/mobileOptimization";

// Enhanced timeline data with yellow-orange-black-deep blue theme
const timelineData = [
  {
    day: "DAY 0",
    date: "29th JANUARY",
    title: "Hackathon",
    subtitle: "Innovation Begins",
    color: "yellow-orange",
    bgColor: "#FCD34D20", // yellow-300/20
    borderColor: "#F59E0B50", // amber-500/50
    glowColor: "#F59E0B", // amber-500
    icon: Code,
    position: { x: 0, y: 0 },
    events: [
      { time: "9:30 AM Onwards", label: "Hackathon Kickoff", icon: Trophy },
    ],
  },
  {
    day: "DAY 1",
    date: "30th JANUARY",
    title: "Conference Day",
    subtitle: "Knowledge & Networking",
    color: "orange-black",
    bgColor: "#FB923C20", // orange-400/20
    borderColor: "#EA580C50", // orange-600/50
    glowColor: "#EA580C", // orange-600
    icon: Users,
    position: { x: 0, y: 0 },
    events: [
      { time: "9:00 AM – 9:30 AM", label: "Registration", icon: Calendar },
      { time: "9:30 AM – 9:50 AM", label: "Guest Arrival", icon: Users },
      { time: "10:00 AM – 10:40 AM", label: "Inauguration", icon: Trophy },
      { time: "10:40 AM – 11:00 AM", label: "Tea Break", icon: Coffee },
      { time: "11:00 AM – 12:30 PM", label: "Panel Discussion", icon: Mic },
      { time: "12:30 PM – 1:30 PM", label: "Lunch", icon: Coffee },
      { time: "1:30 PM – 2:30 PM", label: "Tech Talk — Dr. Gayathri", icon: Lightbulb },
      { time: "2:30 PM – 4:00 PM", label: "Online Quiz — Dr. H. R. Mohan", icon: Trophy },
      { time: "4:00 PM – 4:30 PM", label: "Tea Break", icon: Coffee },
      { time: "4:30 PM – 6:00 PM", label: "Coding Contest", icon: Code },
      { time: "6:00 PM – 8:00 PM", label: "Culturals", icon: Users },
      { time: "8:00 PM – 9:00 PM", label: "Dinner", icon: Coffee },
    ],
  },
  {
    day: "DAY 2",
    date: "31st JANUARY",
    title: "Workshops & Showcase",
    subtitle: "Skills & Innovation",
    color: "black-orange",
    bgColor: "#00000030", // black/30 with transparency
    borderColor: "#EA580C50", // orange-600/50
    glowColor: "#EA580C", // orange-600
    icon: Lightbulb,
    position: { x: 0, y: 0 },
    events: [
      { time: "8:00 AM – 10:30 AM", label: "Workshop", icon: Code },
      { time: "10:30 AM – 11:00 AM", label: "Tea Break", icon: Coffee },
      { time: "10:30 AM – 1:00 PM", label: "Startup Showcase", icon: Trophy },
      { time: "11:00 AM – 12:30 PM", label: "Tech Talk 1 — Shivam Shivam", icon: Lightbulb },
      { time: "12:30 PM – 1:30 PM", label: "Lunch", icon: Coffee },
      { time: "1:30 PM – 2:30 PM", label: "Tech Talk 2 — Mr. Balak Awasthy", icon: Lightbulb },
      { time: "2:30 PM – 3:30 PM", label: "Tech Talk 3", icon: Lightbulb },
      { time: "2:30 PM – 3:30 PM", label: "Interview Fair", icon: Users },
      { time: "3:30 PM – 4:30 PM", label: "Valedictory Ceremony", icon: Trophy },
    ],
  },
] as const;

// Mobile-optimized animation variants
const getMobileVariants = () => {
  const isReducedMotion = shouldReduceAnimations();
  const mobile = isMobile();

  return {
    containerVariants: {
      hidden: { opacity: isReducedMotion ? 1 : 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: isReducedMotion ? 0 : (mobile ? 0.1 : 0.2),
          delayChildren: isReducedMotion ? 0 : 0.1
        }
      }
    },
    dayVariants: {
      hidden: {
        opacity: isReducedMotion ? 1 : 0,
        scale: isReducedMotion ? 1 : 0.95,
        y: isReducedMotion ? 0 : (mobile ? 15 : 30)
      },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: isReducedMotion ? 0.1 : (mobile ? 0.4 : 0.6) }
      }
    },
    eventVariants: {
      hidden: {
        opacity: isReducedMotion ? 1 : 0,
        y: isReducedMotion ? 0 : -5
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: isReducedMotion ? 0.1 : 0.3 }
      },
      exit: {
        opacity: isReducedMotion ? 1 : 0,
        y: isReducedMotion ? 0 : -5,
        transition: { duration: isReducedMotion ? 0.1 : 0.2 }
      }
    },
    eventsContainerVariants: {
      hidden: { opacity: isReducedMotion ? 1 : 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: isReducedMotion ? 0 : 0.03,
          delayChildren: isReducedMotion ? 0 : 0.05
        }
      },
      exit: {
        opacity: isReducedMotion ? 1 : 0,
        transition: {
          staggerChildren: isReducedMotion ? 0 : 0.01,
          staggerDirection: -1
        }
      }
    }
  };
};



// Interactive Timeline component with expandable days
const Timeline = memo(function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());

  // Memoize mobile detection and variants
  const mobile = useMemo(() => isMobile(), []);
  const reducedMotion = useMemo(() => shouldReduceAnimations(), []);
  const variants = useMemo(() => getMobileVariants(), []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"]
  });

  const toggleDay = (dayIndex: number) => {
    setExpandedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dayIndex)) {
        newSet.delete(dayIndex);
      } else {
        newSet.add(dayIndex);
      }
      return newSet;
    });
  };

  return (
    <div ref={containerRef} className="relative w-full py-4 sm:py-6 md:py-8 overflow-hidden">
      {/* Conditionally render animated background elements - disabled on mobile for performance */}
      {!mobile && !reducedMotion && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-yellow-400/10 to-amber-500/10 blur-3xl"
            animate={{
              y: [-10, 10, -10],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute top-60 right-20 w-48 h-48 rounded-full bg-gradient-to-r from-orange-500/10 to-red-600/10 blur-3xl"
            animate={{
              y: [-8, 8, -8],
              scale: [1, 1.03, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
              delay: 2
            }}
          />
        </div>
      )}

      {/* Static background for mobile */}
      {mobile && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400/5 to-amber-500/5 blur-2xl" />
          <div className="absolute top-60 right-20 w-32 h-32 rounded-full bg-gradient-to-r from-orange-500/5 to-red-600/5 blur-2xl" />
        </div>
      )}

      {/* Flowing SVG Path - simplified for mobile */}
      {!mobile && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#FB923C" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#EA580C" stopOpacity="0.6" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Simplified path for desktop */}
          <motion.path
            d="M 150 120 Q 300 80 450 180 Q 600 280 750 220"
            stroke="url(#pathGradient)"
            strokeWidth="4"
            fill="none"
            filter={reducedMotion ? "none" : "url(#glow)"}
            style={{
              pathLength: reducedMotion ? 1 : useTransform(scrollYProgress, [0, 0.5], [0, 1]),
              opacity: reducedMotion ? 0.4 : useTransform(scrollYProgress, [0, 0.3, 0.5], [0, 0.8, 0.5])
            }}
          />

          <motion.path
            d="M 750 220 Q 900 160 850 320 Q 800 480 650 420 Q 500 360 400 480"
            stroke="url(#pathGradient)"
            strokeWidth="4"
            fill="none"
            filter={reducedMotion ? "none" : "url(#glow)"}
            style={{
              pathLength: reducedMotion ? 1 : useTransform(scrollYProgress, [0.5, 1], [0, 1]),
              opacity: reducedMotion ? 0.4 : useTransform(scrollYProgress, [0.5, 0.7, 1], [0, 0.8, 0.6])
            }}
          />
        </svg>
      )}

      {/* Static decorative line for mobile */}
      {mobile && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-orange-400/30 to-transparent rounded-full" />
        </div>
      )}

      {/* Timeline Content */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 md:px-6"
        variants={variants.containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: mobile ? "-20px" : "-50px" }}
      >
        {timelineData.map((day, index) => {
          const IconComponent = day.icon;

          return (
            <motion.div
              key={day.day}
              variants={variants.dayVariants}
              transition={{
                duration: reducedMotion ? 0.1 : (mobile ? 0.4 : 0.8),
                ease: reducedMotion ? "linear" : [0.25, 0.46, 0.45, 0.94],
                delay: reducedMotion ? 0 : (index * (mobile ? 0.1 : 0.2))
              }}
              className="relative mb-4 flex justify-center"
            >
              {/* Interactive Day Card Button */}
              <motion.div
                className="relative w-full max-w-2xl mx-auto cursor-pointer"
                whileHover={reducedMotion ? {} : { scale: mobile ? 1.005 : 1.01 }}
                whileTap={reducedMotion ? {} : { scale: mobile ? 0.995 : 0.99 }}
                onClick={() => toggleDay(index)}
              >
                {/* Day Header Button */}
                <motion.div
                  className="relative p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl backdrop-blur-xl border shadow-xl"
                  style={{
                    background: day.bgColor,
                    borderColor: day.borderColor
                  }}
                  animate={reducedMotion || mobile ? {} : {
                    y: expandedDays.has(index) ? 0 : [-2, 2, -2],
                  }}
                  transition={reducedMotion || mobile ? {} : {
                    duration: expandedDays.has(index) ? 0 : 6,
                    repeat: expandedDays.has(index) ? 0 : Infinity,
                    ease: "linear"
                  }}
                >
                  {/* Glowing background */}
                  <div
                    className="absolute -inset-1 rounded-2xl blur-lg opacity-30 -z-10"
                    style={{
                      background: `linear-gradient(135deg, ${day.glowColor}, ${day.glowColor}60)`
                    }}
                  />

                  {/* Day Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <motion.div
                        className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-sm flex-shrink-0"
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.4 }}
                      >
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                      </motion.div>
                      <div className="min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-white truncate">{day.day}</h3>
                        <p className="text-yellow-300 text-xs sm:text-sm font-medium">{day.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                      <div className="text-left sm:text-right flex-1 sm:flex-none min-w-0">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight">
                          {day.title}
                        </h2>
                        <p className="text-amber-200 text-xs sm:text-sm font-medium">
                          {day.subtitle}
                        </p>
                      </div>

                      <motion.div
                        className="p-2 rounded-full bg-white/10 flex-shrink-0"
                        animate={{ rotate: expandedDays.has(index) ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Expandable Events List */}
                <AnimatePresence>
                  {expandedDays.has(index) && (
                    <motion.div
                      variants={variants.eventsContainerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="mt-4 sm:mt-6 overflow-hidden"
                    >
                      <motion.div
                        className="p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl"
                        style={{
                          background: `${day.bgColor}80`,
                          borderColor: day.borderColor
                        }}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h4 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: day.glowColor }} />
                          Event Schedule
                        </h4>

                        <div className="space-y-2 sm:space-y-3">
                          {day.events.map((event, i) => {
                            const EventIcon = event.icon;
                            return (
                              <motion.div
                                key={i}
                                variants={variants.eventVariants}
                                className="group flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10 hover:border-yellow-400/50 hover:bg-black/40 transition-all duration-300"
                                whileHover={reducedMotion ? {} : { x: mobile ? 1 : 2, scale: mobile ? 1.002 : 1.005 }}
                              >
                                <motion.div
                                  className="p-1.5 sm:p-2 rounded-lg flex-shrink-0 mt-0.5 sm:mt-1"
                                  style={{ backgroundColor: `${day.glowColor}40` }}
                                  whileHover={{ scale: 1.1, rotate: 10 }}
                                >
                                  <EventIcon className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: day.glowColor }} />
                                </motion.div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-yellow-300 text-xs font-bold uppercase tracking-wide mb-1">
                                    {event.time}
                                  </p>
                                  <p className="text-white text-xs sm:text-sm font-medium leading-relaxed">
                                    {event.label}
                                  </p>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Decorative elements */}
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full"
                  style={{ background: `linear-gradient(135deg, ${day.glowColor}, ${day.glowColor}80)` }}
                  animate={{
                    scale: expandedDays.has(index) ? [1, 1.5, 1] : [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: expandedDays.has(index) ? 1 : 2,
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                />
                <motion.div
                  className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-gradient-to-r from-black to-gray-700"
                  animate={{
                    scale: expandedDays.has(index) ? [1, 1.4, 1] : [1, 1.2, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{
                    duration: expandedDays.has(index) ? 1.5 : 2.5,
                    repeat: Infinity,
                    delay: 0.5 + index * 0.2
                  }}
                />
              </motion.div>

              {/* Connection line to path */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-16 h-1 rounded-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${day.glowColor}60, transparent)`
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                animate={{
                  scaleX: expandedDays.has(index) ? [1, 1.2, 1] : 1,
                  opacity: expandedDays.has(index) ? [0.6, 1, 0.6] : 0.6
                }}
                transition={{
                  duration: expandedDays.has(index) ? 2 : 1,
                  delay: index * 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  repeat: expandedDays.has(index) ? Infinity : 0
                }}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Floating particles with theme colors - disabled on mobile for performance */}
      {!mobile && !reducedMotion && [...Array(6)].map((_, i) => {
        const colors = ['#FCD34D', '#FB923C', '#EA580C'];
        const color = colors[i % colors.length];
        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: `${color}30`,
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [-15, 15, -15],
              opacity: [0.3, 0.6, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 8 + i * 0.5,
              repeat: Infinity,
              delay: i * 1,
              ease: "linear",
            }}
          />
        );
      })}

      {/* Static particles for mobile */}
      {mobile && [...Array(3)].map((_, i) => (
        <div
          key={`static-${i}`}
          className="absolute w-1.5 h-1.5 rounded-full opacity-30"
          style={{
            backgroundColor: '#FB923C',
            left: `${25 + i * 25}%`,
            top: `${35 + (i % 2) * 30}%`,
          }}
        />
      ))}
    </div>
  );
});

Timeline.displayName = 'Timeline';

export default Timeline;
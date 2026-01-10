"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Users, Trophy, Zap, Coffee, Code, Lightbulb, Target, Award, Presentation, Calendar, Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    ShieldAlert,
    Cpu,
    HeartPulse,
    Sparkles,
    Accessibility,
    ScanFace
} from "lucide-react";
import { useRef, useState, useEffect } from "react";

// --- Data Configuration (Same as before) ---
const timelineData = [
    {
        day: "Day 1",
        date: "29th Jan",
        events: [
            { time: "08:00 AM", title: "Reporting", icon: Users, desc: "Check-in at Tech Park 2" },
            { time: "09:00 AM", title: "Idea Pitching (Round 2)", icon: Lightbulb, desc: "3-minute offline pitch per team" },
            { time: "05:00 PM", title: "Pitching Concludes", icon: Coffee, desc: "Jury deliberation begins" },
            { time: "06:00 PM", title: "Shortlist Announcement", icon: Trophy, desc: "Top 25-30 teams revealed" },
            { time: "07:00 PM", title: "Development Phase", icon: Code, desc: "Move to Mini Hall 2 & coding starts" },
        ]
    },
    {
        day: "Day 2",
        date: "30th Jan",
        events: [
            { time: "07:00 AM", title: "Submission Deadline", icon: Zap, desc: "Code freeze & repository submission" },
            { time: "10:00 AM", title: "Final Presentations", icon: Presentation, desc: "Top 10 teams demo (Tech Park 2)" },
            { time: "02:00 PM", title: "Final Evaluation", icon: Target, desc: "Jury decides top 3 winners" },
            { time: "05:00 PM", title: "Valedictory Ceremony", icon: Award, desc: "Results and prize distribution" },
        ]
    }
];

const tracksData = [
    {
        title: "Accessibility & Inclusion",
        icon: Accessibility,
        id: "SUB-001",
        desc: "Bridging the divide. Tools for the unseen.",
        color: "from-blue-900/40 to-blue-600/10" // Slight cold contrast to the red
    },
    {
        title: "Cybersecurity & Privacy",
        icon: ShieldAlert,
        id: "SUB-002",
        desc: "Protect the grid. Encryption is survival.",
        color: "from-red-900/40 to-red-600/10"
    },
    {
        title: "IoT & Embedded Systems",
        icon: Cpu,
        id: "SUB-003",
        desc: "Hardware wiring. The mind flayer's network.",
        color: "from-amber-900/40 to-amber-600/10"
    },
    {
        title: "Healthcare",
        icon: HeartPulse,
        id: "SUB-004",
        desc: "Vital signs critical. Tech for life support.",
        color: "from-emerald-900/40 to-emerald-600/10"
    },
    {
        title: "Open Innovation",
        icon: Sparkles,
        id: "SUB-005",
        desc: "Unclassified anomalies. Build the impossible.",
        color: "from-purple-900/40 to-purple-600/10"
    }
];

export default function HackathonPage() {
    const router = useRouter();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    const [activeTab, setActiveTab] = useState(0);

    // Parallax effect for background
    const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

    return (
        <div className="min-h-screen bg-[#050505] text-gray-200 overflow-hidden font-sans selection:bg-red-900 selection:text-white" ref={containerRef}>

            {/* --- THE UPSIDE DOWN ATMOSPHERE (Layered Z-Index is crucial here) --- */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div style={{ y: yBg }} className="absolute inset-0">
                    {/* 1. Deep Void Base */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_#1a0505,_#000000_70%)]" />

                    {/* 2. Volumetric Fog Fog (Atmosphere) */}
                    <div className="absolute top-[20%] left-[10%] w-[50vw] h-[50vw] bg-red-900/20 rounded-full blur-[150px] mix-blend-screen animate-pulse-slow" />
                    <div className="absolute bottom-[10%] right-[0%] w-[60vw] h-[60vw] bg-red-950/30 rounded-full blur-[200px] mix-blend-screen" />
                </motion.div>

                {/* 3. Creeping Vines (Visible Layer) */}
                <CreepingVines />

                {/* 4. Dense Spore Particle System (Foreground Layer) */}
                <SporeStorm />

                {/* 5. Vignette & Grain Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(transparent_40%,_black_100%)] z-20 opacity-90" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay z-20" />
            </div>

            <div className="relative z-30 container mx-auto px-4 sm:px-6 py-6">

                {/* --- Header Section --- */}
                <header className="mb-8 pt-4 relative">
                    {/* THE FLESHY PORTAL BUTTON */}
                    <FleshyPortalButton onClick={() => router.back()} />

                    <div className="flex flex-col items-center text-center mt-20 sm:mt-0">
                        <HeroLogos />

                        {/* HUD Meta Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-8 flex flex-wrap justify-center gap-4"
                        >
                            <HudPill icon={Calendar} text="JAN 29-30" delay={0.6} />
                            <HudPill icon={Clock} text="48 HOURS" delay={0.7} />
                            <HudPill icon={MapPin} text="SRM IST" delay={0.8} />
                        </motion.div>
                    </div>
                </header>

                <div className="mb-24">
                    <TracksCarousel />
                </div>

                {/* --- Timeline Content Area --- */}
                <div className="relative max-w-6xl mx-auto pb-32">

                    {/* Tab Navigation */}
                    <motion.div
                        className="flex justify-center mb-16 w-full"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <div className="inline-flex bg-black/80 backdrop-blur-xl border border-red-900/30 rounded-full p-1.5 shadow-[0_0_50px_rgba(20,0,0,0.8)] z-30">
                            {timelineData.map((dayData, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveTab(index)}
                                    className={`relative px-8 sm:px-12 py-3 rounded-full font-mono text-sm tracking-widest uppercase transition-all duration-300 overflow-hidden ${activeTab === index
                                        ? 'text-white shadow-[0_0_30px_rgba(220,38,38,0.6)] border border-red-500/50'
                                        : 'text-red-300/50 hover:text-red-200 hover:bg-red-900/20'
                                        }`}
                                >
                                    {activeTab === index && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-gradient-to-r from-[#7a0000] to-[#aa0000]"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2 font-bold drop-shadow-lg">
                                        {activeTab === index && <Zap className="w-4 h-4 fill-red-200 text-white animate-pulse" />}
                                        {dayData.date}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Timeline Layout */}
                    <div className="relative px-2 sm:px-0">

                        {/* The Central Spine (Vein) */}
                        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[6px] bg-[#2a0505] md:-translate-x-1/2 rounded-full overflow-hidden shadow-[inset_0_0_15px_#000,0_0_20px_rgba(255,0,0,0.2)] border-x border-red-900/30">
                            {/* Pulsating Red Biological Matter */}
                            <motion.div
                                className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-transparent via-red-500 to-transparent blur-[8px]"
                                animate={{ top: ["-20%", "120%"] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                            />
                        </div>

                        {/* Events */}
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-6"
                        >
                            {timelineData[activeTab].events.map((event, index) => (
                                <TimelineNode
                                    key={`${timelineData[activeTab].day}-${index}`}
                                    event={event}
                                    isEven={index % 2 === 0}
                                    index={index}
                                />
                            ))}
                        </motion.div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// ==================== UPDATED COMPONENTS ====================

function TracksCarousel() {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScrollButtons = () => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scrollLeft = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const carousel = carouselRef.current;
        if (carousel) {
            checkScrollButtons();
            carousel.addEventListener('scroll', checkScrollButtons);
            return () => carousel.removeEventListener('scroll', checkScrollButtons);
        }
    }, []);

    return (
        <section className="relative py-20 overflow-hidden">
            {/* Section Header - VHS Style */}
            <div className="container mx-auto px-4 mb-10 relative z-20">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-1 bg-red-600 box-shadow-[0_0_10px_red]" />
                    <h2 className="text-2xl sm:text-3xl font-black text-red-100 tracking-[0.2em] font-serif uppercase drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">
                        Restricted Areas
                    </h2>
                </div>
                <p className="text-red-400/60 font-mono text-xs sm:text-sm tracking-widest pl-16">
                    // SELECT YOUR MISSION PARAMETERS //
                </p>
            </div>

            {/* Carousel Container with Navigation */}
            <div className="relative">
                {/* Left Arrow */}
                <motion.button
                    onClick={scrollLeft}
                    disabled={!canScrollLeft}
                    className={`absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border-2 transition-all duration-300 ${canScrollLeft
                            ? 'bg-[#1a0505]/90 border-red-500/50 text-red-300 hover:bg-red-900/50 hover:border-red-400 hover:text-red-100 shadow-[0_0_20px_rgba(220,38,38,0.3)]'
                            : 'bg-[#0a0202]/50 border-red-900/20 text-red-900/50 cursor-not-allowed'
                        } backdrop-blur-sm flex items-center justify-center group`}
                    whileHover={canScrollLeft ? { scale: 1.1 } : {}}
                    whileTap={canScrollLeft ? { scale: 0.95 } : {}}
                >
                    <ChevronLeft className="w-6 h-6" />
                    {canScrollLeft && (
                        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl scale-0 group-hover:scale-150 transition-transform duration-500" />
                    )}
                </motion.button>

                {/* Right Arrow */}
                <motion.button
                    onClick={scrollRight}
                    disabled={!canScrollRight}
                    className={`absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border-2 transition-all duration-300 ${canScrollRight
                            ? 'bg-[#1a0505]/90 border-red-500/50 text-red-300 hover:bg-red-900/50 hover:border-red-400 hover:text-red-100 shadow-[0_0_20px_rgba(220,38,38,0.3)]'
                            : 'bg-[#0a0202]/50 border-red-900/20 text-red-900/50 cursor-not-allowed'
                        } backdrop-blur-sm flex items-center justify-center group`}
                    whileHover={canScrollRight ? { scale: 1.1 } : {}}
                    whileTap={canScrollRight ? { scale: 0.95 } : {}}
                >
                    <ChevronRight className="w-6 h-6" />
                    {canScrollRight && (
                        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl scale-0 group-hover:scale-150 transition-transform duration-500" />
                    )}
                </motion.button>

                {/* The Scrollable Carousel */}
                <div
                    ref={carouselRef}
                    className="overflow-x-auto pl-4 sm:pl-16 pr-4 sm:pr-16 relative z-20 [&::-webkit-scrollbar]:hidden"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }}
                    onScroll={checkScrollButtons}
                >
                    <div className="flex gap-6 w-max">
                        {tracksData.map((track, index) => (
                            <TrackCard key={index} track={track} index={index} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Background Static Noise Strip */}
            <div className="absolute top-1/2 left-0 w-full h-32 -translate-y-1/2 bg-red-900/5 blur-3xl -z-10" />
        </section>
    );
}

interface Track {
    title: string;
    icon: any;
    id: string;
    desc: string;
    color: string;
}

function TrackCard({ track, index }: { track: Track; index: number }) {
    const Icon = track.icon;
    return (
        <motion.div
            className="relative flex-shrink-0 w-72 h-96 group perspective-1000"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
        >
            <div className={`relative h-full w-full bg-[#0a0202] border border-[#3a0a0a] group-hover:border-red-500/50 transition-all duration-500 overflow-hidden flex flex-col justify-between p-6 rounded-sm shadow-[0_0_30px_rgba(0,0,0,0.8)]`}>

                {/* 1. Background Effects */}
                <div className={`absolute inset-0 bg-gradient-to-b ${track.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-screen`} />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

                {/* CRT Scanline Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />

                {/* 2. Top Content: ID & Status */}
                <div className="relative z-10 flex justify-between items-start border-b border-red-900/20 pb-4 mb-4">
                    <span className="font-mono text-xs text-red-500/70 tracking-widest">{track.id}</span>
                    <ScanFace className="w-4 h-4 text-red-900/50 group-hover:text-red-500 transition-colors animate-pulse" />
                </div>

                {/* 3. Main Icon (Floating) */}
                <div className="relative z-10 flex-grow flex items-center justify-center py-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
                        <Icon className="w-16 h-16 text-gray-500 group-hover:text-red-100 transition-colors duration-500 drop-shadow-[0_0_15px_rgba(0,0,0,1)]" />
                    </div>
                </div>

                {/* 4. Bottom Content */}
                <div className="relative z-10">
                    <h3 className="text-xl font-bold font-serif text-gray-200 group-hover:text-white mb-2 leading-tight uppercase group-hover:tracking-wider transition-all duration-300">
                        {track.title}
                    </h3>
                    <p className="text-xs font-mono text-gray-500 group-hover:text-red-200/70 leading-relaxed border-l-2 border-red-900/30 pl-3">
                        {track.desc}
                    </p>
                </div>

                {/* 5. Glitch Overlay on Hover */}
                <div className="absolute inset-0 bg-red-500/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none mix-blend-color-dodge z-20" />
            </div>
        </motion.div>
    )
}

// 1. NEW: Fleshy Portal Button (Organic Shape)
function FleshyPortalButton({ onClick }: { onClick: () => void }) {
    return (
        <motion.div
            className="absolute top-4 left-4 sm:left-8 z-50 pointer-events-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, type: 'spring' }}
        >
            <button
                onClick={onClick}
                className="group relative flex items-center justify-center focus:outline-none"
            >
                {/* Biological Glow behind */}
                <div className="absolute inset-0 bg-red-600/30 blur-2xl rounded-full scale-75 group-hover:scale-125 group-hover:bg-red-500/50 transition-all duration-700 ease-out animate-pulse-slow" />

                {/* The Fleshy Container (Using border-radius for organic shape) */}
                <div className="relative w-16 h-16 sm:w-auto sm:h-12 sm:px-6 bg-gradient-to-br from-[#3a0000] to-[#1a0000] border-2 border-red-700/50 shadow-[inset_0_0_20px_#000,0_0_15px_rgba(220,0,0,0.4)] flex items-center justify-center overflow-hidden group-hover:border-red-500 group-hover:shadow-[inset_0_0_25px_#500,0_0_30px_rgba(255,0,0,0.6)] transition-all duration-500
                    rounded-[40%_60%_70%_30%/50%_30%_70%_50%] sm:rounded-full"
                >
                    {/* Internal membrane texture */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" />

                    {/* The "Opening" effect on hover */}
                    <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/20 transition-colors duration-500 mix-blend-color-dodge" />

                    <div className="relative z-10 flex items-center gap-2">
                        {/* Pulsing Core */}
                        <div className="w-3 h-3 rounded-full bg-red-400 animate-ping absolute sm:relative opacity-70" />
                        <div className="w-2 h-2 rounded-full bg-white relative" />

                        <span className="hidden sm:block font-mono text-xs text-red-200 tracking-[0.2em] font-bold group-hover:text-white group-hover:tracking-[0.3em] transition-all duration-500 drop-shadow-md">
                            THE RIGHT SIDE UP
                        </span>
                    </div>
                </div>
            </button>
        </motion.div>
    )
}

// 2. UPDATED: Visible Creeping Vines (Glowing Veins)
// 2. UPDATED: Visible Creeping Vines (Glowing Veins - Dense Version)
function CreepingVines() {
    return (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">

            {/* --- TOP LEFT CLUSTER (Primary Overgrowth) --- */}
            <svg className="absolute -top-10 -left-10 w-[60vw] h-[60vw] text-[#8a3a3a] opacity-60 filter drop-shadow-[0_0_8px_rgba(220,50,50,0.6)]" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Main thick artery */}
                <motion.path
                    d="M0,0 Q30,15 50,40 T80,90"
                    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 8, ease: "easeInOut" }}
                />
                {/* Secondary branching vein */}
                <motion.path
                    d="M10,-10 Q40,30 65,60 T100,100"
                    fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 10, ease: "easeInOut", delay: 1 }}
                />
                {/* New: Wide creeping tendril */}
                <motion.path
                    d="M-5,20 Q25,25 45,55 T75,95"
                    fill="none" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 12, ease: "easeInOut", delay: 0.5 }}
                />
                {/* New: Horizontal reaching vine */}
                <motion.path
                    d="M0,10 Q40,5 80,30"
                    fill="none" stroke="currentColor" strokeWidth="0.4" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 9, ease: "easeInOut", delay: 2 }}
                />
                {/* Small branching veins */}
                <motion.path d="M50,40 Q60,30 70,20" fill="none" stroke="currentColor" strokeWidth="0.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 4 }} />
                <motion.path d="M30,15 Q40,25 35,45" fill="none" stroke="currentColor" strokeWidth="0.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, delay: 3.5 }} />
            </svg>

            {/* --- BOTTOM RIGHT CLUSTER (Intrusion) --- */}
            <svg className="absolute -bottom-10 -right-10 w-[70vw] h-[70vw] text-[#7a2a2a] opacity-50 rotate-180 filter drop-shadow-[0_0_8px_rgba(220,50,50,0.6)]" viewBox="0 0 100 100" preserveAspectRatio="none">
                <motion.path
                    d="M0,0 Q25,20 45,50 T95,95"
                    fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 9, ease: "easeInOut" }}
                />
                <motion.path
                    d="M20,0 Q40,30 60,60 T90,90"
                    fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 11, ease: "easeInOut", delay: 1.5 }}
                />
                {/* New: Aggressive curved hook */}
                <motion.path
                    d="M-10,10 Q30,50 50,80 T80,100"
                    fill="none" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 13, ease: "easeInOut", delay: 0.5 }}
                />
                <motion.path d="M45,50 Q35,60 25,70" fill="none" stroke="currentColor" strokeWidth="0.4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, delay: 5 }} />
                <motion.path d="M60,60 Q70,50 85,55" fill="none" stroke="currentColor" strokeWidth="0.4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, delay: 6 }} />
            </svg>

            {/* --- NEW: BOTTOM LEFT CLUSTER (Subtle Filler) --- */}
            <svg className="absolute -bottom-20 -left-20 w-[50vw] h-[50vw] text-[#5a1a1a] opacity-40 filter drop-shadow-[0_0_5px_rgba(200,30,30,0.4)]" viewBox="0 0 100 100" preserveAspectRatio="none">
                <motion.path
                    d="M0,100 Q20,70 50,50 T90,20"
                    fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 10, ease: "easeInOut", delay: 2 }}
                />
                <motion.path
                    d="M10,100 Q30,80 40,60"
                    fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 8, ease: "easeInOut", delay: 4 }}
                />
            </svg>
        </div>
    )
}

// 3. UPDATED: Dense Spore Storm (More particles, varying sizes/colors)
function SporeStorm() {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);
    if (!isMounted) return null;

    // Increased count to 100 for density
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-15">
            {Array.from({ length: 100 }).map((_, i) => {
                const isRed = Math.random() > 0.7; // 30% are red spores
                const size = Math.random() * 4 + 1;
                return (
                    <motion.div
                        key={i}
                        className={`absolute rounded-full ${isRed ? 'bg-red-500/60' : 'bg-gray-300/40'}`}
                        style={{
                            width: size + "px",
                            height: size + "px",
                            filter: `blur(${Math.random() * 3}px)`,
                            boxShadow: isRed ? '0 0 5px red' : 'none'
                        }}
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            opacity: 0
                        }}
                        animate={{
                            y: [null, Math.random() * -200 - 50], // Stronger upward drift
                            x: [null, (Math.random() - 0.5) * 100], // Wider sideways drift
                            opacity: [0, Math.random() * 0.8 + 0.2, 0] // Brighter peaks
                        }}
                        transition={{
                            duration: Math.random() * 15 + 15, // Slower, more floaty
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 20
                        }}
                    />
                )
            })}
        </div>
    );
}


// --- OTHER COMPONENTS (Slightly adjusted styles) ---

function HeroLogos() {
    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto z-30">
            <div className="flex flex-wrap justify-center items-center gap-8 mb-6 opacity-90 hover:opacity-100 transition-opacity">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative group"
                >
                    <img src="/srmlogo.png" alt="Sponsors" className="h-12 sm:h-16 object-contain mix-blend-screen brightness-150 contrast-125 drop-shadow-[0_0_10px_rgba(255,100,100,0.5)]" />
                </motion.div>

                <div className="hidden sm:block h-10 w-[2px] bg-red-900/50 rounded-full" />

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative group"
                >
                    <img src="/FUTURIXLOGO.png" alt="Partners" className="h-10 sm:h-14 object-contain mix-blend-screen brightness-150 contrast-125 drop-shadow-[0_0_10px_rgba(100,100,255,0.5)]" />
                </motion.div>
            </div>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 1.5, delay: 0.4 }}
                className="relative mt-4"
            >
                {/* Stronger red glow behind logo */}
                <div className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] bg-red-600/20 blur-[100px] rounded-full mix-blend-screen animate-pulse-slow" />
                <img src="/ultronlogo.png" alt="ULTRON 9.0" className="relative z-10 w-72 sm:w-[30rem] drop-shadow-[0_0_50px_rgba(220,0,0,0.8)]" />
            </motion.div>
        </div>
    )
}

function HudPill({ icon: Icon, text, delay }: { icon: any, text: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.5 }}
            className="flex items-center gap-3 px-5 py-2.5 border-2 border-red-900/40 bg-[#1a0505]/80 backdrop-blur-md rounded-lg hover:border-red-500/70 hover:bg-red-950/50 transition-all cursor-default shadow-[0_0_20px_rgba(0,0,0,0.6)] group"
        >
            <Icon className="w-4 h-4 text-red-500 group-hover:text-red-300 transition-colors" />
            <span className="font-mono text-xs text-red-200/80 tracking-[0.15em] font-bold group-hover:text-red-100">{text}</span>
        </motion.div>
    );
}

// --- UPDATED COMPONENT: TIMELINE NODE (No Circular Buttons) ---
function TimelineNode({ event, isEven, index }: { event: any, isEven: boolean, index: number }) {
    const Icon = event.icon;
    const tilt = isEven ? "rotate-[1deg]" : "-rotate-[1deg]";

    return (
        <div className={`relative flex flex-col md:flex-row items-center w-full mb-14 md:mb-0 ${isEven ? 'md:flex-row-reverse' : ''}`}>

            <div className="hidden md:block w-1/2" />

            {/* Circuit Connection - REMOVED THE CIRCLE NODE */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-y-1/2 items-center justify-center z-0 w-20">
                {/* The horizontal connecting line remains, but the "button" is gone */}
                <div className={`h-[3px] bg-[#3a0a0a] w-20 absolute top-1/2 border-y border-red-900/30 ${isEven ? '-left-20' : 'left-0'}`} />
            </div>

            {/* Mobile Vertical Connector */}
            <div className="md:hidden absolute left-4 top-0 bottom-0 w-[2px] bg-[#1a0505]" />
            {/* Mobile "Button" removed here as well */}

            {/* The Card */}
            <motion.div
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`w-full md:w-[calc(50%-72px)] pl-12 md:pl-0 relative z-10 ${isEven ? 'md:mr-20' : 'md:ml-20'}`}
            >
                <div
                    className={`group relative overflow-hidden rounded-lg bg-[#0a0202] border-2 border-[#2a0a0a] hover:border-red-600/60 transition-all duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.8)] ${tilt} hover:rotate-0 hover:scale-[1.02]`}
                >
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-r from-red-900/0 via-red-800/30 to-red-900/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 mix-blend-color-dodge" />

                    <div className="relative p-6 flex items-start gap-5">
                        <div className="flex-shrink-0">
                            <div className="p-3 rounded-md bg-[#1a0505] border border-red-900/40 text-red-600 group-hover:text-red-300 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all duration-300">
                                <Icon className="w-7 h-7" />
                            </div>
                        </div>

                        <div className="flex-grow min-w-0 pt-1">
                            <div className="flex flex-wrap items-center justify-between gap-x-2 mb-2">
                                <h3 className="text-xl font-bold text-red-100 group-hover:text-white font-serif tracking-wide drop-shadow-sm">{event.title}</h3>
                                <span className="text-[11px] font-mono font-bold text-red-300/90 bg-[#2a0505] px-2 py-1 border border-red-900/50 rounded-sm">
                                    {event.time}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 group-hover:text-gray-300 leading-relaxed font-medium">
                                {event.desc}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
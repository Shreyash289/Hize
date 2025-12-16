/* =========================================================
   Mobile Performance Optimization Utilities (FINAL)
   Safe for Android, iOS, Next.js, Framer Motion
   ========================================================= */

type DeviceInfo = {
  isMobile: boolean
  isLowEnd: boolean
  reduceMotion: boolean
}

let cachedDeviceInfo: DeviceInfo | null = null

/* -------------------------------
   Device capability detection
-------------------------------- */
const computeDeviceInfo = (): DeviceInfo => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return { isMobile: false, isLowEnd: false, reduceMotion: false }
  }

  const ua = navigator.userAgent

  const isMobile =
    window.matchMedia("(max-width: 768px)").matches ||
    /Android|iPhone|iPad|iPod/i.test(ua)

  const connection = (navigator as any).connection
  const slowConnection =
    connection?.effectiveType === "2g" ||
    connection?.effectiveType === "slow-2g"

  const lowMemory =
    (navigator as any).deviceMemory !== undefined &&
    (navigator as any).deviceMemory <= 3

  const lowCPU =
    navigator.hardwareConcurrency !== undefined &&
    navigator.hardwareConcurrency <= 4

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches

  return {
    isMobile,
    isLowEnd: slowConnection || lowMemory || lowCPU,
    reduceMotion: prefersReducedMotion || isMobile || lowMemory,
  }
}

const getDeviceInfo = (): DeviceInfo => {
  if (!cachedDeviceInfo) {
    cachedDeviceInfo = computeDeviceInfo()
  }
  return cachedDeviceInfo
}

/* -------------------------------
   Public helpers
-------------------------------- */
export const isMobile = () => getDeviceInfo().isMobile

export const isLowEndDevice = () => getDeviceInfo().isLowEnd

export const shouldReduceAnimations = () =>
  getDeviceInfo().reduceMotion

/* -------------------------------
   Animation configuration
-------------------------------- */
export const getOptimizedAnimationConfig = () => {
  const reduce = shouldReduceAnimations()

  if (reduce) {
    return {
      duration: 0.12,
      ease: "linear",
      stagger: 0,
      useTransform: false,
    }
  }

  return {
    duration: 0.5,
    ease: "easeOut",
    stagger: 0.08,
    useTransform: true,
  }
}

/* -------------------------------
   Framer Motion variants
-------------------------------- */
export const getMobileOptimizedVariants = () => {
  const reduce = shouldReduceAnimations()
  const config = getOptimizedAnimationConfig()

  // Low-end / mobile: opacity only (GPU-safe)
  if (reduce) {
    return {
      hidden: { opacity: 0.99 },
      visible: {
        opacity: 1,
        transition: { duration: config.duration },
      },
    }
  }

  // Normal devices
  return {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: config.duration,
        ease: config.ease,
      },
    },
    hover: {
      y: -4,
      transition: { duration: 0.15 },
    },
  }
}

/* -------------------------------
   IntersectionObserver (singleton)
-------------------------------- */
let sharedObserver: IntersectionObserver | null = null

export const getOptimizedObserver = (
  callback: IntersectionObserverCallback
) => {
  if (typeof window === "undefined") return null

  if (!sharedObserver) {
    const mobile = isMobile()

    sharedObserver = new IntersectionObserver(callback, {
      threshold: mobile ? 0.05 : 0.25,
      rootMargin: mobile ? "40px" : "120px",
    })
  }

  return sharedObserver
}

/* -------------------------------
   Scroll handler (RAF based)
-------------------------------- */
export const createMobileScrollHandler = (handler: () => void) => {
  let ticking = false

  return () => {
    if (ticking) return

    ticking = true
    requestAnimationFrame(() => {
      handler()
      ticking = false
    })
  }
}

/* -------------------------------
   Performance measurement (DEV)
-------------------------------- */
export const measurePerformance = (name: string, fn: () => void) => {
  if (
    typeof performance === "undefined" ||
    process.env.NODE_ENV === "production"
  ) {
    fn()
    return
  }

  const start = performance.now()
  fn()
  const duration = performance.now() - start

  if (duration > 16) {
    console.warn(`[perf] ${name}: ${duration.toFixed(2)}ms`)
  }
}

/* -------------------------------
   Default export
-------------------------------- */
export default {
  isMobile,
  isLowEndDevice,
  shouldReduceAnimations,
  getOptimizedAnimationConfig,
  getMobileOptimizedVariants,
  getOptimizedObserver,
  createMobileScrollHandler,
  measurePerformance,
}

/* =========================================================
   Universal Responsive Utilities (FINAL)
   SSR-safe, Mobile-first, Resize-aware
   ========================================================= */

/* -------------------------------
   Breakpoints (Tailwind aligned)
-------------------------------- */
export const breakpoints = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const

export type BreakpointKey = keyof typeof breakpoints

/* -------------------------------
   Containers
-------------------------------- */
export const containerSizes = {
  xs: "max-w-none",
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
} as const

/* -------------------------------
   Spacing (mobile-first)
-------------------------------- */
export const spacing = {
  xs: "px-3 sm:px-4",
  sm: "px-4 sm:px-6",
  md: "px-4 sm:px-6 md:px-8",
  lg: "px-4 sm:px-6 md:px-8 lg:px-12",
  xl: "px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16",
} as const

/* -------------------------------
   Typography
-------------------------------- */
export const textSizes = {
  xs: "text-xs sm:text-sm",
  sm: "text-sm sm:text-base",
  base: "text-base sm:text-lg",
  lg: "text-lg sm:text-xl",
  xl: "text-xl sm:text-2xl",
  "2xl": "text-2xl sm:text-3xl",
  "3xl": "text-3xl sm:text-4xl md:text-5xl",
  "4xl": "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
  "5xl": "text-5xl sm:text-6xl md:text-7xl lg:text-8xl",
} as const

/* -------------------------------
   Layout helpers
-------------------------------- */
export const gaps = {
  xs: "gap-2 sm:gap-3",
  sm: "gap-3 sm:gap-4",
  md: "gap-4 sm:gap-6",
  lg: "gap-6 sm:gap-8",
  xl: "gap-8 sm:gap-12",
} as const

export const padding = {
  xs: "p-2 sm:p-3",
  sm: "p-3 sm:p-4",
  md: "p-4 sm:p-6",
  lg: "p-6 sm:p-8",
  xl: "p-8 sm:p-12",
} as const

export const margin = {
  xs: "m-2 sm:m-3",
  sm: "m-3 sm:m-4",
  md: "m-4 sm:m-6",
  lg: "m-6 sm:m-8",
  xl: "m-8 sm:m-12",
} as const

/* -------------------------------
   Grid presets
-------------------------------- */
export const gridCols = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  auto: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
} as const

/* -------------------------------
   Class composer
-------------------------------- */
export function getResponsiveClasses(config: {
  container?: keyof typeof containerSizes
  spacing?: keyof typeof spacing
  textSize?: keyof typeof textSizes
  gap?: keyof typeof gaps
  padding?: keyof typeof padding
  margin?: keyof typeof margin
  gridCols?: keyof typeof gridCols
}) {
  return [
    config.container && containerSizes[config.container],
    config.spacing && spacing[config.spacing],
    config.textSize && textSizes[config.textSize],
    config.gap && gaps[config.gap],
    config.padding && padding[config.padding],
    config.margin && margin[config.margin],
    config.gridCols && gridCols[config.gridCols],
  ]
    .filter(Boolean)
    .join(" ")
}

/* =========================================================
   Responsive Runtime Hook (SAFE)
   ========================================================= */

import { useEffect, useState } from "react"

type ResponsiveState = {
  width: number
  height: number
  breakpoint: BreakpointKey
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isTouch: boolean
}

const getBreakpoint = (width: number): BreakpointKey => {
  if (width < breakpoints.sm) return "xs"
  if (width < breakpoints.md) return "sm"
  if (width < breakpoints.lg) return "md"
  if (width < breakpoints.xl) return "lg"
  if (width < breakpoints["2xl"]) return "xl"
  return "2xl"
}

export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => ({
    width: 0,
    height: 0,
    breakpoint: "xl",
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouch: false,
  }))

  useEffect(() => {
    if (typeof window === "undefined") return

    const update = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const bp = getBreakpoint(width)

      setState({
        width,
        height,
        breakpoint: bp,
        isMobile: width < breakpoints.md,
        isTablet: width >= breakpoints.md && width < breakpoints.lg,
        isDesktop: width >= breakpoints.lg,
        isTouch: window.matchMedia("(pointer: coarse)").matches,
      })
    }

    update()

    window.addEventListener("resize", update, { passive: true })
    window.addEventListener("orientationchange", update)

    return () => {
      window.removeEventListener("resize", update)
      window.removeEventListener("orientationchange", update)
    }
  }, [])

  return state
}

/* -------------------------------
   Media Queries
-------------------------------- */
export const mediaQueries = {
  mobile: `(max-width: ${breakpoints.md - 1}px)`,
  tablet: `(min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`,
  desktop: `(min-width: ${breakpoints.lg}px)`,
  touch: "(hover: none) and (pointer: coarse)",
  mouse: "(hover: hover) and (pointer: fine)",
} as const

/* -------------------------------
   Responsive image sizes
-------------------------------- */
export const imageSizes = {
  avatar: "(max-width: 640px) 56px, (max-width: 1024px) 72px, 96px",
  card: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  hero: "(max-width: 640px) 100vw, (max-width: 1024px) 85vw, 70vw",
  full: "100vw",
} as const

/* -------------------------------
   Default export
-------------------------------- */
export default {
  breakpoints,
  containerSizes,
  spacing,
  textSizes,
  gaps,
  padding,
  margin,
  gridCols,
  getResponsiveClasses,
  useResponsive,
  mediaQueries,
  imageSizes,
}

// Responsive utility functions and constants for consistent breakpoints

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const containerSizes = {
  xs: 'max-w-none',
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
} as const;

// Responsive spacing scale
export const spacing = {
  xs: 'px-3 sm:px-4',
  sm: 'px-4 sm:px-6',
  md: 'px-4 sm:px-6 md:px-8',
  lg: 'px-4 sm:px-6 md:px-8 lg:px-12',
  xl: 'px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16',
} as const;

// Responsive text sizes
export const textSizes = {
  xs: 'text-xs sm:text-sm',
  sm: 'text-sm sm:text-base',
  base: 'text-base sm:text-lg',
  lg: 'text-lg sm:text-xl',
  xl: 'text-xl sm:text-2xl',
  '2xl': 'text-2xl sm:text-3xl',
  '3xl': 'text-3xl sm:text-4xl md:text-5xl',
  '4xl': 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
  '5xl': 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl',
} as const;

// Responsive gap sizes
export const gaps = {
  xs: 'gap-2 sm:gap-3',
  sm: 'gap-3 sm:gap-4',
  md: 'gap-4 sm:gap-6',
  lg: 'gap-6 sm:gap-8',
  xl: 'gap-8 sm:gap-12',
} as const;

// Responsive padding
export const padding = {
  xs: 'p-2 sm:p-3',
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8',
  xl: 'p-8 sm:p-12',
} as const;

// Responsive margin
export const margin = {
  xs: 'm-2 sm:m-3',
  sm: 'm-3 sm:m-4',
  md: 'm-4 sm:m-6',
  lg: 'm-6 sm:m-8',
  xl: 'm-8 sm:m-12',
} as const;

// Grid responsive classes
export const gridCols = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  auto: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
} as const;

// Utility function to get responsive classes
export function getResponsiveClasses(config: {
  container?: keyof typeof containerSizes;
  spacing?: keyof typeof spacing;
  textSize?: keyof typeof textSizes;
  gap?: keyof typeof gaps;
  padding?: keyof typeof padding;
  margin?: keyof typeof margin;
  gridCols?: keyof typeof gridCols;
}) {
  const classes: string[] = [];
  
  if (config.container) classes.push(containerSizes[config.container]);
  if (config.spacing) classes.push(spacing[config.spacing]);
  if (config.textSize) classes.push(textSizes[config.textSize]);
  if (config.gap) classes.push(gaps[config.gap]);
  if (config.padding) classes.push(padding[config.padding]);
  if (config.margin) classes.push(margin[config.margin]);
  if (config.gridCols) classes.push(gridCols[config.gridCols]);
  
  return classes.join(' ');
}

// Hook for responsive behavior
export function useResponsive() {
  if (typeof window === 'undefined') return { isMobile: false, isTablet: false, isDesktop: true };
  
  const width = window.innerWidth;
  
  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    width,
  };
}

// Media query helpers
export const mediaQueries = {
  mobile: `(max-width: ${breakpoints.md})`,
  tablet: `(min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg})`,
  desktop: `(min-width: ${breakpoints.lg})`,
  touch: '(hover: none) and (pointer: coarse)',
  mouse: '(hover: hover) and (pointer: fine)',
} as const;

// Responsive image sizes
export const imageSizes = {
  avatar: '(max-width: 640px) 64px, (max-width: 1024px) 80px, 96px',
  card: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  hero: '(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 70vw',
  full: '100vw',
} as const;

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
};
// Mobile performance optimization utilities

export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isLowEndDevice = () => {
  if (typeof navigator === 'undefined') return false;
  
  // Check for low-end device indicators
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
  const isLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;
  const isLowConcurrency = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
  
  return isSlowConnection || isLowMemory || isLowConcurrency;
};

export const shouldReduceAnimations = () => {
  if (typeof window === 'undefined') return false;
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  return prefersReducedMotion || isMobile() || isLowEndDevice();
};

export const getOptimizedAnimationConfig = () => {
  const shouldReduce = shouldReduceAnimations();
  
  return {
    duration: shouldReduce ? 0.1 : 0.6,
    ease: shouldReduce ? "linear" : "easeOut",
    stagger: shouldReduce ? 0.01 : 0.1,
    scale: shouldReduce ? 1 : 1.05,
    y: shouldReduce ? 0 : 20,
    opacity: shouldReduce ? 1 : [0, 1],
  };
};

export const getMobileOptimizedVariants = () => {
  const config = getOptimizedAnimationConfig();
  
  return {
    hidden: { 
      opacity: config.opacity === 1 ? 1 : 0, 
      y: config.y,
      scale: 1
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: config.duration, 
        ease: config.ease 
      }
    },
    hover: shouldReduceAnimations() ? {} : {
      scale: config.scale,
      y: -4,
      transition: { duration: 0.2 }
    }
  };
};

// Intersection Observer with mobile optimizations
export const createOptimizedObserver = (callback: IntersectionObserverCallback) => {
  const options: IntersectionObserverInit = {
    threshold: isMobile() ? 0.1 : 0.3, // Lower threshold for mobile
    rootMargin: isMobile() ? '50px' : '100px', // Smaller margin for mobile
  };
  
  return new IntersectionObserver(callback, options);
};

// Debounced scroll handler for mobile
export const createMobileScrollHandler = (handler: () => void, delay = 16) => {
  let timeoutId: NodeJS.Timeout;
  let lastCall = 0;
  
  return () => {
    const now = Date.now();
    
    if (now - lastCall >= delay) {
      handler();
      lastCall = now;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handler();
        lastCall = Date.now();
      }, delay);
    }
  };
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  if (typeof performance === 'undefined') {
    fn();
    return;
  }
  
  const start = performance.now();
  fn();
  const end = performance.now();
  
  if (end - start > 16) { // More than one frame
    console.warn(`Performance warning: ${name} took ${end - start}ms`);
  }
};

export default {
  isMobile,
  isLowEndDevice,
  shouldReduceAnimations,
  getOptimizedAnimationConfig,
  getMobileOptimizedVariants,
  createOptimizedObserver,
  createMobileScrollHandler,
  measurePerformance,
};
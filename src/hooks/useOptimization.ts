'use client'

import { useEffect, useRef, useState } from 'react'

export function useLazyLoad<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || hasLoaded) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          setHasLoaded(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
        ...options,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [hasLoaded, options])

  return { ref, isVisible }
}

export function useIntersectionObserver<T extends HTMLElement>(
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      callback(entry)
    }, options)

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [callback, options])

  return ref
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)

    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [effectiveType, setEffectiveType] = useState<string>('4g')

  useEffect(() => {
    if (typeof navigator === 'undefined') return

    const updateOnlineStatus = () => setIsOnline(navigator.onLine)
    
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection

    if (connection) {
      setEffectiveType(connection.effectiveType)
      
      const updateConnectionStatus = () => {
        setEffectiveType(connection.effectiveType)
      }
      
      connection.addEventListener('change', updateConnectionStatus)
      
      return () => {
        window.removeEventListener('online', updateOnlineStatus)
        window.removeEventListener('offline', updateOnlineStatus)
        connection.removeEventListener('change', updateConnectionStatus)
      }
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  return { isOnline, effectiveType, isSlow: effectiveType === 'slow-2g' || effectiveType === '2g' }
}

'use client'

import { useEffect } from 'react'

export function usePerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') return

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          const lcp = entry as PerformanceEntry
          if (lcp.startTime > 2500) {
            console.warn('LCP needs improvement:', lcp.startTime)
          }
        }
        
        if (entry.entryType === 'layout-shift') {
          const cls = entry as any
          if (cls.value > 0.1) {
            console.warn('CLS detected:', cls.value)
          }
        }
      }
    })

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'layout-shift', 'paint'] })
    } catch (e) {
      console.warn('Performance observer not supported')
    }

    return () => observer.disconnect()
  }, [])
}

export function reportWebVitals(metric: any) {
  if (process.env.NODE_ENV !== 'production') return

  const body = JSON.stringify(metric)
  const url = '/api/analytics'

  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body)
  } else {
    fetch(url, {
      body,
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
    }).catch(console.error)
  }
}

export const prefetchRoute = (href: string) => {
  if (typeof window === 'undefined') return
  
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = href
  document.head.appendChild(link)
}

export const prefetchRoutes = (hrefs: string[]) => {
  if (typeof window === 'undefined') return
  
  hrefs.forEach(href => {
    setTimeout(() => prefetchRoute(href), 1000)
  })
}

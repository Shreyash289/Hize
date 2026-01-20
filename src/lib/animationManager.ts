/* =========================================================
   Animation Performance Manager
   Optimizes animations without changing visual appearance
   ========================================================= */

type AnimationController = {
  pause: () => void
  resume: () => void
  isPaused: boolean
}

class AnimationManager {
  private controllers: Set<AnimationController> = new Set()
  private isTabVisible: boolean = true
  private isPageVisible: boolean = true
  private rafId: number | null = null
  private lastFrameTime: number = 0
  private targetFPS: number = 30 // Background animations at 30 FPS
  private frameInterval: number = 1000 / 30

  constructor() {
    if (typeof window === 'undefined') return

    // Track tab visibility
    document.addEventListener('visibilitychange', () => {
      this.isTabVisible = !document.hidden
      this.updateAllAnimations()
    })

    // Track page visibility (for iframes)
    if (typeof document !== 'undefined') {
      this.isPageVisible = !document.hidden
    }
  }

  register(controller: AnimationController) {
    this.controllers.add(controller)
    this.updateAnimationState(controller)
  }

  unregister(controller: AnimationController) {
    this.controllers.delete(controller)
  }

  private updateAnimationState(controller: AnimationController) {
    if (!this.isTabVisible || !this.isPageVisible) {
      if (!controller.isPaused) controller.pause()
    } else {
      if (controller.isPaused) controller.resume()
    }
  }

  private updateAllAnimations() {
    this.controllers.forEach(controller => {
      this.updateAnimationState(controller)
    })
  }

  // Throttled requestAnimationFrame for background animations
  requestThrottledAnimationFrame(callback: (time: number) => void): number {
    const now = performance.now()
    const elapsed = now - this.lastFrameTime

    if (elapsed >= this.frameInterval) {
      this.lastFrameTime = now - (elapsed % this.frameInterval)
      return requestAnimationFrame(callback)
    } else {
      this.rafId = setTimeout(() => {
        this.requestThrottledAnimationFrame(callback)
      }, this.frameInterval - elapsed)
      return this.rafId as any
    }
  }

  cancelThrottledAnimationFrame(id: number) {
    if (id < 1000000) {
      // Regular RAF ID
      cancelAnimationFrame(id)
    } else {
      // setTimeout ID
      clearTimeout(id)
    }
    if (this.rafId === id) {
      this.rafId = null
    }
  }

  isVisible(): boolean {
    return this.isTabVisible && this.isPageVisible
  }
}

// Singleton instance
let animationManagerInstance: AnimationManager | null = null

export const getAnimationManager = (): AnimationManager => {
  if (typeof window === 'undefined') {
    return {
      controllers: new Set(),
      isTabVisible: true,
      isPageVisible: true,
      register: () => {},
      unregister: () => {},
      requestThrottledAnimationFrame: (cb) => requestAnimationFrame(cb),
      cancelThrottledAnimationFrame: (id) => cancelAnimationFrame(id),
      isVisible: () => true,
    } as any
  }

  if (!animationManagerInstance) {
    animationManagerInstance = new AnimationManager()
  }
  return animationManagerInstance
}

// IntersectionObserver utility for pausing off-screen animations
export const createVisibilityObserver = (
  callback: (isVisible: boolean) => void,
  options?: IntersectionObserverInit
): IntersectionObserver | null => {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
    return null
  }

  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        callback(entry.isIntersecting)
      })
    },
    {
      rootMargin: '50px', // Start pausing 50px before leaving viewport
      threshold: 0,
      ...options,
    }
  )
}

// Check if device is low-end
export const isLowEndDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false
  
  const connection = (navigator as any).connection
  const slowConnection = connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g'
  const lowMemory = (navigator as any).deviceMemory !== undefined && (navigator as any).deviceMemory <= 2
  const lowCPU = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 2
  
  return slowConnection || lowMemory || lowCPU
}

// Check if mobile device
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 768px)').matches || 
         /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

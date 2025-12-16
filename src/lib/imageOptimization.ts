export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#171717" offset="20%" />
      <stop stop-color="#262626" offset="50%" />
      <stop stop-color="#171717" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#171717" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

export const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)

export const blurDataURL = `data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`

export const avatarBlurDataURL = `data:image/svg+xml;base64,${toBase64(shimmer(100, 100))}`

export const getImageSizes = (type: 'card' | 'avatar' | 'hero' | 'full') => {
  switch (type) {
    case 'avatar':
      return '(max-width: 640px) 80px, (max-width: 1024px) 96px, 112px'
    case 'card':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
    case 'hero':
      return '100vw'
    case 'full':
      return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
    default:
      return '100vw'
  }
}

export const getImageQuality = (priority: boolean) => (priority ? 90 : 85)

export const imageLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
  if (src.startsWith('http') || src.startsWith('//')) {
    return src
  }
  
  const params = new URLSearchParams()
  params.set('url', src)
  params.set('w', width.toString())
  params.set('q', (quality || 85).toString())
  
  return `/_next/image?${params.toString()}`
}

export const preloadImage = (src: string) => {
  if (typeof window === 'undefined') return
  
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = src
  link.fetchPriority = 'high'
  document.head.appendChild(link)
}

export const preloadImages = (srcs: string[]) => {
  if (typeof window === 'undefined') return
  
  srcs.slice(0, 3).forEach(preloadImage)
}

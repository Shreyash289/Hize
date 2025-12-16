"use client";

import Image from 'next/image';
import { useState } from 'react';
import { imageSizes } from '@/lib/responsive';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: keyof typeof imageSizes | string;
  fill?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  onError?: () => void;
}

export default function ResponsiveImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 85,
  placeholder = 'blur',
  blurDataURL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbGw9JyMxNzE3MTcnLz48L3N2Zz4=",
  sizes = 'card',
  fill = false,
  objectFit = 'cover',
  onError,
}: ResponsiveImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const getSizes = () => {
    if (typeof sizes === 'string' && sizes in imageSizes) {
      return imageSizes[sizes as keyof typeof imageSizes];
    }
    return sizes as string;
  };

  if (imageError) {
    return (
      <div className={`bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center ${className}`}>
        <div className="text-neutral-600 text-center p-4">
          <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          <p className="text-xs">Image not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        sizes={getSizes()}
        className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'} ${
          fill ? `object-${objectFit}` : ''
        }`}
        style={fill ? { objectFit } : undefined}
        onError={handleError}
        onLoad={handleLoad}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        unoptimized={false}
      />
    </div>
  );
}

// Optimized avatar component
interface ResponsiveAvatarProps {
  src?: string;
  alt: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function ResponsiveAvatar({ 
  src, 
  alt, 
  name, 
  size = 'md',
  className = '' 
}: ResponsiveAvatarProps) {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-xl',
  };

  const fallbackInitial = name.charAt(0).toUpperCase();

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center ${className}`}>
      {src ? (
        <ResponsiveImage
          src={src}
          alt={alt}
          fill
          sizes="avatar"
          className="rounded-full"
          objectFit="cover"
          onError={() => {}}
        />
      ) : (
        <span className="font-bold text-white">
          {fallbackInitial}
        </span>
      )}
    </div>
  );
}
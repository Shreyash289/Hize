"use client";

import { ReactNode } from 'react';
import { getResponsiveClasses } from '@/lib/responsive';

interface ResponsiveContainerProps {
  children: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function ResponsiveContainer({ 
  children, 
  size = 'xl', 
  spacing = 'md',
  className = '' 
}: ResponsiveContainerProps) {
  const responsiveClasses = getResponsiveClasses({
    container: size,
    spacing: spacing,
  });

  return (
    <div className={`mx-auto ${responsiveClasses} ${className}`}>
      {children}
    </div>
  );
}

// Section wrapper with responsive padding
interface ResponsiveSectionProps {
  children: ReactNode;
  className?: string;
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function ResponsiveSection({ 
  children, 
  className = '',
  padding = 'lg'
}: ResponsiveSectionProps) {
  const paddingClasses = {
    xs: 'py-4 sm:py-6',
    sm: 'py-6 sm:py-8',
    md: 'py-8 sm:py-12',
    lg: 'py-12 sm:py-16 md:py-20',
    xl: 'py-16 sm:py-20 md:py-24 lg:py-32',
  };

  return (
    <section className={`${paddingClasses[padding]} ${className}`}>
      {children}
    </section>
  );
}

// Responsive grid component
interface ResponsiveGridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4 | 'auto';
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function ResponsiveGrid({ 
  children, 
  cols = 3, 
  gap = 'md',
  className = '' 
}: ResponsiveGridProps) {
  const responsiveClasses = getResponsiveClasses({
    gridCols: cols,
    gap: gap,
  });

  return (
    <div className={`grid ${responsiveClasses} ${className}`}>
      {children}
    </div>
  );
}

// Responsive text component
interface ResponsiveTextProps {
  children: ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  className?: string;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
}

export function ResponsiveText({ 
  children, 
  size = 'base', 
  className = '',
  as: Component = 'p'
}: ResponsiveTextProps) {
  const responsiveClasses = getResponsiveClasses({
    textSize: size,
  });

  return (
    <Component className={`${responsiveClasses} ${className}`}>
      {children}
    </Component>
  );
}
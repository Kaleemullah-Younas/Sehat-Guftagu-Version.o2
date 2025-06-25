import React from 'react';
import { cn } from '@/lib/utils';

interface BoltNewBadgeProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  variant?: 'light' | 'dark';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const positionClasses = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
};

const sizeClasses = {
  small: 'text-xs px-2 py-1',
  medium: 'text-sm px-3 py-1.5',
  large: 'text-base px-4 py-2',
};

const variantClasses = {
  light: 'bg-white/90 text-gray-800 border border-gray-200',
  dark: 'bg-gray-900/90 text-white border border-gray-700',
};

export function BoltNewBadge({ 
  position = 'bottom-right', 
  variant = 'light', 
  size = 'medium',
  className 
}: BoltNewBadgeProps) {
  return (
    <div className={cn(
      'fixed z-50 rounded-full backdrop-blur-sm font-medium shadow-lg transition-all hover:scale-105',
      positionClasses[position],
      sizeClasses[size],
      variantClasses[variant],
      className
    )}>
      <div className="flex items-center gap-1.5">
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          className="text-blue-500"
        >
          <path 
            d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" 
            fill="currentColor"
          />
        </svg>
        <span>Built with Bolt</span>
      </div>
    </div>
  );
}
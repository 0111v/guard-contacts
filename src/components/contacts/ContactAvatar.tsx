import { ReactNode } from 'react'

interface ContactAvatarProps {
  photo_url?: string | null
  name: string | undefined
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  fallback?: ReactNode
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm', 
  lg: 'w-14 h-14 text-text-small',
  xl: 'w-20 h-20 text-lg'
}

export function ContactAvatar({ 
  photo_url, 
  name, 
  size = 'lg',
  className = '',
  fallback
}: ContactAvatarProps) {
  const sizeClass = sizeClasses[size]
  
  if (photo_url) {
    return (
      <img 
        src={photo_url} 
        alt={name}
        className={`${sizeClass} rounded-xl object-cover ${className}`}
      />
    )
  }
  
  if (fallback) {
    return (
      <div className={`${sizeClass} rounded-xl bg-background-secondary flex items-center justify-center text-background-primary font-medium ${className}`}>
        {fallback}
      </div>
    )
  } else return (
      <div className={`${sizeClass} rounded-xl bg-content-muted flex items-center justify-center text-background-primary font-medium ${className}`}>
        {name?.charAt(0).toUpperCase()}
      </div>
  )
}
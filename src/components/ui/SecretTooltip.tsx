import { useState, useRef, useEffect, ReactNode } from 'react'

interface SecretTooltipProps {
  children: ReactNode
  message?: string
  delayMs?: number
}

export function SecretTooltip({ 
  children, 
  message = "Tá esperando o quê? Boraa moeer!! 🚀",
  delayMs = 7000
}: SecretTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowTooltip(true)
    }, delayMs)
  }

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    setShowTooltip(false)
  }

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div 
      className="relative overflow-visible"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {/* Secret Tooltip */}
      {showTooltip && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 px-3 py-2 bg-background-primary border border-accent rounded-lg shadow-lg text-content-primary text-text-small whitespace-nowrap animate-pulse">
          {`${message}`}
        </div>
      )}
    </div>
  )
}
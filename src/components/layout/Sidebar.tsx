import { User } from '../../types/auth'

interface SidebarProps {
  user?: User | null
  onLogout: () => void
}

export function Sidebar({ user, onLogout }: SidebarProps) {
  return (
    <div className="w-full bg-background-secondary flex flex-col items-center py-6 max-w-[14vw]">
      {/* Guard Logo */}
      <div className="text-accent text-xl font-bold mb-8">
        G
      </div>
      
      {/* Navigation Icons - we'll add these later */}
      <div className="flex flex-col gap-4">
        <div className="w-8 h-8 bg-background-tertiary rounded"></div>
        <div className="w-8 h-8 bg-background-tertiary rounded"></div>
        <div className="w-8 h-8 bg-background-tertiary rounded"></div>
      </div>
      
      {/* Logout at bottom */}
      <div className="mt-auto">
        <button
          onClick={onLogout}
          className="w-8 h-8 bg-accent-red text-content-primary rounded text-xs"
          title="Logout"
        >
          ×
        </button>
      </div>
    </div>
  )
}
import { User } from '../../types/auth'
import { AccountIcon } from '../icons/AccountIcon'
import { LogoIcon } from '../icons/LogoIcon'
import { LogoutIcon } from '../icons/LogoutIcon'
import { SettingsIcon } from '../icons/SettingsIcon'

interface SidebarProps {
  user?: User | null
  onLogout: () => void
}

export function Sidebar({ user, onLogout }: SidebarProps) {
  return (
    <div className="w-full bg-background-primary flex flex-col items-center justify-between py-12 max-w-[14vw]">
      {/* Guard Logo */}
      <div className="text-accent text-xl font-bold mb-8 ">
        <LogoIcon className='w-10 h-10 text-accent-brand'/>
      </div>
      
      {/* Navigation Icons - we'll add these later */}
      <div className="flex flex-col gap-4">
        <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${true ? '!bg-background-tertiary text-accent-brand' : '!bg-background-secondary'}`}>
          <AccountIcon className='w-7 h-7 '/>
        </div>

        <div className="flex items-center justify-center w-12 h-12 bg-background-secondary rounded-xl">
          <SettingsIcon className='w-7 h-7 text-content-muted'/>
        </div>

        <div className="bg-background-secondary rounded-xl">
        <button
          onClick={onLogout}
          className="flex items-center justify-center w-12 h-12 text-content-primary rounded text-xs cursor-pointer"
          title="Logout"
        >
          <LogoutIcon className='w-7 h-7 text-content-muted'/>
        </button>
        </div>
      </div>

      <div className="text-content-muted text-text-small">
        <span>Logado como:</span>
        <br />
        <span className='text-content-primary text-text-medium'>{user?.email}</span>
      </div>
    </div>
  )
}
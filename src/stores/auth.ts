import { create } from 'zustand'
import { User, LoginCredentials, RegisterCredentials } from '../types/auth'
import { authService } from '../services/auth'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  initialized: boolean
}

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => Promise<void>
  initialize: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  loading: false,
  error: null,
  initialized: false,

  login: async (credentials: LoginCredentials) => {
    set({ loading: true, error: null })
    
    try {
      await authService.login(credentials)
      // user will be set by the auth state change listener
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to login',
        loading: false 
      })
    }
  },

  register: async (credentials: RegisterCredentials) => {
    set({ loading: true, error: null })
    
    try {
      await authService.register(credentials)
      // user will be set by the auth state change listener
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to register',
        loading: false 
      })
    }
  },

  logout: async () => {
    set({ loading: true, error: null })
    
    try {
      await authService.logout()
      // user will be set to null by the auth state change listener
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to logout',
        loading: false 
      })
    }
  },

  initialize: async () => {
    set({ loading: true })
    
    try {
      const session = await authService.getSession()
      const user = session?.user 
        ? {
            id: session.user.id,
            email: session.user.email || 'No email',
            created_at: session.user.created_at
          }
        : null

      set({ user, loading: false, initialized: true })

      // set up auth state change listener
      authService.onAuthStateChange((user) => {
        set({ user, loading: false })
      })

    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to initialize auth',
        loading: false,
        initialized: true
      })
    }
  },

  clearError: () => set({ error: null })
}))
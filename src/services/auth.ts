import { supabase } from '../../lib/supabase'
import { User, LoginCredentials, RegisterCredentials } from '../types/auth'

export const authService = {
  async login(credentials: LoginCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) throw error
    return data
  },

  async register(credentials: RegisterCredentials) {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) throw error
    return data
  },

  async logout() {
    const { error } = await supabase.auth.signOut()

    if (error) throw error
  },

  async getSession() {
    const { data } = await supabase.auth.getSession()
    const session = data.session

    return session
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user
      
      if (user) {
        callback({
          id: user.id,
          email: user.email || 'No email',
          created_at: user.created_at
        })
      } else {
        callback(null)
      }
    })
  }
}
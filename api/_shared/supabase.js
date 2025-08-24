// Shared Supabase client for serverless functions
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.local' })
}

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

export function createAuthenticatedClient(authHeader = '') {
  return createClient(
    supabaseUrl,
    supabaseAnonKey,
    { 
      global: { 
        headers: authHeader ? { Authorization: authHeader } : {} 
      } 
    }
  )
}
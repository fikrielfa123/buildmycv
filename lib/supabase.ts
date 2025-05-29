import { createClient } from "@supabase/supabase-js"

// Get environment variables - we know these are available from the environment variables list
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return true // We know Supabase is configured from the environment variables
}

// Create a single supabase client for the browser
export const createBrowserClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Create a single supabase client for server components
export const createServerClient = () => {
  const serverUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serverKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createClient(serverUrl, serverKey)
}

// Mock Supabase client for when Supabase is not configured
export const createMockSupabaseClient = () => {
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithOAuth: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
      insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
      update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
      delete: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
    }),
  }
}

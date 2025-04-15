import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Create a dummy client for when credentials aren't available
const createDummyClient = () => {
  if (typeof window !== "undefined") {
    console.warn("⚠️ Using dummy Supabase client. Make sure environment variables are set correctly.")
  }

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ data: { session: null, user: null }, error: null }),
      signUp: async () => ({ data: { session: null, user: null }, error: null }),
      signOut: async () => ({ error: null }),
    },
    from: () => ({
      upsert: () => ({ select: () => ({ data: null, error: null }) }),
      select: () => ({ eq: () => ({ order: () => ({ data: [], error: null }) }) }),
      insert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }),
      update: () => ({ eq: () => ({ data: null, error: null }) }),
      delete: () => ({ eq: () => ({ data: null, error: null }) }),
    }),
  } as any
}

// Create the appropriate client based on environment variable availability
export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }) : createDummyClient()

// Helper function to check if we're using the dummy client
export const isDummyClient = !supabaseUrl || !supabaseAnonKey

// Log environment variable status for debugging (client-side only)
if (typeof window !== "undefined") {
  console.log("Supabase URL available:", !!supabaseUrl)
  console.log("Supabase Anon Key available:", !!supabaseAnonKey)
  console.log("Using dummy client:", isDummyClient)
}

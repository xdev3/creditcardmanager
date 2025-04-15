import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

// Use environment variables for Supabase connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a single supabase client for the browser
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Function to test connection
export async function testConnection() {
  try {
    const { data, error } = await supabase.from("profiles").select("count").single()

    if (error) {
      return {
        success: false,
        message: `Error connecting to Supabase: ${error.message}`,
        error,
      }
    }

    return {
      success: true,
      message: "Successfully connected to Supabase!",
      data,
    }
  } catch (err) {
    return {
      success: false,
      message: `Exception when connecting to Supabase: ${err instanceof Error ? err.message : String(err)}`,
      error: err,
    }
  }
}

// Function to get all credit cards for a user
export async function getUserCreditCards(userId: string) {
  try {
    const { data, error } = await supabase
      .from("credit_cards")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return {
      success: true,
      cards: data,
    }
  } catch (err) {
    return {
      success: false,
      message: `Error fetching credit cards: ${err instanceof Error ? err.message : String(err)}`,
      cards: [],
    }
  }
}

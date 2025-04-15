import { NextResponse } from "next/server"

export async function GET() {
  // Instead of using the Supabase client directly, we'll check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({
      success: false,
      message: "Supabase environment variables are not configured",
      details: {
        url_available: !!supabaseUrl,
        key_available: !!supabaseAnonKey,
      },
    })
  }

  return NextResponse.json({
    success: true,
    message: "Supabase environment variables are configured",
    details: {
      url_available: true,
      key_available: true,
    },
  })
}

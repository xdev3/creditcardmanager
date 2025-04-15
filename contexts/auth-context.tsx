"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { supabase, isDummyClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  isDummyClient: boolean
  signIn: (
    email: string,
    password: string,
  ) => Promise<{
    error: Error | null
    data: Session | null
  }>
  signUp: (
    email: string,
    password: string,
  ) => Promise<{
    error: Error | null
    data: Session | null
  }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isDummyClient: false,
  signIn: async () => ({ error: null, data: null }),
  signUp: async () => ({ error: null, data: null }),
  signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const setData = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error(error)
          setIsLoading(false)
          return
        }

        setSession(session)
        setUser(session?.user ?? null)
      } catch (err) {
        console.error("Error getting session:", err)
      } finally {
        setIsLoading(false)
      }
    }

    try {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
        router.refresh()
      })

      setData()

      return () => {
        subscription?.unsubscribe()
      }
    } catch (err) {
      console.error("Error setting up auth subscription:", err)
      setIsLoading(false)
      return () => {}
    }
  }, [router])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Auth error:", error)
        return { data: null, error }
      }

      if (!data?.user) {
        console.error("No user data received")
        return { data: null, error: new Error("No user data received") }
      }

      try {
        // Create profile if it doesn't exist
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({ 
            id: data.user.id, 
            email: data.user.email!,
            updated_at: new Date().toISOString()
          })
          .select()

        if (profileError) {
          console.error("Profile error:", profileError)
        }
      } catch (err) {
        console.error("Error updating profile:", err)
      }

      // Atualiza o estado do usuário e sessão
      setSession(data.session)
      setUser(data.user)
      
      // Força uma atualização do estado antes do redirecionamento
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Redireciona para o dashboard
      router.replace('/dashboard')
      
      return { data: data.session, error: null }
    } catch (err) {
      console.error("Error signing in:", err)
      return { data: null, error: err instanceof Error ? err : new Error("Unknown error during sign in") }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        console.error("Auth error:", error)
        return { data: null, error }
      }

      if (!data?.user) {
        console.error("No user data received")
        return { data: null, error: new Error("No user data received") }
      }

      try {
        // Create profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .insert({ 
            id: data.user.id, 
            email: data.user.email!,
            created_at: new Date().toISOString()
          })
          .select()

        if (profileError) {
          console.error("Profile creation error:", profileError)
          // Não retornamos o erro aqui para não impedir o cadastro
          // O usuário pode criar o perfil mais tarde
        } else {
          console.log("Profile created successfully:", profileData)
        }
      } catch (err) {
        console.error("Error creating profile:", err)
        // Mesmo comportamento aqui - não impedimos o cadastro
      }

      return { data: data.session, error: null }
    } catch (err) {
      console.error("Error signing up:", err)
      return { data: null, error: err instanceof Error ? err : new Error("Unknown error during sign up") }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/login")
    } catch (err) {
      console.error("Error signing out:", err)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isDummyClient,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

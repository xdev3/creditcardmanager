"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isDummyClient } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user && !isDummyClient) {
      router.push("/login")
    }
  }, [user, isLoading, router, isDummyClient])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user && !isDummyClient) {
    return null
  }

  return (
    <>
      {isDummyClient && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Modo de Desenvolvimento</AlertTitle>
          <AlertDescription>
            As variáveis de ambiente do Supabase não foram encontradas. O aplicativo está rodando em modo de
            desenvolvimento com funcionalidades limitadas.
          </AlertDescription>
        </Alert>
      )}
      {children}
    </>
  )
}

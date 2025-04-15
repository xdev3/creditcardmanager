"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token")
      const type = searchParams.get("type")

      if (type === "recovery" && token) {
        try {
          // Verifica se o token é válido
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: "recovery"
          })

          if (error) {
            throw error
          }

          // Redireciona para a página de redefinição de senha com o token
          router.push(`/reset-password?token=${token}&type=${type}`)
        } catch (error: any) {
          toast({
            title: "Link inválido",
            description: "O link de recuperação de senha é inválido ou expirou.",
            variant: "destructive",
          })
          router.push("/login")
        }
      } else {
        toast({
          title: "Link inválido",
          description: "O link de recuperação de senha é inválido ou expirou.",
          variant: "destructive",
        })
        router.push("/login")
      }
    }

    handleCallback()
  }, [router, searchParams, toast])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  )
} 
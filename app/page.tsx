import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { isDummyClient } from "@/lib/supabase"

export default function HomePage() {
  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciador de Cartões</CardTitle>
          <CardDescription>Gerencie seus cartões de crédito de forma simples e eficiente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isDummyClient && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erro de Configuração</AlertTitle>
              <AlertDescription>
                As variáveis de ambiente do Supabase não foram encontradas. Verifique se NEXT_PUBLIC_SUPABASE_URL e
                NEXT_PUBLIC_SUPABASE_ANON_KEY estão configuradas corretamente.
              </AlertDescription>
            </Alert>
          )}

          <p>
            Bem-vindo ao Gerenciador de Cartões. Faça login ou crie uma conta para começar a gerenciar seus cartões.
          </p>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Link href="/login" className="flex-1">
            <Button className="w-full">Login</Button>
          </Link>
          <Link href="/signup" className="flex-1">
            <Button variant="outline" className="w-full">
              Criar Conta
            </Button>
          </Link>
        </CardFooter>
      </Card>

      {isDummyClient && (
        <Card className="mt-4 border-yellow-300 bg-yellow-50">
          <CardContent className="pt-4">
            <p className="text-sm text-yellow-800">
              <strong>Dica para desenvolvedores:</strong> Adicione as seguintes variáveis de ambiente ao seu arquivo
              .env.local:
            </p>
            <pre className="mt-2 p-2 bg-yellow-100 rounded text-xs overflow-x-auto">
              NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co{"\n"}
              NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

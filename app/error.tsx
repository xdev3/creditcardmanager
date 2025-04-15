'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">Algo deu errado!</h2>
      <p className="text-muted-foreground mb-4">
        {error.message || 'Ocorreu um erro inesperado'}
      </p>
      <Button
        onClick={() => reset()}
        variant="default"
      >
        Tentar novamente
      </Button>
    </div>
  )
} 
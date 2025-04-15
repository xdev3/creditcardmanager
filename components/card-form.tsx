"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCardNumber, formatExpiryDate } from "@/lib/formatters"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"

interface CardFormProps {
  onAdd: (card: {
    nome: string
    numero: string
    validade: string
    usado?: boolean
    cashback_tirado?: boolean
  }) => Promise<void>
}

// Card validation schema
const cardSchema = z.object({
  nome: z.string().min(1, "Nome do cartão é obrigatório"),
  numero: z
    .string()
    .min(13, "Número do cartão deve ter pelo menos 13 dígitos")
    .max(19, "Número do cartão não pode ter mais de 19 dígitos")
    .regex(/^\d+$/, "Número do cartão deve conter apenas dígitos"),
  validade: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Validade deve estar no formato MM/AA")
    .refine((val) => {
      const [month, year] = val.split("/")
      const expYear = Number.parseInt("20" + year)
      const expMonth = Number.parseInt(month) - 1
      const expDate = new Date(expYear, expMonth)
      const today = new Date()
      return expDate > today
    }, "Cartão expirado"),
})

export default function CardForm({ onAdd }: CardFormProps) {
  const [nome, setNome] = useState("")
  const [numero, setNumero] = useState("")
  const [validade, setValidade] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    // Remove formatting for validation
    const rawCardNumber = numero.replace(/\D/g, "")

    try {
      // Validate form data
      cardSchema.parse({
        nome,
        numero: rawCardNumber,
        validade,
      })

      // Add new card
      await onAdd({
        nome,
        numero: rawCardNumber,
        validade,
        usado: false,
        cashback_tirado: false,
      })

      // Reset form
      setNome("")
      setNumero("")
      setValidade("")
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(newErrors)

        toast({
          title: "Erro ao adicionar cartão",
          description: "Verifique os campos e tente novamente.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Erro ao adicionar cartão",
          description: "Ocorreu um erro ao adicionar o cartão.",
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle card number formatting as user types
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setNumero(formatCardNumber(value))
  }

  // Handle expiry date formatting as user types
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setValidade(formatExpiryDate(value))
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Adicionar Novo Cartão</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="nome" className="flex justify-between">
              Nome do Cartão
              {errors.nome && <span className="text-destructive text-sm">{errors.nome}</span>}
            </Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Nubank Platinum"
              className={errors.nome ? "border-destructive" : ""}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="numero" className="flex justify-between">
              Número do Cartão
              {errors.numero && <span className="text-destructive text-sm">{errors.numero}</span>}
            </Label>
            <Input
              id="numero"
              value={numero}
              onChange={handleCardNumberChange}
              placeholder="•••• •••• •••• ••••"
              className={errors.numero ? "border-destructive" : ""}
              maxLength={19}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="validade" className="flex justify-between">
              Validade
              {errors.validade && <span className="text-destructive text-sm">{errors.validade}</span>}
            </Label>
            <Input
              id="validade"
              value={validade}
              onChange={handleExpiryDateChange}
              placeholder="MM/AA"
              className={errors.validade ? "border-destructive" : ""}
              maxLength={5}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Adicionando..." : "Adicionar Cartão"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CreditCard, CheckCircle, XCircle, DollarSign, BanknoteIcon, Clock } from "lucide-react"

interface FilterBarProps {
  current: string
  setFilter: (filter: string) => void
}

export default function FilterBar({ current, setFilter }: FilterBarProps) {
  const filters = [
    { id: "todos", label: "Todos", icon: CreditCard },
    { id: "usado", label: "Usado", icon: CheckCircle },
    { id: "naoUsado", label: "Não Usado", icon: XCircle },
    { id: "cashbackTirado", label: "Cashback Tirado", icon: DollarSign },
    { id: "cashbackNaoTirado", label: "Cashback Pendente", icon: BanknoteIcon },
    { id: "expirando", label: "Expirando", icon: Clock },
  ]

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const Icon = filter.icon
            return (
              <Button
                key={filter.id}
                variant={current === filter.id ? "default" : "outline"}
                onClick={() => setFilter(filter.id)}
                size="sm"
                className="flex items-center gap-1"
              >
                <Icon className="h-4 w-4 mr-1" />
                {filter.label}
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

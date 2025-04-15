"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Loader2, LogOut } from "lucide-react"
import CardForm from "@/components/card-form"
import CardItem from "@/components/card-item"
import FilterBar from "@/components/filter-bar"
import SearchBar from "@/components/search-bar"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import type { CreditCard } from "@/types/supabase"
import { getCreditCards, addCreditCard, updateCreditCard, deleteCreditCard } from "@/lib/credit-card-service"
import { isExpiringSoon } from "@/lib/formatters"

export default function Dashboard() {
  const [cards, setCards] = useState<CreditCard[]>([])
  const [filter, setFilter] = useState("todos")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { user, signOut, isDummyClient } = useAuth()

  // Load cards from Supabase
  const loadCards = useCallback(async () => {
    try {
      setIsLoading(true)

      // In dummy mode or with a user
      if (isDummyClient || user) {
        const userId = user?.id || "mock-user"
        const loadedCards = await getCreditCards(userId)
        setCards(loadedCards)
      }
    } catch (error) {
      toast({
        title: "Erro ao carregar cartões",
        description: "Não foi possível carregar seus cartões salvos.",
        variant: "destructive",
      })
      console.error("Error loading cards:", error)
    } finally {
      setIsLoading(false)
    }
  }, [user, toast, isDummyClient])

  useEffect(() => {
    loadCards()
  }, [loadCards])

  // Card operations with useCallback to prevent unnecessary re-renders
  const handleAddCard = useCallback(
    async (newCard: {
      nome: string
      numero: string
      validade: string
      usado?: boolean
      cashback_tirado?: boolean
    }) => {
      try {
        const userId = user?.id || "mock-user"
        const addedCard = await addCreditCard(userId, newCard)

        // Update local state
        setCards((prevCards) => [addedCard, ...prevCards])

        toast({
          title: "Cartão adicionado",
          description: `${newCard.nome} foi adicionado com sucesso.`,
        })
      } catch (error) {
        toast({
          title: "Erro ao adicionar cartão",
          description: "Não foi possível adicionar o cartão.",
          variant: "destructive",
        })
        console.error("Error adding card:", error)
      }
    },
    [user, toast],
  )

  const handleUpdateCard = useCallback(
    async (card: CreditCard) => {
      try {
        // Always update local state
        setCards((prevCards) => prevCards.map((c) => (c.id === card.id ? { ...c, ...card } : c)))

        // Only call API if not in dummy mode
        if (!isDummyClient) {
          const { id, user_id, created_at, updated_at, ...changes } = card
          await updateCreditCard(id, changes)
        }

        toast({
          title: "Cartão atualizado",
          description: `${card.nome} foi atualizado com sucesso.`,
        })
      } catch (error) {
        toast({
          title: "Erro ao atualizar cartão",
          description: "Não foi possível atualizar o cartão.",
          variant: "destructive",
        })
        console.error("Error updating card:", error)
      }
    },
    [toast, isDummyClient],
  )

  const handleDeleteCard = useCallback(
    async (cardId: string, cardName: string) => {
      try {
        // Always update local state
        setCards((prevCards) => prevCards.filter((c) => c.id !== cardId))

        // Only call API if not in dummy mode
        if (!isDummyClient) {
          await deleteCreditCard(cardId)
        }

        toast({
          title: "Cartão removido",
          description: `${cardName} foi removido com sucesso.`,
        })
      } catch (error) {
        toast({
          title: "Erro ao remover cartão",
          description: "Não foi possível remover o cartão.",
          variant: "destructive",
        })
        console.error("Error deleting card:", error)
      }
    },
    [toast, isDummyClient],
  )

  // Memoize filtered cards to prevent recalculation on every render
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      // First apply search filter
      const matchesSearch =
        searchQuery === "" ||
        card.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.numero.includes(searchQuery)

      if (!matchesSearch) return false

      // Then apply category filter
      if (filter === "todos") return true
      if (filter === "usado") return card.usado
      if (filter === "naoUsado") return !card.usado
      if (filter === "cashbackTirado") return card.cashback_tirado
      if (filter === "cashbackNaoTirado") return !card.cashback_tirado
      if (filter === "expirando") {
        return isExpiringSoon(card.validade)
      }
      return true
    })
  }, [cards, filter, searchQuery])

  // Sort cards by name
  const sortedCards = useMemo(() => {
    return [...filteredCards].sort((a, b) => a.nome.localeCompare(b.nome))
  }, [filteredCards])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      toast({
        title: "Erro ao sair",
        description: "Não foi possível encerrar sua sessão.",
        variant: "destructive",
      })
    }
  }

  return (
    <ProtectedRoute>
      <div className="container py-6 max-w-3xl mx-auto min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gerenciador de Cartões</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="icon" onClick={handleSignOut} title="Sair">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CardForm onAdd={handleAddCard} />

        <div className="space-y-4 mb-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <FilterBar current={filter} setFilter={setFilter} />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : sortedCards.length > 0 ? (
          <div className="mt-4 space-y-4">
            {sortedCards.map((card) => (
              <CardItem
                key={card.id}
                card={card}
                onUpdate={handleUpdateCard}
                onDelete={() => handleDeleteCard(card.id, card.nome)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">
              {searchQuery || filter !== "todos"
                ? "Nenhum cartão encontrado com os filtros atuais."
                : "Nenhum cartão adicionado. Adicione seu primeiro cartão acima."}
            </p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}

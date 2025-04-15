import { supabase, isDummyClient } from "./supabase"
import type { CreditCard } from "@/types/supabase"

// Sample data for development mode
const sampleCards: CreditCard[] = [
  {
    id: "1",
    user_id: "mock-user",
    nome: "Nubank Platinum",
    numero: "5555666677778888",
    validade: "12/25",
    usado: false,
    cashback_tirado: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "mock-user",
    nome: "Itaú Visa Gold",
    numero: "4111222233334444",
    validade: "05/24",
    usado: true,
    cashback_tirado: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
]

export async function getCreditCards(userId: string): Promise<CreditCard[]> {
  if (isDummyClient) {
    return sampleCards
  }

  const { data, error } = await supabase
    .from("credit_cards")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching credit cards:", error)
    throw error
  }

  return data || []
}

export async function addCreditCard(
  userId: string,
  card: {
    nome: string
    numero: string
    validade: string
    usado?: boolean
    cashback_tirado?: boolean
  },
): Promise<CreditCard> {
  if (isDummyClient) {
    const newCard: CreditCard = {
      id: Math.random().toString(36).substring(2, 11),
      user_id: userId,
      nome: card.nome,
      numero: card.numero,
      validade: card.validade,
      usado: card.usado || false,
      cashback_tirado: card.cashback_tirado || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return newCard
  }

  const { data, error } = await supabase
    .from("credit_cards")
    .insert({
      user_id: userId,
      nome: card.nome,
      numero: card.numero,
      validade: card.validade,
      usado: card.usado || false,
      cashback_tirado: card.cashback_tirado || false,
    })
    .select()
    .single()

  if (error) {
    console.error("Error adding credit card:", error)
    throw error
  }

  return data
}

export async function updateCreditCard(
  cardId: string,
  changes: Partial<Omit<CreditCard, "id" | "user_id" | "created_at" | "updated_at">>,
): Promise<void> {
  if (isDummyClient) {
    return
  }

  const { error } = await supabase.from("credit_cards").update(changes).eq("id", cardId)

  if (error) {
    console.error("Error updating credit card:", error)
    throw error
  }
}

export async function deleteCreditCard(cardId: string): Promise<void> {
  if (isDummyClient) {
    return
  }

  const { error } = await supabase.from("credit_cards").delete().eq("id", cardId)

  if (error) {
    console.error("Error deleting credit card:", error)
    throw error
  }
}

import Dexie, { type Table } from "dexie"
import type { CreditCard } from "@/types/credit-card"

// Define the database
export class CardDatabase extends Dexie {
  // Define tables
  creditCards!: Table<CreditCard>

  constructor() {
    super("CardManagerDB")

    // Define schema
    this.version(1).stores({
      creditCards: "++id, nome, usado, cashbackTirado, createdAt",
    })
  }
}

// Create a database instance
export const db = new CardDatabase()

// Database operations
export async function getAllCards(): Promise<CreditCard[]> {
  return await db.creditCards.orderBy("createdAt").reverse().toArray()
}

export async function addCard(card: Omit<CreditCard, "id">): Promise<number> {
  return await db.creditCards.add({
    ...card,
    createdAt: new Date().toISOString(),
  } as CreditCard)
}

export async function updateCard(id: number, changes: Partial<CreditCard>): Promise<number> {
  return await db.creditCards.update(id, {
    ...changes,
    updatedAt: new Date().toISOString(),
  })
}

export async function deleteCard(id: number): Promise<void> {
  await db.creditCards.delete(id)
}

// Initialize with sample data if empty
export async function initializeDB(): Promise<void> {
  const count = await db.creditCards.count()

  if (count === 0) {
    console.log("Initializing database with sample data")

    const sampleCards: Omit<CreditCard, "id">[] = [
      {
        nome: "Nubank Platinum",
        numero: "5555666677778888",
        validade: "12/25",
        usado: false,
        cashbackTirado: false,
        createdAt: new Date().toISOString(),
      },
      {
        nome: "Itaú Visa Gold",
        numero: "4111222233334444",
        validade: "05/24",
        usado: true,
        cashbackTirado: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
    ]

    for (const card of sampleCards) {
      await addCard(card)
    }
  }
}

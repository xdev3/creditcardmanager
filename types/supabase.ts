export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      credit_cards: {
        Row: {
          id: string
          user_id: string
          nome: string
          numero: string
          validade: string
          usado: boolean
          cashback_tirado: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nome: string
          numero: string
          validade: string
          usado?: boolean
          cashback_tirado?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nome?: string
          numero?: string
          validade?: string
          usado?: boolean
          cashback_tirado?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type CreditCard = Database["public"]["Tables"]["credit_cards"]["Row"]
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string | null
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
          updated_at: string | null
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
          updated_at?: string | null
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
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type CreditCard = Database["public"]["Tables"]["credit_cards"]["Row"]

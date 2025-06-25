import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          created_at?: string | null
        }
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string
          title: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          created_at?: string | null
        }
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          content: string | null
          role: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          session_id: string
          content?: string | null
          role?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          session_id?: string
          content?: string | null
          role?: string | null
          created_at?: string | null
        }
      }
    }
  }
}
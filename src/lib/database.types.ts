export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          current_streak: number
          longest_streak: number
          last_active_date: string | null
          total_completed_tactics: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          current_streak?: number
          longest_streak?: number
          last_active_date?: string | null
          total_completed_tactics?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          current_streak?: number
          longest_streak?: number
          last_active_date?: string | null
          total_completed_tactics?: number
          created_at?: string
          updated_at?: string
        }
      }
      strategic_plans: {
        Row: {
          id: string
          user_id: string
          goal: string
          context: Json
          quarters_data: Json
          monthly_focus: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          goal: string
          context?: Json
          quarters_data?: Json
          monthly_focus?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          goal?: string
          context?: Json
          quarters_data?: Json
          monthly_focus?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tactics: {
        Row: {
          id: string
          plan_id: string
          user_id: string
          title: string
          description: string | null
          status: 'pending' | 'in_progress' | 'completed' | 'skipped'
          completed_at: string | null
          week_number: number | null
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          plan_id: string
          user_id: string
          title: string
          description?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'skipped'
          completed_at?: string | null
          week_number?: number | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          plan_id?: string
          user_id?: string
          title?: string
          description?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'skipped'
          completed_at?: string | null
          week_number?: number | null
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          status: 'ativo' | 'concluido'
          created_at: string
          updated_at?: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          status?: 'ativo' | 'concluido'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          status?: 'ativo' | 'concluido'
          created_at?: string
          updated_at?: string
        }
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

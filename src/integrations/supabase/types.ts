export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          criteria: Json | null
          description: string | null
          icon: string | null
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          criteria?: Json | null
          description?: string | null
          icon?: string | null
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          criteria?: Json | null
          description?: string | null
          icon?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      coding_challenges: {
        Row: {
          category: string
          created_at: string
          description: string
          difficulty: string
          expected_output: string | null
          hints: string[] | null
          id: string
          language: string
          starter_code: string
          title: string
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          difficulty?: string
          expected_output?: string | null
          hints?: string[] | null
          id?: string
          language?: string
          starter_code?: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          difficulty?: string
          expected_output?: string | null
          hints?: string[] | null
          id?: string
          language?: string
          starter_code?: string
          title?: string
        }
        Relationships: []
      }
      formation_registrations: {
        Row: {
          created_at: string
          email: string
          experience_level: string
          full_name: string
          id: string
          motivation: string | null
          phone: string | null
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          experience_level?: string
          full_name: string
          id?: string
          motivation?: string | null
          phone?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          experience_level?: string
          full_name?: string
          id?: string
          motivation?: string | null
          phone?: string | null
          status?: string
        }
        Relationships: []
      }
      island_progress: {
        Row: {
          boss_completed: boolean | null
          completed_at: string | null
          completion_percentage: number | null
          created_at: string
          id: string
          island_id: string
          started_at: string | null
          unlocked: boolean | null
          user_id: string
        }
        Insert: {
          boss_completed?: boolean | null
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string
          id?: string
          island_id: string
          started_at?: string | null
          unlocked?: boolean | null
          user_id: string
        }
        Update: {
          boss_completed?: boolean | null
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string
          id?: string
          island_id?: string
          started_at?: string | null
          unlocked?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "island_progress_island_id_fkey"
            columns: ["island_id"]
            isOneToOne: false
            referencedRelation: "islands"
            referencedColumns: ["id"]
          },
        ]
      }
      islands: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          order_index: number
          unlock_requirement_completion: number | null
          unlock_requirement_xp: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          order_index?: number
          unlock_requirement_completion?: number | null
          unlock_requirement_xp?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          order_index?: number
          unlock_requirement_completion?: number | null
          unlock_requirement_xp?: number | null
        }
        Relationships: []
      }
      platform_lessons: {
        Row: {
          content: Json
          created_at: string
          description: string | null
          id: string
          language: string | null
          lesson_type: string
          level_id: string
          order_index: number
          title: string
          xp_reward: number
        }
        Insert: {
          content?: Json
          created_at?: string
          description?: string | null
          id?: string
          language?: string | null
          lesson_type?: string
          level_id: string
          order_index?: number
          title: string
          xp_reward?: number
        }
        Update: {
          content?: Json
          created_at?: string
          description?: string | null
          id?: string
          language?: string | null
          lesson_type?: string
          level_id?: string
          order_index?: number
          title?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "platform_lessons_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "platform_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_levels: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_boss: boolean | null
          island_id: string | null
          number: number
          required_xp: number
          subtitle: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_boss?: boolean | null
          island_id?: string | null
          number: number
          required_xp?: number
          subtitle?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_boss?: boolean | null
          island_id?: string | null
          number?: number
          required_xp?: number
          subtitle?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_levels_island_id_fkey"
            columns: ["island_id"]
            isOneToOne: false
            referencedRelation: "islands"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          company: string | null
          content: string
          created_at: string
          id: string
          name: string
          project: string | null
          rating: number
          role: string
          status: Database["public"]["Enums"]["review_status"]
          updated_at: string
        }
        Insert: {
          company?: string | null
          content: string
          created_at?: string
          id?: string
          name: string
          project?: string | null
          rating?: number
          role: string
          status?: Database["public"]["Enums"]["review_status"]
          updated_at?: string
        }
        Update: {
          company?: string | null
          content?: string
          created_at?: string
          id?: string
          name?: string
          project?: string | null
          rating?: number
          role?: string
          status?: Database["public"]["Enums"]["review_status"]
          updated_at?: string
        }
        Relationships: []
      }
      skill_assessments: {
        Row: {
          category: string
          completed_at: string
          id: string
          score: number
          total_questions: number
          user_id: string
        }
        Insert: {
          category: string
          completed_at?: string
          id?: string
          score?: number
          total_questions?: number
          user_id: string
        }
        Update: {
          category?: string
          completed_at?: string
          id?: string
          score?: number
          total_questions?: number
          user_id?: string
        }
        Relationships: []
      }
      student_profiles: {
        Row: {
          assessment_completed: boolean
          assessment_score: number | null
          avatar_url: string | null
          career_goal: string | null
          created_at: string
          current_level: number
          display_name: string
          experience_level: string | null
          id: string
          known_languages: string[] | null
          last_active_at: string | null
          learning_style: string | null
          onboarding_completed: boolean
          recommended_level: number | null
          streak_days: number
          strong_topics: string[] | null
          total_xp: number
          user_id: string
          weak_topics: string[] | null
          weekly_hours: number | null
        }
        Insert: {
          assessment_completed?: boolean
          assessment_score?: number | null
          avatar_url?: string | null
          career_goal?: string | null
          created_at?: string
          current_level?: number
          display_name?: string
          experience_level?: string | null
          id?: string
          known_languages?: string[] | null
          last_active_at?: string | null
          learning_style?: string | null
          onboarding_completed?: boolean
          recommended_level?: number | null
          streak_days?: number
          strong_topics?: string[] | null
          total_xp?: number
          user_id: string
          weak_topics?: string[] | null
          weekly_hours?: number | null
        }
        Update: {
          assessment_completed?: boolean
          assessment_score?: number | null
          avatar_url?: string | null
          career_goal?: string | null
          created_at?: string
          current_level?: number
          display_name?: string
          experience_level?: string | null
          id?: string
          known_languages?: string[] | null
          last_active_at?: string | null
          learning_style?: string | null
          onboarding_completed?: boolean
          recommended_level?: number | null
          streak_days?: number
          strong_topics?: string[] | null
          total_xp?: number
          user_id?: string
          weak_topics?: string[] | null
          weekly_hours?: number | null
        }
        Relationships: []
      }
      subscription_requests: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          message: string | null
          payment_method: string
          phone: string | null
          plan: string
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          message?: string | null
          payment_method?: string
          phone?: string | null
          plan?: string
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string | null
          payment_method?: string
          phone?: string | null
          plan?: string
          status?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_lesson_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          lesson_id: string
          score: number | null
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id: string
          score?: number | null
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: string
          score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "platform_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      xp_logs: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          source: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          source: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          source?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      review_status: "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      review_status: ["pending", "approved", "rejected"],
    },
  },
} as const

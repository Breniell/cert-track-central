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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      attendances: {
        Row: {
          absent: boolean | null
          checkin_at: string | null
          checkout_at: string | null
          created_at: string
          hours_attended: number | null
          id: string
          late: boolean | null
          marked_by: string | null
          mode: Database["public"]["Enums"]["attendance_mode"]
          notes: string | null
          session_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          absent?: boolean | null
          checkin_at?: string | null
          checkout_at?: string | null
          created_at?: string
          hours_attended?: number | null
          id?: string
          late?: boolean | null
          marked_by?: string | null
          mode?: Database["public"]["Enums"]["attendance_mode"]
          notes?: string | null
          session_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          absent?: boolean | null
          checkin_at?: string | null
          checkout_at?: string | null
          created_at?: string
          hours_attended?: number | null
          id?: string
          late?: boolean | null
          marked_by?: string | null
          mode?: Database["public"]["Enums"]["attendance_mode"]
          notes?: string | null
          session_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendances_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "training_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          cancellation_reason: string | null
          cancelled_at: string | null
          certificate_url: string | null
          created_at: string
          enrolled_at: string
          enrolled_by: string
          id: string
          session_id: string
          status: Database["public"]["Enums"]["enrollment_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          certificate_url?: string | null
          created_at?: string
          enrolled_at?: string
          enrolled_by: string
          id?: string
          session_id: string
          status?: Database["public"]["Enums"]["enrollment_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          certificate_url?: string | null
          created_at?: string
          enrolled_at?: string
          enrolled_by?: string
          id?: string
          session_id?: string
          status?: Database["public"]["Enums"]["enrollment_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "training_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      formateur_availabilities: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          end_datetime: string
          formateur_id: string
          id: string
          notes: string | null
          start_datetime: string
          status: Database["public"]["Enums"]["availability_status"]
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          end_datetime: string
          formateur_id: string
          id?: string
          notes?: string | null
          start_datetime: string
          status?: Database["public"]["Enums"]["availability_status"]
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          end_datetime?: string
          formateur_id?: string
          id?: string
          notes?: string | null
          start_datetime?: string
          status?: Database["public"]["Enums"]["availability_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "formateur_availabilities_formateur_id_fkey"
            columns: ["formateur_id"]
            isOneToOne: false
            referencedRelation: "formateurs"
            referencedColumns: ["id"]
          },
        ]
      }
      formateurs: {
        Row: {
          active: boolean
          certificate_urls: string[] | null
          certifications: string[]
          created_at: string
          cv_url: string | null
          habilitation_approved_at: string | null
          habilitation_approved_by: string | null
          habilitation_notes: string | null
          habilitation_requested_at: string | null
          habilitation_status: Database["public"]["Enums"]["habilitation_status"]
          id: string
          specialties: string[]
          total_hours_taught: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          certificate_urls?: string[] | null
          certifications?: string[]
          created_at?: string
          cv_url?: string | null
          habilitation_approved_at?: string | null
          habilitation_approved_by?: string | null
          habilitation_notes?: string | null
          habilitation_requested_at?: string | null
          habilitation_status?: Database["public"]["Enums"]["habilitation_status"]
          id?: string
          specialties?: string[]
          total_hours_taught?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          certificate_urls?: string[] | null
          certifications?: string[]
          created_at?: string
          cv_url?: string | null
          habilitation_approved_at?: string | null
          habilitation_approved_by?: string | null
          habilitation_notes?: string | null
          habilitation_requested_at?: string | null
          habilitation_status?: Database["public"]["Enums"]["habilitation_status"]
          id?: string
          specialties?: string[]
          total_hours_taught?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          attachment_urls: string[] | null
          content: string
          created_at: string
          id: string
          read_by: string[] | null
          room_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          attachment_urls?: string[] | null
          content: string
          created_at?: string
          id?: string
          read_by?: string[] | null
          room_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          attachment_urls?: string[] | null
          content?: string
          created_at?: string
          id?: string
          read_by?: string[] | null
          room_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          read_at: string | null
          related_entity_id: string | null
          related_entity_type: string | null
          scheduled_for: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["notification_status"]
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read_at?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read_at?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          email: string
          first_name: string | null
          id: string
          language: string | null
          last_name: string | null
          phone: string | null
          position: string | null
          preferences: Json | null
          site_id: string | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email: string
          first_name?: string | null
          id: string
          language?: string | null
          last_name?: string | null
          phone?: string | null
          position?: string | null
          preferences?: Json | null
          site_id?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email?: string
          first_name?: string | null
          id?: string
          language?: string | null
          last_name?: string | null
          phone?: string | null
          position?: string | null
          preferences?: Json | null
          site_id?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          key: string
          site_id: string | null
          updated_at: string
          value: Json
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          key: string
          site_id?: string | null
          updated_at?: string
          value: Json
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          site_id?: string | null
          updated_at?: string
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "settings_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      sites: {
        Row: {
          active: boolean
          address: string | null
          city: string | null
          code: string
          created_at: string
          id: string
          name: string
          region: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          address?: string | null
          city?: string | null
          code: string
          created_at?: string
          id?: string
          name: string
          region?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          address?: string | null
          city?: string | null
          code?: string
          created_at?: string
          id?: string
          name?: string
          region?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      training_matrices: {
        Row: {
          active: boolean
          archived: boolean
          archived_at: string | null
          archived_by: string | null
          competencies: Json
          created_at: string
          created_by: string
          id: string
          name: string
          positions: Json
          site_id: string
          updated_at: string
          version: number
        }
        Insert: {
          active?: boolean
          archived?: boolean
          archived_at?: string | null
          archived_by?: string | null
          competencies?: Json
          created_at?: string
          created_by: string
          id?: string
          name: string
          positions?: Json
          site_id: string
          updated_at?: string
          version?: number
        }
        Update: {
          active?: boolean
          archived?: boolean
          archived_at?: string | null
          archived_by?: string | null
          competencies?: Json
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          positions?: Json
          site_id?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "training_matrices_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      training_sessions: {
        Row: {
          capacity: number
          created_at: string
          created_by: string
          description: string | null
          duration_hours: number
          end_datetime: string
          formateur_id: string | null
          id: string
          location: string
          qr_code: string | null
          qr_code_generated_at: string | null
          site_id: string
          start_datetime: string
          status: Database["public"]["Enums"]["session_status"]
          title: string
          type: Database["public"]["Enums"]["training_type"]
          updated_at: string
          urgent: boolean
          validated_hr_at: string | null
          validated_hr_by: string | null
          validated_hse_at: string | null
          validated_hse_by: string | null
        }
        Insert: {
          capacity?: number
          created_at?: string
          created_by: string
          description?: string | null
          duration_hours: number
          end_datetime: string
          formateur_id?: string | null
          id?: string
          location: string
          qr_code?: string | null
          qr_code_generated_at?: string | null
          site_id: string
          start_datetime: string
          status?: Database["public"]["Enums"]["session_status"]
          title: string
          type: Database["public"]["Enums"]["training_type"]
          updated_at?: string
          urgent?: boolean
          validated_hr_at?: string | null
          validated_hr_by?: string | null
          validated_hse_at?: string | null
          validated_hse_by?: string | null
        }
        Update: {
          capacity?: number
          created_at?: string
          created_by?: string
          description?: string | null
          duration_hours?: number
          end_datetime?: string
          formateur_id?: string | null
          id?: string
          location?: string
          qr_code?: string | null
          qr_code_generated_at?: string | null
          site_id?: string
          start_datetime?: string
          status?: Database["public"]["Enums"]["session_status"]
          title?: string
          type?: Database["public"]["Enums"]["training_type"]
          updated_at?: string
          urgent?: boolean
          validated_hr_at?: string | null
          validated_hr_by?: string | null
          validated_hse_at?: string | null
          validated_hse_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_sessions_formateur_id_fkey"
            columns: ["formateur_id"]
            isOneToOne: false
            referencedRelation: "formateurs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_sessions_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          site_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          site_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          site_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_any_role: {
        Args: {
          _roles: Database["public"]["Enums"]["app_role"][]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "drh"
        | "hr"
        | "hse"
        | "manager"
        | "formateur"
        | "apprenant"
      attendance_mode: "qr_code" | "manual" | "mobile_offline"
      availability_status: "pending" | "approved" | "rejected"
      enrollment_status: "enrolled" | "waitlist" | "cancelled" | "completed"
      habilitation_status: "pending" | "approved" | "rejected"
      notification_status: "pending" | "sent" | "failed" | "read"
      notification_type: "email" | "sms" | "in_app"
      session_status:
        | "planned"
        | "validated_hr"
        | "validated_hse"
        | "ongoing"
        | "completed"
        | "cancelled"
      training_type: "HSE" | "Métier"
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
      app_role: [
        "super_admin",
        "drh",
        "hr",
        "hse",
        "manager",
        "formateur",
        "apprenant",
      ],
      attendance_mode: ["qr_code", "manual", "mobile_offline"],
      availability_status: ["pending", "approved", "rejected"],
      enrollment_status: ["enrolled", "waitlist", "cancelled", "completed"],
      habilitation_status: ["pending", "approved", "rejected"],
      notification_status: ["pending", "sent", "failed", "read"],
      notification_type: ["email", "sms", "in_app"],
      session_status: [
        "planned",
        "validated_hr",
        "validated_hse",
        "ongoing",
        "completed",
        "cancelled",
      ],
      training_type: ["HSE", "Métier"],
    },
  },
} as const

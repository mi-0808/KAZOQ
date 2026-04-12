export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          auth_user_id: string | null;
          email: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          auth_user_id?: string | null;
          email: string;
          name: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      families: {
        Row: {
          id: string;
          name: string;
          invite_code: string;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          invite_code: string;
          created_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["families"]["Insert"]>;
      };
      family_members: {
        Row: {
          id: string;
          family_id: string;
          user_id: string;
          role_label: string;
          relation_label: string | null;
          joined_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          user_id: string;
          role_label: string;
          relation_label?: string | null;
          joined_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["family_members"]["Insert"]>;
      };
      profiles: {
        Row: {
          user_id: string;
          display_name: string;
          avatar_path: string | null;
          family_role: string;
          organization: string | null;
          activities: string[];
          bio: string | null;
          status: string | null;
          accent_color: string | null;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          display_name: string;
          avatar_path?: string | null;
          family_role: string;
          organization?: string | null;
          activities?: string[];
          bio?: string | null;
          status?: string | null;
          accent_color?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      family_reports: {
        Row: {
          id: string;
          family_id: string;
          author_id: string;
          kind: string;
          title: string;
          summary: string;
          status: string;
          requires_response: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          author_id: string;
          kind: string;
          title: string;
          summary: string;
          status?: string;
          requires_response?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["family_reports"]["Insert"]>;
      };
      family_report_actions: {
        Row: {
          id: string;
          family_report_id: string;
          parent_action_id: string | null;
          author_id: string;
          label: string;
          body: string;
          tone: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_report_id: string;
          parent_action_id?: string | null;
          author_id: string;
          label: string;
          body: string;
          tone?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["family_report_actions"]["Insert"]>;
      };
      messages: {
        Row: {
          id: string;
          family_id: string;
          author_id: string;
          category: string;
          body: string;
          template_id: string | null;
          payload: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          author_id: string;
          category: string;
          body: string;
          template_id?: string | null;
          payload?: Json | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
      };
      message_reads: {
        Row: {
          id: string;
          message_id: string;
          user_id: string;
          read_at: string;
        };
        Insert: {
          id?: string;
          message_id: string;
          user_id: string;
          read_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["message_reads"]["Insert"]>;
      };
      schedules: {
        Row: {
          id: string;
          family_id: string;
          owner_id: string | null;
          place_id: string | null;
          source_message_id: string | null;
          title: string;
          type: string;
          note: string | null;
          starts_at: string;
          ends_at: string;
          created_at: string;
        };
      };
    };
  };
}

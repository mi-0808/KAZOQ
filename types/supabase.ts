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
          menu_item_ids: string[];
          shortcut_item_ids: string[];
          favorite_item_ids: string[];
          notification_level: string;
          diary_visibility: string;
          location_sharing_mode: string;
          tasks_enabled: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          invite_code: string;
          created_by?: string | null;
          menu_item_ids?: string[];
          shortcut_item_ids?: string[];
          favorite_item_ids?: string[];
          notification_level?: string;
          diary_visibility?: string;
          location_sharing_mode?: string;
          tasks_enabled?: boolean;
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
        Insert: {
          id?: string;
          family_id: string;
          owner_id?: string | null;
          place_id?: string | null;
          source_message_id?: string | null;
          title: string;
          type: string;
          note?: string | null;
          starts_at: string;
          ends_at: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["schedules"]["Insert"]>;
      };
      place_registrations: {
        Row: {
          id: string;
          family_id: string;
          name: string;
          category: string;
          address: string | null;
          lat: number | null;
          lng: number | null;
          color: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          name: string;
          category: string;
          address?: string | null;
          lat?: number | null;
          lng?: number | null;
          color?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["place_registrations"]["Insert"]>;
      };
      locations: {
        Row: {
          id: string;
          user_id: string;
          family_id: string;
          place_id: string | null;
          label: string | null;
          lat: number | null;
          lng: number | null;
          share_mode: string | null;
          captured_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          family_id: string;
          place_id?: string | null;
          label?: string | null;
          lat?: number | null;
          lng?: number | null;
          share_mode?: string | null;
          captured_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["locations"]["Insert"]>;
      };
      diary_entries: {
        Row: {
          id: string;
          family_id: string;
          author_id: string;
          mood: string;
          visibility_scope: string;
          today_story: string;
          happy_moment: string | null;
          concern: string | null;
          message_to_family: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          author_id: string;
          mood: string;
          visibility_scope?: string;
          today_story: string;
          happy_moment?: string | null;
          concern?: string | null;
          message_to_family?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["diary_entries"]["Insert"]>;
      };
      family_tasks: {
        Row: {
          id: string;
          family_id: string;
          created_by: string;
          assignee_id: string | null;
          title: string;
          note: string | null;
          due_date: string | null;
          status: string;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          family_id: string;
          created_by: string;
          assignee_id?: string | null;
          title: string;
          note?: string | null;
          due_date?: string | null;
          status?: string;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["family_tasks"]["Insert"]>;
      };
      diary_reactions: {
        Row: {
          id: string;
          entry_id: string;
          user_id: string;
          emoji: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          entry_id: string;
          user_id: string;
          emoji: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["diary_reactions"]["Insert"]>;
      };
    };
  };
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          location: string;
          year: string;
          client: string;
          typology: string;
          category: string;
          subcategory: string;
          size_m2: string;
          size_ft2: string | null;
          status: string;
          aspect_ratio: string;
          hero_image: string;
          icon_svg: string | null;
          quote: string | null;
          quote_author: string | null;
          quote_author_role: string | null;
          description: string;
          awards: Json | null;
          collaborators: Json | null;
          diagrams: Json | null;
          gallery: Json | null;
          credits: Json | null;
          sort_order: number;
          is_published: boolean;
          hero_media_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          location: string;
          year: string;
          client: string;
          typology: string;
          category: string;
          subcategory: string;
          size_m2: string;
          size_ft2?: string | null;
          status: string;
          aspect_ratio: string;
          hero_image: string;
          icon_svg?: string | null;
          quote?: string | null;
          quote_author?: string | null;
          quote_author_role?: string | null;
          description: string;
          awards?: Json | null;
          collaborators?: Json | null;
          diagrams?: Json | null;
          gallery?: Json | null;
          credits?: Json | null;
          sort_order?: number;
          is_published?: boolean;
          hero_media_type?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          location?: string;
          year?: string;
          client?: string;
          typology?: string;
          category?: string;
          subcategory?: string;
          size_m2?: string;
          size_ft2?: string | null;
          status?: string;
          aspect_ratio?: string;
          hero_image?: string;
          icon_svg?: string | null;
          quote?: string | null;
          quote_author?: string | null;
          quote_author_role?: string | null;
          description?: string;
          awards?: Json | null;
          collaborators?: Json | null;
          diagrams?: Json | null;
          gallery?: Json | null;
          credits?: Json | null;
          sort_order?: number;
          is_published?: boolean;
          hero_media_type?: string;
          created_at?: string;
        };
      };
      inquiries: {
        Row: {
          id: string;
          name: string;
          email: string;
          office: string;
          type: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          office: string;
          type: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          office?: string;
          type?: string;
          message?: string;
          created_at?: string;
        };
      };
      news: {
        Row: {
          id: string;
          slug: string;
          title: string;
          date: string;
          category: string;
          excerpt: string;
          image: string;
          read_time: string;
          author: string;
          source_url: string | null;
          body: string;
          sort_order: number;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          date: string;
          category: string;
          excerpt: string;
          image: string;
          read_time: string;
          author?: string;
          source_url?: string | null;
          body?: string;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          date?: string;
          category?: string;
          excerpt?: string;
          image?: string;
          read_time?: string;
          author?: string;
          source_url?: string | null;
          body?: string;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
        };
      };
      admin_users: {
        Row: { user_id: string; created_at: string };
        Insert: { user_id: string; created_at?: string };
        Update: { user_id?: string; created_at?: string };
      };
      site_settings: {
        Row: { singleton: boolean; settings: Json; updated_at: string };
        Insert: { singleton?: boolean; settings?: Json; updated_at?: string };
        Update: { singleton?: boolean; settings?: Json; updated_at?: string };
      };
      testimonials: {
        Row: {
          id: string;
          project_slug: string | null;
          author: string;
          role: string;
          quote: string;
          image_url: string;
          rating: number;
          is_published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_slug?: string | null;
          author: string;
          role?: string;
          quote: string;
          image_url?: string;
          rating?: number;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_slug?: string | null;
          author?: string;
          role?: string;
          quote?: string;
          image_url?: string;
          rating?: number;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

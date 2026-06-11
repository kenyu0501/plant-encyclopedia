export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: "admin" | "viewer";
          created_at: string;
        };
        Insert: {
          id: string;
          role?: "admin" | "viewer";
          created_at?: string;
        };
        Update: {
          id?: string;
          role?: "admin" | "viewer";
          created_at?: string;
        };
        Relationships: [];
      };
      fruits: {
        Row: Fruit;
        Insert: FruitInsert;
        Update: Partial<FruitInsert>;
        Relationships: [];
      };
      cultivars: {
        Row: Cultivar;
        Insert: CultivarInsert;
        Update: Partial<CultivarInsert>;
        Relationships: [
          {
            foreignKeyName: "cultivars_fruit_id_fkey";
            columns: ["fruit_id"];
            isOneToOne: false;
            referencedRelation: "fruits";
            referencedColumns: ["id"];
          }
        ];
      };
      photos: {
        Row: Photo;
        Insert: PhotoInsert;
        Update: Partial<PhotoInsert>;
        Relationships: [
          {
            foreignKeyName: "photos_fruit_id_fkey";
            columns: ["fruit_id"];
            isOneToOne: false;
            referencedRelation: "fruits";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "photos_cultivar_id_fkey";
            columns: ["cultivar_id"];
            isOneToOne: false;
            referencedRelation: "cultivars";
            referencedColumns: ["id"];
          }
        ];
      };
      videos: {
        Row: Video;
        Insert: VideoInsert;
        Update: Partial<VideoInsert>;
        Relationships: [
          {
            foreignKeyName: "videos_fruit_id_fkey";
            columns: ["fruit_id"];
            isOneToOne: false;
            referencedRelation: "fruits";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "videos_cultivar_id_fkey";
            columns: ["cultivar_id"];
            isOneToOne: false;
            referencedRelation: "cultivars";
            referencedColumns: ["id"];
          }
        ];
      };
      site_settings: {
        Row: SiteSettings;
        Insert: SiteSettingsInsert;
        Update: Partial<SiteSettingsInsert>;
        Relationships: [];
      };
      page_views: {
        Row: PageView;
        Insert: PageViewInsert;
        Update: Partial<PageViewInsert>;
        Relationships: [
          {
            foreignKeyName: "page_views_fruit_id_fkey";
            columns: ["fruit_id"];
            isOneToOne: false;
            referencedRelation: "fruits";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "page_views_cultivar_id_fkey";
            columns: ["cultivar_id"];
            isOneToOne: false;
            referencedRelation: "cultivars";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      track_page_view: {
        Args: { p_path: string };
        Returns: null;
      };
      update_own_pending_photo_submission: {
        Args: {
          p_photo_id: string;
          p_caption: string | null;
          p_taken_at: string | null;
          p_contributor_name: string;
          p_location_name: string | null;
          p_photo_type: string | null;
        };
        Returns: boolean;
      };
      withdraw_own_pending_photo_submission: {
        Args: { p_photo_id: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Fruit = {
  [key: string]: unknown;
  id: string;
  name_ja: string;
  name_en: string | null;
  slug: string;
  scientific_name: string | null;
  family_name: string | null;
  origin: string | null;
  description: string | null;
  growth_habit: string | null;
  flower_description: string | null;
  fruit_description: string | null;
  cultivation_summary: string | null;
  okinawa_suitability: string | null;
  public_notes: string | null;
  private_notes: string | null;
  display_order: number | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export type FruitInsert = Omit<Fruit, "id" | "created_at" | "updated_at"> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type Cultivar = {
  [key: string]: unknown;
  id: string;
  fruit_id: string;
  name_ja: string;
  name_en: string | null;
  slug: string;
  origin: string | null;
  description: string | null;
  fruit_size: string | null;
  taste: string | null;
  texture: string | null;
  aroma: string | null;
  harvest_season: string | null;
  cold_hardiness: string | null;
  flowering_type: string | null;
  plant_height_type: string | null;
  genome_group: string | null;
  yield_level: string | null;
  tree_vigor: string | null;
  difficulty: string | null;
  okinawa_suitability: string | null;
  container_suitability: string | null;
  beginner_suitability: string | null;
  kenyu_comment: string | null;
  public_notes: string | null;
  private_notes: string | null;
  is_public: boolean;
  is_for_sale: boolean;
  created_at: string;
  updated_at: string;
};

export type CultivarInsert = Omit<Cultivar, "id" | "created_at" | "updated_at"> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type Photo = {
  [key: string]: unknown;
  id: string;
  fruit_id: string | null;
  cultivar_id: string | null;
  image_url: string;
  storage_path: string;
  thumbnail_url: string | null;
  thumbnail_storage_path: string | null;
  medium_url: string | null;
  medium_storage_path: string | null;
  original_url: string | null;
  original_storage_path: string | null;
  photo_type: string | null;
  caption: string | null;
  taken_at: string | null;
  uploaded_by: string | null;
  contributor_name: string | null;
  location_name: string | null;
  source_type: string;
  approval_status: "pending" | "approved" | "rejected";
  is_main: boolean;
  created_at: string;
};

export type PhotoInsert = Omit<Photo, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

export type Video = {
  [key: string]: unknown;
  id: string;
  fruit_id: string | null;
  cultivar_id: string | null;
  youtube_url: string;
  title: string | null;
  description: string | null;
  thumbnail_url: string | null;
  video_type: string | null;
  is_public: boolean;
  created_at: string;
};

export type VideoInsert = Omit<Video, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

export type SiteSettings = {
  id: string;
  home_eyebrow: string;
  home_title: string;
  home_description: string;
  updated_at: string;
};

export type SiteSettingsInsert = Omit<SiteSettings, "updated_at"> & {
  updated_at?: string;
};

export type PageView = {
  [key: string]: unknown;
  id: string;
  page_path: string;
  fruit_id: string | null;
  cultivar_id: string | null;
  view_date: string;
  views: number;
  created_at: string;
  updated_at: string;
};

export type PageViewInsert = Omit<PageView, "id" | "created_at" | "updated_at"> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type FruitWithChildren = Fruit & {
  photos: Photo[];
  videos: Video[];
  cultivars: CultivarWithMedia[];
};

export type CultivarWithFruit = Cultivar & {
  fruits: Fruit | null;
  photos: Photo[];
  videos: Video[];
};

export type CultivarWithMedia = Cultivar & {
  photos?: Photo[];
  videos?: Video[];
};

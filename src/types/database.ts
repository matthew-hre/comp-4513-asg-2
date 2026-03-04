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
    : never;

export type Database = {
  graphql_public: {
    CompositeTypes: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
  }
  public: {
    CompositeTypes: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Tables: {
      artists: {
        Insert: {
          artist_id: number
          artist_image_url?: null | string
          artist_name?: null | string
          artist_type_id?: null | number
          spotify_desc?: null | string
          spotify_url?: null | string
        }
        Relationships: [
          {
            columns: ["artist_type_id"]
            foreignKeyName: "artists_artist_type_id_fkey"
            isOneToOne: false
            referencedColumns: ["type_id"]
            referencedRelation: "types"
          },
        ]
        Row: {
          artist_id: number
          artist_image_url: null | string
          artist_name: null | string
          artist_type_id: null | number
          spotify_desc: null | string
          spotify_url: null | string
        }
        Update: {
          artist_id?: number
          artist_image_url?: null | string
          artist_name?: null | string
          artist_type_id?: null | number
          spotify_desc?: null | string
          spotify_url?: null | string
        }
      }
      genres: {
        Insert: {
          genre_id: number
          genre_name?: null | string
        }
        Relationships: []
        Row: {
          genre_id: number
          genre_name: null | string
        }
        Update: {
          genre_id?: number
          genre_name?: null | string
        }
      }
      playlists: {
        Insert: {
          id?: number
          playlist_id?: null | number
          song_id?: null | number
        }
        Relationships: [
          {
            columns: ["song_id"]
            foreignKeyName: "playlists_song_id_fkey"
            isOneToOne: false
            referencedColumns: ["song_id"]
            referencedRelation: "songs"
          },
        ]
        Row: {
          id: number
          playlist_id: null | number
          song_id: null | number
        }
        Update: {
          id?: number
          playlist_id?: null | number
          song_id?: null | number
        }
      }
      songs: {
        Insert: {
          acousticness?: null | number
          artist_id?: null | number
          bpm?: null | number
          danceability?: null | number
          duration?: null | number
          energy?: null | number
          genre_id?: null | number
          liveness?: null | number
          loudness?: null | number
          popularity?: null | number
          song_id: number
          speechiness?: null | number
          title?: null | string
          valence?: null | number
          year?: null | number
        }
        Relationships: [
          {
            columns: ["artist_id"]
            foreignKeyName: "songs_artist_id_fkey"
            isOneToOne: false
            referencedColumns: ["artist_id"]
            referencedRelation: "artists"
          },
          {
            columns: ["genre_id"]
            foreignKeyName: "songs_genre_id_fkey"
            isOneToOne: false
            referencedColumns: ["genre_id"]
            referencedRelation: "genres"
          },
        ]
        Row: {
          acousticness: null | number
          artist_id: null | number
          bpm: null | number
          danceability: null | number
          duration: null | number
          energy: null | number
          genre_id: null | number
          liveness: null | number
          loudness: null | number
          popularity: null | number
          song_id: number
          speechiness: null | number
          title: null | string
          valence: null | number
          year: null | number
        }
        Update: {
          acousticness?: null | number
          artist_id?: null | number
          bpm?: null | number
          danceability?: null | number
          duration?: null | number
          energy?: null | number
          genre_id?: null | number
          liveness?: null | number
          loudness?: null | number
          popularity?: null | number
          song_id?: number
          speechiness?: null | number
          title?: null | string
          valence?: null | number
          year?: null | number
        }
      }
      types: {
        Insert: {
          type_id: number
          type_name?: null | string
        }
        Relationships: []
        Row: {
          type_id: number
          type_name: null | string
        }
        Update: {
          type_id?: number
          type_name?: null | string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
  }
};

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
    : never;

export type Json =
  | boolean
  | Json[]
  | null
  | number
  | string
  | { [key: string]: Json | undefined };

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
    : never;

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
    : never;

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
    : never;

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;


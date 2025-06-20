export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accessories: {
        Row: {
          available: boolean | null
          category: string
          compatible_vehicle_types: string[]
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          stock: number
          updated_at: string | null
        }
        Insert: {
          available?: boolean | null
          category: string
          compatible_vehicle_types: string[]
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          stock?: number
          updated_at?: string | null
        }
        Update: {
          available?: boolean | null
          category?: string
          compatible_vehicle_types?: string[]
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          stock?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      bikes: {
        Row: {
          available: boolean
          battery_level: number | null
          created_at: string
          description: string | null
          features: string[] | null
          id: string
          image_url: string | null
          location_id: string | null
          name: string
          price_per_hour: number
          type: string
          updated_at: string
        }
        Insert: {
          available?: boolean
          battery_level?: number | null
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          image_url?: string | null
          location_id?: string | null
          name: string
          price_per_hour: number
          type: string
          updated_at?: string
        }
        Update: {
          available?: boolean
          battery_level?: number | null
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          image_url?: string | null
          location_id?: string | null
          name?: string
          price_per_hour?: number
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_bikes_location"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      cart: {
        Row: {
          created_at: string | null
          id: string
          product_id: number | null
          quantity: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: number | null
          quantity?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: number | null
          quantity?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          description: string | null
          id: number
          name: string
          slug: string
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
          slug: string
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          bike_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          bike_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          bike_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_bike_id_fkey"
            columns: ["bike_id"]
            isOneToOne: false
            referencedRelation: "bikes"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string
          available_bikes: number
          city: string
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          state: string
          total_bikes: number
          zip_code: string | null
        }
        Insert: {
          address: string
          available_bikes?: number
          city: string
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          state: string
          total_bikes?: number
          zip_code?: string | null
        }
        Update: {
          address?: string
          available_bikes?: number
          city?: string
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          state?: string
          total_bikes?: number
          zip_code?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: number
          order_id: number | null
          price: number
          product_id: number | null
          quantity: number
        }
        Insert: {
          id?: number
          order_id?: number | null
          price: number
          product_id?: number | null
          quantity?: number
        }
        Update: {
          id?: number
          order_id?: number | null
          price?: number
          product_id?: number | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string
          city: string
          created_at: string | null
          delivery_address_line2: string | null
          email: string
          first_name: string
          id: number
          item_type: string | null
          last_name: string
          order_notes: string | null
          payment_id: string | null
          quantity: number | null
          state: string
          status: string
          total_price: number
          updated_at: string | null
          user_id: string | null
          zip_code: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string | null
          delivery_address_line2?: string | null
          email: string
          first_name: string
          id?: number
          item_type?: string | null
          last_name: string
          order_notes?: string | null
          payment_id?: string | null
          quantity?: number | null
          state: string
          status?: string
          total_price: number
          updated_at?: string | null
          user_id?: string | null
          zip_code: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string | null
          delivery_address_line2?: string | null
          email?: string
          first_name?: string
          id?: number
          item_type?: string | null
          last_name?: string
          order_notes?: string | null
          payment_id?: string | null
          quantity?: number | null
          state?: string
          status?: string
          total_price?: number
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          available: boolean
          brand: string | null
          category: string | null
          category_id: number | null
          created_at: string | null
          delivery_days: number | null
          description: string | null
          featured: boolean | null
          fuel: string | null
          id: number
          image_url: string | null
          images: string[] | null
          in_stock: boolean | null
          location: string | null
          mileage: number | null
          model: string | null
          name: string
          price: number
          price_inr: number | null
          slug: string
          specs: Json | null
          stock: number
          transmission: string | null
          type: string | null
          updated_at: string | null
          year: number | null
        }
        Insert: {
          available?: boolean
          brand?: string | null
          category?: string | null
          category_id?: number | null
          created_at?: string | null
          delivery_days?: number | null
          description?: string | null
          featured?: boolean | null
          fuel?: string | null
          id?: number
          image_url?: string | null
          images?: string[] | null
          in_stock?: boolean | null
          location?: string | null
          mileage?: number | null
          model?: string | null
          name: string
          price: number
          price_inr?: number | null
          slug: string
          specs?: Json | null
          stock?: number
          transmission?: string | null
          type?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          available?: boolean
          brand?: string | null
          category?: string | null
          category_id?: number | null
          created_at?: string | null
          delivery_days?: number | null
          description?: string | null
          featured?: boolean | null
          fuel?: string | null
          id?: number
          image_url?: string | null
          images?: string[] | null
          in_stock?: boolean | null
          location?: string | null
          mileage?: number | null
          model?: string | null
          name?: string
          price?: number
          price_inr?: number | null
          slug?: string
          specs?: Json | null
          stock?: number
          transmission?: string | null
          type?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          state: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      rentals: {
        Row: {
          bike_id: string
          created_at: string
          end_time: string
          id: string
          location_id: string
          start_time: string
          status: string
          total_hours: number
          total_price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          bike_id: string
          created_at?: string
          end_time: string
          id?: string
          location_id: string
          start_time: string
          status?: string
          total_hours: number
          total_price: number
          updated_at?: string
          user_id: string
        }
        Update: {
          bike_id?: string
          created_at?: string
          end_time?: string
          id?: string
          location_id?: string
          start_time?: string
          status?: string
          total_hours?: number
          total_price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rentals_bike_id_fkey"
            columns: ["bike_id"]
            isOneToOne: false
            referencedRelation: "bikes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rentals_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          pincode: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          available: boolean | null
          brand: string
          category: string
          created_at: string | null
          description: string | null
          fuel: string | null
          id: string
          image_url: string | null
          model: string
          price: number
          transmission: string | null
          updated_at: string | null
        }
        Insert: {
          available?: boolean | null
          brand: string
          category: string
          created_at?: string | null
          description?: string | null
          fuel?: string | null
          id?: string
          image_url?: string | null
          model: string
          price: number
          transmission?: string | null
          updated_at?: string | null
        }
        Update: {
          available?: boolean | null
          brand?: string
          category?: string
          created_at?: string | null
          description?: string | null
          fuel?: string | null
          id?: string
          image_url?: string | null
          model?: string
          price?: number
          transmission?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      wishlist: {
        Row: {
          created_at: string | null
          id: string
          item_type: string | null
          item_uuid: string | null
          product_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_type?: string | null
          item_uuid?: string | null
          product_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_type?: string | null
          item_uuid?: string | null
          product_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

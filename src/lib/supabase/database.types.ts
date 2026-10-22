export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Timestamped = {
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      products: {
        Row: Timestamped & { id: string; sku: string; slug: string; name: string; description: string | null; price_eur: number; currency: string; stock_quantity: number; low_stock_threshold: number; status: string; image_url: string | null; metadata: Json };
        Insert: { id?: string; sku: string; slug: string; name: string; description?: string | null; price_eur: number; currency?: string; stock_quantity?: number; low_stock_threshold?: number; status?: string; image_url?: string | null; metadata?: Json; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [];
      };
      collections: {
        Row: Timestamped & { id: string; slug: string; name: string; description: string | null; status: string; color: string | null };
        Insert: { id?: string; slug: string; name: string; description?: string | null; status?: string; color?: string | null; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["collections"]["Insert"]>;
        Relationships: [];
      };
      customers: {
        Row: Timestamped & { id: string; email: string; full_name: string; phone: string | null; country: string | null; metadata: Json };
        Insert: { id?: string; email: string; full_name: string; phone?: string | null; country?: string | null; metadata?: Json; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["customers"]["Insert"]>;
        Relationships: [];
      };
      orders: {
        Row: Timestamped & { id: string; order_number: string; customer_id: string | null; email: string; status: string; payment_status: string; currency: string; subtotal: number; shipping_total: number; total: number; shipping_address: Json };
        Insert: { id?: string; order_number: string; customer_id?: string | null; email: string; status?: string; payment_status?: string; currency?: string; subtotal: number; shipping_total?: number; total: number; shipping_address?: Json; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
        Relationships: [];
      };
      order_items: {
        Row: { id: string; order_id: string; product_id: string | null; sku: string; name: string; unit_price: number; quantity: number; created_at: string };
        Insert: { id?: string; order_id: string; product_id?: string | null; sku: string; name: string; unit_price: number; quantity: number; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
        Relationships: [];
      };
      inventory_movements: {
        Row: { id: string; product_id: string; quantity: number; reason: string; reference: string | null; created_at: string; created_by: string | null };
        Insert: { id?: string; product_id: string; quantity: number; reason: string; reference?: string | null; created_at?: string; created_by?: string | null };
        Update: Partial<Database["public"]["Tables"]["inventory_movements"]["Insert"]>;
        Relationships: [];
      };
      content_entries: {
        Row: Timestamped & { id: string; key: string; locale: string; title: string | null; body: Json; status: string; published_at: string | null };
        Insert: { id?: string; key: string; locale?: string; title?: string | null; body?: Json; status?: string; published_at?: string | null; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["content_entries"]["Insert"]>;
        Relationships: [];
      };
      profiles: {
        Row: Timestamped & { id: string; full_name: string | null; role: "owner" | "admin" | "staff" };
        Insert: { id: string; full_name?: string | null; role?: "owner" | "admin" | "staff"; created_at?: string; updated_at?: string };
        Update: Partial<Omit<Database["public"]["Tables"]["profiles"]["Insert"], "id">> & { id?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

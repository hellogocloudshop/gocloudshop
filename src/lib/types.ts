// Hand-written types mirroring the Supabase schema (supabase/migrations/0001_init.sql).
// Kept deliberately decoupled from generated Supabase types so the UI layer never
// depends on raw row shapes — swapping mock data for live queries never touches components.

export type UserRole = "admin" | "editor";
export type AvailabilityStatus = "in_stock" | "limited" | "out_of_stock" | "preorder";
export type ContentStatus = "draft" | "published";
export type GuideType = "guide" | "blog" | "provider_guide" | "product_guide" | "comparison_guide" | "stock_update";
export type ComparisonType = "provider_vs_provider" | "topic";
export type OrderStatus =
  | "new"
  | "contacted"
  | "pending"
  | "confirmed"
  | "paid"
  | "processing"
  | "completed"
  | "cancelled";
export type PaymentStatus = "unpaid" | "partially_paid" | "paid" | "refunded";

export interface Profile {
  id: string;
  role: UserRole;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Provider {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  is_active: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  icon: string | null;
  parent_id: string | null;
  seo_title: string | null;
  seo_description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProviderCategoryPage {
  id: string;
  slug: string;
  provider_id: string;
  category_id: string | null;
  product_type: string | null;
  title: string;
  intro_content: string | null;
  seo_title: string | null;
  seo_description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  provider?: Provider;
  category?: Category | null;
}

export interface Product {
  id: string;
  provider_id: string | null;
  category_id: string | null;
  name: string;
  slug: string;
  product_type: string;
  description: string | null;
  short_description: string | null;
  base_price: number | null;
  currency: string;
  features: string[];
  whats_included: string[];
  specifications: Record<string, string>;
  image_url: string | null;
  provider_logo_override_url: string | null;
  region: string | null;
  availability: AvailabilityStatus;
  delivery_time_text: string | null;
  support_type: string | null;
  replacement_policy: string | null;
  refund_policy: string | null;
  badge: string | null;
  is_featured: boolean;
  is_popular: boolean;
  is_ai: boolean;
  is_gpu: boolean;
  is_active: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  created_at: string;
  updated_at: string;
  provider?: Provider | null;
  category?: Category | null;
  variations?: ProductVariation[];
}

export interface ProductVariation {
  id: string;
  product_id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  description: string | null;
  features: string[];
  specifications: Record<string, string>;
  region: string | null;
  availability: AvailabilityStatus;
  delivery_time_text: string | null;
  image_url: string | null;
  badge: string | null;
  ai_category: string | null;
  ai_platform: string | null;
  gpu_type: string | null;
  gpu_count: number | null;
  vram: string | null;
  compute_type: string | null;
  model_support: string | null;
  architecture: string | null;
  ai_services: string[];
  inference_support: boolean | null;
  training_support: boolean | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ComparisonRow {
  feature: string;
  values: Record<string, string>;
}

export interface Comparison {
  id: string;
  slug: string;
  title: string;
  comparison_type: ComparisonType;
  provider_ids: string[];
  category_id: string | null;
  description: string | null;
  rows: ComparisonRow[];
  seo_title: string | null;
  seo_description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  providers?: Provider[];
}

export interface UseCase {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  content: string | null;
  related_category_ids: string[];
  related_product_type: string | null;
  seo_title: string | null;
  seo_description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Guide {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  guide_type: GuideType;
  related_provider_id: string | null;
  related_category_id: string | null;
  tags: string[];
  status: ContentStatus;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  /** Only meaningful for guide_type "stock_update" — a dated stock-
   *  availability announcement can optionally reference a real price and
   *  availability status, same as a product listing. Absent/null for
   *  ordinary guides/blog posts. */
  price?: number | null;
  currency?: string | null;
  availability?: AvailabilityStatus | null;
  created_at: string;
  updated_at: string;
  related_provider?: Provider | null;
  related_category?: Category | null;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  product_id: string | null;
  provider_id: string | null;
  category: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  customer_name: string;
  customer_role: string | null;
  product_id: string | null;
  quote: string;
  rating: number;
  country: string | null;
  review_date: string;
  is_approved: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  product?: Pick<Product, "id" | "name" | "slug"> | null;
}

export interface Order {
  id: string;
  customer_name: string | null;
  contact: string | null;
  product_id: string | null;
  variation_id: string | null;
  product_name_snapshot: string | null;
  variation_name_snapshot: string | null;
  price_snapshot: number | null;
  currency: string;
  /** Units of the same product/variation. Always 1 for the Telegram-lead
   *  ordering flow. */
  quantity: number;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  notes: string | null;
  referrer: string | null;
  /** Legacy NOWPayments crypto-payment fields (see migration 0007) — kept
   *  only so historical orders placed while that integration was active
   *  still display correctly in the admin Orders view; always null for the
   *  Telegram-lead ordering flow, which is the only active ordering path. */
  payment_provider: string | null;
  nowpayments_payment_id: string | null;
  nowpayments_order_id: string | null;
  pay_currency: string | null;
  pay_amount: number | null;
  pay_address: string | null;
  outcome_amount: number | null;
  outcome_currency: string | null;
  /** Raw payment-provider status string for legacy NOWPayments orders. */
  crypto_payment_status: string | null;
  /** Most recent verified IPN payload, for audit/debugging only. */
  ipn_payload: Record<string, unknown> | null;
  paid_at: string | null;
  /** Set manually by staff once the order has actually been delivered — no
   *  automated fulfillment exists in this project. */
  fulfilled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: 1;
  site_name: string;
  tagline: string;
  logo_url: string | null;
  favicon_url: string | null;
  telegram_username: string;
  /** Digits-only international WhatsApp number, e.g. "15551234567". Null = not configured yet (hidden site-wide). */
  whatsapp_number: string | null;
  /** Full URL of the public Telegram announcements channel — distinct from telegram_username (support/orders). Null = hidden site-wide. */
  telegram_channel_url: string | null;
  support_email: string | null;
  social_links: Record<string, string>;
  footer_content: Record<string, unknown>;
  default_seo: { title?: string; description?: string };
  privacy_policy: string | null;
  terms_of_service: string | null;
  refund_policy: string | null;
  disclaimer: string | null;
  updated_at: string;
}

export interface HomepageSection {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  content: Record<string, unknown>;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

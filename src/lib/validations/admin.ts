import { z } from "zod";

const slug = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only");

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined));

const optionalId = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : null));

const listField = z
  .string()
  .optional()
  .transform((v) =>
    (v ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
  );

/** Parses "Key: Value" lines (one per line) into a plain object, for specifications. */
const kvField = z
  .string()
  .optional()
  .transform((v) => {
    const out: Record<string, string> = {};
    for (const line of (v ?? "").split("\n")) {
      const idx = line.indexOf(":");
      if (idx === -1) continue;
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      if (key && value) out[key] = value;
    }
    return out;
  });

const availability = z.enum(["in_stock", "limited", "out_of_stock", "preorder"]).default("in_stock");

export const providerSchema = z.object({
  slug,
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().optional(),
  logo_url: optionalUrl,
  website_url: optionalUrl,
  is_active: z.coerce.boolean().default(true),
  sort_order: z.coerce.number().default(0),
  seo_title: z.string().trim().optional(),
  seo_description: z.string().trim().optional(),
});

export const categorySchema = z.object({
  slug,
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().optional(),
  image_url: optionalUrl,
  icon: z.string().trim().optional(),
  parent_id: optionalId,
  is_active: z.coerce.boolean().default(true),
  sort_order: z.coerce.number().default(0),
  seo_title: z.string().trim().optional(),
  seo_description: z.string().trim().optional(),
});

export const providerCategoryPageSchema = z.object({
  slug,
  provider_id: z.string().trim().min(1, "Provider is required"),
  category_id: optionalId,
  product_type: z.string().trim().optional(),
  title: z.string().trim().min(1, "Title is required"),
  intro_content: z.string().trim().optional(),
  is_active: z.coerce.boolean().default(true),
  sort_order: z.coerce.number().default(0),
  seo_title: z.string().trim().optional(),
  seo_description: z.string().trim().optional(),
});

export const productSchema = z.object({
  slug,
  name: z.string().trim().min(1, "Name is required"),
  provider_id: optionalId,
  category_id: optionalId,
  product_type: z.string().trim().min(1, "Product type is required"),
  description: z.string().trim().optional(),
  short_description: z.string().trim().optional(),
  base_price: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : null)),
  currency: z.string().trim().min(1).default("USD"),
  features: listField,
  whats_included: listField,
  specifications: kvField,
  image_url: optionalUrl,
  provider_logo_override_url: optionalUrl,
  region: z.string().trim().optional(),
  availability,
  delivery_time_text: z.string().trim().optional(),
  support_type: z.string().trim().optional(),
  replacement_policy: z.string().trim().optional(),
  refund_policy: z.string().trim().optional(),
  badge: z.string().trim().optional(),
  is_featured: z.coerce.boolean().default(false),
  is_popular: z.coerce.boolean().default(false),
  is_ai: z.coerce.boolean().default(false),
  is_gpu: z.coerce.boolean().default(false),
  is_active: z.coerce.boolean().default(true),
  sort_order: z.coerce.number().default(0),
  seo_title: z.string().trim().optional(),
  seo_description: z.string().trim().optional(),
  og_image_url: optionalUrl,
});

export const variationSchema = z.object({
  product_id: z.string().trim().min(1),
  name: z.string().trim().min(1, "Name is required"),
  slug,
  price: z.coerce.number().min(0, "Price must be zero or more"),
  currency: z.string().trim().min(1).default("USD"),
  description: z.string().trim().optional(),
  features: listField,
  specifications: kvField,
  region: z.string().trim().optional(),
  availability,
  delivery_time_text: z.string().trim().optional(),
  image_url: optionalUrl,
  badge: z.string().trim().optional(),
  ai_category: z.string().trim().optional(),
  ai_platform: z.string().trim().optional(),
  gpu_type: z.string().trim().optional(),
  gpu_count: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : null)),
  vram: z.string().trim().optional(),
  compute_type: z.string().trim().optional(),
  model_support: z.string().trim().optional(),
  architecture: z.string().trim().optional(),
  ai_services: listField,
  inference_support: z.coerce.boolean().default(false),
  training_support: z.coerce.boolean().default(false),
  sort_order: z.coerce.number().default(0),
  is_active: z.coerce.boolean().default(true),
});

export const comparisonRowsField = z
  .string()
  .optional()
  .transform((v) => {
    // One row per line: "Feature | provider-slug=value | provider-slug=value"
    return (v ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [feature, ...rest] = line.split("|").map((p) => p.trim());
        const values: Record<string, string> = {};
        for (const pair of rest) {
          const [key, value] = pair.split("=").map((p) => p.trim());
          if (key && value) values[key] = value;
        }
        return { feature, values };
      });
  });

export const comparisonSchema = z.object({
  slug,
  title: z.string().trim().min(1, "Title is required"),
  comparison_type: z.enum(["provider_vs_provider", "topic"]).default("provider_vs_provider"),
  provider_ids: z
    .string()
    .optional()
    .transform((v) => (v ?? "").split(",").map((s) => s.trim()).filter(Boolean)),
  category_id: optionalId,
  description: z.string().trim().optional(),
  rows: comparisonRowsField,
  is_active: z.coerce.boolean().default(true),
  sort_order: z.coerce.number().default(0),
  seo_title: z.string().trim().optional(),
  seo_description: z.string().trim().optional(),
});

export const useCaseSchema = z.object({
  slug,
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().optional(),
  icon: z.string().trim().optional(),
  content: z.string().trim().optional(),
  related_category_ids: z
    .string()
    .optional()
    .transform((v) => (v ?? "").split(",").map((s) => s.trim()).filter(Boolean)),
  related_product_type: z.string().trim().optional(),
  is_active: z.coerce.boolean().default(true),
  sort_order: z.coerce.number().default(0),
  seo_title: z.string().trim().optional(),
  seo_description: z.string().trim().optional(),
});

export const guideSchema = z.object({
  slug,
  title: z.string().trim().min(1, "Title is required"),
  excerpt: z.string().trim().optional(),
  content: z.string().trim().min(1, "Content is required"),
  cover_image_url: optionalUrl,
  guide_type: z
    .enum(["guide", "blog", "provider_guide", "product_guide", "comparison_guide", "stock_update"])
    .default("guide"),
  related_provider_id: optionalId,
  related_category_id: optionalId,
  tags: z
    .string()
    .optional()
    .transform((v) => (v ?? "").split(",").map((t) => t.trim()).filter(Boolean)),
  status: z.enum(["draft", "published"]).default("draft"),
  // Only meaningful when guide_type is "stock_update" — left null for
  // ordinary guides/blog posts.
  price: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : null)),
  currency: z.string().trim().min(1).default("USD"),
  availability: z.enum(["in_stock", "limited", "out_of_stock", "preorder"]).optional(),
  seo_title: z.string().trim().optional(),
  seo_description: z.string().trim().optional(),
});

export const faqSchema = z.object({
  question: z.string().trim().min(1, "Question is required"),
  answer: z.string().trim().min(1, "Answer is required"),
  product_id: optionalId,
  provider_id: optionalId,
  category: z.string().trim().optional(),
  sort_order: z.coerce.number().default(0),
  is_active: z.coerce.boolean().default(true),
});

export const reviewSchema = z.object({
  customer_name: z.string().trim().min(1, "Customer name is required"),
  customer_role: z.string().trim().optional(),
  product_id: optionalId,
  quote: z.string().trim().min(1, "Quote is required"),
  rating: z.coerce.number().min(1).max(5),
  country: z.string().trim().optional(),
  review_date: z.string().trim().optional(),
  is_approved: z.coerce.boolean().default(false),
  is_featured: z.coerce.boolean().default(false),
});

export const orderStatusSchema = z.object({
  order_status: z.enum(["new", "contacted", "pending", "confirmed", "paid", "processing", "completed", "cancelled"]),
  payment_status: z.enum(["unpaid", "partially_paid", "paid", "refunded"]),
  notes: z.string().trim().optional(),
});

export const siteSettingsSchema = z.object({
  site_name: z.string().trim().min(1, "Site name is required"),
  tagline: z.string().trim().optional(),
  logo_url: optionalUrl,
  favicon_url: optionalUrl,
  telegram_username: z.string().trim().min(1, "Telegram username is required"),
  whatsapp_number: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v.replace(/[^\d]/g, "") : null)),
  telegram_channel_url: optionalUrl,
  support_email: z.string().trim().optional(),
  privacy_policy: z.string().trim().optional(),
  terms_of_service: z.string().trim().optional(),
  refund_policy: z.string().trim().optional(),
  disclaimer: z.string().trim().optional(),
});

export const inviteUserSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  role: z.enum(["admin", "editor"]).default("editor"),
  name: z.string().trim().optional(),
});

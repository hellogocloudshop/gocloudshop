import { createClient } from "@/lib/supabase/server";
import { mockSiteSettings } from "@/lib/mock-data";
import type { SiteSettings } from "@/lib/types";

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  if (!supabase) return mockSiteSettings;

  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  return (data as SiteSettings) ?? mockSiteSettings;
}

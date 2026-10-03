import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "")
  .trim()
  .replace(/\/rest\/v1\/?$/i, "")
  .replace(/\/+$/, "");
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes("placeholder")
);

export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;

export interface ContactInquiryPayload {
  name: string;
  email: string;
  office: string;
  type: string;
  message: string;
}

export async function submitContactInquiry(inquiry: ContactInquiryPayload) {
  if (isSupabaseConfigured && supabase) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase.from("inquiries") as any).insert([inquiry]);
      if (error) {
        console.error("Supabase inquiry insert error:", error);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (err: unknown) {
      console.error("Supabase inquiry exception:", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      return { success: false, error: message };
    }
  }

  // Graceful fallback for local development or demo before entering Supabase keys
  console.log("Mock submitted inquiry to Supabase:", inquiry);
  return { success: true, simulated: true };
}

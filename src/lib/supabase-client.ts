import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  // Return a no-op mock client if we're on the server or env vars are missing
  if (typeof window === "undefined") {
    return null as unknown as ReturnType<typeof createBrowserClient<Database>>;
  }

  if (!client) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      try {
        client = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
      } catch {
        // Return mock client on error
      }
    }
  }

  return client as ReturnType<typeof createBrowserClient<Database>>;
}

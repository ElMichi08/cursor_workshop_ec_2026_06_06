import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type ProfileSummary = {
  first_name: string;
  last_name: string;
  balance_cents: number;
};

export async function getCurrentUser() {
  if (!isSupabaseConfigured) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ?? null;
}

export async function getCurrentProfile(): Promise<{
  user: { id: string; email?: string } | null;
  profile: ProfileSummary | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured) {
    return { user: null, profile: null, error: "Supabase is not configured." };
  }

  const user = await getCurrentUser();

  if (!user) {
    return { user: null, profile: null, error: null };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("first_name, last_name, balance_cents")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return {
      user: { id: user.id, email: user.email },
      profile: null,
      error: error.message,
    };
  }

  return {
    user: { id: user.id, email: user.email },
    profile: data,
    error: null,
  };
}

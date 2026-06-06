"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AuthActionState = {
  error?: string;
  needsEmailConfirmation?: boolean;
};

function validateEmail(email: string): string | null {
  if (!email.trim()) {
    return "Email is required.";
  }
  if (!email.includes("@")) {
    return "Enter a valid email address.";
  }
  return null;
}

function validatePassword(password: string): string | null {
  if (!password) {
    return "Password is required.";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters.";
  }
  return null;
}

export async function signIn(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isSupabaseConfigured) {
    return { error: "Supabase is not configured." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const emailError = validateEmail(email);
  if (emailError) {
    return { error: emailError };
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return { error: passwordError };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/markets");
}

export async function signUp(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!isSupabaseConfigured) {
    return { error: "Supabase is not configured." };
  }

  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!firstName) {
    return { error: "First name is required." };
  }
  if (!lastName) {
    return { error: "Last name is required." };
  }

  const emailError = validateEmail(email);
  if (emailError) {
    return { error: emailError };
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return { error: passwordError };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/markets");
  }

  if (data.user) {
    return { needsEmailConfirmation: true };
  }

  return { error: "Sign up failed. Please try again." };
}

export async function signOut() {
  if (!isSupabaseConfigured) {
    redirect("/markets");
  }

  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/markets");
}

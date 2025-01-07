import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

const supabase = createClient();

export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(`Failed to login: ${error.message}`);

  return data;
};

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw new Error(`Failed to sign up: ${error.message}`);

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(`Failed to sign out: ${error.message}`);

  return true;
};

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }
  return user;
};

export const authOnChange = (callBack: any) => {
  supabase.auth.onAuthStateChange((event, session) => {
    callBack(event, session);
  });
};

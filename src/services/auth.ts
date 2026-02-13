import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

const supabase = createClient();

let currentUserPromise: Promise<any> | null = null;

export const login = async (email: string, password: string) => {
  currentUserPromise = null;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(`Failed to login: ${error.message}`);

  return data;
};

export const signUp = async (email: string, password: string) => {
  currentUserPromise = null;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw new Error(`Failed to sign up: ${error.message}`);

  return data;
};

export const signOut = async () => {
  currentUserPromise = null;
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(`Failed to sign out: ${error.message}`);

  return true;
};

export const getCurrentUser = async () => {
  if (currentUserPromise) return currentUserPromise;

  currentUserPromise = (async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        redirect("/login");
      }
      return user;
    }
    return session.user;
  })();

  return currentUserPromise;
};

export const authOnChange = (callBack: any) => {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT" || event === "USER_UPDATED") {
      currentUserPromise = null;
    }
    callBack(event, session);
  });
};

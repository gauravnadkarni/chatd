"use client";

import { createClientForBrowser } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useUserStore from "@/lib/store/useUserStore";

interface AuthStateProps {
  user: User | null; // User passed from the Server Layout
}

export default function AuthState({ user: initialUser }: AuthStateProps) {
  const { setUser } = useUserStore((state) => state);
  const supabase = createClientForBrowser();
  const router = useRouter();

  useEffect(() => {
    setUser(initialUser);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router, setUser, initialUser]);

  return null;
}

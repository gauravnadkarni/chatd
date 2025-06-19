"use client";

import { createClientForBrowser } from "@/lib/supabase-client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useUserStore from "@/lib/store/useUserStore";
import Spinner from "../Spinner";
import { ProfileModel } from "@/lib/models/profile";

interface AuthStateProps {
  userFromAuth: User | null; // User passed from the Server Layout
  userProfileFromDb: ProfileModel | null; // User passed from the Server Layout
  children: React.ReactNode;
}

export default function AuthState({
  userFromAuth,
  userProfileFromDb,
  children,
}: AuthStateProps) {
  const {
    setUserFromAuth,
    setUserFromDb,
    isUserLoggingOut,
    setUserLoggingOut,
  } = useUserStore((state) => state);
  const supabase = createClientForBrowser();
  const router = useRouter();

  useEffect(() => {
    setUserFromAuth(userFromAuth);
    setUserFromDb(userProfileFromDb);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUserFromAuth(session.user);
      } else {
        setUserFromAuth(null);
        setUserFromDb(null);
        setUserLoggingOut(false);
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [
    supabase,
    router,
    setUserFromAuth,
    setUserFromDb,
    userFromAuth,
    userProfileFromDb,
    setUserLoggingOut,
  ]);
  console.log(isUserLoggingOut, "user logging out");
  if (userFromAuth && !isUserLoggingOut) {
    return children;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner centerAligned classValues="h-16 w-16" />
    </div>
  );
}

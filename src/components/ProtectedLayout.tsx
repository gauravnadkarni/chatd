import { createClientForServer } from "@/lib/supabase-server";
import { redirect } from "@/lib/i18n/navigation";
import AuthState from "./auth/AuthState";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { getUserById } from "@/lib/services/profile";

export async function ProtectedLayout({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const supabase = await createClientForServer();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.log("user not found");
    return redirect({
      href: "/",
      locale: locale,
    });
  }

  const userFromDb = await getUserById(user.id);

  return (
    <>
      <AuthState userFromAuth={user} userProfileFromDb={userFromDb}>
        <Header isFullWidth={true} />
        {children}
        <Footer isFullWidth={true} />
      </AuthState>
    </>
  );
}

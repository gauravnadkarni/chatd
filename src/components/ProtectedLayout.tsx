import { createClientForServer } from "@/lib/supabase";
import { cookies } from "next/headers";
import { redirect } from "@/lib/i18n/navigation";
import AuthState from "./auth/AuthState";

export default async function ProtectedLayout({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const cookieStore = await cookies();
  const supabase = await createClientForServer(cookieStore);

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

  return (
    <>
      <AuthState user={user} />
      {/*<Header />*/}
      <main>{children}</main>
      {/*<Footer />*/}
    </>
  );
}

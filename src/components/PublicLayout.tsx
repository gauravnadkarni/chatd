import { redirect } from "@/lib/i18n/navigation";
import { createClientForServer } from "@/lib/supabase";
import { cookies } from "next/headers";
import { Footer } from "./Footer";
import { Header } from "./Header";

export default async function PublicLayout({
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

  if (!error && user) {
    return redirect({
      href: "/chat",
      locale: locale,
    });
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

import { redirect } from "@/lib/i18n/navigation";
import { createClientForServer } from "@/lib/supabase-server";
import { Footer } from "./Footer";
import { Header } from "./Header";

export default async function PublicLayout({
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

  if (!error && user) {
    return redirect({
      href: "/chats",
      locale: locale,
    });
  }

  return (
    <>
      <Header isFullWidth={false} />
      {children}
      <Footer isFullWidth={false} />
    </>
  );
}

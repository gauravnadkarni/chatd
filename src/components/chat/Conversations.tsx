"use client";
import { createClientForBrowser } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/lib/i18n/navigation";

export default function Conversations() {
  const supabase = createClientForBrowser();
  const router = useRouter();
  const inSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      router.refresh();
    }
  };
  return (
    <>
      <div className="text-3xl font-bold">Dashabord</div>
      <Button onClick={inSignOut}>Logout</Button>
    </>
  );
}

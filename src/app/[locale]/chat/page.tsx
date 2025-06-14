import Conversations from "@/components/chat/Conversations";
import ProtectedLayout from "@/components/ProtectedLayout";

export default async function Home({ params }: { params: { locale: string } }) {
  const { locale } = await params;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ProtectedLayout locale={locale}>
        <Conversations />
      </ProtectedLayout>
    </div>
  );
}

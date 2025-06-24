import { ContactsContainer } from "@/components/contacts/contact-container";
import { ProtectedLayout } from "@/components/ProtectedLayout";

export default async function Contacts({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen flex flex-col bg-background h-[100vh]">
      <ProtectedLayout locale={locale}>
        <ContactsContainer />
      </ProtectedLayout>
    </div>
  );
}

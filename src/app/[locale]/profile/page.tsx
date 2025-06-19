import { ProtectedLayout } from "@/components/ProtectedLayout";
import ProfileContainer from "@/components/profile/ProfileContainer";

export default async function Profile({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen flex flex-col bg-background h-[100vh]">
      <ProtectedLayout locale={locale}>
        <ProfileContainer />
      </ProtectedLayout>
    </div>
  );
}

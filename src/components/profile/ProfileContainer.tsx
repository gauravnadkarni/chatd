"use client";

import ChangePassword from "@/components/profile/ChangePassword";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "@/lib/i18n/navigation";
import useUserStore from "@/lib/store/useUserStore";
import { createClientForBrowser } from "@/lib/supabase-client";
import { SignInProviders } from "@/lib/types/ThirdPartyAuthProviders";
import { Lock, User } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTranslations } from "next-intl";

export default function ProfileContainer() {
  const profileTranslations = useTranslations("profile");
  const { userFromAuth, userFromDb, setUserLoggingOut } = useUserStore(
    (state) => state
  );
  const toast = useToast();
  const isMobile = useIsMobile();

  const supabase = createClientForBrowser();
  const router = useRouter();
  const getSignInProvider = (): SignInProviders | null => {
    const sub = userFromAuth?.user_metadata.sub;
    const provider = userFromAuth?.user_metadata.provider_id;
    if ((sub || provider) && userFromAuth.identities) {
      const identity = userFromAuth.identities.find(
        (identity) => identity.id === sub || identity.id === provider
      );
      if (!identity) return null;
      return identity.provider as SignInProviders;
    }
    return null;
  };

  const isSocialLogin = getSignInProvider() !== "email";

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      {/* Main Content Card with Tabs */}
      <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-xl">
        <Tabs defaultValue="profile" className="w-full">
          <CardHeader className="pb-4">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100">
              <TabsTrigger
                value="profile"
                className="flex items-center gap-2 data-[state=active]:bg-white"
              >
                <User className="h-4 w-4" />
                {profileTranslations("profileTab.title")}
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="flex items-center gap-2 data-[state=active]:bg-white"
              >
                <Lock className="h-4 w-4" />
                {profileTranslations("passwordTab.title")}
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Profile Information Tab */}
            <TabsContent value="profile" className="space-y-6 mt-6">
              <div className="space-y-2">
                <CardTitle className="text-xl text-gray-800">
                  {profileTranslations("profileTab.cardTitle")}
                </CardTitle>
                <CardDescription>
                  {profileTranslations("profileTab.cardDescription")}
                </CardDescription>
              </div>

              {userFromDb && <ProfileInfo initialData={userFromDb} />}
            </TabsContent>

            {/* Password Change Tab */}
            <TabsContent value="password" className="space-y-6 mt-6">
              <div className="space-y-2">
                <CardTitle className="text-xl text-gray-800">
                  {profileTranslations("passwordTab.cardTitle")}
                </CardTitle>
                <CardDescription>
                  {isSocialLogin
                    ? profileTranslations("passwordTab.cardDescriptionSocial")
                    : profileTranslations("passwordTab.cardDescriptionEmail")}
                </CardDescription>
              </div>
              {userFromAuth && (
                <ChangePassword
                  userFromAuth={userFromAuth}
                  isSocialLogin={isSocialLogin}
                  loginMethod={getSignInProvider()}
                  onPasswordResetSuccessCallback={async () => {
                    const { error } = await supabase.auth.signOut();
                    if (error) {
                      console.error(error);
                      toast.error(
                        profileTranslations(
                          "passwordTab.changePasswordToastError"
                        ),
                        {
                          position: isMobile ? "top-center" : "bottom-right",
                          duration: 3000,
                        }
                      );
                    } else {
                      setUserLoggingOut(true); //rest is taken care by auth state component
                      router.replace("/");
                    }
                  }}
                />
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}

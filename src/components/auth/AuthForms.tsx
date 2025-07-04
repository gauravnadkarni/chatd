"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetRedirectUrl } from "@/hooks/useSocialAuth";
import useAuthFormTransitioningStore from "@/lib/store/useAuthFormTransitioningStore";
import { ThirdPartyAuthProviders } from "@/lib/types/ThirdPartyAuthProviders";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { SigninForm } from "./SigninForm";
import { SignupForm } from "./SignupForm";
import { useSearchParams } from "next/navigation";
import Spinner from "../Spinner";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import useUserStore from "@/lib/store/useUserStore";

export function AuthForms() {
  const authFormTranslations = useTranslations("landingPage.auth");
  const { setUserLoggingOut, isUserLoggingOut } = useUserStore(
    (state) => state
  );
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const currentForm = searchParams.get("form") || "signin";
  const { isTransitioning, activeForm, setActiveForm } =
    useAuthFormTransitioningStore((state) => state);
  const {
    mutate: getRedirectUrl,
    isPending,
    isError,
    data,
  } = useGetRedirectUrl();

  const handleSocialLogin = (provider: ThirdPartyAuthProviders) => {
    getRedirectUrl(provider);
  };

  const updateUrlParams = (formType: "signin" | "signup") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("form", formType);
    return params.toString();
  };

  useEffect(() => {
    if (currentForm === "signin" || currentForm === "signup") {
      setActiveForm(currentForm);
    }
  }, [currentForm, setActiveForm, router]);

  useEffect(() => {
    if (isPending || isError || !data?.url) {
      return;
    }
    window.open(
      data.url,
      "PopupWindow",
      "width=500,height=600,menubar=no,toolbar=no,location=no,status=no"
    );
    const handleMessage = (
      event: MessageEvent<{ error?: string; type: string }>
    ) => {
      if (event.origin !== window.location.origin) return;
      if (!event.data.type || event.data.type !== "provider_oauth") {
        return;
      }

      if (!event.data.error) {
        window.location.reload();
      } else {
        console.log(event.data.error);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [isPending, data, isError]);

  useEffect(() => {
    if (isUserLoggingOut) {
      setUserLoggingOut(false);
    }
  }, [isUserLoggingOut, setUserLoggingOut]);

  const SocialLoginButtons = () => (
    <div className="space-y-3">
      <Button
        variant="outline"
        className="w-full border-border hover:bg-accent hover:text-accent-foreground"
        onClick={() => handleSocialLogin("google")}
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {authFormTranslations("buttons.googleText")}
      </Button>

      <Button
        variant="outline"
        className="w-full border-border hover:bg-accent hover:text-accent-foreground"
        onClick={() => handleSocialLogin("facebook")}
      >
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        {authFormTranslations("buttons.facebookText")}
      </Button>
    </div>
  );

  const formTitle =
    activeForm === "signup"
      ? authFormTranslations("signupTitle")
      : authFormTranslations("signinTitle");

  const formDescription =
    activeForm === "signup"
      ? authFormTranslations("signupDescription")
      : authFormTranslations("signinDescription");

  const formContinueMessage =
    activeForm === "signup"
      ? authFormTranslations("signupEmailContinueMessage")
      : authFormTranslations("signinEmailContinueMessage");

  return (
    <div className="order-1 lg:order-2 flex items-center justify-center">
      <div
        className={`w-full transition-all duration-300 ${
          isTransitioning
            ? "opacity-0 transform translate-y-2"
            : "opacity-100 transform translate-y-0"
        }`}
      >
        {activeForm === "loading" && (
          <Card className="w-full max-w-md mx-auto glass-effect shadow-2xl">
            <CardContent className="space-y-4">
              <div className="min-h-96 flex items-center justify-center">
                <Spinner centerAligned classValues={["h-12 w-12"]} />
              </div>
            </CardContent>
          </Card>
        )}
        {(activeForm === "signin" || activeForm === "signup") && (
          <Card className="w-full max-w-md mx-auto glass-effect shadow-2xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-heading">
                {formTitle}
              </CardTitle>
              <CardDescription className="text-center text-sub">
                {formDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SocialLoginButtons />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    {formContinueMessage}
                  </span>
                </div>
              </div>

              {activeForm === "signin" && (
                <SigninForm
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  onSuccess={() => {
                    router.refresh();
                  }}
                />
              )}
              {activeForm === "signup" && (
                <SignupForm
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  showConfirmPassword={showConfirmPassword}
                  setShowConfirmPassword={setShowConfirmPassword}
                  onSuccess={() => {
                    router.push(`${pathname}?${updateUrlParams("signin")}`, {
                      scroll: false,
                    });
                  }}
                />
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

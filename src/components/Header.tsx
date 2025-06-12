"use client";

import { MessageCircle } from "lucide-react";
import { HeaderAuthButton } from "./auth/HeaderAuthButton";
import useAuthFormTransitioningStore from "@/lib/store/useAuthFormTransitioningStore";
import { useTranslations } from "next-intl";

export function Header() {
  const commonTranslations = useTranslations("common");
  const headerTranslations = useTranslations("landingPage.header");
  const { activeForm, setActiveForm } = useAuthFormTransitioningStore(
    (state) => state
  );

  const onSignInClick = () => {
    setActiveForm("signin");
  };

  const onSignUpClick = () => {
    setActiveForm("signup");
  };

  return (
    <header className="w-full border-b border-white/20 bg-white/10 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              {commonTranslations("appName")}
            </span>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <HeaderAuthButton
              isActive={activeForm === "signin"}
              onClick={onSignInClick}
              label={headerTranslations("signinButtonText")}
            />
            <HeaderAuthButton
              isActive={activeForm === "signup"}
              onClick={onSignUpClick}
              label={headerTranslations("signupButtonText")}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

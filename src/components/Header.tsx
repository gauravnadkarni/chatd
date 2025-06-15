"use client";

import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { HeaderAuthButton } from "./auth/HeaderAuthButton";
import useAuthFormTransitioningStore from "@/lib/store/useAuthFormTransitioningStore";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export function Header() {
  const headerTranslations = useTranslations("landingPage.header");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { activeForm, setActiveForm } = useAuthFormTransitioningStore(
    (state) => state
  );

  const updateUrlParams = (formType: "signin" | "signup") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("form", formType);
    return params.toString();
  };

  const onSignInClick = () => {
    setActiveForm("signin");
    router.push(`${pathname}?${updateUrlParams("signin")}`, { scroll: false });
  };

  const onSignUpClick = () => {
    setActiveForm("signup");
    router.push(`${pathname}?${updateUrlParams("signup")}`, { scroll: false });
  };

  return (
    <header className="w-full border-b border-border border-primary backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Image
                src="/assets/images/logo.png"
                alt="Logo"
                width={64}
                height={64}
                className="h16 w-16"
              />
            </div>
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

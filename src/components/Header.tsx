"use client";

import { Link, usePathname, useRouter } from "@/lib/i18n/navigation";
import { HeaderAuthButton } from "./auth/HeaderAuthButton";
import useAuthFormTransitioningStore from "@/lib/store/useAuthFormTransitioningStore";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import useUserStore from "@/lib/store/useUserStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { createClientForBrowser } from "@/lib/supabase-client";
import { useToast } from "@/hooks/useToast";
import { useIsMobile } from "@/hooks/useIsMobile";

export function Header({ isFullWidth }: { isFullWidth: boolean }) {
  const headerTranslations = useTranslations("landingPage.header");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userFromAuth: currentUser, setUserLoggingOut } = useUserStore(
    (store) => store
  );
  const supabase = createClientForBrowser();
  const toast = useToast();
  const isMobile = useIsMobile();

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

  const onLogoutClick = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
      toast.error("We are facing problem while logging you out", {
        position: isMobile ? "top-center" : "bottom-right",
        duration: 3000,
      });
    } else {
      setUserLoggingOut(true); //rest is taken care by auth state component
    }
  };

  return (
    <header className="w-full border-b border-border border-primary backdrop-blur-sm">
      <div
        className={cn(
          "mx-auto px-4 sm:px-6 lg:px-8",
          isFullWidth && "w-full",
          !isFullWidth && "max-w-6xl"
        )}
      >
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/assets/images/logo.png"
                  alt="Logo"
                  width={64}
                  height={64}
                  className="h16 w-16"
                />
              </Link>
            </div>
          </div>

          {/* Auth Buttons */}
          {!currentUser && (
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
          )}
          {currentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center hover:bg-primary/50 focus:bg-primary/70"
                >
                  <div className="w-4 h-4 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-white/95 backdrop-blur-sm border-white/20"
              >
                <div className="px-3 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {currentUser.email}
                  </p>
                  <p className="text-xs text-gray-600">{currentUser.email}</p>
                </div>
                <DropdownMenuItem
                  onClick={() => {
                    router.push("/profile");
                  }}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-blue-50"
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {}}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-blue-50"
                >
                  <Settings className="h-4 w-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem
                  onClick={() => {
                    onLogoutClick();
                  }}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-red-50 text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}

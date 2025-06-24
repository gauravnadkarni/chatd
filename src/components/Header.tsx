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
import {
  ChevronDown,
  Cog,
  ContactRound,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { createClientForBrowser } from "@/lib/supabase-client";
import { useToast } from "@/hooks/useToast";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useProfileImage } from "@/hooks/useProfile";
import Spinner from "./Spinner";

export function Header({ isFullWidth }: { isFullWidth: boolean }) {
  const headerTranslations = useTranslations("landingPage.header");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    userFromAuth: currentUser,
    userFromDb,
    setUserLoggingOut,
  } = useUserStore((store) => store);
  const {
    data: profileImagedata,
    isPending: profileImagePending,
    isFetching: profileImageFetching,
    isLoading: profileImageLoading,
    error: profileImageError,
  } = useProfileImage(userFromDb?.avatar_file_name);
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
            <div className="flex justify-end items-center space-x-3">
              <Link href="/contacts" className="text-gray-500">
                <ContactRound size={24} />
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="text-gray-500 border p-1 rounded-full flex items-center justify-center">
                    <Settings size={24} />
                    <ChevronDown size={8} />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white/95 backdrop-blur-sm border-white/20"
                >
                  <div className="px-3 py-2 border-b border-gray-200 flex gap-2 justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {currentUser.email}
                      </p>
                      <p className="text-xs text-gray-600">
                        {currentUser.email}
                      </p>
                    </div>
                    <div>
                      <Avatar className="h-8 w-8 relative border border-full border-primary">
                        {(profileImageFetching || profileImageLoading) && (
                          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center w-full h-full bg-primary/70">
                            <Spinner classValues="h-4 w-4" centerAligned />
                          </div>
                        )}
                        <AvatarImage
                          src={profileImagedata?.url || undefined}
                          alt="Profile picture"
                        />
                        <AvatarFallback className="bg-primary/10 text-md">
                          {userFromDb?.full_name
                            ? userFromDb?.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                            : "NA"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
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
                  {/*<DropdownMenuItem
                  onClick={() => {}}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-blue-50"
                >
                  <Settings className="h-4 w-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>*/}
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
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

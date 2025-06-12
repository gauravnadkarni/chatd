"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import useAuthFormTransitioningStore from "@/lib/store/useAuthFormTransitioningStore";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

export function AuthForms() {
  const authFormTranslations = useTranslations("landingPage.auth");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { isTransitioning, activeForm } = useAuthFormTransitioningStore(
    (state) => state
  );

  const handleSocialLogin = (provider: "google" | "facebook") => {
    // Placeholder for social login functionality
    console.log(`Login with ${provider}`);
  };

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

  if (activeForm === "signin") {
    return (
      <div className="order-1 lg:order-2 flex items-center justify-center">
        <div
          className={`w-full transition-all duration-300 ${
            isTransitioning
              ? "opacity-0 transform translate-y-2"
              : "opacity-100 transform translate-y-0"
          }`}
        >
          <Card className="w-full max-w-md mx-auto glass-effect shadow-2xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-heading">
                {authFormTranslations("signinTitle")}
              </CardTitle>
              <CardDescription className="text-center text-sub">
                {authFormTranslations("signinDescription")}
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
                    {authFormTranslations("signinEmailContinueMessage")}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    {authFormTranslations("signin.emailLabel")}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={authFormTranslations(
                        "signin.emailPlaceholder"
                      )}
                      className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground focus-ring"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">
                    {authFormTranslations("signin.passwordLabel")}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={authFormTranslations(
                        "signin.passwordPlaceholder"
                      )}
                      className="pl-10 pr-10 bg-input border-border text-foreground placeholder:text-muted-foreground focus-ring"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember"
                      type="checkbox"
                      className="rounded border-border text-primary-accent focus:ring-primary-accent"
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm text-muted-foreground"
                    >
                      {authFormTranslations("signin.rememberMe")}
                    </Label>
                  </div>
                  <button className="text-sm text-primary-accent hover:text-primary transition-colors">
                    {authFormTranslations("signin.forgotPassword")}
                  </button>
                </div>

                <Button className="w-full bg-primary hover:bg-primary-accent text-primary-foreground">
                  {authFormTranslations("signin.signInButtonText")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="order-1 lg:order-2 flex items-center justify-center">
      <div
        className={`w-full transition-all duration-300 ${
          isTransitioning
            ? "opacity-0 transform translate-y-2"
            : "opacity-100 transform translate-y-0"
        }`}
      >
        <Card className="w-full max-w-md mx-auto glass-effect shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-heading">
              {authFormTranslations("signupTitle")}
            </CardTitle>
            <CardDescription className="text-center text-sub">
              {authFormTranslations("signupDescription")}
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
                  {authFormTranslations("signupEmailContinueMessage")}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  {authFormTranslations("signup.fullNameLabel")}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder={authFormTranslations(
                      "signup.fullNamePlaceholder"
                    )}
                    className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground focus-ring"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-foreground">
                  {authFormTranslations("signup.emailLabel")}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder={authFormTranslations(
                      "signup.emailPlaceholder"
                    )}
                    className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground focus-ring"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-foreground">
                  {authFormTranslations("signup.passwordLabel")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder={authFormTranslations(
                      "signup.passwordPlaceholder"
                    )}
                    className="pl-10 pr-10 bg-input border-border text-foreground placeholder:text-muted-foreground focus-ring"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-foreground">
                  {authFormTranslations("signup.confirmPasswordLabel")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={authFormTranslations(
                      "signup.confirmPasswordPlaceholder"
                    )}
                    className="pl-10 pr-10 bg-input border-border text-foreground placeholder:text-muted-foreground focus-ring"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="terms"
                  type="checkbox"
                  className="rounded border-border text-primary-accent focus:ring-primary-accent"
                />
                <Label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground"
                >
                  {authFormTranslations("signup.iAgreeToThe")}{" "}
                  <Link
                    href=""
                    className="text-primary-accent hover:text-primary transition-colors"
                  >
                    {authFormTranslations("signup.termsOfService")}
                  </Link>{" "}
                  {authFormTranslations("signup.and")}{" "}
                  <Link
                    href=""
                    className="text-primary-accent hover:text-primary transition-colors"
                  >
                    {authFormTranslations("signup.privacyPolicy")}
                  </Link>
                </Label>
              </div>

              <Button className="w-full bg-primary hover:bg-primary-accent text-primary-foreground">
                {authFormTranslations("signup.signUpButtonText")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

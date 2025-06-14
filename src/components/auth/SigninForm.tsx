"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

export function SigninForm({
  showPassword,
  setShowPassword,
}: {
  showPassword: boolean;
  setShowPassword: (showPassword: boolean) => void;
}) {
  const authFormTranslations = useTranslations("landingPage.auth");

  return (
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
            placeholder={authFormTranslations("signin.emailPlaceholder")}
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
            placeholder={authFormTranslations("signin.passwordPlaceholder")}
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
          <Label htmlFor="remember" className="text-sm text-muted-foreground">
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
  );
}

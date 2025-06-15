"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SigninFormData, signinSchema } from "@/lib/schemas/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useSigninWithPassword } from "@/hooks/usePasswordAuth";
import { useToast } from "@/hooks/useToast";
import { useIsMobile } from "@/hooks/useIsMobile";
import Spinner from "../Spinner";

export function SigninForm({
  showPassword,
  setShowPassword,
  onSuccess,
}: {
  showPassword: boolean;
  setShowPassword: (showPassword: boolean) => void;
  onSuccess: () => void;
}) {
  const authFormTranslations = useTranslations("landingPage.auth");
  const toast = useToast();
  const isMobile = useIsMobile();
  const {
    mutate: signinWithPassword,
    isPending,
    isSuccess,
  } = useSigninWithPassword();
  const form = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SigninFormData) => {
    signinWithPassword(data, {
      onError: (error) => {
        toast.error("Invalid credentials!", {
          description: "Please try again.",
          position: isMobile ? "top-center" : "bottom-right",
          duration: 3000,
        });
      },
      onSuccess: () => {
        onSuccess();
      },
    });
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    {authFormTranslations("signin.emailLabel")}
                  </FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        placeholder={authFormTranslations(
                          "signin.emailPlaceholder"
                        )}
                        className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground focus-ring"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    {authFormTranslations("signin.passwordLabel")}
                  </FormLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={authFormTranslations(
                          "signin.passwordPlaceholder"
                        )}
                        className="pl-10 pr-10 bg-input border-border text-foreground placeholder:text-muted-foreground focus-ring"
                        {...field}
                      />
                    </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />
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

          <Button
            className="w-full bg-primary hover:bg-primary-accent text-primary-foreground"
            type="submit"
            disabled={isPending || isSuccess}
          >
            {isPending || isSuccess ? (
              <Spinner centerAligned classValues={["h-4 w-4"]} />
            ) : (
              authFormTranslations("signin.signInButtonText")
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

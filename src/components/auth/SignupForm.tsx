"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "@/lib/i18n/navigation";
import { signupSchema, type SignupFormData } from "@/lib/schemas/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import Spinner from "../Spinner";

export function SignupForm({
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
}: {
  showPassword: boolean;
  setShowPassword: (showPassword: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (showConfirmPassword: boolean) => void;
}) {
  const authFormTranslations = useTranslations("landingPage.auth");

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });
  const termsChecked = form.watch("terms");

  const onSubmit = async (data: SignupFormData) => {
    console.log(data);
    // We'll implement the actual submission later
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-foreground mb-0">
                    {authFormTranslations("signup.fullNameLabel")}
                  </FormLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        placeholder={authFormTranslations(
                          "signup.fullNamePlaceholder"
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
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-foreground mb-0">
                    {authFormTranslations("signup.emailLabel")}
                  </FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={authFormTranslations(
                          "signup.emailPlaceholder"
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
                <FormItem className="space-y-2">
                  <FormLabel className="text-foreground mb-0">
                    {authFormTranslations("signup.passwordLabel")}
                  </FormLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={authFormTranslations(
                          "signup.passwordPlaceholder"
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

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-foreground mb-0">
                    {authFormTranslations("signup.confirmPasswordLabel")}
                  </FormLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={authFormTranslations(
                          "signup.confirmPasswordPlaceholder"
                        )}
                        className="pl-10 pr-10 bg-input border-border text-foreground placeholder:text-muted-foreground focus-ring"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
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

          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      id="terms"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-0.5 rounded border-border text-primary-accent focus:ring-primary-accent"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm text-muted-foreground">
                      {authFormTranslations("signup.iAgreeToThe")}{" "}
                      <Link
                        href="/terms"
                        className="text-primary-accent hover:text-primary transition-colors"
                      >
                        {authFormTranslations("signup.termsOfService")}
                      </Link>{" "}
                      {authFormTranslations("signup.and")}{" "}
                      <Link
                        href="/privacy"
                        className="text-primary-accent hover:text-primary transition-colors"
                      >
                        {authFormTranslations("signup.privacyPolicy")}
                      </Link>
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary-accent text-primary-foreground"
            disabled={!termsChecked || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Spinner centerAligned classValues={["h-4 w-4"]} />
                {authFormTranslations("signup.signUpButtonText")}
              </>
            ) : (
              authFormTranslations("signup.signUpButtonText")
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

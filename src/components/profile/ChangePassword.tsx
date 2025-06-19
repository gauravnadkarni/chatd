import { createClientForBrowser } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/lib/i18n/navigation";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle, Eye, EyeOff, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { PasswordFormData, passwordSchema } from "@/lib/schemas/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import Spinner from "../Spinner";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useToast } from "@/hooks/useToast";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useChangePassword } from "@/hooks/usePasswordAuth";
import { SignInProviders } from "@/lib/types/ThirdPartyAuthProviders";
import { User } from "@supabase/supabase-js";

export default function ChangePassword({
  userFromAuth,
  isSocialLogin,
  loginMethod,
  onPasswordResetSuccessCallback,
}: {
  userFromAuth: User;
  isSocialLogin: boolean;
  loginMethod: SignInProviders | null;
  onPasswordResetSuccessCallback: () => void;
}) {
  //const t = useTranslations("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    mutateAsync: changePassword,
    isPending,
    isSuccess,
  } = useChangePassword();
  const toast = useToast();
  const isMobile = useIsMobile();

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: PasswordFormData) => {
    console.log(data, "submitted data");
    changePassword(data, {
      onSuccess: () => {
        toast.success("Password changed successfully", {
          description:
            "Password changed successfully. You will be redirected to login page in 3 seconds",
          position: isMobile ? "top-center" : "bottom-right",
          duration: 3000,
        });
        setTimeout(() => {
          onPasswordResetSuccessCallback();
        }, 3000);
      },
      onError: () => {
        toast.error("Please try again.", {
          position: isMobile ? "top-center" : "bottom-right",
          duration: 3000,
        });
      },
    });
  };

  if (isSocialLogin) {
    return (
      <Alert className="border-blue-200 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          You signed in using {loginMethod}. Password changes must be made
          through your {loginMethod} account settings.
        </AlertDescription>
      </Alert>
    );
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...field}
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    className="pl-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...field}
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="pl-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...field}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="pl-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-xs text-muted-foreground space-y-1 bg-muted/50 p-3 rounded-md">
          <p className="font-medium">Password requirements:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>At least 8 characters long</li>
            <li>Contains uppercase and lowercase letters</li>
            <li>Contains at least one number</li>
          </ul>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting || isPending || isSuccess}
        >
          {form.formState.isSubmitting || isPending ? (
            <Spinner classValues="mr-2 h-4 w-4" />
          ) : null}
          Update Password
        </Button>
      </form>
    </Form>
  );
}

"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useRef, ChangeEvent, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/useToast";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  ClientProfileFormData,
  clientProfileSchema,
} from "@/lib/schemas/profile-schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { ProfileModel } from "@/lib/types/profile";
import {
  useGetProfile,
  useProfileImage,
  useUpdateProfile,
} from "@/hooks/useProfile";
import useUserStore from "@/lib/store/useUserStore";
import Spinner from "../Spinner";

interface ProfileInfoProps {
  initialData: ProfileModel;
}

export function ProfileInfo({ initialData }: ProfileInfoProps) {
  const profileTabTranslations = useTranslations("profile.profileTab");
  const toast = useToast();
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: updateProfile, isPending: isUpdatePending } =
    useUpdateProfile(initialData.id);
  const { mutateAsync: getProfile } = useGetProfile(initialData.id);
  const {
    data: profileImagedata,
    isPending: profileImagePending,
    isFetching: profileImageFetching,
    isLoading: profileImageLoading,
    error: profileImageError,
  } = useProfileImage(initialData.avatar_file_name);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    profileImagedata?.url || null
  );
  const { setUserFromDb } = useUserStore((state) => state);

  const form = useForm<ClientProfileFormData>({
    resolver: zodResolver(clientProfileSchema),
    defaultValues: {
      name: initialData.full_name || "",
      avatar: undefined,
    },
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (profileImagedata?.url && !avatarPreview) {
      setAvatarPreview(profileImagedata.url);
    }
  }, [profileImagedata, avatarPreview, setAvatarPreview]);

  useEffect(() => {
    console.log("avatar", form.watch("avatar"));
    const currentFiles = form.watch("avatar");
    const file =
      currentFiles && currentFiles.length > 0 ? currentFiles[0] : null;

    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
      return () => {
        URL.revokeObjectURL(url);
        setAvatarPreview(null);
      };
    } else {
      setAvatarPreview(null);
    }
  }, [form.watch("avatar")]);

  const handleSubmit: SubmitHandler<ClientProfileFormData> = async (
    data: ClientProfileFormData
  ) => {
    const formData = new FormData();
    if (data.avatar && data.avatar.length > 0) {
      formData.append("avatar", data.avatar[0]);
    }

    Object.entries(data).forEach(([key, value]) => {
      if (key !== "avatar" && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((val) => formData.append(key, val));
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    await updateProfile(formData, {
      onSuccess: async () => {
        await getProfile(undefined, {
          onSuccess: (user) => {
            setUserFromDb(user);
          },
        });
        toast.success(
          profileTabTranslations("profileUpdateSuccessToastTitle"),
          {
            description: profileTabTranslations(
              "profileUpdateSuccessToastDescription"
            ),
            position: isMobile ? "top-center" : "bottom-right",
          }
        );
      },
      onError: (error) => {
        toast.error(profileTabTranslations("profileUpdateErrorToastTitle"), {
          description: profileTabTranslations(
            "profileUpdateErrorToastDescription"
          ),
          position: isMobile ? "top-center" : "bottom-right",
        });
      },
    });
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="avatar"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>
                  {profileTabTranslations("formLabelAvatar")}
                </FormLabel>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 relative border border-full border-primary">
                      {(profileImageFetching || profileImageLoading) && (
                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center w-full h-full bg-primary/70">
                          <Spinner classValues="h-4 w-4" centerAligned />
                        </div>
                      )}
                      <AvatarImage
                        src={avatarPreview || undefined}
                        alt={profileTabTranslations("formLabelAvatarAltText")}
                      />
                      <AvatarFallback className="bg-primary/10 text-2xl">
                        {initialData?.full_name
                          ? initialData?.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : ""}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      type="button"
                      onClick={handleAvatarClick}
                      className="absolute -right-2 -bottom-2 bg-primary text-primary-foreground p-2 rounded-full shadow-md hover:bg-primary/90 transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        {...field}
                        ref={fileInputRef}
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files) {
                            onChange(files);
                          }
                        }}
                        className="hidden"
                      />
                    </FormControl>
                    <FormDescription>
                      {profileTabTranslations("formLabelAvatarDescription")}
                    </FormDescription>
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{profileTabTranslations("formLabelName")}</FormLabel>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input
                      placeholder={profileTabTranslations(
                        "formControlNamePlaceholder"
                      )}
                      className="pl-10"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              {profileTabTranslations("formLabelEmail")}
            </label>
            <div className="relative">
              <Input
                type="email"
                value={initialData!.email!}
                disabled
                className="bg-muted/50 text-muted-foreground cursor-not-allowed"
                placeholder={profileTabTranslations(
                  "formLabelEmailPlaceholder"
                )}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {profileTabTranslations("formLabelEmailLockedMessage")}
            </p>
          </div>

          <Button
            type="submit"
            className="w-full mt-6"
            disabled={!form.formState.isDirty || isUpdatePending}
          >
            {form.formState.isSubmitting || isUpdatePending ? (
              <Spinner classValues="mr-2 h-4 w-4" />
            ) : null}
            {profileTabTranslations("formUpdateButtonText")}
          </Button>
        </form>
      </Form>
    </div>
  );
}

"use server";

import {
  changeUserPassword,
  getUserById,
  updateProfile,
} from "@/lib/services/user";
import { PasswordFormData, passwordSchema } from "../schemas/auth-schema";
import { ValidationError } from "../errors/validation-error";
import { serverActionWrapper } from "../server-action-wrapper";
import { serverProfileSchema } from "../schemas/profile-schema";
import { getTemporaryFileName, uploadFileToServer } from "../helpers";
import { ProfileModel } from "../models/profile";

const SUPABASE_USER_STORAGE_BUCKET_NAME =
  process.env.SUPABASE_USER_STORAGE_BUCKET_NAME;
const SUPABASE_USER_PIC_FOLDER_NAME = process.env.SUPABASE_USER_PIC_FOLDER_NAME;

export const changePassword = async (passwordData: PasswordFormData) => {
  const serverAction = async () => {
    const currentPassword = passwordData.currentPassword;
    const newPassword = passwordData.newPassword;
    const confirmPassword = passwordData.confirmPassword;
    const validationResult = passwordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });
    if (!validationResult.success) {
      throw new ValidationError(
        "Validation Error",
        400,
        validationResult.error.flatten()
      );
    }
    const data = await changeUserPassword(currentPassword, newPassword);
    return data;
  };

  return serverActionWrapper(serverAction);
};

export const getUserProfile = async (userId: string) => {
  const serverAction = async () => {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const user = await getUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  };

  return serverActionWrapper(serverAction);
};

export const updateUserProfile = async (
  userid: string,
  profileData: FormData
) => {
  const serverAction = async () => {
    if (!userid) {
      throw new Error("User ID is required");
    }

    const name = profileData.get("name") as string;
    const avatar = profileData.get("avatar") as File | null;

    const rawData = {
      name,
      avatar,
    };

    const validationdata = serverProfileSchema.safeParse(rawData);
    if (!validationdata.success) {
      throw new ValidationError(
        "Validation Error",
        400,
        validationdata.error.flatten()
      );
    }
    const dataToBePersisted: Partial<ProfileModel> = {
      full_name: validationdata.data.name,
    };
    if (validationdata.data.avatar) {
      const tempFileName = getTemporaryFileName(
        validationdata.data.avatar.name
      );
      const avatarUrl = await uploadFileToServer(
        SUPABASE_USER_STORAGE_BUCKET_NAME!,
        validationdata.data.avatar,
        SUPABASE_USER_PIC_FOLDER_NAME!,
        tempFileName
      );
      dataToBePersisted.avatar_url = tempFileName;
    }

    await updateProfile(userid, dataToBePersisted);
    return {
      ...dataToBePersisted,
    };
  };

  return serverActionWrapper(serverAction);
};

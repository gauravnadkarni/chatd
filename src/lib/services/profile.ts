import { ServiceError } from "../errors/service-error";
import { createUser, getById, searchProfiles } from "../repositories/profiles";
import { ProfileModel, SearchProfilesOptions } from "../types/profile";
import { createClientForServer } from "../supabase-server";
import { AppError } from "../errors/app-error";

export const setupNewProfile = async (
  authUserId: string,
  email: string,
  fullName: string
): Promise<ProfileModel | null> => {
  let user = await getUserById(authUserId);
  if (!user) {
    try {
      user = await createUser(authUserId, email, fullName);
      //const emailContent = await getNewUserEmailAsString(email);
      //Todo - send welcome email to the new user
    } catch (err: unknown) {
      console.log(err);
      throw new ServiceError("Failed to send welcome email");
    }
  }
  return user;
};

export const getUserById = async (userId: string) => getById(userId);

export const changeUserPassword = async (
  currentPassword: string,
  newPassword: string
) => {
  const supabase = await createClientForServer();

  try {
    // First, reauthenticate the user with their current password
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user?.email || "",
        password: currentPassword,
      });

    if (signInError) {
      throw new ServiceError("Current password is incorrect");
    }

    // Update the password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      throw new ServiceError("Failed to update password. Please try again.");
    }

    return { success: true };
  } catch (error) {
    console.error("Error changing password:", error);
    if (error instanceof ServiceError) {
      throw error;
    }
    throw new ServiceError(
      "An unexpected error occurred while changing your password"
    );
  }
};

export const updateProfile = async (
  userid: string,
  profileData: Partial<ProfileModel>
) => {
  const supabase = await createClientForServer();

  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("id", userid);

    if (error) {
      throw new ServiceError("Failed to update profile");
    }

    return data;
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error instanceof ServiceError) {
      throw error;
    }
    throw new ServiceError(
      "An unexpected error occurred while updating your profile"
    );
  }
};

export const searchProfilesWhichContains = async ({
  query,
  limit = 10,
  orderBy = "asc",
  excludeIds = [],
}: SearchProfilesOptions) => {
  try {
    const profiles = await searchProfiles({
      query,
      limit,
      orderBy,
      excludeIds,
      searchMode: "contains",
    });

    return profiles;
  } catch (error) {
    console.error("Error searching profiles (contains):", error);
    throw new AppError(
      "Failed to search profiles (contains). Please try again later.",
      500,
      error
    );
  }
};

export const searchProfilesWhichStartsWith = async ({
  query,
  limit = 10,
  orderBy = "asc",
  excludeIds = [],
}: SearchProfilesOptions) => {
  try {
    const profiles = await searchProfiles({
      query,
      limit,
      orderBy,
      excludeIds,
      searchMode: "startsWith",
    });

    return profiles;
  } catch (error) {
    console.error("Error searching profiles (startsWith):", error);
    throw new AppError(
      "Failed to search profiles (startsWith). Please try again later.",
      500,
      error
    );
  }
};

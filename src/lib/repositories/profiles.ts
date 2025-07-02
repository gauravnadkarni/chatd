import prisma from "@/lib/prisma";
import { ProfileModel, SearchProfilesOptions } from "../types/profile";

export const createUser = async (
  userId: string,
  email: string,
  fullName: string,
  is_admin: boolean = false,
  avatarUrl?: string,
  website?: string
): Promise<ProfileModel> => {
  return prisma.profile.create({
    data: {
      id: userId,
      email,
      full_name: fullName,
      is_admin,
      avatar_file_name: avatarUrl,
      website,
    },
  });
};

export const getById = async (id: string): Promise<ProfileModel | null> => {
  return prisma.profile.findUnique({
    where: { id },
  });
};

export const getUserByEmail = async (
  email: string
): Promise<ProfileModel | null> => {
  return prisma.profile.findUnique({
    where: { email },
  });
};

export const update = async (
  id: string,
  profileData: Partial<ProfileModel>
): Promise<ProfileModel> =>
  prisma.profile.update({
    where: { id },
    data: profileData,
  });

export const searchProfiles = async ({
  query,
  limit = 10,
  orderBy = "asc",
  excludeIds = [],
  searchMode = "contains",
}: SearchProfilesOptions): Promise<ProfileModel[]> => {
  return prisma.profile.findMany({
    where: {
      full_name:
        searchMode === "contains"
          ? {
              contains: query,
              mode: "insensitive",
            }
          : {
              startsWith: query,
              mode: "insensitive",
            },
      id: {
        notIn: excludeIds,
      },
    },
    take: limit,
    orderBy: {
      full_name: orderBy,
    },
  });
};

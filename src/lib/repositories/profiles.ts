import prisma from "@/lib/prisma";
import { ProfileModel } from "../models/profile";

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
      avatar_url: avatarUrl,
      website,
    },
  });
};

export const getById = async (id: string): Promise<ProfileModel | null> => {
  return prisma.profile.findUnique({
    where: { id },
  });
};

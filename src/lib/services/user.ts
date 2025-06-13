import { ServiceError } from "../errors/service-error";
import { createUser, getById } from "../repositories/profiles";
import { ProfileModel } from "../models/profile";

export const setupNewUser = async (
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

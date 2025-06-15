"use server";

import { cookies } from "next/headers";
import { serverActionWrapper } from "../server-action-wrapper";
import { Auth } from "../services/auth";
import { ThirdPartyAuthProviders } from "../types/ThirdPartyAuthProviders";
import { SignupFormData, signupSchema } from "../schemas/auth-schema";
import { ValidationError } from "../errors/validation-error";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;

export const authWithProvider = async (provider: ThirdPartyAuthProviders) => {
  const serverAction = async () => {
    const auth = new Auth(await cookies());
    const data = await auth.initiateAuthWithThirdPartyProvider(
      provider,
      `${baseUrl}/auth/callback`
    );
    return data;
  };
  return serverActionWrapper(serverAction);
};

export const validateAuthWithProvider = async (authCode: string) => {
  const serverAction = async () => {
    const auth = new Auth(await cookies());
    const data = await auth.validateAuthCodeWithProvider(authCode);
    return data;
  };

  return serverActionWrapper(serverAction);
};

export const signup = async (signupData: SignupFormData) => {
  const serverAction = async () => {
    const email = signupData.email;
    const password = signupData.password;
    const name = signupData.name;
    const terms = signupData.terms;
    const confirmPassword = signupData.confirmPassword;
    console.log("reached here");
    const validationResult = signupSchema.safeParse({
      email,
      password,
      name,
      terms,
      confirmPassword,
    });
    console.log("validationResult", validationResult.error, signupData);
    if (!validationResult.success) {
      throw new ValidationError(
        "Validation Error",
        400,
        validationResult.error.flatten()
      );
    }
    console.log("reached here 1");
    const auth = new Auth(await cookies());
    const data = await auth.signupWithPassword(email, password, name);
    console.log("reached here 2", data);
    return data;
  };

  return serverActionWrapper(serverAction);
};

"use server";

import { ValidationError } from "../errors/validation-error";
import {
  SigninFormData,
  signinSchema,
  SignupFormData,
  signupSchema,
} from "../schemas/auth-schema";
import { serverActionWrapperWithoutAuthCheck } from "../server-action-wrapper";
import {
  initiateAuthWithThirdPartyProvider,
  signinWithPassword,
  signupWithPassword,
  validateAuthCodeWithProvider,
} from "../services/auth";
import { ThirdPartyAuthProviders } from "../types/ThirdPartyAuthProviders";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;

export const authWithProvider = async (provider: ThirdPartyAuthProviders) => {
  const serverAction = async () => {
    const data = await initiateAuthWithThirdPartyProvider(
      provider,
      `${baseUrl}/auth/callback`
    );
    return data;
  };
  return serverActionWrapperWithoutAuthCheck(serverAction);
};

export const validateAuthWithProvider = async (authCode: string) => {
  const serverAction = async () => {
    const data = await validateAuthCodeWithProvider(authCode);
    return data;
  };

  return serverActionWrapperWithoutAuthCheck(serverAction);
};

export const signup = async (signupData: SignupFormData) => {
  const serverAction = async () => {
    const email = signupData.email;
    const password = signupData.password;
    const name = signupData.name;
    const terms = signupData.terms;
    const confirmPassword = signupData.confirmPassword;
    const validationResult = signupSchema.safeParse({
      email,
      password,
      name,
      terms,
      confirmPassword,
    });
    if (!validationResult.success) {
      throw new ValidationError(
        "Validation Error",
        400,
        validationResult.error.flatten()
      );
    }
    const data = await signupWithPassword(email, password, name);
    return data;
  };

  return serverActionWrapperWithoutAuthCheck(serverAction);
};

export const signin = async (signinData: SigninFormData) => {
  const serverAction = async () => {
    const email = signinData.email;
    const password = signinData.password;
    const validationResult = signinSchema.safeParse({
      email,
      password,
    });
    if (!validationResult.success) {
      throw new ValidationError(
        "Validation Error",
        400,
        validationResult.error.flatten()
      );
    }
    const data = await signinWithPassword(email, password);
    return data;
  };

  return serverActionWrapperWithoutAuthCheck(serverAction);
};

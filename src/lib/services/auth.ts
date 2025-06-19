import { AuthError } from "../errors/auth-error";
import { ValidationError } from "../errors/validation-error";
import { getUserByEmail } from "../repositories/profiles";
import { createClientForServer } from "../supabase-server";
import { ThirdPartyAuthProviders } from "../types/ThirdPartyAuthProviders";

export const initiateAuthWithThirdPartyProvider = async (
  provider: ThirdPartyAuthProviders,
  authCallback: string
) => {
  const supabase = await createClientForServer();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: authCallback,
    },
  });
  if (error) {
    throw new AuthError(error.message);
  }
  return data;
};

export const validateAuthCodeWithProvider = async (authCode: string) => {
  const supabase = await createClientForServer();
  const { data, error } = await supabase.auth.exchangeCodeForSession(authCode);
  if (error) {
    throw new AuthError(error.message);
  }
  return data;
};

export const getAuthUser = async () => {
  const supabase = await createClientForServer();
  const {
    data: { user: userFromSession },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new AuthError(error.message, error);
  }
  return userFromSession!;
};

export const signupWithPassword = async (
  email: string,
  password: string,
  fullName: string
) => {
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new ValidationError("User already exists");
  }
  const supabase = await createClientForServer();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
      },
    },
  });
  if (error) {
    throw new AuthError(error.message);
  }
  return data;
};

export const signinWithPassword = async (email: string, password: string) => {
  const supabase = await createClientForServer();
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    console.log(error);
    throw new AuthError("User doesn't exist");
  }
  return data;
};

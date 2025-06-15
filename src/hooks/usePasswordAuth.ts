import { signin, signup } from "@/lib/actions/auth";
import { AppError } from "@/lib/errors/app-error";
import { SigninFormData, SignupFormData } from "@/lib/schemas/auth-schema";
import { useMutation } from "@tanstack/react-query";

export const useSignupWithPassword = () => {
  return useMutation({
    mutationFn: async (signupData: SignupFormData) => {
      const response = await signup(signupData);
      if ("error" in response) {
        throw new AppError(response.error, response.code);
      }
      return response.data;
    },
  });
};

export const useSigninWithPassword = () => {
  return useMutation({
    mutationFn: async (signinData: SigninFormData) => {
      const response = await signin(signinData);
      if ("error" in response) {
        throw new AppError(response.error, response.code);
      }
      return response.data;
    },
  });
};

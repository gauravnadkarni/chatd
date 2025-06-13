import { useMutation } from "@tanstack/react-query";
import { authWithProvider } from "@/lib/actions/auth";
import { ThirdPartyAuthProviders } from "@/lib/types/ThirdPartyAuthProviders";
import { AppError } from "@/lib/errors/app-error";

export const useGetRedirectUrl = () => {
  return useMutation({
    mutationFn: async (provider: ThirdPartyAuthProviders) => {
      const response = await authWithProvider(provider);
      if ("error" in response) {
        throw new AppError(response.error, response.code);
      }
      return response.data;
    },
  });
};

import { getUserProfile, updateUserProfile } from "@/lib/actions/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetProfile = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await getUserProfile(userId);
      if ("error" in response) {
        throw new Error("Unable to get profile");
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);
    },
  });
};

export const useUpdateProfile = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await updateUserProfile(userId, formData);
      console.log(response);
      if ("error" in response) {
        throw new Error("Unable to update profile");
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);
    },
  });
};

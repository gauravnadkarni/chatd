import { getUserProfile, updateUserProfile } from "@/lib/actions/user";
import useUserStore from "@/lib/store/useUserStore";
import { createClientForBrowser } from "@/lib/supabase-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const SUPABASE_USER_STORAGE_BUCKET_NAME =
  process.env.NEXT_PUBLIC_SUPABASE_USER_STORAGE_BUCKET_NAME!;
const SUPABASE_USER_PIC_FOLDER_NAME =
  process.env.NEXT_PUBLIC_SUPABASE_USER_PIC_FOLDER_NAME!;

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

interface ProfileImageData {
  url: string;
  expiresAt: Date;
}

export const useProfileImage = (avatarPath: string | null | undefined) => {
  return useQuery<ProfileImageData | null, Error>({
    queryKey: ["profileImage", avatarPath], // This will automatically refetch when avatarPath changes
    queryFn: async ({ queryKey }) => {
      const [, currentAvatarPath] = queryKey as [
        string,
        string | null | undefined,
      ];

      if (!currentAvatarPath) {
        return null;
      }

      const fullPath = `${SUPABASE_USER_PIC_FOLDER_NAME}/${currentAvatarPath}`;
      const supabase = createClientForBrowser();
      console.log(fullPath, "full path");
      const { data, error } = await supabase.storage
        .from(SUPABASE_USER_STORAGE_BUCKET_NAME)
        .createSignedUrl(fullPath, 3600); // 1 hour expiration

      if (error) {
        console.error("Error fetching signed URL:", error);
        throw error;
      }

      return {
        url: data.signedUrl,
        expiresAt: new Date(Date.now() + 3600 * 1000 - 60000), // 1 minute before actual expiration
      };
    },
    enabled: !!avatarPath, // Only run when we have an avatar path
    staleTime: 1000 * 60 * 55, // 55 minutes - mark as stale before it expires
    refetchInterval: (data) => {
      if (!data || !data.state.data || !data.state.data.expiresAt) return false;
      return new Date(data.state.data.expiresAt).getTime() - Date.now() <
        5 * 60 * 1000
        ? 1000 * 60 // Check every minute when close to expiration
        : false;
    },
  });
};

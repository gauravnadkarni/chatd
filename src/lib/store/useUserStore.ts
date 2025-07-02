import { create } from "zustand";
import { User } from "@supabase/supabase-js";
import { ProfileModel } from "@/lib/types/profile";

type UserState = {
  userFromAuth: User | null;
  userFromDb: ProfileModel | null;
  isUserLoggingOut: boolean;
  signedProfileImage: {
    path: string;
    url: string;
    expiresAt: Date;
    isExpired: boolean;
  } | null;
};

type UserActions = {
  setUserFromAuth: (user: User | null) => void;
  setUserFromDb: (user: ProfileModel | null) => void;
  setUserLoggingOut: (userLoggingOut: boolean) => void;
  setSignedProfileImage: (
    signedProfileImage: UserState["signedProfileImage"]
  ) => void;
};

const initialState: UserState = {
  userFromAuth: null,
  userFromDb: null,
  isUserLoggingOut: false,
  signedProfileImage: null,
};

const useUserStore = create<UserState & UserActions>((set) => ({
  ...initialState,
  setUserFromAuth: (user: User | null) => set({ userFromAuth: user }),
  setUserFromDb: (user: ProfileModel | null) => set({ userFromDb: user }),
  setUserLoggingOut: (isUserLoggingOut: boolean) => set({ isUserLoggingOut }),
  setSignedProfileImage: (
    signedProfileImage: UserState["signedProfileImage"]
  ) => set({ signedProfileImage }),
}));

export default useUserStore;

import { create } from "zustand";
import { User } from "@supabase/supabase-js";
import { ProfileModel } from "@/lib/models/profile";

type UserState = {
  userFromAuth: User | null;
  userFromDb: ProfileModel | null;
  isUserLoggingOut: boolean;
};

type UserActions = {
  setUserFromAuth: (user: User | null) => void;
  setUserFromDb: (user: ProfileModel | null) => void;
  setUserLoggingOut: (userLoggingOut: boolean) => void;
};

const initialState: UserState = {
  userFromAuth: null,
  userFromDb: null,
  isUserLoggingOut: false,
};

const useUserStore = create<UserState & UserActions>((set) => ({
  ...initialState,
  setUserFromAuth: (user: User | null) => set({ userFromAuth: user }),
  setUserFromDb: (user: ProfileModel | null) => set({ userFromDb: user }),
  setUserLoggingOut: (isUserLoggingOut: boolean) => set({ isUserLoggingOut }),
}));

export default useUserStore;

import { create } from "zustand";
import { User } from "@supabase/supabase-js";

type UserState = {
  user: User | null;
};

type UserActions = {
  setUser: (user: User | null) => void;
};

const initialState: UserState = {
  user: null,
};

const useUserStore = create<UserState & UserActions>((set) => ({
  ...initialState,
  setUser: (user: User | null) => set({ user }),
}));

export default useUserStore;

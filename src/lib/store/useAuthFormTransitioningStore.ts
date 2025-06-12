import { create } from "zustand";

type AuthFormTransitioningState = {
  activeForm: "signin" | "signup";
  isTransitioning: boolean;
};

type AuthFormTransitioningActions = {
  setActiveForm: (form: "signin" | "signup") => void;
  setIsTransitioning: (transitioning: boolean) => void;
};

const initialState: AuthFormTransitioningState = {
  activeForm: "signin",
  isTransitioning: false,
};

const useAuthFormTransitioningStore = create<
  AuthFormTransitioningState & AuthFormTransitioningActions
>((set, get) => ({
  ...initialState,
  setActiveForm: (form: "signin" | "signup") => set({ activeForm: form }),
  setIsTransitioning: (transitioning: boolean) =>
    set({ isTransitioning: transitioning }),
  reset: () => set({ ...initialState }),
}));

export default useAuthFormTransitioningStore;

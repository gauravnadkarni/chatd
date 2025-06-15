import { create } from "zustand";

type AuthFormTransitioningState = {
  activeForm: "signin" | "signup" | "loading";
  isTransitioning: boolean;
};

type AuthFormTransitioningActions = {
  setActiveForm: (form: "signin" | "signup" | "loading") => void;
  setIsTransitioning: (transitioning: boolean) => void;
};

const initialState: AuthFormTransitioningState = {
  activeForm: "loading",
  isTransitioning: false,
};

const useAuthFormTransitioningStore = create<
  AuthFormTransitioningState & AuthFormTransitioningActions
>((set) => ({
  ...initialState,
  setActiveForm: (form: "signin" | "signup" | "loading") =>
    set({ activeForm: form }),
  setIsTransitioning: (transitioning: boolean) =>
    set({ isTransitioning: transitioning }),
  reset: () => set({ ...initialState }),
}));

export default useAuthFormTransitioningStore;

// store/authStore.ts
import { create } from "zustand";
import { UserInfo } from "../types/userInfo";

interface AuthState {
  token: string | null;
  userInfo: UserInfo | null;
  setToken: (token: string) => void;
  setUserInfo: (userInfo: UserInfo) => void;
  clearAuth: () => void;
  isTokenExpired: () => Promise<boolean>;
  isAuthenticated: boolean;
}

const useAuthStore = create<AuthState>((set, get) => {
  const token = localStorage.getItem("token") || null;
  const isAuthenticated = !!token;
  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_info");
    set({ token: null, userInfo: null, isAuthenticated: false });
  };

  return {
    token,
    userInfo: JSON.parse(localStorage.getItem("user_info") || "null") || null,
    isAuthenticated,
    setToken: (token: string) => {
      localStorage.setItem("token", token);
      set({ token });
    },
    setUserInfo: (userInfo: UserInfo) => {
      localStorage.setItem("user_info", JSON.stringify(userInfo));
      set({ userInfo });
    },
    clearAuth,
    isTokenExpired: async () => {
      const { token } = get();
      if (!token) return true; // No token means expired

      try {
        const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userInfoResponse.ok) {
          clearAuth();
          throw new Error("Token is expired or invalid");
        }

        return false; // Token is valid
      } catch (error) {
        clearAuth();
        console.error("Token error:", error);
        return true; // Token is invalid or expired
      }
    },
  };
});

export default useAuthStore;

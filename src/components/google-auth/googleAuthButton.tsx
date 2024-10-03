import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";

import { UserInfo } from "@/types/userInfo";
import { userLogin } from "@/services/api";
import useAuthStore from "@/store/authStore";

const GoogleAuthButton = () => {
  const { setToken, setUserInfo, clearAuth, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const token = response.access_token;

        // Store the token and user info in Zustand and local storage
        setToken(token);

        // Check if the token is expired
        if (isAuthenticated) {
          clearAuth();
          return;
        }

        // Fetch user information
        const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userInfoResponse.ok) {
          throw new Error("Failed to fetch user info");
        }

        const userInfoJson = await userInfoResponse.json();
        const userInfo: UserInfo = {
          googleId: userInfoJson.sub,
          email: userInfoJson.email,
          displayName: userInfoJson.given_name,
        };
        // Store user information in Zustand and local storage
        setUserInfo(userInfo);
        userLogin();
        navigate("/");
        navigate(0);
      } catch (error) {
        console.error("Error:", error);
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
  return (
    <button onClick={() => login()} className="flex flex-row hover:bg-slate-500 hover:bg-opacity-40 items-center w-full border-2 gap-3 rounded-md px-5 py-3 cursor-pointer justify-center font-semibold text-lg">
      <FcGoogle className="w-8 h-8" /> Continue with google
    </button>
  );
};

export default GoogleAuthButton;

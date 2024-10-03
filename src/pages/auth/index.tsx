import { useState } from "react";

import GoogleAuthButton from "@/components/google-auth/googleAuthButton";
import Navbar from "@/components/common/navbar";

const AuthPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <div className="h-screen bg-primary-white">
      <Navbar isHome={false} />
      <div className="flex flex-row w-screen justify-center items-center h-fit pt-32">
        <div className="flex flex-col w-fit items-center gap-10">
          <h1 className="text-3xl font-semibold">Welcome back</h1>
          <div className="flex flex-col gap-6 items-center">
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-80 bg-transparent border-2 border-gray-500 rounded-md p-3 px-5 text-lg" 
              placeholder="Email address" 
            />
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-80 bg-transparent border-2 border-gray-500 rounded-md p-3 px-5 text-lg" 
              placeholder="Password" 
            />
            <div className="flex items-center w-80 justify-center bg-button-color rounded-md px-5 py-3 cursor-pointer">Continue</div>
            <div className="flex flex-row items-center w-80">
              <hr className="flex-grow border-t border-white" />
              <span className="mx-2 text-white">or</span>
              <hr className="flex-grow border-t border-white" />
            </div>
            <GoogleAuthButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

"use client";

import {
  ArrowLeft,
  EyeIcon,
  EyeOff,
  Leaf,
  Loader2,
  Lock,
  LogIn,
  Mail,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

type PropType = {
  prevStep: (s: number) => void;
};

const RegistrationForm = ({ prevStep }: PropType) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  const router = useRouter()
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });
      
      // Auto sign-in after successful registration
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/"
      });
      
      if (signInResult?.ok) {
        router.push("/");
        router.refresh();
      } else {
        router.push("/login");
      }
    } catch (error: unknown) {
      console.log(error);
      const errorMessage = error instanceof Error ? error.message : 
        (typeof error === 'object' && error !== null && 'response' in error) 
          ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message || "Registration failed")
          : "Registration failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const formValidation =
    name.trim() !== "" && email.trim() !== "" && password.trim() !== "";

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-6 py-10 bg-white relative">
      {/* Back Button */}
      <div
        className="absolute top-6 left-6 flex items-center gap-2 text-green-700 hover:text-green-800 cursor-pointer"
        onClick={() => prevStep(1)}
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </div>

      {/* Title */}
      <motion.h1
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl text-green-600 font-extrabold mb-2"
      >
        Create Account
      </motion.h1>

      <p className="flex items-center text-gray-600 mb-8">
        Join Snapcart Today <Leaf className="w-5 h-5 text-green-600 ml-1" />
      </p>

      {/* Form */}
      <form
        className="flex flex-col gap-5 w-full max-w-sm"
        onSubmit={handleRegister}
      >
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Name */}
        <div className="relative">
          <User className="absolute w-5 h-5 top-3.5 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute w-5 h-5 top-3.5 left-3 text-gray-400" />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute w-5 h-5 top-3.5 left-3 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-10 focus:ring-2 focus:ring-green-500 outline-none"
          />

          {showPassword ? (
            <EyeOff
              className="absolute right-3 top-3.5 w-5 h-5 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <EyeIcon
              className="absolute right-3 top-3.5 w-5 h-5 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>

        {/* Register Button */}
        <button
          disabled={!formValidation || loading}
          className={`w-full font-semibold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2
    ${
      formValidation && !loading
        ? "bg-green-600 hover:bg-green-700 text-white"
        : "bg-gray-300 cursor-not-allowed"
    }`}
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            "Register"
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
          <span className="flex-1 h-px bg-gray-200"></span>
          OR
          <span className="flex-1 h-px bg-gray-200"></span>
        </div>

        {/* Google Signup */}
        <button
          type="button"
          onClick={()=>signIn("google",{callbackUrl:"/"})}
          className="w-full border border-gray-300 rounded-xl py-3 flex items-center justify-center gap-3 hover:bg-gray-100 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="font-medium text-gray-700">Sign up with Google</span>
        </button>

        {/* Sign in text */}
        <p className="flex items-center justify-center gap-1 text-center text-sm text-gray-600 mt-4">
          <span>Already have an account?</span>

          <LogIn className="h-4 w-4 text-gray-500" />

          <span className="text-green-600 font-semibold cursor-pointer hover:underline" onClick={()=> router.push("/login")}>
            Sign in here
          </span>
        </p>
      </form>
    </div>
  );
};

export default RegistrationForm;

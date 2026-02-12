"use client"

import {
  EyeIcon,
  EyeOff,
  Leaf,
  Lock,
  LogIn,
  Mail,
  Loader2
} from "lucide-react"
import React, { useState } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"


const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const session = useSession()
  console.log(session)
  const router = useRouter()

  const isValid = email.trim() !== "" && password.trim() !== ""

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
       await signIn("credentials",{
        email,password
       })
       router.push("/")
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    console.log("Google login")
    // signIn("google")
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-6 py-10 bg-white">

      {/* Title */}
      <motion.h1
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl text-green-600 font-extrabold mb-2"
      >
        Welcome Back
      </motion.h1>

      <p className="flex items-center text-gray-600 mb-8">
        Login to Snapcart <Leaf className="w-5 h-5 text-green-600 ml-1" />
      </p>

      {/* Form */}
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-5 w-full max-w-sm"
      >

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

        {/* Login Button */}
        <button
          disabled={!isValid || loading}
          className={`w-full font-semibold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2
            ${
              isValid && !loading
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-300 cursor-not-allowed"
            }`}
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
          <span className="flex-1 h-px bg-gray-200"></span>
          OR
          <span className="flex-1 h-px bg-gray-200"></span>
        </div>

        {/* Google Login */}
        <button
          type="button"
          disabled={loading}
          onClick={()=> signIn("google",{callbackUrl:"/"})}
          className="w-full border border-gray-300 rounded-xl py-3 flex items-center justify-center gap-3 hover:bg-gray-100 transition disabled:opacity-60"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="font-medium text-gray-700">
            Sign in with Google
          </span>
        </button>

        {/* Register Link */}
        <p className="flex items-center justify-center gap-1 text-sm text-gray-600 mt-4">
          <span>Don&apos;t have an account?</span>
          <LogIn className="h-4 w-4 text-gray-500" />
          <span className="text-green-600 font-semibold cursor-pointer hover:underline" onClick={()=>router.push('/register')}>
            Register here
          </span>
        </p>

      </form>
    </div>
  )
}

export default LoginPage

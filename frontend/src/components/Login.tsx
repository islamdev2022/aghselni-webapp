"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import api from "@/api"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import { Button } from "./ui/button"
import { AtSign, Lock, LogIn } from "lucide-react"
import { useParams } from "react-router-dom";

import GoogleAuthButton from "./GoogleAuthButton"
interface LoginFormData {
  email: string
  password: string
}

interface LoginResponse {
  access: string
  refresh: string
  user_type: string
}

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({})

  const navigate = useNavigate()

  const { userType } = useParams<{ userType: string }>();
console.log(userType)
  // Define the login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await api.post<LoginResponse>(`/api/auth/${userType}/login/`, data)
      return response.data
    },
    onSuccess: (data) => {
      localStorage.setItem(ACCESS_TOKEN, data.access)
      localStorage.setItem(REFRESH_TOKEN, data.refresh)
      if (data.user_type === "client") 
      {
        navigate("/")
      }else if (data.user_type === "extern_employee")
      {
        navigate("/extern_employee")
      } else if (data.user_type === "intern_employee")
      {
        navigate("/intern_employee")
      }
      else if (data.user_type === "admin")
      {
        navigate("/admin")
      }
    },
    onError: (error: any) => {
      console.error("Login error:", error.response?.data.error)
      setErrors({
        email: error.response?.data.error,
        password: error.response?.data.error,
      })
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))

    // Clear error for this field when user types
    if (errors[id as keyof LoginFormData]) {
      setErrors((prev) => ({
        ...prev,
        [id]: undefined,
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LoginFormData, string>> = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (validateForm()) {
      loginMutation.mutate(formData)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header with decorative element */}
        <div className="relative bg-gradient-to-r from-cyan-600 to-cyan-500 px-8 py-10 text-white">
          <div className="absolute -bottom-6 left-1/2 h-12 w-12 -translate-x-1/2 transform rounded-full bg-white p-2 shadow-lg">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-cyan-600">
              <LogIn className="h-5 w-5 text-white" />
            </div>
          </div>
          <h1 className="text-center text-2xl font-bold">
            Hello {userType?.toLocaleUpperCase()} <br /> Welcome back to{" "}
            <span className="font-extrabold">Aghselni</span>
          </h1>
          <p className="mt-1 text-center text-cyan-100">
            Log in to your account
          </p>
        </div>

        <div className="px-8 pt-12 pb-8">
          {loginMutation.isError && (
            <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
              <p className="flex items-center font-medium">
                <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-500">
                  !
                </span>
                Login failed. Please check your credentials and try again.
              </p>
            </div>
          )}

          <form className="space-y-5">
            <div className="relative">
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <AtSign className="h-4 w-4" />
                </div>
                <input
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  className={`w-full rounded-lg border ${
                    errors.email
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  } py-2.5 pl-10 pr-3 text-sm shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  value={formData.password}
                  onChange={handleChange}
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  className={`w-full rounded-lg border ${
                    errors.password
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  } py-2.5 pl-10 pr-3 text-sm shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-cyan-600 hover:text-cyan-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-4">
              <Button
                type="submit"
                className=" cursor-pointer w-full rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 py-2.5 text-sm font-medium text-white shadow-md transition hover:from-cyan-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-70"
                onClick={handleSubmit}
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
              {
                userType === 'client' ? <GoogleAuthButton
                className="w-full"
                redirectUrl="http://localhost:8000/api/auth/login/google-oauth2/?next=/api/token/"
                mode="in"
              /> : <></>
              }
             
              
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account yet?{" "}
              <Link
                to="/signup"
                className="font-medium text-cyan-600 transition hover:text-cyan-700"
              >
                Sign up for free!
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login


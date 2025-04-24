import type React from "react"

import { useState } from "react"
import {  Link } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import api from "../api"
import { Button } from "./ui/button"
import { AtSign, Lock, Phone, User, Calendar } from "lucide-react"
interface SignUpFormData {
  full_name: string
  email: string
  phone: string
  age: number
  password: string
}

interface SignUpResponse {
  access: string
  refresh: string
}

const SignUp = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    full_name: "",
    email: "",
    phone: "",
    age: 0,
    password: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpFormData, string>>>({})

  // Define the signup mutation
  const signupMutation = useMutation({
    mutationFn: async (data: SignUpFormData) => {
      const response = await api.post<SignUpResponse>("/api/auth/client/register/", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      return response.data
    },
    onSuccess: () => {
      formData.full_name = ""
      formData.email = ""
      formData.phone = ""
      formData.age = 0
      formData.password = ""

    },
    onError: (error: any) => {
      console.error("Registration error:", error.response?.data )
      setErrors(error.response?.data)
      // If you have specific error responses from your API, you could handle them here
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [id]: id === "age" ? (value ? Number.parseInt(value) : 0) : value,
    }))

    // Clear error for this field when user types
    if (errors[id as keyof SignUpFormData]) {
      setErrors((prev) => ({
        ...prev,
        [id]: undefined,
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SignUpFormData, string>> = {}

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    if (formData.age <= 0) {
      newErrors.age = "Please enter a valid age"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (validateForm()) {
      signupMutation.mutate(formData)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header with decorative element */}
        <div className="relative bg-gradient-to-r from-cyan-600 to-cyan-500 px-8 py-10 text-white">
          <div className="absolute -bottom-6 left-1/2 h-12 w-12 -translate-x-1/2 transform rounded-full bg-white p-2 shadow-lg">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-cyan-600">
              <User className="h-5 w-5 text-white" />
            </div>
          </div>
          <h1 className="text-center text-2xl font-bold">
            Join <span className="font-extrabold">Aghselni</span> today
          </h1>
          <p className="mt-1 text-center text-cyan-100">Create your account in seconds</p>
        </div>

        <div className="px-8 pt-12 pb-8">
          {signupMutation.isError && (
            <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
              <p className="flex items-center font-medium">
                <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-500">
                  !
                </span>
                Registration failed. Please try again. {Object.values(errors).join(", ")}
              </p>
            </div>
          )}
          {
            signupMutation.isSuccess && (
              <div className="mb-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 shadow-sm">
                <p className="flex flex-col items-center font-medium">
                  <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-500">
                    ✓
                  </span>
                  Registration successful! <span> Please Click <Link to="/login/client" className="underline font-bold"> Here </Link> to login.</span>
                </p>
              </div>
            )
          }
          <form className="space-y-5">
            <div className="relative">
              <label htmlFor="full_name" className="mb-1.5 block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  value={formData.full_name}
                  onChange={handleChange}
                  type="text"
                  id="full_name"
                  placeholder="John Doe"
                  className={`w-full rounded-lg border ${
                    errors.full_name ? "border-red-300 bg-red-50" : "border-gray-200"
                  } py-2.5 pl-10 pr-3 text-sm shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                />
              </div>
              {errors.full_name && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.full_name}</p>}
            </div>

            <div className="relative">
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
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
                    errors.email ? "border-red-300 bg-red-50" : "border-gray-200"
                  } py-2.5 pl-10 pr-3 text-sm shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.email}</p>}
            </div>

            <div className="relative">
              <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                  id="phone"
                  placeholder="+213 055-123-4567"
                  className={`w-full rounded-lg border ${
                    errors.phone ? "border-red-300 bg-red-50" : "border-gray-200"
                  } py-2.5 pl-10 pr-3 text-sm shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                />
              </div>
              {errors.phone && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.phone}</p>}
            </div>

            <div className="relative">
              <label htmlFor="age" className="mb-1.5 block text-sm font-medium text-gray-700">
                Age
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Calendar className="h-4 w-4" />
                </div>
                <input
                  value={formData.age || ""}
                  onChange={handleChange}
                  type="number"
                  id="age"
                  placeholder="25"
                  className={`w-full rounded-lg border ${
                    errors.age ? "border-red-300 bg-red-50" : "border-gray-200"
                  } py-2.5 pl-10 pr-3 text-sm shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                />
              </div>
              {errors.age && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.age}</p>}
            </div>

            <div className="relative">
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
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
                  placeholder="At least 8 characters"
                  className={`w-full rounded-lg border ${
                    errors.password ? "border-red-300 bg-red-50" : "border-gray-200"
                  } py-2.5 pl-10 pr-3 text-sm shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                />
              </div>
              {errors.password && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.password}</p>}
            </div>

            <div className="pt-2 flex flex-col">
              <Button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 py-2.5 text-sm font-medium text-white shadow-md transition hover:from-cyan-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-70"
                onClick={handleSubmit}
                disabled={signupMutation.isPending}
              >
                {signupMutation.isPending ? (
                  <span className="flex items-center justify-center">
                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
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
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
              <a href="http://localhost:8000/api/auth/login/google-oauth2/?next=/api/token/">
                <button className="w-full cursor-pointer text-black flex justify-center gap-2 items-center bg-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-zinc-300 transition-all ease-in duration-200">
                  <svg
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6"
                  >
                    <path
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                      fill="#FFC107"
                    ></path>
                    <path
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                      fill="#FF3D00"
                    ></path>
                    <path
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                      fill="#4CAF50"
                    ></path>
                    <path
                      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                      fill="#1976D2"
                    ></path>
                  </svg>
                  Sign Up with Google
                </button>
              </a>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login/client" className="font-medium text-cyan-600 transition hover:text-cyan-700">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp


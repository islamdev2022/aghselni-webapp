"use client"

import type React from "react"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Settings, User, AtSign, Lock, Eye, EyeOff, Save, Check, AlertTriangle } from "lucide-react"
import  api  from "@/api"
import AdminLayout from "@/components/layouts/AdminLayout"

interface AdminFormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  [key: string]: string
}

export default function SettingsPage() {
  const [formData, setFormData] = useState<AdminFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const createAdminMutation = useMutation({
    mutationFn: async (data: Omit<AdminFormData, "confirmPassword">) => {
      const response = await api.post("/api/auth/admin/register/", {
        full_name: data.fullName,
        email: data.email,
        password: data.password,
      })
      return response.data
    },
    onSuccess: () => {
      setSuccessMessage("Admin user created successfully!")
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      })
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    },
    onError: (error: any) => {
      console.error("Error creating admin:", error)
      if (error.response?.data) {
        setErrors(error.response.data)
      } else {
        setErrors({
          general: "An error occurred while creating the admin user.",
        })
      }
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))

    // Clear error when field is edited
    if (errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: "",
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      const { confirmPassword, ...submitData } = formData
      createAdminMutation.mutate(submitData)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Admin Settings</h1>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100">
            <Settings className="h-5 w-5 text-cyan-600" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-gray-800">Add New Admin</h2>

            {successMessage && (
              <div className="mb-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 shadow-sm">
                <p className="flex items-center font-medium">
                  <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-500">
                    <Check className="h-4 w-4" />
                  </span>
                  {successMessage}
                </p>
              </div>
            )}

            {errors.general && (
              <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
                <p className="flex items-center font-medium">
                  <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-500">
                    <AlertTriangle className="h-4 w-4" />
                  </span>
                  {errors.general}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${
                      errors.fullName ? "border-red-300 bg-red-50" : "border-gray-200"
                    } py-2.5 pl-10 pr-3 text-sm shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                    placeholder="Enter full name"
                  />
                </div>
                {errors.fullName && <p className="mt-1 text-xs font-medium text-red-500">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <AtSign className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${
                      errors.email ? "border-red-300 bg-red-50" : "border-gray-200"
                    } py-2.5 pl-10 pr-3 text-sm shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                    placeholder="admin@example.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs font-medium text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${
                      errors.password ? "border-red-300 bg-red-50" : "border-gray-200"
                    } py-2.5 pl-10 pr-10 text-sm shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs font-medium text-red-500">{errors.password}</p>}
                <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${
                      errors.confirmPassword ? "border-red-300 bg-red-50" : "border-gray-200"
                    } py-2.5 pl-10 pr-10 text-sm shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs font-medium text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={createAdminMutation.isPending}
                  className="flex w-full items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 px-4 py-2.5 text-sm font-medium text-white shadow-md transition hover:from-cyan-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-70"
                >
                  {createAdminMutation.isPending ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
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
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Create Admin
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Admin Privileges</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100">
                      <User className="h-4 w-4 text-cyan-600" />
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700">Manage Employees</span>
                  </div>
                  <div className="h-5 w-5 rounded-full bg-green-100 text-center text-green-600">✓</div>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100">
                      <User className="h-4 w-4 text-cyan-600" />
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700">Manage Clients</span>
                  </div>
                  <div className="h-5 w-5 rounded-full bg-green-100 text-center text-green-600">✓</div>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100">
                      <Settings className="h-4 w-4 text-cyan-600" />
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700">System Settings</span>
                  </div>
                  <div className="h-5 w-5 rounded-full bg-green-100 text-center text-green-600">✓</div>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                All admin users have full access to the system. Be careful when creating new admin accounts.
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 p-6 text-white shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Security Notice</h2>
              <p className="text-sm text-cyan-50">
                Admin accounts have full access to sensitive customer and business data. Only create accounts for
                trusted individuals who require administrative access.
              </p>
              <div className="mt-4 flex items-center rounded-lg bg-white/10 p-3">
                <AlertTriangle className="h-5 w-5 text-amber-300" />
                <span className="ml-2 text-sm">All admin actions are logged and monitored</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}


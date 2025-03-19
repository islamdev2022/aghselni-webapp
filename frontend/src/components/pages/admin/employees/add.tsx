"use client"

import type React from "react"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { AtSign, User, Phone,  Briefcase, Save, X } from "lucide-react"
import api from "@/api"
import AdminLayout from "@/components/layouts/AdminLayout"

interface EmployeeFormData {
  full_name: string
  email: string
  phone: string
  age: number
  type: "intern_employee" | "extern_employee"
  password: string
  confirmPassword: string
  profileImage?: File
}

interface FormErrors {
  [key: string]: string
}
export default function AddEmployeePage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<EmployeeFormData>({
    full_name: "",
    email: "",
    phone: "",
    age: 0,
    type: "intern_employee",
    password: "",
    confirmPassword: "",
    profileImage: undefined,
  })

  const [errors, setErrors] = useState<FormErrors>({})
const registerMutation = useMutation({
    mutationFn: async (data: EmployeeFormData) => {
      const endpoint =
        data.type === "intern_employee" ? "/api/auth/intern_employee/register/" : "/api/auth/extern_employee/register/"

      const response = await api.post(endpoint, {
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        age: data.age,
      })

      return response.data
    },
    onSuccess: () => {
      navigate("/admin/employees")
    },
    onError: (error: any) => {
      console.error("Registration error:", error)
      if (error.response?.data) {
        setErrors(error.response.data)
      } else {
        setErrors({
          general: "An error occurred while registering the employee.",
        })
      }
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

    if (!formData.full_name.trim()) newErrors.firstName = "Full Name is required"

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"

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
        console.log(formData)
      registerMutation.mutate(formData)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Add New Employee</h1>
          <button
            onClick={() => navigate("/admin/employees")}
            className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          {errors.general && (
            <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
              <p className="flex items-center font-medium">
                <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-500">
                  !
                </span>
                {errors.general}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    id="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${
                      errors.firstName ? "border-red-300 bg-red-50" : "border-gray-200"
                    } py-2.5 pl-10 pr-3 text-sm shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                    placeholder="John"
                  />
                </div>
                {errors.full_name && <p className="mt-1 text-xs font-medium text-red-500">{errors.full_name}</p>}
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
                    placeholder="john.smith@aghselni.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs font-medium text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${
                      errors.phone ? "border-red-300 bg-red-50" : "border-gray-200"
                    } py-2.5 pl-10 pr-3 text-sm shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                {errors.phone && <p className="mt-1 text-xs font-medium text-red-500">{errors.phone}</p>}
              </div>

              {/* <div className="space-y-2 md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${
                      errors.address ? "border-red-300 bg-red-50" : "border-gray-200"
                    } py-2.5 pl-10 pr-3 text-sm shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                    placeholder="123 Main St, City, State, ZIP"
                  />
                </div>
                {errors.address && <p className="mt-1 text-xs font-medium text-red-500">{errors.address}</p>}
              </div> */}
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <div className="relative">
                  {/* <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Phone className="h-4 w-4" />
                  </div> */}
                  <input
                    type="number"
                    min="18"
                    id="age"
                    value={formData.age}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${
                      errors.phone ? "border-red-300 bg-red-50" : "border-gray-200"
                    } py-2.5 pl-10 pr-3 text-sm shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                    placeholder="20"
                  />
                </div>
                {errors.age && <p className="mt-1 text-xs font-medium text-red-500">{errors.age}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Employee Type
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="intern_employee">Internal Employee</option>
                    <option value="extern_employee">External Employee</option>
                  </select>
                </div>
              </div>

              {/* <div className="space-y-2">
                <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700">
                  Join Date
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <input
                    type="date"
                    id="joinDate"
                    value={formData.joinDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div> */}

              <div>
                <div className="space-y-2">
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                        Profile Image
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={(e) => {
                                // Handle file upload logic here
                                // You can add state for the image and update it
                                const file = e.target.files?.[0];
                                if (file) {
                                    // You could add code here to:
                                    // 1. Preview the image
                                    // 2. Upload to server or store in form data
                                    // 3. Validate file type and size
                                }
                            }}
                            className="w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        />
                    </div>
                    {errors.image && <p className="mt-1 text-xs font-medium text-red-500">{errors.image}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full rounded-lg border ${
                    errors.password ? "border-red-300 bg-red-50" : "border-gray-200"
                  } py-2.5 px-3 text-sm shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                  placeholder="••••••••"
                />
                {errors.password && <p className="mt-1 text-xs font-medium text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full rounded-lg border ${
                    errors.confirmPassword ? "border-red-300 bg-red-50" : "border-gray-200"
                  } py-2.5 px-3 text-sm shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs font-medium text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 px-6 py-2.5 text-sm font-medium text-white shadow-md transition hover:from-cyan-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-70"
              >
                {registerMutation.isPending ? (
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
                    Processing...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Add Employee
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}


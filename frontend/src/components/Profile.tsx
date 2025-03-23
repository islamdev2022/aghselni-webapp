import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../api"
import { useQuery, useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { AtSign, User, Phone, Calendar, Camera, Save,AlertTriangle, X, Check,Trash2 } from "lucide-react"

interface ProfileFormData {
  full_name: string
  age: number
  phone: string
  photo: File | null
}

interface ProfileErrors {
  full_name?: string
  age?: string
  phone?: string
  photo?: string
  general?: string
}

const Profile = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<number | null>(null)
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: "",
    age: 0,
    phone: "",
    photo: null,
  })
  const [errors, setErrors] = useState<ProfileErrors>({})
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Get user profile data
  const {
    isLoading,
    isError,
    data: client,
  } = useQuery({
    queryKey: ["userProfile", id],
    queryFn: async () => {
      try {
        const response = await api.get(`/api/client/profile/`)
        return response.data
      } catch (error: any) {
        if (error.response && error.response.status === 403) {
          // If unauthorized, redirect to login
          navigate("/login/client")
        }
        throw error
      }
    },
  })

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.put(`/api/client/profile/`, data)
      return response.data
    },
    onSuccess: () => {
      setSuccessMessage("Profile updated successfully!")
      setIsEditing(false)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    },
    onError: (error: any) => {
      console.error("Update error:", error)
      if (error.response?.data) {
        setErrors(error.response.data)
      } else {
        setErrors({
          general: "An error occurred while updating your profile.",
        })
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (clientId: number) => {
      await api.delete(`/api/admin/client/${clientId}/`)
    },
    onSuccess: () => {
      
      setShowDeleteModal(false)
      setClientToDelete(null)
      localStorage.removeItem("clientToken")
      navigate("/login/client")
    },
  })

  const handleDeleteClick = (clientId: number) => {
    setClientToDelete(clientId)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (clientToDelete) {
      deleteMutation.mutate(clientToDelete)
    }
  }

  // Initialize form data when client data is loaded
  useEffect(() => {
    if (client) {
      setFormData({
        full_name: client.full_name || "",
        age: client.age || 0,
        phone: client.phone || "",
        photo: null,
      })

      if (client.photo) {
        setPhotoPreview(`http://127.0.0.1:8000/${client.photo}`)
      }
    }
  }, [client])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target

    if (type === "file") {
      const fileInput = e.target as HTMLInputElement
      if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0]
        setFormData((prev) => ({
          ...prev,
          photo: file,
        }))

        // Create preview URL
        const reader = new FileReader()
        reader.onloadend = () => {
          setPhotoPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number.parseInt(value) : value,
      }))
    }

    // Clear error when field is edited
    if (errors[name as keyof ProfileErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: ProfileErrors = {}

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number"
    }

    if (!formData.age || formData.age < 16 || formData.age > 120) {
      newErrors.age = "Please enter a valid age between 16 and 120"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // Create FormData object for file upload
      const submitData = new FormData()
      submitData.append("full_name", formData.full_name)
      submitData.append("age", formData.age.toString())
      submitData.append("phone", formData.phone)

      if (formData.photo) {
        submitData.append("photo", formData.photo)
      }

      updateProfileMutation.mutate(submitData)
    }
  }

  const handleCancel = () => {
    // Reset form data to original values
    if (client) {
      setFormData({
        full_name: client.full_name || "",
        age: client.age || 0,
        phone: client.phone || "",
        photo: null,
      })

      if (client.photo) {
        setPhotoPreview(`http://127.0.0.1:8000/${client.photo}`)
      } else {
        setPhotoPreview(null)
      }
    }

    setErrors({})
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-6"></div>
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error loading profile</h1>
          <p className="mb-4">We couldn't load your profile information. Please try again later.</p>
          <Button onClick={() => navigate("/")} className="bg-cyan-600 hover:bg-cyan-700">
            Return to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header with decorative element */}
        <div className="relative bg-gradient-to-r from-cyan-600 to-cyan-500 px-8 py-10 text-white">
          <div className="absolute -bottom-6 left-1/2 h-12 w-12 -translate-x-1/2 transform rounded-full bg-white p-2 shadow-lg">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-cyan-600">
              <User className="h-5 w-5 text-white" />
            </div>
          </div>
          <h1 className="text-center text-2xl font-bold">Your Profile</h1>
          <p className="mt-1 text-center text-cyan-100">Manage your personal information</p>
        </div>

        <div className="px-8 pt-12 pb-8">
          {/* Success message */}
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

          {/* Error message */}
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
            {/* Profile photo */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md">
                  {photoPreview ? (
                    <img
                      src={photoPreview || "/placeholder.svg"}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-cyan-50 text-cyan-500">
                      <User className="h-12 w-12" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label
                    htmlFor="photo-upload"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-cyan-600 flex items-center justify-center cursor-pointer shadow-md hover:bg-cyan-700 transition-colors"
                  >
                    <Camera className="h-4 w-4 text-white" />
                    <input
                      id="photo-upload"
                      type="file"
                      name="photo"
                      accept="image/*"
                      className="hidden"
                      onChange={handleChange}
                    />
                  </label>
                )}
              </div>
              {errors.photo && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.photo}</p>}
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              {/* Full Name */}
              <div className="relative">
                <label htmlFor="full_name" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full rounded-lg border ${
                      errors.full_name ? "border-red-300 bg-red-50" : "border-gray-200"
                    } py-2.5 pl-10 pr-3 text-sm shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 ${
                      !isEditing ? "bg-gray-50" : ""
                    }`}
                    placeholder="Your full name"
                  />
                </div>
                {errors.full_name && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.full_name}</p>}
              </div>

              {/* Email (read-only) */}
              <div className="relative">
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <AtSign className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={client?.email || ""}
                    disabled
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm shadow-sm"
                    placeholder="Your email address"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Email address cannot be changed</p>
              </div>

              {/* Age */}
              <div className="relative">
                <label htmlFor="age" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Age
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    disabled={!isEditing}
                    min="16"
                    max="120"
                    className={`w-full rounded-lg border ${
                      errors.age ? "border-red-300 bg-red-50" : "border-gray-200"
                    } py-2.5 pl-10 pr-3 text-sm shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 ${
                      !isEditing ? "bg-gray-50" : ""
                    }`}
                    placeholder="Your age"
                  />
                </div>
                {errors.age && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.age}</p>}
              </div>

              {/* Phone */}
              <div className="relative">
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full rounded-lg border ${
                      errors.phone ? "border-red-300 bg-red-50" : "border-gray-200"
                    } py-2.5 pl-10 pr-3 text-sm shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 ${
                      !isEditing ? "bg-gray-50" : ""
                    }`}
                    placeholder="Your phone number"
                  />
                </div>
                {errors.phone && <p className="mt-1.5 text-xs font-medium text-red-500">{errors.phone}</p>}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:from-cyan-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-70"
                  >
                    {updateProfileMutation.isPending ? (
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
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="flex w-full justify-between">
                <Button
                  type="button"
                  onClick={() => handleDeleteClick(client.id)}
                  className="flex items-center gap-1 rounded-lg bg-red-600 hover:bg-red-700 cursor-pointer px-4 py-2 text-sm font-medium text-white shadow-md transition hover:from-cyan-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 cursor-pointer px-4 py-2 text-sm font-medium text-white shadow-md transition hover:from-cyan-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                >
                  <User className="h-4 w-4" />
                  Edit Profile
                </Button>
                
                </div>

              )}
            </div>
          </form>
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-center text-red-600">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
            <h3 className="mb-2 text-center text-lg font-bold text-gray-900">Confirm Delete</h3>
            <p className="mb-6 text-center text-gray-600">
              Are you sure you want to delete Your Account? All your data will be vanished, This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-lg cursor-pointer border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="rounded-lg cursor-pointer bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-70"
              >
                {deleteMutation.isPending ? (
                  <span className="flex items-center">
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
                    Deleting...
                  </span>
                ) : (
                  "Delete Client"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile


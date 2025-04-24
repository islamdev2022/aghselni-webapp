import { LayoutDashboard, User, Clock, CheckCircle } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import api from "@/api"
import { useQueryClient } from "@tanstack/react-query"
import DashboardLayout from "@/components/layouts/DashboardLayout"

interface ExternEmployeeLayoutProps {
  children: React.ReactNode
}

interface UserData {
  id: number
  full_name: string
  email: string
  user_type: string
  phone: string | null
  age: number | null
}

export default function ExternEmployeeLayout({ children }: ExternEmployeeLayoutProps) {
  const queryClient = useQueryClient()

  const { data: userData, isLoading, error } = useQuery({
    queryKey: ["user-data"],
    queryFn: async () => {
      const response = await api.get<UserData>("/api/user/me")
      return response.data
    },
  })

  const navItems = [
    {
      name: "Dashboard",
      path: "/extern_employee",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "History",
      path: "/extern_employee/history",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      name: "Completed Jobs",
      path: "/extern_employee/completed",
      icon: <CheckCircle className="h-5 w-5" />,
    },
    {
      name: "Profile",
      path: "/extern_employee/profile",
      icon: <User className="h-5 w-5" />,
    },
  ]

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userData?.full_name) return "EE"
    return userData.full_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    // Clear query cache
    queryClient.clear()
    // Redirect to login page
    window.location.href = '/login/extern_employee'
  }

  const errorMessage = error ? "Authentication error. Please log in again." : null

  return (
    <DashboardLayout
      navItems={navItems}
      userData={userData ?? null}
      isLoading={isLoading}
      error={errorMessage}
      onLogout={handleLogout}
      userInitials={getUserInitials()}
    >
      {children}
    </DashboardLayout>
  )
}
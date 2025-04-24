import { useState, useEffect } from "react"
import { Car } from "lucide-react"
import {
  LayoutDashboard,
  Users,
  Calendar,
  BarChart,
  Settings,
  DollarSign,
  MessageSquare
} from "lucide-react"
import api from "@/api"
import { useQueryClient } from "@tanstack/react-query"
import DashboardLayout from "@/components/layouts/DashboardLayout"

interface AdminLayoutProps {
  children: React.ReactNode
}

interface UserData {
  id: number
  full_name: string
  email: string
  user_type: string
}

// Query keys for caching
const ADMIN_QUERY_KEY = 'adminData';
const USER_QUERY_KEY = 'userData';

export default function AdminLayout({ children }: AdminLayoutProps) {
  // const [adminData, setAdminData] = useState<AdminDashboardData | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Fetch admin dashboard data and user information
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch admin dashboard data
        const adminResponse = await api.get('/api/admin/dashboard/');
        // setAdminData(adminResponse.data);
        // Cache the admin data
        queryClient.setQueryData([ADMIN_QUERY_KEY], adminResponse.data);
        
        // Fetch current user data
        const userResponse = await api.get('api/user/me/');
        setUserData(userResponse.data);
        // Cache the user data
        queryClient.setQueryData([USER_QUERY_KEY], userResponse.data);
        
      } catch (error: any) {
        // Handle errors more gracefully
        if (error.response) {
          // Server responded with a status outside the 2xx range
          if (error.response.status !== 403) {
            console.error('API request failed:', error.response.data);
            setError(`Authentication failed: ${error.response.data.detail || 'Access denied'}`);
          } else {
            setError('You do not have permission to access this page.');
          }
        } else if (error.request) {
          // Request was made but no response received
          console.error('No response received:', error.request);
          setError('Server did not respond. Please check your connection.');
        } else {
          // Error setting up the request
          console.error('Error setting up request:', error.message);
          setError(`Request error: ${error.message}`);
        }
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [queryClient])

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Employees",
      icon: <Users className="h-5 w-5" />,
      hasSubmenu: true,
      submenuItems: [
        { name: "All Employees", path: "/admin/employees" },
        { name: "Add Employee", path: "/admin/employees/add" },
      ],
    },
    {
      name: "Clients",
      path: "/admin/clients",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Appointments",
      path: "/admin/appointments",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      name: "Statistics",
      path: "/admin/statistics",
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      name: "Client Feedbacks",
      path: "/admin/feedback",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      name: "Services",
      path: "/admin/services",
      icon: <Car className="h-5 w-5" />,
    },
    {
      name: "Revenue",
      path: "/admin/revenue",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    // Clear query cache
    queryClient.clear()
    // Redirect to login page
    window.location.href = '/login/admin'
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userData?.full_name) return "AD"
    return userData.full_name
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <DashboardLayout
      navItems={navItems}
      userData={userData}
      isLoading={isLoading}
      error={error}
      onLogout={handleLogout}
      userInitials={getUserInitials()}
    >
      {children}
    </DashboardLayout>
  )
}
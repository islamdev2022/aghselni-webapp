import type React from "react"
import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  Calendar,
  BarChart,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Car,
  DollarSign,
} from "lucide-react"
import api from "@/api"
import {  useQueryClient } from "@tanstack/react-query";
interface AdminLayoutProps {
  children: React.ReactNode
}

interface AdminDashboardData {
  message: string
  user_id: number
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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [employeeSubmenuOpen, setEmployeeSubmenuOpen] = useState(false)
  const [adminData, setAdminData] = useState<AdminDashboardData | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const location = useLocation()
  const queryClient = useQueryClient()

  // Fetch admin dashboard data and user information
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch admin dashboard data
        const adminResponse = await api.get('/api/admin/dashboard/');
        setAdminData(adminResponse.data);
        console.log(adminData)
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

  const isActive = (path: string) => {
    return location.pathname === path
  }

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
      name: "Services",
      path: "/admin/services",
      icon: <Car className="h-5 w-5" />,
    },
    {
      name: "Statistics",
      path: "/admin/statistics",
      icon: <BarChart className="h-5 w-5" />,
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const toggleEmployeeSubmenu = () => {
    setEmployeeSubmenuOpen(!employeeSubmenuOpen)
  }

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    // Clear query cache
    queryClient.clear()
    // Redirect to login page
    window.location.href = '/login/admin'
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link to="/admin" className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-cyan-600 to-cyan-500">
                <Car className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-800">Aghselni</span>
            </Link>
            <button className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden" onClick={toggleSidebar}>
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <ul className="space-y-1">
              {navItems.map((item, index) => (
                <li key={index}>
                  {item.hasSubmenu ? (
                    <div>
                      <button
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium ${
                          employeeSubmenuOpen ? "bg-cyan-50 text-cyan-700" : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={toggleEmployeeSubmenu}
                      >
                        <div className="flex items-center">
                          {item.icon}
                          <span className="ml-3">{item.name}</span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${employeeSubmenuOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {employeeSubmenuOpen && (
                        <ul className="mt-1 space-y-1 pl-10">
                          {item.submenuItems?.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <Link
                                to={subItem.path}
                                className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                                  isActive(subItem.path)
                                    ? "bg-cyan-50 text-cyan-700"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                              >
                                {subItem.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path || ''}
                      className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
                        isActive(item.path || '') ? "bg-cyan-50 text-cyan-700" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar footer */}
          <div className="border-t p-4">
            <button 
              className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <button className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200"></div>
            ) : error ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700">
                <span className="text-sm font-medium">!</span>
              </div>
            ) : (
              <>
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
                    <span className="text-sm font-medium">
                      {userData?.full_name ? userData.full_name.split(' ').map(name => name[0]).join('').toUpperCase().substring(0, 2) : 'AD'}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500"></div>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-800">{userData?.full_name || 'Admin User'}</p>
                  <p className="text-xs text-gray-500">{userData?.email || 'admin@aghselni.com'}</p>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
                <p className="mt-2 text-sm text-gray-500">Loading...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center">
              <div className="max-w-md rounded-lg bg-white p-6 shadow-md">
                <h3 className="mb-2 text-lg font-medium text-red-600">Authentication Error</h3>
                <p className="text-gray-600">{error}</p>
                <button 
                  className="mt-4 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-600"
                  onClick={handleLogout}
                >
                  Return to Login
                </button>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  )
}
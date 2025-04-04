import type React from "react"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, LogOut, Menu, X, Car, User, Clock, CheckCircle } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import api from "@/api"
import {  useQueryClient } from "@tanstack/react-query";

interface UserData {
  id: number
  full_name: string
  email: string
  user_type: string
  phone: string | null
  age: number | null
}

interface ExternEmployeeLayoutProps {
  children: React.ReactNode
}

export default function ExternEmployeeLayout({ children }: ExternEmployeeLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const queryClient = useQueryClient()

  const { data: userData } = useQuery({
    queryKey: ["user-data"],
    queryFn: async () => {
      const response = await api.get<UserData>("/api/user/me")
      return response.data
    },
  })

  const isActive = (path: string) => {
    return location.pathname === path
  }

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
    // {
    //   name: "Settings",
    //   path: "/extern_employee/settings",
    //   icon: <Settings className="h-5 w-5" />,
    // },
  ]

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

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
            <Link to="/extern_employee" className="flex items-center">
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
                  <Link
                    to={item.path}
                    className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
                      isActive(item.path) ? "bg-cyan-50 text-cyan-700" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar footer */}
          <div className="border-t p-4">
            <button onClick={handleLogout} className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
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
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
                <span className="text-sm font-medium">{getUserInitials()}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500"></div>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-800">{userData?.full_name || "External Employee"}</p>
              <p className="text-xs text-gray-500">{userData?.email || ""}</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
      </div>
    </div>
  )
}


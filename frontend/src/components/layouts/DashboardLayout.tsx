import type React from "react"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, LogOut } from "lucide-react"
import Loading from "@/loading"

interface NavItem {
  name: string
  path?: string
  icon: React.ReactNode
  hasSubmenu?: boolean
  submenuItems?: { name: string; path: string }[]
}

interface DashboardLayoutProps {
  children: React.ReactNode
  navItems: NavItem[]
  appLogo: React.ReactNode
  appName: string
  userData: {
    full_name?: string
    email?: string
  } | null
  isLoading?: boolean
  error?: string | null
  onLogout: () => void
  userInitials?: string
}

export default function DashboardLayout({
  children,
  navItems,
  appLogo,
  appName,
  userData,
  isLoading = false,
  error = null,
  onLogout,
  userInitials = "AU" // Default user initials
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [submenuOpen, setSubmenuOpen] = useState<Record<string, boolean>>({})
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const toggleSubmenu = (itemName: string) => {
    setSubmenuOpen(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }))
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
            <Link to="/" className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-cyan-600 to-cyan-500">
                {appLogo}
              </div>
              <span className="ml-2 text-xl font-bold text-gray-800">{appName}</span>
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
                          submenuOpen[item.name] ? "bg-cyan-50 text-cyan-700" : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => toggleSubmenu(item.name)}
                      >
                        <div className="flex items-center">
                          {item.icon}
                          <span className="ml-3">{item.name}</span>
                        </div>
                        <svg
                          className={`h-4 w-4 transition-transform ${submenuOpen[item.name] ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {submenuOpen[item.name] && item.submenuItems && (
                        <ul className="mt-1 space-y-1 pl-10">
                          {item.submenuItems.map((subItem, subIndex) => (
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
              onClick={onLogout}
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
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 animate-pulse">
                <Loading />
              </div>
            ) : error ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700">
                <span className="text-sm font-medium">!</span>
              </div>
            ) : (
              <>
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
                    <span className="text-sm font-medium">{userInitials}</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500"></div>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-800">{userData?.full_name || 'User'}</p>
                  <p className="text-xs text-gray-500">{userData?.email || ''}</p>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loading />
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center">
              <div className="max-w-md rounded-lg bg-white p-6 shadow-md">
                <h3 className="mb-2 text-lg font-medium text-red-600">Authentication Error</h3>
                <p className="text-gray-600">{error}</p>
                <button 
                  className="mt-4 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-600"
                  onClick={onLogout}
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
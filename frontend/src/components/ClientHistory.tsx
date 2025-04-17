import { useState } from "react"
import {
  Clock,
  Car,
  MapPin,
  Calendar,
  CheckCircle,
  X,
  Filter,
  Search,
  Home,
  MapPinned,
  Phone,
  Star,
  User
} from "lucide-react"
import { useGetDomicielAppointmentsClient, useGetInternAppointmentsClient } from "@/hooks"
import api from "@/api"
interface ClientInfo {
  id: number
  full_name: string
  email: string
  phone: string
  age: number
  photo: string
}

interface ExternEmployee {
  full_name: string
  phone: string
  final_rating: number
}

interface DomicileAppointment {
  id: number
  time: string
  car_type: string
  car_name: string
  wash_type: string
  place: string
  price: string
  status: string
  client_info: ClientInfo
  extern_employee: number | null
}

interface LocationAppointment {
  id: number
  time: string
  date?: string
  car_type: string
  car_name: string
  wash_type: string
  price: string
  status: string
  client_info: ClientInfo
}

const ClientHistory = () => {
  const [activeTab, setActiveTab] = useState<"domicile" | "location">("domicile")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedDomicileAppointment, setSelectedDomicileAppointment] = useState<DomicileAppointment | null>(null)
  const [selectedLocationAppointment, setSelectedLocationAppointment] = useState<LocationAppointment | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [externEmployeeData, setExternEmployeeData] = useState<ExternEmployee | null>(null)
  const [isLoadingEmployee, setIsLoadingEmployee] = useState(false)

  // Fetch domicile appointment history
  const {
    data: domicileAppointments,
    isLoading: isDomicileLoading,
    isError: isDomicileError,
  } = useGetDomicielAppointmentsClient()

  // Fetch location appointment history
  const {
    data: locationAppointments,
    isLoading: isLocationLoading,
    isError: isLocationError,
  } = useGetInternAppointmentsClient()


  // Filter domicile appointments based on search term and status
  const filteredDomicileAppointments = (domicileAppointments?.filter((appointment) => {
    const matchesSearch =
      appointment.car_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.car_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.wash_type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter

    return matchesSearch && matchesStatus
  }) || []) as DomicileAppointment[]

  // Filter location appointments based on search term and status
  const filteredLocationAppointments = locationAppointments?.filter((appointment) => {
    const matchesSearch =
      appointment.car_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.car_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.wash_type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter

    return matchesSearch && matchesStatus
  }) || []

  const handleViewDomicileDetails = async (appointment: DomicileAppointment) => {
    setSelectedDomicileAppointment(appointment)
    setSelectedLocationAppointment(null)
    setShowDetailModal(true)
  
    // Fetch extern employee data if available
    if (appointment?.extern_employee) {
      try {
        setIsLoadingEmployee(true)
        console.log(appointment.extern_employee)
  
        const response = await api.get(`/api/extern_employee/${appointment.extern_employee}/`)
        const employeeData = response.data
  
        console.log("This is employee data:", employeeData)
        setExternEmployeeData(employeeData)
      } catch (error) {
        console.error("Failed to fetch extern employee data:", error)
        setExternEmployeeData(null)
      } finally {
        setIsLoadingEmployee(false)
      }
    } else {
      setExternEmployeeData(null)
    }
  }
  

  const handleViewLocationDetails = (appointment: LocationAppointment) => {
    setSelectedLocationAppointment(appointment)
    setSelectedDomicileAppointment(null)
    setExternEmployeeData(null)
    setShowDetailModal(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </span>
        )
      case "In Progress":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
            <Clock className="mr-1 h-3 w-3" />
            In Progress
          </span>
        )
      case "Completed":
        return (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </span>
        )
      case "Cancelled":
        return (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
            <X className="mr-1 h-3 w-3" />
            Cancelled
          </span>
        )
      default:
        return null
    }
  }

  // Format time to be more readable
  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(":")
      const hour = Number.parseInt(hours)
      const ampm = hour >= 12 ? "PM" : "AM"
      const hour12 = hour % 12 || 12
      return `${hour12}:${minutes} ${ampm}`
    } catch (error) {
      return timeString
    }
  }

  // Format date to be more readable
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A'
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    } catch (error) {
      return dateString
    }
  }

  const isLoading = isDomicileLoading || isLocationLoading
  const isError = isDomicileError && isLocationError

  if (isLoading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex h-40 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-cyan-600"></div>
          <span className="ml-2 text-sm font-medium text-gray-700">Loading appointment history...</span>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex h-40 flex-col items-center justify-center">
          <X className="h-10 w-10 text-red-500" />
          <p className="mt-2 text-sm font-medium text-gray-700">Failed to load appointment history</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700 hover:bg-cyan-100"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Appointment History</h2>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("domicile")}
            className={`border-b-2 pb-4 pt-2 text-sm font-medium ${
              activeTab === "domicile"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center">
              <MapPinned className="mr-2 h-4 w-4" />
              Domicile Appointments
              {domicileAppointments?.length ? (
                <span className="ml-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                  {domicileAppointments.length}
                </span>
              ) : null}
            </div>
          </button>
          <button
            onClick={() => setActiveTab("location")}
            className={`border-b-2 pb-4 pt-2 text-sm font-medium ${
              activeTab === "location"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              In-house Appointments
              {locationAppointments?.length ? (
                <span className="ml-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                  {locationAppointments.length}
                </span>
              ) : null}
            </div>
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search appointments..."
            className="w-full rounded-lg border border-gray-200 pl-10 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center">
          <Filter className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-sm font-medium text-gray-700 mr-2">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="all">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Domicile Appointments Table */}
      {activeTab === "domicile" && (
        <>
          {filteredDomicileAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Time</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Car</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Service</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Location</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDomicileAppointments.map((appointment) => (
                    <tr key={`domicile-${appointment.id}`} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4 text-gray-400" />
                          {formatTime(appointment.time)}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Car className="mr-1 h-4 w-4 text-gray-400" />
                          {appointment.car_name} ({appointment.car_type})
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                        <span className="capitalize">{appointment.wash_type}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-4 w-4 text-gray-400" />
                          {appointment.place}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          DZD {appointment.price}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">{getStatusBadge(appointment.status)}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <button
                          onClick={() => handleViewDomicileDetails(appointment)}
                          className="rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700 hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center">
              <MapPinned className="h-10 w-10 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">No domicile appointments found</p>
              {(searchTerm || statusFilter !== "all") && (
                <p className="mt-1 text-xs text-gray-400">Try adjusting your filters</p>
              )}
            </div>
          )}
        </>
      )}

      {/* Location Appointments Table */}
      {activeTab === "location" && (
        <>
          {filteredLocationAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Time</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Car</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Service</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLocationAppointments.map((appointment) => (
                    <tr key={`location-${appointment.id}`} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                          {/* {formatDate(appointment.date)} */}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4 text-gray-400" />
                          {formatTime(appointment.time)}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Car className="mr-1 h-4 w-4 text-gray-400" />
                          {appointment.car_name} ({appointment.car_type})
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                        <span className="capitalize">{appointment.wash_type}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          DZD {appointment.price}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">{getStatusBadge(appointment.status)}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <button
                          onClick={() => handleViewLocationDetails(appointment)}
                          className="rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700 hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center">
              <Home className="h-10 w-10 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">No in-house appointments found</p>
              {(searchTerm || statusFilter !== "all") && (
                <p className="mt-1 text-xs text-gray-400">Try adjusting your filters</p>
              )}
            </div>
          )}
        </>
      )}

      {/* Domicile Appointment Detail Modal */}
      {showDetailModal && selectedDomicileAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Domicile Appointment Details</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="mb-3 text-sm font-semibold text-gray-700">Appointment Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">ID:</span>
                    <span className="text-sm font-medium text-gray-700">#{selectedDomicileAppointment.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Time:</span>
                    <span className="text-sm font-medium text-gray-700">{formatTime(selectedDomicileAppointment.time)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Status:</span>
                    <span>{getStatusBadge(selectedDomicileAppointment.status)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Price:</span>
                    <span className="text-sm font-medium text-gray-700">DZD {selectedDomicileAppointment.price}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="mb-3 text-sm font-semibold text-gray-700">Service Details</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Car:</span>
                    <span className="text-sm font-medium text-gray-700">
                      {selectedDomicileAppointment.car_name} ({selectedDomicileAppointment.car_type})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Service Type:</span>
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {selectedDomicileAppointment.wash_type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Location:</span>
                    <span className="text-sm font-medium text-gray-700">{selectedDomicileAppointment.place}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Extern Employee Section */}
            {selectedDomicileAppointment.extern_employee && (
              <div className="mb-6">
                <h4 className="mb-3 text-sm font-semibold text-gray-700">Assigned Employee</h4>
                {isLoadingEmployee ? (
                  <div className="flex items-center justify-center p-4">
                    <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-cyan-600"></div>
                    <span className="ml-2 text-sm text-gray-600">Loading employee information...</span>
                  </div>
                ) : externEmployeeData ? (
                  <div className="rounded-lg bg-cyan-50 p-4">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-cyan-600" />
                        <span className="text-sm font-medium text-gray-800">{externEmployeeData.full_name}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="mr-2 h-4 w-4 text-cyan-600" />
                        <span className="text-sm text-gray-700">{externEmployeeData.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="mr-2 h-4 w-4 text-amber-400" />
                        <span className="text-sm text-gray-700">
                          Rating: {externEmployeeData.final_rating.toFixed(1)}/5
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg bg-gray-100 p-4 text-center text-sm text-gray-500">
                    Employee information not available
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Location Appointment Detail Modal */}
      {showDetailModal && selectedLocationAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">In-house Appointment Details</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="mb-3 text-sm font-semibold text-gray-700">Appointment Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">ID:</span>
                    <span className="text-sm font-medium text-gray-700">#{selectedLocationAppointment.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Date:</span>
                    <span className="text-sm font-medium text-gray-700">{formatDate(selectedLocationAppointment.date)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Time:</span>
                    <span className="text-sm font-medium text-gray-700">{formatTime(selectedLocationAppointment.time)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Status:</span>
                    <span>{getStatusBadge(selectedLocationAppointment.status)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Price:</span>
                    <span className="text-sm font-medium text-gray-700">DZD {selectedLocationAppointment.price}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="mb-3 text-sm font-semibold text-gray-700">Service Details</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Car:</span>
                    <span className="text-sm font-medium text-gray-700">
                      {selectedLocationAppointment.car_name} ({selectedLocationAppointment.car_type})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Service Type:</span>
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {selectedLocationAppointment.wash_type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Location:</span>
                    <span className="text-sm font-medium text-gray-700">
                      In-house Service Center
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientHistory
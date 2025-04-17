import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
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
} from "lucide-react"
import api from "@/api"

interface ClientInfo {
  id: number
  full_name: string
  email: string
  phone: string
  age: number
  photo: string
}

interface Appointment {
  id: number
  time: string
  car_type: string
  car_name: string
  wash_type: string
  place: string
  price: string
  status: string
  client_info: ClientInfo
  type?: "domicile" | "location" // Added to distinguish between appointment types
}

const ClientHistory = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Fetch domicile appointment history
  const {
    data: domicileAppointments,
    isLoading: isDomicileLoading,
    isError: isDomicileError,
  } = useQuery({
    queryKey: ["client-domicile-appointments"],
    queryFn: async () => {
      const response = await api.get<Appointment[]>("/api/appointments_domicile/get")
      // Add type property to each appointment
      return response.data.map((appointment) => ({
        ...appointment,
        type: "domicile" as const,
      }))
    },
  })

  // Fetch location appointment history
  const {
    data: locationAppointments,
    isLoading: isLocationLoading,
    isError: isLocationError,
  } = useQuery({
    queryKey: ["client-location-appointments"],
    queryFn: async () => {
      const response = await api.get<Appointment[]>("/api/appointments_location/get")
      // Add type property to each appointment
      return response.data.map((appointment) => ({
        ...appointment,
        type: "location" as const,
      }))
    },
  })

  // Combine both appointment types
  const allAppointments = [...(domicileAppointments || []), ...(locationAppointments || [])]

  // Filter appointments based on search term, status, and type
  const filteredAppointments = allAppointments.filter((appointment) => {
    const matchesSearch =
      appointment.car_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.car_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.wash_type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter
    const matchesType = typeFilter === "all" || appointment.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
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

  const getAppointmentTypeBadge = (type?: "domicile" | "location") => {
    switch (type) {
      case "domicile":
        return (
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
            <MapPinned className="mr-1 h-3 w-3" />
            Domicile
          </span>
        )
      case "location":
        return (
          <span className="inline-flex items-center rounded-full bg-cyan-50 px-2.5 py-0.5 text-xs font-medium text-cyan-700">
            <Home className="mr-1 h-3 w-3" />
            In-house
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
        <div className="flex flex-wrap gap-3">
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
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="all">All Types</option>
              <option value="domicile">Domicile</option>
              <option value="location">In-house</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      {filteredAppointments && filteredAppointments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Date & Time</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Car</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Service</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Location</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr key={`${appointment.type}-${appointment.id}`} className="border-b border-gray-100 hover:bg-gray-50">
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
                    { appointment.place ? <> <MapPin className="mr-1 h-4 w-4 text-gray-400" />{appointment.place}</> : "N/A" }  
                      
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">{getAppointmentTypeBadge(appointment.type)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      DZD  {appointment.price}
                     
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">{getStatusBadge(appointment.status)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <button
                      onClick={() => handleViewDetails(appointment)}
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
          <Calendar className="h-10 w-10 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">No appointments found</p>
          {(searchTerm || statusFilter !== "all" || typeFilter !== "all") && (
            <p className="mt-1 text-xs text-gray-400">Try adjusting your filters</p>
          )}
        </div>
      )}

      {/* Appointment Detail Modal */}
      {showDetailModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Appointment Details</h3>
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
                    <span className="text-sm font-medium text-gray-700">#{selectedAppointment.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Time:</span>
                    <span className="text-sm font-medium text-gray-700">{formatTime(selectedAppointment.time)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Type:</span>
                    <span>{getAppointmentTypeBadge(selectedAppointment.type)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Status:</span>
                    <span>{getStatusBadge(selectedAppointment.status)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Price:</span>
                    <span className="text-sm font-medium text-gray-700">DZD {selectedAppointment.price}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="mb-3 text-sm font-semibold text-gray-700">Service Details</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Car:</span>
                    <span className="text-sm font-medium text-gray-700">
                      {selectedAppointment.car_name} ({selectedAppointment.car_type})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Service Type:</span>
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {selectedAppointment.wash_type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Location:</span>
                    <span className="text-sm font-medium text-gray-700">{selectedAppointment.place}</span>
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
import { useState } from "react"
import {  useMutation, useQueryClient } from "@tanstack/react-query"
import { Clock, CheckCircle, Car, DollarSign, Calendar, User, Phone, X, Home } from "lucide-react"
import api from "@/api"
import Loading from "@/loading"
import {useGetInternAppointmentsClient} from "@/hooks"
interface Appointment {
  id: number
  time: string
  car_type: string
  car_name: string
  wash_type: string
  place: string
  price: string
  status: string
  client_info?: {
    id: number
    full_name: string
    email: string
    phone: string
    age: number
    photo: string
  }
}

export default function AppointmentTabs() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<"pending" | "claimed">("pending")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [newStatus, setNewStatus] = useState<string>("")

  // Fetch all appointments
  const { data: allAppointments, isLoading: isAllLoading } = useGetInternAppointmentsClient()

  // Update appointment status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await api.put(`/api/appointments_location/${id}/`, { status })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["location-appointments"] })
      setShowStatusModal(false)
      setShowDetailModal(false)
    },
  })

  // Fetch appointment details

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setShowDetailModal(true)
  }

  const handleUpdateStatus = () => {
    if (selectedAppointment && newStatus) {
      updateStatusMutation.mutate({ id: selectedAppointment.id, status: newStatus })
    }
  }

  const openStatusModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setNewStatus(appointment.status)
    setShowStatusModal(true)
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
      case "Deleted":
        return (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
            <X className="mr-1 h-3 w-3" />
            Deleted
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

  // Filter appointments based on tab
  const pendingAppointments = allAppointments?.filter(
    (appointment) => appointment.status === "Pending" || appointment.status === "In Progress",
  )
  const completedAppointments = allAppointments?.filter(
    (appointment) => appointment.status === "Completed" ,
  )

  const displayAppointments = activeTab === "pending" ? pendingAppointments : completedAppointments

  if (isAllLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loading />
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-6">
          <button
            className={`border-b-2 px-1 pb-4 text-sm font-medium ${
              activeTab === "pending"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("pending")}
          >
            Active Appointments
          </button>
          <button
            className={`border-b-2 px-1 pb-4 text-sm font-medium ${
              activeTab === "claimed"
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("claimed")}
          >
            Completed Appointments
          </button>
        </div>
      </div>

      {/* Appointments Table */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          {activeTab === "pending" ? "Active Appointments" : "Completed Appointments"}
        </h3>
        {displayAppointments && displayAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Client</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Time</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Car</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Service Type
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayAppointments.map((appointment) => (
                  <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-800">
                      <div className="flex items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
                          <User className="h-4 w-4" />
                        </div>
                        <span className="ml-2">{appointment.client_info?.full_name || "Client"}</span>
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
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{appointment.wash_type}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <DollarSign className="mr-1 h-4 w-4 text-gray-400" />
                        {appointment.price}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">{getStatusBadge(appointment.status)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(appointment)}
                          className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1"
                        >
                          View
                        </button>
                        {activeTab === "pending" && (
                          <button
                            onClick={() => openStatusModal(appointment)}
                            className="rounded-lg bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700 hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1"
                          >
                            Update
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex h-40 flex-col items-center justify-center">
            <Calendar className="h-10 w-10 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              {activeTab === "pending" ? "No active appointments" : "No completed appointments"}
            </p>
          </div>
        )}
      </div>

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
              <>
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
                        <span className="text-sm font-medium text-gray-700">
                          {formatTime(selectedAppointment.time)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Status:</span>
                        <span>{getStatusBadge(selectedAppointment.status)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Price:</span>
                        <span className="text-sm font-medium text-gray-700">${selectedAppointment.price}</span>
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
                        <span className="text-sm font-medium text-gray-700">{selectedAppointment.wash_type}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Location:</span>
                        <span className="text-sm font-medium text-gray-700">
                          <span className="inline-flex items-center">
                            <Home className="mr-1 h-3 w-3 text-cyan-500" />
                            In-house
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedAppointment.client_info && (
                  <div className="mb-6 rounded-lg bg-gray-50 p-4">
                    <h4 className="mb-3 text-sm font-semibold text-gray-700">Client Information</h4>
                    <div className="flex items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 text-cyan-700 overflow-hidden">
                        {selectedAppointment.client_info.photo ? (
                          <img
                            src={`http://127.0.0.1:8000${selectedAppointment.client_info.photo}` || "/placeholder.svg"}
                            alt={selectedAppointment.client_info.full_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-6 w-6" />
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{selectedAppointment.client_info.full_name}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span>{selectedAppointment.client_info.email}</span>
                          <span className="flex items-center">
                            <Phone className="mr-1 h-3 w-3" />
                            {selectedAppointment.client_info.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  {activeTab === "pending" && (
                    <button
                      onClick={() => openStatusModal(selectedAppointment)}
                      className="rounded-lg bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700 hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1"
                    >
                      Update Status
                    </button>
                  )}
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1"
                  >
                    Close
                  </button>
                </div>
              </>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showStatusModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Update Appointment Status</h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="mb-4 text-sm text-gray-600">
                Update the status for appointment #{selectedAppointment.id} - {selectedAppointment.car_name} (
                {selectedAppointment.wash_type})
              </p>

              <div className="space-y-3">
                <label className="flex cursor-pointer items-center rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
                  <input
                    type="radio"
                    name="status"
                    value="Pending"
                    checked={newStatus === "Pending"}
                    onChange={() => setNewStatus("Pending")}
                    className="h-4 w-4 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="ml-3 flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium text-gray-700">Pending</span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-center rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
                  <input
                    type="radio"
                    name="status"
                    value="In Progress"
                    checked={newStatus === "In Progress"}
                    onChange={() => setNewStatus("In Progress")}
                    className="h-4 w-4 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="ml-3 flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">In Progress</span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-center rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
                  <input
                    type="radio"
                    name="status"
                    value="Completed"
                    checked={newStatus === "Completed"}
                    onChange={() => setNewStatus("Completed")}
                    className="h-4 w-4 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="ml-3 flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">Completed</span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-center rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
                  <input
                    type="radio"
                    name="status"
                    value="Deleted"
                    checked={newStatus === "Deleted"}
                    onChange={() => setNewStatus("Deleted")}
                    className="h-4 w-4 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="ml-3 flex items-center">
                    <X className="mr-2 h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-gray-700">Deleted</span>
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowStatusModal(false)}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={updateStatusMutation.isPending || newStatus === selectedAppointment.status}
                className="rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-cyan-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1 disabled:opacity-70"
              >
                {updateStatusMutation.isPending ? (
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
                    Updating...
                  </span>
                ) : (
                  "Update Status"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

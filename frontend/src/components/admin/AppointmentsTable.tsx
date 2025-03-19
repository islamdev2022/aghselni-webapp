"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Clock, MapPin, User, Check, X, Filter } from "lucide-react"
import api from "@/api"

type AppointmentType = "all" | "domicile" | "intern"

export default function AppointmentsTable() {
  const [appointmentType, setAppointmentType] = useState<AppointmentType>("all")

  // Fetch domicile appointments
  const { data: domicileAppointments, isLoading: isDomicileLoading } = useQuery({
    queryKey: ["domicile-appointments"],
    queryFn: async () => {
      const response = await api.get("/api/appointments_domicile/get")
      return response.data
    },
  })

  // Fetch intern appointments
  const { data: internAppointments, isLoading: isInternLoading } = useQuery({
    queryKey: ["intern-appointments"],
    queryFn: async () => {
      const response = await api.get("/api/appointments_location/get")
      return response.data
    },
  })

  const isLoading = isDomicileLoading || isInternLoading

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-cyan-600"></div>
      </div>
    )
  }

  // Combine and filter appointments based on selected type
  const getFilteredAppointments = () => {
    const domicile = domicileAppointments || []
    const intern = internAppointments || []

    // Add a type property to each appointment to identify its source
    const domicileWithType = domicile.map((appointment: any) => ({
      ...appointment,
      appointmentType: "domicile",
    }))

    const internWithType = intern.map((appointment: any) => ({
      ...appointment,
      appointmentType: "intern",
    }))

    // Filter based on selected type
    switch (appointmentType) {
      case "domicile":
        return domicileWithType
      case "intern":
        return internWithType
      case "all":
      default:
        return [...domicileWithType, ...internWithType]
    }
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
      case "completed":
        return (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
            <Check className="mr-1 h-3 w-3" />
            Completed
          </span>
        )
      case "Deleted":
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

  const displayAppointments = getFilteredAppointments()

  return (
    <div>
      {/* Filter controls */}
      <div className="mb-4 flex items-center justify-end">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter by:</span>
          <select
            value={appointmentType}
            onChange={(e) => setAppointmentType(e.target.value as AppointmentType)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="all">All Appointments</option>
            <option value="domicile">Domicile Appointments</option>
            <option value="intern">In-house Appointments</option>
          </select>
        </div>
      </div>

      {/* Appointments table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="whitespace-nowrap py-3 text-sm font-medium text-gray-500 text-center">Client</th>
              <th className="whitespace-nowrap py-3 text-sm font-medium text-gray-500 text-center">Service</th>
              <th className="whitespace-nowrap py-3 text-sm font-medium text-gray-500 text-center">Type</th>
              <th className="whitespace-nowrap py-3 text-sm font-medium text-gray-500 text-center">Date & Time</th>
              <th className="whitespace-nowrap py-3 text-sm font-medium text-gray-500 text-center">Location</th>
              <th className="whitespace-nowrap py-3 text-sm font-medium text-gray-500 text-center">Status</th>
              <th className="whitespace-nowrap py-3 text-sm font-medium text-gray-500 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayAppointments.length > 0 ? (
              displayAppointments.map((appointment: any) => (
                <tr
                  key={`${appointment.appointmentType}-${appointment.id}`}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="whitespace-nowrap py-3 text-sm font-medium text-gray-800">
                    <div className="flex items-center  ">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
                        <User className="h-4 w-4" />
                      </div>
                      <span className="ml-2 ">{appointment.client_info.full_name}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 text-sm text-gray-600 flex  justify-center">{appointment.wash_type} wash</td>
                  <td className="whitespace-nowrap py-3 text-sm text-gray-600">
                    <span
                      className={`flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        appointment.appointmentType === "domicile"
                          ? "bg-indigo-50 text-indigo-700"
                          : "bg-cyan-50 text-cyan-700"
                      }`}
                    >
                      {appointment.appointmentType === "domicile" ? "Domicile" : "In-house"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap py-3 text-sm text-gray-600">
                    <div className="flex flex-col">
                      <div className="flex items-center mt-1 justify-center">
                        <Clock className="mr-1 h-3.5 w-3.5 text-gray-400" />
                        {appointment.time}
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 text-sm text-gray-600">
                    <div className="flex items-center justify-center">
                      {appointment.place ? <><MapPin className="mr-1 h-3.5 w-3.5 text-gray-400" /> {appointment.place}</> : "N/A"}
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 text-sm flex  justify-center">{getStatusBadge(appointment.status)}</td>
                  <td className="whitespace-nowrap py-3 text-sm">
                    <div className="flex space-x-2  justify-center">
                      <button className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1">
                        View
                      </button>
                      <button className="rounded-lg bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700 hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1">
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Clock className="h-10 w-10 text-gray-400" />
                    <p className="mt-2 text-sm font-medium text-gray-500">No appointments found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}


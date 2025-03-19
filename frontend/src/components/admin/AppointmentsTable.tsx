import { useQuery } from "@tanstack/react-query"
import { Calendar, Clock, MapPin, User, Check, X } from "lucide-react"
import api from "@/api"
// interface Appointment {
//   id: number
//   clientName: string
//   service: string
//   date: string
//   time: string
//   location: string
//   status: "pending" | "completed" | "cancelled"
// }

export default function AppointmentsTable() {
  const { data: appointments, isLoading } = useQuery({
    queryKey: ["recent-appointments"],
    queryFn: async () => {
      const response = await api.get("/api/appointments_domicile/")
      return response.data
    },
  })
  console.log(appointments)

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-cyan-600"></div>
      </div>
    )
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


  const displayAppointments = appointments || []

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="whitespace-nowrap py-3 text-left text-sm font-medium text-gray-500">Client</th>
            <th className="whitespace-nowrap py-3 text-left text-sm font-medium text-gray-500">Service</th>
            <th className="whitespace-nowrap py-3 text-left text-sm font-medium text-gray-500">Date & Time</th>
            <th className="whitespace-nowrap py-3 text-left text-sm font-medium text-gray-500">Location</th>
            <th className="whitespace-nowrap py-3 text-left text-sm font-medium text-gray-500">Status</th>
            <th className="whitespace-nowrap py-3 text-left text-sm font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayAppointments.map((appointment :any) => (
            <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="whitespace-nowrap py-3 text-sm font-medium text-gray-800">
                <div className="flex items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="ml-2">{appointment.client_info.full_name}</span>
                </div>
              </td>
              <td className="whitespace-nowrap py-3 text-sm text-gray-600">{appointment.wash_type} wash</td>
              <td className="whitespace-nowrap py-3 text-sm text-gray-600">
                <div className="flex flex-col">
                  {/* <div className="flex items-center">
                    <Calendar className="mr-1 h-3.5 w-3.5 text-gray-400" />
                    {new Date(appointment.date).toLocaleDateString()}
                  </div> */}
                  <div className="flex items-center mt-1">
                    <Clock className="mr-1 h-3.5 w-3.5 text-gray-400" />
                    {appointment.time}
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap py-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="mr-1 h-3.5 w-3.5 text-gray-400" />
                  {appointment.place}
                </div>
              </td>
              <td className="whitespace-nowrap py-3 text-sm">{getStatusBadge(appointment.status)}</td>
              <td className="whitespace-nowrap py-3 text-sm">
                <div className="flex space-x-2">
                  <button className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1">
                    View
                  </button>
                  <button className="rounded-lg bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700 hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1">
                    Update
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { BarChart, LineChart, Calendar, ArrowUp } from "lucide-react"
import api from "@/api"
import AdminLayout from "@/components/layouts/AdminLayout"
import AppointmentsByDayChart from "./AppointmentsByChart"
import RevenueTrend from "./RevenueTrend"
import ServicesByTypePieChart from "./ServicesByTypePieChart"
import ServicesByLocationBarChart from "./ServicesByLocationBarChart"
interface Stats {
  date: string
  total_appointments: number
  
}

export default function StatisticsPage() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter" | "year">("month")
  const [totalServices, setTotalServices] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)

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

  console.log("domicile", domicileAppointments)
  console.log("intern", internAppointments)

  const { data: statsLocal } = useQuery<Stats>({
    queryKey: ["admin-stats-local"],
    queryFn: async () => {
      const response = await api.get<Stats>("/api/admin/appointments/stats/i");
      return response.data;
    },
  });

  // Second query for domicile stats
  const { data: statsDomicile } = useQuery<Stats>({
    queryKey: ["admin-stats-domicile"],
    queryFn: async () => {
      const response = await api.get<Stats>("/api/admin/appointments/stats/e");
      return response.data;
    },
  });

  // Log the data (you might want to remove this in production)
  console.log("Local Stats:", statsLocal);
  console.log("Domicile Stats:", statsDomicile);

  // Transform the data into an array format for the chart
  const displayData = [
    {
      name: "Local",
      value: statsLocal?.total_appointments || 0
    },
    {
      name: "Domicile",
      value: statsDomicile?.total_appointments || 0
    }
  ];
  console.log("displayData", displayData)
   useEffect(() => {
  if (internAppointments && domicileAppointments) {
    setTotalServices(internAppointments.length + domicileAppointments.length);
    setTotalRevenue(
      (internAppointments.reduce((sum: number, appointment: any) => sum + (parseFloat(appointment.price) || 0), 0)) + 
      (domicileAppointments.reduce((sum: number, appointment: any) => sum + (parseFloat(appointment.price) || 0), 0)))
    console.log("Total Services", totalServices);
    console.log("Total Revenue", totalRevenue);
  }
}, [internAppointments, domicileAppointments]);


  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold text-gray-800">Statistics & Analytics</h1>
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as "week" | "month" | "quarter" | "year")}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>

        {isDomicileLoading || isInternLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-cyan-600"></div>
              <span className="text-lg font-medium text-gray-700">Loading statistics...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-50">
                    <BarChart className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div className="flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                    <ArrowUp className="mr-1 h-3 w-3" />
                    8%
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Services</h3>
                  <p className="mt-1 text-2xl font-bold text-gray-800">{totalServices}</p>
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50">
                    <LineChart className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                    <ArrowUp className="mr-1 h-3 w-3" />
                    12%
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                  <p className="mt-1 text-2xl font-bold text-gray-800">${totalRevenue}</p>
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50">
                    <Calendar className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                    <ArrowUp className="mr-1 h-3 w-3" />
                    5%
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Appointments</h3>
                  <p className="mt-1 text-2xl font-bold text-gray-800">{totalServices}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <ServicesByTypePieChart timeRange={timeRange} />
              <ServicesByLocationBarChart timeRange={timeRange} />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="h-64">
                <RevenueTrend timeRange={timeRange} />
                </div>

                <div className="h-64">
                  <AppointmentsByDayChart timeRange={timeRange} />
                </div>
              </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}


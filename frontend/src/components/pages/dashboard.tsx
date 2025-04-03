import { useQuery } from "@tanstack/react-query"
import { Users, Calendar, DollarSign, Car, Home } from "lucide-react"
import api from "@/api"
import AdminLayout from "../../components/layouts/AdminLayout"
import StatCard from "../../components/admin/StatCard"
import RevenueChart from "../../components/admin/RevenueChart"
import AppointmentsTable from "../../components/admin/AppointmentsTable"
import FeedbackSummaryWidget from "../../components/admin/FeedbackSummary"
interface DashboardStats {
  date: string
  total_appointments: number
}

export default function AdminDashboard() {
  const { data: statslocal,  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const response = await api.get<DashboardStats>("/api/admin/appointments/stats/i")
      return response.data
    },
  })
  console.log("stats" , statslocal)

  const { data: statsdomiciel,  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const response = await api.get<DashboardStats>("/api/admin/appointments/stats/i")
      return response.data
    },
  })
  console.log("stats" , statsdomiciel)

  

  const { data : revenue } = useQuery({
    queryKey: ["admin-revenue"],
    queryFn: async () => {
      const responsei = await api.get("/api/admin/appointments/revenue/i")
      const responsee = await api.get("/api/admin/appointments/revenue/e")


      return {
        total_revenue: responsei.data.total_revenue + responsee.data.total_revenue
      }
    }
  })
  console.log(revenue)
console.log(statslocal)
  const { data: employees, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const internResponse = await api.get("/api/admin/intern_employees/")
      const externResponse = await api.get("/api/admin/extern_employees/")
      
      const internEmployees = internResponse.data.map((emp: any) => ({
        ...emp,
        type: "intern_employee",
      }))

      const externEmployees = externResponse.data.map((emp: any) => ({
        ...emp,
        type: "extern_employee",
      }))

      return [
         ...internEmployees,
         ...externEmployees,
        ]
    },
  })

  const {
    data: clients,
    isLoading: isClientsLoading,
  } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const response = await api.get("/api/admin/clients")
      return response.data
    },
  })

  if (isLoading || isClientsLoading) {
    return (
      <AdminLayout>
        <div className="flex h-full items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-cyan-600"></div>
            <span className="text-lg font-medium text-gray-700">Loading dashboard data...</span>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <div className="flex items-center space-x-2 rounded-lg bg-cyan-50 px-3 py-1.5 text-sm font-medium text-cyan-700">
            <span>Today: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Employees"
            value={employees?.length || 0}
            icon={<Users className="h-6 w-6 text-cyan-600" />}
            trend={+5}
            link="/admin/employees"
          />
          <StatCard
            title="Total Clients"
            value={clients.length || 0}
            icon={<Users className="h-6 w-6 text-indigo-600" />}
            trend={+12}
            link="/admin/clients"
          />
          <StatCard
            title="Today's Services"
            value={(statslocal?.total_appointments || 0) + (statsdomiciel?.total_appointments || 0)}
            icon={<Car className="h-6 w-6 text-emerald-600" />}
            trend={+3}
            link="/admin/services"
          />
          <StatCard
            title="Today's Revenue"
            value={revenue?.total_revenue || 0}
            isCurrency={true}
            icon={<DollarSign className="h-6 w-6 text-amber-600" />}
            trend={+8}
            link="/admin/revenue"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Service Locations</h2>
              <div className="rounded-lg bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700">Today</div>
            </div>
            <div className="h-64">
              <div className="flex h-full items-end justify-around">
                <div className="flex w-1/3 flex-col items-center">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100">
                    <Home className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div className="relative h-40 w-24 overflow-hidden rounded-t-lg bg-gradient-to-t from-cyan-600 to-cyan-500">
                    <div className="absolute bottom-2 left-0 right-0 text-center text-sm font-bold text-white">
                       {statslocal?.total_appointments|| 0}
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-700">Local</p>
                </div>
                <div className="flex w-1/3 flex-col items-center">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                    <Car className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="relative h-28 w-24 overflow-hidden rounded-t-lg bg-gradient-to-t from-indigo-600 to-indigo-500">
                    <div className="absolute bottom-2 left-0 right-0 text-center text-sm font-bold text-white">
                      {statsdomiciel?.total_appointments|| 0}
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-700">External</p>
                </div>
              </div>
            </div>
          </div>
          <FeedbackSummaryWidget />
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Revenue Overview</h2>
              {/* <select className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select> */}
            </div>
            <div className="h-64">
              <RevenueChart />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Recent Appointments</h2>
            <div className="flex items-center space-x-2">
              <div className="rounded-lg bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700">
                <span className="flex items-center">
                  <Calendar className="mr-1 h-3.5 w-3.5" />
                  Today
                </span>
              </div>
              <button className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1">
                View All
              </button>
            </div>
          </div>
          <AppointmentsTable />
        </div>
      </div>
    </AdminLayout>
  )
}


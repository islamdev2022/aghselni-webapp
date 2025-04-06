import { Users, Calendar, DollarSign, Car, Home } from "lucide-react"
import AdminLayout from "../../components/layouts/AdminLayout"
import StatCard from "../../components/admin/StatCard"
import RevenueChart from "../../components/admin/RevenueChart"
import AppointmentsTable from "../../components/admin/AppointmentsTable"
import FeedbackSummaryWidget from "../../components/admin/FeedbackSummary"
import { useGetStats,useAdminRevenue, useEmployees, useClients } from "@/hooks"

export default function AdminDashboard() {
  const { data: statslocal  } = useGetStats("i")
  console.log("stats" , statslocal)

  const { data: statsdomiciel  } = useGetStats("e") //here it will be an error
  console.log("stats" , statsdomiciel)

  

  // Get revenue data
  const { data: revenue, isLoading: isRevenueLoading } = useAdminRevenue();
  
  // Get employees data
  const { data: employees, isLoading: isEmployeesLoading } = useEmployees();
  
  // Get clients data
  const { data: clients, isLoading: isClientsLoading } = useClients();

  if (isEmployeesLoading || isClientsLoading || isRevenueLoading) {
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
                  All
                </span>
              </div>
            </div>
          </div>
          <AppointmentsTable />
        </div>
      </div>
    </AdminLayout>
  )
}


import { User, Star, Car, Users, CheckCircle } from "lucide-react";
import { useExtEmployeeDetails } from "@/hooks";
import ExternEmployeeLayout from "@/components/layouts/ExternEmployeeLayout";
import StatCard from "@/components/extern-employee/StatCard";
import AppointmentTabs from "@/components/extern-employee/AppointemntTabs";

export default function ExternEmployeeDashboard() {
  const { data: employeeData, isLoading: isEmployeeLoading } = useExtEmployeeDetails()
  console.log("emloyee data in dashboard", employeeData);

  if (isEmployeeLoading) {
    return (
      <ExternEmployeeLayout>
        <div className="flex h-full items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-cyan-600"></div>
            <span className="text-lg font-medium text-gray-700">
              Loading dashboard data...
            </span>
          </div>
        </div>
      </ExternEmployeeLayout>
    );
  }

  const employee = employeeData?.employee;
  const totalCarsWashed = employeeData?.total_cars_washed || 0;
  const totalClients = employeeData?.total_clients || 0;

  return (
    <ExternEmployeeLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {employee?.full_name}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              External Employee Dashboard
            </p>
          </div>
          <div className="flex items-center space-x-2 rounded-lg bg-cyan-50 px-3 py-1.5 text-sm font-medium text-cyan-700">
            <span>Today: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Employee Profile Card */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-cyan-600 to-cyan-500 text-white">
              {employeeData?.employee?.profile_image ? (
                <img
                  src={`http://127.0.0.1:8000${employeeData?.employee?.profile_image}`}
                  alt=""
                  className="rounded-full"
                />
              ) : (
                <span className="text-2xl font-bold">
                  {employee?.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-gray-800">
                {employee?.full_name}
              </h2>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-500 sm:justify-start">
                <span className="flex items-center">
                  <User className="mr-1 h-4 w-4" />
                  ID: {employee?.id}
                </span>
                <span className="flex items-center">
                  <Star className="mr-1 h-4 w-4 text-amber-400" />
                  Rating: {employee?.final_rating.toFixed(1)}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-500 sm:justify-start">
                <span>{employee?.email}</span>
                <span>•</span>
                <span>{employee?.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Cars Washed"
            value={totalCarsWashed}
            icon={<Car className="h-6 w-6 text-cyan-600" />}
            trend={+8}
          />
          <StatCard
            title="Total Clients"
            value={totalClients}
            icon={<Users className="h-6 w-6 text-indigo-600" />}
            trend={+5}
          />
          <StatCard
            title="Rating"
            value={employee?.final_rating || 0}
            icon={<Star className="h-6 w-6 text-amber-600" />}
            isDecimal={true}
            trend={+2}
          />
          <StatCard
            title="Completed Today"
            value={0}
            icon={<CheckCircle className="h-6 w-6 text-emerald-600" />}
            trend={0}
          />
        </div>

        {/* Appointments Tabs */}
        <AppointmentTabs />
      </div>
    </ExternEmployeeLayout>
  );
}

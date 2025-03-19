"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { BarChart, LineChart, Calendar, ArrowUp } from "lucide-react"
import api from "@/api"
import AdminLayout from "@/components/layouts/AdminLayout"
import {
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface StatisticsData {
  servicesByType: {
    name: string
    value: number
  }[]
  servicesByLocation: {
    name: string
    value: number
  }[]
  revenueByMonth: {
    name: string
    value: number
  }[]
  appointmentsByDay: {
    name: string
    completed: number
    cancelled: number
  }[]
}

export default function StatisticsPage() {
  const [timeRange, setTimeRange] = useState("month")

  const { data: stats, isLoading } = useQuery({
    queryKey: ["statistics", timeRange],
    queryFn: async () => {
      const response = await api.get<StatisticsData>(`/api/admin/statistics?range=${timeRange}`)
      return response.data
    },
  })

  // Sample data for demonstration
  const sampleData: StatisticsData = {
    servicesByType: [
      { name: "Full Wash", value: 45 },
      { name: "Interior Cleaning", value: 30 },
      { name: "Express Wash", value: 60 },
      { name: "Premium Wash", value: 25 },
    ],
    servicesByLocation: [
      { name: "Local", value: 85 },
      { name: "External", value: 75 },
    ],
    revenueByMonth: [
      { name: "Jan", value: 4000 },
      { name: "Feb", value: 5000 },
      { name: "Mar", value: 6000 },
      { name: "Apr", value: 7000 },
      { name: "May", value: 8000 },
      { name: "Jun", value: 9000 },
    ],
    appointmentsByDay: [
      { name: "Mon", completed: 12, cancelled: 2 },
      { name: "Tue", completed: 15, cancelled: 1 },
      { name: "Wed", completed: 18, cancelled: 3 },
      { name: "Thu", completed: 14, cancelled: 2 },
      { name: "Fri", completed: 20, cancelled: 1 },
      { name: "Sat", completed: 25, cancelled: 0 },
      { name: "Sun", completed: 10, cancelled: 1 },
    ],
  }

  const displayData = stats || sampleData

  const COLORS = ["#0891b2", "#6366f1", "#ec4899", "#f59e0b", "#10b981"]

  const totalServices = displayData.servicesByType.reduce((sum, item) => sum + item.value, 0)
  const totalRevenue = displayData.revenueByMonth.reduce((sum, item) => sum + item.value, 0)
  const totalAppointments = displayData.appointmentsByDay.reduce(
    (sum, item) => sum + item.completed + item.cancelled,
    0,
  )

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold text-gray-800">Statistics & Analytics</h1>
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>

        {isLoading ? (
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
                  <p className="mt-1 text-2xl font-bold text-gray-800">${totalRevenue.toLocaleString()}</p>
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
                  <p className="mt-1 text-2xl font-bold text-gray-800">{totalAppointments}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">Services by Type</h2>
                  <div className="rounded-lg bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700">
                    {timeRange === "week"
                      ? "Last Week"
                      : timeRange === "month"
                        ? "Last Month"
                        : timeRange === "quarter"
                          ? "Last Quarter"
                          : "Last Year"}
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={displayData.servicesByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {displayData.servicesByType.map((item, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} services`, "Count"]} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">Services by Location</h2>
                  <div className="rounded-lg bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700">
                    {timeRange === "week"
                      ? "Last Week"
                      : timeRange === "month"
                        ? "Last Month"
                        : timeRange === "quarter"
                          ? "Last Quarter"
                          : "Last Year"}
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={displayData.servicesByLocation}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} services`, "Count"]} />
                      <Bar dataKey="value" fill="#0891b2" radius={[4, 4, 0, 0]} barSize={60} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">Revenue Trend</h2>
                  <div className="rounded-lg bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700">
                    {timeRange === "week"
                      ? "Last Week"
                      : timeRange === "month"
                        ? "Last Month"
                        : timeRange === "quarter"
                          ? "Last Quarter"
                          : "Last Year"}
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={displayData.revenueByMonth}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#0891b2"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">Appointments by Day</h2>
                  <div className="rounded-lg bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700">
                    {timeRange === "week"
                      ? "Last Week"
                      : timeRange === "month"
                        ? "Last Month"
                        : timeRange === "quarter"
                          ? "Last Quarter"
                          : "Last Year"}
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={displayData.appointmentsByDay}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                      <Bar dataKey="cancelled" name="Cancelled" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}


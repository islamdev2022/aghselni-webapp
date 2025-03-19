"use client"

import { useState } from "react"
import { useQuery,useQueryClient,useMutation } from "@tanstack/react-query"
import { Search, Plus, Edit, Trash2, UserCog,  Phone } from "lucide-react"
import  api  from "@/api"
import AdminLayout from "@/components/layouts/AdminLayout"
import { Link } from "react-router-dom"
interface Employee {
  id: number
  name: string
  email: string
  phone: string
  type: "intern_employee" | "extern_employee"
  status: "active" | "inactive"
  joinDate: string
}

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const queryClient = useQueryClient()
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
         ...externEmployees]
    },
  })

  const deleteEmployee = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/admin/intern_employee/${id}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] })
    },
    onError: (error: any) => {
      console.error(error)
    }
  })

  const handleDeleteEmployee = async (id: number) => {
    await deleteEmployee.mutateAsync(id)


  }
  console.log(employees)
  if (isLoading) {
    return (
        <AdminLayout>
        <div className="flex h-64 items-center justify-center">
            <div className="flex items-center space-x-2">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-cyan-600"></div>
            <span className="text-lg font-medium text-gray-700">Loading employees...</span>
            </div>
        </div>
        </AdminLayout>
    )
}

const displayEmployees = employees;

const filteredEmployees = displayEmployees?.filter((employee) => {
  const matchesSearch =
    employee.employee.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employee.phone?.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesFilter =
    filterType === "all" ||
    (filterType === "intern" && employee.type === "intern_employee") ||
    (filterType === "extern" && employee.type === "extern_employee");

  return matchesSearch && matchesFilter;
});

return (
  <AdminLayout>
    <div className="space-y-6 p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-gray-800">Employees Management</h1>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search employees..."
              className="w-full rounded-lg border border-gray-200 pl-10 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              className="h-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="intern">Internal</option>
              <option value="extern">External</option>
            </select>
          </div>
          <Link to="/admin/employees/add">
            <button className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-cyan-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2">
              <Plus className="h-4 w-4" />
              Add Employee
            </button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-cyan-600"></div>
            <span className="text-lg font-medium text-gray-700">Loading employees...</span>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Contact</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Rating</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Stats</th>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees?.map((employee, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-800">
                      <div className="flex items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
                          <span className="text-sm font-medium">
                            {employee.employee.full_name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                          </span>
                        </div>
                        <span className="ml-2">{employee.employee.full_name}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      <div className="flex flex-col">
                        <div className="flex items-center mt-1">
                          <Phone className="mr-1 h-3.5 w-3.5 text-gray-400" />
                          {employee.employee.phone}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          employee.type === "intern_employee"
                            ? "bg-cyan-50 text-cyan-700"
                            : "bg-indigo-50 text-indigo-700"
                        }`}
                      >
                        <UserCog className="mr-1 h-3 w-3" />
                        {employee.type === "intern_employee" ? "Internal" : "External"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-50 text-yellow-700">
                        {employee.employee.final_rating || 0}/5
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      <div className="flex flex-col">
                        <div>Cars washed: {employee.total_cars_washed}</div>
                        <div>Total clients: {employee.total_clients}</div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <div className="flex space-x-2">
                        <button className="rounded-lg border border-gray-200 bg-white p-1.5 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteEmployee(employee.employee.id)}
                        className="rounded-lg border border-gray-200 bg-white p-1.5 text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEmployees?.length === 0 && (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <UserCog className="mx-auto h-10 w-10 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{filteredEmployees?.length}</span> of{" "}
              <span className="font-medium">{displayEmployees?.length}</span> employees
            </div>
            <div className="flex space-x-1">
              <button className="rounded-md border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <button className="rounded-md bg-cyan-50 px-3 py-1 text-sm font-medium text-cyan-700 hover:bg-cyan-100">
                1
              </button>
              <button className="rounded-md border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </AdminLayout>
);
}


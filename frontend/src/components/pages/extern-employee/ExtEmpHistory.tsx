import { useQuery } from "@tanstack/react-query"
import api from "@/api"
import ExternEmployeeLayout from "@/components/layouts/ExternEmployeeLayout"
import { Car, Users } from "lucide-react"
import LoadingSkeleton from "@/LoadingSkeleton"
interface EmployeeDetails {
    id: number
    full_name: string
    phone: string
    age: number
    final_rating: number
    email: string
    profile_image?: string
  }
  
  interface HistoryRecord {
    id: number
    client_name: string
    cars_washed: number
    appointment_details: string | { car_name: string; wash_type: string }
  }
  
  interface EmployeeData {
    employee: EmployeeDetails
    history: HistoryRecord[]
    total_cars_washed: number
    total_clients: number
  }
  
const ExtEmpHistory = () => {

    // Get employee profile data
  const {
    isLoading,
    data: employeeData,
  } = useQuery({
    queryKey: ["extern-employee-details"],
    queryFn: async () => {
      try {
        const response = await api.get<EmployeeData>("/api/extern_employee/details/")
        return response.data
      } catch (error: any) {
        if (error.response && error.response.status === 403) {
          // If unauthorized, redirect to login
        }
        throw error
      }
    },
  })
  if (isLoading) {
    return (
      <ExternEmployeeLayout>
        <div className="flex h-full items-center justify-center">
          <LoadingSkeleton />
        </div>
      </ExternEmployeeLayout>
    )
  }
    return (
      <ExternEmployeeLayout>
 <div className="container mx-auto px-4 py-8">
       {/* Stats Cards */}
     <div className="max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2">
     <div className="rounded-xl bg-white p-6 shadow-sm">
       <div className="flex items-center">
         <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-50">
           <Car className="h-6 w-6 text-cyan-600" />
         </div>
         <div className="ml-4">
           <h3 className="text-sm font-medium text-gray-500">Cars Washed</h3>
           <p className="mt-1 text-2xl font-bold text-gray-800">{employeeData?.total_cars_washed}</p>
         </div>
       </div>
     </div>

     <div className="rounded-xl bg-white p-6 shadow-sm">
       <div className="flex items-center">
         <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50">
           <Users className="h-6 w-6 text-indigo-600" />
         </div>
         <div className="ml-4">
           <h3 className="text-sm font-medium text-gray-500">Total Clients</h3>
           <p className="mt-1 text-2xl font-bold text-gray-800">{employeeData?.total_clients}</p>
         </div>
       </div>
     </div>
   </div>
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Service History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Client
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Cars Washed
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {employeeData?.history.map((record) => (
                <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-800">
                    {record.client_name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{record.cars_washed}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {typeof record.appointment_details === "object"
                      ? `${record.appointment_details.car_name} - ${record.appointment_details.wash_type}`
                      : record.appointment_details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
 </div>

      </ExternEmployeeLayout>
      )
}
export default ExtEmpHistory
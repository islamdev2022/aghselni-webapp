import { Clock, Car, MapPin, DollarSign } from "lucide-react"
import StatusBadge from "./StatusBadge"
import ClientInfo from "./ClientInfo"

interface Appointment {
  id: string;
  time: string;
  car_name: string;
  car_type: string;
  wash_type: string;
  place: string;
  price: number;
  status: "Pending" | "Completed" | "In Progress" | "Cancelled";
  client_info?: {
    name: string;
    phone: string;
    photo: string;
    full_name: string;
  };
}

export default function AppointmentTable({ 
  appointments,
  showClient = false, 
  claimMutation = null,
  handleClaimAppointment ,
  handleViewDetails,
  openStatusModal,
}: {
  appointments: Appointment[];
  showClient?: boolean;
  claimMutation?: any;
  handleClaimAppointment?: (id: string) => void;
  handleViewDetails?: (appointment: any) => void;
  openStatusModal: (appointment: any) => void,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {showClient && (
              <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Client</th>
            )}
            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Time</th>
            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Car</th>
            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">
              Service Type
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">
              Location
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Price</th>
            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50">
              {showClient && (
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-800">
                  <ClientInfo client={appointment.client_info} />
                </td>
              )}
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4 text-gray-400" />
                  {appointment.time}
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
                  <MapPin className="mr-1 h-4 w-4 text-gray-400" />
                  {appointment.place}
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <DollarSign className="mr-1 h-4 w-4 text-gray-400" />
                  {appointment.price}
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <StatusBadge status={appointment.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <div className="flex space-x-2">
                  {handleClaimAppointment && (
                    <button
                      onClick={() => handleClaimAppointment(appointment.id)}
                      disabled={claimMutation?.isPending}
                      className="rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700 hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1"
                    >
                      {claimMutation?.isPending && claimMutation?.variables === appointment.id ? (
                        <span className="flex items-center">
                          <svg className="mr-1 h-3 w-3 animate-spin" viewBox="0 0 24 24">
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
                          Claiming...
                        </span>
                      ) : (
                        "Claim"
                      )}
                    </button>
                  )}
                  
                  {handleViewDetails && (
                    <button
                      onClick={() => handleViewDetails(appointment)}
                      className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1"
                    >
                      View
                    </button>
                  )}
                  
                  {openStatusModal && (
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
  )
}
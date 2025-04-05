import React from "react"
import { X, User, Phone } from "lucide-react"
import StatusBadge from "./StatusBadge"
import Loading from "@/loading"
interface AppointmentDetailModalProps {
  selectedAppointment: any,
    appointmentDetails: any, 
    isDetailsLoading: boolean,
    openStatusModal: (appointment: any) => void,
    onClose: () => void
}
export default function AppointmentDetailModal({ 
  selectedAppointment, 
  isDetailsLoading, 
  openStatusModal, 
  onClose 
} : AppointmentDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Appointment Details</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isDetailsLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loading />
          </div>
        ) : (
          <>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <AppointmentInfoSection appointment={selectedAppointment} />
              <ServiceDetailsSection appointment={selectedAppointment} />
            </div>

            {selectedAppointment.client_info && (
              <ClientDetailsSection client={selectedAppointment.client_info} />
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => openStatusModal(selectedAppointment)}
                className="rounded-lg bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700 hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1"
              >
                Update Status
              </button>
              <button
                onClick={onClose}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function AppointmentInfoSection({ appointment } : AppointmentDetailModalProps["selectedAppointment"]) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <h4 className="mb-3 text-sm font-semibold text-gray-700">Appointment Information</h4>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">ID:</span>
          <span className="text-sm font-medium text-gray-700">#{appointment.id}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Time:</span>
          <span className="text-sm font-medium text-gray-700">{appointment.time}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Status:</span>
          <span><StatusBadge status={appointment.status} /></span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Price:</span>
          <span className="text-sm font-medium text-gray-700">${appointment.price}</span>
        </div>
      </div>
    </div>
  )
}

function ServiceDetailsSection({ appointment } : AppointmentDetailModalProps["selectedAppointment"]) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <h4 className="mb-3 text-sm font-semibold text-gray-700">Service Details</h4>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Car:</span>
          <span className="text-sm font-medium text-gray-700">
            {appointment.car_name} ({appointment.car_type})
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Service Type:</span>
          <span className="text-sm font-medium text-gray-700">{appointment.wash_type}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Location:</span>
          <span className="text-sm font-medium text-gray-700">{appointment.place}</span>
        </div>
      </div>
    </div>
  )
}

function ClientDetailsSection({ client } : AppointmentDetailModalProps["selectedAppointment"]["client_info"]) {
  if (!client) return null
  return (
    <div className="mb-6 rounded-lg bg-gray-50 p-4">
      <h4 className="mb-3 text-sm font-semibold text-gray-700">Client Information</h4>
      <div className="flex items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
          {client.photo ? (
            <img
              src={`http://127.0.0.1:8000${client.photo}` || ""}
              alt={client.full_name}
              className="h-full w-full rounded-full object-cover"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                const target = e.target as HTMLImageElement;
                const parent = target.parentElement;
                target.onerror = null;
                target.style.display = 'none';
                if (parent) {
                  const fallbackIcon = parent.querySelector('.fallback-icon') as HTMLElement;
                  if (fallbackIcon) {
                    fallbackIcon.style.display = 'block';
                  }
                }
              }}
            />
          ) : null}
          <User className="fallback-icon h-6 w-6" style={{ display: client.photo ? 'none' : 'block' }} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-900">{client.full_name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center">
              <Phone className="mr-1 h-3 w-3" />
              {client.phone}
            </span>
            <span className="flex items-center">
              <User className="mr-1 h-3 w-3" />
              Age: {client.age}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
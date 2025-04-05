import { X, Clock, CheckCircle } from "lucide-react"

interface UpdateStatusModalProps {
  selectedAppointment: {
    id: number;
    car_name: string;
    wash_type: string;
    status: string;
  };
  newStatus: string;
  setNewStatus: (status: string) => void;
  handleUpdateStatus: () => void;
  updateStatusMutation: {
    isPending: boolean;
  };
  onClose: () => void;
}

export default function UpdateStatusModal({ 
  selectedAppointment, 
  newStatus, 
  setNewStatus, 
  handleUpdateStatus, 
  updateStatusMutation, 
  onClose 
}: UpdateStatusModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Update Appointment Status</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="mb-4 text-sm text-gray-600">
            Update the status for appointment #{selectedAppointment.id} - {selectedAppointment.car_name} (
            {selectedAppointment.wash_type})
          </p>

          <StatusOptions newStatus={newStatus} setNewStatus={setNewStatus} />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateStatus}
            disabled={updateStatusMutation.isPending || newStatus === selectedAppointment.status}
            className="rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-cyan-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1 disabled:opacity-70"
          >
            {updateStatusMutation.isPending ? (
              <span className="flex items-center">
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
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
                Updating...
              </span>
            ) : (
              "Update Status"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function StatusOptions({ newStatus, setNewStatus } : {newStatus : UpdateStatusModalProps["newStatus"] , setNewStatus : UpdateStatusModalProps["setNewStatus"]}) {
  const options = [
    { value: "Pending", icon: <Clock className="mr-2 h-4 w-4 text-amber-500" />, label: "Pending" },
    { value: "In Progress", icon: <Clock className="mr-2 h-4 w-4 text-blue-500" />, label: "In Progress" },
    { value: "Completed", icon: <CheckCircle className="mr-2 h-4 w-4 text-green-500" />, label: "Completed" },
    { value: "Deleted", icon: <X className="mr-2 h-4 w-4 text-red-500" />, label: "Deleted" }
  ];

  return (
    <div className="space-y-3">
      {options.map(option => (
        <label key={option.value} className="flex cursor-pointer items-center rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
          <input
            type="radio"
            name="status"
            value={option.value}
            checked={newStatus === option.value}
            onChange={() => setNewStatus(option.value)}
            className="h-4 w-4 text-cyan-600 focus:ring-cyan-500"
          />
          <span className="ml-3 flex items-center">
            {option.icon}
            <span className="text-sm font-medium text-gray-700">{option.label}</span>
          </span>
        </label>
      ))}
    </div>
  )
}
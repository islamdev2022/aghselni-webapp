import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import AppointmentTabs from "./AppointmentTabs";
import AppointmentTable from "./AppointmentTable";
import AppointmentDetailModal from "./AppointmentDetailModal";
import UpdateStatusModal from "./UpdateStatusModal";
import {
  usePendingAppointments,
  useClaimedAppointments,
  useAppointmentDetails,
  useClaimAppointment,
  useUpdateAppointmentStatus,
} from "@/hooks";
import EmptyState from "./EmtpyState";
import Loading from "@/loading";

export default function AppointmentDashboard() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"pending" | "claimed">("pending");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  // Custom hooks for queries and mutations
  const { data: pendingAppointments, isLoading: isPendingLoading } =
    usePendingAppointments();
  const { data: claimedAppointments, isLoading: isClaimedLoading } =
    useClaimedAppointments();
  const { data: appointmentDetails, isLoading: isDetailsLoading } =
    useAppointmentDetails(selectedAppointment?.id);

  // Mutation hooks
  const claimMutation = useClaimAppointment(queryClient);
  const updateStatusMutation = useUpdateAppointmentStatus(queryClient, () => {
    setShowStatusModal(false);
    setShowDetailModal(false);
  });

  const handleClaimAppointment = (appointmentId: string) => {
    claimMutation.mutate(Number(appointmentId));
  };

  interface Appointment {
    id: number;
    status: string;
    car_name: string;
    wash_type: string;
  }
  const handleViewDetails = (appointment: Appointment): void => {
    setSelectedAppointment(appointment);
    setShowDetailModal(true);
  };

  const handleUpdateStatus = () => {
    if (selectedAppointment && newStatus) {
      updateStatusMutation.mutate({
        id: selectedAppointment.id,
        status: newStatus,
      } as { id: number; status: string });
    }
  };

  const openStatusModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNewStatus(appointment.status);
    setShowStatusModal(true);
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <AppointmentTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Pending Appointments Tab */}
      {activeTab === "pending" && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Available Appointments
          </h3>
          {isPendingLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loading />
            </div>
          ) : pendingAppointments && pendingAppointments.length > 0 ? (
            <AppointmentTable
              appointments={pendingAppointments}
              showClient={false}
              claimMutation={claimMutation}
              handleClaimAppointment={handleClaimAppointment}
              openStatusModal={openStatusModal}
            />
          ) : (
            <EmptyState
              icon={<Calendar className="h-10 w-10 text-gray-400" />}
              message="No pending appointments available"
            />
          )}
        </div>
      )}

      {/* Claimed Appointments Tab */}
      {activeTab === "claimed" && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            My Appointments
          </h3>
          {isClaimedLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loading />
            </div>
          ) : claimedAppointments && claimedAppointments.length > 0 ? (
            <AppointmentTable
              appointments={claimedAppointments}
              showClient={true}
              handleViewDetails={handleViewDetails}
              openStatusModal={openStatusModal}
            />
          ) : (
            <EmptyState
              icon={<Calendar className="h-10 w-10 text-gray-400" />}
              message="You haven't claimed any appointments yet"
            />
          )}
        </div>
      )}

      {/* Modals */}
      {showDetailModal && selectedAppointment && (
        <AppointmentDetailModal
          selectedAppointment={selectedAppointment}
          appointmentDetails={appointmentDetails}
          isDetailsLoading={isDetailsLoading}
          openStatusModal={openStatusModal}
          onClose={() => setShowDetailModal(false)}
        />
      )}

      {showStatusModal && selectedAppointment && (
        <UpdateStatusModal
          selectedAppointment={selectedAppointment}
          newStatus={newStatus}
          setNewStatus={setNewStatus}
          handleUpdateStatus={handleUpdateStatus}
          updateStatusMutation={updateStatusMutation}
          onClose={() => setShowStatusModal(false)}
        />
      )}
    </div>
  );
}

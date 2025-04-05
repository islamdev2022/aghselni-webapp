import { useQuery, useMutation, QueryClient } from "@tanstack/react-query"
import api from "@/api"

// Query hooks
export function usePendingAppointments() {
  return useQuery({
    queryKey: ["pending-appointments"],
    queryFn: async () => {
      const response = await api.get("/api/appointments_domicile/get_all")
      return response.data
    },
  })
}

export function useClaimedAppointments() {
  return useQuery({
    queryKey: ["claimed-appointments"],
    queryFn: async () => {
      const response = await api.get("/api/appointments_domicile/get")
      return response.data
    },
  })
}

interface Appointment {
    id: number;
    status: string;
    // Add other appointment properties as needed
}

export function useAppointmentDetails(appointmentId: number | undefined) {
    return useQuery<Appointment | null>({
        queryKey: ["appointment-details", appointmentId],
        queryFn: async () => {
            if (!appointmentId) return null;
            const response = await api.get(`/api/appointments_domicile/${appointmentId}/`);
            return response.data;
        },
        enabled: !!appointmentId,
    });
}

// Mutation hooks
interface ClaimAppointmentResponse {
    // Add specific response properties based on your API
    success: boolean;
    message?: string;
}

export function useClaimAppointment(queryClient: QueryClient) {
    return useMutation<ClaimAppointmentResponse, Error, number>({
        mutationFn: async (appointmentId: number) => {
            const response = await api.post(`/api/appointments_domicile/${appointmentId}/claim`)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pending-appointments"] })
            queryClient.invalidateQueries({ queryKey: ["claimed-appointments"] })
        },
    })
}

export function useUpdateAppointmentStatus(queryClient: QueryClient, onSuccessCallback?: () => void) {
  return useMutation({
    mutationFn: async ({ id, status } : Appointment) => {
      const response = await api.put(`/api/appointments_domicile/${id}/`, { status })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["claimed-appointments"] })
      if (onSuccessCallback) onSuccessCallback()
    },
  })
}
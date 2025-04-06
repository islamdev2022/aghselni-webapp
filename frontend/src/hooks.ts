import { useQuery, useMutation, QueryClient,useQueryClient } from "@tanstack/react-query"
import api from "@/api"
import { useState } from 'react';

// ________________________________________________________Query hooksfor extern employee__________________________________________________ 
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
interface EmployeeDetails {
    id: number;
    full_name: string;
    phone: string;
    age: number;
    final_rating: number;
    email: string;
    profile_image: string | null;
  }
  
  interface HistoryRecord {
    id: number;
    client_name: string;
    cars_washed: number;
    appointment_details: string | { car_name: string; wash_type: string };
  }
  
interface EmployeeData {
    employee: EmployeeDetails;
    history: HistoryRecord[];
    total_cars_washed: number;
    total_clients: number;
  }

export function useExtEmployeeDetails (){
    return useQuery({
        queryKey: ["extern-employee-details"],
        queryFn: async () => {
          const response = await api.get<EmployeeData>(
            "/api/extern_employee/details/"
          );
          return response.data;
        },
      });
}

// Mutation hooks
interface ClaimAppointmentResponse {
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

export function useUpdateExternProfile() {
    const queryClient = useQueryClient();

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState<any>({});
  
    const updateProfileMutation = useMutation({
      mutationFn: async (data: FormData) => {
        const response = await api.put("/api/extern_employee/profile/", data);
        return response.data;
      },
      onSuccess: () => {
        setSuccessMessage("Profile updated successfully!");
        setIsEditing(false);
        queryClient.invalidateQueries({ queryKey: ['externProfile'] }); // Replace with your actual query key
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      },
      onError: (error: any) => {
        console.error("Update error:", error);
        if (error.response?.data) {
          setErrors(error.response.data);
        } else {
          setErrors({
            general: "An error occurred while updating your profile.",
          });
        }
      },
    });
  
    return {
      updateProfileMutation,
      successMessage,
      setSuccessMessage,
      isEditing,
      setIsEditing,
      errors,
      setErrors,
    };
  }

// _______________________________________________________Query hooks for admin______________________________________________


interface DashboardStats {
    date: string
    total_appointments: number
  }
export function useGetDomicielAppointments (){
    return useQuery({
        queryKey: ["domicile-appointments"],
        queryFn: async () => {
          const response = await api.get("/api/appointments_domicile/get")
          return response.data
        },
      })
}
export function useGetInternAppointments (){
    return useQuery({
        queryKey: ["intern-appointments"],
        queryFn: async () => {
          const response = await api.get("/api/appointments_location/get")
          return response.data
        },
      })
}

export function useGetStats(type : string) {
    return useQuery({
        queryKey: ["admin-stats"],
        queryFn: async () => {
          const response = await api.get<DashboardStats>(`/api/admin/appointments/stats/${type}`);
          return response.data
        },
      })
}

/**
 * Hook to fetch combined revenue data from internal and external appointments
 */
export function useAdminRevenue() {
    return useQuery({
      queryKey: ["admin-revenue"],
      queryFn: async () => {
        const responsei = await api.get("/api/admin/appointments/revenue/i");
        const responsee = await api.get("/api/admin/appointments/revenue/e");
        return {
          total_revenue: responsei.data.total_revenue + responsee.data.total_revenue
        };
      }
    });
  }
  
  /**
   * Hook to fetch combined employee data (both internal and external)
   */
  export function useEmployees() {
    return useQuery({
      queryKey: ["employees"],
      queryFn: async () => {
        const internResponse = await api.get("/api/admin/intern_employees/");
        const externResponse = await api.get("/api/admin/extern_employees/");
        
        const internEmployees = internResponse.data.map((emp: any) => ({
          ...emp,
          type: "intern_employee",
        }));
  
        const externEmployees = externResponse.data.map((emp: any) => ({
          ...emp,
          type: "extern_employee",
        }));
  
        return [
          ...internEmployees,
          ...externEmployees,
        ];
      }
    });
  }
  interface Employee {
    employee: {
      id: number;
      // other employee properties
    };
    type: "intern_employee" | "extern_employee";
  }
  
  /**
   * Hook for deleting employees
   * @param employees - The list of employees from which to find the employee type
   */
  export function useDeleteEmployee(employees?: Employee[]) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
    const queryClient = useQueryClient();

    const deleteEmployeeMutation = useMutation({
      mutationFn: async (id: number) => {
        const employeeToDelete = employees?.find(emp => emp.employee.id === id);
        if (employeeToDelete?.type === "intern_employee") {
          return await api.delete(`/api/admin/intern_employee/${id}/`);
        } else {
          return await api.delete(`/api/admin/extern_employee/${id}/`);
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["employees"] });
        setShowDeleteModal(false);
        setSelectedEmployeeId(null);
      },
      onError: (error: any) => {
        console.error("Delete employee error:", error);
      }
    });
  
    const confirmDelete = (id: number) => {
      setSelectedEmployeeId(id);
      setShowDeleteModal(true);
    };
  
    const handleDelete = () => {
      if (selectedEmployeeId !== null) {
        deleteEmployeeMutation.mutate(selectedEmployeeId);
      }
    };
  
    const cancelDelete = () => {
      setShowDeleteModal(false);
      setSelectedEmployeeId(null);
    };
  
    return {
      deleteEmployeeMutation,
      showDeleteModal,
      selectedEmployeeId,
      confirmDelete,
      handleDelete,
      cancelDelete
    };
  }
  /**
   * Hook to fetch all clients
   */
  export function useClients() {
    return useQuery({
      queryKey: ["clients"],
      queryFn: async () => {
        const response = await api.get("/api/admin/clients");
        return response.data;
      }
    });
  }

export function useDeleteClient(){
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [clientToDelete, setClientToDelete] = useState<number | null>(null)
    const queryClient = useQueryClient()
    const deleteMutation = useMutation({
        mutationFn: async (clientId: number) => {
          await api.delete(`/api/admin/client/${clientId}/`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients"] })
            setShowDeleteModal(false)
          setClientToDelete(null)
        },
      })
    return {
        showDeleteModal,
        setShowDeleteModal,
        clientToDelete,
        setClientToDelete,
        deleteMutation
    }
}

// Types
export interface EmployeeFormData {
    full_name: string;
    email: string;
    phone: string;
    age: number;
    type: "intern_employee" | "extern_employee";
    password: string;
    confirmPassword: string;
    profileImage?: File;
  }
  
  export interface FormErrors {
    [key: string]: string;
  }
  import { useNavigate } from 'react-router-dom';

  /**
   * Hook for employee registration
   */
  export function useRegisterEmployee() {
    const [errors, setErrors] = useState<FormErrors>({});
    const navigate = useNavigate();
  
    const registerMutation = useMutation({
      mutationFn: async (data: EmployeeFormData) => {
        const endpoint =
          data.type === "intern_employee" 
            ? "/api/auth/intern_employee/register/" 
            : "/api/auth/extern_employee/register/";
  
        const response = await api.post(endpoint, {
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          password: data.password,
          age: data.age,
        });
  
        return response.data;
      },
      onSuccess: () => {
        navigate("/admin/employees");
      },
      onError: (error: any) => {
        console.error("Registration error:", error);
        if (error.response?.data) {
          setErrors(error.response.data);
        } else {
          setErrors({
            general: "An error occurred while registering the employee.",
          });
        }
      },
    });
  
    return {
      registerMutation,
      errors,
      setErrors
    };
  }
export interface Feedback {
    id: number;
    name: string;
    email: string;
    content: string;
    rating: number;
    created_at: string;
    approved : boolean
  }
  export function useGetFeedbacks(){
    return useQuery({
        queryKey: ["admin-feedbacks"],
        queryFn: async () => {
          const response = await api.get<Feedback[]>("/api/admin/feedbacks")
          return response.data
        },
      })
  }

export interface FeedbackSummary {
    total: number
    not_approved: number
    approved: number
    resolved: number
    average_rating: number
  }
export function useGetFeedbacksSummary(){
  return useQuery({
    queryKey: ["feedback-summary"],
    queryFn: async () => {
      const response = await api.get<FeedbackSummary>("/api/admin/feedbacks/summary/")
      return response.data
    },
  })
}
  export function useUpdateFeedback() {
    // Get the query client from the hook
    const queryClient = useQueryClient();
    
    // State for selected feedback
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    
    // Create the mutation
    const updateStatusMutation = useMutation({
      mutationFn: async ({ id, approved }: { id: number, approved: boolean }) => {
        const response = await api.put(`/api/admin/feedbacks/${id}/approve/`, { approved });
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
        if (showDetailModal && selectedFeedback) {
          setSelectedFeedback(prev => prev ? { ...prev as any } : null);
        }
      },
      onError: (error) => {
        console.error('Error updating feedback status:', error);
      }
    });
  
    return {
      selectedFeedback,
      setSelectedFeedback,
      showDetailModal,
      setShowDetailModal,
      updateStatusMutation
    };
  }
  interface AdminFormData {
    fullName: string
    email: string
    password: string
    confirmPassword: string
  }
export function useCreateAdmin() {
      const [errors, setErrors] = useState<FormErrors>({})
      const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [formData, setFormData] = useState<AdminFormData>({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      })
    const createAdminMutation = useMutation({
        mutationFn: async (data: Omit<AdminFormData, "confirmPassword">) => {
          const response = await api.post("/api/auth/admin/register/", {
            full_name: data.fullName,
            email: data.email,
            password: data.password,
          })
          return response.data
        },
        onSuccess: () => {
          setSuccessMessage("Admin user created successfully!")
          // Reset form
          setFormData({
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
          })
          // Clear success message after 5 seconds
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        },
        onError: (error: any) => {
          console.error("Error creating admin:", error)
          if (error.response?.data) {
            setErrors(error.response.data)
          } else {
            setErrors({
              general: "An error occurred while creating the admin user.",
            })
          }
        },
      })
      return {
        formData,
        setFormData,
        createAdminMutation,
        errors,
        setErrors,
        successMessage,
        setSuccessMessage,
      }
}

// FOR STATISTICS 

import { format, subDays } from "date-fns";
const getDates = (timeRange : string) => {
    const dates: string[] = [];
    let daysToFetch = 7;

    if (timeRange === "month") daysToFetch = 30;
    else if (timeRange === "quarter") daysToFetch = 90;
    else if (timeRange === "year") daysToFetch = 365;

    for (let i = daysToFetch - 1; i >= 0; i--) {
    const date = subDays(new Date(), i);
    dates.push(format(date, "yyyy-MM-dd"));
    }

    return dates;
};
export const useLocalAppointmentStats = (timeRange: string) => {
  return useQuery({
    queryKey: ["appointment-stats", timeRange],
    queryFn: async () => {
      const dates = getDates(timeRange);
      const results = [];

      for (const date of dates) {
        try {
          const response = await api.get(`/api/admin/appointments/stats/i?date=${date}`);
          results.push(response.data);
        } catch (error) {
          console.error(`Error fetching stats for ${date}:`, error);
          results.push({
            date: date,
            total_appointments: 0,
            status_breakdown: {
              Pending: 0,
              "In Progress": 0,
              Completed: 0,
              Deleted: 0
            }
          });
        }
      }

      return results;
    },
    refetchOnWindowFocus: false
  });
};
export function useDomicielAppointmentStats(timeRange: string) {
  return useQuery({
      queryKey: ["appointment-stats", timeRange],
      queryFn: async () => {
          const dates = getDates(timeRange);
          const results = [];

          for (const date of dates) {
              try {
                  const response = await api.get(`/api/admin/appointments/stats/e?date=${date}`);
                  results.push(response.data);
              } catch (error) {
                  console.error(`Error fetching stats for ${date}:`, error);
                  results.push({
                      date: date,
                      total_appointments: 0,
                  });
              }
          }

          return results;
      },
      refetchOnWindowFocus: false
  });
}
export function useRevenueTrend (timeRange : string){
    return useQuery({
        queryKey: ["revenue-trend", timeRange],
        queryFn: async () => {
        const dates = getDates(timeRange);
        const results = [];
    
        for (const date of dates) {
            try {
            const response = await api.get(`/api/admin/appointments/revenue/i?date=${date}`);
            results.push(response.data);
            } catch (error) {
            console.error(`Error fetching revenue for ${date}:`, error);
            results.push({
                date: date,
                total_revenue: 0,
                appointment_count: 0
            });
            }
        }
    
        return results;
        },
        refetchOnWindowFocus: false
    });
}

export function useServicesLocal(timeRange: string) {
    return useQuery({
        queryKey: ["services-by-location", timeRange],
        queryFn: async () => {
            const dates = getDates(timeRange);
            const results = [];

            for (const date of dates) {
                try {
                    const response = await api.get(`/api/admin/appointments/stats/i?date=${date}`);
                    results.push(response.data);
                } catch (error) {
                    console.error(`Error fetching stats for ${date}:`, error);
                    results.push({
                        date: date,
                        total_appointments: 0,
                    });
                }
            }

            return results;
        },
        refetchOnWindowFocus: false
    });
}

export function useServicesDomiciel(timeRange: string) {
  return useQuery({
      queryKey: ["services-by-location", timeRange],
      queryFn: async () => {
          const dates = getDates(timeRange);
          const results = [];

          for (const date of dates) {
              try {
                  const response = await api.get(`/api/admin/appointments/stats/e?date=${date}`);
                  results.push(response.data);
              } catch (error) {
                  console.error(`Error fetching stats for ${date}:`, error);
                  results.push({
                      date: date,
                      total_appointments: 0,
                  });
              }
          }

          return results;
      },
      refetchOnWindowFocus: false
  });
}
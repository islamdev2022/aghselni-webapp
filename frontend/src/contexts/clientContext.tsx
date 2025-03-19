import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import api from "@/api";
import {  useQueryClient } from "@tanstack/react-query";

interface ClientContextType {
  Client: ClientData | null;
  setClient: React.Dispatch<React.SetStateAction<ClientData | null>>;
}

const ClientContext = createContext<ClientContextType | null>(null);
interface ClientData {
    id: number
    full_name: string
    email: string
    user_type: string
    phone: string
  }
export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [Client, setClient] = useState<ClientData | null>(null);
  const queryClient = useQueryClient();

  // Use query key for user data
  const USER_QUERY_KEY = 'userData';
 
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Fetch current user data
        const userResponse = await api.get<ClientData>('api/user/me/');
        setClient(userResponse.data);
        // Cache the user data
        queryClient.setQueryData([USER_QUERY_KEY], userResponse.data);
      } catch (error: any) {
        // Handle 403 silently without console error
        if (error.response) {
          // Server responded with a status outside the 2xx range
          if (error.response.status !== 403) {
            console.error('API request failed:', error.response.data);
          } else {
          }
        } else if (error.request) {
          // Request was made but no response received
          console.error('No response received:', error.request);
        } else {
          // Error setting up the request
          console.error('Error setting up request:', error.message);
        }
        setClient(null);
      } finally {
      }
    };

    checkAuth();
  }, [queryClient]);


  return (
    <ClientContext.Provider value={{ Client, setClient }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
};
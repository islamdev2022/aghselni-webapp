import { lazy, Suspense, ReactNode, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ACCESS_TOKEN } from "./constants";
import api from "./api";
import {ClientProvider} from "./contexts/clientContext";
// Lazy load components
const LandingPage = lazy(() => import("./components/pages/LandingPage"));
const ExternEmp = lazy(() => import("./components/pages/ExternEmp"));
const InternEmp = lazy(() => import("./components/pages/InternEmp"));
const Admin = lazy(() => import("./components/pages/dashboard"));
import Profile from "./components/Profile";
const Booking = lazy(() => import("./components/Booking"));
const AppointmentCarWashForm = lazy(() => import("./components/Forms/AppointmentCarWashForm"));
const HomeCarWashForm = lazy(() => import("./components/Forms/HomeCarWashForm"));
const Login = lazy(() => import("./components/Login"));
const Signup = lazy(() => import("./components/SignUp"));
const NotFound = lazy(() => import("./NotFound"));
const ClientsPage = lazy(() => import("./components/pages/admin/clients/index"));
const StatisticsPage = lazy(() => import("./components/pages/admin/statistics/index"));
const EmployeesPage = lazy(() => import("./components/pages/admin/employees/index"));
const AddEmployeePage = lazy(() => import("./components/pages/admin/employees/add"));
const AppointmentsTable = lazy(() => import("./components/admin/AppointmentsTable"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Layout component that conditionally renders Navbar and Footer
const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const authRoutes = ["/login/client", "/login/admin", "/login/extern_employee", "/login/intern_employee", "/signup" ,"/admin" ,"/extern-employee" ,"/intern-employee","/booking/local","/booking/domicile" ];
  
  // Check if current path starts with any auth route
  const isAuthRoute = authRoutes.some(route => 
    location.pathname.startsWith(route.split("/:")[0])
  );
  
  const isNotFound = location.pathname === "*";

  const hideNavAndFooter = isAuthRoute || isNotFound;

  return (
    <>
      {!hideNavAndFooter && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!hideNavAndFooter && <Footer />}
    </>
  );
};

// Auth context provider
interface AuthContextType {
  isAuthenticated: boolean;
  userType: string | null;
  userId: number | null;
  isLoading: boolean;
}

// Protected route component
interface ProtectedRouteProps {
  userType?: string | string[];
  redirectPath?: string;
}

const ProtectedRoute = ({ userType, redirectPath = `/login/${userType}` }: ProtectedRouteProps) => {
  const [authData, setAuthData] = useState<AuthContextType>({
    isAuthenticated: false,
    userType: null,
    userId: null,
    isLoading: true
  });

  // Check if user is authenticated using the API endpoint
  const fetchCurrentUser = async () => {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
      setAuthData({
        isAuthenticated: false,
        userType: null,
        userId: null,
        isLoading: false
      });
      return;
    }

    try {
      const response = await api.get('/api/user/me/');
      setAuthData({
        isAuthenticated: true,
        userType: response.data.user_type,
        userId: response.data.id,
        isLoading: false
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      setAuthData({
        isAuthenticated: false,
        userType: null,
        userId: null,
        isLoading: false
      });
      // Remove invalid tokens
      localStorage.removeItem(ACCESS_TOKEN);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Show loading while checking authentication
  if (authData.isLoading) {
    return <LoadingFallback />;
  }

  // Redirect if not authenticated
  if (!authData.isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // Check user type permissions
  if (userType && authData.userType) {
    if (Array.isArray(userType) && !userType.includes(authData.userType)) {
      return <Navigate to="/" replace />;
    } else if (typeof userType === 'string' && userType !== authData.userType) {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
      <ClientProvider>
        <Router>
          <Layout>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login/:userType" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Client Routes */}
                
                <Route element={<ProtectedRoute userType="client" />}>
                
                  <Route path="/booking" element={<Booking />} />
                  <Route path="/booking/local" element={<AppointmentCarWashForm/>} />
                  <Route path="/booking/domicile" element={<HomeCarWashForm />} />
                  <Route path="/profile/client/:id" element={<Profile />} />
                  <Route path="/history/:id" element={<p>Client History</p>} />
                
                </Route>
                
                
                {/* External Employee Routes */}
                <Route element={<ProtectedRoute userType="extern_employee" />}>
                  <Route path="/extern_employee" element={<ExternEmp />} />
                  <Route path="/profile/extern_employee/:id" element={<Profile />} />
                </Route>
                
                {/* Internal Employee Routes */}
                <Route element={<ProtectedRoute userType="intern_employee" />}>
                  <Route path="/intern-employee" element={<InternEmp />} />
                  <Route path="/profile/intern_employee/:id" element={<Profile />} />
                </Route>
                
                {/* Admin Routes */}
                <Route element={<ProtectedRoute userType="admin" />}>
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/clients" element={<ClientsPage />} />
                  <Route path="/admin/statistics" element={<StatisticsPage />} />
                  <Route path="/admin/employees" element={<EmployeesPage />} />
                  <Route path="/admin/employees/add" element={<AddEmployeePage />} />
                  <Route path="/admin/appointments" element={<AppointmentsTable />} />
                  <Route path="/profile/admin/:id" element={<Profile />} />
                </Route>
                
                {/* Not Found Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              
            </Suspense>
          </Layout>
        </Router></ClientProvider>
      </div>
    </QueryClientProvider>
  );
}

export default App;
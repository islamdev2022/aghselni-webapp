import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Lazy load components
const LandingPage = lazy(() => import("./components/pages/LandingPage"));
const ExternEmp = lazy(() => import("./components/pages/ExternEmp"));
const InternEmp = lazy(() => import("./components/pages/InternEmp"));
const Admin = lazy(() => import("./components/pages/Admin"));
import Profile from "./components/Profile";
const Booking = lazy(() => import("./components/Booking"));
const Login = lazy(() => import("./components/Login"));
const Signup = lazy(() => import("./components/SignUp"));
const NotFound = lazy(() => import("./NotFound"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Layout component that conditionally renders Navbar and Footer
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const authRoutes = ["/login", "/signup"];
  const isNotFound = location.pathname !== "/" && !authRoutes.includes(location.pathname) && !["/booking", "/history"].includes(location.pathname);

  const hideNavAndFooter = authRoutes.includes(location.pathname) || isNotFound;

  return (
    <>
      {!hideNavAndFooter && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!hideNavAndFooter && <Footer />}
    </>
  );
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
      <Router>
        <Layout>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/extern-employee" element={<ExternEmp />} />
              <Route path="/intern-employee" element={<InternEmp />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/login/:userType" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/history" element={<p>Client History</p>} />
              <Route path="*" element={<NotFound/>} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </div>
    </QueryClientProvider>

  );
}

export default App;
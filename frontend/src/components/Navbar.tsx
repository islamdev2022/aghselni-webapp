import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import UserDropdown from './UserDropdown';
// import { useClient } from '@/contexts/clientContext';
// interface UserData {
//   id: number
//   full_name: string
//   email: string
//   user_type: string
// }
interface ClientDashboardData {
  id: number;
  full_name: string;
  email: string;
  photo: string;
  age: number;
  phone_number: string;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [client, setClient] = useState<ClientDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();
  const navigate = useNavigate();


  // Get user data from context
  // const { Client: userData } = useClient();

  // Use query key for user data
  const USER_QUERY_KEY = 'userData';

  // Check authentication with proper error handling
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/api/client/profile/');
        setClient(response.data);
        // Cache the user data
        queryClient.setQueryData([USER_QUERY_KEY], response.data);
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
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [queryClient]);

  // Use mutation for logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/api/auth/logout/');
      return response.data;
    },
    onSuccess: () => {
      // Clear user data from cache
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
      // Clear tokens
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      setClient(null);
      // Redirect to home page
      navigate('/');
    },
    onError: (error) => {
      console.error('Logout failed:', error);
    }
  });

  const handleLogout = () => {
    // logoutMutation.mutate();
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setClient(null);
    window.location.href = '/';
  };

  const scrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
// console.log(userData);
console.log(client)
  // Authentication buttons based on login status
  const AuthButtons = () => {
    if (isLoading) {
      return <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>;
    }

    if (client) {
      return (
        <div className="flex items-center space-x-4">
      <UserDropdown 
        userData={client} 
        handleLogout={handleLogout} 
        logoutMutation={logoutMutation} 
      />
        </div>
      );
    }

    return (
      <>
        <Link to="/login/client">
          <Button className="bg-cyan-600 hover:bg-cyan-700 cursor-pointer">
            Sign In
          </Button>
        </Link>
        <Link to="/signup">
          <Button className="bg-white text-cyan-600 hover:bg-slate-100 cursor-pointer shadow">
            Sign Up
          </Button>
        </Link>
      </>
    );
  };

  // Mobile auth buttons
  const MobileAuthButtons = () => {
    if (isLoading) {
      return <div className="h-10 bg-gray-200 animate-pulse rounded my-4"></div>;
    }

    if (client) {
      return (
        <>
          <li>
            <Link to={`/profile/${ client?.id}`}>
              <Button className="w-full flex justify-center items-center space-x-2 bg-white text-cyan-600 hover:bg-slate-100 shadow cursor-pointer">
                <User size={18} />
                <span>{client.id || 'Profile'}</span>
              </Button>
            </Link>
          </li>
          <li>
            <Button 
              onClick={handleLogout} 
              className="w-full flex justify-center items-center space-x-2 bg-cyan-600 hover:bg-cyan-700 cursor-pointer"
              disabled={logoutMutation.isPending}
            >
              <LogOut size={18} />
              <span>{logoutMutation.isPending ? 'Logging out...' : 'Logout'}</span>
            </Button>
          </li>
        </>
      );
    }

    return (
      <>
        <li>
          <Link to="/login/client">
            <Button className="w-full bg-cyan-600 hover:bg-cyan-700 cursor-pointer">
              Sign In
            </Button>
          </Link>
        </li>
        <li>
          <Link to="/signup">
            <Button className="w-full bg-white text-cyan-600 hover:bg-slate-100 cursor-pointer shadow">
              Sign Up
            </Button>
          </Link>
        </li>
      </>
    );
  };

  return (
    <header className="sticky top-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center" onClick={scrollUp}>
            <span className="text-3xl mr-2">💧</span>
            <span className="text-cyan-600 font-bold text-xl">Aghselni</span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-8">
            <li><Link to="/" className="text-gray-700 hover:text-cyan-600 font-medium duration-200" onClick={scrollUp}>Home</Link></li>
            <li><a href="/#services" className="text-gray-700 hover:text-cyan-600 font-medium duration-200">Services</a></li>
            <li><a href="/#how-it-works" className="text-gray-700 hover:text-cyan-600 font-medium duration-200">How It Works</a></li>
            <li><a href="/#testimonials" className="text-gray-700 hover:text-cyan-600 font-medium duration-200">Testimonials</a></li>
          </ul>

          <div className="hidden md:flex space-x-4">
            <AuthButtons />
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-4">
            <ul className="flex flex-col space-y-4 text-center">
              <li><Link to="/" className="block text-gray-700 hover:text-cyan-600 font-medium" onClick={scrollUp}>Home</Link></li>
              <li><a href="#services" className="block text-gray-700 hover:text-cyan-600 font-medium">Services</a></li>
              <li><a href="#how-it-works" className="block text-gray-700 hover:text-cyan-600 font-medium">How It Works</a></li>
              <li><a href="#testimonials" className="block text-gray-700 hover:text-cyan-600 font-medium">Testimonials</a></li>
              <MobileAuthButtons />
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
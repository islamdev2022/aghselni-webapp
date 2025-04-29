// In your React app - Auth/SuccessPage.js
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RedirectComponent from './RedirectComponent'; // Adjust the import path as necessary
import api from '../api'; // Adjust the import path as necessary

const AuthSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Add this debugging code to your frontend after successful login
useEffect(() => {
  const queryParams = new URLSearchParams(location.search);
  const accessToken = queryParams.get('access_token');
  const refreshToken = queryParams.get('refresh_token');
  
  if (accessToken && refreshToken) {
    // Store tokens
    localStorage.setItem('access', accessToken);
    localStorage.setItem('refresh', refreshToken);
    
    // Debug token
    console.log('Access token stored:', accessToken);
    
    // Make a test request with the token
    const testAuth = async () => {
      try {
        const response = await api.get('/api/client/profile/');
        console.log('Auth test successful:', response.data);
        // Optionally, you can redirect or perform other actions here
        navigate('/'); // Redirect to home page or any other page
      } catch (error: any) {
        console.error('Auth test failed:', error.response?.status, error.response?.data);
        navigate('/login/client'); // Redirect to login page if the test fails
      }
    };
    
    testAuth();
  }
}, [location]);

  

  return (
    <RedirectComponent
    to="https://Agheslni.com"
    delay={5000}
    message="Redirecting you to our  website"
  />
  );
};

export default AuthSuccess;

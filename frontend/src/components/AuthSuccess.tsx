// In your React app - Auth/SuccessPage.js
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RedirectComponent from './RedirectComponent'; // Adjust the import path as necessary


const AuthSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const accessToken = queryParams.get('access_token');
    const refreshToken = queryParams.get('refresh_token');
    const isNewUser = queryParams.get('is_new_user') === 'True'; // Check if this is a new user
    
    if (accessToken && refreshToken) {
      // Store tokens in localStorage or state management
      localStorage.setItem('access', accessToken);
      localStorage.setItem('refresh', refreshToken);
      
      // Show appropriate message based on whether this is registration or login
      if (isNewUser) {
        alert('Your account has been successfully created with Google!');
      } else {
        alert('Welcome back! Successfully signed in with Google!');
      }
      
      navigate('/'); // Redirect to your main app page
    } else {
      navigate('/login'); // Redirect back to login if tokens are missing
    }
  }, [location, navigate]);

  

  return (
    <RedirectComponent
    to="https://Agheslni.com"
    delay={5000}
    message="Redirecting you to our  website"
  />
  );
};

export default AuthSuccess;

// import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

const Profile = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    // Get user profile data
    const {  isLoading, isError } = useQuery({
      queryKey: ['userProfile', id],
      queryFn: async () => {
        try {
          const response = await api.get(`/api/client/profile/${id}/`);
          return response.data
        } catch (error: any) {
          if (error.response && error.response.status === 403) {
            // If unauthorized, redirect to login
            navigate('/login/client');
          }
          throw error;
        }
      }
    });
  
    if (isLoading) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded mb-6"></div>
              <div className="h-8 bg-gray-200 rounded mb-4 w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
            </div>
          </div>
        </div>
      );
    }
  
    if (isError) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error loading profile {id}</h1>
            <p className="mb-4">We couldn't load your profile information. Please try again later.</p>
            <Button onClick={() => navigate('/')} className="bg-cyan-600 hover:bg-cyan-700">
              Return to Home
            </Button>
          </div>
        </div>
      );
    }
    
return (
    <></>
)
}
export default Profile;
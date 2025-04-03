import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Search, Star,  CheckCircle, AlertCircle,  User, Calendar, Eye, X } from 'lucide-react';
import { format } from 'date-fns';
import api from '@/api';
import AdminLayout from '@/components/layouts/AdminLayout';

interface Feedback {
  id: number;
  client_name: string;
  client_email: string;
  subject: string;
  message: string;
  rating: number;
  created_at: string;
  status: 'unread' | 'read' | 'resolved';
}

export default function FeedbackPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Fetch feedback data
  const { data: feedbackData, isLoading } = useQuery({
    queryKey: ['admin-feedback'],
    queryFn: async () => {
      const response = await api.get<Feedback[]>('/api/admin/feedback/');
      return response.data;
    }
  });

  // Update feedback status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await api.patch(`/api/admin/feedback/${id}/`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
      if (showDetailModal && selectedFeedback) {
        setSelectedFeedback(prev => prev ? { ...prev, status: updateStatusMutation.variables?.status as any } : null);
      }
    }
  });

  // Sample data for demonstration
  const sampleFeedback: Feedback[] = [
    {
      id: 1,
      client_name: 'John Smith',
      client_email: 'john.smith@example.com',
      subject: 'Great service experience',
      message: 'I wanted to thank your team for the excellent car wash service. My car looks brand new! The staff was professional and friendly. I will definitely be coming back and recommending your service to friends and family.',
      rating: 5,
      created_at: '2025-03-15T10:30:00Z',
      status: 'unread'
    },
    {
      id: 2,
      client_name: 'Sarah Johnson',
      client_email: 'sarah.johnson@example.com',
      subject: 'Suggestion for improvement',
      message: 'While I was generally satisfied with the service, I think the waiting area could use some improvements. Perhaps adding more comfortable seating and some magazines would make the wait more pleasant. Otherwise, the car wash itself was great!',
      rating: 4,
      created_at: '2025-03-14T14:45:00Z',
      status: 'read'
    },
    {
      id: 3,
      client_name: 'Michael Brown',
      client_email: 'michael.brown@example.com',
      subject: 'Disappointed with service',
      message: 'I regret to inform you that I was not satisfied with my recent car wash. There were still some dirty spots on the windows and the interior vacuum service missed several areas. I hope you can improve your quality control in the future.',
      rating: 2,
      created_at: '2025-03-13T09:15:00Z',
      status: 'resolved'
    },
    {
      id: 4,
      client_name: 'Emily Davis',
      client_email: 'emily.davis@example.com',
      subject: 'Question about membership',
      message: "I recently used your services and was very impressed. I'm interested in your monthly membership program but couldn't find detailed information on your website. Could you please provide more details about the different membership tiers and what they include?",
      rating: 5,
      created_at: '2025-03-12T16:20:00Z',
      status: 'unread'
    },
    {
      id: 5,
      client_name: 'David Wilson',
      client_email: 'david.wilson@example.com',
      subject: 'Feedback on mobile app',
      message: "I've been using your mobile app to book appointments and I think it's very convenient. However, I've noticed that sometimes the appointment times shown in the app don't match what's available when I arrive. It would be great if this could be fixed.",
      rating: 3,
      created_at: '2025-03-11T11:10:00Z',
      status: 'read'
    }
  ];

  const displayFeedback = feedbackData || sampleFeedback;


const filteredFeedback: Feedback[] = displayFeedback.filter((feedback: Feedback): boolean => {
    const matchesSearch: boolean = 
        feedback.client_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        feedback.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus: boolean = statusFilter === 'all' || feedback.status === statusFilter;
    
    const matchesRating: boolean = ratingFilter === null || feedback.rating === ratingFilter;
    
    return matchesSearch && matchesStatus && matchesRating;
});

  const handleViewFeedback = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setShowDetailModal(true);
    
    // If feedback is unread, mark it as read
    if (feedback.status === 'unread') {
      updateStatusMutation.mutate({ id: feedback.id, status: 'read' });
    }
  };

  const handleUpdateStatus = (id: number, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return (
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
            <AlertCircle className="mr-1 h-3 w-3" />
            Unread
          </span>
        );
      case 'read':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
            <Eye className="mr-1 h-3 w-3" />
            Read
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
            <CheckCircle className="mr-1 h-3 w-3" />
            Resolved
          </span>
        );
      default:
        return null;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold text-gray-800">Client Feedback</h1>
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search feedback..."
                className="w-full rounded-lg border border-gray-200 pl-10 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative min-w-[150px]">
              <select
                className="h-full w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div className="relative min-w-[150px]">
              <select
                className="h-full w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                value={ratingFilter === null ? '' : ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value === '' ? null : Number(e.target.value))}
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-cyan-600"></div>
              <span className="text-lg font-medium text-gray-700">Loading feedback...</span>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            {filteredFeedback.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredFeedback.map((feedback) => (
                  <div 
                    key={feedback.id} 
                    className={`p-4 transition hover:bg-gray-50 cursor-pointer ${
                      feedback.status === 'unread' ? 'bg-cyan-50/30' : ''
                    }`}
                    onClick={() => handleViewFeedback(feedback)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-gray-900 truncate">{feedback.subject}</h3>
                          {getStatusBadge(feedback.status)}
                        </div>
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <User className="mr-1 h-3 w-3" />
                          <span className="truncate">{feedback.client_name}</span>
                          <span className="mx-1">•</span>
                          <Calendar className="mr-1 h-3 w-3" />
                          <span>{format(new Date(feedback.created_at), 'MMM d, yyyy')}</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{feedback.message}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {renderStars(feedback.rating)}
                        <button 
                          className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewFeedback(feedback);
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="mx-auto h-10 w-10 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No feedback found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                </div>
              </div>
            )}
            
            {filteredFeedback.length > 0 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">{filteredFeedback.length}</span> of{' '}
                  <span className="font-medium">{displayFeedback.length}</span> feedback items
                </div>
                <div className="flex space-x-1">
                  <button className="rounded-md border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="rounded-md bg-cyan-50 px-3 py-1 text-sm font-medium text-cyan-700 hover:bg-cyan-100">
                    1
                  </button>
                  <button className="rounded-md border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    2
                  </button>
                  <button className="rounded-md border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Feedback Detail Modal */}
      {showDetailModal && selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{selectedFeedback.subject}</h3>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
                  <span className="text-sm font-medium">
                    {selectedFeedback.client_name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{selectedFeedback.client_name}</p>
                  <p className="text-sm text-gray-500">{selectedFeedback.client_email}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center">
                  {renderStars(selectedFeedback.rating)}
                  <span className="ml-1 text-sm font-medium text-gray-700">{selectedFeedback.rating}/5</span>
                </div>
                <p className="text-xs text-gray-500">
                  {format(new Date(selectedFeedback.created_at), 'MMMM d, yyyy • h:mm a')}
                </p>
              </div>
            </div>
            
            <div className="mb-6 rounded-lg bg-gray-50 p-4">
              <p className="whitespace-pre-wrap text-sm text-gray-700">{selectedFeedback.message}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="mr-2 text-sm font-medium text-gray-700">Status:</span>
                {getStatusBadge(selectedFeedback.status)}
              </div>
              <div className="flex space-x-2">
                {selectedFeedback.status !== 'resolved' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedFeedback.id, 'resolved')}
                    disabled={updateStatusMutation.isPending}
                    className="flex items-center rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                  >
                    <CheckCircle className="mr-1 h-3.5 w-3.5" />
                    Mark as Resolved
                  </button>
                )}
                {selectedFeedback.status === 'unread' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedFeedback.id, 'read')}
                    disabled={updateStatusMutation.isPending}
                    className="flex items-center rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  >
                    <Eye className="mr-1 h-3.5 w-3.5" />
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

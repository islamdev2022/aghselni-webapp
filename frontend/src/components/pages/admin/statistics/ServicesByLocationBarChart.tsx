import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import api from '@/api';
import { format, subDays } from "date-fns";

interface ServiceLocationData {
  date: string;
  total_appointments: number;
}

interface ChartData {
  name: string;
  value: number;
}

const ServicesByLocationBarChart: React.FC<{ timeRange: string }> = ({ timeRange }) => {
  const [displayData, setDisplayData] = useState<ChartData[]>([]);

  // Function to generate date range based on timeRange
  const getDates = () => {
    const dates = [];
    let daysToFetch = 7; // Default to week
    
    if (timeRange === "month") daysToFetch = 30;
    else if (timeRange === "quarter") daysToFetch = 90;
    else if (timeRange === "year") daysToFetch = 365;
    
    for (let i = daysToFetch - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      dates.push(format(date, "yyyy-MM-dd"));
    }
    return dates;
  };

  // Query for local stats
  const { data: localData, isLoading: isLoadingLocal, isError: isErrorLocal } = useQuery({
    queryKey: ["services-by-location-local", timeRange],
    queryFn: async () => {
      const dates = getDates();
      const results: ServiceLocationData[] = [];
      
      // Fetch each date one by one for local services
      for (const date of dates) {
        try {
          const response = await api.get(`/api/admin/appointments/stats/i?date=${date}`);
          results.push({
            date,
            total_appointments: response.data.total_appointments || 0
          });
        } catch (error) {
          console.error(`Error fetching local services for ${date}:`, error);
          // Add placeholder data for missing dates
          results.push({
            date,
            total_appointments: 0
          });
        }
      }
      
      return results;
    },
    refetchOnWindowFocus: false
  });

  // Query for domicile stats
  const { data: domicileData, isLoading: isLoadingDomicile, isError: isErrorDomicile } = useQuery({
    queryKey: ["services-by-location-domicile", timeRange],
    queryFn: async () => {
      const dates = getDates();
      const results: ServiceLocationData[] = [];
      
      // Fetch each date one by one for domicile services
      for (const date of dates) {
        try {
          const response = await api.get(`/api/admin/appointments/stats/e?date=${date}`);
          results.push({
            date,
            total_appointments: response.data.total_appointments || 0
          });
        } catch (error) {
          console.error(`Error fetching domicile services for ${date}:`, error);
          // Add placeholder data for missing dates
          results.push({
            date,
            total_appointments: 0
          });
        }
      }
      
      return results;
    },
    refetchOnWindowFocus: false
  });

  // Process data for the bar chart
  useEffect(() => {
    if (localData && domicileData) {
      // Calculate total appointments for local and domicile services
      const localTotal = localData.reduce((sum, item) => sum + item.total_appointments, 0);
      const domicileTotal = domicileData.reduce((sum, item) => sum + item.total_appointments, 0);

      // Create chart data
      const chartData: ChartData[] = [
        { name: "Local", value: localTotal },
        { name: "Domicile", value: domicileTotal }
      ];

      setDisplayData(chartData);
    }
  }, [localData, domicileData]);

  // Render loading state if either query is loading
  if (isLoadingLocal || isLoadingDomicile) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-cyan-600"></div>
          <span className="text-lg font-medium text-gray-700">Loading location data...</span>
        </div>
      </div>
    );
  }

  // Render error state if either query has an error
  if (isErrorLocal || isErrorDomicile) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-medium text-red-600">Error loading location data</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Services by Location</h2>
        <div className="rounded-lg bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700">
          {timeRange === "week"
            ? "Last Week"
            : timeRange === "month"
              ? "Last Month"
              : timeRange === "quarter"
                ? "Last Quarter"
                : "Last Year"}
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={displayData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value} services`, "Count"]} 
              contentStyle={{ backgroundColor: '#f5f5f5', borderRadius: '8px' }}
            />
            <Bar 
              dataKey="value" 
              fill="#0891b2" 
              radius={[4, 4, 0, 0]} 
              barSize={60} 
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ServicesByLocationBarChart;
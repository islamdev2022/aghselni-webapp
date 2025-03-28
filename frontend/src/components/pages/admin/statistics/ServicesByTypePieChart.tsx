import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import  api  from '@/api'; 
import { format, subDays } from "date-fns";

// Color palette for the pie chart
const COLORS = [
    '#0088FE', // Blue
    '#00C49F', // Teal
    '#FFBB28', // Yellow
  ];

interface ServiceTypeData {
  date: string;
  wash_type_breakdown: Record<string, number>;
}

interface ChartData {
  name: string;
  value: number;
}

const ServicesByTypePieChart: React.FC<{ timeRange: string }> = ({ timeRange }) => {
  const [displayData, setDisplayData] = useState<ChartData[]>([]);
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
  // Fetch data using React Query
  const { data: serviceTypeData, isLoading, isError } = useQuery({
    queryKey: ["services-by-type", timeRange],
    queryFn: async () => {
      const dates = getDates();
      const results: ServiceTypeData[] = [];
      
      // Fetch each date one by one
      for (const date of dates) {
        try {
          const response = await api.get(`/api/admin/appointments/stats/i?date=${date}`);
          results.push({
            date,
            wash_type_breakdown: response.data.wash_type_breakdown
          });
        } catch (error) {
          console.error(`Error fetching services for ${date}:`, error);
          // Add placeholder data for missing dates
          results.push({
            date,
            wash_type_breakdown: {}
          });
        }
      }
      
      return results;
    },
    refetchOnWindowFocus: false
  });

  // Process data for the pie chart
  useEffect(() => {
    if (serviceTypeData) {
      // Aggregate wash types across all dates
      const washTypeAggregation: Record<string, number> = {};

      serviceTypeData.forEach((item) => {
        Object.entries(item.wash_type_breakdown).forEach(([washType, count]) => {
          // Normalize wash type to ensure no duplicates
          const normalizedWashType = washType.trim().toLowerCase();
          washTypeAggregation[normalizedWashType] = 
            (washTypeAggregation[normalizedWashType] || 0) + count;
        });
      });

      // Convert to chart data format with proper capitalization
      const chartData: ChartData[] = Object.entries(washTypeAggregation)
        .map(([name, value]) => ({
          // Capitalize first letter, keep rest as is
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value 
        }))
        .filter(item => item.value > 0); // Remove types with zero count

      setDisplayData(chartData);
    }
  }, [serviceTypeData]);

  // Render loading or error states
  if (isLoading) return <div className="flex h-full items-center justify-center">
  <div className="flex items-center space-x-2">
    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-cyan-600"></div>
    <span className="text-lg font-medium text-gray-700">Loading services data...</span>
  </div>
</div>;
  if (isError) return <div className="flex h-full items-center justify-center">
  <div className="flex items-center space-x-2">
    <span className="text-lg font-medium text-red-600">Error Loading dashboard data</span>
  </div>
</div>;

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Services by Type</h2>
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
          <RechartsPieChart>
            <Pie
              data={displayData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {displayData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} services`, "Count"]} />
            <Legend />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ServicesByTypePieChart;
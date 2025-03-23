import { useEffect, useState } from "react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";
import api from "@/api";

// Define types for the API response
interface AppointmentStats {
  date: string;
  total_appointments: number;
  status_breakdown: {
    Pending: number;
    "In Progress": number;
    Completed: number;
    Deleted: number;
  };
}

// Define type for chart data
interface ChartData {
  name: string;
  date: string;
  completed: number;
  pending: number;
  inProgress: number;
  cancelled: number;
}

interface AppointmentsChartProps {
  timeRange: "week" | "month" | "quarter" | "year";
}

export default function AppointmentsByDayChart({ timeRange = "week" }: AppointmentsChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  
  // Get dates based on timeRange
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
  
  // Use React Query to fetch stats for all dates
  const { data: appointmentStats, isLoading, isError } = useQuery({
    queryKey: ["appointment-stats", timeRange],
    queryFn: async () => {
      const dates = getDates();
      const results = [];
      
      // Fetch each date one by one
      for (const date of dates) {
        try {
          const response = await api.get(`/api/admin/appointments/stats/i?date=${date}`);
          results.push(response.data);
        } catch (error) {
          console.error(`Error fetching stats for ${date}:`, error);
          // Add placeholder data for missing dates
          results.push({
            date: date,
            total_appointments: 0,
            status_breakdown: {
              Pending: 0,
              "In Progress": 0,
              Completed: 0,
              Deleted: 0
            }
          });
        }
      }
      
      return results;
    },
    refetchOnWindowFocus: false
  });
  
  // Process data for the chart
  useEffect(() => {
    if (appointmentStats) {
      // Ensure data is an array
      const statsArray = Array.isArray(appointmentStats) ? appointmentStats : [appointmentStats];
      
      const formattedData: ChartData[] = statsArray.map((stat: AppointmentStats) => {
        // Format date to display - use just day for week view, include month for longer periods
        const displayFormat = timeRange === "week" ? "EEE" : "MMM dd";
        
        return {
          name: format(new Date(stat.date), displayFormat),
          date: stat.date,
          completed: stat.status_breakdown.Completed || 0,
          pending: stat.status_breakdown.Pending || 0,
          inProgress: stat.status_breakdown["In Progress"] || 0,
          cancelled: stat.status_breakdown.Deleted || 0, // Using Deleted as cancelled
        };
      });
      
      setChartData(formattedData);
    }
  }, [appointmentStats, timeRange]);
  
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Appointments by Day</h2>
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
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">Loading appointment data...</p>
          </div>
        ) : isError ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-red-500">Error loading appointment data</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">No appointment data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={chartData}
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
                formatter={(value, name) => [value, String(name).charAt(0).toUpperCase() + String(name).slice(1)]}
                labelFormatter={(label, payload) => {
                  if (payload && payload.length > 0) {
                    return payload[0].payload.date;
                  }
                  return label;
                }}
              />
              <Legend />
              <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="inProgress" name="In Progress" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="cancelled" name="Cancelled" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
            </RechartsBarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
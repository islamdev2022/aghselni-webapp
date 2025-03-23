import { useEffect, useState } from "react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";
import api from "@/api";

// Define the type for the API response
interface RevenueData {
  date: string;
  total_revenue: number;
  appointment_count: number;
}

// Define the type for the chart data
interface ChartData {
  name: string;
  date: string;
  value: number;
}

interface RevenueTrendProps {
  timeRange: "week" | "month" | "quarter" | "year";
}

export default function RevenueTrend({ timeRange = "week" }: RevenueTrendProps) {
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
  
  // Use React Query to fetch revenue data
  const { data: revenueData, isLoading, isError } = useQuery({
    queryKey: ["revenue-trend", timeRange],
    queryFn: async () => {
      const dates = getDates();
      const results = [];
      
      // Fetch each date one by one
      for (const date of dates) {
        try {
          const response = await api.get(`/api/admin/appointments/revenue/i?date=${date}`);
          results.push(response.data);
        } catch (error) {
          console.error(`Error fetching revenue for ${date}:`, error);
          // Add placeholder data for missing dates
          results.push({
            date: date,
            total_revenue: 0,
            appointment_count: 0
          });
        }
      }
      
      return results;
    },
    refetchOnWindowFocus: false
  });
  
  // Process data for the chart
  useEffect(() => {
    if (revenueData) {
      // Ensure data is an array
      const dataArray = Array.isArray(revenueData) ? revenueData : [revenueData];
      
      // Format data for chart display
      const formattedData: ChartData[] = dataArray.map((item: RevenueData) => {
        // Format date display based on the timeRange
        const displayFormat = timeRange === "week" ? "EEE" : 
                             timeRange === "month" ? "MMM dd" : 
                             timeRange === "quarter" ? "MMM dd" : "MMM yyyy";
        
        return {
          name: format(new Date(item.date), displayFormat),
          date: item.date,
          value: item.total_revenue
        };
      });
      
      setChartData(formattedData);
    }
  }, [revenueData, timeRange]);
  
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Revenue Trend</h2>
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
            <p className="text-gray-500">Loading revenue data...</p>
          </div>
        ) : isError ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-red-500">Error loading revenue data</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">No revenue data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart
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
              <YAxis 
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value) => [`$${value}`, "Revenue"]}
                labelFormatter={(label, payload) => {
                  if (payload && payload.length > 0) {
                    return payload[0].payload.date;
                  }
                  return label;
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0891b2"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
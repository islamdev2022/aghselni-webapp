import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";
import api from "@/api";

// Define the type for the API response
interface DailyRevenue {
  date: string;
  total_revenue: number;
  appointment_count: number;
}

// Define the type for the chart data
interface ChartData {
  name: string;
  date: string;
  revenue: number;
  appointments: number;
}

export default function RevenueChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  
  // Generate the last 7 days dates
  const getDates = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      dates.push(format(date, "yyyy-MM-dd"));
    }
    return dates;
  };
  
  // Use React Query to fetch all dates' data
  const { data: revenueData, isLoading, isError } = useQuery({
    queryKey: ["admin-revenue"],
    queryFn: async () => {
      const dates = getDates();
      const results = [];
      
      // Fetch each date one by one
      for (const date of dates) {
        try {
          const response = await api.get(`/api/admin/appointments/revenue/i?date=${date}`);
          results.push(response.data);
        } catch (error) {
          console.error(`Error fetching data for ${date}:`, error);
          // Add placeholder data for missing dates
          results.push({
            date: date,
            total_revenue: 0,
            appointment_count: 0
          });
        }
      }
      
      return results;
    }
  });
  
  useEffect(() => {
    console.log("Fetched revenueData:", revenueData);
    
    if (revenueData) {
      // If revenueData is not an array, wrap it in an array
      const dataArray = Array.isArray(revenueData) ? revenueData : [revenueData];
      
      const formattedData: ChartData[] = dataArray.map((item: DailyRevenue) => ({
        name: format(new Date(item.date), "EEE"), // Convert date to short weekday name
        date: item.date,
        revenue: item.total_revenue || 0,
        appointments: item.appointment_count || 0
      }));
      
      console.log("Formatted data:", formattedData);
      setChartData(formattedData);
    }
  }, [revenueData]);
  
  if (isLoading) return <div className="h-72 flex items-center justify-center">Loading revenue data...</div>;
  if (isError) return <div className="h-72 flex items-center justify-center">Error loading revenue data</div>;
  
  // If chart data is empty but we're not loading or in error state
  if (chartData.length === 0) {
    return <div className="h-72 flex items-center justify-center">No revenue data available</div>;
  }
  
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tickFormatter={(value) => `$${value}`} 
            domain={[0, 'dataMax + 100']} 
          />
          <Tooltip
            formatter={(value, name) => {
              if (name === "revenue") return [`$${value}`, "Revenue"];
              return [value, "Appointments"];
            }}
            labelFormatter={(label, payload) => {
              if (payload && payload.length > 0) {
                return payload[0].payload.date;
              }
              return label;
            }}
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              padding: "8px 12px",
            }}
          />
          <Bar dataKey="revenue" fill="#0891b2" radius={[4, 4, 0, 0]} barSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
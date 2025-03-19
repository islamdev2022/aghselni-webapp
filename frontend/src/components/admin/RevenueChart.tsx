import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Mon", revenue: 1200 },
  { name: "Tue", revenue: 1900 },
  { name: "Wed", revenue: 1500 },
  { name: "Thu", revenue: 2200 },
  { name: "Fri", revenue: 2800 },
  { name: "Sat", revenue: 3500 },
  { name: "Sun", revenue: 2100 },
]

export default function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 5,
          left: 5,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
        <Tooltip
          formatter={(value) => [`$${value}`, "Revenue"]}
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
  )
}


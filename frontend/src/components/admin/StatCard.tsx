import type React from "react"
import { Link } from "react-router-dom"
import { ArrowUp, ArrowDown } from "lucide-react"

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  trend: number
  link: string
  isCurrency?: boolean
}

export default function StatCard({ title, value, icon, trend, link, isCurrency = false }: StatCardProps) {
  const formattedValue = isCurrency
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)
    : value.toLocaleString()

  return (
    <Link to={link} className="block">
      <div className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-50">{icon}</div>
          <div
            className={`flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${trend >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
          >
            {trend >= 0 ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
            {Math.abs(trend)}%
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="mt-1 text-2xl font-bold text-gray-800">{formattedValue}</p>
        </div>
      </div>
    </Link>
  )
}


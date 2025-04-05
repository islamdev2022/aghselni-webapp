import { Clock, CheckCircle, X } from "lucide-react"

export default function StatusBadge({ status }: { status: "Pending" | "In Progress" | "Completed" | "Cancelled" }) {
  switch (status) {
    case "Pending":
      return (
        <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </span>
      )
    case "In Progress":
      return (
        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
          <Clock className="mr-1 h-3 w-3" />
          In Progress
        </span>
      )
    case "Completed":
      return (
        <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
          <CheckCircle className="mr-1 h-3 w-3" />
          Completed
        </span>
      )
    case "Cancelled":
      return (
        <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
          <X className="mr-1 h-3 w-3" />
          Cancelled
        </span>
      )
    default:
      return null
  }
}
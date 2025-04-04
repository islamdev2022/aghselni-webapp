import { useQuery } from "@tanstack/react-query"
import { MessageSquare, Star, AlertCircle, CheckCircle } from "lucide-react"
import { Link } from "react-router-dom"
import api from "@/api"

interface FeedbackSummary {
  total: number
  not_approved: number
  approved: number
  resolved: number
  average_rating: number

}

export default function FeedbackSummaryWidget() {
  const { data: summary, isLoading } = useQuery({
    queryKey: ["feedback-summary"],
    queryFn: async () => {
      const response = await api.get<FeedbackSummary>("/api/admin/feedbacks/summary/")
      return response.data
    },
  })
    console.log("summary", summary)
  const displaySummary: FeedbackSummary = summary || {
    total: 0,
    not_approved: 0,
    approved: 0,
    resolved: 0,
    average_rating: 0
  }

  if (isLoading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 w-1/3 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Feedback Overview</h2>
        <Link to="/admin/feedback" className="text-sm font-medium text-cyan-600 hover:text-cyan-700">
          View All
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 text-cyan-600 mr-2" />
            <span className="text-2xl font-bold text-gray-800">{displaySummary.total}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Total Feedback</p>
        </div>
        <div className="flex items-center">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.round(displaySummary.average_rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700">{displaySummary.average_rating.toFixed()}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-amber-50 p-3">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
              <AlertCircle className="h-4 w-4 text-amber-600" />
            </div>
            <span className="text-lg font-bold text-amber-700">{displaySummary.not_approved}</span>
          </div>
          <p className="mt-2 text-xs font-medium text-amber-700">Not Approved</p>
        </div>
        <div className="rounded-lg bg-green-50 p-3">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-lg font-bold text-green-700">{displaySummary.approved}</span>
          </div>
          <p className="mt-2 text-xs font-medium text-green-700">Approved</p>
        </div>
      </div>
    </div>
  )
}


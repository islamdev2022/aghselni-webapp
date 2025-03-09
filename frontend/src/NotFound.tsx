import { Link } from "react-router-dom"
import { Button } from "./components/ui/button"
import { Home, Search, AlertCircle } from "lucide-react"

const NotFound = () => {
  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header with decorative element */}
        <div className="relative bg-gradient-to-r from-cyan-600 to-cyan-500 px-8 py-10 text-white">
          <div className="absolute -bottom-6 left-1/2 h-12 w-12 -translate-x-1/2 transform rounded-full bg-white p-2 shadow-lg">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-cyan-600">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
          </div>
          <h1 className="text-center text-2xl font-bold">404 - Page Not Found</h1>
          <p className="mt-1 text-center text-cyan-100">Oops! We couldn't find that page</p>
        </div>

        <div className="flex flex-col items-center px-8 pt-16 pb-12">
          {/* 404 Illustration */}
          <div className="mb-8 flex h-40 w-40 items-center justify-center rounded-full bg-slate-50">
            <div className="relative">
              <div className="absolute -right-4 -top-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-500">
                <Search className="h-5 w-5" />
              </div>
              <div className="text-[5rem] font-bold text-slate-200">404</div>
            </div>
          </div>

          <p className="mb-2 text-center text-lg font-medium text-gray-700">
            The page you're looking for doesn't exist
          </p>
          <p className="mb-8 text-center text-sm text-gray-500">
            The page might have been moved, deleted, or perhaps you mistyped the URL.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 px-6 py-2.5 text-sm font-medium text-white shadow-md transition hover:from-cyan-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              asChild
            >
              <Link to="/">
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              asChild
            >
              <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound


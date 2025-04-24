"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface RedirectProps {
  /**
   * The URL to redirect to
   */
  to: string
  /**
   * Delay in milliseconds before redirecting
   * @default 3000
   */
  delay?: number
  /**
   * Message to display while redirecting
   * @default "Redirecting you to your destination"
   */
  message?: string
  /**
   * Show progress bar
   * @default true
   */
  showProgress?: boolean
  /**
   * Custom logo URL (optional)
   */
  logoUrl?: string
}

export default function RedirectComponent({
  to,
  delay = 3000,
  message = "Redirecting you to your destination",
  showProgress = true,
}: RedirectProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Handle the redirect after the specified delay
    const redirectTimeout = setTimeout(() => {
      window.location.href = to
    }, delay)

    // Update progress every 30ms
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (30 / delay) * 100
        return newProgress >= 100 ? 100 : newProgress
      })
    }, 30)

    // Clean up timeouts and intervals
    return () => {
      clearTimeout(redirectTimeout)
      clearInterval(interval)
    }
  }, [to, delay])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md overflow-hidden rounded-xl bg-white p-8 shadow-xl"
      >
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Logo or spinner */}
            <motion.img
              src="/Logo.png"
              alt="Logo"
              className="h-28"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />
         

          {/* Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h2 className="mb-2 text-xl font-semibold text-slate-800">{message}</h2>
            <p className="text-sm text-slate-500">You'll be redirected in a moment</p>
          </motion.div>

          {/* Progress bar */}
          {showProgress && (
            <div className="w-full">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  className="h-full bg-cyan-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeInOut" }}
                />
              </div>
              <div className="mt-2 flex justify-between">
                <span className="text-xs text-slate-400">Preparing</span>
                <span className="text-xs text-slate-400">Complete</span>
              </div>
            </div>
          )}

          {/* Cancel button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-2 text-sm text-slate-500 hover:text-slate-700"
            onClick={() => (window.location.href = to)}
          >
            Redirect now
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

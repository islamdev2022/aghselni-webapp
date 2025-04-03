"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useClient } from "@/contexts/clientContext"
import { useMutation } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Check, AlertCircle, Loader2, MessageSquare } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import api from "@/api"

// Define form schema with Zod validation
const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  feedback: z
    .string()
    .min(10, "Feedback must be at least 10 characters")
    .max(500, "Feedback cannot exceed 500 characters"),
  rating: z.number().min(1).max(5).optional(),
})

// API request payload interface
interface FeedbackPayload {
  name: string
  email: string
  feedback: string
  rating?: number
}

export default function FeedbackForm() {
  const { Client } = useClient()
  const [showSuccess, setShowSuccess] = useState(false)

  // Initialize form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: Client?.full_name || "",
      email: Client?.email || "",
      feedback: "",
      rating: undefined,
    },
  })

  // Create mutation for post request
  const submitFeedback = useMutation({
    mutationFn: async (data: FeedbackPayload) => {
      // Replace with your actual API endpoint
      const response = await api.post("/api/feedback/submit", data)
      return response.data
    },
    onSuccess: () => {
      setShowSuccess(true)
      // Reset form after 5 seconds
      setTimeout(() => {
        form.reset({
          name: Client?.full_name || "",
          email: Client?.email || "",
          feedback: "",
          rating: undefined,
        })
        setShowSuccess(false)
      }, 5000)
    },
    onError: (error) => {
      console.error("Feedback submission error:", error)
      form.setError("root", {
        message: typeof error === "string" ? error : "Failed to submit feedback. Please try again.",
      })
    },
  })

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const payload: FeedbackPayload = {
      name: values.name,
      email: values.email,
      feedback: values.feedback,
      rating: values.rating,
    }

    console.log("Submitting feedback:", payload)
    submitFeedback.mutate(payload)
  }

  return (
    <Card className=" mx-auto overflow-hidden shadow-lg p-0 lg:w-8/12 sm:w-4/5 w-full rounded-none sm:rounded-xl">
      <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 ">
        <div className="flex items-center justify-center">
          <div className="p-3 bg-white/20 rounded-full">
            <MessageSquare className="h-6 w-6" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">We Value Your Feedback</CardTitle>
        <CardDescription className="text-white/90 text-center">
          Share your thoughts to help us improve our services
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 pt-8">
        {showSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <Check className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-800">Thank You!</AlertTitle>
            <AlertDescription className="text-green-700">
              Your feedback has been submitted successfully. We appreciate your input!
            </AlertDescription>
          </Alert>
        )}

        {form.formState.errors.root && (
          <Alert className="mb-6 bg-red-50 border-red-200" variant="destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly className="bg-gray-50" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" readOnly className="bg-gray-50" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (Optional)</FormLabel>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => field.onChange(star)}
                          className={`p-1 rounded-md transition-colors ${
                            (field.value || 0) >= star
                              ? "text-yellow-400 hover:text-yellow-500"
                              : "text-gray-300 hover:text-gray-400"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-8 h-8"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="feedback"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Feedback</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please share your experience with our service..."
                        className="min-h-[150px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <div className="text-xs text-gray-500 mt-1 text-right">{field.value.length}/500 characters</div>
                  </FormItem>
                )}
              />
            </div>

            <CardFooter className="px-0 pt-2">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-600"
                disabled={submitFeedback.isPending}
              >
                {submitFeedback.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Feedback"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}


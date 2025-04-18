import type React from "react"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Check, AlertCircle, Loader2, CreditCard, Calendar, Lock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Link } from "react-router-dom"
import { VALID_CARDS } from "@/constants"
import api from "@/api"
import { useMutation } from "@tanstack/react-query"
import { format } from "date-fns"

// Unified interface for both appointment types
interface PaymentState {
  formData: {
    car_type: string
    car_name: string
    wash_type: string
    price: number
    status: string
    payment_method: string
    notes?: string
    // Home service specific fields
    place?: string
    time?: string
    // Location specific fields
    date?: string | Date
  }
  amount: number
  description: string
  appointmentType: "home" | "location" // To differentiate between appointment types
}

export default function PaymentPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [paymentState, setPaymentState] = useState<PaymentState | null>(null)

  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")

  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Get payment details from location state
    if (location.state) {
      setPaymentState(location.state as PaymentState)
    } else {
      // Redirect if no payment details
      navigate("/booking")
    }
  }, [location, navigate])

  // Create mutation for home service appointments
  const createHomeAppointment = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/api/appointments_domicile/create", data)
      return response.data
    },
    onSuccess: () => {
      setSuccess(true)
      // Redirect to history after 3 seconds
      setTimeout(() => {
        navigate("/history")
      }, 3000)
    },
    onError: (error) => {
      console.error("Appointment error:", error)
      setError("Failed to create appointment. Please try again.")
      setIsProcessing(false)
    },
  })

  // Create mutation for location appointments
  const createLocationAppointment = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/api/appointments_location/create", data)
      return response.data
    },
    onSuccess: () => {
      setSuccess(true)
      // Redirect to history after 3 seconds
      setTimeout(() => {
        navigate("/history")
      }, 3000)
    },
    onError: (error) => {
      console.error("Appointment error:", error)
      setError("Failed to create appointment. Please try again.")
      setIsProcessing(false)
    },
  })

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Format expiry date (MM/YY)
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return v
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsProcessing(true)

    // Basic validation
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      setError("Please fill in all card details")
      setIsProcessing(false)
      return
    }

    // Check if card is valid (from our static list)
    const cleanCardNumber = cardNumber.replace(/\s+/g, "")
    const isValidCard = VALID_CARDS.some((card) => card.number === cleanCardNumber)

    if (!isValidCard) {
      setError("Invalid card number. Please try a different card.")
      setIsProcessing(false)
      return
    }

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))
    
      // If card is valid and payment state exists, create the appointment
      if (paymentState?.formData) {
        // Format the date if it's a Date object
        const formattedData = { ...paymentState.formData }
        
        // Check if date is a Date object and format it
        if (formattedData.date instanceof Date) {
          formattedData.date = format(formattedData.date, "yyyy-MM-dd")
        }
        
        // Create the appointment with the formatted form data
        if (paymentState.appointmentType === "home") {
          createHomeAppointment.mutate(formattedData)
        } else {
          createLocationAppointment.mutate(formattedData)
        }
      } else {
        setError("Missing appointment data. Please try again.")
        setIsProcessing(false)
      }
    } catch (err) {
      setError("Payment processing failed. Please try again.")
      setIsProcessing(false)
    }
  }

  if (!paymentState) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  // Determine appointment details to display based on type
  const renderAppointmentDetails = () => {
    if (paymentState.appointmentType === "home") {
      return (
        <>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Service:</span>
            <span className="font-medium">{paymentState.description}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Location:</span>
            <span className="font-medium">{paymentState.formData.place}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium">{paymentState.formData.time}</span>
          </div>
        </>
      )
    } else {
      return (
        <>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Service:</span>
            <span className="font-medium">{paymentState.description}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">
              {typeof paymentState.formData.date === "string"
                ? paymentState.formData.date
                : paymentState.formData.date instanceof Date
                  ? paymentState.formData.date.toLocaleDateString()
                  : ""}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium">{paymentState.formData.time}</span>
          </div>
        </>
      )
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-xl md:text-4xl font-bold text-center text-cyan-600 my-4">Complete Your Payment</h1>
      <Link
        to="/booking"
        className="text-gray-500 hover:text-gray-700 transition duration-200 underline flex justify-center mb-6"
      >
        Cancel and go back
      </Link>

      <div className="max-w-md mx-auto">
        {success ? (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <Check className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-800">Payment Successful!</AlertTitle>
            <AlertDescription className="text-green-700">
              Your payment has been processed successfully. Your appointment is now confirmed.
              <br />
              Redirecting to your appointments...
            </AlertDescription>
          </Alert>
        ) : (
          <Card className="p-0 pb-4">
            <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-t-xl py-5">
              <CardTitle>Payment Details</CardTitle>
              <CardDescription className="text-gray-100">Complete your payment for car wash service</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {error && (
                <Alert className="mb-6 bg-red-50 border-red-200" variant="destructive">
                  <AlertCircle className="h-5 w-5" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="mb-6 p-4 bg-gray-50 rounded-md">
                {renderAppointmentDetails()}
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold text-lg">{paymentState.amount} DZD</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber" className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Card Number
                  </Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate" className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Expiry Date
                    </Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      maxLength={5}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv" className="flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      CVV
                    </Label>
                    <Input
                      id="cvv"
                      type="password"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ""))}
                      maxLength={3}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-6"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    `Pay ${paymentState.amount} DZD`
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col items-start text-xs text-gray-500">
              <div className="flex items-center mb-1">
                <Lock className="h-3 w-3 mr-1" />
                <span>Your payment information is secure</span>
              </div>
              <p>This is a demo payment page. For testing, use one of the valid test cards.</p>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}

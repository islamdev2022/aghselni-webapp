"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Check, AlertCircle, Loader2, CreditCard, Banknote } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useClient } from "@/contexts/clientContext"
import { useMutation } from "@tanstack/react-query"
import api from "@/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Link, useNavigate } from "react-router-dom"

// Define form schema with Zod validation
const formSchema = z.object({
  carType: z.string().min(1, "Car type is required"),
  carModel: z.string().min(1, "Car model is required"),
  washType: z.enum(["interior", "exterior", "full"]),
  timeSlot: z.string().min(1, "Time slot is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  price: z.number(),
  notes: z.string().optional(),
  paymentMethod: z.enum(["cash", "card"]),
})

// API request payload interface
interface AppointmentLocationPayload {
  car_type: string
  car_name: string
  wash_type: string
  date: string
  time: string
  price: number
  status?: string
  payment_method: string
}

// Price calculation constants
const BASE_PRICES = {
  Sedan: { interior: 120, exterior: 80, full: 160 },
  SUV: { interior: 160, exterior: 120, full: 240 },
  Truck: { interior: 200, exterior: 160, full: 320 },
  Compact: { interior: 100, exterior: 60, full: 140 },
  Minivan: { interior: 180, exterior: 140, full: 280 },
}

// Available time slots
const TIME_SLOTS = [
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
]

export default function AppointmentCarWashForm() {
  const { Client } = useClient()
  const navigate = useNavigate()

  // Add state for success message
  const [showSuccess, setShowSuccess] = useState(false)

  // Initialize form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      carType: "",
      carModel: "",
      washType: "full",
      timeSlot: "",
      notes: "",
      paymentMethod: "cash",
      price: 0,
    },
  })

  // Watch for car type and wash type changes to calculate price
  const carType = form.watch("carType")
  const washType = form.watch("washType")
  const paymentMethod = form.watch("paymentMethod")

  // Calculate price whenever car type or wash type changes
  useEffect(() => {
    if (carType && washType) {
      const carPrices = BASE_PRICES[carType as keyof typeof BASE_PRICES]
      if (carPrices) {
        form.setValue("price", carPrices[washType as keyof typeof carPrices])
      }
    }
  }, [carType, washType, form])

  // Create mutation for post request
  const createAppointment = useMutation({
    mutationFn: async (data: AppointmentLocationPayload) => {
      const response = await api.post("/api/appointments_location/create", data)
      return response.data
    },
    onSuccess: () => {
      setShowSuccess(true)
      // Reset form after 5 seconds
      setTimeout(() => {
        form.reset()
        setShowSuccess(false)
      }, 5000)
    },
    onError: (error) => {
      console.error("Appointment error:", error)
      form.setError("root", {
        message: typeof error === "string" ? error : "Failed to create appointment. Please try again.",
      })
    },
  })

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // If payment method is card, navigate to payment page with form data
    if (values.paymentMethod === "card") {
      // Format time from timeSlot (e.g., "08:00 - 09:00" -> "08:00")
      const time = values.timeSlot.split(" - ")[0]

      // Navigate to payment page with all the form data
      navigate("/booking/payment", {
        state: {
          formData: {
            car_type: values.carType,
            car_name: values.carModel,
            wash_type: values.washType,
            date: format(values.date, "yyyy-MM-dd"),
            time: time,
            price: values.price,
            status: "Paid", // Will be set to Paid when card payment is successful
            payment_method: values.paymentMethod,
            notes: values.notes,
          },
          amount: values.price,
          description: `${values.carType} - ${values.washType} wash`,
          appointmentType: "location", // To differentiate from home service
        },
      })
      return
    }

    // For cash payment, create appointment immediately
    // Format time from timeSlot (e.g., "08:00 - 09:00" -> "08:00")
    const time = values.timeSlot.split(" - ")[0]

    // Format date and time for the API
    const payload: AppointmentLocationPayload = {
      car_type: values.carType,
      car_name: values.carModel,
      wash_type: values.washType,
      date: format(values.date, "yyyy-MM-dd"),
      time: time,
      price: values.price,
      status: "Pending",
      payment_method: values.paymentMethod,
    }

    console.log("Submitting appointment:", payload)
    createAppointment.mutate(payload)
  }

  return (
    <>
      <h1 className="text-xl md:text-4xl font-bold text-center text-cyan-600 my-4">Book Your Car Wash Appointment</h1>
      <Link
        to="/booking"
        className="text-gray-500 hover:text-gray-700 transition duration-200 underline flex justify-center "
      >
        Go back to options
      </Link>
      <Card className="max-w-2xl mx-auto overflow-hidden shadow-lg mt-6 rounded-none sm:rounded-xl p-0">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6">
          <CardTitle className="text-3xl font-bold text-white text-center">Rendez-vous</CardTitle>
          <CardDescription className="text-white text-center mt-2">
            Schedule an appointment at our car wash location
          </CardDescription>
        </div>

        <CardContent className="p-6 pt-8">
          {showSuccess && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <Check className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-800">Booking Confirmed!</AlertTitle>
              <AlertDescription className="text-green-700">
                Your car wash appointment has been scheduled successfully. You will receive a confirmation shortly.
                <br />
                You can see the details in{" "}
                <Link to="/history" className=" underline">
                  Click Here
                </Link>
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Personal Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" name="fullName" value={Client?.full_name} className="bg-gray-50" readOnly />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" name="phoneNumber" value={Client?.phone} className="bg-gray-50" readOnly />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" value={Client?.email} className="bg-gray-50" readOnly />
                </div>
              </div>

              {/* Car Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Car Information</h3>

                <FormField
                  control={form.control}
                  name="carType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Car Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select car type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sedan">Sedan</SelectItem>
                          <SelectItem value="SUV">SUV</SelectItem>
                          <SelectItem value="Truck">Truck</SelectItem>
                          <SelectItem value="Compact">Compact</SelectItem>
                          <SelectItem value="Minivan">Minivan</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="carModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Car Name (Model & Brand)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Honda Civic" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="washType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Wash Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50">
                            <RadioGroupItem value="interior" id="interior" />
                            <Label htmlFor="interior" className="flex-1 cursor-pointer">
                              Interior Only
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50">
                            <RadioGroupItem value="exterior" id="exterior" />
                            <Label htmlFor="exterior" className="flex-1 cursor-pointer">
                              Exterior Only
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50">
                            <RadioGroupItem value="full" id="full" />
                            <Label htmlFor="full" className="flex-1 cursor-pointer">
                              Full Wash (Interior + Exterior)
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Appointment Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Appointment Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeSlot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Time Slot</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TIME_SLOTS.map((slot: string) => (
                              <SelectItem key={slot} value={slot}>
                                {slot}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special instructions or requests"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Payment Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Payment Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (MAD)</FormLabel>
                        <FormControl>
                          <Input type="number" className="font-semibold" readOnly {...field} value={field.value || 0} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Payment Method</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50">
                              <RadioGroupItem value="cash" id="location-cash" />
                              <Label htmlFor="location-cash" className="flex-1 cursor-pointer flex items-center">
                                <Banknote className="mr-2 h-4 w-4" />
                                Pay at Location
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50">
                              <RadioGroupItem value="card" id="location-card" />
                              <Label htmlFor="location-card" className="flex-1 cursor-pointer flex items-center">
                                <CreditCard className="mr-2 h-4 w-4" />
                                Credit/Debit Card
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-6 cursor-pointer"
                disabled={createAppointment.isPending}
              >
                {createAppointment.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin cursor-progress" />
                    Processing...
                  </>
                ) : paymentMethod === "cash" ? (
                  "Book Appointment"
                ) : (
                  "Proceed to Payment"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}

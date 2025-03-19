import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useClient } from "@/contexts/clientContext";
import { useMutation } from "@tanstack/react-query";
import api from "@/api";
// Define interface for form data
interface AppointmentFormData {
  carType: string;      // maps to car_type
  carModel: string;     // maps to car_name
  washType: string;
  timeSlot: string;
  date: Date | undefined;
  price: number;
  notes: string;
  paymentMethod: string;
}

interface AppointmentLocationPayload {
  car_type: string;
  car_name: string;
  wash_type: string;
  date: string;
  time: string;
  price: number;
  // notes: string;
}

// Price calculation constants
const BASE_PRICES = {
  "Sedan": { interior: 120, exterior: 80, full: 160 },
  "SUV": { interior: 160, exterior: 120, full: 240 },
  "Truck": { interior: 200, exterior: 160, full: 320 },
  "Compact": { interior: 100, exterior: 60, full: 140 },
  "Minivan": { interior: 180, exterior: 140, full: 280 },
};

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
];

export default function AppointmentCarWashForm() {
  const { Client } = useClient();
  // Initialize form data with user details
  const [formData, setFormData] = useState<AppointmentFormData>({
    carType: "",
    carModel: "",
    washType: "full",
    timeSlot: "",
    date: undefined,
    price: 0,
    notes: "",
    paymentMethod: "cash",
  });

  // Calculate price whenever car type or wash type changes
  useEffect(() => {
    if (formData.carType && formData.washType) {
      const carPrices = BASE_PRICES[formData.carType as keyof typeof BASE_PRICES];
      if (carPrices) {
        setFormData((prev) => ({
          ...prev,
          price: carPrices[formData.washType as keyof typeof carPrices],
        }));
      }
    }
  }, [formData.carType, formData.washType]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle radio group changes
  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      washType: value,
    }));
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      date,
    }));
  };

  // Create mutation for post request
  const createAppointment = useMutation({
    mutationFn: async (data: AppointmentLocationPayload) => {
      const response = await api.post('/api/appointments_location/create', data);
      return response.data;
    },
    onSuccess: () => {
      alert("Appointment created successfully");
      // Reset form or redirect
      resetForm();
    },
    onError: (error) => {
      console.error("Appointment error:", error);
      alert(error);
    }
  });

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      carType: "",
      carModel: "",
      washType: "full",
      timeSlot: "",
      date: undefined,
      price: 0,
      notes: "",
      paymentMethod: "cash",
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Input validation
    if (!formData.carType || !formData.carModel ||  !formData.timeSlot || !formData.date ) {
      alert("Please fill all required fields");
      return;
    }

    const time = formData.timeSlot.split(" - ")[0];
    // Prepare payload
    const payload: AppointmentLocationPayload = {
      car_type: formData.carType,
      car_name: formData.carModel,
      wash_type: formData.washType,
      date: formData.date ? format(formData.date, "yyyy-MM-dd") : "",
      time: time,
      price: formData.price,
      // notes: formData.notes,
    };
    console.log("Submitting appointment data:", payload);


    
    // Call the mutation to send the data to your backend
    createAppointment.mutate(payload);
  };

  return (
    <Card className=" max-w-2xl mx-auto bg-gradient-to-br from-cyan-200 to-cyan-600">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white">Rendez-vous</CardTitle>
        <CardDescription className="text-white">
          Schedule an appointment at our car wash location
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={Client?.full_name}
                  className="bg-white/90"
                  readOnly
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-white">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={Client?.phone}
                  className="bg-white/90"
                  readOnly
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                name="email"
                value={Client?.email}
                className="bg-white/90"
                readOnly
              />
            </div>
          </div>

          {/* Car Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Car Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="carType" className="text-white">Car Type</Label>
              <Select
                onValueChange={(value: string) => handleSelectChange("carType", value)}
                defaultValue={formData.carType}
              >
                <SelectTrigger className="bg-white/90">
                  <SelectValue placeholder="Select car type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sedan">Sedan</SelectItem>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="Truck">Truck</SelectItem>
                  <SelectItem value="Compact">Compact</SelectItem>
                  <SelectItem value="Minivan">Minivan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="carModel" className="text-white">Car Name (Model & Brand)</Label>
              <Input
                id="carModel"
                name="carModel"
                placeholder="e.g., Honda Civic"
                value={formData.carModel}
                onChange={handleChange}
                className="bg-white/90"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-white">Wash Type</Label>
              <RadioGroup
                value={formData.washType}
                onValueChange={handleRadioChange}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="interior" id="interior" />
                  <Label htmlFor="interior" className="text-white">Interior Only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="exterior" id="exterior" />
                  <Label htmlFor="exterior" className="text-white">Exterior Only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full" id="full" />
                  <Label htmlFor="full" className="text-white">Full Wash (Interior + Exterior)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Appointment Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-white">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-white/90",
                        !formData.date && "text-gray-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeSlot" className="text-white">Preferred Time Slot</Label>
                <Select
                  onValueChange={(value: string) => handleSelectChange("timeSlot", value)}
                  defaultValue={formData.timeSlot}
                >
                  <SelectTrigger className="bg-white/90">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((slot: string) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-white">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Any special instructions or requests"
                value={formData.notes}
                onChange={handleChange}
                className="bg-white/90"
              />
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Payment Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-white">Price (MAD)</Label>
                <Input
                  id="price"
                  name="price"
                  value={formData.price}
                  className="bg-white/90 font-semibold"
                  readOnly
                />
              </div>
              
              {/* <div className="space-y-2">
                <Label htmlFor="paymentMethod" className="text-white">Payment Method</Label>
                <Select
                  onValueChange={(value: string) => handleSelectChange("paymentMethod", value)}
                  defaultValue={formData.paymentMethod}
                >
                  <SelectTrigger className="bg-white/90">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="online">Online Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-cyan-800 hover:bg-cyan-900 text-white">
            Book Appointment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
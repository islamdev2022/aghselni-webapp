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

// Define interface for form data
interface HomeCarWashFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  carType: string;
  carModel: string;
  washType: "interior" | "exterior" | "full";
  address: string;
  timeSlot: string;
  date: Date | undefined;
  price: number;
  notes: string;
  paymentMethod: string;
}

// Mock user data that would normally come from your auth system
// const mockUserData = {
//   fullName: "John Doe",
//   phoneNumber: "+212 612345678",
//   email: "john.doe@example.com",
// };

// Price calculation constants
const BASE_PRICES = {
  "Sedan": { interior: 150, exterior: 100, full: 200 },
  "SUV": { interior: 200, exterior: 150, full: 300 },
  "Truck": { interior: 250, exterior: 200, full: 400 },
  "Compact": { interior: 120, exterior: 80, full: 180 },
  "Minivan": { interior: 220, exterior: 170, full: 350 },
};

// Available time slots
const TIME_SLOTS = [
  "08:00 - 10:00",
  "10:00 - 12:00",
  "12:00 - 14:00",
  "14:00 - 16:00",
  "16:00 - 18:00",
];

export default function HomeCarWashForm() {
  // Initialize form data with user details
  const [formData, setFormData] = useState<HomeCarWashFormData>({
    // fullName: mockUserData.fullName,
    // phoneNumber: mockUserData.phoneNumber,
    // email: mockUserData.email,
    fullName: "",
    phoneNumber: "",
    email: "",
    carType: "",
    carModel: "",
    washType: "full",
    address: "",
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
          price: carPrices[formData.washType],
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
  const handleRadioChange = (value: "interior" | "exterior" | "full") => {
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

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    // Here you would typically send the data to your backend
    alert("Form submitted successfully!");
    // You could also reset the form or redirect the user
  };

  return (
    <Card className=" max-w-2xl mx-auto bg-gradient-to-br from-cyan-200 to-cyan-600">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white">Aghselni à Domicile</CardTitle>
        <CardDescription className="text-white">
          Schedule a car wash at your preferred location
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
                  value={formData.fullName}
                  onChange={handleChange}
                  className="bg-white/90"
                  // readOnly
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-white">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="bg-white/90"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                className="bg-white/90"
                // readOnly
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
                placeholder="e.g., Toyota Corolla"
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

          {/* Service Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Service Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="address" className="text-white">Address / Location</Label>
              <Input
                id="address"
                name="address"
                placeholder="Your full address"
                value={formData.address}
                onChange={handleChange}
                className="bg-white/90"
              />
            </div>
            
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
                placeholder="Any special instructions or requirements"
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
              
              <div className="space-y-2">
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
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-cyan-800 hover:bg-cyan-900 text-white">
            Schedule Home Car Wash
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
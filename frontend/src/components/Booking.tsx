"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Home, ArrowRight, Car } from "lucide-react"
import { motion } from "framer-motion"

const Booking = () => {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null)

  const bookingOptions = [
    {
      id: "local",
      title: "Car Wash at Our Location",
      description: "Visit our facility for a professional car wash service",
      icon: <MapPin className="h-10 w-10 mb-4" />,
      path: "/booking/local",
      color: "from-cyan-500 to-blue-600",
      benefits: ["No waiting at home", "Full facility equipment", "Quick service", "Additional services available"],
    },
    {
      id: "domicile",
      title: "Car Wash at Your Home",
      description: "We come to your location for convenient service",
      icon: <Home className="h-10 w-10 mb-4" />,
      path: "/booking/domicile",
      color: "from-cyan-600 to-teal-500",
      benefits: ["No need to drive", "Convenience of home", "Flexible scheduling", "Personal attention"],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-2xl md:text-4xl font-bold text-center text-cyan-600 mb-4">Choose Your Service</h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Select the type of car wash service that best fits your needs and schedule
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {bookingOptions.map((option) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.03 }}
            onHoverStart={() => setHoveredOption(option.id)}
            onHoverEnd={() => setHoveredOption(null)}
          >
            <Link to={option.path} className="block h-full">
              <Card
                className={`h-full overflow-hidden cursor-pointer border-2 sm:p-4 shadow-lg transition-all duration-300 p-0 ${
                  hoveredOption === option.id ? "shadow-xl" : ""
                }`}
              >
                <div className={`bg-gradient-to-r ${option.color} rounded-xl p-8 text-white h-full flex flex-col`}>
                  <div className="flex flex-col items-center text-center mb-6">
                    {option.icon}
                    <h2 className="text-2xl font-bold mb-2">{option.title}</h2>
                    <p className="text-white/90">{option.description}</p>
                  </div>

                  <div className="bg-white/10 rounded-lg p-5 mb-6 flex-grow">
                    <h3 className="font-medium mb-3 text-white/90">Benefits:</h3>
                    <ul className="space-y-2">
                      {option.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <div className="mr-2 mt-1">
                            <div className="h-2 w-2 rounded-full bg-white/90"></div>
                          </div>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      className="bg-white/10 border-white/20 hover:bg-white/20 text-white group cursor-pointer"
                    >
                      Book Now
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <div className="inline-flex items-center justify-center p-4 bg-cyan-50 rounded-full mb-4">
          <Car className="h-6 w-6 text-cyan-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Premium Car Wash Services</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Whether you choose to visit us or have us come to you, we guarantee a spotless, showroom-quality finish for
          your vehicle with our professional cleaning services.
        </p>
      </div>
    </div>
  )
}

export default Booking


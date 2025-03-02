import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      text: "I was skeptical at first, but SparkleWash exceeded my expectations! The team arrived on time and did an amazing job. My car hasn't looked this good in years.",
      author: "Michael Johnson",
      role: "Satisfied Customer",
      avatar: "/avatar1.jpg"
    },
    {
      text: "As a busy mom, I never have time to take my car to the wash. SparkleWash has been a lifesaver! I schedule the service during my work hours and come home to a spotless car.",
      author: "Sarah Williams",
      role: "Loyal Customer",
      avatar: "/avatar2.jpg"
    },
    {
      text: "The convenience factor is off the charts! The booking system is super easy to use, and the team is always professional and thorough. The deluxe detail package is worth every penny.",
      author: "David Chen",
      role: "Premium Member",
      avatar: "/avatar3.jpg"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-cyan-600 mb-16">What Our Customers Say</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative bg-gray-50">
              <CardContent className="pt-8">
                <Quote className="absolute text-cyan-600 opacity-30 top-4 left-4 w-8 h-8" />
                <p className="italic text-gray-600 mb-6">{testimonial.text}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.author}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).onerror = null; 
                        (e.target as HTMLImageElement).src = `https://placehold.co/50x50/cyan/white?text=${testimonial.author.charAt(0)}`;
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
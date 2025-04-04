import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';
import { useQuery } from "@tanstack/react-query"
import { Star } from "lucide-react"
import api from "@/api"
interface Feedback{
  name : string
  content : string
  rating: number
  created_at : Date
}
const Testimonials = () => {

  const { data: feedbacks, isLoading } = useQuery({
    queryKey: ["feedback"],
    queryFn: async () => {
      const response = await api.get<Feedback[]>("/api/feedback/all/")
      return response.data
    },
  })
  console.log(feedbacks)

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <h1 className="text-2xl md:text-4xl font-bold text-center text-cyan-600 mb-4">Loading...</h1>
      </div>
    )
  }


  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-cyan-600 mb-16">What Our Customers Say</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {feedbacks?.map((feedback, index) => (
            <Card key={index} className="relative bg-gray-50">
              <CardContent className="pt-1">
                <div className='flex w-full justify-between items-center mb-4'>
                <Quote className=" text-cyan-600 opacity-30 w-8 h-8" />
                <p className='text-gray-500'>{new Date(feedback.created_at).toLocaleDateString()}</p>
                </div>
                <p className="italic text-gray-600 mb-6">{feedback.content}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
                    <img 
                      src={`https://placehold.co/50x50/cyan/white?text=${feedback.name.charAt(0)}`}
                      alt={feedback.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).onerror = null; 
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{feedback.name}</h4>
                    {renderStars(feedback.rating)}
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
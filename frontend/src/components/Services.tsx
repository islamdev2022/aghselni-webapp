import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from "react-router"
const Services = () => {
  const services = [
    {
      title: "Interior Wash",
      description: "Interior vacuum, dashboard cleaning, and window washing.",
      price: "500DA",
      image: "/22314.jpg"
    },
    {
      title: "Exterior Wash",
      description: "Exterior wash, tire cleaning, and waxing. Perfect for a quick clean.",
      price: "500DA",
      image: "/333.jpg"
    },
    {
      title: "Full Car Wash",
      description: "Premium wash plus waxing, deep interior cleaning, and leather conditioning.",
      price: "900DA",
      image: "/deluxe-detail.jpg"
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-cyan-600 mb-16">Our Services</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl pt-0">
              <div className="h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; 
                    target.src = `https://placehold.co/400x200/cyan/white?text=${service.title.replace(' ', '+')}`;
                  }}
                />
              </div>
              <CardHeader>
                <CardTitle className="text-cyan-600">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <p className="text-2xl font-bold">{service.price}</p>
              </CardContent>
              <CardFooter>
                <Link to="/booking" className="w-full">
                  <Button className="w-full bg-cyan-600 hover:bg-cyan-700 cursor-pointer">
                    Book Now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
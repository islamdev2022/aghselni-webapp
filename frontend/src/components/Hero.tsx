import { Button } from '@/components/ui/button';
import { Link } from "react-router"
const Hero = () => {
  return (
    <section id="home" className=" bg-gradient-to-r from-cyan-200 to-cyan-600 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Your Car Deserves a Spa Day at Home
            </h1>
            <p className="text-lg mb-8 opacity-90">
              We bring the car wash to your doorstep. Professional cleaning services at the touch of a button.
            </p>
            <Link to="/booking">
              <Button className="bg-white text-cyan-600 hover:bg-gray-100 shadow-lg text-lg py-6 px-8 rounded-full font-semibold cursor-pointer">
                Book Your Wash
              </Button>
            </Link>

            <div className="grid md:grid-cols-3 gap-4 mt-12 text-cyan-500">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-lg text-center shadow-2xl ">
                <div className="text-3xl mb-2">🕒</div>
                <h3 className="font-bold mb-1 ">Save Time</h3>
                <p className="text-sm">No more waiting in lines</p>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-lg text-center shadow-2xl">
                <div className="text-3xl mb-2">👨‍🔧</div>
                <h3 className="font-bold mb-1">Expert Team</h3>
                <p className="text-sm">Professional detailers</p>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-lg text-center shadow-2xl">
                <div className="text-3xl mb-2">💧</div>
                <h3 className="font-bold mb-1">Eco-Friendly</h3>
                <p className="text-sm">Water-saving technology</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="/16276546_5741939.svg" 
              alt="Mobile car wash service"
              className="rounded-xl shadow-2xl h-full w-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null; 
                target.src = 'https://placehold.co/600x400/cyan/white?text=Car+Wash+Service';
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
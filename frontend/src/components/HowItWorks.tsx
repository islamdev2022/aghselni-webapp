import { Smartphone, MapPin, Sparkles } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Smartphone className="w-16 h-16 text-cyan-600 mx-auto" />,
      title: "Book Online",
      description: "Schedule an appointment through our website or mobile app. Choose the service package that fits your needs."
    },
    {
      icon: <MapPin className="w-16 h-16 text-cyan-600 mx-auto" />,
      title: "We Come to You",
      description: "Our professional team arrives at your location with all equipment needed to give your car a perfect wash."
    },
    {
      icon: <Sparkles className="w-16 h-16 text-cyan-600 mx-auto" />,
      title: "Enjoy the Results",
      description: "Sit back and relax while we transform your car. Approve the work and pay securely through our platform."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-cyan-600 mb-16">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-xl p-8 text-center relative transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-cyan-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <div className="mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
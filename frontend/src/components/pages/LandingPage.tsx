import Hero from "../Hero";
import HowItWorks from "../HowItWorks";
import Services from "../Services";
import Testimonials from "../Testmonials";

const LandingPage = () => {
  return (
    <div className="min-h-screen scroll-smooth">
      <Hero />
      <HowItWorks />
      <Services />
      <Testimonials />
    </div>
  );
};
export default LandingPage;
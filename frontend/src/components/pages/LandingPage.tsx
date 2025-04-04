import Hero from "../Hero";
import HowItWorks from "../HowItWorks";
import Services from "../Services";
import Testimonials from "../Testmonials";
import FeedbackForm from "../Forms/feedback-form";
import { useClient } from "@/contexts/clientContext";
const LandingPage = () => {
  const { Client } = useClient();
  return (
    <div className="min-h-screen scroll-smooth">
      <Hero />
      <HowItWorks />
      <Services />
      <Testimonials />
      {
        Client && <FeedbackForm />
      }
      
    </div>
  );
};
export default LandingPage;
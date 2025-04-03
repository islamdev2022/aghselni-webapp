import Hero from "../Hero";
import HowItWorks from "../HowItWorks";
import Services from "../Services";
import Testimonials from "../Testmonials";
import FeedbackForm from "../Forms/feedback-form";
const LandingPage = () => {
  return (
    <div className="min-h-screen scroll-smooth">
      <Hero />
      <HowItWorks />
      <Services />
      <Testimonials />
      <FeedbackForm />
    </div>
  );
};
export default LandingPage;
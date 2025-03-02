import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Services from './components/Services';
 // Ensure the file './components/Testimonials.tsx' exists
import Testimonials from './components/Testmonials';
import Footer from './components/Footer';
function App() {
  return (
    <div className="min-h-screen scroll-smooth">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Services />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}

export default App;
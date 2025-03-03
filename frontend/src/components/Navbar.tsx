import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className=" sticky top-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-3xl mr-2">💧</span>
            <span className="text-cyan-600 font-bold text-xl">Aghselni</span>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-8">
            <li><Link to="/" className="text-gray-700 hover:text-cyan-600 font-medium duration-200">Home</Link></li>
            <li><a href="#services" className="text-gray-700 hover:text-cyan-600 font-medium duration-200">Services</a></li>
            <li><a href="#how-it-works" className="text-gray-700 hover:text-cyan-600 font-medium duration-200">How It Works</a></li>
            <li><a href="#testimonials" className="text-gray-700 hover:text-cyan-600 font-medium duration-200">Testimonials</a></li>
          </ul>

          <div className="hidden md:block">
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              Sign In
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-4">
            <ul className="flex flex-col space-y-4">
              <li><a href="#home" className="block text-gray-700 hover:text-cyan-600 font-medium">Home</a></li>
              <li><a href="#services" className="block text-gray-700 hover:text-cyan-600 font-medium">Services</a></li>
              <li><a href="#how-it-works" className="block text-gray-700 hover:text-cyan-600 font-medium">How It Works</a></li>
              <li><a href="#testimonials" className="block text-gray-700 hover:text-cyan-600 font-medium">Testimonials</a></li>
              <li>
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                  Sign In
                </Button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

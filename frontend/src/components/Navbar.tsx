import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
// import { useParams } from 'react-router-dom';
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollUp = ()=>{
    window.scrollTo({
      top:0,
      behavior: "smooth",
  });
  }

  return (
    <header className=" sticky top-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to = "/" className="flex items-center" onClick={scrollUp}>
            <span className="text-3xl mr-2">💧</span>
            <span className="text-cyan-600 font-bold text-xl">Aghselni</span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-8">
            <li><Link to="/" className="text-gray-700 hover:text-cyan-600 font-medium duration-200" onClick={scrollUp}>Home</Link></li>
            <li><a href="#services" className="text-gray-700 hover:text-cyan-600 font-medium duration-200">Services</a></li>
            <li><a href="#how-it-works" className="text-gray-700 hover:text-cyan-600 font-medium duration-200">How It Works</a></li>
            <li><a href="#testimonials" className="text-gray-700 hover:text-cyan-600 font-medium duration-200">Testimonials</a></li>
          </ul>

          <div className="hidden md:block space-x-4">
            <Link to="/login">
              <Button className="bg-cyan-600 hover:bg-cyan-700 cursor-pointer">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-white text-cyan-600 hover:bg-slate-100 cursor-pointer shadow">
                Sign Up
              </Button>
            </Link>
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
            <ul className="flex flex-col space-y-4 text-center">
              <li><a href="/" className="block text-gray-700 hover:text-cyan-600 font-medium" onClick={scrollUp}>Home</a></li>
              <li><a href="#services" className="block text-gray-700 hover:text-cyan-600 font-medium">Services</a></li>
              <li><a href="#how-it-works" className="block text-gray-700 hover:text-cyan-600 font-medium">How It Works</a></li>
              <li><a href="#testimonials" className="block text-gray-700 hover:text-cyan-600 font-medium">Testimonials</a></li>
              <li>
                <Link to="/login">
                  <Button className="w-full bg-cyan-600 hover:bg-cyan-700 cursor-pointer">
                    Sign In
                  </Button>
                </Link>
              </li>
              <li>
                <Link to="/signup">
                  <Button className="w-full bg-white text-cyan-600 hover:bg-slate-100 cursor-pointer shadow">
                    Sign Up
                  </Button>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

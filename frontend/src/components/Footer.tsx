import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-cyan-800 text-white pt-16 pb-8 text-center">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold mb-6 pb-2 border-b-2 border-cyan-400 inline-block">Aghselni</h3>
            <p className="mb-4 opacity-80">We bring professional car washing services to your doorstep. Save time and enjoy a spotless vehicle without leaving your home.</p>
            <div className="flex space-x-4 mt-6 justify-center">
              <a href="#" className="w-10 h-10 rounded-full bg-opacity-10 flex items-center justify-center hover:bg-cyan-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-opacity-10 flex items-center justify-center hover:bg-cyan-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-opacity-10 flex items-center justify-center hover:bg-cyan-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-opacity-10 flex items-center justify-center hover:bg-cyan-400 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 border-b-2 border-cyan-400 inline-block">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#home" className="opacity-80 hover:opacity-100">Home</a></li>
              <li><a href="#services" className="opacity-80 hover:opacity-100">Services</a></li>
              <li><a href="#how-it-works" className="opacity-80 hover:opacity-100">How It Works</a></li>
              <li><a href="#testimonials" className="opacity-80 hover:opacity-100">Testimonials</a></li>
              <li><a href="/booking" className="opacity-80 hover:opacity-100">Book Now</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 border-b-2 border-cyan-400 inline-block">Services</h3>
            <ul className="space-y-3">
              <li><a href="#" className="opacity-80 hover:opacity-100">Basic Wash</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100">Premium Wash</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100">Deluxe Detail</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100">Corporate Packages</a></li>
              <li><a href="#" className="opacity-80 hover:opacity-100">Gift Cards</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 border-b-2 border-cyan-400 inline-block">Contact Us</h3>
            <ul className="space-y-3">
              <li className="opacity-80">Jijel Algeria</li>
              <li className="opacity-80">Phone: (123) 456-7890</li>
              <li className="opacity-80">Email: contact@aghselni.com</li>
              <li className="opacity-80">24h / 7d</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white border-opacity-10 text-center opacity-70">
          <p>&copy; {new Date().getFullYear()} Aghselni. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
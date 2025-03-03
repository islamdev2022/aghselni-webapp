import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import Booking from "./components/Booking";
function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/booking" element={<Booking></Booking>} />
            <Route path="/history" element={<p>Client History</p>}></Route>
            <Route path="*" element={<p>Not found</p>} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;

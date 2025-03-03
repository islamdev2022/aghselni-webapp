import AppointmentCarWashForm from "./Forms/AppointmentCarWashForm";
import HomeCarWashForm from "./Forms/HomeCarWashForm";

const Booking = () => {
  return (
    <div className="flex flex-col items-center space-y-8">
        <h1 className="text-4xl font-bold text-center text-cyan-500 mt-8">Book Your Appointment</h1>
        <div className="flex w-full justify-between flex-wrap pb-10">
            <HomeCarWashForm />
            <AppointmentCarWashForm />
        </div>
      
    </div>
  );
};
export default Booking;
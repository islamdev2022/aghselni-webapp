interface AppointmentTabsProps {
  activeTab: 'pending' | 'claimed';
  setActiveTab: (tab: 'pending' | 'claimed') => void;
}

export default function AppointmentTabs({ activeTab, setActiveTab }: AppointmentTabsProps) {
  return (
    <div className="mb-6 border-b border-gray-200">
      <div className="flex space-x-6">
        <button
          className={`border-b-2 px-1 pb-4 text-sm font-medium ${
            activeTab === "pending"
              ? "border-cyan-500 text-cyan-600"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Appointments
        </button>
        <button
          className={`border-b-2 px-1 pb-4 text-sm font-medium ${
            activeTab === "claimed"
              ? "border-cyan-500 text-cyan-600"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("claimed")}
        >
          My Appointments
        </button>
      </div>
    </div>
  )
}
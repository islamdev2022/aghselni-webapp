import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface UserDropdownProps {
  userData: {
    id: number;
    full_name?: string;
    email?: string;
    photo?: string;
    age?: number;
    phone_number?: string;
  } | null;
  handleLogout: () => void;
  logoutMutation: {
    isPending: boolean;
  };
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  userData,
  handleLogout,
  logoutMutation,
}) => {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate(`/profile/client/${userData?.id}/`);
  };
  console.log(userData?.photo);
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div className="flex items-center h-10 w-10 rounded-full bg-cyan-600 text-white cursor-pointer hover:bg-cyan-700">
          <div className="flex items-center justify-center w-full h-full font-semibold text-xl">
            {/* <User size={18} /> */}
            <img
              src={`${
                userData?.photo
                  ? `http://127.0.0.1:8000/${userData?.photo}`
                  : `${(
                      <div>
                        {userData?.full_name?.indexOf(" ") !== -1
                          ? userData?.full_name
                              ?.split(" ")[0]
                              .charAt(0)
                              .toUpperCase()
                          : userData?.full_name?.charAt(0).toUpperCase()}
                      </div>
                    )}`
              }`}
              alt="Profile Image"
            />
          </div>
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content 
          className="min-w-[220px] bg-white rounded-md shadow-lg p-2 z-50"
          sideOffset={5}
          align="end"
        >
          <div className="p-2 border-b border-gray-100">
            <div className="font-medium text-gray-800">
              {userData?.full_name || 'Profile'}
            </div>
            <div className="text-sm text-gray-500">
              {userData?.email || 'No email'}
            </div>
          </div>

          <DropdownMenu.Item className="outline-none" asChild>
            <div 
              onClick={handleEditProfile}
              className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-slate-100 rounded cursor-pointer"
            >
              <Settings size={16} />
              <span>Edit Profile</span>
            </div>
          </DropdownMenu.Item>

          <DropdownMenu.Item className="outline-none" asChild>
            <div 
              onClick={() => navigate("/history")}
              className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-slate-100 rounded cursor-pointer"
            >
              <Settings size={16} />
              <span>History</span>
            </div>
          </DropdownMenu.Item>

          <DropdownMenu.Item className="outline-none" asChild>
            <div 
              onClick={handleLogout}
              className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-slate-100 rounded cursor-pointer"
            >
              <LogOut size={16} />
              <span>
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </span>
            </div>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default UserDropdown;

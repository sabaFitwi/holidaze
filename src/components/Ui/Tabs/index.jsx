import React, { useState, useEffect } from "react";
import BookingsCards from "../../Cards/MyBookings";
import VenuesCards from "../../Cards/MyVenues";
import { updateAuthStatus } from "../../utils/authUtils";

const Tabs = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState("My Booking");
  const [isVenueManager, setIsVenueManager] = useState(false);
  const [position, setPosition] = useState("");

  useEffect(() => {
    updateAuthStatus(setIsVenueManager);
  }, []);

  const changeTab = (tab) => {
    setActiveTab(tab);
    onTabChange(tab);

    setPosition(tab === "My Booking" ? "translateX(0)" : "translateX(100%)");
  };

  return (
    <div>
      <div className="flex justify-center max-w-full space-x-5 pt-1 ">
        <button
          className={`${
            activeTab === "My Booking"
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-400"
          } w-full  p-2 text  my-1 rounded-t-lg cursor-pointer`}
          onClick={() => changeTab("My Booking")}
        >
          Your Bookings
        </button>
        {isVenueManager && (
          <button
            className={`${
              activeTab === "My Venue"
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-400"
            }  w-full p-2 text  my-1 rounded-t-lg cursor-pointer`}
            onClick={() => changeTab("My Venue")}
          >
            Your Venues
          </button>
        )}
      </div>

      <div className="bg-white p-0 md:py-2 rounded-b-lg relative overflow-hidden  dark:bg-darkPrimary">
        <div
          className="absolute bg-black dark:bg-dark-primary-hover h-1 w-1/2 transition-transform duration-300"
          style={{ transform: position }}
        />
        {activeTab === "My Booking" && <BookingsCards />}
        {activeTab === "My Venue" && <VenuesCards />}
      </div>
    </div>
  );
};

export default Tabs;

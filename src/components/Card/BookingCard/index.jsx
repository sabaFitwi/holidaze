import React, { useState } from "react";
import ScrollToTopButton from "../../ScrollToTopButton";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { daysSincePosted } from "../../utils/DateSincePost";
import { FaEdit, FaTrash } from "react-icons/fa";

function BookingCard({
  title,
  dateFrom,
  dateTo,
  media,
  updated,
  price,
  guests,
  country,
  continent,
  city,
  onEditClick,
  onDeleteClick,
  isExpired,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <div className="flex flex-col sm:flex-row border dark:border-0 dark:bg-darkSecondary cursor-pointer hover:opacity-90 hover:shadow-xl transition duration-200 ease-out ease my-2">
      <div className="relative w-full md:w-[40%] h-60 ">
        <img
          src={media}
          alt={title}
          className="w-full h-full object-cover py-2"
        />
      </div>

      <div className="w-full md:w-[60%] flex flex-col flex-grow p-4">
        <div className="flex justify-between items-start">
          <p className="font-semibold text mb-2">
            Title: <span className="ml-1 font-normal text">{title}</span>
          </p>

          <div className="relative">
            <div
              onClick={toggleDropdown}
              className="font-semibold cursor-pointer"
            >
              <div className="border-1 py-1 ">
                <PiDotsThreeOutlineVerticalFill />
              </div>
            </div>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 py-2  rounded shadow-lg bg-white dark:bg-black ">
                <div className="flex justify-start items-center px-2 hover:bg-gray-100 hover:dark:bg-darkPrimary ">
                  <FaEdit className="text-gray-500 dark:text-white " />
                  <button
                    onClick={onEditClick}
                    className="block px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-white"
                  >
                    {isExpired ? "ReBook Venue" : "Edit"}
                  </button>
                </div>
                <div className="flex justify-start items-center px-2 hover:bg-gray-100">
                  <FaTrash className="text-red-500 " />
                  <button
                    onClick={onDeleteClick}
                    className="block px-4 py-2 text-sm text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <p
          className={`font-semibold  text pb-2 ${isExpired ? "text-red-500" : ""}`}
        >
          Booked From :
          <span className="ml-1 font-normal">
            {dateFrom}- To -{dateTo}
          </span>
        </p>
        <p className="font-semibold text pb-2">
          Price: <span className="ml-2 font-normal">{price} kr/night</span>
        </p>
        <p className=" font-semibold text pb-2">
          Guests:
          <span className="ml-2 font-normal">{guests} Guests</span>
        </p>
        <p className=" font-semibold  pb-2 text">
          Location:
          <span className=" ml-2 font-normal">
            {continent}, {country}, {city}
          </span>
        </p>
        <p className=" font-semibold text pb-2">
          Booking Created:
          <span className=" ml-1 font-normal">
            {daysSincePosted(updated)} ago
          </span>
        </p>
      </div>
      <ScrollToTopButton />
    </div>
  );
}

export default BookingCard;

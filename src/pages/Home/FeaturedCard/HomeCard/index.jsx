import React from "react";
import { BsCurrencyDollar, BsPeople } from "react-icons/bs";
import { BsSignNoParking, BsWifi } from "react-icons/bs";
import { LuParkingCircle, LuWifiOff } from "react-icons/lu";
import { FaPaw } from "react-icons/fa";
import { TbCoffee, TbCoffeeOff } from "react-icons/tb";
import StarRating from "../../../../components/RatingStars";

function HomeCard({
  title,
  imageUrl,
  maxGuests,
  wifi,
  pets,
  parking,
  breakfast,
  city,
  country,
  continent,
  price,
  rating,
}) {
  const insertSpace = (text, interval) => {
    let result = "";
    for (let i = 0; i < text.length; i++) {
      result += text[i];
      if ((i + 1) % interval === 0) {
        result += " ";
      }
    }
    return result;
  };
  return (
    <div className="min-h-[400px] bg-white  dark:bg-black px-2 cursor-pointer shadow-2xl group mt-12">
      <div className=" overflow-hidden h-40 w-60">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full  group-hover:scale-110 transition-all duration-300 "
        />
      </div>
      <div className="bg-white dark:bg-darkPrimary shadow-lg max-w-[200px] mx-auto h-[60px] -translate-y-1/2 flex justify-center items-center uppercase  tracking-[1px] font-semibold text-base">
        <div className="flex justify-between w-[80%]">
          <div className="flex items-center">
            <div>
              <BsCurrencyDollar className="text-xs" />
            </div>
            <div className="flex gap-x-1 text-xs ">
              <span></span>
              <span>{price}</span>
            </div>
          </div>

          <div className="flex items-center">
            <div>
              <BsPeople className="text-xs" />
            </div>
            <div className="flex gap-x-1 text-xs ">
              <span>Guests</span>
              <span>{maxGuests}m2</span>
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-hidden">
        <h3 className="p-5 text  font-semibold ">
          {insertSpace(
            title
              .toLowerCase()
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" "),
            10,
          )}
        </h3>
        <p className=" font-semibold  pb-2 text">
          Location:
          <span className=" ml-2 font-normal">
            {continent}, {country}, {city}
          </span>
        </p>
        <p className="flex font-semibold items-center mr-1 pb-2">
          Rating: <StarRating rating={rating} />
          <span className="font-normal ml-1">({rating})</span>
        </p>
        <div className="flex items-center font-semibold pb-2">
          <span className="mr-1"> Included:</span>

          {wifi ? (
            <BsWifi className="text-primary  dark:text-primary-hover mr-3" />
          ) : (
            <LuWifiOff className="text-gray-400 mr-3 " />
          )}
          {parking ? (
            <LuParkingCircle className="text-primary  dark:text-primary-hover mr-3" />
          ) : (
            <BsSignNoParking className="text-gray-400 mr-3 " />
          )}
          {breakfast ? (
            <TbCoffee className="text-primary  dark:text-primary-hover mr-3" />
          ) : (
            <TbCoffeeOff className="text-gray-400 mr-3 " />
          )}
          {pets ? (
            <FaPaw className="text-primary dark:text-primary-hover mr-3" />
          ) : (
            <FaPaw className="text-gray-400 mr-3 " />
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeCard;

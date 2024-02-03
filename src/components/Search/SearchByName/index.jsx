import React, { useState, useRef, useEffect } from "react";
import {
  faBed,
  faCalendarDays,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import Input from "../../Ui/Input";
import Button from "../../Ui/Button";

const SearchByName = () => {
  const [destination, setDestination] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    guest: 1,
  });

  const navigate = useNavigate();
  const dateRangeRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dateRangeRef.current &&
        !dateRangeRef.current.contains(event.target)
      ) {
        setOpenDate(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOption = (operation) => {
    setOptions((prevOptions) => ({
      guest: operation === "i" ? prevOptions.guest + 1 : prevOptions.guest - 1,
    }));
  };

  const handleSearch = () => {
    navigate("/venues", { state: { destination, date, options } });
  };

  return (
    <div className="h-full bg-blue-800 text-white flex justify-center relative">
      <div className=" w-full max-w-4xl mx-auto ">
        <h1 className="text-2xl font-bold">
          A lifetime of discounts? It's Genius.
        </h1>
        <p className="text-gray-300">
          Get rewarded for your travels – unlock instant savings of 10% or more
          with a free Lamabooking account
        </p>

        <div className="mt-4 h-30  w-full max-w-4xl  marker: bg-gray-500 border-3 border-yellow-500 flex flex-col lg:flex-row  items-center justify-around p-4 rounded-5 absolute  bottom-(-25)">
          <div className="flex items-center gap-4">
            <FontAwesomeIcon icon={faBed} className="text-lightgray" />
            <Input
              type="text"
              placeholder="Where are you going?"
              className="border-none outline-none p-4"
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 relative" ref={dateRangeRef}>
            <FontAwesomeIcon
              icon={faCalendarDays}
              className="text-lightgray cursor-pointer"
            />
            <span
              onClick={() => setOpenDate(!openDate)}
              className="text-lightgray cursor-pointer"
            >{`${format(date[0].startDate, "MM/dd/yyyy")} to ${format(
              date[0].endDate,
              "MM/dd/yyyy",
            )}`}</span>
            {openDate && (
              <DateRange
                editableDateInputs={true}
                onChange={(item) => setDate([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={date}
                className="absolute top-full left-0 z-10"
                minDate={new Date()}
                onClickOutside={() => setOpenDate(false)}
              />
            )}
          </div>
          <div className="relative">
            <div className="flex items-center gap-4">
              <FontAwesomeIcon icon={faPerson} className="text-lightgray" />
              <span
                onClick={() => setOpenOptions(!openOptions)}
                className="text-lightgray cursor-pointer"
              >{`${options.guest} guest`}</span>
            </div>
            {openOptions && (
              <div className="absolute top-full left-0 p-4 bg-white text-gray-700 rounded shadow-md">
                <div className="flex items-center gap-2">
                  <span>guest</span>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={options.guest <= 1}
                      className="border border-blue-500 text-blue-500 px-2 py-1 cursor-pointer"
                      onClick={() => handleOption("d")}
                    >
                      -
                    </button>
                    <span>{options.guest}</span>
                    <button
                      className="border border-blue-500 text-blue-500 px-2 py-1 cursor-pointer"
                      onClick={() => handleOption("i")}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex">
            <Button
              className="bg-black text-white font-semibold px-10 py-2"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchByName;

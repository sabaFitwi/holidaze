// DateInput.js

import React, { useState } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";

const DateInput = ({ value, onChange, placeholder, existingBookings }) => {
  const [openDate, setOpenDate] = useState(false);

  const selectedRang = {
    startDate: value.startDate,
    endDate: value.endDate,
    key: "selection",
  };
  const formattedStartDate =
    value && value.startDate ? format(value.startDate, "dd/MM/yyyy") : "";
  const formattedEndDate =
    value && value.endDate ? format(value.endDate, "dd/MM/yyyy") : "";

  const disabledDates = existingBookings.reduce((acc, booking) => {
    const start = new Date(booking.dateFrom);
    const end = new Date(booking.dateTo);
    const currentDate = new Date(start);

    while (currentDate <= end) {
      acc.push(format(currentDate, "yyyy-MM-dd"));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return acc;
  }, []);

  return (
    <div className="relative">
      <span
        className="h-10 px-2 bg-white flex items-center cursor-pointer"
        onClick={() => setOpenDate(!openDate)}
      >
        {formattedStartDate && formattedEndDate
          ? `${formattedStartDate} to ${formattedEndDate}`
          : placeholder}
      </span>
      {openDate && (
        <DateRange
          onChange={(item) => onChange(item.selection)}
          minDate={new Date()}
          ranges={[selectedRang]}
          rangeColors={["#18766a"]}
          showDateDisplay={false}
          disabledDates={disabledDates.map((date) => new Date(date))}
        />
      )}
    </div>
  );
};

export default DateInput;
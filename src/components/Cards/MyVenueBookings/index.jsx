import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function MyVenueBooking() {
  const [venueData, setVenueData] = useState(null);
  const [activeBookings, setActiveBookings] = useState([]);
  const [expiredBookings, setExpiredBookings] = useState([]);
  const [showActiveBookings, setShowActiveBookings] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    fetch(
      `https://api.noroff.dev/api/v1/holidaze/venues/${id}?_bookings=true&_owner=true`,
    )
      .then((response) => response.json())
      .then((data) => {
        setVenueData(data);
        setActiveBookings(
          data.bookings.filter(
            (booking) => new Date(booking.dateTo) > new Date(),
          ),
        );
        setExpiredBookings(
          data.bookings.filter(
            (booking) => new Date(booking.dateTo) <= new Date(),
          ),
        );
      })
      .catch((error) => {
        console.error("Error fetching venue data:", error);
      });
  }, [id]);

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div className="container mx-auto mt-8 text">
      <h1 className=" h1 font-bold m-4">Your Venues Booking Information</h1>
      {venueData && (
        <div className="flex flex-col rounded-2xl w-full  cursor-pointer hover:opacity-80 hover:shadow-lg transition duration-200 ease-out">
          <div className="relative w-full h-60 ">
            <img
              src={venueData.media[0]}
              alt={venueData.name}
              className="w-full h-full object-cover py-2"
            />
          </div>

          <div className="w-full  flex flex-col  p-2 px-4">
            <p className="font-semibold pb-2 text">
              Number of Venues Booking:
              <span className="ml-1 font-normal">
                ({venueData.bookings.length})
              </span>
            </p>
            <p className="font-semibold mb-2 text">
              Title: <span className="ml-1 font-normal">{venueData.name}</span>
            </p>

            <p className="font-semibold pb-2  text">
              Price:
              <span className="ml-1 font-normal">
                {venueData.price} kr/night
              </span>
            </p>
          </div>
        </div>
      )}
      {venueData ? (
        <div>
          <div className="flex justify-between m-4">
            <button
              onClick={() => setShowActiveBookings(true)}
              className={`px-4 py-2 ${
                showActiveBookings
                  ? "bg-primary text-white"
                  : "bg-gray-300 text"
              }`}
            >
              upcoming Bookings
            </button>
            <button
              onClick={() => setShowActiveBookings(false)}
              className={`px-4 py-2 ${
                !showActiveBookings
                  ? "bg-primary text-white"
                  : "bg-gray-300 text"
              }`}
            >
              Expired Bookings
            </button>
          </div>
          {showActiveBookings ? (
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 whitespace-nowrap text">From</th>
                  <th className="px-4 py-2 whitespace-nowrap text">To</th>
                  <th className="px-4 py-2 whitespace-nowrap text">Guests</th>
                </tr>
              </thead>
              <tbody>
                {activeBookings.map((booking) => (
                  <tr key={booking.id} className="booking-details">
                    <td className="border px-4 py-2  ">
                      {formatDate(booking.dateFrom)}
                    </td>
                    <td className="border px-4 py-2  ">
                      {formatDate(booking.dateTo)}
                    </td>
                    <td className="border px-4 py-2  ">{booking.guests}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Date From</th>
                  <th className="px-4 py-2">Date To</th>
                  <th className="px-4 py-2">Guests</th>
                </tr>
              </thead>
              <tbody>
                {expiredBookings.map((booking) => (
                  <tr key={booking.id} className="booking-details">
                    <td className="border px-4 py-2">
                      {formatDate(booking.dateFrom)}
                    </td>
                    <td className="border px-4 py-2">
                      {formatDate(booking.dateTo)}
                    </td>
                    <td className="border px-4 py-2">{booking.guests}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <p>Loading venue data...</p>
      )}
    </div>
  );
}

export default MyVenueBooking;

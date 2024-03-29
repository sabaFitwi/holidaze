import React, { useState, useEffect } from "react";

import Input from "../../../components/Ui/Input";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/Ui/Button";
import { createVenueUrl } from "../../../api";
import useApi from "../../../hooks/useApi";
import usePut from "../../../hooks/usePut";
import { FaArrowLeft } from "react-icons/fa";
import SEO from "../../../components/SEO";
import Loader from "../../../components/Loading";
import ErrorMessage from "../../../components/ErrorMessage";
import ScrollToTopButton from "../../../components/ScrollToTopButton";

const UpdateVenue = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    media: [""],
    price: 0,
    maxGuests: 0,
    rating: 0,
    meta: {
      wifi: true,
      parking: true,
      breakfast: true,
      pets: true,
    },
    location: {
      address: "Unknown",
      city: "Unknown",
      zip: "Unknown",
      country: "Unknown",
      continent: "Unknown",
      lat: 0,
      lng: 0,
    },
  });
  const continentOptions = [
    "Asia",
    "Africa",
    "North America",
    "South America",
    "Antarctica",
    "Europe",
    "Australia",
  ];
  const {
    data: venueData,
    isLoading,
    isError,
  } = useApi(`${createVenueUrl}/${id}`);
  const { updateItem } = usePut();
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && venueData) {
      const updatedMeta = {
        wifi: venueData.meta?.wifi || false,
        parking: venueData.meta?.parking || false,
        breakfast: venueData.meta?.breakfast || false,
        pets: venueData.meta?.pets || false,
      };

      setFormData((prevData) => ({
        ...prevData,
        ...venueData,
        meta: updatedMeta,
      }));
    }
  }, [venueData, isLoading, isError]);

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <ErrorMessage />
      </div>
    );
  }

  const handleImageChange = (index, value) => {
    const newImages = [...formData.media];
    newImages[index] = value;
    setFormData((prevData) => ({
      ...prevData,
      media: newImages,
    }));
  };

  const handleDeleteImage = (index) => {
    const newImages = [...formData.media];
    newImages.splice(index, 1);
    setFormData((prevData) => ({
      ...prevData,
      media: newImages,
    }));
  };

  const handleAddImage = () => {
    setFormData((prevData) => ({
      ...prevData,
      media: [...prevData.media, ""],
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "maxGuests" && type === "number") {
      const newValue = Math.max(1, parseInt(value));
      setFormData((prevData) => ({
        ...prevData,
        [name]: newValue,
      }));
    } else if (type === "checkbox" && name.startsWith("meta.")) {
      const metaField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        meta: {
          ...prevData.meta,
          [metaField]: checked,
        },
      }));
    } else if (name === "media") {
      setFormData((prevData) => ({
        ...prevData,
        media: value.split(",").map((item) => item.trim()),
      }));
    } else if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        location: {
          ...prevData.location,
          [locationField]:
            type === "number"
              ? value !== ""
                ? parseFloat(value)
                : null
              : value,
        },
      }));
    } else {
      if (name === "rating") {
        const ratingValue = parseFloat(value);
        if (ratingValue > 5) {
          setError("Rating cannot exceed 5");

          return;
        } else {
          setError("");
        }
      }

      setFormData((prevData) => ({
        ...prevData,
        [name]:
          type === "checkbox"
            ? checked
            : type === "number"
              ? parseFloat(value)
              : value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await updateItem(
        `${createVenueUrl}/${id}`,

        formData,
      );

      if (!response) {
        throw new Error("Empty response received");
      }
      if (response) {
        setSuccessMessage(true);
        setError("");

        setTimeout(() => {
          navigate("/profile");
          setSuccessMessage(false);
        }, 2500);
      } else {
        setError("Error updating venue. Please try again.");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error updating venue. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div>
      <SEO
        title="Update Venue| Holidaze"
        description="update your Holidaze venue."
      />
      <main className="max-w-2xl mx-auto  dark:bg-darkSecondary dark:text-white shadow p-4 my-10">
        <div className="flex items-center mb-6">
          <Link
            to="/profile"
            className="text-primary  dark:text-primary-hover  flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Back to profile
          </Link>
        </div>
        <h1 className="h1 font-bold uppercase text-center mb-4">
          Update Venue
        </h1>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600  dark:text-white">
              Title:
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 p-2 w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700  dark:text-white">
              Description:
            </label>
            <Input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>

          <div>
            {formData.media.map((imageUrl, index) => (
              <div key={index} className="mb-4">
                <label className="block text-sm font-medium text-gray-700  dark:text-white">
                  Image {index + 1}
                </label>

                <div className="flex flex-col items-center space-x-2 w-full">
                  <div className="flex justify-between w-full">
                    <Input
                      id="media"
                      name="media"
                      type="text"
                      value={imageUrl}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                      placeholder="Image URL"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(index)}
                        className="border p-2 text-red-500 hover:text-red-700 focus:outline-none"
                      >
                        X
                      </button>
                    )}
                  </div>
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={`Preview ${index + 1}`}
                      className="mt-4 w-100 h-60 object-cover rounded"
                    />
                  )}
                </div>
              </div>
            ))}
            <div className="mb-4">
              <div className="flex flex-col items-center space-x-2">
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="text-blue-500 hover:text-blue-700 focus:outline-none"
                >
                  + Add Image
                </button>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-600  dark:text-white"
            >
              Price:
            </label>
            <Input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="maxGuests"
              className="block text-sm font-medium text-gray-600  dark:text-white"
            >
              Max Guests:
            </label>
            <Input
              type="number"
              id="maxGuests"
              name="maxGuests"
              value={formData.maxGuests}
              onChange={handleChange}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="rating" className="block text-sm font-medium">
              Rating:
            </label>
            <div>
              <Input
                data-cy="rating"
                type="number"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="mt-1 p-2 border rounded w-full "
                step="0.1"
              />
            </div>
            {error && <span className="text-red-600 text-sm ">{error}</span>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600  dark:text-white">
              Amenities:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="wifi"
                  name="meta.wifi"
                  checked={formData.meta.wifi}
                  onChange={handleChange}
                  className="switch-checkbox"
                />
                <label
                  htmlFor="wifi"
                  className={`switch-label ${
                    formData.meta.wifi ? "bgOn" : "bgOff "
                  }`}
                >
                  <span
                    className={`switch-slider ${
                      formData.meta.wifi ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></span>
                </label>
                <div className="ml-2 text-gray-700  dark:text-white">WiFi</div>
              </div>
              <div className="flex items-center">
                <Input
                  type="checkbox"
                  id="parking"
                  name="meta.parking"
                  checked={formData.meta.parking}
                  onChange={handleChange}
                  className="switch-checkbox"
                />
                <label
                  htmlFor="parking"
                  className={`switch-label ${
                    formData.meta.parking ? "bgOn" : "bgOff"
                  }`}
                >
                  <span
                    className={`switch-slider ${
                      formData.meta.parking ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></span>
                </label>
                <div className="ml-2 text-gray-700  dark:text-white">
                  Parking
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="breakfast"
                  name="meta.breakfast"
                  checked={formData.meta.breakfast}
                  onChange={handleChange}
                  className="switch-checkbox"
                />
                <label
                  htmlFor="breakfast"
                  className={`switch-label ${
                    formData.meta.breakfast ? "bgOn" : "bgOff"
                  }`}
                >
                  <span
                    className={`switch-slider ${
                      formData.meta.breakfast
                        ? "translate-x-5"
                        : "translate-x-0"
                    }`}
                  ></span>
                </label>
                <div className="ml-2 text-gray-700  dark:text-white">
                  Breakfast
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pets"
                  name="meta.pets"
                  checked={formData.meta.pets}
                  onChange={handleChange}
                  className="switch-checkbox"
                />
                <label
                  htmlFor="pets"
                  className={`switch-label ${
                    formData.meta.pets ? "bgOn" : "bgOff"
                  }`}
                >
                  <span
                    className={`switch-slider ${
                      formData.meta.pets ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></span>
                </label>
                <div className="ml-2 text-gray-700  dark:text-white">Pets</div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600  dark:text-white">
              Address:
            </label>
            <Input
              type="text"
              id="address"
              name="location.address"
              value={formData.location.address}
              onChange={handleChange}
              className="mt-1 p-2 border rounded w-full"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-600  dark:text-white"
            >
              City:
            </label>
            <Input
              type="text"
              id="city"
              name="location.city"
              value={formData.location.city}
              onChange={handleChange}
              className="mt-1 p-2 border rounded w-full"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="zip"
              className="block text-sm font-medium text-gray-600  dark:text-white"
            >
              ZIP:
            </label>
            <Input
              type="text"
              id="zip"
              name="location.zip"
              value={formData.location.zip}
              onChange={handleChange}
              className="mt-1 p-2 border rounded w-full"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-600  dark:text-white"
            >
              Country:
            </label>
            <Input
              type="text"
              id="country"
              name="location.country"
              value={formData.location.country}
              onChange={handleChange}
              className="mt-1 p-2 border rounded w-full"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="continent"
              className="block text-sm font-medium text-gray-600  dark:text-white"
            >
              Continent:
            </label>
            <select
              id="continent"
              name="location.continent"
              value={formData.location.continent}
              onChange={handleChange}
              className="mt-1 p-2 border rounded w-full"
            >
              {continentOptions.map((continent) => (
                <option key={continent} value={continent}>
                  {continent}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="lat"
              className="block text-sm font-medium text-gray-600  dark:text-white"
            >
              Latitude:
            </label>
            <Input
              type="number"
              id="lat"
              name="location.lat"
              value={formData.location.lat}
              onChange={handleChange}
              className="mt-1 p-2 border rounded w-full"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="lng"
              className="block text-sm font-medium text-gray-600  dark:text-white"
            >
              Longitude:
            </label>
            <Input
              type="number"
              id="lng"
              name="location.lng"
              value={formData.location.lng}
              onChange={handleChange}
              className="mt-1 p-2 border rounded w-full"
            />
          </div>

          {error && <div className="text-red-600 p-4">{error}</div>}

          <Button className="button" type="button" onClick={handleSubmit}>
            Update
          </Button>
        </form>
      </main>

      {successMessage && (
        <div className="fixed w-full mx-auto inset-0 flex items-center justify-center">
          <div className="bg-black opacity-80  dark:opacity-100 p-6 rounded-md max-w-md w-full shadow-md">
            <p className="p text-green-400 text-center  mb-4">
              Venue updated successfully! You can see the updated venue in your
              profile.
            </p>
          </div>
        </div>
      )}
      <ScrollToTopButton />
    </div>
  );
};

export default UpdateVenue;

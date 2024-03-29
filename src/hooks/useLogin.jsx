import { useState, useEffect } from "react";

import { getProfile } from "./useProfile";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../api";
import Headers from "./useHeader";

/**
 * Custom React hook for managing user login functionality.
 * @returns {{
 *   loginStatus: boolean|string,
 *   loginData: { email: string, password: string },
 *   errors: Object,
 *   handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
 *   handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>,
 *   touchedFields: Object
 * }} An object containing login status, login data, error messages, input change handler,
 * form submission handler, and touched fields state.
 */

const useLogin = () => {
  const Url = baseUrl;
  const endPoint = `/auth/login`;
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginStatus, setLoginStatus] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    setTouchedFields({ ...touchedFields, [name]: true });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  useEffect(() => {
    const newErrors = {};
    if (Object.keys(errors).length > 0) {
      if (
        touchedFields.email &&
        (!loginData.email ||
          (!loginData.email.endsWith("stud.noroff.no") &&
            !loginData.email.endsWith("noroff.no")))
      ) {
        newErrors.email =
          "Email must be a valid stud.noroff.no or noroff.no address";
      }

      if (
        touchedFields.password &&
        (!loginData.password || loginData.password.length < 8)
      ) {
        newErrors.password = "Password must be at least 8 characters long";
      }

      setErrors(newErrors);
    }
  }, [loginData, errors, touchedFields]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const resp = await fetch(Url + endPoint, {
      method: "POST",
      headers: Headers("application/json"),
      body: JSON.stringify({
        email: loginData.email,
        password: loginData.password,
      }),
    }).then((data) => data.json());

    console.log(resp);

    if ("accessToken" in resp) {
      localStorage.setItem("Token", resp["accessToken"]);
      localStorage.setItem("UserData", JSON.stringify(resp));
      localStorage.setItem("isLoggedIn", true);

      const profileCall = await getProfile();
      localStorage.setItem("isVenueManager", profileCall.venueManager);
      localStorage.setItem("UserData", JSON.stringify(profileCall));

      navigate("/");
      window.location.reload();
    } else {
      setLoginStatus("failure");
    }
  };

  return {
    loginStatus,
    loginData,
    errors,
    handleInputChange,
    handleSubmit,
    touchedFields,
  };
};

export default useLogin;

import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const signup1 = () => {
  const navigate = useNavigate();
  const initialValues = {
    email: "",
    studentId: "",
    password: "",
  };
  const [formValues, setformValues] = useState(initialValues);
  const [formErrors, setformErrors] = useState({});
  const [isSubmit, setisSubmit] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformValues({ ...formValues, [name]: value });
    console.log(e.formValues);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setformErrors(validate(formValues));
    try {
      // Send a POST request to the server with user data
      const response = await axios.post(
        "https://digi-bus-pass-backend.onrender.com/api/v1/auth/signup",
        formValues
      );
      console.log(response);
      alert("Student Registered Successfully");
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // HTTP status 409 indicates a conflict (email already exists)
        alert("Student Already Exists. Please login to continue.");
        navigate("/login");
        toast.error("Email already exists. Please use a different email.");
      } else {
        console.error(
          "Error while signing up:",
          error.response ? error.response.data : error.message
        );
      }
    } finally {
      setLoading(false); // Whether the request succeeded or not, set loading to false
    }
    setisSubmit(true);
  };

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formValues);
    }
  }, [formErrors]);

  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.studentId) {
      errors.studentId = "PRN number required";
    } else if (values.studentId.length < 8) {
      errors.studentId = "Enter vallid PRN";
    }
    if (!values.email) {
      errors.email = "Email required";
    } else if (!regex.test(values.email)) {
      errors.email = "This is not a valid email format!";
    }
    if (!values.password) {
      errors.password = "Passsword required";
    } else if (values.password.length < 4) {
      errors.password = "Password must be of 6 characters";
    } else if (values.password.length > 6) {
      errors.password = "Password cannot exceed more than 6 characters";
    }
    return errors;
  };

  return (
    <>
      <ToastContainer />

      <section className="flex bg-white container-fluid justify-center content-center">
        <div className="flex justify-center content-center m-8">
          <div className="mt-8 items-center justify-center px-8 sm:px-12 lg:col-span-7 lg:px-16 xl:col-span-6">
            <div className="max-w-xl lg:max-w-3xl">
              <h1 className="mt-0 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                Welcome to Digital BusPass
              </h1>
              <p className="mt-4 leading-relaxed text-gray-500">
                Create an account to get started.
              </p>
              <form
                onSubmit={handleSubmit}
                className="mt-8 grid grid-cols-6 gap-6"
              >
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="PrnNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    PRN Number
                  </label>

                  <input
                    type="text"
                    id="PrnNumber"
                    name="studentId"
                    onChange={handleChange}
                    value={formValues.studentId}
                    className="w-full rounded-lg p-3 pe-8 text-sm shadow-sm border-solid border-2 border-yellow-500"
                  />
                  <p className="text-red-600">{formErrors.studentId}</p>
                </div>

                <div className="col-span-6">
                  <label
                    htmlFor="Email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {" "}
                    Email{" "}
                  </label>

                  <input
                    type="email"
                    id="Email"
                    name="email"
                    onChange={handleChange}
                    value={formValues.email}
                    className="w-full rounded-lg p-3 pe-8 text-sm shadow-sm border-solid border-2 border-yellow-500"
                  />
                  <p className="text-red-600">{formErrors.email}</p>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="Password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {" "}
                    Password{" "}
                  </label>

                  <input
                    type="password"
                    id="Password"
                    name="password"
                    value={formValues.password}
                    onChange={handleChange}
                    className="w-full rounded-lg p-3 pe-8 text-sm shadow-sm border-solid border-2 border-yellow-500"
                  />
                  <p className="text-red-600">{formErrors.password}</p>
                </div>

                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                  <button
                    type="submit"
                    className="inline-block shrink-0 rounded-md border border-yellow-600 bg-yellow-500 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-yellow-600 focus:outline-none focus:ring active:text-yellow-500"
                    disabled={loading} // Disable the button when loading is true
                  >
                    {loading ? "Creating Account..." : "Create an account"}
                  </button>

                  <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                    Already have an account?
                    <Link to="/login" className="text-gray-700 underline">
                      {" "}
                      Login{" "}
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default signup1;

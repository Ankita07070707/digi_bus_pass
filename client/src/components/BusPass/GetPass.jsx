import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import busRoute from "./BusRoute.json";
import moment from "moment";

function GetPass() {
  const formArray = [1, 2, 3, 4];
  const [formNo, setFormNo] = useState(formArray[0]);

  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    year: "",
    branch: "",
    phno: "",
    address: "",
    busFrom: "DKTE Rajwada",
    busDestination: "",
    validDate: "",

    studentId: "",
  });

  const {
    firstName,
    lastName,
    year,
    branch,
    image,
    phno,
    address,
    busFrom,
    busDestination,
    validDate,
    studentId,
  } = user;

  const parsedValidDate = moment().add(6, "months").format("DD/MM/YYYY");

  const onInputChange = (e) => {
    // const regex = /^[A-Za-z]+$/;
    // if (e.target.name === "firstName" || e.target.name === "lastName") {
    //   if (!regex.test(e.target.value)) {
    //     // If input contains non-letter characters, do not update the state
    //     return;
    //   }
    // }
    // setUser({
    //   ...user,
    //   [e.target.name]: e.target.value,
    // });
    const { name, value } = e.target;

    // Validation for allowing only letters in firstName and lastName
    if (name === "firstName" || name === "lastName") {
      if (/^[a-zA-Z]+$/.test(value) || value === "") {
        setUser({
          ...user,
          [name]: value,
        });
      }
    }
    // Validation for allowing only 10 numbers in phno
    else if (name === "phno") {
      const phoneNumber = value.replace(/\D/g, ""); // Remove non-digit characters
      if (phoneNumber.length <= 10 || value === "") {
        setUser({
          ...user,
          [name]: phoneNumber,
        });
      }
    }
    // For other fields without specific validation
    else {
      setUser({
        ...user,
        [name]: value,
      });
    }
  };

  const next = () => {
    if (
      formNo === 1 &&
      user.firstName &&
      user.lastName &&
      user.phno &&
      // user.image &&
      user.year &&
      user.branch
    ) {
      setFormNo(formNo + 1);
    } else if (formNo === 2 && stopName) {
      setFormNo(formNo + 1);
    } else if (formNo === 3) {
      setFormNo(formNo + 1);
    } else {
      toast.error("Please fillup all input field");
    }
  };

  const pre = () => {
    setFormNo(formNo - 1);
  };

  //destination selection
  const [cityid, setCityid] = useState("");
  const [stop, setStop] = useState([]);
  const [stopid, setStopid] = useState("");
  const [stopAmount, setStopAmount] = useState(0);
  const [cityName, setCityName] = useState("");
  const [stopName, setStopName] = useState("");
  const [passDuration, setPassDuration] = useState("");
  const [passAmount, setPassAmount] = useState(0);
  const [passValidDate, setPassValidDate] = useState("");

  const handlecity = (e) => {
    const getCityid = e.target.value;
    const selectedCity = busRoute.find((city) => city.city_id === getCityid);
    setStop(selectedCity.stop);
    setCityid(getCityid);
    setCityName(selectedCity.city_name); // Set the city name
  };

  const handlestop = (e) => {
    const getstopid = e.target.value;
    const selectedStop = stop.find((stop) => stop.stop_amount === getstopid);
    setStopid(getstopid);
    setStopAmount(selectedStop.stop_amount); // Set the stop amount
    setStopName(selectedStop.stop_name);
    setUser({
      ...user,
      busDestination: selectedStop.stop_name, // Set busDestination to selected stop name
    }); // Set the stop name
  };

  const handlePassDurationChange = (e) => {
    const selectedDuration = e.target.value;
    setPassDuration(selectedDuration);

    //Calculate Pass Duration
    if (selectedDuration === "1") {
      setPassAmount(stopAmount * 1);
    } else if (selectedDuration === "3") {
      setPassAmount(stopAmount * 3);
    } else if (selectedDuration === "6") {
      setPassAmount(stopAmount * 6);
    }

    //Calculate the valid date
    const currentDate = new Date();
    const validDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + parseInt(selectedDuration),
      currentDate.getDate()
    );
    setPassValidDate(validDate);
  };
  const key_id = "rzp_test_gm6wW5pGrWRFjz";

  const handleDonate = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when starting the request
    try {
      console.log(token);
      const response = await axios.post(
        "https://digi-bus-pass-backend.onrender.com/api/v1/payment/checkout",
        { amount: passAmount },
        {
          headers: {
            authorization: `${token}`,
          },
        }
      );

      const order = response.data.order;
      console.log(order);

      const options = {
        key: key_id, // Enter the Key ID generated from the Dashboard
        amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Non-profit foundation",
        description: "Donation",
        image: "https://example.com/your_logo",
        order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step
        // callback_url: "http://localhost:8000/api/v1/payment/paymentverification",
        // prefill: {
        //   name: "Rushikesh Tonape",
        //   email: "rushikeshtonape143@gmail.com",
        //   contact: "9970703921",
        // },
        // notes: {
        //   address: "Razorpay Corporate Office",
        // },
        handler: async (response) => {
          try {
            const verifyUrl =
              "https://digi-bus-pass-backend.onrender.com/api/v1/payment/paymentverification";
            const { data } = await axios.post(verifyUrl, response, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
              },
            });
            console.log(data);

            if (data.redirectUrl) {
              window.location.href = data.redirectUrl;

              e.preventDefault();
              setLoading(true); // Set loading to true when starting the request
              try {
                const response = await axios.post(
                  "https://digi-bus-pass-backend.onrender.com/api/v1/buspass/applyForBusPass",
                  user,
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `${token}`,
                    },
                  }
                );
                console.log(response.data);
                alert("Student Details Updated Successfully");
              } catch (error) {
                console.log(error);
              } finally {
                setLoading(false);
              }
            } else {
              // If no specific redirect URL is provided, you can handle the redirect here
              // or leave it blank depending on your application's logic.
              alert("Payment successful");
            }
          } catch (error) {
            console.log(error);
          }
        },
        theme: {
          color: "#2b0318",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.success", (response) => {
        // Payment successful logic
        console.log("Payment successful:", response);

        alert("Payment successful");
      });

      razorpay.on("payment.error", (error) => {
        // Payment failed or canceled
        console.error("Payment failed or canceled:", error);
        alert("Payment failed or canceled");
      });

      console.log("Before razorpay.open()");
      razorpay.open();
      console.log("After razorpay.open()");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Whether the request succeeded or not, set loading to false
    }
  };

  const finalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when starting the request
    try {
      const response = await axios.post(
        "https://digi-bus-pass-backend.onrender.com/api/v1/buspass/applyForBusPass",
        user,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      console.log(response.data);
      alert("Student Details Updated Successfully");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-slate-100 flex justify-center items-center">
      <ToastContainer />
      <div className="card w-[670px] rounded-md shadow-md bg-white p-5">
        <div className="flex justify-center items-center">
          {formArray.map((v, i) => (
            <>
              <div
                className={`w-[35px] my-3 text-white rounded-full ${
                  formNo - 1 === i ||
                  formNo - 1 === i + 1 ||
                  formNo === formArray.length
                    ? "bg-yellow-400"
                    : "bg-slate-400"
                } h-[35px] flex justify-center items-center`}
              >
                {v}
              </div>
              {i !== formArray.length - 1 && (
                <div
                  className={`w-[85px] h-[2px] ${
                    formNo === i + 2 || formNo === formArray.length
                      ? "bg-yellow-400"
                      : "bg-slate-400"
                  }`}
                ></div>
              )}
            </>
          ))}
        </div>
        {formNo === 1 && (
          <div>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <h1 className="text-lg font-semibold leading-7 text-gray-900 text-center">
                  Fill Your Personal Information
                </h1>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      First Name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => onInputChange(e)}
                        autoComplete="given-name"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Last Name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => onInputChange(e)}
                        autoComplete="family-name"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  {/* <div className="sm:col-span-3">
                    <label
                      htmlFor="image"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Upload Profile Photo
                    </label>
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="image/png, image/jpeg"
                        name="image"
                        value={image}
                        onChange={(e) => onInputChange(e)}
                        id="image"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div> */}
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="phno"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Phone Number
                    </label>
                    <div className="mt-2">
                      <input
                        type="number"
                        name="phno"
                        value={phno}
                        onChange={(e) => onInputChange(e)}
                        id="phno"
                        autoComplete="family-name"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="year"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Year
                    </label>
                    <div className="mt-2">
                      <select
                        id="year"
                        name="year"
                        value={year}
                        onChange={onInputChange}
                        autoComplete="year-name"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option>--Select Year--</option>
                        <option>First Year</option>
                        <option>Second Year</option>
                        <option>Third Year</option>
                        <option>Final Year</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="branch"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Branch
                    </label>
                    <div className="mt-2">
                      <select
                        id="branch"
                        name="branch"
                        value={branch}
                        onChange={onInputChange}
                        autoComplete="branch-name"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option>--Select Branch--</option>
                        <option>Computer Sc. & Engineering</option>
                        <option>Civil Engineering</option>
                        <option>Computer Sc. & Engineering AI and ML</option>
                        <option>
                          Computer Sc. & Engineering AI and Data Science
                        </option>
                        <option>Electrical Engineering</option>
                        <option>
                          Electronics & Telecommunication Engineering
                        </option>
                        <option>Textile Technology</option>
                        <option>Manmade Textile Technology</option>
                        <option>Textile Plant Engineering</option>
                        <option>Textile Chemistry</option>
                        <option>Fashion Technology</option>
                        <option>Mechanical Engineering</option>
                        <option>Master of Business Administration</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Street address
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="address"
                        value={address}
                        onChange={(e) => onInputChange(e)}
                        id="address"
                        autoComplete="address"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                onClick={next}
                className="rounded-md bg-yellow-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {formNo === 2 && (
          <div>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <h1 className="text-lg font-semibold leading-7 text-gray-900 text-center">
                  Select Your Destination
                </h1>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="busDestination"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Pickup Point
                    </label>
                    <div className="mt-2">
                      <label>City</label>
                      <select
                        name="city"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        onChange={(e) => handlecity(e)}
                      >
                        <option value="">--Select City--</option>
                        {busRoute.map((getcity, index) => (
                          <option value={getcity.city_id} key={index}>
                            {getcity.city_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label"> Stop</label>
                      <div className="text-dark">
                        <select
                          name="stop"
                          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          onChange={(e) => handlestop(e)}
                        >
                          <option value="">--Select Stop--</option>
                          {stop.map((getstop, index) => (
                            <option value={getstop.stop_amount} key={index}>
                              {getstop.stop_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="busFrom"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Droping Point
                    </label>
                    <div className="mt-2">
                      <label>City</label>
                      <select
                        id="busFrom"
                        name="busFrom"
                        value={busFrom}
                        onChange={onInputChange}
                        autoComplete="busFrom-name"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option>Ichalkaranji</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-indigo-600"
                    name="passDuration"
                    value="1"
                    onChange={handlePassDurationChange}
                  />
                  <span className="ml-2">1 Month Pass</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-indigo-600"
                    name="passDuration"
                    value="3"
                    onChange={handlePassDurationChange}
                  />
                  <span className="ml-2">3 Month Pass</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-indigo-600"
                    name="passDuration"
                    value="6"
                    onChange={handlePassDurationChange}
                  />
                  <span className="ml-2">6 Month Pass</span>
                </label>
              </div>
              <div className="mt-4 text-center">
                {passAmount > 0 && (
                  <p className="text-xl font-semibold text-gray-900">
                    Pass Amount: {passAmount}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                onClick={pre}
                className="rounded-md bg-yellow-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Previous
              </button>
              <button
                onClick={next}
                className="rounded-md bg-yellow-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {formNo === 3 && (
          <div>
            <div className="space-y-12">
              <div className="px-4 sm:px-0">
                <h1 className="text-lg font-semibold leading-7 text-gray-900 text-center">
                  Validate Your Bus Pass
                </h1>
              </div>
              <div className="mt-6 border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Full name
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {firstName} {lastName}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Year & Branch
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {year}, {branch}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Bus Route
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {busFrom} to {stopName},{cityName}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Valid Date:
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {passValidDate && (
                        <p>{moment(passValidDate).format("DD/MM/YYYY")}</p>
                      )}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Total Amount
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      ₹ {passAmount}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                onClick={pre}
                className="rounded-md bg-yellow-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Previous
              </button>
              <button
                onClick={next}
                className="rounded-md bg-yellow-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {formNo === 4 && (
          <div>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <h1 className="text-lg font-semibold leading-7 text-gray-900 text-center">
                  Payment Details
                </h1>
                <div className="text-xl text-center font-mono justify-center align-text-bottom">
                  You have to pay ₹{passAmount}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                onClick={pre}
                className="rounded-md bg-yellow-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Previous
              </button>
              <button
                onClick={handleDonate}
                className="rounded-md bg-yellow-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Pay
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GetPass;

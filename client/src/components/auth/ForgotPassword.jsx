import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState();
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  const handleSubmit = (e) => {
    const apiUrl =
      "https://digi-bus-pass-backend.onrender.com/api/v1/auth/forgot-password";

    e.preventDefault();
    axios.post(
      apiUrl,
      {
        email,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        withCredentials: true,
        body: JSON.stringify({
          email,
        }),
      }
    );
    alert("Ckeck Email to Reset Your Password")
      .then((res) => {
        if (res.data.Status === "Success") {
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <section className="flex bg-white container-fluid justify-center content-center">
      <div className="flex justify-center content-center m-8">
        <div className="mt-8 items-center justify-center px-8 sm:px-12 lg:col-span-7 lg:px-16 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <h2 className="mt-10 text-2xl font-bold text-gray-900 sm:text-3xl ">
              Reset Your Password
            </h2>
            <h4 className="mt-4 leading-relaxed text-gray-500"></h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label
                  htmlFor="email"
                  className=" block text-sm font-medium leading-6 text-gray-900"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  autoComplete="on"
                  name="email"
                  className="w-full rounded-lg p-3 pe-8 text-sm shadow-sm border-solid border-2 border-yellow-500"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
              >
                Send
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-500">
              Go back to Login?
              <Link to="/login" className="text-gray-700 underline">
                {" "}
                Login{" "}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>

    // <section className="flex bg-white container-fluid justify-center content-center">
    //   <div className="flex justify-center content-center m-8">
    //     <div className="mt-8 items-center justify-center px-8 sm:px-12 lg:col-span-7 lg:px-16 xl:col-span-6">
    //       <div className="max-w-xl lg:max-w-3xl">
    //         <p className="mt-4 leading-relaxed text-gray-500">
    //           Forgot Password
    //         </p>
    //         <form onSubmit={handleSubmit}>
    //           <div className="mb-3">
    //             <label htmlFor="email">
    //               <strong>Email</strong>
    //             </label>
    //             <input
    //               type="email"
    //               placeholder="Enter Email"
    //               autoComplete="on"
    //               name="email"
    //               className="form-control rounded-0"
    //               onChange={(e) => setEmail(e.target.value)}
    //             />
    //           </div>
    //           <button type="submit" className="btn btn-success w-100 rounded-0">
    //             Send
    //           </button>
    //         </form>
    //       </div>
    //     </div>
    //   </div>
    // </section>
  );
};
export default ForgotPassword;

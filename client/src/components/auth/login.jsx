import React from 'react'
import { useState } from 'react'
import axios from "axios";
import { Link} from "react-router-dom";

const login = () => {

    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const { email, password } = user;

    const [loading, setLoading] = useState(false);

    const onChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
      };

     const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when starting the request
        try {
        // Send a POST request to the server with user data
        const response = await axios.post(
            "http://localhost:8000/api/v1/auth/login",
            user
        );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      console.log("Token in local storage:", localStorage.getItem("token"));
      // console.log("Data",response.data.user);
      // console.log("Token",response.data.token);

      // Assuming your server returns a success message or user object
      console.log(response.data);
      // custom login alert
      alert("Login Successful");
      // Navigate to dashboard
      window.location.href = "/dashboard";
    } catch (error) {
        //(email not found, or password incorrect)
        if (error.response && error.response.status === 400) {
            console.log("Invalid credentials",error.response.data);
        } else {
            console.error(
            "Error while signing up:",
            error.response ? error.response.data : error.message
        );
      }
    } finally {
      setLoading(false); // Whether the request succeeded or not, set loading to false
    }
};



  return (
    <>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" 
            onSubmit={onSubmit}
           method="POST">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={onChange}
                  required
                  className="w-full rounded-lg p-3 pe-8 text-sm shadow-sm border-solid border-2 border-sky-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                {/* <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div> */}
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={onChange}
                  required
                  className="w-full rounded-lg p-3 pe-8 text-sm shadow-sm border-solid border-2 border-sky-500"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={loading}
              >
                {loading ? "Loading..." : "Sign in"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default login
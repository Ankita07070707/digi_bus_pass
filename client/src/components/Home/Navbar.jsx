// import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isUserAuthenticated = () => {
    return localStorage.getItem("token") !== null;
  };

  // logout function

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="border-gray-200 bg-[#2b0318]">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            to="/"
            className="flex items-center font-medium text-gray-900 lg:w-auto lg:items-center lg:justify-center md:mx-6 lg:mx-0"
          >
            <span className="sr-only">Workflow</span>
            <img
              className="h-8 w-auto sm:h-10"
              src="https://www.dkte.ac.in/images/dkte-logo.png"
              alt="DKTE Logo"
            />
          </Link>
          <button
            onClick={toggleMenu}
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div
            className={`${
              isMenuOpen ? "hidden" : "block"
            } w-full md:flex md:w-auto md:block`}
            id="navbar-default"
          >
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 dark:border-gray-700">
              <li>
                <Link
                  to="/"
                  className="text-yellow-400 hover:text-white dark:text-gray-100 dark:hover:text-gray-300"
                >
                  Home
                </Link>
              </li>

              {isUserAuthenticated() ? (
                <>
                  <li>
                    <Link
                      to="/dashboard"
                      className="text-yellow-400 hover:text-white dark:text-gray-100 dark:hover:text-gray-300"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/buspass/getpass"
                      className="text-yellow-400 hover:text-white dark:text-gray-100 dark:hover:text-gray-300"
                    >
                      Buss Pass
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/logout"
                      className="text-yellow-400 hover:text-white dark:text-gray-100 dark:hover:text-gray-300"
                    >
                      Logout
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/signup"
                      className="text-yellow-400 hover:text-white dark:text-gray-100 dark:hover:text-gray-300"
                    >
                      Signup
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/login"
                      className="text-yellow-400 hover:text-white dark:text-gray-100 dark:hover:text-gray-300"
                    >
                      Login
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

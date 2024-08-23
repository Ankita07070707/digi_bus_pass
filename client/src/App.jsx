import React from "react";
import { useState } from "react";
import Navbar from "./components/Home/Navbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/auth/login";
import Signup from "./components/auth/signup";
import Dashboard from "./components/Dashboard/Dashboard";
import Logout from "./components//auth/logout";
import Payment from "./components/Payment/Payment";
import BusPass from "./components/BusPass/BussPass";
import GetPass from "./components/BusPass/GetPass";
import UserBusPass from "./components/Dashboard/UserBusPass.jsx";
import NotFound from "./components/Home/NotFound";
import PaymentSuccess from "./components/Payment/PaymentSuccess.jsx";
import ForgotPassword from "./components/auth/forgotPassword.jsx";

// import Profile from '../src/components/BusPass/pages/info';
// import Plan from '../src/components/BusPass/pages/plan';
// import Addon from '../src/components/BusPass/pages/addon';
// import Summary from '../src/components/BusPass/pages/summary'
// import Thanks from '../src/components/BusPass/pages/thanks';

function App() {
  const isUserAuthenticated = () => {
    return localStorage.getItem("token") !== null;
  };

  console.log("isUserAuthenticated", isUserAuthenticated());

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/dashboard"
            element={
              isUserAuthenticated() ? <Dashboard /> : <Navigate to="/login" />
            }
          />
          {/* <Route path="/payment" element={isUserAuthenticated() ? <Payment /> : <Navigate to="/login" />} /> */}
          <Route
            path="/buspass"
            element={
              isUserAuthenticated() ? <BusPass /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/buspass/getpass"
            element={
              isUserAuthenticated() ? <GetPass /> : <Navigate to="/login" />
            }
          />

          {/* user pass  */}
          <Route
            path="/dashboard/userbuspass/:id"
            element={
              isUserAuthenticated() ? <UserBusPass /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/payment/paymentverification"
            element={
              isUserAuthenticated() ? (
                <PaymentSuccess />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* <Route path="/buspass/info" element={isUserAuthenticated() ? <Profile /> : <Navigate to="/login" />} /> 
         <Route path="/buspass/plan" element={isUserAuthenticated() ? <Plan /> : <Navigate to="/login" />} />
         <Route path="/buspass/addon" element={isUserAuthenticated() ? <Addon /> : <Navigate to="/login" />} />
         <Route path="/buspass/summary" element={isUserAuthenticated() ? <Summary /> : <Navigate to="/login" />} />
         <Route path="/buspass/thanks" element={isUserAuthenticated() ? <Thanks /> : <Navigate to="/login" />} /> */}

          <Route
            path="/paymentsuccess"
            element={
              isUserAuthenticated() ? (
                <PaymentSuccess />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

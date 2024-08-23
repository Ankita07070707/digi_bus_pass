import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://digi-bus-pass-backend.onrender.com/api/v1/auth/logout")
      .then((res) => {
        console.log(res.data);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "/dashboard";
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return <div></div>;
};

export default logout;

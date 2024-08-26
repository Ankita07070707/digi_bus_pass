const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const {
  login,
  signup,
  sendotp,
  changePassword,
  logout,
  updateStudentDetails,
  getStudentDetails,
} = require("../controllers/StudentAuth");
const Student = require("../models/Student");
const {
  forgotPassword,
  resetPassword,
} = require("../controllers/ResetPassword");

router.post("/login", login);
router.post("/signup", signup);
router.post("/sendotp", sendotp);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password/:id/:token", resetPassword);
router.get("/logout", logout);

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await Student.findOne({ email });

    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = process.env.JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });
    const link = `https://digi-bus-pass-backend.onrender.com/api/v1/auth/reset-password/${oldUser._id}/${token}`;

    // Create a mailsender instance with your email credentials

    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Compose your email
    const emailData = {
      from: "DKTE Society's Textile and Engineering Institute",
      to: email,
      subject: "Password Reset",
      text: link,
    };

    // Send the email
    transporter.sendMail(emailData, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    console.log(link);
  } catch (error) {
    // Handle errors here
    console.error(error);
  }
});

router.get("/reset-password/:id/:token", async (req, res) => {
  const id = req.params.id;
  const token = req.params.token;
  console.log(req.params.id);

  const oldUser = await Student.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = process.env.JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email, status: "Not Verified" });
  } catch (error) {
    console.log(error);
    res.send("Not Verified");
  }
});

router.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const oldUser = await Student.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = process.env.JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await Student.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );

    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }
});

router.post("/updateStudentDetails", auth, updateStudentDetails);
router.get("/getStudentDetails", auth, getStudentDetails);

module.exports = router;

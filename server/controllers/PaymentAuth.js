const Payment = require("../models/Paymnet");
const Student = require("../models/Student");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const shortid = require("shortid");
const mailSender = require("../utils/mailSender");
const successPayment = require("../mail/successfullyPayment");
require("dotenv").config();
const PaymentSchema = require("../models/Paymnet");
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.checkout = async (req, res, next) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
    };

    const order = await razorpay.orders.create(options);

    // Extract amount from the order response
    const amount = order.amount / 100;

    return res.status(201).json({
      success: true,
      order,
      amount,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.paymentVerification = async (req, res) => {
  // console.log(req.body);
  // res.status(200).json({ success: true, message: "success" });
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const id = req.user.id;
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    console.log("razorpay_payment_id", razorpay_payment_id);
    console.log("razorpay_order_id", razorpay_order_id);
    console.log("razorpay_signature", razorpay_signature);

    if (generated_signature === razorpay_signature) {
      // Find the logged-in user (replace "loggedInUserId" with the actual way you identify the user)
      // Assuming user ID is available in req.user
      const studentDetails = await Student.findOne({ _id: id });
      console.log(typeof studentDetails);
      const PaymentProfile = await Payment.findById(
        studentDetails.paymentDoneDetails
      );
      console.log("Payment Details: ", PaymentProfile);

      const razorpayPayment = await razorpay.payments.fetch(
        razorpay_payment_id
      );
      // console.log("Razorpay Payment Object:", razorpayPayment);
      const amount = razorpayPayment.amount / 100;
      // console.log("Amount:", amount);

      // Store payment details in the database
      const paymentDetails = {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount,

        createdAt: Date.now(),
      };

      console.log("Payment", paymentDetails);

      PaymentProfile.paymentDone.push(paymentDetails);
      await PaymentProfile.save();

      // res.redirect(
      //   `http://localhost:5173/paymentsuccess?reference=${razorpay_payment_id}`
      // );
      res.status(200).json({
        success: true,
        redirectUrl: `http://localhost:5173/paymentsuccess?reference=${razorpay_payment_id}`,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

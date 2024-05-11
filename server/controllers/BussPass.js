const { validationResult } = require("express-validator");
const Student = require("../models/Student");
const BussPass = require("../models/Profile");
const StudentProfile = require("../models/Profile");
const Payment = require("../models/Paymnet");
const moment = require("moment");

exports.applyForBusPass = async (req, res) => {
  try {
    const {
      busFrom,
      busDestination,
      validDate,
      applyDate,
      firstName,
      lastName,
      year,
      branch,
      phno,
      address,
      amount,
      busPassDuration,
    } = req.body;
    const id = req.user.id;
    console.log(busPassDuration);
    // const { firstName, lastName, year, branch, phno, address, studentId } =
    //   req.body;

    // if (
    //   !busFrom ||
    //   !busDestination ||
    //   !firstName ||
    //   !lastName ||
    //   !year ||
    //   !branch ||
    //   !phno ||
    //   !address
    // ) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Missing required fields",
    //   });
    // }

    let parsedValidDate = moment().add(1, "months").format("DD/MM/YYYY");

    const studentDetails = await Student.findOne({ _id: id });
    // console.log(studentDetails);

    const studentProfile = await StudentProfile.findById(
      studentDetails.additionalDetails
    );

    if (busPassDuration === "1") {
      parsedValidDate = moment().add(1, "months").format("DD/MM/YYYY");
    }
    if (busPassDuration === "3") {
      parsedValidDate = moment().add(3, "months").format("DD/MM/YYYY");
    }
    if (busPassDuration === "6") {
      parsedValidDate = moment().add(6, "months").format("DD/MM/YYYY");
    }

    // const StudentInfo = await StudentProfile.findById({ _id: id });
    const busPassId = generateBusPassId();

    const busPass = {
      busPassId,
      busFrom,
      busDestination,
      applyDate: new Date(),
      validDate: parsedValidDate,
      busPassDuration,
    };
    const newStudentProfile = new StudentProfile({
      firstName,
      lastName,
      year,
      branch,
      phno,
      address,
      status: "Approved",
      isAvailable: "Yes",
      studentID: id,

      // For Default
    });

    // Save the new student profile instance to the database

    newStudentProfile.bussPass.push(busPass);
    console.log("Data Pushed");
    await newStudentProfile.save();

    console.log("Data saved");

    return res.status(200).json({
      success: true,
      message: "Bus Pass Applied Successfully",
      data: studentProfile,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

function generateBusPassId() {
  // Implement your logic to generate a unique bus pass number
  // For example, you can use a combination of timestamp and random numbers
  const randomNum = Math.floor(Math.random() * 9000) + 1000;
  const busPassId = `DKTE${randomNum}`;
  return busPassId;
}

// Renew Bus Pass with new Valid Date
exports.renewBusPass = async (req, res) => {
  try {
    // Validate input using express-validator or other validation method
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    // Extract necessary information from the request
    const { studentId, validDate, busPassId } = req.body;

    const parsedValidDate = moment(validDate, "DD/MM/YYYY").toDate();

    // Find the student profile and add the bus pass to the array
    const studentProfile = await BussPass.findOne({ studentId });

    if (!studentProfile) {
      return res.status(400).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // Find the bus pass to be renewed
    const busPass = studentProfile.bussPass.find(
      (busPass) => busPass.busPassId === busPassId
    );

    if (!busPass) {
      return res.status(400).json({
        success: false,
        message: "Bus pass not found",
      });
    }

    // Update the valid date of the bus pass
    busPass.validDate = parsedValidDate;

    // Save the student profile with the updated bus pass array
    await studentProfile.save();

    return res.status(200).json({
      success: true,
      message: "Bus pass renewed successfully",
      data: busPass,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while renewing the bus pass",
    });
  }
};

exports.UserPass = async (req, res) => {
  try {
    const id = req.user.id; // Assuming user ID is available in req.user.id

    const studentData = await Student.findOne({ _id: id });
    // console.log(studentDetails);

    const studentProfile = await StudentProfile.findOne({ studentID: id });

    const PaymentInfo = await Payment.findOne(studentData.paymentDoneDetails);

    console.log(PaymentInfo);
    // console.log(studentDetails.studentId);
    // console.log(studentDetails.additionalDetails);

    console.log(studentProfile);
    // console.log(userBusPasses);
    if (!studentProfile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User bus passes retrieved successfully",
      data: studentProfile,
      studentData,
      PaymentInfo,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

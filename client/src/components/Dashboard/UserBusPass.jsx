import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../../../src/assets/dkte-logo.png";
import axios from "axios";

const UserBusPass = () => {
  const { id } = useParams();
  const pdfRef = useRef();
  const [buspass, setBuspass] = useState([]);
  const [studentDetail, setstudentDetail] = useState([]);
  const [student, setStudent] = useState([]);
  const [paymentData, setpaymentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const generateInvoice = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/buspass/pass/${id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setBuspass(response.data.data.bussPass);
      setstudentDetail(response.data.data);
      setStudent(response.data.studentData);
      setpaymentData(response.data.PaymentInfo.paymentDone);
    } catch (err) {
      console.log("Error", err);
    }
  };

  useEffect(() => {
    generateInvoice();
  }, [id, token]);

  const downloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/pdf");
      const pdf = new jsPDF("p", "mm", "a4", true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      pdf.addImage(
        imgData,
        "PDF",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save(`DKTE${id}-BUSPASS.pdf`);
    });
  };

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div
        className="w-screen h-screen bg-slate-100 flex justify-center items-center"
        ref={pdfRef}
      >
        <div className="card w-[670px] rounded-md shadow-md bg-white p-5">
          <div className="h-15 flex content-center py-3 bg-slate-100">
            <img className="h-8 w-12 sm:h-10" src={logo} alt="DKTE Logo" />
            <h5 className="pl-3 text-s font-bold">
              D.K.T.E SOCIETY'S TEXTILE AND ENGINEERING INSTITUTE, ICHALKARANJI
            </h5>
          </div>

          {buspass.map((pass, index) => (
            <div key={index} className="my-5">
              <div className="h-30 grid grid-cols-2 gap-2">
                <div className="p-5 row-start text-start">
                  <p>Bus Pass ID: {pass.busPassId}</p>
                  <p>
                    Student Name: {studentDetail.firstName}{" "}
                    {studentDetail.lastName}
                  </p>
                  <p>PRN No: {student.studentId}</p>
                </div>
                <div className="p-5 row-end text-end ">
                  <p>Year:{studentDetail.year}</p>
                  {/* <p>Branch: {studentDetail.branch}</p> */}
                  <p>
                    Apply Date: {new Date(pass.applyDate).toLocaleDateString()}
                  </p>
                  <p>Valid Date: {pass.validDate}</p>
                </div>
              </div>
              {paymentData.map((pay, index) => (
                <div key={index} className="py-5 w-auto h-30 ">
                  <table className="w-full border-collapse border border-slate-400">
                    <thead>
                      <tr>
                        <th className="border border-slate-300 bg-slate-100">
                          SL. NO
                        </th>
                        <th className="border border-slate-300 bg-slate-100">
                          Particulars
                        </th>
                        <th className="border border-slate-300 bg-slate-100">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr key={index}>
                        <td className="border border-slate-300 text-center">
                          1
                        </td>
                        <td className="border border-slate-300 text-center">
                          {pass.busFrom} To {pass.busDestination}
                        </td>

                        <td className="border border-slate-300 text-center">
                          {pay.amount}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="text-end font-bold py-5">
                    <h3>Total Amount: Rs.{pay.amount} </h3>
                    <p></p>
                  </div>

                  <div className="w-auto h-25">
                    <table className="w-50 border-collapse border border-slate-400">
                      <tbody>
                        <tr>
                          <td className="border border-slate-500 font-bold">
                            <span>Mode</span>
                          </td>
                          <td className="border border-slate-500 ">
                            <span>Online</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-500 font-bold">
                            <span>Transaction ID</span>
                          </td>
                          <td className="border border-slate-500">
                            <span>{pay.razorpay_payment_id}</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-500 font-bold">
                            <span>Rs.</span>
                          </td>
                          <td className="border border-slate-500">
                            <span>{pay.amount}</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-500 font-bold">
                            <span>Transaction Date</span>
                          </td>
                          <td className="border border-slate-500">
                            <span>{new Date().toLocaleDateString()}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

              <div className="pt-20 grid grid-cols-2 gap-2">
                <div className="px-10 row-start text-start">
                  <h3>Principal</h3>
                </div>
                <div className="px-10 row-end text-end">
                  <h3>Cashier</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-slate-100 flex justify-center items-center">
        <button
          className="rounded-md bg-yellow-400 m-2 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={downloadPDF}
        >
          Download PDF
        </button>
        <a
          href="/dashboard"
          className="rounded-md bg-blue-400 m-2 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Go to Dashboard
        </a>
      </div>
    </>
  );
};

export default UserBusPass;

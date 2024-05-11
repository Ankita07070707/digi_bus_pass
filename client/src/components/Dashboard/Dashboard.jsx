import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [studentDetails, setStudentDetails] = useState({});
  const token = localStorage.getItem("token");
  const getStudentDetails = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/auth/getStudentDetails",
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setStudentDetails(response.data.data); // Assuming student details are inside the "data" property
      console.log("Student Details");
      //console.log(JSON.stringify(response.data.data));
      return newData;
    } catch (err) {
      console.log(err);
    }
  };

  console.log("Authorization Header:", `Bearer ${token}`);
  useEffect(() => {
    getStudentDetails();
  }, []);

  console.log("Student Profile", studentDetails.studentProfile);

  return (
    <>
      <section className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div>
          <Link to={Dashboard}>
            <h1 className="text-3xl text-center font-medium font-serif tracking-wide underline text-yellow-500 ">
              Dashboard
            </h1>
          </Link>

          {studentDetails && studentDetails.user && (
            <>
              {/* <h2>
                Welcome {studentDetails.user.firstName}{" "}
                {studentDetails.user.lastName}
              </h2> */}
              <h3 className="pt-3 text-xl text-center font-normal hover:font-bold">
                Your Student ID is: {studentDetails.user.studentId}
              </h3>
              <h3 className="py-2 text-xl text-center font-normal hover:font-bold">
                Your Email is: {studentDetails.user.email}
              </h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <a
                  href="/buspass/getpass"
                  className="rounded-md bg-yellow-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
                >
                  Click Here To Get Bus Pass
                </a>
              </div>

              {/* <div className="grid grid-cols-2 gap-6">
                <div className="">
                  <h1>Bus Pass History</h1>
                  {studentDetails.studentProfile &&
                    studentDetails.studentProfile.bussPass && (
                      <ul>
                        <>
                          <div className="conatiner md:auto w-8">
                            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                              <thead className="ltr:text-left rtl:text-right">
                                <tr>
                                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    Bus Pass ID
                                  </th>
                                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    Valid Date
                                  </th>
                                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    Applied Date
                                  </th>
                                  <th className="px-4 py-2"></th>
                                </tr>
                              </thead>

                              <tbody className="divide-y divide-gray-200">
                                {studentDetails.studentProfile.bussPass.map(
                                  (busPass) => (
                                    <tr>
                                      <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                        {" "}
                                        {busPass.busPassId}
                                      </td>
                                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                        {new Date(
                                          busPass.validDate
                                        ).toLocaleDateString()}
                                      </td>
                                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                        {new Date(
                                          busPass.aaplyDate
                                        ).toLocaleString()}
                                      </td>
                                      <td className="whitespace-nowrap px-4 py-2">
                                        <a
                                          href="#"
                                          className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                                        >
                                          View
                                        </a>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </>
                      </ul>
                    )}
                </div>
              </div> */}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Dashboard;

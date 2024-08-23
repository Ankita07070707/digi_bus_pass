// import React from "react";
// import Service from "./Service";
import Footer from "./Footer";

const Home = () => {
  const isUserAuthenticated = () => {
    return localStorage.getItem("token") !== null;
  };
  return (
    <>
      <section className="relative bg-[url(https://www.dkte.ac.in/images/phocagallery/thumbs/phoca_thumb_l_college-bus.jpg)] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8">
          <div class="grid max-w-[1550px] px-8 py-8 mx-auto lg:gap-10 xl:gap-0 lg:py-16 lg:grid-cols-12">
            <div class="p-6 place-self-center lg:col-span-7">
              <h1 class="max-w-xl mb-6 text-5xl text-dark font-medium xl:text-5xl text-white">
                <sapn class="text-yellow-400">Digital BusPass </sapn>Application
                and Renewal
              </h1>
              <p class="max-w-2xl mb-3 text-dark md:text-lg lg:text-xl text-white">
                DIGI-Bus pass Registration and Renewal is useful for the
                students who are facing problems with the current manual work of
                bus pass Registration and renewal in colleges. This online bus
                pass registration application will help students save their time
                and renewal bus passes without standing in a line for hours near
                counters in colleges.
              </p>

              <div class="mt-5">
                {isUserAuthenticated() ? (
                  <a href="/dashboard">
                    <button class="hover:bg-yellow-400 bg-white text-light font-semibold hover:text-dark py-2 px-4 border border-light-500 rounded">
                      Get Started
                    </button>
                  </a>
                ) : (
                  <a href="/signup">
                    <button class="hover:bg-yellow-400 bg-white text-light font-semibold hover:text-dark py-2 px-4 border border-light-500 rounded">
                      Get Started
                    </button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <Service /> */}
      <Footer />
    </>
  );
};

export default Home;

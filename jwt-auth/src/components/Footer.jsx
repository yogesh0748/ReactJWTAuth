import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();
  const yearRange = year > 2020 ? `2020 - ${year}` : "2020";

  return (
    <footer>
      <div className="bg-gray-800 py-6 text-gray-400">
        <div className="max-w-6xl mx-auto px-4">
          <div className="-mx-4 flex flex-wrap justify-between">
            <div className="px-4 my-4 w-full xl:w-1/5">
              <Link to="/" className="block w-56 mb-6">
                {/* Update the logo text to GOGOBUS */}
                <svg
                  viewBox="0 0 3368 512"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="w-full h-auto"
                >
                  <g fill="none" fillRule="evenodd">
                    <g transform="translate(0 -75)">
                      <g transform="translate(0 75)">
                        <rect
                          width="512"
                          height="512"
                          rx="128"
                          fill="#3D5AFE"
                        ></rect>
                        <rect
                          x="149"
                          y="176"
                          width="220"
                          height="220"
                          fill="#fff"
                        ></rect>
                        <circle cx="259" cy="156" r="40" fill="#fff"></circle>
                        <circle cx="369" cy="286" r="40" fill="#2962FF"></circle>
                      </g>
                      <text
                        fill="white"
                        fontFamily="Nunito-Bold, Nunito"
                        fontSize="96"
                        fontWeight="700"
                      >
                        <tspan x="654" y="118">
                          GOGOBUS
                        </tspan>
                      </text>
                    </g>
                  </g>
                </svg>
              </Link>

              <p className="text-justify text-sm">
                GOGOBUS is your trusted partner for comfortable and reliable bus
                travel. We connect cities with modern buses, professional drivers,
                and exceptional customer service. Book your journey with
                confidence.
              </p>
            </div>

            <div className="px-4 my-4 w-full sm:w-auto">
              <h2 className="inline-block text-2xl pb-4 mb-4 border-b-4 border-blue-600">
                Quick Links
              </h2>
              <ul className="leading-8 text-sm">
                <li>
                  <Link to="/search" className="hover:text-blue-400">
                    Search Routes
                  </Link>
                </li>
                <li>
                  <Link to="/schedule" className="hover:text-blue-400">
                    Bus Schedule
                  </Link>
                </li>
                <li>
                  <Link to="/tracking" className="hover:text-blue-400">
                    Track Bus
                  </Link>
                </li>
                <li>
                  <Link to="/booking" className="hover:text-blue-400">
                    My Bookings
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-blue-400">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div className="px-4 my-4 w-full sm:w-auto">
              <h2 className="inline-block text-2xl pb-4 mb-4 border-b-4 border-blue-600">
                Popular Routes
              </h2>
              <ul className="leading-8 text-sm max-w-xs">
                <li>
                  <Link to="#" className="hover:text-blue-400">
                    Delhi to Manali
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-blue-400">
                    Mumbai to Pune
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-blue-400">
                    Bangalore to Chennai
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-blue-400">
                    Hyderabad to Bangalore
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-blue-400">
                    View All Routes
                  </Link>
                </li>
              </ul>
            </div>

            <div className="px-4 my-4 w-full sm:w-auto xl:w-1/5">
              <h2 className="inline-block text-2xl pb-4 mb-4 border-b-4 border-blue-600">
                Help &amp; Support
              </h2>
              <ul className="leading-8 text-sm mb-4">
                <li>
                  <Link to="#" className="hover:text-blue-400">
                    24/7 Support: 1800-GOGOBUS
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-blue-400">
                    support@gogobus.com
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-blue-400">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-blue-400">
                    Refund Policy
                  </Link>
                </li>
              </ul>

              <div className="flex items-center space-x-2">
                <a
                  href="#"
                  className="inline-flex items-center justify-center h-8 w-8 border border-gray-100 rounded-full mr-1 hover:text-blue-400 hover:border-blue-400"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 320 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                  </svg>
                </a>

                <a
                  href="#"
                  className="inline-flex items-center justify-center h-8 w-8 border border-gray-100 rounded-full mr-1 hover:text-blue-400 hover:border-blue-400"
                  aria-label="Twitter"
                >
                  <svg
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 512 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
                  </svg>
                </a>

                <a
                  href="#"
                  className="inline-flex items-center justify-center h-8 w-8 border border-gray-100 rounded-full mr-1 hover:text-blue-400 hover:border-blue-400"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 448 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8z" />
                  </svg>
                </a>

                <a
                  href="#"
                  className="inline-flex items-center justify-center h-8 w-8 border border-gray-100 rounded-full hover:text-blue-400 hover:border-blue-400"
                  aria-label="YouTube"
                >
                  <svg
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 576 512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zM232.145 337.591V175.185l142.739 81.205-142.739 81.201z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-indigo-700 py-4 text-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="-mx-4 flex flex-wrap justify-between items-center">
            <div className="px-4 w-full text-center sm:w-auto sm:text-left text-sm">
              Copyright © {yearRange} GOGOBUS. All Rights Reserved.
            </div>
            <div className="px-4 w-full text-center sm:w-auto sm:text-left text-sm mt-2 sm:mt-0">
              Safe Travels with{" "}
              <span aria-hidden="true">❤️</span> by GOGOBUS
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
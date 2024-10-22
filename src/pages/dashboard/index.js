import React from "react";
import { Helmet } from "react-helmet";
import { NavbarWithMegaMenu } from "../components/navbar";
import "./index.css";
import { Link } from "react-router-dom";
const Dashboard = () => {
  return (
    <>
      <Helmet>
        <title>Start/Dashboard | BremenGo</title>
        <meta name="description" content="BremenGo Dashboard" />
      </Helmet>
      <NavbarWithMegaMenu />
      <div className="container m-auto mt-20 mb-40">
        <div className="grid lg:grid-cols-6 flex justify-center gap-12">
          <div></div>
          <Link
            to="/poi/new"
            className="w-full lg:col-span-2 cursor-pointer dashboard-corner-card flex"
          >
            <h2 className="text-[#5A5A5A] m-auto text-center text-3xl justify-center">
              Neuen POI erstellen
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="47"
                viewBox="0 0 40 47"
                className="m-auto"
              >
                <g
                  id="Ellipse_5"
                  data-name="Ellipse 5"
                  transform="translate(0 7)"
                  fill="none"
                  stroke="#29567c"
                  strokeWidth="2"
                >
                  <circle cx="20" cy="20" r="20" stroke="none"></circle>
                  <circle cx="20" cy="20" r="19" fill="none"></circle>
                </g>
                <text
                  id="_"
                  data-name="+"
                  transform="translate(10.5 37)"
                  fill="#5A5A5A"
                  fontSize="39"
                  fontFamily="Calibri"
                >
                  <tspan x="0" y="0">
                    +
                  </tspan>
                </text>
              </svg>
            </h2>
          </Link>

          <Link
            to="/tour/new"
            className="lg:col-span-2 cursor-pointer dashboard-corner-card flex"
          >
            <h2 className="text-[#5A5A5A] m-auto text-center text-3xl justify-center">
              Neue Tour erstellen
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="47"
                viewBox="0 0 40 47"
                className="m-auto"
              >
                <g
                  id="Ellipse_5"
                  data-name="Ellipse 5"
                  transform="translate(0 7)"
                  fill="none"
                  stroke="#29567c"
                  strokeWidth="2"
                >
                  <circle cx="20" cy="20" r="20" stroke="none"></circle>
                  <circle cx="20" cy="20" r="19" fill="none"></circle>
                </g>
                <text
                  id="_"
                  data-name="+"
                  transform="translate(10.5 37)"
                  fill="#5A5A5A"
                  fontSize="39"
                  fontFamily="Calibri"
                >
                  <tspan x="0" y="0">
                    +
                  </tspan>
                </text>
              </svg>
            </h2>
          </Link>
          <div></div>
          <div></div>

          <Link
            to="/offersnews"
            className="lg:col-span-2 cursor-pointer dashboard-card flex"
          >
            <h2 className="text-[#5A5A5A] m-auto text-center text-3xl justify-center">
              Home Screen
            </h2>
          </Link>
          <Link
            to="/tour"
            className="lg:col-span-2 cursor-pointer dashboard-card flex"
          >
            <h2 className="text-[#5A5A5A] m-auto text-center text-3xl justify-center">
              Touren Übersicht
            </h2>
          </Link>
          <div></div>
          <div></div>
          <Link
            to="/poi"
            className="lg:col-span-2 cursor-pointer dashboard-card flex"
          >
            <h2 className="text-[#5A5A5A] m-auto text-center text-3xl justify-center">
              POI Übersicht
            </h2>
          </Link>
          <Link
            to="/page"
            className="lg:col-span-2 cursor-pointer dashboard-card flex"
          >
            <h2 className="text-[#5A5A5A] m-auto text-center text-3xl justify-center">
              Info Screen
            </h2>
          </Link>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

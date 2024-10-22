import React from "react";
import { Helmet } from "react-helmet";
import { NavbarWithMegaMenu } from "../components/navbar";
import "./index.css";
import { Link } from "react-router-dom";
const InfoPage = () => {
  return (
    <>
      <Helmet>
        <title>Start/Dashboard | BremenGo</title>
        <meta name="description" content="BremenGo Dashboard" />
      </Helmet>
      <NavbarWithMegaMenu />
      <div className="container m-auto mt-20">
        <div className="text-center text-4xl font-semibold text-[#5A5A5A] mb-16">
          INFO
        </div>
        <div className="grid lg:grid-cols-6 flex justify-center gap-12">
          <div></div>
          <Link
            to="/page/contact"
            className="lg:col-span-2 cursor-pointer dashboard-card flex"
          >
            <h2 className="text-[#5A5A5A] m-auto text-center text-3xl justify-center">
              Kontakt
            </h2>
          </Link>
          <Link
            to="/faq"
            className="lg:col-span-2 cursor-pointer dashboard-card flex"
          >
            <h2 className="text-[#5A5A5A] m-auto text-center text-3xl justify-center">
              FAQ
            </h2>
          </Link>
          <div></div>
          <div></div>
          <Link
            to="/page/imprint"
            className="lg:col-span-2 cursor-pointer dashboard-card flex"
          >
            <h2 className="text-[#5A5A5A] m-auto text-center text-3xl justify-center">
              Impressum
            </h2>
          </Link>
          <Link
            to="/page/privacy"
            className="lg:col-span-2 cursor-pointer dashboard-card flex"
          >
            <h2 className="text-[#5A5A5A] m-auto text-center text-3xl justify-center">
              Datenschutz
            </h2>
          </Link>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default InfoPage;

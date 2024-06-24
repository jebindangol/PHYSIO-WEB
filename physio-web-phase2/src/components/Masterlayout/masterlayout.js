import React from "react";
import Navbar from "./navbar";
import Footer from "./footer";

const MasterLayout = ({ children }) => {
  return (
    <div>
      <Navbar className="mb-20" />
      <main className="w-[96%] mx-auto mt-[120px]">{children}</main>
      <Footer />
    </div>
  );
};

export default MasterLayout;

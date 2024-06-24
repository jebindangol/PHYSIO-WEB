import React from "react";
import MasterLayout from "../components/Masterlayout/masterlayout";
import Hero from "../components/Homepage/hero";
import BlogSection from "../components/Homepage/blogsection";
import Library from "../components/Homepage/library";
import PhysioServicePage from "../components/Homepage/physioservice";


const Home = () => {
  return (
    <MasterLayout>
      <Hero />
      <PhysioServicePage/>
      <BlogSection />
      <Library />
    </MasterLayout>
  );
};

export default Home;

import React from "react";
import Hero from "../Components/Hero";
import ItemsGrid from "../Components/ItemsGrid";
import { PropertyProvider } from "../Context/HomeCardDataContext";

const HomeContent = () => {
  return (
    <>
      <Hero />
      <ItemsGrid />
    </>
  );
};

const Home = () => {
  return (
    <PropertyProvider>
      <HomeContent />
    </PropertyProvider>
  );
};

export default Home;

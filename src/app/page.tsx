"use client";

import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import HowWeWork from "@/components/sections/HowWeWork";
import Calculator from "@/components/sections/Calculator";
import Pricing from "@/components/sections/Pricing";
import About from "@/components/sections/About";
import Contacts from "@/components/sections/Contacts";
import PortfolioCarousel from "@/components/sections/PortfolioCarousel";
import VideoBlog from "@/components/sections/VideoBlog";
import BlogSection from "@/components/sections/Blog";
import FAQSection from "@/components/sections/FAQ";
import { useState } from "react";

export default function Home() {
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  return (
    <main>
      <Hero />
      <Services />
      <HowWeWork />
      <Calculator onPriceChange={setCalculatedPrice} />
      <Pricing />
      <PortfolioCarousel />
      <VideoBlog />
      <BlogSection />
      <About />
      <FAQSection />
      <Contacts initialPrice={calculatedPrice} />
    </main>
  );
}

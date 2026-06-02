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
import { useState, useEffect } from "react";

export default function Home() {
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    fetch("/api/content").then(res => res.json()).then(data => {
      if (data) setContent(data);
    });
  }, []);

  if (!content) return null; // or a loading spinner

  return (
    <main>
      {content.showHero && <Hero />}
      {content.showServices && <Services />}
      {content.showHowWeWork && <HowWeWork />}
      {content.showCalculator && <Calculator onPriceChange={setCalculatedPrice} />}
      {content.showPricing && <Pricing />}
      {content.showPortfolio && <PortfolioCarousel />}
      {content.showVideoBlog && <VideoBlog />}
      {content.showBlog && <BlogSection />}
      {content.showAbout && <About />}
      {content.showFAQ && <FAQSection />}
      {content.showContacts && <Contacts initialPrice={calculatedPrice} />}
    </main>
  );
}

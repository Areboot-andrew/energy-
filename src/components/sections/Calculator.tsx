"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ContactButton from "@/components/ui/ContactButton";
import HighlightedTitle from "@/components/ui/HighlightedTitle";

interface CalculatorProps {
  onPriceChange?: (price: number) => void;
}

const Calculator = ({ onPriceChange }: CalculatorProps) => {
  const [sliderValue, setSliderValue] = useState(2);
  const [multiplier, setMultiplier] = useState(1);
  const [total, setTotal] = useState(0);
  
  const [config, setConfig] = useState({
    basePrice: 7500,
    sliderLabel: "Кількість кімнат",
    sliderMin: 1,
    sliderMax: 5,
    sliderStep: 1,
    sliderSuffix: " кімн.",
    packagesLabel: "Рівень інсталяції",
    packagesJson: "[{\"name\":\"Base\",\"multiplier\":1},{\"name\":\"Standard\",\"multiplier\":1.5},{\"name\":\"Premium\",\"multiplier\":2.5}]",
    resultLabel: "Орієнтовна вартість",
    resultPrefix: "від",
    resultCurrency: "₴"
  });

  const [content, setContent] = useState({
    calculatorTitle: "Розрахуйте вартість *проєкту*",
    calculatorSub: "Отримайте попередню оцінку за 30 секунд",
    calculatorButtonText: "Залишити заявку"
  });

  const [packages, setPackages] = useState<{name: string, multiplier: number}[]>([]);

  useEffect(() => {
    fetch("/api/calculator-config")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setConfig(prev => ({ ...prev, ...data }));
          try {
            const parsed = JSON.parse(data.packagesJson || "[]");
            if (parsed.length > 0) {
              setPackages(parsed);
              setMultiplier(parsed[0].multiplier); // Select first by default
            }
          } catch (e) {
            console.error("Failed to parse packages", e);
          }
          // Set initial slider value if it's out of new bounds
          if (sliderValue < (data.sliderMin || 1)) setSliderValue(data.sliderMin || 1);
        }
      })
      .catch(err => console.error("Failed to fetch calculator config", err));
      
    fetch("/api/content").then(res => res.json()).then(data => {
      if (data) setContent(prev => ({ ...prev, ...data }));
    });
  }, []);

  useEffect(() => {
    // Formula: SliderValue * BasePrice * PackageMultiplier
    const newTotal = sliderValue * (config.basePrice || 0) * multiplier;
    setTotal(newTotal);
    if (onPriceChange) onPriceChange(newTotal);
  }, [sliderValue, multiplier, config.basePrice]);

  return (
    <section className="py-24 bg-surface-container-lowest px-margin-desktop" id="calculator">
      <div className="max-w-4xl mx-auto bg-surface-container rounded-2xl p-8 md:p-12 border border-outline-variant/20 shadow-2xl">
        <div className="text-center mb-12">
          <HighlightedTitle text={content.calculatorTitle} className="font-headline-xl text-4xl text-white mb-4" as="h2" />
          <p className="text-secondary-fixed-dim">{content.calculatorSub}</p>
        </div>
        <div className="space-y-10">
          <div>
            <div className="flex justify-between mb-4">
              <label className="text-on-surface font-label-md">{config.sliderLabel}</label>
              <span className="text-primary-fixed font-bold" id="room-val">
                {sliderValue}{config.sliderSuffix}
              </span>
            </div>
            <input 
              className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary-fixed" 
              id="room-slider" 
              max={config.sliderMax} 
              min={config.sliderMin} 
              step={config.sliderStep} 
              type="range" 
              value={sliderValue}
              onChange={(e) => setSliderValue(parseInt(e.target.value))}
            />
          </div>
          <div>
            <label className="text-on-surface font-label-md mb-4 block">{config.packagesLabel}</label>
            <div className={`grid gap-4 ${packages.length === 2 ? 'grid-cols-2' : packages.length === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-3'}`}>
              {packages.map((pkg) => (
                <button 
                  key={pkg.name}
                  onClick={() => setMultiplier(pkg.multiplier)}
                  className={`package-btn border p-4 rounded-lg font-bold transition-all ${
                    multiplier === pkg.multiplier 
                      ? "border-primary-fixed bg-primary-fixed text-on-primary-fixed" 
                      : "border-outline-variant text-secondary hover:border-primary-fixed text-sm md:text-base"
                  }`}
                >
                  {pkg.name}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-background rounded-xl p-8 border border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-secondary-fixed-dim text-sm uppercase tracking-widest">{config.resultLabel}</p>
              <div className="text-4xl md:text-5xl font-bold text-white mt-2">
                {config.resultPrefix} <span className="text-primary-fixed" id="total-price">{total.toLocaleString()}</span> <span className="text-2xl">{config.resultCurrency}</span>
              </div>
            </div>
            <ContactButton 
              price={total}
              className="mt-6 w-full md:w-auto text-center bg-primary-fixed text-on-primary-fixed font-bold py-4 px-8 rounded-lg hover:shadow-[0_0_20px_rgba(213,240,0,0.3)] transition-all block"
            >
              {content.calculatorButtonText}
            </ContactButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;

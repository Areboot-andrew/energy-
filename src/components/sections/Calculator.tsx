"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CalculatorProps {
  onPriceChange?: (price: number) => void;
}

const Calculator = ({ onPriceChange }: CalculatorProps) => {
  const [rooms, setRooms] = useState(2);
  const [multiplier, setMultiplier] = useState(1);
  const [total, setTotal] = useState(0);
  const [basePerRoom, setBasePerRoom] = useState(7500);

  useEffect(() => {
    fetch("/api/calculator-config")
      .then((res) => res.json())
      .then((data) => {
        if (data.basePerRoom) setBasePerRoom(data.basePerRoom);
      })
      .catch(err => console.error("Failed to fetch calculator config", err));
  }, []);

  useEffect(() => {
    const newTotal = rooms * basePerRoom * multiplier;
    setTotal(newTotal);
    if (onPriceChange) onPriceChange(newTotal);
  }, [rooms, multiplier, basePerRoom]);

  const packages = [
    { name: "Base", multiplier: 1 },
    { name: "Standard", multiplier: 1.5 },
    { name: "Premium", multiplier: 2.5 },
  ];

  const getRoomsSuffix = (r: number) => {
    return r === 1 ? ' кімната' : r < 5 ? ' кімнати' : ' кімнат';
  };

  return (
    <section className="py-24 bg-surface-container-lowest px-margin-desktop" id="calculator">
      <div className="max-w-4xl mx-auto bg-surface-container rounded-2xl p-8 md:p-12 border border-outline-variant/20 shadow-2xl">
        <div className="text-center mb-12">
          <h2 className="font-headline-xl text-white mb-4">Розрахуйте вартість проєкту</h2>
          <p className="text-secondary-fixed-dim">Отримайте попередню оцінку за 30 секунд</p>
        </div>
        <div className="space-y-10">
          <div>
            <div className="flex justify-between mb-4">
              <label className="text-on-surface font-label-md">Кількість кімнат</label>
              <span className="text-primary-fixed font-bold" id="room-val">
                {rooms}{getRoomsSuffix(rooms)}
              </span>
            </div>
            <input 
              className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary-fixed" 
              id="room-slider" 
              max="5" 
              min="1" 
              step="1" 
              type="range" 
              value={rooms}
              onChange={(e) => setRooms(parseInt(e.target.value))}
            />
          </div>
          <div>
            <label className="text-on-surface font-label-md mb-4 block">Рівень інсталяції</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {packages.map((pkg) => (
                <button 
                  key={pkg.name}
                  onClick={() => setMultiplier(pkg.multiplier)}
                  className={`package-btn border p-4 rounded-lg font-bold transition-all ${
                    multiplier === pkg.multiplier 
                      ? "border-primary-fixed bg-primary-fixed text-on-primary-fixed" 
                      : "border-outline-variant text-secondary hover:border-primary-fixed"
                  }`}
                >
                  {pkg.name}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-background rounded-xl p-8 border border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-secondary-fixed-dim text-sm uppercase tracking-widest">Орієнтовна вартість</p>
              <div className="text-4xl md:text-5xl font-bold text-white mt-2">
                від <span className="text-primary-fixed" id="total-price">{total.toLocaleString()}</span> <span className="text-2xl">₴</span>
              </div>
            </div>
            <a 
              href="#contacts"
              className="w-full md:w-auto text-center bg-white text-black px-8 py-4 rounded-lg font-bold hover:bg-primary-fixed transition-colors"
            >
              Детальний кошторис
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;

"use client";

import React, { useState } from "react";
import * as Icons from "lucide-react";

// List of popular preset icons suitable for an electrical / smart home company
const PRESET_ICONS = [
  // Electricity & Energy
  "Zap", "ZapOff", "Plug", "PlugZap", "Power", "PowerOff", "Cable", 
  "Battery", "BatteryCharging", "BatteryFull", "BatteryMedium", "BatteryLow", "BatteryWarning",
  "Flashlight", "Lightbulb", "LightbulbOff", "Sun", "SunDim", "Moon", "Flame",
  "Wind", "Leaf", "UtilityPole", "RadioTower", "SatelliteDish", "Factory", "Droplet", "Waves",

  // IT & Smart Home
  "Home", "Cpu", "Server", "Database", "Code", "Wifi", "Router", "Network", 
  "Bluetooth", "Monitor", "Tv", "Smartphone", "Tablet", "Speaker", "Mic", 
  "Camera", "Cctv", "Fingerprint", "Lock", "Key", "Shield", "ShieldCheck", 
  "ShieldAlert", "Cloud", "HardDrive", "Fan", "Thermometer", "Snowflake",
  "Laptop", "Keyboard", "Mouse", "Printer", "Cast", "Watch", "AppWindow", 
  "Terminal", "CircuitBoard", "Radio", "Gamepad2", "Speaker", "Airplay",

  // Auto Energy & EV
  "Car", "CarFront", "Fuel", "Navigation", "MapPin", "Map", "Compass",
  "Bus", "Truck", "Bike", "TrainFront", "CarTaxiFront",

  // Tools, Construction & Repair
  "Hammer", "Wrench", "Tool", "HardHat", "Ruler", "Paintbrush", "PenTool",
  "Scissors", "PaintBucket", "Pipette", "Pencil", "Pen", "Drill", "Anvil",
  "Axe", "Construction", "Shovel", "Screwdriver", "Wrench",

  // General Business, Finance & UI
  "Settings", "Settings2", "Sliders", "CheckCircle", "CheckSquare", "List", 
  "Grid", "Layers", "Box", "Package", "Activity", "Clock", "Timer", "Calendar", 
  "Phone", "PhoneCall", "Mail", "MessageCircle", "MessageSquare", "Info", 
  "HelpCircle", "Star", "Award", "ThumbsUp", "Users", "User", "Globe",
  "Briefcase", "FileText", "Folder", "Link", "Search", "Heart", "Eye", "EyeOff",
  "Calculator", "Banknote", "Coins", "CreditCard", "Wallet", "TrendingUp",
  "Percent", "PieChart", "BarChart", "Handshake", "BadgeCheck", "Medal",
  "Trophy", "CheckCircle2", "PlusCircle", "MinusCircle", "AlertCircle"
];

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export default function IconPicker({ value, onChange }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredIcons = PRESET_ICONS.filter(icon => 
    icon.toLowerCase().includes(search.toLowerCase())
  );

  const renderIcon = (iconName: string, size = 24) => {
    const IconComponent = (Icons as any)[iconName];
    if (!IconComponent) {
      return <div className="w-[24px] h-[24px] flex items-center justify-center text-xs">?</div>;
    }
    return <IconComponent size={size} />;
  };

  return (
    <div className="relative w-full">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-background border border-outline-variant/30 rounded-lg px-4 py-3 text-white focus-within:border-primary-fixed cursor-pointer flex justify-between items-center"
      >
        <div className="flex items-center gap-3">
          {value ? (
            <div className="text-primary-fixed flex items-center justify-center">
              {renderIcon(value)}
            </div>
          ) : (
            <div className="w-6 h-6 border border-dashed border-secondary-fixed-dim rounded-full flex items-center justify-center text-secondary-fixed-dim text-xs">?</div>
          )}
          <span className={value ? "text-white" : "text-secondary-fixed-dim"}>
            {value || "Оберіть іконку..."}
          </span>
        </div>
        <Icons.ChevronDown size={18} className="text-secondary-fixed-dim" />
      </div>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-surface-container-high border border-outline-variant/30 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-3 border-b border-outline-variant/30">
            <input
              type="text"
              placeholder="Пошук іконки (англійською)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background border border-outline-variant/20 rounded-lg px-3 py-2 text-sm text-white focus:border-primary-fixed outline-none"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="p-3 grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-64 overflow-y-auto">
            {filteredIcons.map((iconName) => (
              <button
                key={iconName}
                type="button"
                onClick={() => {
                  // convert PascalCase back to kebab-case or just pass PascalCase
                  // Lucide prefers PascalCase for dynamic imports, but standard HTML uses kebab.
                  // We will store PascalCase for simplicity with our dynamic renderer on the frontend.
                  onChange(iconName);
                  setIsOpen(false);
                  setSearch("");
                }}
                className={`flex items-center justify-center p-2 rounded-lg transition-all ${
                  value === iconName 
                    ? "bg-primary-fixed text-on-primary-fixed" 
                    : "text-secondary-fixed-dim hover:bg-surface-container-highest hover:text-white"
                }`}
                title={iconName}
              >
                {renderIcon(iconName, 20)}
              </button>
            ))}
            {filteredIcons.length === 0 && (
              <div className="col-span-full py-4 text-center text-secondary-fixed-dim text-sm">
                Іконки не знайдено
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Invisible overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}

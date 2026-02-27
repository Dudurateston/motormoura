import React, { useEffect, useRef } from "react";

// SVG-based animated piston / engine cross-section
export default function HeroPiston() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      {/* Outer ring */}
      <div
        className="absolute"
        style={{
          width: 320,
          height: 320,
          border: "1px solid rgba(251,146,60,0.15)",
          borderRadius: "50%",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
      />
      <div
        className="absolute"
        style={{
          width: 260,
          height: 260,
          border: "1px solid rgba(29,78,216,0.2)",
          borderRadius: "50%",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
      />

      {/* Main engine SVG */}
      <svg
        viewBox="0 0 200 200"
        className="mm-piston-float"
        style={{ width: 220, height: 220, filter: "drop-shadow(0 0 20px rgba(29,78,216,0.3))" }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Engine block */}
        <rect x="55" y="30" width="90" height="110" rx="4" fill="#27272C" stroke="rgba(251,146,60,0.5)" strokeWidth="1.5"/>

        {/* Cylinder bore */}
        <rect x="70" y="45" width="60" height="70" rx="2" fill="#1F1F23" stroke="rgba(29,78,216,0.6)" strokeWidth="1"/>

        {/* Piston */}
        <rect x="72" y="70" width="56" height="30" rx="2" fill="#374151" stroke="rgba(251,146,60,0.7)" strokeWidth="1.5"/>

        {/* Piston rings */}
        <line x1="72" y1="77" x2="128" y2="77" stroke="rgba(251,146,60,0.6)" strokeWidth="1.5"/>
        <line x1="72" y1="84" x2="128" y2="84" stroke="rgba(251,146,60,0.4)" strokeWidth="1"/>
        <line x1="72" y1="91" x2="128" y2="91" stroke="rgba(251,146,60,0.3)" strokeWidth="0.8"/>

        {/* Connecting rod */}
        <path d="M100 100 L100 145 Q95 148 95 155 L105 155 Q105 148 100 145" fill="#374151" stroke="rgba(29,78,216,0.6)" strokeWidth="1"/>

        {/* Crankshaft circle */}
        <circle cx="100" cy="162" r="10" fill="#27272C" stroke="rgba(29,78,216,0.8)" strokeWidth="1.5"/>
        <circle cx="100" cy="162" r="4" fill="rgba(29,78,216,0.5)"/>

        {/* Valves */}
        <rect x="73" y="46" width="8" height="14" rx="1" fill="#4B5563" stroke="rgba(29,78,216,0.5)" strokeWidth="0.8"/>
        <rect x="119" y="46" width="8" height="14" rx="1" fill="#4B5563" stroke="rgba(251,146,60,0.5)" strokeWidth="0.8"/>

        {/* Valve springs */}
        <path d="M77 60 Q76 63 77 66 Q78 69 77 72" stroke="rgba(156,163,175,0.5)" strokeWidth="0.8" fill="none"/>
        <path d="M123 60 Q122 63 123 66 Q124 69 123 72" stroke="rgba(156,163,175,0.5)" strokeWidth="0.8" fill="none"/>

        {/* Spark plug */}
        <line x1="100" y1="30" x2="100" y2="46" stroke="rgba(251,146,60,0.8)" strokeWidth="2"/>
        <circle cx="100" cy="26" r="4" fill="#374151" stroke="rgba(251,146,60,0.8)" strokeWidth="1.5"/>

        {/* Spark */}
        <path d="M98 26 L102 22 L100 27 L104 23" stroke="#FB923C" strokeWidth="1.5" strokeLinecap="round"/>

        {/* Cooling fins */}
        <line x1="55" y1="55" x2="40" y2="55" stroke="rgba(156,163,175,0.3)" strokeWidth="3" strokeLinecap="round"/>
        <line x1="55" y1="65" x2="40" y2="65" stroke="rgba(156,163,175,0.25)" strokeWidth="3" strokeLinecap="round"/>
        <line x1="55" y1="75" x2="40" y2="75" stroke="rgba(156,163,175,0.2)" strokeWidth="3" strokeLinecap="round"/>
        <line x1="55" y1="85" x2="40" y2="85" stroke="rgba(156,163,175,0.15)" strokeWidth="3" strokeLinecap="round"/>
        <line x1="145" y1="55" x2="160" y2="55" stroke="rgba(156,163,175,0.3)" strokeWidth="3" strokeLinecap="round"/>
        <line x1="145" y1="65" x2="160" y2="65" stroke="rgba(156,163,175,0.25)" strokeWidth="3" strokeLinecap="round"/>
        <line x1="145" y1="75" x2="160" y2="75" stroke="rgba(156,163,175,0.2)" strokeWidth="3" strokeLinecap="round"/>
        <line x1="145" y1="85" x2="160" y2="85" stroke="rgba(156,163,175,0.15)" strokeWidth="3" strokeLinecap="round"/>

        {/* Oil pan */}
        <path d="M60 140 L60 175 Q100 185 140 175 L140 140 Z" fill="#27272C" stroke="rgba(156,163,175,0.2)" strokeWidth="1"/>
      </svg>

      {/* Data readouts */}
      <div
        className="absolute font-mono-tech text-xs mm-data-blink"
        style={{ top: "15%", right: "8%", color: "rgba(29,78,216,0.7)" }}
      >
        RPM: 3600
      </div>
      <div
        className="absolute font-mono-tech text-xs"
        style={{ bottom: "20%", left: "5%", color: "rgba(251,146,60,0.5)", animationDelay: "1s" }}
      >
        6.5 HP
      </div>
      <div
        className="absolute font-mono-tech text-xs mm-data-blink"
        style={{ top: "45%", left: "4%", color: "rgba(74,222,128,0.5)", animationDelay: "2s" }}
      >
        ● READY
      </div>
    </div>
  );
}
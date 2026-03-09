import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

// Light-theme isometric SVG icons
const CategorySVGs = {
  "Motores a Gasolina": ({ hovered }) => (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 52, height: 52 }}>
      <rect x="15" y="25" width="50" height="35" rx="3" fill={hovered ? "#CBD5E1" : "#E2E8F0"} stroke={hovered ? "#D32F2F" : "rgba(211,47,47,0.4)"} strokeWidth="1.5"/>
      <rect x="20" y="18" width="40" height="12" rx="2" fill={hovered ? "#94A3B8" : "#CBD5E1"} stroke={hovered ? "rgba(211,47,47,0.8)" : "rgba(156,163,175,0.5)"} strokeWidth="1"/>
      <circle cx="40" cy="14" r="5" fill={hovered ? "#D32F2F" : "#F1F5F9"} stroke={hovered ? "#D32F2F" : "rgba(211,47,47,0.5)"} strokeWidth="1.5"/>
      <line x1="15" y1="38" x2="8" y2="38" stroke={hovered ? "rgba(211,47,47,0.7)" : "rgba(156,163,175,0.5)"} strokeWidth="4" strokeLinecap="round"/>
      <line x1="15" y1="46" x2="8" y2="46" stroke={hovered ? "rgba(211,47,47,0.5)" : "rgba(156,163,175,0.3)"} strokeWidth="4" strokeLinecap="round"/>
      <rect x="55" y="28" width="10" height="10" rx="1" fill={hovered ? "rgba(29,78,216,0.25)" : "rgba(29,78,216,0.12)"} stroke={hovered ? "#1D4ED8" : "rgba(29,78,216,0.35)"} strokeWidth="1"/>
    </svg>
  ),
  "Motores a Diesel": ({ hovered }) => (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 52, height: 52 }}>
      <rect x="12" y="22" width="56" height="38" rx="3" fill={hovered ? "#CBD5E1" : "#E2E8F0"} stroke={hovered ? "#D32F2F" : "rgba(211,47,47,0.4)"} strokeWidth="1.5"/>
      <rect x="18" y="30" width="18" height="22" rx="1" fill={hovered ? "#E2E8F0" : "#F1F5F9"} stroke={hovered ? "rgba(29,78,216,0.8)" : "rgba(29,78,216,0.4)"} strokeWidth="1"/>
      <rect x="44" y="30" width="18" height="22" rx="1" fill={hovered ? "#E2E8F0" : "#F1F5F9"} stroke={hovered ? "rgba(29,78,216,0.8)" : "rgba(29,78,216,0.4)"} strokeWidth="1"/>
      <rect x="24" y="34" width="6" height="14" rx="1" fill={hovered ? "#94A3B8" : "#CBD5E1"} stroke={hovered ? "rgba(211,47,47,0.6)" : "rgba(156,163,175,0.4)"} strokeWidth="1"/>
      <rect x="50" y="34" width="6" height="14" rx="1" fill={hovered ? "#94A3B8" : "#CBD5E1"} stroke={hovered ? "rgba(211,47,47,0.6)" : "rgba(156,163,175,0.4)"} strokeWidth="1"/>
      <line x1="22" y1="16" x2="22" y2="22" stroke={hovered ? "#D32F2F" : "rgba(156,163,175,0.5)"} strokeWidth="2"/>
      <line x1="58" y1="16" x2="58" y2="22" stroke={hovered ? "#D32F2F" : "rgba(156,163,175,0.5)"} strokeWidth="2"/>
    </svg>
  ),
  "Geradores 4 Tempos": ({ hovered }) => (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 52, height: 52 }}>
      <rect x="8" y="25" width="64" height="38" rx="3" fill={hovered ? "#CBD5E1" : "#E2E8F0"} stroke={hovered ? "#D32F2F" : "rgba(211,47,47,0.4)"} strokeWidth="1.5"/>
      <circle cx="32" cy="38" r="10" fill={hovered ? "rgba(29,78,216,0.2)" : "rgba(29,78,216,0.08)"} stroke={hovered ? "#1D4ED8" : "rgba(29,78,216,0.4)"} strokeWidth="1.5"/>
      <path d="M32 28 L34 35 L40 35 L35 39 L37 46 L32 42 L27 46 L29 39 L24 35 L30 35 Z" fill={hovered ? "#D32F2F" : "rgba(211,47,47,0.5)"}/>
      <rect x="52" y="30" width="14" height="8" rx="1" fill={hovered ? "rgba(29,78,216,0.15)" : "rgba(29,78,216,0.08)"} stroke={hovered ? "#1D4ED8" : "rgba(29,78,216,0.3)"} strokeWidth="1"/>
      <line x1="55" y1="32" x2="63" y2="32" stroke={hovered ? "#1D4ED8" : "rgba(29,78,216,0.4)"} strokeWidth="0.8"/>
      <line x1="55" y1="35" x2="63" y2="35" stroke={hovered ? "#1D4ED8" : "rgba(29,78,216,0.4)"} strokeWidth="0.8"/>
    </svg>
  ),
  "Motobombas 4 Tempos": ({ hovered }) => (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 52, height: 52 }}>
      <circle cx="40" cy="40" r="22" fill={hovered ? "#CBD5E1" : "#E2E8F0"} stroke={hovered ? "#D32F2F" : "rgba(211,47,47,0.4)"} strokeWidth="1.5"/>
      <circle cx="40" cy="40" r="14" fill={hovered ? "#E2E8F0" : "#F1F5F9"} stroke={hovered ? "rgba(29,78,216,0.8)" : "rgba(29,78,216,0.3)"} strokeWidth="1"/>
      <circle cx="40" cy="40" r="6" fill={hovered ? "rgba(29,78,216,0.3)" : "rgba(29,78,216,0.12)"} stroke={hovered ? "#1D4ED8" : "rgba(29,78,216,0.4)"} strokeWidth="1"/>
      {[0,45,90,135,180,225,270,315].map((angle, i) => {
        const rad = angle * Math.PI / 180;
        const x1 = 40 + Math.cos(rad) * 8;
        const y1 = 40 + Math.sin(rad) * 8;
        const x2 = 40 + Math.cos(rad) * 13;
        const y2 = 40 + Math.sin(rad) * 13;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={hovered ? "rgba(211,47,47,0.6)" : "rgba(211,47,47,0.3)"} strokeWidth="2.5" strokeLinecap="round"/>;
      })}
    </svg>
  ),
  "Bombas de Pulverização": ({ hovered }) => (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 52, height: 52 }}>
      <rect x="20" y="30" width="30" height="25" rx="3" fill={hovered ? "#CBD5E1" : "#E2E8F0"} stroke={hovered ? "#D32F2F" : "rgba(211,47,47,0.4)"} strokeWidth="1.5"/>
      <path d="M50 38 L68 32 L68 50 L50 46 Z" fill={hovered ? "#94A3B8" : "#CBD5E1"} stroke={hovered ? "rgba(211,47,47,0.6)" : "rgba(156,163,175,0.4)"} strokeWidth="1"/>
      <circle cx="35" cy="42" r="6" fill={hovered ? "rgba(29,78,216,0.2)" : "rgba(29,78,216,0.08)"} stroke={hovered ? "#1D4ED8" : "rgba(29,78,216,0.35)"} strokeWidth="1"/>
      <path d="M20 55 Q18 58 12 60 M20 55 Q18 62 14 65 M20 55 Q22 58 18 62" stroke={hovered ? "rgba(29,78,216,0.6)" : "rgba(29,78,216,0.3)"} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <rect x="28" y="20" width="8" height="10" rx="1" fill={hovered ? "#94A3B8" : "#CBD5E1"} stroke={hovered ? "rgba(211,47,47,0.5)" : "rgba(156,163,175,0.35)"} strokeWidth="1"/>
    </svg>
  ),
  "Acessórios Universais": ({ hovered }) => (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 52, height: 52 }}>
      <circle cx="40" cy="40" r="15" fill={hovered ? "#CBD5E1" : "#E2E8F0"} stroke={hovered ? "#D32F2F" : "rgba(211,47,47,0.4)"} strokeWidth="1.5"/>
      <circle cx="40" cy="40" r="6" fill="none" stroke={hovered ? "#1D4ED8" : "rgba(29,78,216,0.4)"} strokeWidth="2"/>
      {[0,60,120,180,240,300].map((angle, i) => {
        const rad = angle * Math.PI / 180;
        return (
          <rect key={i}
            x={40 + Math.cos(rad) * 15 - 4}
            y={40 + Math.sin(rad) * 15 - 4}
            width="8" height="8" rx="1"
            fill={hovered ? "rgba(29,78,216,0.2)" : "rgba(29,78,216,0.1)"}
            stroke={hovered ? "#1D4ED8" : "rgba(29,78,216,0.35)"}
            strokeWidth="1"
            transform={`rotate(${angle} ${40 + Math.cos(rad) * 15} ${40 + Math.sin(rad) * 15})`}
          />
        );
      })}
    </svg>
  ),
};

export default function CategoryCard({ categoria }) {
  const [hovered, setHovered] = React.useState(false);
  const SvgComponent = CategorySVGs[categoria.nome] || CategorySVGs["Acessórios Universais"];

  return (
    <Link
      to={createPageUrl("Catalogo") + "?categoria=" + encodeURIComponent(categoria.nome)}
      className="block p-4 text-center relative overflow-hidden"
      style={{
        background: "#FFFFFF",
        border: hovered ? "1px solid rgba(211,47,47,0.4)" : "1px solid #E2E8F0",
        borderRadius: "4px",
        clipPath: "polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)",
        boxShadow: hovered ? "0 6px 20px rgba(0,0,0,0.1)" : "0 2px 8px rgba(226,232,240,0.8)",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center justify-center mb-2" style={{ height: 52 }}>
        <SvgComponent hovered={hovered} />
      </div>

      <p className="text-xs font-semibold leading-tight" style={{
        color: hovered ? "#D32F2F" : "#6C757D",
        fontFamily: "'Space Grotesk', sans-serif",
        transition: "color 0.3s ease",
      }}>
        {categoria.nome}
      </p>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 h-[2px] transition-all duration-300" style={{
        width: hovered ? "100%" : "0%",
        background: "linear-gradient(90deg, #D32F2F, #1D4ED8)",
      }} />
    </Link>
  );
}
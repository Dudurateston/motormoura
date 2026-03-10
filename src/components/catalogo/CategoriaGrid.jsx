import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

const GERADOR_IMG = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a2232aaedb3f01dfc43e13/f4775cec3_Elemento3DGerador-MOTORMOURA.png";
const MOTOBOMBA_IMG = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a2232aaedb3f01dfc43e13/c6bf92883_Elemento3DMotobomba-MOTORMOURA.png";
const MOTOR_GASOLINA_IMG = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a2232aaedb3f01dfc43e13/b323e0274_Elemento3DMotorGasolina-MOTORMOURA.png";
const PECAS_IMG = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a2232aaedb3f01dfc43e13/a0605a984_Elemento3DPeasFlutuantes-MOTORMOURA.png";

// IMPORTANT: These names MUST match exactly the LINHAS used in CatalogoSidebar and Catalogo filter logic
export const CATEGORIES = [
  {
    name: "Motores a Gasolina",
    desc: "Pistões, anéis, carburadores, velas e kits de revisão completos.",
    color: "#D32F2F",
    gradient: "linear-gradient(135deg, #C62828 0%, #E53935 100%)",
    bg: "rgba(211,47,47,0.06)",
    border: "rgba(211,47,47,0.2)",
    image: MOTOR_GASOLINA_IMG,
    badge: "HONDA · TOYAMA · BRANCO",
    imageStyle: { transform: "rotate(-8deg) scale(1.1)", right: "-10px", bottom: "-10px" },
  },
  {
    name: "Motores a Diesel",
    desc: "Peças de alta especificação para motores diesel industriais e agrícolas.",
    color: "#1565C0",
    gradient: "linear-gradient(135deg, #0D47A1 0%, #1976D2 100%)",
    bg: "rgba(21,101,192,0.06)",
    border: "rgba(21,101,192,0.2)",
    image: MOTOR_GASOLINA_IMG,
    badge: "BRANCO · LONCIN · YANMAR",
    imageStyle: { transform: "rotate(-8deg) scale(1.1)", right: "-10px", bottom: "-10px" },
  },
  {
    name: "Motobombas 4 Tempos",
    desc: "Diafragmas, impeladores e vedações para motobombas de irrigação.",
    color: "#0277BD",
    gradient: "linear-gradient(135deg, #01579B 0%, #0288D1 100%)",
    bg: "rgba(2,119,189,0.06)",
    border: "rgba(2,119,189,0.2)",
    image: MOTOBOMBA_IMG,
    badge: "HONDA · TOYAMA · NAGANO",
    imageStyle: { transform: "rotate(5deg) scale(1.15)", right: "-14px", bottom: "-8px" },
  },
  {
    name: "Geradores 4 Tempos",
    desc: "Alternadores, bobinas, escovas e componentes elétricos para geradores.",
    color: "#E65100",
    gradient: "linear-gradient(135deg, #BF360C 0%, #F4511E 100%)",
    bg: "rgba(230,81,0,0.06)",
    border: "rgba(230,81,0,0.2)",
    image: GERADOR_IMG,
    badge: "HONDA · TEKNA · BUFFALO",
    imageStyle: { transform: "rotate(-5deg) scale(1.12)", right: "-8px", bottom: "-12px" },
  },
  {
    name: "Geradores 2 Tempos",
    desc: "Carburadores, pistões e filtros para geradores de 2 tempos.",
    color: "#6A1B9A",
    gradient: "linear-gradient(135deg, #4A148C 0%, #7B1FA2 100%)",
    bg: "rgba(106,27,154,0.06)",
    border: "rgba(106,27,154,0.2)",
    image: GERADOR_IMG,
    badge: "TEKNA · SCHULZ · SAVANA",
    imageStyle: { transform: "rotate(-5deg) scale(1.12)", right: "-8px", bottom: "-12px" },
  },
  {
    name: "Bombas de Pulverização",
    desc: "Diafragmas, válvulas e componentes para pulverizadores agrícolas.",
    color: "#2E7D32",
    gradient: "linear-gradient(135deg, #1B5E20 0%, #388E3C 100%)",
    bg: "rgba(46,125,50,0.06)",
    border: "rgba(46,125,50,0.2)",
    image: PECAS_IMG,
    badge: "KAWASHIMA · MATSUYAMA",
    imageStyle: { transform: "rotate(3deg) scale(1.1)", right: "-16px", bottom: "-8px" },
  },
];

function CategoryCard({ cat, onSelectCategory }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => onSelectCategory(cat.name)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="text-left relative overflow-hidden group"
      style={{
        background: "#FFFFFF",
        border: `1px solid ${hovered ? cat.border : "#E2E8F0"}`,
        borderRadius: "8px",
        boxShadow: hovered
          ? `0 12px 40px rgba(0,0,0,0.12), 0 0 0 1px ${cat.border}`
          : "0 2px 12px rgba(0,0,0,0.06)",
        transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        minHeight: 140,
      }}
    >
      {/* Colored top bar */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: hovered ? 4 : 3,
          background: cat.gradient,
          transition: "height 0.2s ease",
        }}
      />

      {/* Subtle colored bg wash */}
      <div
        className="absolute inset-0"
        style={{
          background: hovered
            ? `radial-gradient(ellipse at 70% 110%, ${cat.bg.replace("0.06", "0.12")} 0%, transparent 65%)`
            : `radial-gradient(ellipse at 70% 110%, ${cat.bg} 0%, transparent 65%)`,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Content */}
      <div className="relative p-5 flex items-end" style={{ minHeight: 140 }}>
        {/* Left text */}
        <div className="flex-1 pr-28 z-10">
          <span
            className="text-xs font-mono-tech px-2 py-0.5 inline-block mb-2"
            style={{
              background: `${cat.bg.replace("0.06", "0.12")}`,
              border: `1px solid ${cat.border}`,
              color: cat.color,
              borderRadius: "2px",
            }}
          >
            {cat.badge}
          </span>
          <h3
            className="font-bold font-mono-tech text-sm leading-tight mb-1"
            style={{ color: "#212529" }}
          >
            {cat.name}
          </h3>
          <p className="text-xs leading-relaxed mb-3 hidden sm:block" style={{ color: "#6C757D", maxWidth: 220 }}>
            {cat.desc}
          </p>
          <div
            className="inline-flex items-center gap-1 text-xs font-mono-tech"
            style={{
              color: cat.color,
              transition: "gap 0.2s ease",
              gap: hovered ? "6px" : "4px",
            }}
          >
            VER PEÇAS
            <ChevronRight
              className="w-3.5 h-3.5"
              style={{
                transform: hovered ? "translateX(3px)" : "translateX(0)",
                transition: "transform 0.2s ease",
              }}
            />
          </div>
        </div>

        {/* 3D Product image — right side, floating */}
        <div
          className="absolute"
          style={{
            width: 140,
            height: 140,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
            ...cat.imageStyle,
            transform: hovered
              ? cat.imageStyle.transform.replace("scale(1.1", "scale(1.18").replace("scale(1.15", "scale(1.22").replace("scale(1.12", "scale(1.19")
              : cat.imageStyle.transform,
            transition: "transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            filter: hovered
              ? `drop-shadow(0 12px 24px rgba(0,0,0,0.22))`
              : `drop-shadow(0 6px 14px rgba(0,0,0,0.14))`,
          }}
        >
          <img
            src={cat.image}
            alt={cat.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              mixBlendMode: "multiply", // removes white/checkerboard background
            }}
            loading="lazy"
          />
        </div>
      </div>
    </button>
  );
}

export default function CategoriaGrid({ onSelectCategory }) {
  return (
    <div>
      <p className="text-xs font-mono-tech mb-5" style={{ color: "#9CA3AF", letterSpacing: "0.1em" }}>
        SELECIONE UMA LINHA DE PRODUTOS PARA VER AS PEÇAS DISPONÍVEIS
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => (
          <CategoryCard key={cat.name} cat={cat} onSelectCategory={onSelectCategory} />
        ))}
      </div>
    </div>
  );
}
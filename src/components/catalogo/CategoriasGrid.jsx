import React from "react";
import { Star, Wrench, Droplets, Zap, Leaf, ChevronRight } from "lucide-react";

const CATEGORIAS = [
  {
    nome: "Peças de Giro Rápido e Reposição",
    desc: "Filtros, carburadores, partidas retráteis, cordões e componentes de alta rotatividade.",
    icon: Star,
    color: "#E53935",
    badge: "MAIS VENDIDOS",
  },
  {
    nome: "Motores Estacionários",
    desc: "Peças para motores a gasolina e diesel Honda GX, GXR, Toyama e compatíveis.",
    icon: Wrench,
    color: "#1D4ED8",
    badge: "HONDA · TOYAMA",
  },
  {
    nome: "Motobombas",
    desc: "Componentes para motobombas WB, WBC, WHC e modelos similares.",
    icon: Droplets,
    color: "#4ADE80",
    badge: "HONDA",
  },
  {
    nome: "Geradores de Energia",
    desc: "Peças para geradores convencionais 2T/4T e linha inverter de energia.",
    icon: Zap,
    color: "#F59E0B",
    badge: "HONDA · TOYAMA",
  },
  {
    nome: "Equipamentos Agrícolas e Jardinagem",
    desc: "Roçadeiras, cortadores de grama e pulverizadores agrícolas Honda.",
    icon: Leaf,
    color: "#22C55E",
    badge: "HONDA",
  },
];

export default function CategoriasGrid({ onSelectCategoria }) {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-8 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #E53935)" }} />
          <span className="text-xs font-mono-tech" style={{ color: "#E53935", letterSpacing: "0.2em" }}>
            CATÁLOGO TÉCNICO B2B · MOTORMOURA
          </span>
          <div className="w-8 h-[2px]" style={{ background: "linear-gradient(90deg, #E53935, transparent)" }} />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold font-mono-tech mb-3" style={{ color: "#F3F4F6" }}>
          Selecione uma Linha de Produto
        </h1>
        <p style={{ color: "#6B7280", fontSize: "15px" }}>
          +1.000 peças técnicas organizadas por linha de equipamento.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIAS.map((cat) => (
          <button
            key={cat.nome}
            onClick={() => onSelectCategoria(cat.nome)}
            className="text-left p-6 relative overflow-hidden group mm-btn-tactile"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "4px",
            }}
          >
            {/* Top accent */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: `linear-gradient(90deg, ${cat.color}, transparent)` }}
            />
            {/* Corner marks */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t border-l opacity-25" style={{ borderColor: cat.color }} />
            <div className="absolute top-2 right-2 w-3 h-3 border-t border-r opacity-25" style={{ borderColor: cat.color }} />

            {/* Icon + badge */}
            <div className="flex items-start justify-between mb-5">
              <div
                className="w-11 h-11 flex items-center justify-center flex-shrink-0"
                style={{
                  background: `${cat.color}18`,
                  border: `1px solid ${cat.color}40`,
                  borderRadius: "2px",
                }}
              >
                <cat.icon className="w-5 h-5" style={{ color: cat.color }} />
              </div>
              <span
                className="font-mono-tech px-2 py-0.5"
                style={{
                  background: `${cat.color}15`,
                  border: `1px solid ${cat.color}30`,
                  color: cat.color,
                  borderRadius: "2px",
                  letterSpacing: "0.08em",
                  fontSize: "10px",
                }}
              >
                {cat.badge}
              </span>
            </div>

            <h3
              className="font-bold font-mono-tech text-sm mb-2 transition-colors group-hover:text-white"
              style={{ color: "#E5E7EB" }}
            >
              {cat.nome}
            </h3>
            <p style={{ color: "#6B7280", fontSize: "13px", lineHeight: 1.65 }}>
              {cat.desc}
            </p>

            <div
              className="flex items-center gap-1.5 mt-5 text-xs font-mono-tech font-bold"
              style={{ color: cat.color }}
            >
              VER PRODUTOS
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>
        ))}
      </div>

      {/* WhatsApp helper */}
      <div className="mt-10 text-center">
        <a
          href="https://api.whatsapp.com/send?phone=5585986894081&text=Olá%2C%20preciso%20de%20ajuda%20para%20encontrar%20uma%20peça!"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-mono-tech px-4 h-9"
          style={{
            background: "rgba(22,163,74,0.08)",
            border: "1px solid rgba(22,163,74,0.3)",
            color: "#4ADE80",
            borderRadius: "2px",
          }}
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.855L0 24l6.335-1.51A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.895 0-3.67-.524-5.195-1.43l-.372-.22-3.763.897.944-3.658-.242-.376A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
          </svg>
          NÃO ENCONTROU A PEÇA? FALAR COM ESPECIALISTA
        </a>
      </div>
    </div>
  );
}
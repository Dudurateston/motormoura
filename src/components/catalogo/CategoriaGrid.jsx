import React from "react";
import { Zap, Cpu, Droplets, Activity, Leaf, ChevronRight } from "lucide-react";

export const CATEGORIES = [
  {
    name: "Peças de Giro Rápido e Reposição",
    icon: Zap,
    desc: "Filtros, carburadores, partidas retráteis, cordões e acessórios de alta rotatividade.",
    color: "#D32F2F",
    badge: "PRIORIDADE 1",
  },
  {
    name: "Motores Estacionários",
    icon: Cpu,
    desc: "Motores a gasolina e diesel para uso industrial, agrícola e residencial.",
    color: "#1D4ED8",
    badge: "HONDA · TOYAMA · BRANCO",
  },
  {
    name: "Motobombas",
    icon: Droplets,
    desc: "Bombas d'água 4 tempos para irrigação, abastecimento e construção civil.",
    color: "#0284C7",
    badge: "HONDA · TOYAMA",
  },
  {
    name: "Geradores de Energia",
    icon: Activity,
    desc: "Geradores portáteis e linha Inverter para uso residencial e profissional.",
    color: "#B45309",
    badge: "HONDA · TEKNA · BUFFALO",
  },
  {
    name: "Equipamentos Agrícolas e Jardinagem",
    icon: Leaf,
    desc: "Roçadeiras, cortadoras de relva e pulverizadores para uso agrícola.",
    color: "#15803D",
    badge: "HONDA · HUSQVARNA",
  },
];

export default function CategoriaGrid({ onSelectCategory }) {
  return (
    <div>
      <p className="text-xs font-mono-tech mb-6" style={{ color: "#6C757D", letterSpacing: "0.1em" }}>
        SELECIONE UMA CATEGORIA PARA VER OS PRODUTOS DISPONÍVEIS
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className="text-left p-6 relative overflow-hidden group mm-btn-tactile"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "4px",
                boxShadow: "0 2px 8px rgba(226,232,240,0.8)",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${cat.color}60`; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(226,232,240,0.8)"; }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, transparent, ${cat.color}, transparent)` }}
              />
              <div className="w-12 h-12 flex items-center justify-center mb-4" style={{
                background: `${cat.color}12`,
                border: `1px solid ${cat.color}30`,
                borderRadius: "2px",
              }}>
                <Icon className="w-6 h-6" style={{ color: cat.color }} />
              </div>
              <h3 className="font-bold font-mono-tech text-sm mb-2 pr-4" style={{ color: "#212529", lineHeight: 1.4 }}>
                {cat.name}
              </h3>
              <p className="text-xs mb-4" style={{ color: "#6C757D", lineHeight: 1.65 }}>
                {cat.desc}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-tech px-2 py-0.5" style={{
                  background: `${cat.color}10`,
                  border: `1px solid ${cat.color}30`,
                  color: cat.color,
                  borderRadius: "2px",
                }}>
                  {cat.badge}
                </span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: cat.color }} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import {
  Flame, Cpu, Zap, Droplets, Leaf, Filter,
  RotateCw, Fuel, Settings, Bolt, Activity,
  Sprout, Layers, Waves, Wrench, Hammer, Battery, Scissors,
  Package, Star
} from "lucide-react";

const ICON_MAP = {
  Flame, Cpu, Zap, Droplets, Leaf, Filter,
  RotateCw, Fuel, Settings, Bolt, Activity,
  Sprout, Layers, Waves, Wrench, Hammer, Battery, Scissors,
  Package, Star
};

const CONSTRUCAO_CATS = [
  "Compactação de Solo", "Vibradores de Concreto", "Ferramentas Elétricas",
  "Marteletes e Demolidores", "Ferramentas a Bateria", "Cortadora de Piso"
];

const CAT_BRAND = {
  "Compactação de Solo": { name: "Vibromak", color: "#1d4ed8", bg: "rgba(29,78,216,0.08)" },
  "Vibradores de Concreto": { name: "Vibromak", color: "#1d4ed8", bg: "rgba(29,78,216,0.08)" },
  "Ferramentas Elétricas": { name: "Makita", color: "#0284c7", bg: "rgba(14,165,233,0.08)" },
  "Marteletes e Demolidores": { name: "Makita", color: "#0284c7", bg: "rgba(14,165,233,0.08)" },
  "Ferramentas a Bateria": { name: "Makita", color: "#0284c7", bg: "rgba(14,165,233,0.08)" },
  "Cortadora de Piso": { name: "Vibromak", color: "#1d4ed8", bg: "rgba(29,78,216,0.08)" },
};

const CAT_COLORS = {
  "Peças de Alto Giro": "#D32F2F",
  "Motores Estacionários": "#1D4ED8",
  "Geradores": "#B45309",
  "Motobombas": "#0369A1",
  "Equipamentos Agrícolas": "#15803D",
  "Filtros e Manutenção": "#7C3AED",
  "Sistema de Partida": "#0891B2",
  "Sistema de Alimentação": "#C2410C",
  "Ignição e Elétrica": "#D97706",
  "Mecânica Interna": "#475569",
  "Compactação de Solo": "#1d4ed8",
  "Vibradores de Concreto": "#1d4ed8",
  "Ferramentas Elétricas": "#0284c7",
  "Marteletes e Demolidores": "#0284c7",
  "Ferramentas a Bateria": "#0284c7",
  "Cortadora de Piso": "#1d4ed8",
};

export default function HomeCategoryCarousel({ segment }) {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Categorias.list().then(cats => {
      setCategorias(cats.filter(c => c.ativa !== false));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = categorias.filter(cat => {
    const isConstrucao = CONSTRUCAO_CATS.includes(cat.nome);
    if (segment === 'construcao') return isConstrucao;
    return !isConstrucao;
  });

  const segAccent = segment === 'construcao' ? '#1d4ed8' : '#D32F2F';

  const onMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };
  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = scrollLeft.current - (x - startX.current);
  };
  const onMouseUp = () => { isDragging.current = false; };

  const handleClick = (cat) => {
    if (isDragging.current) return;
    const params = new URLSearchParams();
    params.set("categoria", cat.nome);
    navigate(createPageUrl("Catalogo") + "?" + params.toString());
  };

  if (loading) {
    return (
      <section style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0" }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 11, color: '#9CA3AF' }}>Carregando categorias...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0" }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <div style={{ width: 14, height: 2, background: segAccent, transition: 'background 0.4s' }} />
          <span className="text-xs font-mono-tech tracking-widest" style={{ color: segAccent, transition: 'color 0.4s' }}>
            NAVEGUE POR CATEGORIA
          </span>
          {filtered.length === 0 && (
            <span style={{ fontSize: 10, color: '#9CA3AF', marginLeft: 8 }}>
              — categorias de {segment === 'construcao' ? 'construção civil' : 'motores'} em breve
            </span>
          )}
        </div>

        {filtered.length > 0 && (
          <div
            ref={scrollRef}
            className="pt-2 pb-2 flex gap-5 overflow-x-auto cursor-grab active:cursor-grabbing select-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none", paddingLeft: '4px', paddingRight: '4px' }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {filtered.map((cat) => {
              const IconComp = ICON_MAP[cat.icone] || Package;
              const color = CAT_COLORS[cat.nome] || segAccent;
              const brand = CAT_BRAND[cat.nome];
              const isDestaque = cat.nome === "Peças de Alto Giro";

              return (
                <button
                  key={cat.id}
                  onClick={() => handleClick(cat)}
                  className="flex flex-col items-center gap-2 flex-shrink-0 group"
                  style={{ minWidth: 88 }}
                >
                  <div
                    className="w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                    style={{
                      background: isDestaque ? `${color}12` : "#F8F9FA",
                      border: `2px solid ${isDestaque ? color + '30' : '#E2E8F0'}`,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = `${color}12`;
                      e.currentTarget.style.border = `2px solid ${color}40`;
                      e.currentTarget.style.boxShadow = `0 6px 20px ${color}20`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = isDestaque ? `${color}12` : "#F8F9FA";
                      e.currentTarget.style.border = `2px solid ${isDestaque ? color + '30' : '#E2E8F0'}`;
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                    }}
                  >
                    <IconComp style={{ width: 26, height: 26, color: color }} />
                  </div>
                  <span className="text-xs text-center font-mono-tech" style={{ color: "#374151", fontSize: 10, letterSpacing: "0.04em", maxWidth: 88, lineHeight: 1.3 }}>
                    {cat.nome}
                  </span>
                  {brand && (
                    <span style={{ fontSize: 7, fontWeight: 700, color: brand.color, background: brand.bg, padding: '1px 5px', borderRadius: 1, letterSpacing: '.05em', marginTop: -4 }}>
                      {brand.name}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
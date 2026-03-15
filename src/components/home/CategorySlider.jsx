import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronLeft, ChevronRight, Wrench, Zap, Droplets, Tractor, RefreshCw, Filter, Power, Gauge, Cog, Cpu } from "lucide-react";

const CATEGORIES = [
  { name: "Motores Estacionários", icon: Cog, color: "#E53935" },
  { name: "Geradores", icon: Zap, color: "#1D4ED8" },
  { name: "Motobombas", icon: Droplets, color: "#16A34A" },
  { name: "Agrícola", icon: Tractor, color: "#B45309" },
  { name: "Peças de Alto Giro", icon: RefreshCw, color: "#D32F2F" },
  { name: "Filtros e Manutenção", icon: Filter, color: "#0891B2" },
  { name: "Sistema de Partida", icon: Power, color: "#9333EA" },
  { name: "Sistema de Alimentação", icon: Gauge, color: "#EA580C" },
  { name: "Ignição e Elétrica", icon: Zap, color: "#0284C7" },
  { name: "Mecânica Interna", icon: Cpu, color: "#DC2626" }
];

export default function CategorySlider() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
    setTimeout(checkScroll, 300);
  };

  return (
    <section className="py-16 px-4 relative" style={{ background: "#F8F9FA" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold font-mono-tech mb-2" style={{ color: "#212529" }}>
            Navegue por Categorias
          </h2>
          <p style={{ color: "#6C757D", fontSize: "16px" }}>
            Encontre rapidamente as peças que você precisa
          </p>
        </div>

        {/* Slider container */}
        <div className="relative">
          {/* Left arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center mm-btn-tactile"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "50%",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                color: "#212529"
              }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Scroll area */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-4 overflow-x-auto pb-2"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch"
            }}
          >
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to={`${createPageUrl("Catalogo")}?categoria=${encodeURIComponent(cat.name)}`}
                  className="flex-shrink-0 group"
                >
                  <div
                    className="flex flex-col items-center justify-center gap-3 transition-all duration-300"
                    style={{
                      width: 140,
                      height: 140,
                      background: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
                      e.currentTarget.style.borderColor = cat.color + "40";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                      e.currentTarget.style.borderColor = "#E2E8F0";
                    }}
                  >
                    {/* Icon container */}
                    <div
                      className="flex items-center justify-center transition-all duration-300"
                      style={{
                        width: 56,
                        height: 56,
                        background: `${cat.color}10`,
                        border: `1px solid ${cat.color}20`,
                        borderRadius: "50%"
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: cat.color }} />
                    </div>
                    
                    {/* Category name */}
                    <span
                      className="text-xs font-mono-tech text-center px-2 leading-tight"
                      style={{ color: "#212529", maxWidth: "100%" }}
                    >
                      {cat.name}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Right arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center mm-btn-tactile"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "50%",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                color: "#212529"
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Ver todas */}
        <div className="text-center mt-6">
          <Link to={createPageUrl("Catalogo")}>
            <button
              className="text-sm font-mono-tech mm-btn-tactile px-5 h-9"
              style={{
                background: "transparent",
                border: "1px solid #E2E8F0",
                color: "#6C757D",
                borderRadius: "2px"
              }}
            >
              VER TODAS AS CATEGORIAS →
            </button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
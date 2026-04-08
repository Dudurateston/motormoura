import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Flame, Cpu, Zap, Droplets, Leaf, Filter,
  RotateCw, Fuel, Settings, Bolt } from
"lucide-react";

const CATS = [
{ nome: "Peças de Alto Giro", icon: Flame, color: "#D32F2F", destaque: true, q: "filtro carburador vela partida" },
{ nome: "Motores Estacionários", icon: Cpu, color: "#1D4ED8", cat: "Motores a Gasolina" },
{ nome: "Geradores", icon: Zap, color: "#B45309", cat: "Geradores 4 Tempos" },
{ nome: "Motobombas", icon: Droplets, color: "#0369A1", cat: "Motobombas 4 Tempos" },
{ nome: "Agrícola", icon: Leaf, color: "#15803D", cat: "Bombas de Pulverização" },
{ nome: "Filtros e Manutenção", icon: Filter, color: "#7C3AED", q: "filtro" },
{ nome: "Sistema de Partida", icon: RotateCw, color: "#0891B2", q: "partida cordão" },
{ nome: "Sistema de Alimentação", icon: Fuel, color: "#C2410C", q: "carburador" },
{ nome: "Ignição e Elétrica", icon: Zap, color: "#D97706", q: "vela bobina ignição" },
{ nome: "Mecânica Interna", icon: Settings, color: "#475569", q: "pistão anel biela" }];


export default function HomeCategoryCarousel() {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

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
  const onMouseUp = () => {isDragging.current = false;};

  const handleClick = (cat) => {
    if (isDragging.current) return;
    const params = new URLSearchParams();
    if (cat.cat) params.set("categoria", cat.cat);
    if (cat.q) params.set("q", cat.q);
    navigate(createPageUrl("Catalogo") + "?" + params.toString());
  };

  return (
    <section style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0" }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-4 h-[2px]" style={{ background: "#D32F2F" }} />
          <span className="text-xs font-mono-tech tracking-widest" style={{ color: "#D32F2F" }}>
            NAVEGUE POR CATEGORIA
          </span>
        </div>
        <div
          ref={scrollRef} className="mx-1 pt-4 pr-4 pb-2 flex gap-5 overflow-x-auto cursor-grab active:cursor-grabbing select-none"

          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}>
          
          {CATS.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.nome}
                onClick={() => handleClick(cat)}
                className="flex flex-col items-center gap-2 flex-shrink-0 group"
                style={{ minWidth: 88 }}>
                
                <div
                  className="w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                  style={{
                    background: cat.destaque ? `${cat.color}12` : "#F8F9FA",
                    border: cat.destaque ?
                    `2.5px solid ${cat.color}` :
                    "2px solid #E2E8F0",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
                  }}>
                  
                  {cat.destaque ?
                  <span style={{ fontSize: 28 }}>🔥</span> :

                  <Icon className="w-7 h-7" style={{ color: cat.color }} />
                  }
                </div>
                <span
                  className="text-center font-mono-tech leading-tight"
                  style={{ color: "#212529", fontSize: "10px", maxWidth: 80 }}>
                  
                  {cat.nome}
                </span>
              </button>);

          })}
        </div>
      </div>
    </section>);

}
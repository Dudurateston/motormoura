import React, { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";

const CATEGORIAS = [
  { nome: "Todos os Produtos", count: null },
  { nome: "Outras Peças", count: 270 },
  { nome: "Válvulas", count: 194 },
  { nome: "Motor / Pistão", count: 128 },
  { nome: "Estrutura / Tampas", count: 109 },
  { nome: "Kits / Juntas", count: 71 },
  { nome: "Elétrico / Ignição", count: 60 },
  { nome: "Carburação", count: 60 },
  { nome: "Bombas / Diafragmas", count: 60 },
  { nome: "Filtros", count: 55 },
  { nome: "Vedações", count: 14 },
  { nome: "Lubrificação", count: 13 },
  { nome: "Fixação", count: 12 },
  { nome: "Comando / Alavancas", count: 11 },
];

const MARCAS = [
  "Agrimotor","Anova","Argon","Bambozzi","Branco","Buffalo","Chiaperini",
  "Diesel","Gasolina","Honda","Kawashima","Lifan","Loncin","Matsuyama",
  "Motomil","Nagano","Schulz","Tekna","Toyama","Tramontina","Vulcan",
];

export default function CatalogoSidebar({ selectedCategory, setSelectedCategory, selectedMarcas, toggleMarca, priceFilter, setPriceFilter, clearFilters, hasFilters, onClose }) {
  const [marcasOpen, setMarcasOpen] = useState(true);

  return (
    <div className="flex flex-col gap-0" style={{ fontFamily: "'Space Mono', monospace" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <span className="text-xs font-mono-tech" style={{ color: "#FB923C", letterSpacing: "0.15em" }}>FILTROS</span>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-mono-tech px-2 py-1 flex items-center gap-1 transition-colors hover:text-red-400"
              style={{ color: "#4B5563", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "2px" }}
            >
              <X className="w-3 h-3" /> LIMPAR
            </button>
          )}
          {onClose && (
            <button onClick={onClose} style={{ color: "#4B5563" }}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── CATEGORIAS ────────────────── */}
      <div className="mb-6">
        <p className="text-xs font-mono-tech mb-3" style={{ color: "#FB923C", letterSpacing: "0.15em", opacity: 0.8 }}>CATEGORIAS</p>
        <ul className="space-y-0.5">
          {CATEGORIAS.map(({ nome, count }) => {
            const active = nome === "Todos os Produtos" ? !selectedCategory : selectedCategory === nome;
            return (
              <li key={nome}>
                <button
                  onClick={() => setSelectedCategory(nome === "Todos os Produtos" ? "" : nome)}
                  className="w-full text-left px-2.5 py-1.5 flex items-center justify-between text-xs transition-all"
                  style={{
                    background: active ? "rgba(251,146,60,0.1)" : "transparent",
                    border: active ? "1px solid rgba(251,146,60,0.3)" : "1px solid transparent",
                    color: active ? "#FB923C" : "#6B7280",
                    borderRadius: "2px",
                  }}
                >
                  <span className="truncate pr-1 font-mono-tech">{nome}</span>
                  {count !== null && (
                    <span className="flex-shrink-0 text-xs" style={{ color: active ? "#FB923C80" : "#374151" }}>{count}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ── PREÇO ─────────────────────── */}
      <div className="mb-6 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-xs font-mono-tech mb-3" style={{ color: "#4ADE80", letterSpacing: "0.15em", opacity: 0.8 }}>DISPONIBILIDADE DE PREÇO</p>
        <ul className="space-y-1">
          {[
            { val: "all", label: "Todos" },
            { val: "sob_consulta", label: "Sob Consulta" },
            { val: "com_preco", label: "Com Preço Definido" },
          ].map((opt) => (
            <li key={opt.val}>
              <label className="flex items-center gap-2.5 cursor-pointer py-1 px-1">
                <div
                  className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    background: priceFilter === opt.val ? "#4ADE80" : "rgba(255,255,255,0.04)",
                    border: priceFilter === opt.val ? "1px solid #4ADE80" : "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "50%",
                  }}
                  onClick={() => setPriceFilter(opt.val)}
                >
                  {priceFilter === opt.val && <div className="w-1.5 h-1.5 rounded-full bg-[#0A0A0C]" />}
                </div>
                <span
                  className="text-xs font-mono-tech transition-colors"
                  style={{ color: priceFilter === opt.val ? "#4ADE80" : "#6B7280" }}
                  onClick={() => setPriceFilter(opt.val)}
                >
                  {opt.label}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* ── MARCAS ────────────────────── */}
      <div className="pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          className="w-full flex items-center justify-between mb-3"
          onClick={() => setMarcasOpen((v) => !v)}
        >
          <p className="text-xs font-mono-tech" style={{ color: "#1D4ED8", letterSpacing: "0.15em", opacity: 0.9 }}>MARCAS COMPATÍVEIS</p>
          {marcasOpen ? <ChevronUp className="w-3 h-3" style={{ color: "#1D4ED8" }} /> : <ChevronDown className="w-3 h-3" style={{ color: "#1D4ED8" }} />}
        </button>
        {marcasOpen && (
          <ul className="space-y-0.5 max-h-56 overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#1D4ED830 transparent" }}>
            {MARCAS.map((marca) => {
              const active = selectedMarcas.includes(marca);
              return (
                <li key={marca}>
                  <label className="flex items-center gap-2.5 cursor-pointer py-1 px-1">
                    <div
                      className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0 transition-all"
                      style={{
                        background: active ? "#1D4ED8" : "rgba(255,255,255,0.04)",
                        border: active ? "1px solid #1D4ED8" : "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "2px",
                      }}
                      onClick={() => toggleMarca(marca)}
                    >
                      {active && (
                        <svg viewBox="0 0 10 8" fill="none" style={{ width: 9, height: 9 }}>
                          <path d="M1 4L3.5 6.5L9 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span
                      className="text-xs font-mono-tech transition-colors"
                      style={{ color: active ? "#93C5FD" : "#6B7280" }}
                      onClick={() => toggleMarca(marca)}
                    >
                      {marca}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
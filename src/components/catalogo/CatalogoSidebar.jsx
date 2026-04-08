import React, { useState, useEffect } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { base44 } from "@/api/base44Client";

function SectionHeader({ label, color, open, onToggle }) {
  return (
    <button
      className="w-full flex items-center justify-between mb-3 pt-5"
      style={{ borderTop: "1px solid #E2E8F0" }}
      onClick={onToggle}
    >
      <p className="text-xs font-mono-tech" style={{ color, letterSpacing: "0.15em" }}>{label}</p>
      {open
        ? <ChevronUp className="w-3 h-3 flex-shrink-0" style={{ color }} />
        : <ChevronDown className="w-3 h-3 flex-shrink-0" style={{ color }} />}
    </button>
  );
}

export default function CatalogoSidebar({
  selectedLinha, setSelectedLinha,
  selectedMarcas, toggleMarca,
  priceFilter, setPriceFilter,
  clearFilters, hasFilters, onClose,
}) {
  const [linhasOpen, setLinhasOpen] = useState(true);
  const [marcasOpen, setMarcasOpen] = useState(false);
  const [marcasDB, setMarcasDB] = useState([]);
  const [categoriasDB, setCategoriasDB] = useState([]);

  useEffect(() => {
    base44.entities.MarcasCompativeis.list().then(list => {
      setMarcasDB((list || []).filter(m => m.ativa !== false).map(m => m.nome).sort());
    });
    base44.entities.Categorias.list().then(list => {
      setCategoriasDB((list || []).filter(c => c.ativa !== false).sort((a, b) => a.nome.localeCompare(b.nome)));
    });
  }, []);

  return (
    <div className="flex flex-col" style={{ fontFamily: "'Space Mono', monospace" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-4" style={{ borderBottom: "1px solid #E2E8F0" }}>
        <span className="text-xs font-mono-tech" style={{ color: "#D32F2F", letterSpacing: "0.15em" }}>FILTROS</span>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-mono-tech px-2 py-1 flex items-center gap-1 transition-colors hover:text-red-600"
              style={{ color: "#6C757D", background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px" }}
            >
              <X className="w-3 h-3" /> LIMPAR
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="p-1" style={{ color: "#6C757D" }}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* LINHA DE EQUIPAMENTO */}
      <SectionHeader label="LINHA DE EQUIPAMENTO" color="#D32F2F" open={linhasOpen} onToggle={() => setLinhasOpen(v => !v)} />
      {linhasOpen && (
        <ul className="space-y-0.5 mb-2">
          <li>
            <button onClick={() => setSelectedLinha("")}
              className="w-full text-left px-2.5 py-1.5 flex items-center text-xs transition-all"
              style={{
                background: !selectedLinha ? "rgba(211,47,47,0.08)" : "transparent",
                border: !selectedLinha ? "1px solid rgba(211,47,47,0.3)" : "1px solid transparent",
                color: !selectedLinha ? "#D32F2F" : "#6C757D", borderRadius: "2px",
              }}>
              <span className="font-mono-tech">Todas as Categorias</span>
            </button>
          </li>
          {categoriasDB.map((cat) => (
            <li key={cat.id}>
              <button onClick={() => setSelectedLinha(cat.nome)}
                className="w-full text-left px-2.5 py-1.5 flex items-center text-xs transition-all"
                style={{
                  background: selectedLinha === cat.nome ? "rgba(211,47,47,0.08)" : "transparent",
                  border: selectedLinha === cat.nome ? "1px solid rgba(211,47,47,0.3)" : "1px solid transparent",
                  color: selectedLinha === cat.nome ? "#D32F2F" : "#6C757D", borderRadius: "2px",
                }}>
                <span className="font-mono-tech truncate">{cat.nome}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* PREÇO */}
      <SectionHeader label="DISPONIBILIDADE DE PREÇO" color="#16A34A" open={true} onToggle={() => {}} />
      <ul className="space-y-1 mb-2">
        {[
          { val: "all", label: "Todos" },
          { val: "sob_consulta", label: "Sob Consulta" },
          { val: "com_preco", label: "Com Preço Definido" },
        ].map((opt) => (
          <li key={opt.val}>
            <label className="flex items-center gap-2.5 cursor-pointer py-1 px-1" onClick={() => setPriceFilter(opt.val)}>
              <div className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0 transition-all" style={{
                background: priceFilter === opt.val ? "#16A34A" : "#F8F9FA",
                border: priceFilter === opt.val ? "1px solid #16A34A" : "1px solid #E2E8F0",
                borderRadius: "50%",
              }}>
                {priceFilter === opt.val && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <span className="text-xs font-mono-tech" style={{ color: priceFilter === opt.val ? "#15803D" : "#6C757D" }}>
                {opt.label}
              </span>
            </label>
          </li>
        ))}
      </ul>

      {/* MARCAS */}
      <SectionHeader label="MARCAS COMPATÍVEIS" color="#6C757D" open={marcasOpen} onToggle={() => setMarcasOpen(v => !v)} />
      {marcasOpen && (
        <ul className="space-y-0.5 max-h-52 overflow-y-auto pr-1 mb-2" style={{ scrollbarWidth: "thin", scrollbarColor: "#E2E8F0 transparent" }}>
          {marcasDB.map((marca) => {
            const active = selectedMarcas.includes(marca);
            return (
              <li key={marca}>
                <label className="flex items-center gap-2.5 cursor-pointer py-1 px-1" onClick={() => toggleMarca(marca)}>
                  <div className="w-3.5 h-3.5 flex items-center justify-center flex-shrink-0 transition-all" style={{
                    background: active ? "#1D4ED8" : "#F8F9FA",
                    border: active ? "1px solid #1D4ED8" : "1px solid #E2E8F0",
                    borderRadius: "2px",
                  }}>
                    {active && (
                      <svg viewBox="0 0 10 8" fill="none" style={{ width: 9, height: 9 }}>
                        <path d="M1 4L3.5 6.5L9 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs font-mono-tech" style={{ color: active ? "#1D4ED8" : "#6C757D" }}>{marca}</span>
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
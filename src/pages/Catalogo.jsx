import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Search, X, SlidersHorizontal, ChevronRight } from "lucide-react";
import ProdutoCard from "../components/catalogo/ProdutoCard";

function addToCart(produto, quantidade) {
  const stored = localStorage.getItem("motormoura_cart");
  const cart = stored ? JSON.parse(stored) : [];
  const idx = cart.findIndex((i) => i.sku_codigo === produto.sku_codigo);
  if (idx >= 0) cart[idx].quantidade += quantidade;
  else cart.push({ sku_codigo: produto.sku_codigo, nome_peca: produto.nome_peca, quantidade });
  localStorage.setItem("motormoura_cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
}

export default function Catalogo() {
  const [produtos, setProdutos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const [selectedCategoria, setSelectedCategoria] = useState(urlParams.get("categoria") || "");
  const [selectedMarcas, setSelectedMarcas] = useState([]);
  const [searchText, setSearchText] = useState(urlParams.get("q") || "");

  useEffect(() => {
    Promise.all([
      base44.entities.Produtos.list("-created_date", 200),
      base44.entities.MarcasCompativeis.list("nome"),
      base44.entities.Categorias.list("nome"),
    ]).then(([p, m, c]) => {
      setProdutos(p);
      setMarcas(m);
      setCategorias(c);
      setLoading(false);
    });
  }, []);

  const toggleMarca = (nome) => {
    setSelectedMarcas(prev =>
      prev.includes(nome) ? prev.filter(m => m !== nome) : [...prev, nome]
    );
  };

  const filtered = produtos.filter((p) => {
    if (p.ativo === false) return false;
    const catMatch = !selectedCategoria || selectedCategoria === "all" || p.relacionamento_categoria === selectedCategoria;
    const marcaMatch = selectedMarcas.length === 0 || selectedMarcas.includes(p.relacionamento_marca);
    const textMatch = !searchText ||
      p.sku_codigo.toLowerCase().includes(searchText.toLowerCase()) ||
      p.nome_peca.toLowerCase().includes(searchText.toLowerCase());
    return catMatch && marcaMatch && textMatch;
  });

  const hasFilters = selectedCategoria || selectedMarcas.length > 0 || searchText;
  const clearFilters = () => { setSelectedCategoria(""); setSelectedMarcas([]); setSearchText(""); };

  const SidebarContent = () => (
    <div className="flex flex-col gap-6">
      {/* Categories */}
      <div>
        <h3
          className="text-xs font-mono-tech mb-3 pb-2"
          style={{
            color: "#FB923C",
            letterSpacing: "0.15em",
            borderBottom: "1px solid rgba(251,146,60,0.2)",
          }}
        >
          CATEGORIAS
        </h3>
        <ul className="space-y-0.5">
          <li>
            <button
              onClick={() => setSelectedCategoria("")}
              className="w-full text-left px-3 py-2 text-sm transition-all flex items-center justify-between"
              style={{
                background: !selectedCategoria ? "rgba(251,146,60,0.1)" : "transparent",
                border: !selectedCategoria ? "1px solid rgba(251,146,60,0.3)" : "1px solid transparent",
                color: !selectedCategoria ? "#FB923C" : "#6B7280",
                borderRadius: "2px",
              }}
            >
              <span>Todos os Produtos</span>
              {!selectedCategoria && <ChevronRight className="w-3 h-3" />}
            </button>
          </li>
          {categorias.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => setSelectedCategoria(cat.nome)}
                className="w-full text-left px-3 py-2 text-sm transition-all flex items-center justify-between"
                style={{
                  background: selectedCategoria === cat.nome ? "rgba(251,146,60,0.1)" : "transparent",
                  border: selectedCategoria === cat.nome ? "1px solid rgba(251,146,60,0.3)" : "1px solid transparent",
                  color: selectedCategoria === cat.nome ? "#FB923C" : "#6B7280",
                  borderRadius: "2px",
                }}
              >
                <span>{cat.nome}</span>
                {selectedCategoria === cat.nome && <ChevronRight className="w-3 h-3" />}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Brands */}
      <div>
        <h3
          className="text-xs font-mono-tech mb-3 pb-2"
          style={{
            color: "#1D4ED8",
            letterSpacing: "0.15em",
            borderBottom: "1px solid rgba(29,78,216,0.2)",
          }}
        >
          MARCAS COMPATÍVEIS
        </h3>
        <ul className="space-y-1">
          {marcas.map((marca) => (
            <li key={marca.id}>
              <label className="flex items-center gap-2.5 cursor-pointer group py-1">
                <div
                  className="w-4 h-4 flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    background: selectedMarcas.includes(marca.nome) ? "#1D4ED8" : "rgba(255,255,255,0.04)",
                    border: selectedMarcas.includes(marca.nome) ? "1px solid #1D4ED8" : "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "2px",
                  }}
                  onClick={() => toggleMarca(marca.nome)}
                >
                  {selectedMarcas.includes(marca.nome) && (
                    <svg viewBox="0 0 10 8" fill="none" style={{ width: 10, height: 8 }}>
                      <path d="M1 4L3.5 6.5L9 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span
                  className="text-sm transition-colors"
                  style={{ color: selectedMarcas.includes(marca.nome) ? "#93C5FD" : "#6B7280" }}
                  onClick={() => toggleMarca(marca.nome)}
                >
                  {marca.nome}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1.5 text-xs font-mono-tech mm-btn-tactile px-3 py-2"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#4B5563",
            borderRadius: "2px",
          }}
        >
          <X className="w-3 h-3" /> LIMPAR FILTROS
        </button>
      )}
    </div>
  );

  return (
    <div className="mm-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-[2px]" style={{ background: "#FB923C" }} />
            <span className="text-xs font-mono-tech" style={{ color: "#FB923C", letterSpacing: "0.15em" }}>
              CATÁLOGO TÉCNICO B2B
            </span>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold font-mono-tech" style={{ color: "#F3F4F6" }}>
                {selectedCategoria || "Todas as Peças de Reposição"}
              </h1>
              <p className="text-sm font-mono-tech mt-1" style={{ color: "#4B5563" }}>
                {loading ? "CARREGANDO..." : `${filtered.length} PRODUTO(S) ENCONTRADO(S)`}
              </p>
            </div>

            {/* Search bar */}
            <div className="relative flex-1 max-w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#1D4ED8" }} />
              <input
                placeholder="Buscar SKU ou nome..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full h-10 pl-9 pr-3 text-sm font-mono-tech focus:outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(29,78,216,0.25)",
                  borderRadius: "2px",
                  color: "#F3F4F6",
                }}
              />
            </div>

            {/* Mobile filter toggle */}
            <button
              className="md:hidden flex items-center gap-1.5 px-3 h-10 text-sm font-mono-tech mm-btn-tactile"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#6B7280",
                borderRadius: "2px",
              }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> FILTROS
            </button>
          </div>

          {/* Active filter pills */}
          {hasFilters && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {selectedCategoria && (
                <span
                  className="flex items-center gap-1 text-xs px-2 py-0.5 font-mono-tech"
                  style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.3)", color: "#FB923C", borderRadius: "2px" }}
                >
                  {selectedCategoria}
                  <button onClick={() => setSelectedCategoria("")}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedMarcas.map(m => (
                <span
                  key={m}
                  className="flex items-center gap-1 text-xs px-2 py-0.5 font-mono-tech"
                  style={{ background: "rgba(29,78,216,0.1)", border: "1px solid rgba(29,78,216,0.3)", color: "#60A5FA", borderRadius: "2px" }}
                >
                  {m} <button onClick={() => toggleMarca(m)}><X className="w-3 h-3" /></button>
                </span>
              ))}
              {searchText && (
                <span
                  className="flex items-center gap-1 text-xs px-2 py-0.5 font-mono-tech"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9CA3AF", borderRadius: "2px" }}
                >
                  "{searchText}" <button onClick={() => setSearchText("")}><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-6">
          {/* Sidebar — desktop */}
          <aside
            className="hidden md:block flex-shrink-0 sticky top-20 self-start"
            style={{
              width: 220,
              background: "rgba(27,27,31,0.9)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "4px",
              padding: "20px 16px",
              maxHeight: "calc(100vh - 100px)",
              overflowY: "auto",
            }}
          >
            <SidebarContent />
          </aside>

          {/* Mobile sidebar drawer */}
          {sidebarOpen && (
            <>
              <div
                className="fixed inset-0 z-40 md:hidden"
                style={{ background: "rgba(0,0,0,0.7)" }}
                onClick={() => setSidebarOpen(false)}
              />
              <div
                className="fixed inset-y-0 left-0 z-50 md:hidden p-5 overflow-y-auto"
                style={{
                  width: 280,
                  background: "#17171A",
                  borderRight: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex justify-between items-center mb-5">
                  <span className="text-xs font-mono-tech" style={{ color: "#FB923C", letterSpacing: "0.1em" }}>FILTROS</span>
                  <button onClick={() => setSidebarOpen(false)} style={{ color: "#6B7280" }}><X className="w-4 h-4" /></button>
                </div>
                <SidebarContent />
              </div>
            </>
          )}

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="h-56 animate-pulse" style={{ background: "#27272C", borderRadius: "4px" }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-20" style={{ color: "#6B7280" }} />
                <p className="font-mono-tech text-sm" style={{ color: "#4B5563" }}>NENHUMA PEÇA ENCONTRADA</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 h-9 text-xs font-mono-tech mm-btn-tactile"
                  style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#6B7280", borderRadius: "2px" }}
                >
                  LIMPAR FILTROS
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((produto) => (
                  <ProdutoCard key={produto.id} produto={produto} onAddToCart={addToCart} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
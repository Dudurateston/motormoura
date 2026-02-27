import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProdutoCard from "../components/catalogo/ProdutoCard";

function addToCart(produto, quantidade) {
  const stored = localStorage.getItem("motormoura_cart");
  const cart = stored ? JSON.parse(stored) : [];
  const idx = cart.findIndex((i) => i.sku_codigo === produto.sku_codigo);
  if (idx >= 0) {
    cart[idx].quantidade += quantidade;
  } else {
    cart.push({ sku_codigo: produto.sku_codigo, nome_peca: produto.nome_peca, quantidade });
  }
  localStorage.setItem("motormoura_cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
}

export default function Catalogo() {
  const [produtos, setProdutos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const urlParams = new URLSearchParams(window.location.search);
  const [selectedMarca, setSelectedMarca] = useState(urlParams.get("marca") || "");
  const [selectedCategoria, setSelectedCategoria] = useState(urlParams.get("categoria") || "");
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

  const filtered = produtos.filter((p) => {
    if (p.ativo === false) return false;
    const marcaMatch = !selectedMarca || selectedMarca === "all" || p.relacionamento_marca === selectedMarca;
    const catMatch = !selectedCategoria || selectedCategoria === "all" || p.relacionamento_categoria === selectedCategoria;
    const textMatch = !searchText ||
      p.sku_codigo.toLowerCase().includes(searchText.toLowerCase()) ||
      p.nome_peca.toLowerCase().includes(searchText.toLowerCase());
    return marcaMatch && catMatch && textMatch;
  });

  const clearFilters = () => { setSelectedMarca(""); setSelectedCategoria(""); setSearchText(""); };
  const hasFilters = selectedMarca || selectedCategoria || searchText;

  return (
    <div className="mm-bg min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-[2px]" style={{ background: "#FB923C" }} />
            <span className="text-xs font-mono-tech" style={{ color: "#FB923C", letterSpacing: "0.15em" }}>
              CATÁLOGO TÉCNICO
            </span>
          </div>
          <h1
            className="text-2xl font-bold font-mono-tech"
            style={{ color: "#E5E7EB" }}
          >
            Peças de Reposição
          </h1>
          <p className="text-sm mt-1 font-mono-tech" style={{ color: "#4B5563" }}>
            {loading ? "CARREGANDO..." : `${filtered.length} PRODUTO(S) ENCONTRADO(S)`}
          </p>
        </div>

        {/* Filters */}
        <div
          className="p-4 mb-6"
          style={{
            background: "rgba(27,27,31,0.9)",
            border: "1px solid rgba(29,78,216,0.25)",
            borderRadius: "4px",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal className="w-3.5 h-3.5" style={{ color: "#1D4ED8" }} />
            <span className="text-xs font-mono-tech" style={{ color: "#60A5FA", letterSpacing: "0.1em" }}>
              FILTROS DE PESQUISA
            </span>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="ml-auto flex items-center gap-1 text-xs font-mono-tech"
                style={{ color: "#4B5563" }}
              >
                <X className="w-3 h-3" /> LIMPAR
              </button>
            )}
          </div>

          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#1D4ED8" }} />
              <input
                placeholder="SKU ou nome da peça..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full h-10 pl-9 pr-3 text-sm font-mono-tech focus:outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(29,78,216,0.25)",
                  borderRadius: "2px",
                  color: "#E5E7EB",
                }}
              />
            </div>

            <Select value={selectedMarca || "all"} onValueChange={(v) => setSelectedMarca(v === "all" ? "" : v)}>
              <SelectTrigger
                className="w-44 h-10 text-sm font-mono-tech"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(29,78,216,0.25)",
                  color: selectedMarca ? "#E5E7EB" : "#6B7280",
                  borderRadius: "2px",
                }}
              >
                <SelectValue placeholder="[ MARCA ]" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as marcas</SelectItem>
                {marcas.map((m) => <SelectItem key={m.id} value={m.nome}>{m.nome}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={selectedCategoria || "all"} onValueChange={(v) => setSelectedCategoria(v === "all" ? "" : v)}>
              <SelectTrigger
                className="w-52 h-10 text-sm font-mono-tech"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(29,78,216,0.25)",
                  color: selectedCategoria ? "#E5E7EB" : "#6B7280",
                  borderRadius: "2px",
                }}
              >
                <SelectValue placeholder="[ CATEGORIA ]" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categorias.map((c) => <SelectItem key={c.id} value={c.nome}>{c.nome}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Active pills */}
          {hasFilters && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {selectedMarca && selectedMarca !== "all" && (
                <span
                  className="flex items-center gap-1 text-xs px-2 py-0.5 font-mono-tech"
                  style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.3)", color: "#FB923C", borderRadius: "2px" }}
                >
                  {selectedMarca} <button onClick={() => setSelectedMarca("")}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedCategoria && selectedCategoria !== "all" && (
                <span
                  className="flex items-center gap-1 text-xs px-2 py-0.5 font-mono-tech"
                  style={{ background: "rgba(29,78,216,0.1)", border: "1px solid rgba(29,78,216,0.3)", color: "#60A5FA", borderRadius: "2px" }}
                >
                  {selectedCategoria} <button onClick={() => setSelectedCategoria("")}><X className="w-3 h-3" /></button>
                </span>
              )}
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

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-56 animate-pulse"
                style={{ background: "#27272C", borderRadius: "4px" }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-20" style={{ color: "#6B7280" }} />
            <p className="font-mono-tech text-sm" style={{ color: "#4B5563" }}>NENHUMA PEÇA ENCONTRADA</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 h-9 text-xs font-mono-tech mm-btn-tactile"
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#6B7280",
                borderRadius: "2px",
              }}
            >
              LIMPAR FILTROS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((produto) => (
              <ProdutoCard key={produto.id} produto={produto} onAddToCart={addToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
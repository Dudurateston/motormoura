import React, { useState, useEffect, useRef, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Search, X, SlidersHorizontal, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import ProdutoCard from "../components/catalogo/ProdutoCard";

const PAGE_SIZE = 36;

// Auto-categorize by keywords in nome_peca
function inferCategory(nome) {
  const n = nome.toLowerCase();
  if (n.includes("carburador") || n.includes("agulha") || n.includes("borboleta")) return "Carburação";
  if (n.includes("anel") || n.includes("pistão") || n.includes("biela") || n.includes("cilindro") || n.includes("seg.") || n.includes("segmento")) return "Motor / Pistão";
  if (n.includes("vela") || n.includes("bobina") || n.includes("ignição") || n.includes("alternador") || n.includes("estator") || n.includes("circuito") || n.includes("rotor")) return "Elétrico / Ignição";
  if (n.includes("filtro")) return "Filtros";
  if (n.includes("válvula") || n.includes("valvula") || n.includes("mola")) return "Válvulas";
  if (n.includes("bomba") || n.includes("diafragma")) return "Bombas / Diafragmas";
  if (n.includes("kit") || n.includes("jogo") || n.includes("junta")) return "Kits / Juntas";
  if (n.includes("retentor") || n.includes("vedação") || n.includes("vedacao") || n.includes("o-ring") || n.includes("oring")) return "Vedações";
  if (n.includes("parafuso") || n.includes("porca") || n.includes("grampo") || n.includes("pino")) return "Fixação";
  if (n.includes("alavanca") || n.includes("cabo") || n.includes("manete") || n.includes("aceleração") || n.includes("aceleracao")) return "Comando / Alavancas";
  if (n.includes("tampa") || n.includes("carcaça") || n.includes("carcaca") || n.includes("suporte") || n.includes("base")) return "Estrutura / Tampas";
  if (n.includes("óleo") || n.includes("oleo") || n.includes("lubrif")) return "Lubrificação";
  return "Outras Peças";
}

function addToCart(produto, quantidade) {
  const stored = localStorage.getItem("motormoura_cart");
  const cart = stored ? JSON.parse(stored) : [];
  const idx = cart.findIndex((i) => i.sku_codigo === produto.sku_codigo);
  if (idx >= 0) cart[idx].quantidade += quantidade;
  else cart.push({ sku_codigo: produto.sku_codigo, nome_peca: produto.nome_peca, quantidade });
  localStorage.setItem("motormoura_cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
}

// Multi-term search: all terms must match
function matchesSearch(produto, terms) {
  if (!terms.length) return true;
  const hay = `${produto.sku_codigo} ${produto.nome_peca} ${produto.relacionamento_marca || ""}`.toLowerCase();
  return terms.every(t => hay.includes(t));
}

export default function Catalogo() {
  const [produtos, setProdutos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const [selectedCategory, setSelectedCategory] = useState(urlParams.get("categoria") || "");
  const [selectedMarcas, setSelectedMarcas] = useState([]);
  const [searchText, setSearchText] = useState(urlParams.get("q") || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [priceFilter, setPriceFilter] = useState("all"); // all | sob_consulta | com_preco
  const [expandedGroups, setExpandedGroups] = useState({});
  const [page, setPage] = useState(1);
  const searchRef = useRef(null);

  useEffect(() => {
    Promise.all([
      base44.entities.Produtos.list("-created_date", 2000),
      base44.entities.MarcasCompativeis.list("nome"),
    ]).then(([p, m]) => {
      setProdutos(p);
      setMarcas(m);
      setLoading(false);
    });
  }, []);

  // Build category tree from inferred categories
  const categoryGroups = useMemo(() => {
    const map = {};
    produtos.forEach(p => {
      const cat = inferCategory(p.nome_peca);
      if (!map[cat]) map[cat] = 0;
      map[cat]++;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [produtos]);

  // Search terms (multi-term split by space)
  const searchTerms = useMemo(() =>
    searchText.trim().toLowerCase().split(/\s+/).filter(Boolean),
    [searchText]
  );

  // Suggestions: top 6 results as user types
  useEffect(() => {
    if (searchText.trim().length < 2) { setSuggestions([]); return; }
    const terms = searchText.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const hits = produtos.filter(p => matchesSearch(p, terms)).slice(0, 6);
    setSuggestions(hits);
  }, [searchText, produtos]);

  const filtered = useMemo(() => produtos.filter((p) => {
    if (p.ativo === false) return false;
    const catMatch = !selectedCategory || inferCategory(p.nome_peca) === selectedCategory;
    const marcaMatch = selectedMarcas.length === 0 || selectedMarcas.includes(p.relacionamento_marca);
    const textMatch = matchesSearch(p, searchTerms);
    const priceMatch = priceFilter === "all" ||
      (priceFilter === "sob_consulta" && (!p.preco_base_atacado || p.preco_base_atacado === 0)) ||
      (priceFilter === "com_preco" && p.preco_base_atacado > 0);
    return catMatch && marcaMatch && textMatch && priceMatch;
  }), [produtos, selectedCategory, selectedMarcas, searchTerms, priceFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasFilters = selectedCategory || selectedMarcas.length > 0 || searchText || priceFilter !== "all";

  const clearFilters = () => {
    setSelectedCategory(""); setSelectedMarcas([]); setSearchText(""); setPriceFilter("all"); setPage(1);
  };

  const toggleMarca = (nome) => {
    setSelectedMarcas(prev => prev.includes(nome) ? prev.filter(m => m !== nome) : [...prev, nome]);
    setPage(1);
  };

  const selectCategory = (cat) => { setSelectedCategory(cat); setPage(1); setSidebarOpen(false); };

  const toggleGroup = (group) => setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));

  const applySuggestion = (p) => {
    setSearchText(p.sku_codigo);
    setShowSuggestions(false);
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const SidebarContent = () => (
    <div className="flex flex-col gap-5">
      {/* Categories */}
      <div>
        <h3 className="text-xs font-mono-tech mb-3 pb-2" style={{ color: "#FB923C", letterSpacing: "0.15em", borderBottom: "1px solid rgba(251,146,60,0.2)" }}>
          CATEGORIAS
        </h3>
        <ul className="space-y-0.5">
          <li>
            <button onClick={() => selectCategory("")} className="w-full text-left px-3 py-2 text-sm transition-all flex items-center justify-between" style={{
              background: !selectedCategory ? "rgba(251,146,60,0.1)" : "transparent",
              border: !selectedCategory ? "1px solid rgba(251,146,60,0.3)" : "1px solid transparent",
              color: !selectedCategory ? "#FB923C" : "#6B7280", borderRadius: "2px",
            }}>
              <span>Todos os Produtos</span>
              {!selectedCategory && <ChevronRight className="w-3 h-3" />}
            </button>
          </li>
          {categoryGroups.map(([cat, count]) => (
            <li key={cat}>
              <button onClick={() => selectCategory(cat)} className="w-full text-left px-3 py-2 text-sm transition-all flex items-center justify-between" style={{
                background: selectedCategory === cat ? "rgba(251,146,60,0.1)" : "transparent",
                border: selectedCategory === cat ? "1px solid rgba(251,146,60,0.3)" : "1px solid transparent",
                color: selectedCategory === cat ? "#FB923C" : "#6B7280", borderRadius: "2px",
              }}>
                <span className="truncate pr-1">{cat}</span>
                <span className="text-xs flex-shrink-0" style={{ color: selectedCategory === cat ? "#FB923C80" : "#374151" }}>{count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price filter */}
      <div>
        <h3 className="text-xs font-mono-tech mb-3 pb-2" style={{ color: "#4ADE80", letterSpacing: "0.15em", borderBottom: "1px solid rgba(74,222,128,0.2)" }}>
          DISPONIBILIDADE DE PREÇO
        </h3>
        <ul className="space-y-0.5">
          {[
            { val: "all", label: "Todos" },
            { val: "sob_consulta", label: "Sob Consulta (sem preço)" },
            { val: "com_preco", label: "Com preço definido" },
          ].map(opt => (
            <li key={opt.val}>
              <button onClick={() => { setPriceFilter(opt.val); setPage(1); }} className="w-full text-left px-3 py-2 text-sm transition-all flex items-center justify-between" style={{
                background: priceFilter === opt.val ? "rgba(74,222,128,0.08)" : "transparent",
                border: priceFilter === opt.val ? "1px solid rgba(74,222,128,0.3)" : "1px solid transparent",
                color: priceFilter === opt.val ? "#4ADE80" : "#6B7280", borderRadius: "2px",
              }}>
                {opt.label}
                {priceFilter === opt.val && <ChevronRight className="w-3 h-3" />}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Brands — collapsible */}
      <div>
        <button onClick={() => toggleGroup("marcas")} className="w-full flex items-center justify-between text-xs font-mono-tech mb-3 pb-2" style={{ color: "#1D4ED8", letterSpacing: "0.15em", borderBottom: "1px solid rgba(29,78,216,0.2)" }}>
          MARCAS COMPATÍVEIS
          {expandedGroups.marcas ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
        {(expandedGroups.marcas === undefined || expandedGroups.marcas !== false) && (
          <ul className="space-y-1">
            {marcas.map((marca) => (
              <li key={marca.id}>
                <label className="flex items-center gap-2.5 cursor-pointer py-1">
                  <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 transition-all" style={{
                    background: selectedMarcas.includes(marca.nome) ? "#1D4ED8" : "rgba(255,255,255,0.04)",
                    border: selectedMarcas.includes(marca.nome) ? "1px solid #1D4ED8" : "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "2px",
                  }} onClick={() => toggleMarca(marca.nome)}>
                    {selectedMarcas.includes(marca.nome) && (
                      <svg viewBox="0 0 10 8" fill="none" style={{ width: 10, height: 8 }}>
                        <path d="M1 4L3.5 6.5L9 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm transition-colors" style={{ color: selectedMarcas.includes(marca.nome) ? "#93C5FD" : "#6B7280" }} onClick={() => toggleMarca(marca.nome)}>
                    {marca.nome}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {hasFilters && (
        <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs font-mono-tech mm-btn-tactile px-3 py-2" style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#4B5563", borderRadius: "2px",
        }}>
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
            <span className="text-xs font-mono-tech" style={{ color: "#FB923C", letterSpacing: "0.15em" }}>CATÁLOGO TÉCNICO B2B</span>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold font-mono-tech" style={{ color: "#F3F4F6" }}>
                {selectedCategory || "Todas as Peças de Reposição"}
              </h1>
              <p className="text-sm font-mono-tech mt-1" style={{ color: "#4B5563" }}>
                {loading ? "CARREGANDO..." : `${filtered.length} PRODUTO(S) · PÁGINA ${page} DE ${Math.max(1, totalPages)}`}
              </p>
            </div>

            {/* Search bar with suggestions */}
            <div className="relative flex-1 max-w-80" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 z-10" style={{ color: "#1D4ED8" }} />
              <input
                placeholder="Buscar por SKU, nome, HP... (multi-termos)"
                value={searchText}
                onChange={(e) => { setSearchText(e.target.value); setShowSuggestions(true); setPage(1); }}
                onFocus={() => searchText.length >= 2 && setShowSuggestions(true)}
                className="w-full h-10 pl-9 pr-8 text-sm font-mono-tech focus:outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(29,78,216,0.35)",
                  borderRadius: "2px",
                  color: "#F3F4F6",
                }}
              />
              {searchText && (
                <button onClick={() => { setSearchText(""); setSuggestions([]); setPage(1); }} className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: "#4B5563" }}>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Autocomplete dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 overflow-hidden" style={{
                  background: "#17171A", border: "1px solid rgba(29,78,216,0.4)", borderRadius: "4px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                }}>
                  <div className="px-3 py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <span className="text-xs font-mono-tech" style={{ color: "#1D4ED8" }}>SUGESTÕES</span>
                  </div>
                  {suggestions.map(p => (
                    <button key={p.id} onClick={() => applySuggestion(p)} className="w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-white/5 transition-colors">
                      <span className="text-xs font-mono-tech flex-shrink-0" style={{ color: "#60A5FA", minWidth: 48 }}>{p.sku_codigo}</span>
                      <span className="text-sm truncate" style={{ color: "#9CA3AF" }}>{p.nome_peca}</span>
                    </button>
                  ))}
                  <div className="px-3 py-1.5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <span className="text-xs" style={{ color: "#374151" }}>Separe termos por espaço para busca combinada</span>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile filter toggle */}
            <button className="md:hidden flex items-center gap-1.5 px-3 h-10 text-sm font-mono-tech mm-btn-tactile" style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#6B7280", borderRadius: "2px",
            }} onClick={() => setSidebarOpen(!sidebarOpen)}>
              <SlidersHorizontal className="w-3.5 h-3.5" /> FILTROS
              {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
            </button>
          </div>

          {/* Active filter pills */}
          {hasFilters && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {selectedCategory && (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 font-mono-tech" style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.3)", color: "#FB923C", borderRadius: "2px" }}>
                  {selectedCategory} <button onClick={() => selectCategory("")}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedMarcas.map(m => (
                <span key={m} className="flex items-center gap-1 text-xs px-2 py-0.5 font-mono-tech" style={{ background: "rgba(29,78,216,0.1)", border: "1px solid rgba(29,78,216,0.3)", color: "#60A5FA", borderRadius: "2px" }}>
                  {m} <button onClick={() => toggleMarca(m)}><X className="w-3 h-3" /></button>
                </span>
              ))}
              {priceFilter !== "all" && (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 font-mono-tech" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.3)", color: "#4ADE80", borderRadius: "2px" }}>
                  {priceFilter === "sob_consulta" ? "Sob Consulta" : "Com Preço"} <button onClick={() => setPriceFilter("all")}><X className="w-3 h-3" /></button>
                </span>
              )}
              {searchText && (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 font-mono-tech" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9CA3AF", borderRadius: "2px" }}>
                  "{searchText}" <button onClick={() => { setSearchText(""); setPage(1); }}><X className="w-3 h-3" /></button>
                </span>
              )}
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs px-2 py-0.5 font-mono-tech" style={{ color: "#4B5563" }}>
                limpar tudo
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-6">
          {/* Sidebar desktop */}
          <aside className="hidden md:block flex-shrink-0 sticky top-20 self-start" style={{
            width: 230, background: "rgba(27,27,31,0.9)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "4px", padding: "20px 14px", maxHeight: "calc(100vh - 100px)", overflowY: "auto",
          }}>
            <SidebarContent />
          </aside>

          {/* Mobile drawer */}
          {sidebarOpen && (
            <>
              <div className="fixed inset-0 z-40 md:hidden" style={{ background: "rgba(0,0,0,0.7)" }} onClick={() => setSidebarOpen(false)} />
              <div className="fixed inset-y-0 left-0 z-50 md:hidden p-5 overflow-y-auto" style={{ width: 290, background: "#17171A", borderRight: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex justify-between items-center mb-5">
                  <span className="text-xs font-mono-tech" style={{ color: "#FB923C", letterSpacing: "0.1em" }}>FILTROS</span>
                  <button onClick={() => setSidebarOpen(false)} style={{ color: "#6B7280" }}><X className="w-4 h-4" /></button>
                </div>
                <SidebarContent />
              </div>
            </>
          )}

          {/* Product area */}
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
                <p className="text-xs mt-1 mb-4" style={{ color: "#374151" }}>Tente termos diferentes ou limpe os filtros</p>
                <button onClick={clearFilters} className="px-4 h-9 text-xs font-mono-tech mm-btn-tactile" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#6B7280", borderRadius: "2px" }}>
                  LIMPAR FILTROS
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginated.map((produto) => (
                    <ProdutoCard key={produto.id} produto={produto} onAddToCart={addToCart} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
                    <button
                      onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      disabled={page === 1}
                      className="px-3 h-8 text-xs font-mono-tech mm-btn-tactile disabled:opacity-30"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#6B7280", borderRadius: "2px" }}
                    >
                      ← ANTERIOR
                    </button>

                    {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                      let p;
                      if (totalPages <= 7) p = i + 1;
                      else if (page <= 4) p = i + 1;
                      else if (page >= totalPages - 3) p = totalPages - 6 + i;
                      else p = page - 3 + i;
                      return (
                        <button key={p} onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                          className="w-8 h-8 text-xs font-mono-tech mm-btn-tactile"
                          style={{
                            background: page === p ? "rgba(251,146,60,0.15)" : "rgba(255,255,255,0.04)",
                            border: page === p ? "1px solid rgba(251,146,60,0.4)" : "1px solid rgba(255,255,255,0.08)",
                            color: page === p ? "#FB923C" : "#6B7280", borderRadius: "2px",
                          }}>
                          {p}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      disabled={page === totalPages}
                      className="px-3 h-8 text-xs font-mono-tech mm-btn-tactile disabled:opacity-30"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#6B7280", borderRadius: "2px" }}
                    >
                      PRÓXIMA →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
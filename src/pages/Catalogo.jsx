import React, { useState, useEffect, useMemo, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Search, SlidersHorizontal, X, ChevronDown, MessageCircle } from "lucide-react";
import ProdutoCard from "../components/catalogo/ProdutoCard";
import CatalogoSidebar from "../components/catalogo/CatalogoSidebar";
import { CATEGORIES } from "../components/catalogo/CategoriaGrid";

const PAGE_SIZE = 24;

function inferTipo(nome) {
  const n = nome.toLowerCase();
  if (n.includes("carburador") || n.includes("agulha carburador") || n.includes("borboleta")) return "Carburação";
  if (n.includes("anel") || n.includes("pistão") || n.includes("biela") || n.includes("segmento") || n.includes("seg.") || n.includes("virabrequim")) return "Motor / Pistão";
  if (n.includes("vela") || n.includes("bobina") || n.includes("ignição") || n.includes("alternador") || n.includes("estator") || n.includes("circuito") || n.includes("rotor") || n.includes("escova") || n.includes("fusível") || n.includes("controle remoto")) return "Elétrico / Ignição";
  if (n.includes("filtro")) return "Filtros";
  if (n.includes("válvula") || n.includes("valvula") || n.includes("mola válvula") || n.includes("mola valvula") || n.includes("mola")) return "Válvulas";
  if (n.includes("bomba") || n.includes("diafragma")) return "Bombas / Diafragmas";
  if (n.includes("kit") || n.includes("jogo") || n.includes("junta")) return "Kits / Juntas";
  if (n.includes("retentor") || n.includes("vedação") || n.includes("vedacao") || n.includes("o-ring") || n.includes("oring")) return "Vedações";
  if (n.includes("parafuso") || n.includes("porca") || n.includes("grampo") || n.includes("pino")) return "Fixação";
  if (n.includes("alavanca") || n.includes("cabo") || n.includes("manete") || n.includes("aceleração") || n.includes("aceleracao") || n.includes("gatilho")) return "Comando / Alavancas";
  if (n.includes("tampa") || n.includes("carcaça") || n.includes("carcaca") || n.includes("suporte") || n.includes("base") || n.includes("protetor")) return "Estrutura / Tampas";
  if (n.includes("óleo") || n.includes("oleo") || n.includes("lubrif") || n.includes("vareta")) return "Lubrificação";
  if (n.includes("agulha")) return "Carburação";
  return "Outras Peças";
}

function inferLinha(produto) {
  const cat = (produto.relacionamento_categoria || "").toLowerCase();
  const nome = (produto.nome_peca || "").toLowerCase();
  if (cat.includes("gasolina") || cat.includes("motor a gasolina")) return "Motores a Gasolina";
  if (cat.includes("diesel") || cat.includes("motor a diesel")) return "Motores a Diesel";
  if (cat.includes("motobomba")) return "Motobombas 4 Tempos";
  if (cat.includes("gerador 4") || cat.includes("geradores 4")) return "Geradores 4 Tempos";
  if (cat.includes("gerador 2") || cat.includes("geradores 2")) return "Geradores 2 Tempos";
  if (cat.includes("pulveriza") || cat.includes("bomba de pulveriza")) return "Bombas de Pulverização";
  if (nome.includes("gerador") || nome.includes("estator") || nome.includes("circuito protetor")) return "Geradores 4 Tempos";
  if (nome.includes("motobomba")) return "Motobombas 4 Tempos";
  if (nome.includes("pulverizad")) return "Bombas de Pulverização";
  return null;
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

function matchesSearch(produto, terms) {
  if (!terms.length) return true;
  const hay = `${produto.sku_codigo} ${produto.nome_peca} ${produto.relacionamento_marca || ""}`.toLowerCase();
  return terms.every((t) => hay.includes(t));
}

function sortProdutos(list, order) {
  const copy = [...list];
  if (order === "az") return copy.sort((a, b) => a.nome_peca.localeCompare(b.nome_peca));
  if (order === "za") return copy.sort((a, b) => b.nome_peca.localeCompare(a.nome_peca));
  if (order === "sku_asc") return copy.sort((a, b) => a.sku_codigo.localeCompare(b.sku_codigo));
  if (order === "destaque") return copy.sort((a, b) => (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0));
  return copy;
}

export default function Catalogo() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const [selectedCategoria, setSelectedCategoria] = useState(urlParams.get("categoria") || "");
  const [selectedTipo, setSelectedTipo] = useState("");
  const [selectedMarcas, setSelectedMarcas] = useState([]);
  const [searchText, setSearchText] = useState(urlParams.get("q") || "");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("destaque");
  const [page, setPage] = useState(1);

  const selectedLinha = selectedCategoria;
  const setSelectedLinha = setSelectedCategoria;

  useEffect(() => {
    base44.entities.Produtos.list("-created_date", 2000).then((p) => {
      setProdutos(p);
      setLoading(false);
    });
  }, []);

  const searchTerms = useMemo(
    () => searchText.trim().toLowerCase().split(/\s+/).filter(Boolean),
    [searchText]
  );

  const filtered = useMemo(() => {
    const base = produtos.filter((p) => {
      if (p.ativo === false) return false;
      const linhaMatch = !selectedCategoria || p.relacionamento_categoria === selectedCategoria || inferLinha(p) === selectedCategoria;
      const tipoMatch = !selectedTipo || inferTipo(p.nome_peca) === selectedTipo;
      const marcaMatch = selectedMarcas.length === 0 || selectedMarcas.includes(p.relacionamento_marca);
      const textMatch = matchesSearch(p, searchTerms);
      const priceMatch =
        priceFilter === "all" ||
        (priceFilter === "sob_consulta" && (!p.preco_base_atacado || p.preco_base_atacado === 0)) ||
        (priceFilter === "com_preco" && p.preco_base_atacado > 0);
      return linhaMatch && tipoMatch && marcaMatch && textMatch && priceMatch;
    });
    return sortProdutos(base, sortOrder);
  }, [produtos, selectedCategoria, selectedTipo, selectedMarcas, searchTerms, priceFilter, sortOrder]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasFilters = !!(selectedLinha || selectedTipo || selectedMarcas.length > 0 || searchText || priceFilter !== "all");

  const clearFilters = useCallback(() => {
    setSelectedLinha(""); setSelectedTipo(""); setSelectedMarcas([]);
    setSearchText(""); setPriceFilter("all"); setPage(1);
  }, []);

  const toggleMarca = useCallback((nome) => {
    setSelectedMarcas((prev) => prev.includes(nome) ? prev.filter((m) => m !== nome) : [...prev, nome]);
    setPage(1);
  }, []);

  const goPage = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const handleSetLinha = useCallback((v) => { setSelectedLinha(v); setPage(1); setMobileDrawerOpen(false); }, []);
  const handleSetTipo = useCallback((v) => { setSelectedTipo(v); setPage(1); setMobileDrawerOpen(false); }, []);
  const handleSetPrice = useCallback((v) => { setPriceFilter(v); setPage(1); }, []);

  const activePillsList = [
    selectedLinha && { key: "linha", label: selectedLinha, clear: () => handleSetLinha("") },
    selectedTipo && { key: "tipo", label: selectedTipo, clear: () => handleSetTipo("") },
    priceFilter !== "all" && { key: "price", label: priceFilter === "sob_consulta" ? "Sob Consulta" : "Com Preço", clear: () => handleSetPrice("all") },
    ...selectedMarcas.map((m) => ({ key: m, label: m, clear: () => toggleMarca(m) })),
    searchText && { key: "q", label: `"${searchText}"`, clear: () => { setSearchText(""); setPage(1); } },
  ].filter(Boolean);

  const sidebarProps = {
    selectedLinha, setSelectedLinha: handleSetLinha,
    selectedTipo, setSelectedTipo: handleSetTipo,
    selectedMarcas, toggleMarca,
    priceFilter, setPriceFilter: handleSetPrice,
    clearFilters, hasFilters,
  };

  // Active category info
  const activeCat = CATEGORIES.find(c => c.name === selectedCategoria);

  return (
    <div style={{ background: "#F8F9FA", minHeight: "100vh" }}>

      {/* ── BANNER / BREADCRUMB BAR ─────────────────────────── */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0" }}>
        <div className="max-w-[1440px] mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-xs font-mono-tech mb-0.5" style={{ color: "#9CA3AF" }}>
              CATÁLOGO B2B
              {selectedCategoria && <span style={{ color: "#9CA3AF" }}> › {selectedCategoria}</span>}
            </p>
            <h1 className="text-lg font-bold font-mono-tech" style={{ color: "#212529" }}>
              {selectedCategoria || "Todas as Peças de Reposição"}
            </h1>
          </div>
          <a href="https://api.whatsapp.com/send?phone=5585986894081&text=Olá%2C%20preciso%20de%20ajuda%20para%20encontrar%20uma%20peça!" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 h-9 text-xs font-mono-tech flex-shrink-0 mm-btn-tactile"
            style={{ background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.3)", color: "#16A34A", borderRadius: "2px" }}>
            <MessageCircle className="w-3.5 h-3.5" />
            NÃO ACHOU? FALAR COM ESPECIALISTA
          </a>
        </div>
      </div>

      {/* ── CATEGORIES QUICK-SELECT STRIP ──────────────────── */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0" }}>
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-2" style={{ scrollbarWidth: "none" }}>
            <button
              onClick={() => handleSetLinha("")}
              className="flex-shrink-0 px-3 h-7 text-xs font-mono-tech mm-btn-tactile"
              style={{
                background: !selectedCategoria ? "rgba(211,47,47,0.1)" : "#F8F9FA",
                border: !selectedCategoria ? "1px solid rgba(211,47,47,0.35)" : "1px solid #E2E8F0",
                color: !selectedCategoria ? "#D32F2F" : "#6C757D",
                borderRadius: "2px",
              }}
            >
              TUDO
            </button>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const active = selectedCategoria === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => handleSetLinha(cat.name)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 h-7 text-xs font-mono-tech mm-btn-tactile"
                  style={{
                    background: active ? `${cat.color}12` : "#F8F9FA",
                    border: active ? `1px solid ${cat.color}40` : "1px solid #E2E8F0",
                    color: active ? cat.color : "#6C757D",
                    borderRadius: "2px",
                  }}
                >
                  <Icon className="w-3 h-3" />
                  {cat.name.split(" ").slice(0, 2).join(" ")}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── MAIN LAYOUT: SIDEBAR + PRODUCTS ────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 py-5">
        <div className="flex gap-5 items-start">

          {/* ── SIDEBAR DESKTOP ── */}
          <aside
            className="hidden md:block flex-shrink-0 sticky top-20 self-start overflow-y-auto"
            style={{
              width: 220,
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "4px",
              padding: "16px 14px",
              maxHeight: "calc(100vh - 100px)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <CatalogoSidebar {...sidebarProps} />
          </aside>

          {/* ── MOBILE DRAWER ── */}
          {mobileDrawerOpen && (
            <>
              <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.6)" }} onClick={() => setMobileDrawerOpen(false)} />
              <div className="fixed inset-y-0 left-0 z-50 overflow-y-auto" style={{ width: 280, background: "#FFFFFF", borderRight: "1px solid #E2E8F0", padding: "18px 14px" }}>
                <CatalogoSidebar {...sidebarProps} onClose={() => setMobileDrawerOpen(false)} />
              </div>
            </>
          )}

          {/* ── PRODUCT AREA ── */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 mb-4 p-3" style={{
              background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px"
            }}>
              {/* Search */}
              <div className="relative flex-1 min-w-[160px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#9CA3AF" }} />
                <input
                  placeholder="Buscar por SKU, nome ou marca…"
                  value={searchText}
                  onChange={(e) => { setSearchText(e.target.value); setPage(1); }}
                  className="w-full h-9 pl-9 pr-7 text-xs font-mono-tech focus:outline-none"
                  style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#212529" }}
                />
                {searchText && (
                  <button onClick={() => { setSearchText(""); setPage(1); }} className="absolute right-2 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="relative flex items-center" style={{ flexShrink: 0 }}>
                <span className="text-xs font-mono-tech mr-2 hidden sm:inline" style={{ color: "#9CA3AF" }}>ORDENAR</span>
                <select
                  value={sortOrder}
                  onChange={(e) => { setSortOrder(e.target.value); setPage(1); }}
                  className="h-9 pl-3 pr-7 text-xs font-mono-tech focus:outline-none appearance-none"
                  style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#6C757D", minWidth: 120 }}
                >
                  <option value="destaque">Destaques ⭐</option>
                  <option value="az">Nome A → Z</option>
                  <option value="za">Nome Z → A</option>
                  <option value="sku_asc">SKU ↑</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" style={{ color: "#9CA3AF" }} />
              </div>

              {/* Mobile filter btn */}
              <button
                className="md:hidden flex items-center gap-1.5 px-3 h-9 text-xs font-mono-tech"
                style={{
                  background: hasFilters ? "rgba(211,47,47,0.08)" : "#F8F9FA",
                  border: hasFilters ? "1px solid rgba(211,47,47,0.3)" : "1px solid #E2E8F0",
                  color: hasFilters ? "#D32F2F" : "#6C757D", borderRadius: "2px"
                }}
                onClick={() => setMobileDrawerOpen(true)}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                FILTROS
                {hasFilters && <span className="w-1.5 h-1.5 rounded-full ml-1" style={{ background: "#D32F2F" }} />}
              </button>

              {/* Count */}
              <span className="text-xs font-mono-tech ml-auto flex-shrink-0" style={{ color: "#9CA3AF" }}>
                {loading ? "CARREGANDO..." : `${filtered.length} ITENS`}
              </span>
            </div>

            {/* Active filter pills */}
            {activePillsList.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {activePillsList.map((pill) => (
                  <span key={pill.key} className="flex items-center gap-1 text-xs px-2 py-1 font-mono-tech" style={{
                    background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#6C757D", borderRadius: "2px"
                  }}>
                    {pill.label}
                    <button onClick={pill.clear}><X className="w-3 h-3" /></button>
                  </span>
                ))}
                <button onClick={clearFilters} className="text-xs font-mono-tech px-2 py-1 hover:text-red-600 transition-colors" style={{ color: "#9CA3AF" }}>
                  limpar tudo
                </button>
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-72 animate-pulse" style={{ background: "#E2E8F0", borderRadius: "4px" }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24 bg-white rounded" style={{ border: "1px solid #E2E8F0" }}>
                <Search className="w-10 h-10 mx-auto mb-3" style={{ color: "#E2E8F0" }} />
                <p className="font-mono-tech text-sm mb-2" style={{ color: "#212529" }}>NENHUMA PEÇA ENCONTRADA</p>
                <p className="text-xs mb-4" style={{ color: "#9CA3AF" }}>Tente outros filtros ou limpe a seleção</p>
                <button onClick={clearFilters} className="px-4 h-9 text-xs font-mono-tech mm-btn-tactile"
                  style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#6C757D", borderRadius: "2px" }}>
                  LIMPAR FILTROS
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {paginated.map((produto) => (
                    <ProdutoCard key={produto.id} produto={produto} onAddToCart={addToCart} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
                    <button
                      onClick={() => goPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-3 h-9 text-xs font-mono-tech disabled:opacity-30 mm-btn-tactile"
                      style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#6C757D", borderRadius: "2px" }}
                    >
                      ← ANTERIOR
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let p;
                      if (totalPages <= 5) p = i + 1;
                      else if (page <= 3) p = i + 1;
                      else if (page >= totalPages - 2) p = totalPages - 4 + i;
                      else p = page - 2 + i;
                      return (
                        <button
                          key={p}
                          onClick={() => goPage(p)}
                          className="w-9 h-9 text-xs font-mono-tech mm-btn-tactile"
                          style={{
                            background: page === p ? "rgba(211,47,47,0.1)" : "#FFFFFF",
                            border: page === p ? "1px solid rgba(211,47,47,0.4)" : "1px solid #E2E8F0",
                            color: page === p ? "#D32F2F" : "#6C757D", borderRadius: "2px",
                          }}
                        >
                          {p}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => goPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="px-3 h-9 text-xs font-mono-tech disabled:opacity-30 mm-btn-tactile"
                      style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#6C757D", borderRadius: "2px" }}
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
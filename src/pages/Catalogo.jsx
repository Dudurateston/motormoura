import React, { useState, useEffect, useMemo, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Search, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import ProdutoCard from "../components/catalogo/ProdutoCard";
import CatalogoSidebar from "../components/catalogo/CatalogoSidebar";

const PAGE_SIZE = 36;

// Inferir TIPO DE PEÇA a partir do nome_peca
function inferTipo(nome) {
  const n = nome.toLowerCase();
  if (n.includes("carburador") || n.includes("agulha carburador") || n.includes("borboleta")) return "Carburação";
  if (n.includes("anel") || n.includes("pistão") || n.includes("biela") || n.includes("segmento") || n.includes("seg.") || n.includes("virabrequim")) return "Motor / Pistão";
  if (n.includes("vela") || n.includes("bobina") || n.includes("ignição") || n.includes("alternador") || n.includes("estator") || n.includes("circuito") || n.includes("rotor") || n.includes("escova") || n.includes("fusível") || n.includes("controle remoto")) return "Elétrico / Ignição";
  if (n.includes("filtro")) return "Filtros";
  if (n.includes("válvula") || n.includes("valvula") || n.includes("mola válvula") || n.includes("mola valvula")) return "Válvulas";
  if (n.includes("bomba") || n.includes("diafragma")) return "Bombas / Diafragmas";
  if (n.includes("kit") || n.includes("jogo") || n.includes("junta")) return "Kits / Juntas";
  if (n.includes("retentor") || n.includes("vedação") || n.includes("vedacao") || n.includes("o-ring") || n.includes("oring")) return "Vedações";
  if (n.includes("parafuso") || n.includes("porca") || n.includes("grampo") || n.includes("pino")) return "Fixação";
  if (n.includes("alavanca") || n.includes("cabo") || n.includes("manete") || n.includes("aceleração") || n.includes("aceleracao") || n.includes("gatilho")) return "Comando / Alavancas";
  if (n.includes("tampa") || n.includes("carcaça") || n.includes("carcaca") || n.includes("suporte") || n.includes("base") || n.includes("protetor")) return "Estrutura / Tampas";
  if (n.includes("óleo") || n.includes("oleo") || n.includes("lubrif") || n.includes("vareta")) return "Lubrificação";
  if (n.includes("mola")) return "Válvulas";
  if (n.includes("agulha")) return "Carburação";
  return "Outras Peças";
}

// Inferir LINHA de equipamento a partir do relacionamento_categoria
function inferLinha(produto) {
  const cat = (produto.relacionamento_categoria || "").toLowerCase();
  const nome = (produto.nome_peca || "").toLowerCase();

  if (cat.includes("gasolina") || cat.includes("motor a gasolina")) return "Motores a Gasolina";
  if (cat.includes("diesel") || cat.includes("motor a diesel")) return "Motores a Diesel";
  if (cat.includes("motobomba")) return "Motobombas 4 Tempos";
  if (cat.includes("gerador 4") || cat.includes("geradores 4")) return "Geradores 4 Tempos";
  if (cat.includes("gerador 2") || cat.includes("geradores 2")) return "Geradores 2 Tempos";
  if (cat.includes("pulveriza") || cat.includes("bomba de pulveriza")) return "Bombas de Pulverização";

  // fallback por keywords no nome
  if (nome.includes("gerador") || nome.includes("estator") || nome.includes("circuito protetor")) return "Geradores 4 Tempos";
  if (nome.includes("motobomba")) return "Motobombas 4 Tempos";
  if (nome.includes("pulverizad")) return "Bombas de Pulverização";

  return null; // sem linha definida
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
  if (order === "sku_desc") return copy.sort((a, b) => b.sku_codigo.localeCompare(a.sku_codigo));
  return copy;
}

export default function Catalogo() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const [selectedLinha, setSelectedLinha] = useState(urlParams.get("categoria") || "");
  const [selectedTipo, setSelectedTipo] = useState("");
  const [selectedMarcas, setSelectedMarcas] = useState([]);
  const [searchText, setSearchText] = useState(urlParams.get("q") || "");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("az");
  const [page, setPage] = useState(1);

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
      const linhaMatch = !selectedLinha || inferLinha(p) === selectedLinha;
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
  }, [produtos, selectedLinha, selectedTipo, selectedMarcas, searchTerms, priceFilter, sortOrder]);

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

  // Filter pills
  const pills = [
    selectedLinha && { key: "linha", label: selectedLinha, color: "#FB923C", bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.3)", clear: () => handleSetLinha("") },
    selectedTipo && { key: "tipo", label: selectedTipo, color: "#60A5FA", bg: "rgba(29,78,216,0.1)", border: "rgba(29,78,216,0.3)", clear: () => handleSetTipo("") },
    priceFilter !== "all" && { key: "price", label: priceFilter === "sob_consulta" ? "Sob Consulta" : "Com Preço", color: "#4ADE80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.3)", clear: () => handleSetPrice("all") },
    ...selectedMarcas.map((m) => ({ key: m, label: m, color: "#93C5FD", bg: "rgba(29,78,216,0.08)", border: "rgba(29,78,216,0.25)", clear: () => toggleMarca(m) })),
    searchText && { key: "q", label: `"${searchText}"`, color: "#9CA3AF", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.12)", clear: () => { setSearchText(""); setPage(1); } },
  ].filter(Boolean);

  const sidebarProps = {
    selectedLinha, setSelectedLinha: handleSetLinha,
    selectedTipo, setSelectedTipo: handleSetTipo,
    selectedMarcas, toggleMarca,
    priceFilter, setPriceFilter: handleSetPrice,
    clearFilters, hasFilters,
  };

  const pageTitle = selectedLinha || selectedTipo || "Todas as Peças de Reposição";

  return (
    <div className="mm-bg min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 py-6 md:py-8">

        {/* Page header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-[2px]" style={{ background: "#FB923C" }} />
            <span className="text-xs font-mono-tech" style={{ color: "#FB923C", letterSpacing: "0.15em" }}>CATÁLOGO TÉCNICO B2B</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-mono-tech" style={{ color: "#F3F4F6" }}>{pageTitle}</h1>
        </div>

        <div className="flex gap-5 items-start">

          {/* ── SIDEBAR DESKTOP ── */}
          <aside
            className="hidden md:block flex-shrink-0 sticky top-20 self-start overflow-y-auto"
            style={{
              width: 230, background: "rgba(27,27,31,0.95)",
              border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px",
              padding: "18px 14px", maxHeight: "calc(100vh - 100px)",
            }}
          >
            <CatalogoSidebar {...sidebarProps} />
          </aside>

          {/* ── MOBILE DRAWER ── */}
          {mobileDrawerOpen && (
            <>
              <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.75)" }} onClick={() => setMobileDrawerOpen(false)} />
              <div className="fixed inset-y-0 left-0 z-50 overflow-y-auto" style={{ width: 280, background: "#17171A", borderRight: "1px solid rgba(255,255,255,0.08)", padding: "18px 14px" }}>
                <CatalogoSidebar {...sidebarProps} onClose={() => setMobileDrawerOpen(false)} />
              </div>
            </>
          )}

          {/* ── PRODUCT AREA ── */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[160px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#1D4ED8" }} />
                <input
                  placeholder="SKU, nome, HP…"
                  value={searchText}
                  onChange={(e) => { setSearchText(e.target.value); setPage(1); }}
                  className="w-full h-9 pl-9 pr-7 text-xs font-mono-tech focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(29,78,216,0.35)", borderRadius: "2px", color: "#F3F4F6" }}
                />
                {searchText && (
                  <button onClick={() => { setSearchText(""); setPage(1); }} className="absolute right-2 top-1/2 -translate-y-1/2" style={{ color: "#4B5563" }}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 hidden sm:block flex-shrink-0" style={{ color: "#4B5563" }} />
                <select
                  value={sortOrder}
                  onChange={(e) => { setSortOrder(e.target.value); setPage(1); }}
                  className="h-9 px-2 text-xs font-mono-tech focus:outline-none appearance-none"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "2px", color: "#9CA3AF", minWidth: 100 }}
                >
                  <option value="az" style={{ background: "#1F1F23" }}>A → Z</option>
                  <option value="za" style={{ background: "#1F1F23" }}>Z → A</option>
                  <option value="sku_asc" style={{ background: "#1F1F23" }}>SKU ↑</option>
                  <option value="sku_desc" style={{ background: "#1F1F23" }}>SKU ↓</option>
                </select>
              </div>

              {/* Mobile filter btn */}
              <button
                className="md:hidden flex items-center gap-1.5 px-3 h-9 text-xs font-mono-tech flex-shrink-0"
                style={{ background: hasFilters ? "rgba(251,146,60,0.1)" : "rgba(255,255,255,0.04)", border: hasFilters ? "1px solid rgba(251,146,60,0.3)" : "1px solid rgba(255,255,255,0.1)", color: hasFilters ? "#FB923C" : "#6B7280", borderRadius: "2px" }}
                onClick={() => setMobileDrawerOpen(true)}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                FILTROS
                {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
              </button>

              {/* Count */}
              <span className="text-xs font-mono-tech ml-auto flex-shrink-0" style={{ color: "#4B5563" }}>
                {loading ? "CARREGANDO..." : `${filtered.length} itens · p.${page}/${Math.max(1, totalPages)}`}
              </span>
            </div>

            {/* Active pills */}
            {pills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {pills.map((pill) => (
                  <span key={pill.key} className="flex items-center gap-1 text-xs px-2 py-0.5 font-mono-tech" style={{ background: pill.bg, border: `1px solid ${pill.border}`, color: pill.color, borderRadius: "2px" }}>
                    {pill.label}
                    <button onClick={pill.clear}><X className="w-3 h-3" /></button>
                  </span>
                ))}
                <button onClick={clearFilters} className="text-xs font-mono-tech px-2 py-0.5" style={{ color: "#4B5563" }}>limpar tudo</button>
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="h-56 animate-pulse" style={{ background: "#27272C", borderRadius: "4px" }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-mono-tech text-sm mb-2" style={{ color: "#4B5563" }}>NENHUMA PEÇA ENCONTRADA</p>
                <p className="text-xs mb-4" style={{ color: "#374151" }}>Tente outros filtros ou limpe a seleção</p>
                <button onClick={clearFilters} className="px-4 h-9 text-xs font-mono-tech" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#6B7280", borderRadius: "2px" }}>
                  LIMPAR FILTROS
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
                      className="px-3 h-8 text-xs font-mono-tech disabled:opacity-30"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#6B7280", borderRadius: "2px" }}
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
                          className="w-8 h-8 text-xs font-mono-tech"
                          style={{
                            background: page === p ? "rgba(251,146,60,0.15)" : "rgba(255,255,255,0.04)",
                            border: page === p ? "1px solid rgba(251,146,60,0.4)" : "1px solid rgba(255,255,255,0.08)",
                            color: page === p ? "#FB923C" : "#6B7280", borderRadius: "2px",
                          }}
                        >
                          {p}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => goPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="px-3 h-8 text-xs font-mono-tech disabled:opacity-30"
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
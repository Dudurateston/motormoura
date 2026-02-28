import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { X } from "lucide-react";
import ProdutoCard from "../components/catalogo/ProdutoCard";
import CatalogoSidebar from "../components/catalogo/CatalogoSidebar";
import CatalogoToolbar from "../components/catalogo/CatalogoToolbar";

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
  const [selectedCategory, setSelectedCategory] = useState(urlParams.get("categoria") || "");
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
      const catMatch = !selectedCategory || inferCategory(p.nome_peca) === selectedCategory;
      const marcaMatch = selectedMarcas.length === 0 || selectedMarcas.includes(p.relacionamento_marca);
      const textMatch = matchesSearch(p, searchTerms);
      const priceMatch =
        priceFilter === "all" ||
        (priceFilter === "sob_consulta" && (!p.preco_base_atacado || p.preco_base_atacado === 0)) ||
        (priceFilter === "com_preco" && p.preco_base_atacado > 0);
      return catMatch && marcaMatch && textMatch && priceMatch;
    });
    return sortProdutos(base, sortOrder);
  }, [produtos, selectedCategory, selectedMarcas, searchTerms, priceFilter, sortOrder]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasFilters = !!(selectedCategory || selectedMarcas.length > 0 || searchText || priceFilter !== "all");

  const clearFilters = useCallback(() => {
    setSelectedCategory(""); setSelectedMarcas([]); setSearchText(""); setPriceFilter("all"); setPage(1);
  }, []);

  const toggleMarca = useCallback((nome) => {
    setSelectedMarcas((prev) => prev.includes(nome) ? prev.filter((m) => m !== nome) : [...prev, nome]);
    setPage(1);
  }, []);

  const handleSetCategory = useCallback((cat) => {
    setSelectedCategory(cat); setPage(1); setMobileDrawerOpen(false);
  }, []);

  const handleSetPrice = useCallback((val) => {
    setPriceFilter(val); setPage(1);
  }, []);

  const goPage = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  // Active filter pills
  const activeFilterPills = [
    selectedCategory && (
      <span key="cat" className="flex items-center gap-1 text-xs px-2 py-0.5 font-mono-tech" style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.3)", color: "#FB923C", borderRadius: "2px" }}>
        {selectedCategory} <button onClick={() => handleSetCategory("")}><X className="w-3 h-3" /></button>
      </span>
    ),
    ...selectedMarcas.map((m) => (
      <span key={m} className="flex items-center gap-1 text-xs px-2 py-0.5 font-mono-tech" style={{ background: "rgba(29,78,216,0.1)", border: "1px solid rgba(29,78,216,0.3)", color: "#60A5FA", borderRadius: "2px" }}>
        {m} <button onClick={() => toggleMarca(m)}><X className="w-3 h-3" /></button>
      </span>
    )),
    priceFilter !== "all" && (
      <span key="price" className="flex items-center gap-1 text-xs px-2 py-0.5 font-mono-tech" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.3)", color: "#4ADE80", borderRadius: "2px" }}>
        {priceFilter === "sob_consulta" ? "Sob Consulta" : "Com Preço"} <button onClick={() => handleSetPrice("all")}><X className="w-3 h-3" /></button>
      </span>
    ),
    searchText && (
      <span key="search" className="flex items-center gap-1 text-xs px-2 py-0.5 font-mono-tech" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9CA3AF", borderRadius: "2px" }}>
        "{searchText}" <button onClick={() => { setSearchText(""); setPage(1); }}><X className="w-3 h-3" /></button>
      </span>
    ),
  ].filter(Boolean);

  const sidebarProps = {
    selectedCategory, setSelectedCategory: handleSetCategory,
    selectedMarcas, toggleMarca,
    priceFilter, setPriceFilter: handleSetPrice,
    clearFilters, hasFilters,
  };

  return (
    <div className="mm-bg min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 py-8">

        {/* Page header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-[2px]" style={{ background: "#FB923C" }} />
            <span className="text-xs font-mono-tech" style={{ color: "#FB923C", letterSpacing: "0.15em" }}>CATÁLOGO TÉCNICO B2B</span>
          </div>
          <h1 className="text-2xl font-bold font-mono-tech" style={{ color: "#F3F4F6" }}>
            {selectedCategory || "Todas as Peças de Reposição"}
          </h1>
        </div>

        {/* Layout 25/75 */}
        <div className="flex gap-6 items-start">

          {/* ── SIDEBAR DESKTOP (25%) ── */}
          <aside
            className="hidden md:block flex-shrink-0 sticky top-20 self-start overflow-y-auto"
            style={{
              width: "25%", maxWidth: 280, minWidth: 200,
              background: "rgba(27,27,31,0.95)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "4px",
              padding: "20px 16px",
              maxHeight: "calc(100vh - 100px)",
            }}
          >
            <CatalogoSidebar {...sidebarProps} />
          </aside>

          {/* ── MOBILE DRAWER ── */}
          {mobileDrawerOpen && (
            <>
              <div
                className="fixed inset-0 z-40 md:hidden"
                style={{ background: "rgba(0,0,0,0.75)" }}
                onClick={() => setMobileDrawerOpen(false)}
              />
              <div
                className="fixed inset-y-0 left-0 z-50 md:hidden overflow-y-auto"
                style={{ width: 290, background: "#17171A", borderRight: "1px solid rgba(255,255,255,0.08)", padding: "20px 16px" }}
              >
                <CatalogoSidebar {...sidebarProps} onClose={() => setMobileDrawerOpen(false)} />
              </div>
            </>
          )}

          {/* ── PRODUCT AREA (75%) ── */}
          <div className="flex-1 min-w-0">
            <CatalogoToolbar
              searchText={searchText}
              setSearchText={(v) => { setSearchText(v); setPage(1); }}
              sortOrder={sortOrder}
              setSortOrder={(v) => { setSortOrder(v); setPage(1); }}
              totalFiltered={filtered.length}
              page={page}
              totalPages={totalPages}
              loading={loading}
              onMobileFilterOpen={() => setMobileDrawerOpen(true)}
              hasFilters={hasFilters}
              activeFilterPills={activeFilterPills}
            />

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
                <p className="text-xs mb-4" style={{ color: "#374151" }}>Tente termos diferentes ou limpe os filtros</p>
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

                    {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                      let p;
                      if (totalPages <= 7) p = i + 1;
                      else if (page <= 4) p = i + 1;
                      else if (page >= totalPages - 3) p = totalPages - 6 + i;
                      else p = page - 3 + i;
                      return (
                        <button
                          key={p}
                          onClick={() => goPage(p)}
                          className="w-8 h-8 text-xs font-mono-tech"
                          style={{
                            background: page === p ? "rgba(251,146,60,0.15)" : "rgba(255,255,255,0.04)",
                            border: page === p ? "1px solid rgba(251,146,60,0.4)" : "1px solid rgba(255,255,255,0.08)",
                            color: page === p ? "#FB923C" : "#6B7280",
                            borderRadius: "2px",
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
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Search, SlidersHorizontal, X, ArrowUpDown, ArrowLeft, Heart, GitCompare } from "lucide-react";
import ProdutoCard from "../components/catalogo/ProdutoCard";
import CatalogoSidebar from "../components/catalogo/CatalogoSidebar";
import CategoriaGrid from "../components/catalogo/CategoriaGrid";
import SEOHead from "../components/SEOHead";
import FavoritosTab from "../components/conta/FavoritosTab";
import ComparativoTab from "../components/catalogo/ComparativoTab";
import { analytics } from "@/components/analytics/analytics.js";

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
  const [catalogoTab, setCatalogoTab] = useState(() => {
    const tab = new URLSearchParams(window.location.search).get("tab");
    return ["favoritos", "comparativo"].includes(tab) ? tab : "catalogo";
  });
  const [catalogoUser, setCatalogoUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setCatalogoUser).catch(() => setCatalogoUser(null));
  }, []);

  const urlParams = new URLSearchParams(window.location.search);
  const urlCategoria = urlParams.get("categoria") || "";
  const [selectedCategoria, setSelectedCategoria] = useState(urlCategoria);
  const [selectedTipo, setSelectedTipo] = useState("");
  const [selectedMarcas, setSelectedMarcas] = useState([]);
  const [searchText, setSearchText] = useState(urlParams.get("q") || "");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("az");
  const [page, setPage] = useState(1);
  // selectedLinha alias for sidebar
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
  }, [produtos, selectedLinha, selectedTipo, selectedMarcas, searchTerms, priceFilter, sortOrder]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasFilters = !!(selectedLinha || selectedTipo || selectedMarcas.length > 0 || searchText || priceFilter !== "all");

  const clearFilters = useCallback(() => {
    setSelectedLinha(""); setSelectedTipo(""); setSelectedMarcas([]);
    setSearchText(""); setPriceFilter("all"); setPage(1);
  }, []);

  const toggleMarca = useCallback((nome) => {
    setSelectedMarcas((prev) => {
      const isAdding = !prev.includes(nome);
      if (isAdding) analytics.filterApply("marca", nome);
      return isAdding ? [...prev, nome] : prev.filter((m) => m !== nome);
    });
    setPage(1);
  }, []);

  const goPage = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const handleSetLinha = useCallback((v) => { 
    setSelectedLinha(v); 
    setPage(1); 
    setMobileDrawerOpen(false); 
    if (v) analytics.filterApply("linha", v);
  }, []);
  const handleSetTipo = useCallback((v) => { 
    setSelectedTipo(v); 
    setPage(1); 
    setMobileDrawerOpen(false); 
    if (v) analytics.filterApply("tipo", v);
  }, []);
  const handleSetPrice = useCallback((v) => { 
    setPriceFilter(v); 
    setPage(1); 
    if (v !== "all") analytics.filterApply("preco", v);
  }, []);

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

  const pageTitle = selectedCategoria || selectedTipo || "Todas as Peças de Reposição";
  
  const seoTitle = selectedCategoria 
    ? `${selectedCategoria} - Peças de Reposição | MotorMoura` 
    : selectedTipo 
    ? `${selectedTipo} - Catálogo de Peças | MotorMoura`
    : "Catálogo de Peças para Motores, Geradores e Motobombas | MotorMoura";
    
  const seoDescription = selectedCategoria
    ? `Peças de reposição para ${selectedCategoria}. Mais de ${filtered.length} itens disponíveis. Importação direta, qualidade garantida. Fortaleza-CE.`
    : `Catálogo completo com mais de 1.000 peças de reposição para motores, geradores e motobombas. Honda, Tekna, Makita, Buffalo, Husqvarna.`;

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={`peças ${selectedCategoria || 'motor gerador motobomba'}, reposição, importação, atacado, B2B, Fortaleza`}
      />
      <div style={{ background: "#F8F9FA", minHeight: "100vh" }}>
      <div className="max-w-[1440px] mx-auto px-4 py-6 md:py-8">

        {/* Top tabs */}
        <div className="flex gap-0 mb-5 overflow-x-auto" style={{ borderBottom: "1px solid #E2E8F0" }}>
          {[
            { id: "catalogo", label: "CATÁLOGO" },
            { id: "favoritos", label: "FAVORITOS", icon: Heart },
            { id: "comparativo", label: "COMPARATIVO", icon: GitCompare },
          ].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setCatalogoTab(id)}
              className="flex items-center gap-1.5 px-5 py-3 text-xs font-mono-tech whitespace-nowrap transition-all duration-200"
              style={{
                color: catalogoTab === id ? "#D32F2F" : "#6C757D",
                background: "transparent", border: "none",
                borderBottom: catalogoTab === id ? "2px solid #D32F2F" : "2px solid transparent",
                marginBottom: "-1px",
              }}>
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {label}
            </button>
          ))}
        </div>

        {/* Favoritos tab */}
        {catalogoTab === "favoritos" && (
          <FavoritosTab user={catalogoUser} />
        )}

        {/* Comparativo tab */}
        {catalogoTab === "comparativo" && (
          <ComparativoTab />
        )}

        {/* Catálogo tab */}
        {catalogoTab === "catalogo" && (<>

        {/* Page header */}
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-[2px]" style={{ background: "#E53935" }} />
              <span className="text-xs font-mono-tech" style={{ color: "#E53935", letterSpacing: "0.15em" }}>CATÁLOGO TÉCNICO B2B</span>
            </div>
            <div className="flex items-center gap-3">
              {selectedCategoria && (
                <button
                  onClick={() => { setSelectedCategoria(""); setPage(1); }}
                  className="flex items-center gap-1 text-xs font-mono-tech mm-btn-tactile px-2 h-7"
                  style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#6C757D", borderRadius: "2px" }}
                >
                  <ArrowLeft className="w-3 h-3" /> CATEGORIAS
                </button>
              )}
              <h1 className="text-xl md:text-2xl font-bold font-mono-tech" style={{ color: "#212529" }}>{pageTitle}</h1>
            </div>
          </div>
          <a href="https://api.whatsapp.com/send?phone=5585986894081&text=Olá%2C%20preciso%20de%20ajuda%20para%20encontrar%20uma%20peça!" target="_blank" rel="noopener noreferrer">
            <button className="mm-btn-tactile flex items-center gap-2 px-4 h-9 text-xs font-mono-tech flex-shrink-0" style={{
              background: "rgba(22,163,74,0.12)", border: "1px solid rgba(22,163,74,0.35)", color: "#4ADE80", borderRadius: "2px"
            }}>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.533 5.855L0 24l6.335-1.51A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.895 0-3.67-.524-5.195-1.43l-.372-.22-3.763.897.944-3.658-.242-.376A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
              NÃO ACHOU? FALAR COM ESPECIALISTA
            </button>
          </a>
        </div>

        {/* ── CATEGORY GRID (shown when no category selected) ── */}
        {!selectedCategoria && !searchText && (
          <div className="mb-6">
            <CategoriaGrid onSelectCategory={(cat) => { setSelectedCategoria(cat); setPage(1); }} />
          </div>
        )}

        <div className="flex gap-5 items-start" style={{ display: selectedCategoria || searchText ? "flex" : "none" }}>

          {/* ── SIDEBAR DESKTOP ── */}
          <aside
            className="hidden md:block flex-shrink-0 sticky top-20 self-start overflow-y-auto"
            style={{
              width: 230, background: "#FFFFFF",
              border: "1px solid #E2E8F0", borderRadius: "4px",
              padding: "18px 14px", maxHeight: "calc(100vh - 100px)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <CatalogoSidebar {...sidebarProps} />
          </aside>

          {/* ── MOBILE DRAWER ── */}
          {mobileDrawerOpen && (
            <>
              <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.75)" }} onClick={() => setMobileDrawerOpen(false)} />
              <div className="fixed inset-y-0 left-0 z-50 overflow-y-auto" style={{ width: 280, background: "#FFFFFF", borderRight: "1px solid #E2E8F0", padding: "18px 14px" }}>
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchText) {
                      analytics.search(searchText, { categoria: selectedLinha, tipo: selectedTipo });
                    }
                  }}
                  className="w-full h-9 pl-9 pr-7 text-xs font-mono-tech focus:outline-none"
                  style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#212529" }}
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
                  style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#6C757D", minWidth: 100 }}
                >
                  <option value="az">A → Z</option>
                  <option value="za">Z → A</option>
                  <option value="sku_asc">SKU ↑</option>
                  <option value="sku_desc">SKU ↓</option>
                </select>
              </div>

              {/* Mobile filter btn */}
              <button
                className="md:hidden flex items-center gap-1.5 px-3 h-9 text-xs font-mono-tech flex-shrink-0"
                style={{ background: hasFilters ? "rgba(211,47,47,0.08)" : "#FFFFFF", border: hasFilters ? "1px solid rgba(211,47,47,0.3)" : "1px solid #E2E8F0", color: hasFilters ? "#D32F2F" : "#6C757D", borderRadius: "2px" }}
                onClick={() => setMobileDrawerOpen(true)}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                FILTROS
                {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
              </button>

              {/* Count */}
              <span className="text-xs font-mono-tech ml-auto flex-shrink-0" style={{ color: "#9CA3AF" }}>
                {loading ? "CARREGANDO..." : `${filtered.length} ITENS · P.${page}/${Math.max(1, totalPages)}`}
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
                  <div key={i} className="h-56 animate-pulse" style={{ background: "#E2E8F0", borderRadius: "4px" }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-mono-tech text-sm mb-2" style={{ color: "#212529" }}>NENHUMA PEÇA ENCONTRADA</p>
                <p className="text-xs mb-4" style={{ color: "#6C757D" }}>Tente outros filtros ou limpe a seleção</p>
                <button onClick={clearFilters} className="px-4 h-9 text-xs font-mono-tech mm-btn-tactile" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#6C757D", borderRadius: "2px" }}>
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
                      className="px-3 h-8 text-xs font-mono-tech disabled:opacity-30 mm-btn-tactile"
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
                          className="w-8 h-8 text-xs font-mono-tech mm-btn-tactile"
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
                      className="px-3 h-8 text-xs font-mono-tech disabled:opacity-30 mm-btn-tactile"
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
      </>)}
      </div>
    </div>
    </>
  );
}
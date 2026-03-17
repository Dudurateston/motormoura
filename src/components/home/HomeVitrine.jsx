import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { analytics } from "@/components/analytics/analytics";
import { apiCache } from "@/lib/apiCache";
import LazyImage from "@/components/LazyImage";

function addToCart(produto) {
  const stored = localStorage.getItem("motormoura_cart");
  const cart = stored ? JSON.parse(stored) : [];
  const idx = cart.findIndex((i) => i.sku_codigo === produto.sku_codigo);
  if (idx >= 0) cart[idx].quantidade += 1;
  else cart.push({ sku_codigo: produto.sku_codigo, nome_peca: produto.nome_peca, quantidade: 1 });
  localStorage.setItem("motormoura_cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
  analytics.productAddToCart(produto, 1);
}

function filterByCategory(produtos, tab) {
  const cat = tab.toLowerCase();
  return produtos.filter((p) => {
    const rel = (p.relacionamento_categoria || "").toLowerCase();
    if (cat === "peças de alto giro") return p.destaque === true;
    if (cat === "motores estacionários") return rel.includes("gasolina") || rel.includes("diesel") || rel.includes("motor");
    if (cat === "geradores") return rel.includes("gerador");
    if (cat === "motobombas") return rel.includes("motobomba");
    return false;
  }).filter((p) => p.ativo !== false).slice(0, 12);
}

export default function HomeVitrine({ title, emoji, tabs, singleTab }) {
  const [produtos, setProdutos] = useState([]);
  const [activeTab, setActiveTab] = useState(tabs ? tabs[0] : singleTab);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    apiCache
      .get("produtos_vitrine", () => base44.entities.Produtos.list("-created_date", 500))
      .then((p) => { setProdutos(p); setLoading(false); });
  }, []);

  const displayed = filterByCategory(produtos, activeTab);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <section className="py-12 px-4" style={{ background: "#F8F9FA" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-[2px]" style={{ background: "#D32F2F" }} />
              <h2 className="text-lg font-bold font-mono-tech" style={{ color: "#212529" }}>
                {emoji && <span className="mr-1">{emoji}</span>}{title}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {tabs && tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 h-8 text-xs font-mono-tech transition-all"
                style={{
                  background: activeTab === tab ? "#D32F2F" : "#FFFFFF",
                  color: activeTab === tab ? "#fff" : "#6C757D",
                  border: activeTab === tab ? "1px solid #D32F2F" : "1px solid #E2E8F0",
                  borderRadius: "2px",
                }}
              >
                {tab}
              </button>
            ))}
            <button onClick={() => scroll(-1)} className="w-8 h-8 flex items-center justify-center" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "2px" }}>
              <ChevronLeft className="w-4 h-4" style={{ color: "#6C757D" }} />
            </button>
            <button onClick={() => scroll(1)} className="w-8 h-8 flex items-center justify-center" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "2px" }}>
              <ChevronRight className="w-4 h-4" style={{ color: "#6C757D" }} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        {loading ? (
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-64 h-56 animate-pulse rounded" style={{ background: "#E2E8F0" }} />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm font-mono-tech" style={{ color: "#9CA3AF" }}>NENHUM PRODUTO ENCONTRADO</p>
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-2"
            style={{ scrollbarWidth: "none" }}
          >
            {displayed.map((produto) => (
              <div
                key={produto.id}
                className="flex-shrink-0 flex flex-col"
                style={{
                  width: 220, background: "#FFFFFF",
                  border: "1px solid #E2E8F0", borderRadius: "4px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <LazyImage
                  src={produto.imagem_url}
                  alt={produto.nome_peca}
                  style={{ height: 144, borderRadius: "4px 4px 0 0", background: "#F8F9FA" }}
                  placeholder={<div className="flex items-center justify-center h-full"><ShoppingCart className="w-10 h-10" style={{ color: "#E2E8F0" }} /></div>}
                />
                <div className="p-3 flex flex-col flex-1">
                  <p className="text-[10px] font-mono-tech mb-1" style={{ color: "#1D4ED8" }}>SKU: {produto.sku_codigo}</p>
                  <p className="text-xs font-semibold mb-3 flex-1 line-clamp-2" style={{ color: "#212529", lineHeight: 1.4 }}>{produto.nome_peca}</p>
                  <button
                    onClick={() => addToCart(produto)}
                    className="w-full h-8 text-xs font-mono-tech font-bold mm-btn-tactile"
                    style={{ background: "#D32F2F", color: "#fff", border: "none", borderRadius: "2px" }}
                  >
                    + ORÇAMENTO
                  </button>
                </div>
              </div>
            ))}
            {/* Ver todos */}
            <Link
              to={createPageUrl("Catalogo") + (activeTab === "Peças de Alto Giro" ? "" : `?q=${encodeURIComponent(activeTab)}`)}
              className="flex-shrink-0 flex flex-col items-center justify-center gap-2 w-40"
              style={{ background: "#FFFFFF", border: "1px dashed #E2E8F0", borderRadius: "4px" }}
            >
              <ChevronRight className="w-6 h-6" style={{ color: "#D32F2F" }} />
              <span className="text-xs font-mono-tech text-center" style={{ color: "#6C757D" }}>VER TODOS</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
import React, { useState, useEffect } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function KitsCarousel() {
  const [produtos, setProdutos] = useState([]);
  const [offset, setOffset] = useState(0);
  const [added, setAdded] = useState({});

  useEffect(() => {
    base44.entities.Produtos.filter({ relacionamento_categoria: "Peças de Giro Rápido e Reposição" }, "nome_peca", 20).then(setProdutos);
  }, []);

  const displayItems = produtos.slice(0, 8);
  const visible = 3;
  const maxOffset = Math.max(0, displayItems.length - visible);

  const addToCart = (produto) => {
    const qty = 50;
    const stored = localStorage.getItem("motormoura_cart");
    const cart = stored ? JSON.parse(stored) : [];
    const idx = cart.findIndex(i => i.sku_codigo === produto.sku_codigo);
    if (idx >= 0) cart[idx].quantidade += qty;
    else cart.push({ sku_codigo: produto.sku_codigo, nome_peca: produto.nome_peca, quantidade: qty });
    localStorage.setItem("motormoura_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    setAdded(prev => ({ ...prev, [produto.id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [produto.id]: false })), 2000);
  };

  if (displayItems.length === 0) return null;

  return (
    <section className="py-16 px-4" style={{ background: "#F8F9FA", borderTop: "1px solid #E2E8F0" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-[2px]" style={{ background: "#D32F2F" }} />
              <span className="text-xs font-mono-tech" style={{ color: "#D32F2F", letterSpacing: "0.15em" }}>PEÇAS DE GIRO RÁPIDO · CARRO-CHEFE</span>
            </div>
            <h2 className="text-2xl font-bold font-mono-tech" style={{ color: "#212529" }}>Produtos Carro-Chefe</h2>
            <p className="mt-1" style={{ color: "#6C757D", fontSize: "16px", fontWeight: 400 }}>
              Itens de maior saída — adicione à cotação com 1 clique.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setOffset(Math.max(0, offset - 1))}
              disabled={offset === 0}
              className="w-9 h-9 flex items-center justify-center mm-btn-tactile"
              style={{
                background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "2px",
                color: offset === 0 ? "#CBD5E1" : "#6C757D",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setOffset(Math.min(maxOffset, offset + 1))}
              disabled={offset >= maxOffset}
              className="w-9 h-9 flex items-center justify-center mm-btn-tactile"
              style={{
                background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "2px",
                color: offset >= maxOffset ? "#CBD5E1" : "#6C757D",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex gap-4 transition-transform duration-400"
            style={{ transform: `translateX(calc(-${offset} * (100% / ${visible} + 16px / ${visible})))` }}
          >
            {displayItems.map((produto) => (
              <div key={produto.id} className="flex-shrink-0"
                style={{ width: `calc(${100 / visible}% - ${(16 * (visible - 1)) / visible}px)` }}>
                <div className="p-4 relative" style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: "4px",
                  boxShadow: "0 2px 8px rgba(226,232,240,0.9)",
                }}>
                  <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #D32F2F, transparent)" }} />

                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="font-semibold text-sm leading-snug" style={{ color: "#212529" }}>
                        {produto.nome_peca}
                      </p>
                      <span className="text-xs font-mono-tech mt-1 inline-block px-2 py-0.5" style={{
                        background: "rgba(29,78,216,0.08)", border: "1px solid rgba(29,78,216,0.2)",
                        color: "#1D4ED8", borderRadius: "2px",
                      }}>
                        {produto.sku_codigo}
                      </span>
                    </div>
                    <div className="flex-shrink-0 px-2 py-1 font-mono-tech text-xs font-bold" style={{
                      background: "rgba(211,47,47,0.08)", border: "1px solid rgba(211,47,47,0.2)",
                      color: "#D32F2F", borderRadius: "2px",
                    }}>
                      ×50
                    </div>
                  </div>

                  <p className="text-sm mb-4" style={{ color: "#6C757D" }}>{produto.relacionamento_marca} · {produto.relacionamento_categoria?.split(" ")[0]}</p>

                  <button
                    onClick={() => addToCart(produto)}
                    className="w-full h-9 flex items-center justify-center gap-1.5 text-xs font-mono-tech font-bold mm-btn-tactile"
                    style={{
                      background: added[produto.id]
                        ? "linear-gradient(135deg, #16A34A, #15803D)"
                        : "linear-gradient(135deg, #D32F2F, #B71C1C)",
                      color: "#fff", borderRadius: "2px", border: "none",
                      transition: "background 0.3s ease",
                    }}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    {added[produto.id] ? "ADICIONADO ✓" : "COTAR 50 UNID."}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
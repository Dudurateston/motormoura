import React, { useState, useEffect } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { base44 } from "@/api/base44Client";

const QUICK_SKUS = [
  "ESCOVA-001", "AGULHA-001", "CONECT-001", "RETENTOR-001", "FILTRO-AR-001",
  "VELA-001", "DIAFRAGMA-001", "ORING-KIT-001",
];

export default function KitsCarousel() {
  const [produtos, setProdutos] = useState([]);
  const [offset, setOffset] = useState(0);
  const [added, setAdded] = useState({});

  useEffect(() => {
    base44.entities.Produtos.list("-created_date", 20).then(p => {
      const giro = p.filter(x => x.relacionamento_categoria === "Peças de Giro Rápido e Reposição");
      setProdutos(giro.length > 0 ? giro : p.slice(0, 12));
    });
  }, []);

  const displayItems = produtos.length > 0 ? produtos.slice(0, 8) : [];
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
    <section className="py-16 px-4" style={{ background: "linear-gradient(145deg, #17171A, #1F1F23)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-[2px]" style={{ background: "#FB923C" }} />
              <span className="text-xs font-mono-tech" style={{ color: "#FB923C", letterSpacing: "0.15em" }}>ALTO GIRO B2B</span>
            </div>
            <h2 className="text-2xl font-bold font-mono-tech" style={{ color: "#F3F4F6" }}>
              Kits de Alto Giro B2B
            </h2>
            <p className="mt-1" style={{ color: "#9CA3AF", fontSize: "16px", fontWeight: 400 }}>
              Peças de grande saída — adicione 50 unidades com 1 clique.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setOffset(Math.max(0, offset - 1))}
              disabled={offset === 0}
              className="w-9 h-9 flex items-center justify-center mm-btn-tactile"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "2px",
                color: offset === 0 ? "#374151" : "#9CA3AF",
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setOffset(Math.min(maxOffset, offset + 1))}
              disabled={offset >= maxOffset}
              className="w-9 h-9 flex items-center justify-center mm-btn-tactile"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "2px",
                color: offset >= maxOffset ? "#374151" : "#9CA3AF",
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
              <div
                key={produto.id}
                className="flex-shrink-0"
                style={{ width: `calc(${100 / visible}% - ${(16 * (visible - 1)) / visible}px)` }}
              >
                <div
                  className="p-4 relative"
                  style={{
                    background: "linear-gradient(145deg, #27272C, #1F1F23)",
                    border: "1px solid rgba(251,146,60,0.15)",
                    borderRadius: "4px",
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #FB923C, transparent)" }} />
                  
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="font-semibold text-sm leading-snug" style={{ color: "#F3F4F6" }}>
                        {produto.nome_peca}
                      </p>
                      <span
                        className="text-xs font-mono-tech mt-1 inline-block px-2 py-0.5"
                        style={{
                          background: "rgba(29,78,216,0.25)",
                          border: "1px solid rgba(29,78,216,0.5)",
                          color: "#93C5FD",
                          borderRadius: "2px",
                        }}
                      >
                        {produto.sku_codigo}
                      </span>
                    </div>
                    <div
                      className="flex-shrink-0 px-2 py-1 font-mono-tech text-xs font-bold"
                      style={{
                        background: "rgba(251,146,60,0.15)",
                        border: "1px solid rgba(251,146,60,0.3)",
                        color: "#FB923C",
                        borderRadius: "2px",
                      }}
                    >
                      ×50
                    </div>
                  </div>

                  <p className="text-sm mb-4" style={{ color: "#6B7280" }}>{produto.relacionamento_marca} · {produto.relacionamento_categoria?.split(" ")[0]}</p>

                  <button
                    onClick={() => addToCart(produto)}
                    className="w-full h-9 flex items-center justify-center gap-1.5 text-xs font-mono-tech font-bold mm-btn-tactile"
                    style={{
                      background: added[produto.id]
                        ? "linear-gradient(135deg, #16A34A, #15803D)"
                        : "linear-gradient(135deg, #FB923C, #EA7C28)",
                      color: "#fff",
                      borderRadius: "2px",
                      border: "none",
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
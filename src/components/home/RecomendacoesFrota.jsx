import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Wrench, ChevronRight, ShoppingCart, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { apiCache } from "@/lib/apiCache";
import LazyImage from "@/components/LazyImage";

const TIPO_TO_CATALOG = {
  "Motor Estacionário": "Motores a Gasolina",
  "Gerador": "Geradores 4 Tempos",
  "Motobomba": "Motobombas 4 Tempos",
  "Máquina Agrícola": "Motores a Gasolina",
  "Compactador de Solo": "Motores a Gasolina",
};

function addToCart(produto) {
  const stored = localStorage.getItem("motormoura_cart");
  const cart = stored ? JSON.parse(stored) : [];
  const idx = cart.findIndex((i) => i.sku_codigo === produto.sku_codigo);
  if (idx >= 0) cart[idx].quantidade += 1;
  else cart.push({ sku_codigo: produto.sku_codigo, nome_peca: produto.nome_peca, quantidade: 1 });
  localStorage.setItem("motormoura_cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
}

// Match produto com equipamentos da garagem (por marca e categoria)
function matchProduto(produto, garagem) {
  return garagem.some((equip) => {
    const catMatch = TIPO_TO_CATALOG[equip.tipo_normalizado] === produto.relacionamento_categoria;
    const marcaMatch = equip.marca && equip.marca !== "Outra" &&
      (produto.relacionamento_marca || "").toLowerCase().includes(equip.marca.toLowerCase());
    return catMatch || marcaMatch;
  });
}

export default function RecomendacoesFrota() {
  const [user, setUser] = useState(null);
  const [garagem, setGaragem] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const load = async () => {
      // Cache do lojista por email
      if (!_cachedLojista[user.email]) {
        const lojistas = await base44.entities.Lojistas.filter({ user_email: user.email });
        _cachedLojista[user.email] = lojistas[0] || null;
      }
      const l = _cachedLojista[user.email];
      const g = l?.garagem || [];
      setGaragem(g);

      if (g.length > 0) {
        // Cache dos produtos
        if (!_cachedProdutos) {
          _cachedProdutos = await base44.entities.Produtos.list("-created_date", 2000);
        }
        const matched = _cachedProdutos.filter(p => p.ativo !== false && matchProduto(p, g));
        setProdutos(matched.slice(0, 8));
      }
      setLoading(false);
    };

    load();
  }, [user]);

  // Não renderiza se não logado, sem garagem ou sem matches
  if (!user || loading || garagem.length === 0 || produtos.length === 0) return null;

  return (
    <section style={{ background: "#FFFFFF", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-[2px]" style={{ background: "#D32F2F" }} />
              <span className="text-xs font-mono-tech tracking-widest" style={{ color: "#D32F2F" }}>
                PERSONALIZADO PARA SUA FROTA
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-bold font-mono-tech" style={{ color: "#212529" }}>
              Recomendações para sua Frota
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
              Baseado nos {garagem.length} equipamento(s) da sua garagem
            </p>
          </div>
          <Link to={createPageUrl("MinhaConta") + "?tab=garagem"}>
            <button className="hidden sm:flex items-center gap-1.5 h-8 px-3 text-xs font-mono-tech mm-btn-tactile"
              style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", color: "#6C757D", borderRadius: "2px" }}>
              <Wrench className="w-3 h-3" /> Editar Garagem
            </button>
          </Link>
        </div>

        {/* Chips dos equipamentos */}
        <div className="flex flex-wrap gap-2 mb-5">
          {garagem.map((equip) => (
            <span key={equip.id} className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono-tech"
              style={{ background: "rgba(211,47,47,0.06)", border: "1px solid rgba(211,47,47,0.18)", color: "#D32F2F", borderRadius: "2px" }}>
              <Wrench className="w-3 h-3" />
              {equip.apelido || [equip.marca !== "Outra" ? equip.marca : null, equip.modelo].filter(Boolean).join(" ") || equip.tipo_normalizado}
            </span>
          ))}
        </div>

        {/* Grid de produtos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {produtos.map((produto) => (
            <div key={produto.id} className="flex flex-col"
              style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "4px", overflow: "hidden" }}>
              {/* Imagem */}
              <div className="aspect-square flex items-center justify-center"
                style={{ background: "#FFFFFF", borderBottom: "1px solid #F1F5F9" }}>
                {produto.imagem_url ? (
                  <img src={produto.imagem_url} alt={produto.nome_peca}
                    className="w-full h-full object-contain p-3" />
                ) : (
                  <Package className="w-10 h-10" style={{ color: "#E2E8F0" }} />
                )}
              </div>
              {/* Info */}
              <div className="p-3 flex flex-col flex-1">
                <p className="text-xs font-mono-tech mb-0.5" style={{ color: "#1D4ED8" }}>{produto.sku_codigo}</p>
                <p className="text-sm font-medium leading-snug flex-1" style={{ color: "#212529" }}>
                  {produto.nome_peca}
                </p>
                {produto.relacionamento_marca && (
                  <p className="text-xs font-mono-tech mt-1" style={{ color: "#9CA3AF" }}>{produto.relacionamento_marca}</p>
                )}
                {/* CTA */}
                <button
                  onClick={() => addToCart(produto)}
                  className="mt-3 w-full h-8 flex items-center justify-center gap-1.5 text-xs font-mono-tech font-bold mm-btn-tactile"
                  style={{ background: "rgba(211,47,47,0.08)", border: "1px solid rgba(211,47,47,0.25)", color: "#D32F2F", borderRadius: "2px" }}
                >
                  <ShoppingCart className="w-3 h-3" /> COTAR
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Ver todos */}
        <div className="text-center mt-5">
          <Link to={createPageUrl("Catalogo")}>
            <button className="flex items-center gap-2 mx-auto h-9 px-6 text-xs font-mono-tech font-bold mm-btn-tactile"
              style={{ background: "#212529", color: "#FFFFFF", borderRadius: "2px", border: "none" }}>
              VER CATÁLOGO COMPLETO <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
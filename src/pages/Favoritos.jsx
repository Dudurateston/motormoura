import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Heart, Trash2, ShoppingCart, ArrowLeft, Package } from "lucide-react";
import SEOHead from "../components/SEOHead";
import { analytics } from "@/components/analytics/analytics";

export default function Favoritos() {
  const [user, setUser] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [produtos, setProdutos] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(async (u) => {
      setUser(u);
      if (u) {
        const favs = await base44.entities.Favoritos.filter({ user_email: u.email });
        setFavoritos(favs || []);
        
        // Buscar detalhes dos produtos
        const prodIds = [...new Set(favs.map(f => f.produto_id))];
        const prods = await Promise.all(
          prodIds.map(id => base44.entities.Produtos.filter({ id }).then(r => r[0]))
        );
        const prodsMap = {};
        prods.forEach(p => { if (p) prodsMap[p.id] = p; });
        setProdutos(prodsMap);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }).catch(() => {
      setUser(null);
      setLoading(false);
    });
  }, []);

  const removerFavorito = async (favId) => {
    await base44.entities.Favoritos.delete(favId);
    setFavoritos(favoritos.filter(f => f.id !== favId));
  };

  const adicionarAoCarrinho = (produto) => {
    const stored = localStorage.getItem("motormoura_cart");
    const cart = stored ? JSON.parse(stored) : [];
    const idx = cart.findIndex(i => i.sku_codigo === produto.sku_codigo);
    if (idx >= 0) cart[idx].quantidade += 1;
    else cart.push({ sku_codigo: produto.sku_codigo, nome_peca: produto.nome_peca, quantidade: 1 });
    localStorage.setItem("motormoura_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    analytics.productAddToCart(produto, 1);
  };

  if (loading) {
    return (
      <div className="mm-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-red-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-mono-tech" style={{ color: "#6C757D" }}>CARREGANDO...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mm-bg min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <Heart className="w-16 h-16 mx-auto mb-4" style={{ color: "#E2E8F0" }} />
          <h2 className="text-lg font-bold font-mono-tech mb-2" style={{ color: "#212529" }}>
            FAÇA LOGIN PARA VER FAVORITOS
          </h2>
          <p className="text-sm mb-6" style={{ color: "#6C757D" }}>
            Salve peças de interesse para consultar depois
          </p>
          <button
            onClick={() => base44.auth.redirectToLogin()}
            className="h-10 px-6 text-sm font-mono-tech font-bold mm-btn-tactile"
            style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "#fff", borderRadius: "2px", border: "none" }}
          >
            ENTRAR
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mm-bg min-h-screen">
      <SEOHead 
        title="Meus Favoritos | MotorMoura"
        description="Peças salvas para consultar depois"
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to={createPageUrl("Catalogo")}>
            <button className="flex items-center gap-1.5 h-9 px-3 text-xs font-mono-tech mm-btn-tactile"
              style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#6C757D", borderRadius: "2px" }}>
              <ArrowLeft className="w-3.5 h-3.5" /> CATÁLOGO
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" style={{ color: "#D32F2F" }} />
              <span className="text-xs font-mono-tech" style={{ color: "#D32F2F", letterSpacing: "0.15em" }}>FAVORITOS</span>
            </div>
            <h1 className="text-xl font-bold font-mono-tech" style={{ color: "#212529" }}>Peças Salvas</h1>
          </div>
        </div>

        {favoritos.length === 0 ? (
          <div className="text-center py-12" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
            <Heart className="w-12 h-12 mx-auto mb-3" style={{ color: "#E2E8F0" }} />
            <p className="text-sm font-mono-tech mb-1" style={{ color: "#6C757D" }}>
              NENHUMA PEÇA FAVORITADA
            </p>
            <p className="text-xs mb-6" style={{ color: "#9CA3AF" }}>
              Clique no ícone de coração nos produtos do catálogo
            </p>
            <Link to={createPageUrl("Catalogo")}>
              <button className="h-10 px-6 text-sm font-mono-tech font-bold mm-btn-tactile"
                style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "#fff", borderRadius: "2px", border: "none" }}>
                IR AO CATÁLOGO
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoritos.map(fav => {
              const produto = produtos[fav.produto_id];
              if (!produto) return null;

              return (
                <div key={fav.id} className="p-4 transition-all hover:shadow-lg"
                  style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
                  
                  {/* Image */}
                  <div className="relative mb-3 aspect-square" style={{ background: "#F8F9FA", borderRadius: "2px" }}>
                    {produto.imagem_url ? (
                      <img src={produto.imagem_url} alt={produto.nome_peca} className="w-full h-full object-contain p-4" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12" style={{ color: "#E2E8F0" }} />
                      </div>
                    )}
                    <button
                      onClick={() => removerFavorito(fav.id)}
                      className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center mm-btn-tactile"
                      style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "2px" }}
                    >
                      <Trash2 className="w-3.5 h-3.5" style={{ color: "#DC2626" }} />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      {produto.relacionamento_marca && (
                        <span className="text-xs px-2 py-0.5 font-mono-tech"
                          style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.3)", color: "#FB923C", borderRadius: "2px" }}>
                          {produto.relacionamento_marca}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold mb-1 line-clamp-2" style={{ color: "#212529" }}>
                      {produto.nome_peca}
                    </h3>
                    <p className="text-xs font-mono-tech" style={{ color: "#1D4ED8" }}>
                      SKU: {produto.sku_codigo}
                    </p>
                  </div>

                  {/* Price */}
                  {produto.preco_base_atacado > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-mono-tech" style={{ color: "#6C757D" }}>ATACADO</p>
                      <p className="text-lg font-bold font-mono-tech" style={{ color: "#16A34A" }}>
                        R$ {Number(produto.preco_base_atacado).toFixed(2)}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link to={`${createPageUrl("ProdutoDetalhe")}?id=${produto.id}`} className="flex-1">
                      <button className="w-full h-9 text-xs font-mono-tech mm-btn-tactile"
                        style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", color: "#6C757D", borderRadius: "2px" }}>
                        VER DETALHES
                      </button>
                    </Link>
                    <button
                      onClick={() => adicionarAoCarrinho(produto)}
                      className="flex-1 h-9 flex items-center justify-center gap-2 text-xs font-mono-tech font-bold mm-btn-tactile"
                      style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "#fff", borderRadius: "2px", border: "none" }}>
                      <ShoppingCart className="w-3.5 h-3.5" />
                      ADICIONAR
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
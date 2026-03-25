import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Heart, ShoppingCart, Trash2, ExternalLink, Package, CheckCircle2 } from "lucide-react";

export default function FavoritosTab({ user }) {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartSkus, setCartSkus] = useState(new Set());
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    if (!user) return;
    base44.entities.Favoritos.filter({ user_email: user.email })
      .then((data) => { setFavoritos(data || []); setLoading(false); });

    const syncCart = () => {
      const stored = localStorage.getItem("motormoura_cart");
      const cart = stored ? JSON.parse(stored) : [];
      setCartSkus(new Set(cart.map((i) => i.sku_codigo)));
    };
    syncCart();
    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, [user]);

  const remover = async (id) => {
    await base44.entities.Favoritos.delete(id);
    setFavoritos((f) => f.filter((item) => item.id !== id));
  };

  const addToCart = (fav) => {
    const stored = localStorage.getItem("motormoura_cart");
    const cart = stored ? JSON.parse(stored) : [];
    const exists = cart.find((i) => i.sku_codigo === fav.produto_sku);
    let updated;
    if (exists) {
      updated = cart.map((i) => i.sku_codigo === fav.produto_sku ? { ...i, quantidade: i.quantidade + 1 } : i);
    } else {
      updated = [...cart, { sku_codigo: fav.produto_sku, nome_peca: fav.produto_nome, quantidade: 1 }];
    }
    localStorage.setItem("motormoura_cart", JSON.stringify(updated));
    setCartSkus(new Set(updated.map((i) => i.sku_codigo)));
    window.dispatchEvent(new Event("cartUpdated"));
    setAddedId(fav.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#D32F2F", borderTopColor: "transparent" }} />
    </div>
  );

  if (favoritos.length === 0) return (
    <div className="py-12 text-center" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
      <Heart className="w-12 h-12 mx-auto mb-3" style={{ color: "#E2E8F0" }} />
      <p className="text-sm font-mono-tech mb-1" style={{ color: "#6C757D" }}>NENHUM FAVORITO AINDA</p>
      <p className="text-xs mb-5" style={{ color: "#9CA3AF" }}>Toque no ♥ em qualquer produto do catálogo para guardar aqui</p>
      <Link to={createPageUrl("Catalogo")}>
        <button className="h-9 px-5 text-sm font-mono-tech font-bold mm-btn-tactile"
          style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "#fff", borderRadius: "2px", border: "none" }}>
          VER CATÁLOGO
        </button>
      </Link>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono-tech" style={{ color: "#9CA3AF" }}>{favoritos.length} ITEM(S) FAVORITADO(S)</p>
        <p className="text-xs" style={{ color: "#9CA3AF" }}>
          {cartSkus.size > 0 && `${[...cartSkus].filter(sku => favoritos.some(f => f.produto_sku === sku)).length} já no carrinho`}
        </p>
      </div>

      {favoritos.map((fav) => {
        const inCart = cartSkus.has(fav.produto_sku);
        const justAdded = addedId === fav.id;
        return (
          <div key={fav.id} className="flex items-center gap-3 p-4 transition-all"
            style={{ background: "#FFFFFF", border: `1px solid ${inCart ? "rgba(22,163,74,0.25)" : "#E2E8F0"}`, borderRadius: "4px" }}>
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(211,47,47,0.06)", border: "1px solid rgba(211,47,47,0.15)", borderRadius: "2px" }}>
              <Package className="w-4 h-4" style={{ color: "#D32F2F" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: "#212529" }}>{fav.produto_nome}</p>
              <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                <span className="text-xs font-mono-tech" style={{ color: "#1D4ED8" }}>SKU: {fav.produto_sku}</span>
                {fav.produto_marca && <span className="text-xs" style={{ color: "#6C757D" }}>{fav.produto_marca}</span>}
                {fav.produto_categoria && <span className="text-xs" style={{ color: "#6C757D" }}>{fav.produto_categoria}</span>}
                {inCart && !justAdded && (
                  <span className="text-xs font-mono-tech" style={{ color: "#16A34A" }}>✓ no carrinho</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Link to={`${createPageUrl("ProdutoDetalhe")}?id=${fav.produto_id}`}>
                <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors" style={{ borderRadius: "2px", color: "#6C757D" }}>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </Link>
              <button onClick={() => addToCart(fav)}
                className="w-8 h-8 flex items-center justify-center transition-colors"
                style={{ borderRadius: "2px", color: justAdded ? "#16A34A" : "#1D4ED8", background: justAdded ? "rgba(22,163,74,0.1)" : "transparent" }}>
                {justAdded ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
              </button>
              <button onClick={() => remover(fav.id)} className="w-8 h-8 flex items-center justify-center hover:bg-red-50 transition-colors" style={{ borderRadius: "2px", color: "#9CA3AF" }}>
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
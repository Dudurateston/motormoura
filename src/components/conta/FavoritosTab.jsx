import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Heart, ShoppingCart, Trash2, ExternalLink, Package } from "lucide-react";

export default function FavoritosTab({ user }) {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    base44.entities.Favoritos.filter({ user_email: user.email })
      .then((data) => { setFavoritos(data || []); setLoading(false); });
  }, [user]);

  const remover = async (id) => {
    await base44.entities.Favoritos.delete(id);
    setFavoritos((f) => f.filter((item) => item.id !== id));
  };

  const addToCart = (fav) => {
    const stored = localStorage.getItem("motormoura_cart");
    const cart = stored ? JSON.parse(stored) : [];
    const exists = cart.find((i) => i.sku_codigo === fav.produto_sku);
    if (exists) {
      const updated = cart.map((i) => i.sku_codigo === fav.produto_sku ? { ...i, quantidade: i.quantidade + 1 } : i);
      localStorage.setItem("motormoura_cart", JSON.stringify(updated));
    } else {
      const item = { sku_codigo: fav.produto_sku, nome_peca: fav.produto_nome, quantidade: 1 };
      localStorage.setItem("motormoura_cart", JSON.stringify([...cart, item]));
    }
    window.dispatchEvent(new Event("cartUpdated"));
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
      <p className="text-xs mb-5" style={{ color: "#9CA3AF" }}>Adicione peças aos favoritos no catálogo para acessar rapidamente</p>
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
      <p className="text-xs font-mono-tech" style={{ color: "#9CA3AF" }}>{favoritos.length} ITEM(S) FAVORITADO(S)</p>
      {favoritos.map((fav) => (
        <div key={fav.id} className="flex items-center gap-3 p-4"
          style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
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
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link to={`${createPageUrl("ProdutoDetalhe")}?id=${fav.produto_id}`}>
              <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors" style={{ borderRadius: "2px", color: "#6C757D" }}>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </Link>
            <button onClick={() => addToCart(fav)} className="w-8 h-8 flex items-center justify-center hover:bg-blue-50 transition-colors" style={{ borderRadius: "2px", color: "#1D4ED8" }}>
              <ShoppingCart className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => remover(fav.id)} className="w-8 h-8 flex items-center justify-center hover:bg-red-50 transition-colors" style={{ borderRadius: "2px", color: "#9CA3AF" }}>
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
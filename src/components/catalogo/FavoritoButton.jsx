import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Heart } from "lucide-react";

export default function FavoritoButton({ produto, className = "" }) {
  const [user, setUser] = useState(null);
  const [isFavorito, setIsFavorito] = useState(false);
  const [favoritoId, setFavoritoId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    base44.auth.me().then(async (u) => {
      setUser(u);
      if (u) {
        const favs = await base44.entities.Favoritos.filter({ 
          user_email: u.email, 
          produto_id: produto.id 
        });
        if (favs.length > 0) {
          setIsFavorito(true);
          setFavoritoId(favs[0].id);
        }
      }
    }).catch(() => setUser(null));
  }, [produto.id]);

  const toggleFavorito = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      base44.auth.redirectToLogin();
      return;
    }

    setLoading(true);
    
    if (isFavorito && favoritoId) {
      await base44.entities.Favoritos.delete(favoritoId);
      setIsFavorito(false);
      setFavoritoId(null);
    } else {
      const novoFav = await base44.entities.Favoritos.create({
        user_email: user.email,
        produto_id: produto.id,
        produto_sku: produto.sku_codigo,
        produto_nome: produto.nome_peca,
        produto_marca: produto.relacionamento_marca || "",
        produto_categoria: produto.relacionamento_categoria || ""
      });
      setIsFavorito(true);
      setFavoritoId(novoFav.id);
    }
    
    setLoading(false);
  };

  return (
    <button
      onClick={toggleFavorito}
      disabled={loading}
      className={`w-8 h-8 flex items-center justify-center mm-btn-tactile transition-all ${className}`}
      style={{
        background: isFavorito ? "rgba(220,38,38,0.15)" : "rgba(255,255,255,0.9)",
        border: isFavorito ? "1px solid rgba(220,38,38,0.4)" : "1px solid rgba(226,232,240,0.8)",
        borderRadius: "2px",
        backdropFilter: "blur(4px)"
      }}
    >
      <Heart 
        className="w-4 h-4 transition-all" 
        style={{ 
          color: isFavorito ? "#DC2626" : "#9CA3AF",
          fill: isFavorito ? "#DC2626" : "none"
        }} 
      />
    </button>
  );
}
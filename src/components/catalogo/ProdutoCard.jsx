import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ShoppingCart, Zap, AlertTriangle, Plus, Minus, ExternalLink } from "lucide-react";
import LazyImage from "@/components/LazyImage";
import FavoritoButton from "./FavoritoButton";

export default function ProdutoCard({ produto, onAddToCart }) {
  const [quantidade, setQuantidade] = useState(1);
  const [pressed, setPressed] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);

  const hasEletric = produto.especificacoes_eletricas &&
    Object.values(produto.especificacoes_eletricas).some(v => v && v.trim?.() !== "");

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -6, y: dx * 6 });
  };

  const handleMouseLeave = () => { setTilt({ x: 0, y: 0 }); setHovered(false); };

  const handleAdd = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 150);
    onAddToCart(produto, quantidade);
    setQuantidade(1);
  };

  return (
    <div
      ref={cardRef}
      className="mm-card relative flex flex-col overflow-hidden cursor-default"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "4px",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.10)" : "0 2px 8px rgba(226,232,240,0.9)",
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: hovered ? "transform 0.1s ease-out, box-shadow 0.3s ease" : "transform 0.4s ease, box-shadow 0.3s ease",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top accent line */}
      <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg, #1D4ED8, #D32F2F, #1D4ED8)" }} />

      {/* Product image */}
      <div className="relative" style={{ height: produto.imagem_url ? 160 : 80 }}>
        {produto.imagem_url ? (
          <LazyImage
            src={produto.imagem_url}
            alt={produto.nome_peca}
            style={{ height: 160, width: "100%", background: "#F8F9FA", objectFit: "cover" }}
            placeholder={
              <div className="flex items-center justify-center h-full">
                <ShoppingCart className="w-8 h-8" style={{ color: "#E2E8F0" }} />
              </div>
            }
          />
        ) : (
          <div style={{ height: 80, background: "#F8F9FA", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShoppingCart className="w-8 h-8" style={{ color: "#E2E8F0" }} />
          </div>
        )}

        {/* Carro-chefe badge */}
        {produto.destaque && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 text-[10px] font-mono-tech font-bold z-10"
            style={{ background: "#D32F2F", color: "#fff", borderRadius: "2px" }}>
            ⭐ TOP
          </div>
        )}

        {/* Favorito button */}
        <div className="absolute top-2 left-2 z-10">
          <FavoritoButton produto={produto} />
        </div>
      </div>

      {/* Corner marks */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l opacity-20" style={{ borderColor: "#D32F2F" }} />
      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r opacity-20" style={{ borderColor: "#D32F2F" }} />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l opacity-20" style={{ borderColor: "#D32F2F" }} />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r opacity-20" style={{ borderColor: "#D32F2F" }} />

      <div className="p-4 flex flex-col flex-1">
        {/* Category + Brand */}
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <span className="text-xs px-2 py-0.5 font-mono-tech" style={{
            background: "rgba(29,78,216,0.08)", border: "1px solid rgba(29,78,216,0.2)",
            color: "#1D4ED8", borderRadius: "2px",
          }}>
            {produto.relacionamento_categoria?.split(" ")[0]}
          </span>
          <span className="text-xs font-semibold font-mono-tech" style={{ color: "#D32F2F" }}>
            {produto.relacionamento_marca}
          </span>
        </div>

        {/* Name */}
        <Link to={`${createPageUrl("ProdutoDetalhe")}?id=${produto.id}`} className="group">
          <h3 className="font-semibold text-sm leading-snug mb-2 flex-1 group-hover:text-red-700 transition-colors"
            style={{ color: "#212529", fontFamily: "'Space Grotesk', sans-serif" }}>
            {produto.nome_peca}
          </h3>
        </Link>

        {/* SKU badge */}
        <div className="mb-3">
          <span className="mm-sku-badge font-mono-tech text-xs px-2 py-1 inline-block" style={{
            background: "rgba(29,78,216,0.06)", border: "1px solid rgba(29,78,216,0.2)",
            color: "#1D4ED8", borderRadius: "2px", letterSpacing: "0.08em",
          }}>
            SKU: {produto.sku_codigo}
          </span>
        </div>

        {/* Electric specs */}
        {hasEletric && (
          <div className="mm-spec-panel rounded-sm p-2.5 mb-3">
            <div className="flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-3 h-3" style={{ color: "#D32F2F" }} />
              <span className="text-xs font-semibold font-mono-tech" style={{ color: "#D32F2F" }}>SPECS ELÉTRICAS</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {produto.especificacoes_eletricas.amperes && (
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3" style={{ color: "#1D4ED8" }} />
                  <span className="text-xs font-mono-tech" style={{ color: "#1D4ED8" }}>{produto.especificacoes_eletricas.amperes}</span>
                </div>
              )}
              {produto.especificacoes_eletricas.voltagem && (
                <div className="flex items-center gap-1">
                  <span className="text-xs" style={{ color: "#1D4ED8" }}>V</span>
                  <span className="text-xs font-mono-tech" style={{ color: "#1D4ED8" }}>{produto.especificacoes_eletricas.voltagem}</span>
                </div>
              )}
              {produto.especificacoes_eletricas.potencia_watts && (
                <div className="flex items-center gap-1 col-span-2">
                  <span className="text-xs" style={{ color: "#1D4ED8" }}>W</span>
                  <span className="text-xs font-mono-tech" style={{ color: "#1D4ED8" }}>{produto.especificacoes_eletricas.potencia_watts}</span>
                </div>
              )}
              {produto.especificacoes_eletricas.potencia_hp && (
                <div className="flex items-center gap-1">
                  <span className="text-xs" style={{ color: "#1D4ED8" }}>HP</span>
                  <span className="text-xs font-mono-tech" style={{ color: "#1D4ED8" }}>{produto.especificacoes_eletricas.potencia_hp}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stock */}
        {produto.disponibilidade === "sem_estoque" ? (
          <div className="flex items-center gap-1.5 mb-4">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#D97706" }} />
            <span className="text-xs font-mono-tech" style={{ color: "#D97706" }}>CONSULTAR DISPONIBILIDADE</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 mb-4">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#16A34A" }} />
            <span className="text-xs font-mono-tech" style={{ color: "#15803D" }}>
              {produto.estoque_disponivel > 0 ? `${produto.estoque_disponivel} UNID.` : "ESTOQUE A CONSULTAR"}
            </span>
          </div>
        )}

        {/* Ver detalhes */}
        <Link to={`${createPageUrl("ProdutoDetalhe")}?id=${produto.id}`}
          className="flex items-center gap-1 text-xs font-mono-tech mb-3 hover:text-blue-700 transition-colors"
          style={{ color: "#9CA3AF" }}>
          <ExternalLink className="w-3 h-3" /> VER DETALHES
        </Link>

        {/* Quantity + Add */}
        <div className="flex items-center gap-2 mt-auto">
          <div className="flex items-center" style={{
            background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px",
          }}>
            <button onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
              className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-gray-100"
              style={{ color: "#6C757D" }}>
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-mono-tech" style={{ color: "#212529" }}>
              {quantidade}
            </span>
            <button onClick={() => setQuantidade(quantidade + 1)}
              className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-gray-100"
              style={{ color: "#6C757D" }}>
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button onClick={handleAdd}
            className="mm-btn-tactile flex-1 flex items-center justify-center gap-1.5 h-10 text-sm font-semibold"
            style={{
              background: pressed ? "linear-gradient(135deg, #B71C1C, #9C1919)" : "linear-gradient(135deg, #D32F2F, #B71C1C)",
              color: "#fff", borderRadius: "2px", border: "none",
              boxShadow: pressed ? "none" : "0 4px 12px rgba(211,47,47,0.25)",
              transform: pressed ? "translateY(2px)" : "translateY(0)",
              transition: "all 0.1s ease",
            }}>
            <ShoppingCart className="w-3.5 h-3.5" />
            {produto.disponibilidade === "sem_estoque" ? "SOLICITAR" : "COTAR"}
          </button>
        </div>
      </div>
    </div>
  );
}
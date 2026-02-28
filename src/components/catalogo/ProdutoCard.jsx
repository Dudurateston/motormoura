import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ShoppingCart, Package, Zap, AlertTriangle, Plus, Minus, ExternalLink } from "lucide-react";

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
    setTilt({ x: dy * -10, y: dx * 10 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  };

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
        background: "linear-gradient(145deg, #27272C, #1F1F23)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "4px",
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: hovered ? "transform 0.1s ease-out, box-shadow 0.3s ease" : "transform 0.4s ease, box-shadow 0.3s ease",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top accent line */}
      <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg, #1D4ED8, #FB923C, #1D4ED8)" }} />

      {/* Corner chamfer marks */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l opacity-40" style={{ borderColor: "#FB923C" }} />
      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r opacity-40" style={{ borderColor: "#FB923C" }} />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l opacity-40" style={{ borderColor: "#FB923C" }} />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r opacity-40" style={{ borderColor: "#FB923C" }} />

      <div className="p-4 flex flex-col flex-1">
        {/* Category + Brand */}
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <span
            className="text-xs px-2 py-0.5 font-mono-tech"
            style={{
              background: "rgba(29,78,216,0.15)",
              border: "1px solid rgba(29,78,216,0.3)",
              color: "#60A5FA",
              borderRadius: "2px",
            }}
          >
            {produto.relacionamento_categoria?.split(" ")[0]}
          </span>
          <span
            className="text-xs font-semibold font-mono-tech"
            style={{ color: "#FB923C" }}
          >
            {produto.relacionamento_marca}
          </span>
        </div>

        {/* Name */}
        <Link to={`${createPageUrl("ProdutoDetalhe")}?id=${produto.id}`} className="group">
          <h3
            className="font-semibold text-sm leading-snug mb-2 flex-1 group-hover:text-orange-400 transition-colors"
            style={{ color: "#E5E7EB", fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {produto.nome_peca}
          </h3>
        </Link>

        {/* SKU badge — pulses on hover */}
        <div className="mb-3">
          <span
            className="mm-sku-badge font-mono-tech text-xs px-2 py-1 inline-block"
            style={{
              background: "rgba(29,78,216,0.2)",
              border: "1px solid rgba(29,78,216,0.5)",
              color: "#93C5FD",
              borderRadius: "2px",
              letterSpacing: "0.08em",
            }}
          >
            SKU: {produto.sku_codigo}
          </span>
        </div>

        {/* Electric specs */}
        {hasEletric && (
          <div
            className="mm-spec-panel rounded-sm p-2.5 mb-3"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-3 h-3" style={{ color: "#FB923C" }} />
              <span className="text-xs font-semibold font-mono-tech" style={{ color: "#FB923C" }}>
                SPECS ELÉTRICAS
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {produto.especificacoes_eletricas.amperes && (
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3" style={{ color: "#60A5FA" }} />
                  <span className="text-xs font-mono-tech" style={{ color: "#93C5FD" }}>{produto.especificacoes_eletricas.amperes}</span>
                </div>
              )}
              {produto.especificacoes_eletricas.voltagem && (
                <div className="flex items-center gap-1">
                  <span className="text-xs" style={{ color: "#60A5FA" }}>V</span>
                  <span className="text-xs font-mono-tech" style={{ color: "#93C5FD" }}>{produto.especificacoes_eletricas.voltagem}</span>
                </div>
              )}
              {produto.especificacoes_eletricas.potencia_watts && (
                <div className="flex items-center gap-1 col-span-2">
                  <span className="text-xs" style={{ color: "#60A5FA" }}>W</span>
                  <span className="text-xs font-mono-tech" style={{ color: "#93C5FD" }}>{produto.especificacoes_eletricas.potencia_watts}</span>
                </div>
              )}
              {produto.especificacoes_eletricas.potencia_hp && (
                <div className="flex items-center gap-1">
                  <span className="text-xs" style={{ color: "#60A5FA" }}>HP</span>
                  <span className="text-xs font-mono-tech" style={{ color: "#93C5FD" }}>{produto.especificacoes_eletricas.potencia_hp}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stock */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#4ADE80" }} />
          <span className="text-xs font-mono-tech" style={{ color: "#6EE7B7" }}>
            {produto.estoque_disponivel} UNID.
          </span>
        </div>

        {/* Quantity + Add */}
        <div className="flex items-center gap-2 mt-auto">
          <div
            className="flex items-center"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "2px",
            }}
          >
            <button
              onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
              className="w-7 h-8 flex items-center justify-center transition-colors hover:bg-white/10"
              style={{ color: "#9CA3AF" }}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span
              className="w-8 text-center text-sm font-mono-tech"
              style={{ color: "#E5E7EB" }}
            >
              {quantidade}
            </span>
            <button
              onClick={() => setQuantidade(quantidade + 1)}
              className="w-7 h-8 flex items-center justify-center transition-colors hover:bg-white/10"
              style={{ color: "#9CA3AF" }}
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="mm-btn-tactile flex-1 flex items-center justify-center gap-1.5 h-8 text-sm font-semibold"
            style={{
              background: pressed
                ? "linear-gradient(135deg, #EA7C28, #C05621)"
                : "linear-gradient(135deg, #FB923C, #EA7C28)",
              color: "#fff",
              borderRadius: "2px",
              border: "none",
              boxShadow: pressed
                ? "none"
                : "0 4px 12px rgba(251,146,60,0.3)",
              transform: pressed ? "translateY(2px)" : "translateY(0)",
              transition: "all 0.1s ease",
            }}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            COTAR
          </button>
        </div>
      </div>
    </div>
  );
}
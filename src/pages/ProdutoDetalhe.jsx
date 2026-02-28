import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ShoppingCart, MessageCircle, Package, Zap, Tag,
  CheckCircle, Info, Plus, Minus, ChevronRight, AlertTriangle
} from "lucide-react";

function addToCart(produto, quantidade) {
  const stored = localStorage.getItem("motormoura_cart");
  const cart = stored ? JSON.parse(stored) : [];
  const idx = cart.findIndex((i) => i.sku_codigo === produto.sku_codigo);
  if (idx >= 0) cart[idx].quantidade += quantidade;
  else cart.push({ sku_codigo: produto.sku_codigo, nome_peca: produto.nome_peca, quantidade });
  localStorage.setItem("motormoura_cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
}

export default function ProdutoDetalhe() {
  const urlParams = new URLSearchParams(window.location.search);
  const produtoId = urlParams.get("id");

  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantidade, setQuantidade] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!produtoId) { setLoading(false); return; }
    base44.entities.Produtos.filter({ id: produtoId }).then((res) => {
      setProduto(res[0] || null);
      setLoading(false);
    });
  }, [produtoId]);

  const handleAddToCart = () => {
    if (!produto) return;
    addToCart(produto, quantidade);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsApp = () => {
    const WHATSAPP_NUMBER = "5511999999999";
    const msg = `Olá, MotorMoura! Gostaria de solicitar orçamento:\n\n• ${quantidade}x ${produto.nome_peca}\n  SKU: ${produto.sku_codigo}\n  Marca: ${produto.relacionamento_marca || "—"}\n\nAguardo retorno!`;
    window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(msg)}`, "_blank");
  };

  const hasEletric = produto?.especificacoes_eletricas &&
    Object.values(produto.especificacoes_eletricas).some(v => v && v.trim?.() !== "");

  if (loading) return (
    <div className="mm-bg min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono-tech" style={{ color: "#4B5563" }}>CARREGANDO PRODUTO...</p>
      </div>
    </div>
  );

  if (!produto) return (
    <div className="mm-bg min-h-screen flex flex-col items-center justify-center gap-4">
      <Package className="w-16 h-16 opacity-20" style={{ color: "#6B7280" }} />
      <p className="font-mono-tech text-sm" style={{ color: "#4B5563" }}>PRODUTO NÃO ENCONTRADO</p>
      <Link to={createPageUrl("Catalogo")}>
        <button className="px-4 h-9 text-xs font-mono-tech mm-btn-tactile" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#6B7280", borderRadius: "2px" }}>
          ← VOLTAR AO CATÁLOGO
        </button>
      </Link>
    </div>
  );

  return (
    <div className="mm-bg min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 mb-6 text-xs font-mono-tech flex-wrap" style={{ color: "#4B5563" }}>
          <Link to={createPageUrl("Home")} className="hover:text-orange-400 transition-colors">INÍCIO</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={createPageUrl("Catalogo")} className="hover:text-orange-400 transition-colors">CATÁLOGO</Link>
          <ChevronRight className="w-3 h-3" />
          {produto.relacionamento_categoria && (
            <>
              <Link to={`${createPageUrl("Catalogo")}?categoria=${encodeURIComponent(produto.relacionamento_categoria)}`} className="hover:text-orange-400 transition-colors">
                {produto.relacionamento_categoria}
              </Link>
              <ChevronRight className="w-3 h-3" />
            </>
          )}
          <span style={{ color: "#6B7280" }}>{produto.sku_codigo}</span>
        </nav>

        {/* Back button */}
        <Link to={createPageUrl("Catalogo")}>
          <button className="flex items-center gap-1.5 text-xs font-mono-tech mm-btn-tactile px-3 h-8 mb-6" style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#6B7280", borderRadius: "2px",
          }}>
            <ArrowLeft className="w-3.5 h-3.5" /> VOLTAR
          </button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left: Image + specs panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Image */}
            <div className="relative overflow-hidden" style={{
              background: "linear-gradient(145deg, #27272C, #1F1F23)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "4px",
              aspectRatio: "4/3",
            }}>
              <div className="h-[2px]" style={{ background: "linear-gradient(90deg, #1D4ED8, #FB923C, #1D4ED8)" }} />
              {/* Corner marks */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t border-l opacity-40" style={{ borderColor: "#FB923C" }} />
              <div className="absolute top-3 right-3 w-4 h-4 border-t border-r opacity-40" style={{ borderColor: "#FB923C" }} />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l opacity-40" style={{ borderColor: "#FB923C" }} />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r opacity-40" style={{ borderColor: "#FB923C" }} />

              {produto.imagem_url ? (
                <img src={produto.imagem_url} alt={produto.nome_peca} className="w-full h-full object-contain p-6" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                  <Package className="w-16 h-16 opacity-10" style={{ color: "#FB923C" }} />
                  <span className="text-xs font-mono-tech" style={{ color: "#374151" }}>SEM IMAGEM CADASTRADA</span>
                </div>
              )}

              {/* SKU watermark */}
              <div className="absolute bottom-3 left-3">
                <span className="text-xs font-mono-tech px-2 py-0.5" style={{
                  background: "rgba(29,78,216,0.25)", border: "1px solid rgba(29,78,216,0.5)",
                  color: "#93C5FD", borderRadius: "2px",
                }}>
                  SKU: {produto.sku_codigo}
                </span>
              </div>
            </div>

            {/* Electric specs card */}
            {hasEletric && (
              <div className="p-4" style={{
                background: "linear-gradient(135deg, rgba(29,78,216,0.1), rgba(29,78,216,0.04))",
                border: "1px solid rgba(29,78,216,0.35)",
                borderRadius: "4px",
              }}>
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4" style={{ color: "#FB923C" }} />
                  <span className="text-xs font-bold font-mono-tech" style={{ color: "#FB923C", letterSpacing: "0.12em" }}>
                    ESPECIFICAÇÕES ELÉTRICAS
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "amperes", label: "AMPERAGEM", unit: "A" },
                    { key: "voltagem", label: "VOLTAGEM", unit: "V" },
                    { key: "potencia_watts", label: "POTÊNCIA", unit: "W" },
                    { key: "potencia_hp", label: "POTÊNCIA", unit: "HP" },
                  ].filter(s => produto.especificacoes_eletricas[s.key]).map(s => (
                    <div key={s.key} className="p-3" style={{
                      background: "rgba(29,78,216,0.12)", border: "1px solid rgba(29,78,216,0.2)", borderRadius: "2px",
                    }}>
                      <p className="text-xs font-mono-tech mb-1" style={{ color: "#4B5563" }}>{s.label}</p>
                      <p className="font-bold font-mono-tech" style={{ color: "#93C5FD" }}>
                        {produto.especificacoes_eletricas[s.key]}
                        <span className="text-xs ml-1" style={{ color: "#1D4ED8" }}>{s.unit}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stock info */}
            <div className="flex items-center justify-between px-4 py-3" style={{
              background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: "4px",
            }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: "#4ADE80" }} />
                <span className="text-sm font-mono-tech" style={{ color: "#6EE7B7" }}>EM ESTOQUE</span>
              </div>
              <span className="font-bold font-mono-tech" style={{ color: "#4ADE80" }}>
                {produto.estoque_disponivel ?? 100} UNID.
              </span>
            </div>
          </div>

          {/* Right: Details + CTA */}
          <div className="lg:col-span-3 space-y-5">

            {/* Category + Brand badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {produto.relacionamento_categoria && (
                <span className="text-xs px-2.5 py-1 font-mono-tech" style={{
                  background: "rgba(29,78,216,0.15)", border: "1px solid rgba(29,78,216,0.35)",
                  color: "#60A5FA", borderRadius: "2px",
                }}>
                  {produto.relacionamento_categoria}
                </span>
              )}
              {produto.relacionamento_marca && (
                <span className="text-xs px-2.5 py-1 font-bold font-mono-tech" style={{
                  background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.3)",
                  color: "#FB923C", borderRadius: "2px",
                }}>
                  {produto.relacionamento_marca}
                </span>
              )}
            </div>

            {/* Name */}
            <h1 style={{ color: "#F3F4F6", fontFamily: "'Space Grotesk', sans-serif", fontSize: "22px", fontWeight: 700, lineHeight: 1.35 }}>
              {produto.nome_peca}
            </h1>

            {/* Description */}
            {produto.descricao && (
              <p style={{ color: "#9CA3AF", fontSize: "15px", lineHeight: 1.75 }}>{produto.descricao}</p>
            )}

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "CÓDIGO SKU", value: produto.sku_codigo, color: "#93C5FD" },
                { label: "MARCA COMPATÍVEL", value: produto.relacionamento_marca || "—", color: "#FB923C" },
                { label: "CATEGORIA", value: produto.relacionamento_categoria || "—", color: "#60A5FA" },
                { label: "ESTOQUE", value: `${produto.estoque_disponivel ?? 100} unidades`, color: "#4ADE80" },
              ].map(item => (
                <div key={item.label} className="p-3" style={{
                  background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px",
                }}>
                  <p className="text-xs font-mono-tech mb-1" style={{ color: "#4B5563" }}>{item.label}</p>
                  <p className="font-semibold text-sm font-mono-tech" style={{ color: item.color }}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="p-4" style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "4px",
            }}>
              <p className="text-xs font-mono-tech mb-1" style={{ color: "#4B5563" }}>PREÇO ATACADO B2B</p>
              {produto.preco_base_atacado > 0 ? (
                <p className="text-2xl font-bold font-mono-tech" style={{ color: "#F3F4F6" }}>
                  R$ {Number(produto.preco_base_atacado).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  <span className="text-xs font-normal ml-2" style={{ color: "#4B5563" }}>/ unidade</span>
                </p>
              ) : (
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4" style={{ color: "#FB923C" }} />
                  <p className="font-bold font-mono-tech" style={{ color: "#FB923C" }}>PREÇO SOB CONSULTA</p>
                </div>
              )}
            </div>

            {/* Quantity + CTA */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono-tech" style={{ color: "#4B5563" }}>QUANTIDADE:</span>
                <div className="flex items-center" style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "2px",
                }}>
                  <button onClick={() => setQuantidade(q => Math.max(1, q - 1))} className="w-9 h-10 flex items-center justify-center hover:bg-white/10 transition-colors" style={{ color: "#9CA3AF" }}>
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center font-bold font-mono-tech" style={{ color: "#E5E7EB" }}>{quantidade}</span>
                  <button onClick={() => setQuantidade(q => q + 1)} className="w-9 h-10 flex items-center justify-center hover:bg-white/10 transition-colors" style={{ color: "#9CA3AF" }}>
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Add to cart */}
              <button onClick={handleAddToCart} className="w-full h-12 flex items-center justify-center gap-2 font-bold font-mono-tech text-sm mm-btn-tactile" style={{
                background: added ? "linear-gradient(135deg, #16A34A, #15803D)" : "linear-gradient(135deg, #FB923C, #EA7C28)",
                color: "#fff", borderRadius: "2px", border: "none",
                boxShadow: added ? "0 4px 16px rgba(22,163,74,0.3)" : "0 4px 16px rgba(251,146,60,0.3)",
                transition: "all 0.3s ease",
              }}>
                {added ? (
                  <><CheckCircle className="w-4 h-4" /> ADICIONADO À LISTA!</>
                ) : (
                  <><ShoppingCart className="w-4 h-4" /> ADICIONAR À LISTA DE COTAÇÃO</>
                )}
              </button>

              {/* WhatsApp CTA */}
              <button onClick={handleWhatsApp} className="w-full h-11 flex items-center justify-center gap-2 font-semibold font-mono-tech text-sm mm-btn-tactile" style={{
                background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.35)",
                color: "#4ADE80", borderRadius: "2px",
              }}>
                <MessageCircle className="w-4 h-4" />
                SOLICITAR ORÇAMENTO VIA WHATSAPP
              </button>
            </div>

            {/* Compatibility note */}
            <div className="flex items-start gap-3 p-3" style={{
              background: "rgba(251,146,60,0.05)", border: "1px solid rgba(251,146,60,0.15)", borderRadius: "4px",
            }}>
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#FB923C" }} />
              <p className="text-xs leading-relaxed" style={{ color: "#9CA3AF" }}>
                Peça compatível com equipamentos da marca <strong style={{ color: "#FB923C" }}>{produto.relacionamento_marca || "indicada"}</strong>.
                Confirme o modelo e SKU antes de finalizar o pedido. Nossa equipe técnica está disponível para validar a compatibilidade.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
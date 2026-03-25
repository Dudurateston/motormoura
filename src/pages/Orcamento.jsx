import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { ShoppingCart, Trash2, Plus, Minus, MessageCircle, ArrowLeft, Send, Info } from "lucide-react";
import SEOHead from "../components/SEOHead";


import { whatsappUrl } from "@/lib/config";
const MINIMO_PEDIDO = 50;

function getCart() {
  const stored = localStorage.getItem("motormoura_cart");
  return stored ? JSON.parse(stored) : [];
}

function saveCart(cart) {
  localStorage.setItem("motormoura_cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
}

export default function Orcamento() {
  const [cart, setCart] = useState(getCart());
  const [user, setUser] = useState(null);
  const [observacoes, setObservacoes] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const updateQuantidade = (sku, delta) => {
    const updated = cart
      .map((item) => item.sku_codigo === sku ? { ...item, quantidade: Math.max(0, item.quantidade + delta) } : item)
      .filter((item) => item.quantidade > 0);
    setCart(updated);
    saveCart(updated);
  };

  const removeItem = (sku) => {
    const updated = cart.filter((item) => item.sku_codigo !== sku);
    setCart(updated);
    saveCart(updated);
  };

  const formatWhatsAppMessage = () => {
    let msg = "Olá, equipa MotorMoura! Gostaria de cotar as seguintes peças:\n\n";
    cart.forEach((item) => { msg += `• ${item.quantidade}x ${item.nome_peca} (SKU: ${item.sku_codigo})\n`; });
    if (observacoes) msg += `\nObservações: ${observacoes}`;
    if (user) msg += `\n\nAtenciosamente,\n${user.full_name}`;
    return msg;
  };

  const handleEnviarWhatsApp = async () => {
    setEnviando(true);
    try {
      await base44.functions.invoke('submeterOrcamento', { itens: cart, observacoes });
    } catch (e) {
      console.warn('Falha ao registrar orçamento:', e.message);
    }
    const url = whatsappUrl(formatWhatsAppMessage());
    saveCart([]);
    setCart([]);
    setEnviado(true);
    setEnviando(false);
    window.open(url, "_blank");
  };

  const totalUnidades = cart.reduce((s, i) => s + i.quantidade, 0);

  // ── VAZIA ──────────────────────────────────────────────────────
  if (cart.length === 0 && !enviado) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4" style={{ background: "#F8F9FA" }}>
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center" style={{ background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
            <ShoppingCart className="w-8 h-8" style={{ color: "#CBD5E1" }} />
          </div>
          <h2 className="text-lg font-bold font-mono-tech mb-2" style={{ color: "#212529" }}>LISTA VAZIA</h2>
          <p className="text-sm mb-6" style={{ color: "#6C757D" }}>Adicione peças do catálogo para criar um orçamento.</p>
          <Link to={createPageUrl("Catalogo")}>
            <button className="mm-btn-tactile flex items-center gap-2 px-5 h-10 text-sm font-mono-tech font-bold mx-auto"
              style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "#fff", borderRadius: "2px", border: "none" }}>
              <ArrowLeft className="w-4 h-4" /> IR AO CATÁLOGO
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // ── ENVIADO ────────────────────────────────────────────────────
  if (enviado) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4" style={{ background: "#F8F9FA" }}>
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.3)", borderRadius: "4px" }}>
            <Send className="w-8 h-8" style={{ color: "#16A34A" }} />
          </div>
          <h2 className="text-lg font-bold font-mono-tech mb-2" style={{ color: "#212529" }}>COTAÇÃO ENVIADA!</h2>
          <p className="text-sm mb-1" style={{ color: "#6C757D" }}>O WhatsApp foi aberto com a sua lista de peças.</p>
          <p className="text-xs mb-6 font-mono-tech" style={{ color: "#9CA3AF" }}>Registo da cotação guardado no sistema.</p>
          <Link to={createPageUrl("Catalogo")}>
            <button className="mm-btn-tactile flex items-center gap-2 px-5 h-10 text-sm font-mono-tech font-bold mx-auto"
              style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "#fff", borderRadius: "2px", border: "none" }}>
              <ArrowLeft className="w-4 h-4" /> CONTINUAR COMPRANDO
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // ── PRINCIPAL ──────────────────────────────────────────────────
  return (
    <div style={{ background: "#F8F9FA", minHeight: "100vh" }}>
      <div className="max-w-3xl mx-auto px-4 py-8">

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
              <div className="w-3 h-[2px]" style={{ background: "#D32F2F" }} />
              <span className="text-xs font-mono-tech" style={{ color: "#D32F2F", letterSpacing: "0.15em" }}>COTAÇÃO B2B</span>
            </div>
            <h1 className="text-xl font-bold font-mono-tech" style={{ color: "#212529" }}>Lista de Cotação</h1>
          </div>
        </div>

        {/* Regras B2B — info banner */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1 flex items-start gap-2.5 p-3" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#1D4ED8" }} />
            <div>
              <p className="text-xs font-mono-tech font-bold mb-0.5" style={{ color: "#1D4ED8" }}>PEDIDO MÍNIMO: R$ {MINIMO_PEDIDO},00</p>
              <p className="text-xs" style={{ color: "#6C757D" }}>Cotações abaixo deste valor não serão processadas.</p>
            </div>
          </div>
          <div className="flex-1 flex items-start gap-2.5 p-3" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#16A34A" }} />
            <div>
              <p className="text-xs font-mono-tech font-bold mb-0.5" style={{ color: "#16A34A" }}>5% DESCONTO NO PIX</p>
              <p className="text-xs" style={{ color: "#6C757D" }}>Válido em pedidos acima de R$ 900,00 pagos via PIX.</p>
            </div>
          </div>
        </div>

        {/* Prazos de entrega */}
        <div className="flex items-center gap-4 px-4 py-3 mb-5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
          <span className="text-xs font-mono-tech" style={{ color: "#9CA3AF" }}>PRAZOS (PEÇAS DE GIRO):</span>
          <span className="text-xs font-mono-tech" style={{ color: "#212529" }}>🏙 Fortaleza: <strong>48h</strong></span>
          <span className="text-xs font-mono-tech" style={{ color: "#212529" }}>🗺 Interior CE: <strong>96h</strong></span>
        </div>

        {/* Cart Items */}
        <div className="mb-5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px", overflow: "hidden" }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid #E2E8F0", background: "#F8F9FA" }}>
            <span className="text-xs font-mono-tech" style={{ color: "#6C757D" }}>ITENS DA COTAÇÃO</span>
            <span className="text-xs font-mono-tech px-2 py-0.5" style={{ background: "rgba(211,47,47,0.08)", border: "1px solid rgba(211,47,47,0.2)", color: "#D32F2F", borderRadius: "2px" }}>
              {cart.length} ref. · {totalUnidades} unid.
            </span>
          </div>
          <div style={{ borderBottom: "none" }}>
            {cart.map((item, idx) => (
              <div key={item.sku_codigo} className="flex items-center gap-3 px-4 py-3"
                style={{ borderBottom: idx < cart.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "#212529" }}>{item.nome_peca}</p>
                  <p className="text-xs font-mono-tech mt-0.5" style={{ color: "#1D4ED8" }}>SKU: {item.sku_codigo}</p>
                </div>
                {/* Quantity controls — 40px touch target */}
                <div className="flex items-center" style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px" }}>
                  <button onClick={() => updateQuantidade(item.sku_codigo, -1)}
                    className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-gray-100"
                    style={{ color: "#6C757D" }}>
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-mono-tech font-bold" style={{ color: "#212529" }}>
                    {item.quantidade}
                  </span>
                  <button onClick={() => updateQuantidade(item.sku_codigo, 1)}
                    className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-gray-100"
                    style={{ color: "#6C757D" }}>
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button onClick={() => removeItem(item.sku_codigo)}
                  className="w-10 h-10 flex items-center justify-center transition-colors hover:bg-red-50"
                  style={{ color: "#CBD5E1", borderRadius: "2px" }}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Observações */}
        <div className="mb-5 p-4" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
          <label className="block text-xs font-mono-tech mb-2" style={{ color: "#6C757D" }}>
            OBSERVAÇÕES (OPCIONAL)
          </label>
          <textarea
            placeholder="Informe prazos, condições especiais, ou outras observações para a equipa MotorMoura..."
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            rows={3}
            className="w-full text-sm focus:outline-none resize-none p-3"
            style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#212529", fontFamily: "'Space Grotesk', sans-serif" }}
          />
        </div>

        {/* Login notice */}
        {!user && (
          <div className="flex items-start gap-2.5 p-3 mb-4" style={{ background: "rgba(29,78,216,0.05)", border: "1px solid rgba(29,78,216,0.2)", borderRadius: "4px" }}>
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#1D4ED8" }} />
            <p className="text-xs" style={{ color: "#6C757D" }}>
              <button onClick={() => base44.auth.redirectToLogin()} className="font-semibold underline" style={{ color: "#1D4ED8" }}>Faça login</button> para associar esta cotação à sua conta de lojista.
            </p>
          </div>
        )}

        {/* Summary + CTA */}
        <div className="p-5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div className="absolute top-0 left-0 right-0 h-[2px] relative" style={{ background: "linear-gradient(90deg, #1D4ED8, #D32F2F, #1D4ED8)", borderRadius: "4px 4px 0 0", marginBottom: "1px" }} />
          <div className="flex items-center justify-between mb-4 pt-2">
            <div>
              <p className="text-xs font-mono-tech mb-0.5" style={{ color: "#9CA3AF" }}>TOTAL DA LISTA</p>
              <p className="text-2xl font-bold font-mono-tech" style={{ color: "#212529" }}>{totalUnidades} <span className="text-base font-normal" style={{ color: "#6C757D" }}>unid.</span></p>
              <p className="text-xs font-mono-tech" style={{ color: "#6C757D" }}>{cart.length} referência(s) diferente(s)</p>
            </div>
            <ShoppingCart className="w-10 h-10" style={{ color: "#E2E8F0" }} />
          </div>

          <button
            onClick={handleEnviarWhatsApp}
            disabled={enviando || cart.length === 0}
            className="w-full h-12 flex items-center justify-center gap-2 text-sm font-bold font-mono-tech mm-btn-tactile disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #25D366, #1DA851)",
              color: "#fff", borderRadius: "2px", border: "none",
              boxShadow: "0 4px 16px rgba(37,211,102,0.25)",
            }}
          >
            <MessageCircle className="w-5 h-5" />
            {enviando ? "A ENVIAR..." : "ENVIAR COTAÇÃO PELO WHATSAPP"}
          </button>

          <p className="text-center text-xs font-mono-tech mt-3" style={{ color: "#9CA3AF" }}>
            WhatsApp B2B: (85) 98689-4081 · Resp. por Marcus Vieira
          </p>
        </div>

      </div>
    </div>
  );
}
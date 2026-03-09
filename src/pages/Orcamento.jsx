import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { ShoppingCart, Trash2, Plus, Minus, MessageCircle, FileText, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const WHATSAPP_NUMBER = "5585986894081";

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
      .map((item) =>
        item.sku_codigo === sku
          ? { ...item, quantidade: Math.max(0, item.quantidade + delta) }
          : item
      )
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
    cart.forEach((item) => {
      msg += `• ${item.quantidade}x ${item.nome_peca} (SKU: ${item.sku_codigo})\n`;
    });
    if (observacoes) {
      msg += `\nObservações: ${observacoes}`;
    }
    if (user) {
      msg += `\n\nAtenciosamente,\n${user.full_name}`;
    }
    return msg;
  };

  const handleEnviarWhatsApp = async () => {
    setEnviando(true);

    // Passo 1: Salvar orçamento na base de dados
    await base44.entities.Orcamentos.create({
      lojista_email: user?.email || "anonimo",
      lojista_nome: user?.full_name || "Visitante",
      itens: cart,
      status: "pendente",
      observacoes,
      numero_orcamento: `ORC-${Date.now()}`,
    });

    // Passo 2: Redirecionar para WhatsApp
    const message = formatWhatsAppMessage();
    const encoded = encodeURIComponent(message);
    const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encoded}`;

    setEnviado(true);
    setEnviando(false);

    // Limpar carrinho
    saveCart([]);
    setCart([]);

    // Abrir WhatsApp
    window.open(url, "_blank");
  };

  if (cart.length === 0 && !enviado) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">A sua lista de cotação está vazia</h2>
        <p className="text-gray-500 mb-6">Adicione peças do catálogo para criar um orçamento.</p>
        <Link to={createPageUrl("Catalogo")}>
          <Button className="bg-[#0a2540] hover:bg-[#0d3060] text-white gap-2">
            <ArrowLeft className="w-4 h-4" /> Ir ao Catálogo
          </Button>
        </Link>
      </div>
    );
  }

  if (enviado) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Cotação enviada com sucesso!</h2>
        <p className="text-gray-500 mb-2">O WhatsApp foi aberto com a sua lista de peças.</p>
        <p className="text-gray-500 mb-6 text-sm">O registo da cotação foi guardado no sistema.</p>
        <Link to={createPageUrl("Catalogo")}>
          <Button className="bg-[#0a2540] hover:bg-[#0d3060] text-white gap-2">
            <ArrowLeft className="w-4 h-4" /> Continuar comprando
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link to={createPageUrl("Catalogo")}>
          <Button variant="ghost" size="sm" className="gap-1.5 text-gray-500">
            <ArrowLeft className="w-4 h-4" /> Catálogo
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#0a2540]">Lista de Cotação</h1>
          <p className="text-sm text-gray-500">{cart.length} item(ns) na lista</p>
        </div>
      </div>

      {/* Cart Items */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {cart.map((item) => (
            <div key={item.sku_codigo} className="flex items-center gap-4 p-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{item.nome_peca}</p>
                <p className="text-xs text-gray-400">SKU: {item.sku_codigo}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantidade(item.sku_codigo, -1)}
                  className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center font-semibold text-sm">{item.quantidade}</span>
                <button
                  onClick={() => updateQuantidade(item.sku_codigo, 1)}
                  className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <button
                onClick={() => removeItem(item.sku_codigo)}
                className="text-red-400 hover:text-red-600 transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Observations */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          Observações (opcional)
        </Label>
        <Textarea
          placeholder="Informe prazos, condições especiais, ou outras observações para a equipa MotorMoura..."
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          rows={3}
          className="text-sm"
        />
      </div>

      {/* Summary + Send */}
      <div className="bg-[#0a2540] text-white rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-300 text-sm">Total de itens na cotação</p>
            <p className="text-2xl font-bold">
              {cart.reduce((s, i) => s + i.quantidade, 0)} unidades
            </p>
            <p className="text-gray-400 text-xs">{cart.length} referência(s) diferente(s)</p>
          </div>
          <ShoppingCart className="w-10 h-10 text-[#e8b84b] opacity-80" />
        </div>

        {!user && (
          <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-3 mb-4 text-sm text-yellow-200">
            💡 Faça login para associar esta cotação à sua conta de lojista.
          </div>
        )}

        <Button
          onClick={handleEnviarWhatsApp}
          disabled={enviando}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold gap-2 h-12 text-base"
        >
          <MessageCircle className="w-5 h-5" />
          {enviando ? "A enviar..." : "Enviar Cotação pelo WhatsApp"}
        </Button>
      </div>
    </div>
  );
}
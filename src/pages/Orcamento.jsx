import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ShoppingCart, Trash2, MessageCircle, Plus, Minus, Package, ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const WHATSAPP_NUMBER = "5511999999999"; // Substituir pelo número real da empresa

export default function Orcamento() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [observacoes, setObservacoes] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("motormoura_cart");
    setCart(stored ? JSON.parse(stored) : []);
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("motormoura_cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateQtd = (sku, delta) => {
    const updated = cart.map(item =>
      item.sku_codigo === sku
        ? { ...item, quantidade: Math.max(1, item.quantidade + delta) }
        : item
    );
    saveCart(updated);
  };

  const removeItem = (sku) => {
    saveCart(cart.filter(item => item.sku_codigo !== sku));
  };

  const handleEnviarWhatsApp = async () => {
    setEnviando(true);

    // Passo 1: Gravar orçamento na base de dados
    const orcamentoData = {
      lojista_email: user?.email || "",
      lojista_nome: user?.full_name || "Visitante",
      itens: cart,
      status: "pendente",
      observacoes,
      numero_orcamento: `ORC-${Date.now()}`,
    };

    base44.entities.Orcamentos.create(orcamentoData).catch(() => {});

    // Passo 2: Formatar mensagem WhatsApp
    const linhasItens = cart.map(item =>
      `• ${item.quantidade}x ${item.nome_peca} (SKU: ${item.sku_codigo})`
    ).join("\n");

    const mensagem = [
      "Olá, equipa MotorMoura! Gostaria de cotar as seguintes peças:",
      "",
      linhasItens,
      "",
      observacoes ? `Observações: ${observacoes}` : "",
      user ? `Lojista: ${user.full_name} (${user.email})` : "",
    ].filter(Boolean).join("\n");

    const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(mensagem)}`;

    setEnviando(false);
    setEnviado(true);

    // Limpar carrinho e redirecionar
    setTimeout(() => {
      saveCart([]);
      window.open(url, "_blank");
    }, 800);
  };

  const totalItens = cart.reduce((sum, item) => sum + item.quantidade, 0);

  if (enviado) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Cotação enviada!</h2>
        <p className="text-gray-500 mb-6">Estamos a redirecionar para o WhatsApp...</p>
        <Link to={createPageUrl("Catalogo")}>
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Continuar comprando
          </Button>
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <ShoppingCart className="w-14 h-14 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">A sua lista de cotação está vazia</h2>
        <p className="text-gray-500 mb-6">Pesquise no catálogo e adicione as peças que precisa.</p>
        <Link to={createPageUrl("Catalogo")}>
          <Button className="bg-[#0a2540] hover:bg-[#0d3060] text-white gap-2">
            <Package className="w-4 h-4" />
            Ir ao Catálogo
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to={createPageUrl("Catalogo")}>
          <Button variant="ghost" size="sm" className="gap-1.5 text-gray-500">
            <ArrowLeft className="w-4 h-4" />
            Catálogo
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-[#0a2540]">Lista de Cotação</h1>
          <p className="text-sm text-gray-500">{totalItens} {totalItens === 1 ? "item" : "itens"}</p>
        </div>
      </div>

      {/* Itens */}
      <div className="space-y-3 mb-6">
        {cart.map((item) => (
          <div
            key={item.sku_codigo}
            className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm truncate">{item.nome_peca}</p>
              <p className="text-xs text-gray-400">SKU: {item.sku_codigo}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQtd(item.sku_codigo, -1)}
                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Minus className="w-3 h-3 text-gray-500" />
              </button>
              <span className="w-8 text-center font-semibold text-gray-900 text-sm">{item.quantidade}</span>
              <button
                onClick={() => updateQtd(item.sku_codigo, 1)}
                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-3 h-3 text-gray-500" />
              </button>
            </div>
            <button
              onClick={() => removeItem(item.sku_codigo)}
              className="text-gray-300 hover:text-red-500 transition-colors ml-2"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Observações */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          Observações (opcional)
        </label>
        <textarea
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          placeholder="Ex: urgente, para entrega no prazo X, dúvidas técnicas..."
          className="w-full text-sm border border-gray-200 rounded-lg p-3 resize-none h-20 focus:outline-none focus:ring-2 focus:ring-[#0a2540]/20"
        />
      </div>

      {/* Preview da mensagem */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pré-visualização da mensagem</span>
        </div>
        <div className="text-sm text-gray-700 font-mono bg-white rounded-lg p-3 border border-gray-100 whitespace-pre-line">
          {`Olá, equipa MotorMoura! Gostaria de cotar as seguintes peças:\n\n${cart.map(item => `• ${item.quantidade}x ${item.nome_peca} (SKU: ${item.sku_codigo})`).join("\n")}${observacoes ? `\n\nObservações: ${observacoes}` : ""}`}
        </div>
      </div>

      {/* Botão enviar */}
      <Button
        onClick={handleEnviarWhatsApp}
        disabled={enviando}
        className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold text-base gap-2"
      >
        <MessageCircle className="w-5 h-5" />
        {enviando ? "A processar..." : "Enviar Cotação pelo WhatsApp"}
      </Button>

      {!user && (
        <p className="text-center text-xs text-gray-400 mt-3">
          Pode enviar sem conta, mas ao{" "}
          <button
            onClick={() => base44.auth.redirectToLogin()}
            className="text-[#0a2540] underline"
          >
            fazer login
          </button>
          {" "}guardamos o histórico dos seus orçamentos.
        </p>
      )}
    </div>
  );
}
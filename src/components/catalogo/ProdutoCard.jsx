import React, { useState } from "react";
import { ShoppingCart, Package, Zap, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function ProdutoCard({ produto, onAddToCart }) {
  const [quantidade, setQuantidade] = useState(1);

  const hasEletric = produto.especificacoes_eletricas &&
    Object.values(produto.especificacoes_eletricas).some(v => v && v.trim() !== "");

  const handleAdd = () => {
    onAddToCart(produto, quantidade);
    setQuantidade(1);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      {/* Top accent */}
      <div className="h-1 bg-gradient-to-r from-[#0a2540] to-[#e8b84b]" />

      <div className="p-4 flex flex-col flex-1">
        {/* Category + Brand */}
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <Badge variant="outline" className="text-xs text-gray-500 border-gray-300">
            {produto.relacionamento_categoria}
          </Badge>
          <span className="text-xs font-semibold text-[#0a2540] bg-blue-50 px-2 py-0.5 rounded">
            {produto.relacionamento_marca}
          </span>
        </div>

        {/* Name + SKU */}
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 flex-1">
          {produto.nome_peca}
        </h3>
        <p className="text-xs text-gray-400 mb-3">SKU: {produto.sku_codigo}</p>

        {/* Electric specs warning */}
        {hasEletric && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700">Especificações Elétricas</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {produto.especificacoes_eletricas.amperes && (
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span className="text-xs text-amber-800 font-medium">{produto.especificacoes_eletricas.amperes}</span>
                </div>
              )}
              {produto.especificacoes_eletricas.voltagem && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-amber-700">⚡</span>
                  <span className="text-xs text-amber-800 font-medium">{produto.especificacoes_eletricas.voltagem}</span>
                </div>
              )}
              {produto.especificacoes_eletricas.potencia_watts && (
                <div className="flex items-center gap-1 col-span-2">
                  <span className="text-xs text-amber-700">🔋</span>
                  <span className="text-xs text-amber-800 font-medium">{produto.especificacoes_eletricas.potencia_watts}</span>
                </div>
              )}
              {produto.especificacoes_eletricas.potencia_hp && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-amber-700">🔩</span>
                  <span className="text-xs text-amber-800 font-medium">{produto.especificacoes_eletricas.potencia_hp}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stock */}
        <div className="flex items-center gap-1.5 mb-4">
          <Package className="w-3.5 h-3.5 text-green-500" />
          <span className="text-xs text-green-600 font-medium">
            {produto.estoque_disponivel} unid. disponíveis
          </span>
        </div>

        {/* Add to cart */}
        <div className="flex items-center gap-2 mt-auto">
          <Input
            type="number"
            min="1"
            max={produto.estoque_disponivel}
            value={quantidade}
            onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 h-9 text-center text-sm"
          />
          <Button
            onClick={handleAdd}
            size="sm"
            className="flex-1 bg-[#0a2540] hover:bg-[#0d3060] text-white gap-1.5 h-9"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Cotar
          </Button>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { TrendingUp, Package, RefreshCw, AlertTriangle, ChevronRight, BarChart2, Clock } from "lucide-react";

function diasAtras(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return Math.round((now - d) / (1000 * 60 * 60 * 24));
}

function calcPrevisao(pedidos) {
  // Conta frequência por SKU e estima próxima compra
  const freq = {};
  pedidos.forEach((ped) => {
    const diasPedido = diasAtras(ped.created_date);
    (ped.itens || []).forEach((item) => {
      if (!freq[item.sku_codigo]) freq[item.sku_codigo] = { sku: item.sku_codigo, nome: item.nome_peca, totalQtd: 0, pedidos: [], ultimoPedido: diasPedido };
      freq[item.sku_codigo].totalQtd += item.quantidade || 1;
      freq[item.sku_codigo].pedidos.push(diasPedido);
      if (diasPedido < freq[item.sku_codigo].ultimoPedido) freq[item.sku_codigo].ultimoPedido = diasPedido;
    });
  });

  return Object.values(freq).map((item) => {
    const intervalos = item.pedidos.sort((a, b) => a - b);
    const mediaIntervalo = intervalos.length > 1
      ? intervalos.reduce((s, v, i) => i === 0 ? s : s + (intervalos[i] - intervalos[i - 1]), 0) / (intervalos.length - 1)
      : 30;
    const diasProxima = Math.max(0, Math.round(mediaIntervalo - item.ultimoPedido));
    const urgente = diasProxima <= 7;
    return { ...item, mediaIntervalo: Math.round(mediaIntervalo), diasProxima, urgente };
  }).sort((a, b) => a.diasProxima - b.diasProxima);
}

export default function GestaoEstoqueTab({ user }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    base44.entities.Orcamentos.filter({ lojista_email: user.email }, "-created_date", 50)
      .then((p) => { setPedidos(p); setLoading(false); });
  }, [user]);

  const previsoes = useMemo(() => calcPrevisao(pedidos), [pedidos]);

  // Top peças mais cotadas
  const topPecas = useMemo(() => {
    const map = {};
    pedidos.forEach((ped) => {
      (ped.itens || []).forEach((item) => {
        if (!map[item.sku_codigo]) map[item.sku_codigo] = { sku: item.sku_codigo, nome: item.nome_peca, totalQtd: 0, vezes: 0 };
        map[item.sku_codigo].totalQtd += item.quantidade || 1;
        map[item.sku_codigo].vezes += 1;
      });
    });
    return Object.values(map).sort((a, b) => b.vezes - a.vezes).slice(0, 8);
  }, [pedidos]);

  // KPIs
  const totalPedidos = pedidos.length;
  const totalItens = pedidos.reduce((s, p) => s + (p.itens?.length || 0), 0);
  const skusUnicos = topPecas.length;
  const urgentes = previsoes.filter((p) => p.urgente).length;

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#D32F2F", borderTopColor: "transparent" }} />
    </div>
  );

  if (pedidos.length === 0) return (
    <div className="text-center py-16">
      <Package className="w-12 h-12 mx-auto mb-3" style={{ color: "#E2E8F0" }} />
      <p className="font-mono-tech text-sm mb-1" style={{ color: "#212529" }}>NENHUM HISTÓRICO AINDA</p>
      <p className="text-xs mb-4" style={{ color: "#9CA3AF" }}>Faça sua primeira cotação para ativar o painel de gestão.</p>
      <Link to={createPageUrl("Catalogo")}>
        <button className="px-6 h-9 text-xs font-mono-tech font-bold mm-btn-tactile"
          style={{ background: "#D32F2F", color: "#fff", border: "none", borderRadius: "2px" }}>
          IR AO CATÁLOGO
        </button>
      </Link>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "COTAÇÕES", value: totalPedidos, color: "#1D4ED8", Icon: BarChart2 },
          { label: "ITENS COTADOS", value: totalItens, color: "#D32F2F", Icon: Package },
          { label: "SKUs ÚNICOS", value: skusUnicos, color: "#15803D", Icon: TrendingUp },
          { label: "REPOSIÇÃO URGENTE", value: urgentes, color: urgentes > 0 ? "#D32F2F" : "#9CA3AF", Icon: AlertTriangle },
        ].map((kpi) => (
          <div key={kpi.label} className="p-4 relative overflow-hidden"
            style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
            <div className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: `linear-gradient(90deg, transparent, ${kpi.color}, transparent)` }} />
            <kpi.Icon className="w-4 h-4 mb-2" style={{ color: kpi.color }} />
            <p className="text-2xl font-bold font-mono-tech" style={{ color: kpi.color }}>{kpi.value}</p>
            <p className="text-[10px] font-mono-tech mt-0.5" style={{ color: "#9CA3AF", letterSpacing: "0.06em" }}>{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Previsão de Reposição */}
      {previsoes.length > 0 && (
        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
          <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: "1px solid #E2E8F0" }}>
            <RefreshCw className="w-4 h-4" style={{ color: "#D32F2F" }} />
            <h3 className="text-sm font-bold font-mono-tech" style={{ color: "#212529" }}>
              Previsão de Reposição
            </h3>
            <span className="text-xs font-mono-tech ml-auto" style={{ color: "#9CA3AF" }}>
              baseado no histórico de pedidos
            </span>
          </div>
          <div className="divide-y" style={{ borderColor: "#F1F5F9" }}>
            {previsoes.slice(0, 8).map((item) => (
              <div key={item.sku} className="flex items-center gap-3 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: "#212529" }}>{item.nome}</p>
                  <p className="text-[10px] font-mono-tech" style={{ color: "#9CA3AF" }}>SKU: {item.sku} · Ciclo médio: {item.mediaIntervalo}d</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {item.urgente ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono-tech px-2 py-1"
                      style={{ background: "rgba(211,47,47,0.08)", border: "1px solid rgba(211,47,47,0.25)", color: "#D32F2F", borderRadius: "2px" }}>
                      <AlertTriangle className="w-3 h-3" /> REPOR JÁ
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-mono-tech px-2 py-1"
                      style={{ background: "rgba(29,78,216,0.06)", border: "1px solid rgba(29,78,216,0.2)", color: "#1D4ED8", borderRadius: "2px" }}>
                      <Clock className="w-3 h-3" /> em {item.diasProxima}d
                    </span>
                  )}
                  <Link to={`${createPageUrl("Catalogo")}?q=${encodeURIComponent(item.sku)}`}>
                    <button className="text-[10px] font-mono-tech px-2 py-1 mm-btn-tactile"
                      style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", color: "#6C757D", borderRadius: "2px" }}>
                      COTAR
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Peças Mais Cotadas */}
      {topPecas.length > 0 && (
        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
          <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: "1px solid #E2E8F0" }}>
            <TrendingUp className="w-4 h-4" style={{ color: "#1D4ED8" }} />
            <h3 className="text-sm font-bold font-mono-tech" style={{ color: "#212529" }}>Peças Mais Cotadas</h3>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
            {topPecas.map((item, idx) => (
              <Link key={item.sku} to={`${createPageUrl("Catalogo")}?q=${encodeURIComponent(item.sku)}`}
                className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-gray-50"
                style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px" }}>
                <span className="text-xs font-bold font-mono-tech w-5 flex-shrink-0"
                  style={{ color: idx < 3 ? "#D32F2F" : "#9CA3AF" }}>#{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: "#212529" }}>{item.nome}</p>
                  <p className="text-[10px] font-mono-tech" style={{ color: "#9CA3AF" }}>
                    {item.vezes}x cotado · {item.totalQtd} unid. total
                  </p>
                </div>
                <div className="w-16 h-1.5 rounded-full flex-shrink-0" style={{ background: "#E2E8F0" }}>
                  <div className="h-full rounded-full" style={{
                    width: `${Math.min(100, (item.vezes / (topPecas[0]?.vezes || 1)) * 100)}%`,
                    background: "#D32F2F"
                  }} />
                </div>
                <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: "#CBD5E1" }} />
              </Link>
            ))}
          </div>
          <div className="px-5 py-3" style={{ borderTop: "1px solid #E2E8F0" }}>
            <Link to={createPageUrl("MeusPedidos")}>
              <button className="text-xs font-mono-tech flex items-center gap-1"
                style={{ color: "#D32F2F", background: "none", border: "none" }}>
                VER HISTÓRICO COMPLETO <ChevronRight className="w-3 h-3" />
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
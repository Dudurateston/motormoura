import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Package, Calendar, FileText, Clock, CheckCircle2, XCircle, MessageCircle } from "lucide-react";
import SEOHead from "../components/SEOHead";

const STATUS_CONFIG = {
  pendente: { label: "PENDENTE", color: "#D97706", bg: "rgba(217,119,6,0.1)", border: "rgba(217,119,6,0.3)", icon: Clock },
  em_analise: { label: "EM ANÁLISE", color: "#1D4ED8", bg: "rgba(29,78,216,0.1)", border: "rgba(29,78,216,0.3)", icon: FileText },
  respondido: { label: "RESPONDIDO", color: "#16A34A", bg: "rgba(22,163,74,0.1)", border: "rgba(22,163,74,0.3)", icon: CheckCircle2 },
  fechado: { label: "FECHADO", color: "#6B7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.3)", icon: XCircle }
};

export default function MeusPedidos() {
  const [user, setUser] = useState(null);
  const [orcamentos, setOrcamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    base44.auth.me().then(async (u) => {
      setUser(u);
      if (u) {
        const orcList = await base44.entities.Orcamentos.filter(
          { lojista_email: u.email },
          "-created_date"
        );
        setOrcamentos(orcList || []);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }).catch(() => {
      setUser(null);
      setLoading(false);
    });
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="mm-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-red-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-mono-tech" style={{ color: "#6C757D" }}>CARREGANDO...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mm-bg min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <Package className="w-16 h-16 mx-auto mb-4" style={{ color: "#E2E8F0" }} />
          <h2 className="text-lg font-bold font-mono-tech mb-2" style={{ color: "#212529" }}>
            FAÇA LOGIN PARA VER PEDIDOS
          </h2>
          <p className="text-sm mb-6" style={{ color: "#6C757D" }}>
            Acompanhe o histórico dos seus orçamentos
          </p>
          <button
            onClick={() => base44.auth.redirectToLogin()}
            className="h-10 px-6 text-sm font-mono-tech font-bold mm-btn-tactile"
            style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "#fff", borderRadius: "2px", border: "none" }}
          >
            ENTRAR
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mm-bg min-h-screen">
      <SEOHead 
        title="Meus Pedidos | MotorMoura"
        description="Histórico de orçamentos e solicitações"
      />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to={createPageUrl("MinhaConta")}>
            <button className="flex items-center gap-1.5 h-9 px-3 text-xs font-mono-tech mm-btn-tactile"
              style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#6C757D", borderRadius: "2px" }}>
              <ArrowLeft className="w-3.5 h-3.5" /> CONTA
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" style={{ color: "#D32F2F" }} />
              <span className="text-xs font-mono-tech" style={{ color: "#D32F2F", letterSpacing: "0.15em" }}>HISTÓRICO</span>
            </div>
            <h1 className="text-xl font-bold font-mono-tech" style={{ color: "#212529" }}>Meus Orçamentos</h1>
          </div>
        </div>

        {/* Stats */}
        {orcamentos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {Object.entries(STATUS_CONFIG).map(([status, config]) => {
              const count = orcamentos.filter(o => o.status === status).length;
              return (
                <div key={status} className="p-3"
                  style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
                  <p className="text-xs font-mono-tech mb-1" style={{ color: "#6C757D" }}>{config.label}</p>
                  <p className="text-2xl font-bold font-mono-tech" style={{ color: config.color }}>{count}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Orcamentos list */}
        {orcamentos.length === 0 ? (
          <div className="text-center py-12" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
            <Package className="w-12 h-12 mx-auto mb-3" style={{ color: "#E2E8F0" }} />
            <p className="text-sm font-mono-tech mb-1" style={{ color: "#6C757D" }}>
              NENHUM ORÇAMENTO REALIZADO
            </p>
            <p className="text-xs mb-6" style={{ color: "#9CA3AF" }}>
              Adicione produtos ao carrinho e solicite um orçamento
            </p>
            <Link to={createPageUrl("Catalogo")}>
              <button className="h-10 px-6 text-sm font-mono-tech font-bold mm-btn-tactile"
                style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "#fff", borderRadius: "2px", border: "none" }}>
                IR AO CATÁLOGO
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orcamentos.map((orc) => {
              const config = STATUS_CONFIG[orc.status] || STATUS_CONFIG.pendente;
              const Icon = config.icon;
              const isExpanded = expandedId === orc.id;
              const totalItens = orc.itens?.reduce((sum, i) => sum + (i.quantidade || 0), 0) || 0;

              return (
                <div key={orc.id}
                  className="overflow-hidden transition-all"
                  style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
                  
                  {/* Header */}
                  <button
                    onClick={() => toggleExpand(orc.id)}
                    className="w-full p-4 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                        style={{ background: config.bg, border: `1px solid ${config.border}`, borderRadius: "2px" }}>
                        <Icon className="w-4 h-4" style={{ color: config.color }} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-mono-tech font-bold" style={{ color: "#212529" }}>
                            {orc.numero_orcamento || `#${orc.id.slice(0, 8)}`}
                          </span>
                          <span className="text-xs px-2 py-0.5 font-mono-tech"
                            style={{ background: config.bg, border: `1px solid ${config.border}`, color: config.color, borderRadius: "2px" }}>
                            {config.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs flex-wrap" style={{ color: "#6C757D" }}>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(orc.created_date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            {orc.itens?.length || 0} ref. · {totalItens} unid.
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-xs" style={{ color: "#9CA3AF" }}>
                      {isExpanded ? "▲" : "▼"}
                    </div>
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t" style={{ borderColor: "#E2E8F0" }}>
                      
                      {/* Items */}
                      {orc.itens && orc.itens.length > 0 && (
                        <div className="mt-3 mb-3">
                          <p className="text-xs font-mono-tech mb-2" style={{ color: "#6C757D" }}>ITENS DO ORÇAMENTO:</p>
                          <div className="space-y-2">
                            {orc.itens.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between gap-3 p-2"
                                style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px" }}>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold truncate" style={{ color: "#212529" }}>
                                    {item.nome_peca}
                                  </p>
                                  {item.sku_codigo && (
                                    <p className="text-xs font-mono-tech" style={{ color: "#1D4ED8" }}>
                                      SKU: {item.sku_codigo}
                                    </p>
                                  )}
                                </div>
                                <span className="text-xs font-mono-tech flex-shrink-0 px-2 py-1"
                                  style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#6C757D", borderRadius: "2px" }}>
                                  {item.quantidade}x
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Observações */}
                      {orc.observacoes && (
                        <div className="mb-3 p-2" style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px" }}>
                          <p className="text-xs font-mono-tech mb-1" style={{ color: "#6C757D" }}>OBSERVAÇÕES:</p>
                          <p className="text-xs" style={{ color: "#212529" }}>{orc.observacoes}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 flex-wrap">
                        <a href={`https://api.whatsapp.com/send?phone=5585986894081&text=Olá, gostaria de verificar o status do orçamento ${orc.numero_orcamento || orc.id}`}
                          target="_blank" rel="noopener noreferrer">
                          <button className="h-9 px-4 flex items-center gap-2 text-xs font-mono-tech mm-btn-tactile"
                            style={{ background: "rgba(22,163,74,0.12)", border: "1px solid rgba(22,163,74,0.35)", color: "#16A34A", borderRadius: "2px" }}>
                            <MessageCircle className="w-3.5 h-3.5" />
                            CONSULTAR STATUS
                          </button>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
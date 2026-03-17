import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { FileText, Clock, CheckCircle2, MessageCircle, ArrowRight, Package, XCircle } from "lucide-react";

const STATUS_CONFIG = {
  pendente: { label: "PENDENTE", color: "#D97706", bg: "rgba(217,119,6,0.1)", Icon: Clock },
  em_analise: { label: "EM ANÁLISE", color: "#1D4ED8", bg: "rgba(29,78,216,0.1)", Icon: FileText },
  respondido: { label: "RESPONDIDO", color: "#16A34A", bg: "rgba(22,163,74,0.1)", Icon: CheckCircle2 },
  fechado: { label: "FECHADO", color: "#6B7280", bg: "rgba(107,114,128,0.1)", Icon: XCircle },
};

export default function PedidosTab({ user }) {
  const [orcamentos, setOrcamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    base44.entities.Orcamentos.filter({ lojista_email: user.email }, "-created_date", 5)
      .then((data) => { setOrcamentos(data || []); setLoading(false); });
  }, [user]);

  const formatDate = (d) => new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#D32F2F", borderTopColor: "transparent" }} />
    </div>
  );

  // KPI counts
  const counts = Object.fromEntries(Object.keys(STATUS_CONFIG).map((s) => [s, orcamentos.filter((o) => o.status === s).length]));
  const total = orcamentos.length;

  return (
    <div className="space-y-4">
      {/* KPI Strip */}
      {total > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(STATUS_CONFIG).map(([status, config]) => (
            <div key={status} className="p-3 text-center"
              style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
              <p className="text-lg font-bold font-mono-tech" style={{ color: config.color }}>{counts[status]}</p>
              <p className="text-xs font-mono-tech leading-tight" style={{ color: "#9CA3AF" }}>{config.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recent orders */}
      <div className="p-5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" style={{ color: "#D32F2F" }} />
            <span className="text-xs font-mono-tech font-bold" style={{ color: "#212529" }}>ÚLTIMOS ORÇAMENTOS</span>
          </div>
          <Link to={createPageUrl("MeusPedidos")}>
            <button className="flex items-center gap-1 text-xs font-mono-tech" style={{ color: "#D32F2F" }}>
              VER TODOS <ArrowRight className="w-3 h-3" />
            </button>
          </Link>
        </div>

        {orcamentos.length === 0 ? (
          <div className="py-8 text-center">
            <Package className="w-10 h-10 mx-auto mb-2" style={{ color: "#E2E8F0" }} />
            <p className="text-xs font-mono-tech mb-1" style={{ color: "#9CA3AF" }}>NENHUM ORÇAMENTO AINDA</p>
            <p className="text-xs mb-4" style={{ color: "#CBD5E1" }}>Adicione peças ao carrinho e envie via WhatsApp</p>
            <Link to={createPageUrl("Catalogo")}>
              <button className="h-8 px-4 text-xs font-mono-tech font-bold mm-btn-tactile"
                style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "#fff", borderRadius: "2px", border: "none" }}>
                IR AO CATÁLOGO
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {orcamentos.map((orc) => {
              const config = STATUS_CONFIG[orc.status] || STATUS_CONFIG.pendente;
              const Icon = config.Icon;
              const totalItens = orc.itens?.reduce((s, i) => s + (i.quantidade || 0), 0) || 0;
              return (
                <div key={orc.id} className="flex items-center gap-3 p-3"
                  style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px" }}>
                  <div className="w-7 h-7 flex items-center justify-center flex-shrink-0"
                    style={{ background: config.bg, borderRadius: "2px" }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: config.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono-tech font-bold" style={{ color: "#212529" }}>
                      {orc.numero_orcamento || `#${orc.id.slice(0, 8)}`}
                    </p>
                    <p className="text-xs" style={{ color: "#6C757D" }}>
                      {formatDate(orc.created_date)} · {orc.itens?.length || 0} ref. · {totalItens} unid.
                    </p>
                  </div>
                  <span className="text-xs font-mono-tech px-2 py-0.5"
                    style={{ background: config.bg, color: config.color, borderRadius: "2px" }}>
                    {config.label}
                  </span>
                  <a href={`https://api.whatsapp.com/send?phone=5585986894081&text=Consulta orçamento ${orc.numero_orcamento || orc.id}`}
                    target="_blank" rel="noopener noreferrer">
                    <button className="w-7 h-7 flex items-center justify-center hover:bg-green-50 transition-colors" style={{ borderRadius: "2px", color: "#16A34A" }}>
                      <MessageCircle className="w-3.5 h-3.5" />
                    </button>
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
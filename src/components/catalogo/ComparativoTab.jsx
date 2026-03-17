import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { X, Plus, GitCompare, Package, Zap, CheckCircle2 } from "lucide-react";

export default function ComparativoTab() {
  const [produtos, setProdutos] = useState([]);
  const [comparando, setComparando] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    base44.entities.Produtos.filter({ ativo: true }).then((res) => {
      setProdutos(res || []);
      setLoading(false);
    });
  }, []);

  const adicionar = (produto) => {
    if (comparando.length >= 4 || comparando.find(p => p.id === produto.id)) return;
    setComparando([...comparando, produto]);
  };

  const remover = (id) => setComparando(comparando.filter(p => p.id !== id));

  const filtrados = produtos.filter(p =>
    p.nome_peca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku_codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.relacionamento_marca?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEspec = (produto, key) => produto.especificacoes_eletricas?.[key] || "—";

  return (
    <div className="space-y-5">
      {/* Selected bar */}
      {comparando.length > 0 && (
        <div className="p-4" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono-tech" style={{ color: "#6C757D" }}>SELECIONADOS ({comparando.length}/4)</span>
            {comparando.length >= 2 && (
              <a href="#comparacao" className="text-xs font-mono-tech font-bold" style={{ color: "#1D4ED8" }}>VER COMPARAÇÃO ↓</a>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {comparando.map(p => (
              <div key={p.id} className="flex items-center gap-2 px-3 py-1.5"
                style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px" }}>
                <span className="text-xs font-mono-tech" style={{ color: "#212529" }}>{p.sku_codigo}</span>
                <button onClick={() => remover(p.id)} className="w-4 h-4 flex items-center justify-center hover:bg-red-100 rounded" style={{ color: "#DC2626" }}>
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search + product grid */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
        <div className="p-4" style={{ borderBottom: "1px solid #E2E8F0" }}>
          <input
            type="text"
            placeholder="Buscar por nome, SKU ou marca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 h-10 text-sm focus:outline-none"
            style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#212529" }}
          />
        </div>
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs font-mono-tech" style={{ color: "#6C757D" }}>CARREGANDO...</p>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
            {filtrados.map(p => {
              const sel = comparando.find(c => c.id === p.id);
              return (
                <button key={p.id} onClick={() => !sel && adicionar(p)}
                  disabled={!!sel || comparando.length >= 4}
                  className="text-left p-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: sel ? "rgba(29,78,216,0.08)" : "#F8F9FA", border: sel ? "1px solid rgba(29,78,216,0.3)" : "1px solid #E2E8F0", borderRadius: "2px" }}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: "#212529" }}>{p.nome_peca}</p>
                      <p className="text-xs font-mono-tech mt-0.5" style={{ color: "#1D4ED8" }}>SKU: {p.sku_codigo}</p>
                      {p.relacionamento_marca && <p className="text-xs mt-1" style={{ color: "#6C757D" }}>{p.relacionamento_marca}</p>}
                    </div>
                    <div className="flex-shrink-0">
                      {sel ? <CheckCircle2 className="w-4 h-4" style={{ color: "#1D4ED8" }} /> : <Plus className="w-4 h-4" style={{ color: "#9CA3AF" }} />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Comparison table */}
      {comparando.length >= 2 ? (
        <div id="comparacao" className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6" style={{ background: "#D32F2F" }} />
            <h2 className="text-base font-bold font-mono-tech" style={{ color: "#212529" }}>Comparação Técnica</h2>
          </div>
          <div className="overflow-x-auto" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "2px solid #E2E8F0" }}>
                  <th className="text-left p-3 font-mono-tech text-xs" style={{ color: "#6C757D", width: "180px" }}>ESPECIFICAÇÃO</th>
                  {comparando.map(p => (
                    <th key={p.id} className="p-3 text-left" style={{ minWidth: "180px" }}>
                      <p className="font-semibold text-sm mb-0.5" style={{ color: "#212529" }}>{p.nome_peca}</p>
                      <p className="text-xs font-mono-tech" style={{ color: "#1D4ED8" }}>SKU: {p.sku_codigo}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "CATEGORIA", render: p => p.relacionamento_categoria || "—" },
                  { label: "MARCA COMPATÍVEL", render: p => <span style={{ color: "#D32F2F", fontWeight: 600 }}>{p.relacionamento_marca || "—"}</span> },
                  { label: "PREÇO ATACADO", render: p => p.preco_base_atacado > 0 ? <span className="font-bold font-mono-tech" style={{ color: "#16A34A" }}>R$ {Number(p.preco_base_atacado).toFixed(2)}</span> : <span className="text-xs font-mono-tech" style={{ color: "#6C757D" }}>SOB CONSULTA</span> },
                  { label: "ESTOQUE", render: p => (p.estoque_disponivel || 0) > 0 ? <span style={{ color: "#16A34A" }}>● {p.estoque_disponivel} unid.</span> : <span style={{ color: "#DC2626" }}>● INDISPONÍVEL</span> },
                  { label: "DESCRIÇÃO", render: p => <span className="text-xs" style={{ color: "#6C757D" }}>{p.descricao || "—"}</span> },
                ].map(row => (
                  <tr key={row.label} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td className="p-3 font-mono-tech text-xs" style={{ color: "#6C757D", background: "#F8F9FA" }}>{row.label}</td>
                    {comparando.map(p => <td key={p.id} className="p-3 text-sm">{row.render(p)}</td>)}
                  </tr>
                ))}

                {comparando.some(p => p.especificacoes_eletricas) && (
                  <>
                    <tr>
                      <td colSpan={comparando.length + 1} className="p-3 font-mono-tech text-xs font-bold"
                        style={{ color: "#1D4ED8", background: "rgba(29,78,216,0.05)", borderTop: "2px solid #E2E8F0" }}>
                        <Zap className="w-3.5 h-3.5 inline mr-1" /> ESPECIFICAÇÕES ELÉTRICAS
                      </td>
                    </tr>
                    {[["amperes", "AMPERAGEM"], ["voltagem", "VOLTAGEM"], ["potencia_watts", "POTÊNCIA (W)"], ["potencia_hp", "POTÊNCIA (HP)"]].map(([key, label]) => {
                      if (!comparando.some(p => getEspec(p, key) !== "—")) return null;
                      return (
                        <tr key={key} style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td className="p-3 font-mono-tech text-xs" style={{ color: "#6C757D", background: "#F8F9FA" }}>{label}</td>
                          {comparando.map(p => <td key={p.id} className="p-3 font-mono-tech text-sm" style={{ color: "#1D4ED8" }}>{getEspec(p, key)}</td>)}
                        </tr>
                      );
                    })}
                  </>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex gap-3">
            <button onClick={() => window.print()}
              className="h-10 px-5 flex items-center gap-2 text-xs font-mono-tech mm-btn-tactile"
              style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#6C757D", borderRadius: "2px" }}>
              IMPRIMIR COMPARATIVO
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
          <GitCompare className="w-12 h-12 mx-auto mb-3" style={{ color: "#E2E8F0" }} />
          <p className="text-sm font-mono-tech mb-1" style={{ color: "#6C757D" }}>SELECIONE 2 OU MAIS PRODUTOS</p>
          <p className="text-xs" style={{ color: "#9CA3AF" }}>Busque e adicione produtos da lista acima</p>
        </div>
      )}
    </div>
  );
}
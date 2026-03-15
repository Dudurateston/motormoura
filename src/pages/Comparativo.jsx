import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  ArrowLeft, X, Plus, GitCompare, AlertCircle, 
  Package, Zap, DollarSign, Tag, CheckCircle2, XCircle 
} from "lucide-react";
import SEOHead from "../components/SEOHead";
import { analytics } from "@/components/analytics/analytics";

export default function Comparativo() {
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

  const adicionarAoComparativo = (produto) => {
    if (comparando.length >= 4) return;
    if (comparando.find(p => p.id === produto.id)) return;
    setComparando([...comparando, produto]);
  };

  const removerDoComparativo = (id) => {
    setComparando(comparando.filter(p => p.id !== id));
  };

  const produtosFiltrados = produtos.filter(p =>
    p.nome_peca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku_codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.relacionamento_marca?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEspecValue = (produto, key) => {
    return produto.especificacoes_eletricas?.[key] || "—";
  };

  return (
    <div className="mm-bg min-h-screen">
      <SEOHead 
        title="Comparativo de Peças | MotorMoura"
        description="Compare especificações técnicas, preços e compatibilidade de peças para motores e geradores"
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
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
              <GitCompare className="w-4 h-4" style={{ color: "#D32F2F" }} />
              <span className="text-xs font-mono-tech" style={{ color: "#D32F2F", letterSpacing: "0.15em" }}>COMPARATIVO B2B</span>
            </div>
            <h1 className="text-xl font-bold font-mono-tech" style={{ color: "#212529" }}>Comparar Peças Técnicas</h1>
          </div>
        </div>

        {/* Selected products bar */}
        {comparando.length > 0 && (
          <div className="mb-6 p-4" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono-tech" style={{ color: "#6C757D" }}>
                PRODUTOS SELECIONADOS ({comparando.length}/4)
              </span>
              {comparando.length >= 2 && (
                <a href="#comparacao" className="text-xs font-mono-tech font-bold" style={{ color: "#1D4ED8" }}>
                  VER COMPARAÇÃO ↓
                </a>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {comparando.map(p => (
                <div key={p.id} className="flex items-center gap-2 px-3 py-2" 
                  style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px" }}>
                  <span className="text-xs font-mono-tech" style={{ color: "#212529" }}>{p.sku_codigo}</span>
                  <button onClick={() => removerDoComparativo(p.id)} 
                    className="w-4 h-4 flex items-center justify-center hover:bg-red-100 rounded"
                    style={{ color: "#DC2626" }}>
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search & Product selection */}
        <div className="mb-8" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
          <div className="p-4 border-b" style={{ borderColor: "#E2E8F0" }}>
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
              {produtosFiltrados.map(p => {
                const jaSelecionado = comparando.find(c => c.id === p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => !jaSelecionado && adicionarAoComparativo(p)}
                    disabled={jaSelecionado || comparando.length >= 4}
                    className="text-left p-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: jaSelecionado ? "rgba(29,78,216,0.08)" : "#F8F9FA",
                      border: jaSelecionado ? "1px solid rgba(29,78,216,0.3)" : "1px solid #E2E8F0",
                      borderRadius: "2px",
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: "#212529" }}>{p.nome_peca}</p>
                        <p className="text-xs font-mono-tech mt-0.5" style={{ color: "#1D4ED8" }}>SKU: {p.sku_codigo}</p>
                        {p.relacionamento_marca && (
                          <p className="text-xs mt-1" style={{ color: "#6C757D" }}>{p.relacionamento_marca}</p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {jaSelecionado ? (
                          <CheckCircle2 className="w-4 h-4" style={{ color: "#1D4ED8" }} />
                        ) : (
                          <Plus className="w-4 h-4" style={{ color: "#9CA3AF" }} />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Comparison Table */}
        {comparando.length >= 2 ? (
          <div id="comparacao" className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6" style={{ background: "#D32F2F" }} />
              <h2 className="text-lg font-bold font-mono-tech" style={{ color: "#212529" }}>Comparação Técnica</h2>
            </div>

            <div className="overflow-x-auto" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "2px solid #E2E8F0" }}>
                    <th className="text-left p-3 font-mono-tech text-xs" style={{ color: "#6C757D", width: "200px" }}>
                      ESPECIFICAÇÃO
                    </th>
                    {comparando.map(p => (
                      <th key={p.id} className="p-3 text-left" style={{ minWidth: "200px" }}>
                        <div>
                          <p className="font-semibold mb-1" style={{ color: "#212529" }}>{p.nome_peca}</p>
                          <p className="text-xs font-mono-tech" style={{ color: "#1D4ED8" }}>SKU: {p.sku_codigo}</p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Categoria */}
                  <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td className="p-3 font-mono-tech text-xs" style={{ color: "#6C757D", background: "#F8F9FA" }}>
                      CATEGORIA
                    </td>
                    {comparando.map(p => (
                      <td key={p.id} className="p-3" style={{ color: "#212529" }}>
                        {p.relacionamento_categoria || "—"}
                      </td>
                    ))}
                  </tr>

                  {/* Marca */}
                  <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td className="p-3 font-mono-tech text-xs" style={{ color: "#6C757D", background: "#F8F9FA" }}>
                      MARCA COMPATÍVEL
                    </td>
                    {comparando.map(p => (
                      <td key={p.id} className="p-3 font-semibold" style={{ color: "#D32F2F" }}>
                        {p.relacionamento_marca || "—"}
                      </td>
                    ))}
                  </tr>

                  {/* Preço */}
                  <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td className="p-3 font-mono-tech text-xs" style={{ color: "#6C757D", background: "#F8F9FA" }}>
                      PREÇO ATACADO
                    </td>
                    {comparando.map(p => (
                      <td key={p.id} className="p-3">
                        {p.preco_base_atacado > 0 ? (
                          <span className="font-bold font-mono-tech" style={{ color: "#16A34A" }}>
                            R$ {Number(p.preco_base_atacado).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-xs font-mono-tech" style={{ color: "#6C757D" }}>SOB CONSULTA</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Estoque */}
                  <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td className="p-3 font-mono-tech text-xs" style={{ color: "#6C757D", background: "#F8F9FA" }}>
                      ESTOQUE
                    </td>
                    {comparando.map(p => (
                      <td key={p.id} className="p-3">
                        <div className="flex items-center gap-2">
                          {(p.estoque_disponivel || 0) > 0 ? (
                            <>
                              <div className="w-2 h-2 rounded-full" style={{ background: "#4ADE80" }} />
                              <span className="font-mono-tech" style={{ color: "#16A34A" }}>
                                {p.estoque_disponivel} unid.
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 rounded-full" style={{ background: "#DC2626" }} />
                              <span className="font-mono-tech" style={{ color: "#DC2626" }}>INDISPONÍVEL</span>
                            </>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Specs elétricas */}
                  {comparando.some(p => p.especificacoes_eletricas) && (
                    <>
                      <tr>
                        <td colSpan={comparando.length + 1} className="p-3 font-mono-tech text-xs font-bold" 
                          style={{ color: "#1D4ED8", background: "rgba(29,78,216,0.05)", borderTop: "2px solid #E2E8F0" }}>
                          <div className="flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5" />
                            ESPECIFICAÇÕES ELÉTRICAS
                          </div>
                        </td>
                      </tr>

                      {["amperes", "voltagem", "potencia_watts", "potencia_hp"].map(key => {
                        const hasData = comparando.some(p => getEspecValue(p, key) !== "—");
                        if (!hasData) return null;
                        
                        const labels = {
                          amperes: "AMPERAGEM",
                          voltagem: "VOLTAGEM",
                          potencia_watts: "POTÊNCIA (W)",
                          potencia_hp: "POTÊNCIA (HP)"
                        };

                        return (
                          <tr key={key} style={{ borderBottom: "1px solid #F1F5F9" }}>
                            <td className="p-3 font-mono-tech text-xs" style={{ color: "#6C757D", background: "#F8F9FA" }}>
                              {labels[key]}
                            </td>
                            {comparando.map(p => (
                              <td key={p.id} className="p-3 font-mono-tech" style={{ color: "#1D4ED8" }}>
                                {getEspecValue(p, key)}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </>
                  )}

                  {/* Descrição */}
                  <tr>
                    <td className="p-3 font-mono-tech text-xs" style={{ color: "#6C757D", background: "#F8F9FA" }}>
                      DESCRIÇÃO
                    </td>
                    {comparando.map(p => (
                      <td key={p.id} className="p-3 text-xs leading-relaxed" style={{ color: "#6C757D" }}>
                        {p.descricao || "—"}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div className="flex gap-3 flex-wrap">
              <Link to={createPageUrl("Catalogo")} className="flex-1 min-w-[200px]">
                <button className="w-full h-11 flex items-center justify-center gap-2 text-sm font-mono-tech font-bold mm-btn-tactile"
                  style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "#fff", borderRadius: "2px", border: "none" }}>
                  <Package className="w-4 h-4" />
                  ADICIONAR AO ORÇAMENTO
                </button>
              </Link>
              <button 
                onClick={() => window.print()}
                className="flex-1 min-w-[200px] h-11 flex items-center justify-center gap-2 text-sm font-mono-tech mm-btn-tactile"
                style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#6C757D", borderRadius: "2px" }}>
                IMPRIMIR COMPARATIVO
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
            <GitCompare className="w-12 h-12 mx-auto mb-3" style={{ color: "#E2E8F0" }} />
            <p className="text-sm font-mono-tech mb-1" style={{ color: "#6C757D" }}>
              SELECIONE 2 OU MAIS PRODUTOS
            </p>
            <p className="text-xs" style={{ color: "#9CA3AF" }}>
              Adicione produtos da lista acima para iniciar a comparação
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
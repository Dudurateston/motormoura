import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, Wrench, Save, CheckCircle2, ChevronRight, AlertCircle, Sparkles, Loader2, Edit2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { trackEvent } from "@/components/analytics/analytics";

const TIPO_TO_CATALOG = {
  "Motor a Gasolina": "Motores a Gasolina",
  "Motor a Diesel": "Motores a Diesel",
  "Gerador 4T": "Geradores 4 Tempos",
  "Gerador 2T": "Geradores 2 Tempos",
  "Motobomba": "Motobombas 4 Tempos",
  "Pulverizador": "Bombas de Pulverização",
};

function getCatalogUrl(equip) {
  const params = new URLSearchParams();
  const cat = TIPO_TO_CATALOG[equip.tipo_normalizado];
  if (cat) params.set("categoria", cat);
  else if (equip.marca && equip.marca !== "Outra") params.set("q", equip.marca);
  else if (equip.descricao_original) params.set("q", equip.descricao_original.split(" ").slice(0, 3).join(" "));
  return `${createPageUrl("Catalogo")}?${params.toString()}`;
}

export default function GaragemSection({ lojista, onSaved, onGoToDados }) {
  const [garagem, setGaragem] = useState(lojista?.garagem || []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPreview, setAiPreview] = useState(null);
  const [aiError, setAiError] = useState("");

  const handleAiParse = async () => {
    if (!aiText.trim()) return;
    setAiLoading(true);
    setAiError("");
    setAiPreview(null);

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Você é um especialista técnico da MotorMoura, distribuidora brasileira de peças de reposição para motores de combustão interna, geradores, motobombas e pulverizadores.

O lojista descreveu seus equipamentos: "${aiText}"

Para cada equipamento identificado, extraia as informações técnicas com o maior detalhe possível. Mesmo que o equipamento não seja uma marca/modelo que vendemos diretamente, identifique-o para que possamos recomendar peças compatíveis.

Campos obrigatórios:
- descricao_original: transcreva exatamente o que o usuário disse sobre esse equipamento
- tipo_normalizado: classifique em um dos seguintes (escolha o mais próximo): "Motor a Gasolina", "Motor a Diesel", "Gerador 4T", "Gerador 2T", "Motobomba", "Pulverizador", "Compressor", "Roçadeira", "Outro"
- marca: marca do fabricante se identificável (ex: Honda, Toyama, Tekna, Branco, Buffalo, Kawasaki, Briggs & Stratton, etc.) ou "Não identificada"
- modelo: código do modelo específico se mencionado (ex: GX160, GX200, 5.5HP, etc.)
- ano: ano de fabricação se mencionado
- potencia: potência em HP ou KVA se mencionada ou inferível (ex: "5.5 HP", "7 KVA")
- cilindrada: cilindrada em cc se mencionada (ex: "196cc")
- uso_principal: como o lojista usa esse equipamento (ex: "irrigação", "geração de energia", "mecânica automotiva", etc.)
- observacoes_tecnicas: qualquer detalhe técnico relevante que possa ajudar a identificar peças compatíveis (ex: carburador tipo, número de cilindros, refrigerado a ar, etc.)
- potencial_pecas: liste até 3 tipos de peças que este equipamento provavelmente precisa com frequência

Retorne JSON com array "equipamentos".`,
      response_json_schema: {
        type: "object",
        properties: {
          equipamentos: {
            type: "array",
            items: {
              type: "object",
              properties: {
                descricao_original: { type: "string" },
                tipo_normalizado: { type: "string" },
                marca: { type: "string" },
                modelo: { type: "string" },
                ano: { type: "string" },
                potencia: { type: "string" },
                cilindrada: { type: "string" },
                uso_principal: { type: "string" },
                observacoes_tecnicas: { type: "string" },
                potencial_pecas: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      }
    });

    const equipamentos = result?.equipamentos;
    if (!equipamentos || equipamentos.length === 0) {
      setAiError("Não consegui identificar equipamentos. Tente descrever com mais detalhes, incluindo marca e modelo se souber.");
    } else {
      setAiPreview(equipamentos.map(e => ({ ...e, id: Date.now().toString() + Math.random() })));
    }
    setAiLoading(false);
  };

  const confirmAiPreview = () => {
    const updated = [...garagem, ...aiPreview];
    setGaragem(updated);
    setAiPreview(null);
    setAiText("");
    trackEvent("garagem_ai_add", { count: aiPreview.length });
  };

  const removeEquipamento = (equipId) => {
    setGaragem((g) => g.filter((e) => e.id !== equipId));
  };

  const handleSave = async () => {
    if (!lojista) return;
    setSaving(true);
    await base44.entities.Lojistas.update(lojista.id, { garagem });
    setSaving(false);
    setSaved(true);
    onSaved({ ...lojista, garagem });
    setTimeout(() => setSaved(false), 3500);
  };

  if (!lojista) {
    return (
      <div className="p-6 text-center" style={{ background: "#FFFFFF", border: "1px solid rgba(180,83,9,0.25)", borderRadius: "4px" }}>
        <AlertCircle className="w-10 h-10 mx-auto mb-3" style={{ color: "#B45309" }} />
        <p className="text-sm font-mono-tech mb-1" style={{ color: "#212529" }}>COMPLETE SEU CADASTRO PRIMEIRO</p>
        <p className="text-xs mb-4" style={{ color: "#9CA3AF" }}>Preencha os dados da empresa na aba "Dados" antes de cadastrar equipamentos.</p>
        {onGoToDados && (
          <button onClick={onGoToDados}
            className="h-9 px-5 text-xs font-mono-tech font-bold mm-btn-tactile"
            style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "#fff", borderRadius: "2px", border: "none" }}>
            IR PARA DADOS DA EMPRESA
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* AI Input — sempre visível */}
      <div className="p-5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4" style={{ color: "#1D4ED8" }} />
          <span className="text-xs font-mono-tech font-bold" style={{ color: "#212529" }}>ADICIONAR EQUIPAMENTOS</span>
        </div>
        <p className="text-xs mb-3" style={{ color: "#9CA3AF" }}>
          Descreva livremente — marca, modelo, potência, uso. A IA identifica e estrutura para recomendar as peças certas.
        </p>
        <textarea
          value={aiText}
          onChange={(e) => setAiText(e.target.value)}
          placeholder="Ex: tenho uma Honda GX200 usada em irrigação, um gerador Toyama 7KVA que fica num sítio e uma motobomba de 3 polegadas que não sei a marca mas tem 5.5HP..."
          rows={3}
          className="w-full px-3 py-2 text-sm focus:outline-none resize-none mb-2"
          style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#212529", fontFamily: "'Space Grotesk', sans-serif" }}
        />
        <button onClick={handleAiParse} disabled={aiLoading || !aiText.trim()}
          className="flex items-center gap-2 h-9 px-4 text-xs font-mono-tech font-bold mm-btn-tactile disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #1D4ED8, #1e40af)", color: "#fff", borderRadius: "2px", border: "none" }}>
          {aiLoading
            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> IDENTIFICANDO...</>
            : <><Sparkles className="w-3.5 h-3.5" /> IDENTIFICAR E ADICIONAR</>}
        </button>

        {aiError && (
          <p className="text-xs font-mono-tech mt-3 px-3 py-2" style={{ background: "rgba(211,47,47,0.08)", color: "#D32F2F", borderRadius: "2px" }}>
            {aiError}
          </p>
        )}

        {/* Preview */}
        {aiPreview && aiPreview.length > 0 && (
          <div className="mt-4 p-4 space-y-3" style={{ background: "#F8F9FA", border: "1px solid rgba(22,163,74,0.25)", borderRadius: "4px" }}>
            <p className="text-xs font-mono-tech" style={{ color: "#16A34A" }}>
              <CheckCircle2 className="w-3 h-3 inline mr-1" />
              {aiPreview.length} EQUIPAMENTO(S) IDENTIFICADO(S) — revise e confirme:
            </p>
            {aiPreview.map((e, idx) => (
              <div key={e.id} className="p-3" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "2px" }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-xs font-bold font-mono-tech mb-0.5" style={{ color: "#212529" }}>
                      {[e.marca !== "Não identificada" ? e.marca : null, e.modelo].filter(Boolean).join(" ") || e.tipo_normalizado}
                      {e.potencia && <span className="ml-2 font-normal" style={{ color: "#1D4ED8" }}>{e.potencia}</span>}
                    </p>
                    <p className="text-xs" style={{ color: "#6C757D" }}>
                      {e.tipo_normalizado}{e.uso_principal ? ` · ${e.uso_principal}` : ""}{e.ano ? ` · ${e.ano}` : ""}
                    </p>
                    {e.potencial_pecas?.length > 0 && (
                      <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
                        Peças prováveis: {e.potencial_pecas.join(", ")}
                      </p>
                    )}
                  </div>
                  <button onClick={() => setAiPreview(aiPreview.filter((_, i) => i !== idx))}
                    className="w-6 h-6 flex items-center justify-center hover:bg-red-50 flex-shrink-0" style={{ borderRadius: "2px", color: "#9CA3AF" }}>
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            <div className="flex gap-2">
              <button onClick={confirmAiPreview}
                className="h-9 px-4 text-xs font-mono-tech font-bold mm-btn-tactile"
                style={{ background: "linear-gradient(135deg, #16A34A, #15803d)", color: "#fff", borderRadius: "2px", border: "none" }}>
                <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" /> CONFIRMAR E ADICIONAR
              </button>
              <button onClick={() => setAiPreview(null)}
                className="h-9 px-4 text-xs font-mono-tech"
                style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#6C757D", borderRadius: "2px" }}>
                CANCELAR
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Equipment list */}
      <div className="p-5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
        <div className="flex items-center gap-2 mb-3">
          <Wrench className="w-4 h-4" style={{ color: "#D32F2F" }} />
          <span className="text-xs font-mono-tech font-bold" style={{ color: "#212529" }}>MINHA GARAGEM</span>
          {garagem.length > 0 && (
            <span className="text-xs font-mono-tech px-2 py-0.5"
              style={{ background: "rgba(211,47,47,0.08)", border: "1px solid rgba(211,47,47,0.2)", color: "#D32F2F", borderRadius: "2px" }}>
              {garagem.length}
            </span>
          )}
        </div>

        {garagem.length === 0 ? (
          <div className="py-8 text-center">
            <Wrench className="w-10 h-10 mx-auto mb-2" style={{ color: "#E2E8F0" }} />
            <p className="text-xs font-mono-tech" style={{ color: "#9CA3AF" }}>GARAGEM VAZIA</p>
            <p className="text-xs mt-1" style={{ color: "#CBD5E1" }}>Descreva seus equipamentos acima para começar</p>
          </div>
        ) : (
          <div className="space-y-2">
            {garagem.map((equip) => (
              <div key={equip.id} className="flex items-start gap-3 p-3"
                style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px" }}>
                <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(211,47,47,0.08)", border: "1px solid rgba(211,47,47,0.2)", borderRadius: "2px" }}>
                  <Wrench className="w-3.5 h-3.5" style={{ color: "#D32F2F" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold font-mono-tech" style={{ color: "#212529" }}>
                    {[equip.marca !== "Não identificada" ? equip.marca : null, equip.modelo].filter(Boolean).join(" ") || equip.tipo_normalizado || equip.tipo || "Equipamento"}
                    {(equip.potencia || equip.cilindrada) && (
                      <span className="ml-2 font-normal" style={{ color: "#1D4ED8" }}>
                        {[equip.potencia, equip.cilindrada].filter(Boolean).join(" · ")}
                      </span>
                    )}
                  </p>
                  <p className="text-xs" style={{ color: "#6C757D" }}>
                    {equip.tipo_normalizado || equip.tipo}
                    {equip.uso_principal ? ` · ${equip.uso_principal}` : ""}
                    {equip.ano ? ` · ${equip.ano}` : ""}
                  </p>
                  {equip.potencial_pecas?.length > 0 && (
                    <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
                      Peças: {equip.potencial_pecas.slice(0, 2).join(", ")}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link to={getCatalogUrl(equip)}>
                    <button className="flex items-center gap-1 h-7 px-2 text-xs font-mono-tech hover:bg-blue-50 transition-colors"
                      style={{ border: "1px solid rgba(29,78,216,0.2)", color: "#1D4ED8", borderRadius: "2px" }}>
                      Peças <ChevronRight className="w-3 h-3" />
                    </button>
                  </Link>
                  <button onClick={() => removeEquipamento(equip.id)}
                    className="w-7 h-7 flex items-center justify-center hover:bg-red-50 transition-colors"
                    style={{ borderRadius: "2px", color: "#9CA3AF" }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={saving}
          className="mm-btn-tactile flex items-center gap-2 px-5 h-10 text-xs font-mono-tech font-bold disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "#fff", borderRadius: "2px", border: "none" }}>
          <Save className="w-3.5 h-3.5" />
          {saving ? "SALVANDO..." : "SALVAR GARAGEM"}
        </button>
        {saved && (
          <div className="flex items-center gap-2 px-3 h-10 text-xs font-mono-tech font-semibold"
            style={{ background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.3)", color: "#16A34A", borderRadius: "2px" }}>
            <CheckCircle2 className="w-4 h-4" /> GARAGEM SALVA!
          </div>
        )}
      </div>
    </div>
  );
}
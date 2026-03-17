import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, Wrench, Save, CheckCircle2, ChevronRight, AlertCircle, Sparkles, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { analytics } from "@/components/analytics/analytics";

// Maps parsed tipo to catalog params
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
  const cat = TIPO_TO_CATALOG[equip.tipo];
  if (cat) params.set("categoria", cat);
  if (equip.marca && equip.marca !== "Outra") params.set("marca", equip.marca);
  if (!cat && !equip.marca && equip.tipo) params.set("q", equip.tipo);
  return `${createPageUrl("Catalogo")}?${params.toString()}`;
}

export default function GaragemSection({ lojista, onSaved }) {
  const [garagem, setGaragem] = useState(lojista?.garagem || []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // AI mode state
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPreview, setAiPreview] = useState(null); // parsed result pending confirmation
  const [aiError, setAiError] = useState("");
  const [mode, setMode] = useState("list"); // "list" | "ai"

  const handleAiParse = async () => {
    if (!aiText.trim()) return;
    setAiLoading(true);
    setAiError("");
    setAiPreview(null);

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Você é um assistente técnico da MotorMoura, distribuidora de peças para motores, geradores e motobombas.

O usuário descreveu seus equipamentos livremente: "${aiText}"

Extraia os equipamentos mencionados e classifique cada um com as informações disponíveis.

Regras:
- tipo deve ser um dos seguintes (escolha o mais próximo): "Motor a Gasolina", "Motor a Diesel", "Gerador 4T", "Gerador 2T", "Motobomba", "Pulverizador", "Outro"
- marca deve ser uma das seguintes se identificável: "Honda", "Toyama", "Tekna", "Branco", "Buffalo", "Husqvarna", "Outra" — ou o que for mencionado
- modelo: o modelo específico se mencionado (ex: GX160, GX200, etc.)
- ano: se mencionado
- descricao_livre: transcreva exatamente como o usuário descreveu aquele equipamento (útil para buscas futuras)

Se o equipamento não se encaixar bem nas categorias, coloque tipo "Outro" e preserve a descrição livre.
Retorne um JSON com um array "equipamentos".`,
      response_json_schema: {
        type: "object",
        properties: {
          equipamentos: {
            type: "array",
            items: {
              type: "object",
              properties: {
                tipo: { type: "string" },
                marca: { type: "string" },
                modelo: { type: "string" },
                ano: { type: "string" },
                descricao_livre: { type: "string" }
              }
            }
          }
        }
      }
    });

    const equipamentos = result?.equipamentos;
    if (!equipamentos || equipamentos.length === 0) {
      setAiError("Não consegui identificar equipamentos. Tente descrever com mais detalhes.");
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
    setMode("list");
    analytics.filterApply("garagem_ai_add", aiPreview.length.toString());
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
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4" style={{ color: "#D32F2F" }} />
            <span className="text-xs font-mono-tech font-bold" style={{ color: "#212529" }}>MINHA GARAGEM</span>
            {garagem.length > 0 && (
              <span className="text-xs font-mono-tech px-2 py-0.5"
                style={{ background: "rgba(211,47,47,0.08)", border: "1px solid rgba(211,47,47,0.2)", color: "#D32F2F", borderRadius: "2px" }}>
                {garagem.length}
              </span>
            )}
          </div>
          <button onClick={() => setMode(mode === "ai" ? "list" : "ai")}
            className="flex items-center gap-1.5 h-8 px-3 text-xs font-mono-tech mm-btn-tactile"
            style={{ background: mode === "ai" ? "rgba(29,78,216,0.1)" : "rgba(211,47,47,0.08)", border: `1px solid ${mode === "ai" ? "rgba(29,78,216,0.35)" : "rgba(211,47,47,0.25)"}`, color: mode === "ai" ? "#1D4ED8" : "#D32F2F", borderRadius: "2px" }}>
            {mode === "ai" ? <><Wrench className="w-3 h-3" /> Ver lista</> : <><Sparkles className="w-3 h-3" /> Adicionar com IA</>}
          </button>
        </div>
        <p className="text-xs mb-4" style={{ color: "#9CA3AF" }}>
          Diga o que você tem e a IA identifica — cada equipamento vira um atalho para as peças compatíveis.
        </p>

        {/* AI MODE */}
        {mode === "ai" && (
          <div className="space-y-3">
            <div className="p-4" style={{ background: "rgba(29,78,216,0.03)", border: "1px solid rgba(29,78,216,0.15)", borderRadius: "4px" }}>
              <p className="text-xs font-mono-tech mb-2" style={{ color: "#1D4ED8" }}>
                <Sparkles className="w-3 h-3 inline mr-1" />DESCREVA SEUS EQUIPAMENTOS LIVREMENTE
              </p>
              <textarea
                value={aiText}
                onChange={(e) => setAiText(e.target.value)}
                placeholder="Ex: tenho uma Honda GX200, uma motobomba Toyama de 3 polegadas, e um gerador de 5.5 kva que não sei a marca..."
                rows={3}
                className="w-full px-3 py-2 text-sm focus:outline-none resize-none"
                style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#212529", fontFamily: "'Space Grotesk', sans-serif" }}
              />
              <button onClick={handleAiParse} disabled={aiLoading || !aiText.trim()}
                className="mt-2 flex items-center gap-2 h-9 px-4 text-xs font-mono-tech font-bold mm-btn-tactile disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #1D4ED8, #1e40af)", color: "#fff", borderRadius: "2px", border: "none" }}>
                {aiLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> IDENTIFICANDO...</> : <><Sparkles className="w-3.5 h-3.5" /> IDENTIFICAR EQUIPAMENTOS</>}
              </button>
            </div>

            {aiError && (
              <p className="text-xs font-mono-tech px-3 py-2" style={{ background: "rgba(211,47,47,0.08)", color: "#D32F2F", borderRadius: "2px" }}>
                {aiError}
              </p>
            )}

            {/* Preview dos equipamentos identificados */}
            {aiPreview && aiPreview.length > 0 && (
              <div className="p-4 space-y-3" style={{ background: "#F8F9FA", border: "1px solid rgba(22,163,74,0.25)", borderRadius: "4px" }}>
                <p className="text-xs font-mono-tech" style={{ color: "#16A34A" }}>
                  <CheckCircle2 className="w-3 h-3 inline mr-1" />
                  {aiPreview.length} EQUIPAMENTO(S) IDENTIFICADO(S) — confirme antes de adicionar:
                </p>
                {aiPreview.map((e, idx) => (
                  <div key={e.id} className="flex items-start gap-3 p-3" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "2px" }}>
                    <div className="w-7 h-7 flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.2)", borderRadius: "2px" }}>
                      <Wrench className="w-3.5 h-3.5" style={{ color: "#16A34A" }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold font-mono-tech" style={{ color: "#212529" }}>
                        {[e.marca, e.modelo].filter(Boolean).join(" ") || e.tipo}
                      </p>
                      <p className="text-xs" style={{ color: "#6C757D" }}>
                        {e.tipo}{e.ano ? ` · ${e.ano}` : ""}
                      </p>
                      {e.descricao_livre && (
                        <p className="text-xs mt-0.5 italic" style={{ color: "#9CA3AF" }}>"{e.descricao_livre}"</p>
                      )}
                    </div>
                    <button onClick={() => setAiPreview(aiPreview.filter((_, i) => i !== idx))}
                      className="w-6 h-6 flex items-center justify-center hover:bg-red-50 transition-colors flex-shrink-0" style={{ borderRadius: "2px", color: "#9CA3AF" }}>
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <button onClick={confirmAiPreview}
                    className="h-9 px-4 text-xs font-mono-tech font-bold mm-btn-tactile"
                    style={{ background: "linear-gradient(135deg, #16A34A, #15803d)", color: "#fff", borderRadius: "2px", border: "none" }}>
                    <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" /> ADICIONAR À GARAGEM
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
        )}

        {/* LIST MODE */}
        {mode === "list" && (
          garagem.length === 0 ? (
            <div className="py-8 text-center">
              <Wrench className="w-10 h-10 mx-auto mb-2" style={{ color: "#E2E8F0" }} />
              <p className="text-xs font-mono-tech" style={{ color: "#9CA3AF" }}>GARAGEM VAZIA</p>
              <p className="text-xs mt-1 mb-4" style={{ color: "#CBD5E1" }}>Clique em "Adicionar com IA" e descreva seus equipamentos</p>
              <button onClick={() => setMode("ai")}
                className="flex items-center gap-2 h-9 px-4 text-xs font-mono-tech font-bold mm-btn-tactile mx-auto"
                style={{ background: "linear-gradient(135deg, #1D4ED8, #1e40af)", color: "#fff", borderRadius: "2px", border: "none" }}>
                <Sparkles className="w-3.5 h-3.5" /> ADICIONAR COM IA
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {garagem.map((equip) => (
                <div key={equip.id} className="flex items-center gap-3 p-3"
                  style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px" }}>
                  <div className="w-7 h-7 flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(211,47,47,0.08)", border: "1px solid rgba(211,47,47,0.2)", borderRadius: "2px" }}>
                    <Wrench className="w-3.5 h-3.5" style={{ color: "#D32F2F" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold font-mono-tech" style={{ color: "#212529" }}>
                      {[equip.marca, equip.modelo].filter(Boolean).join(" ") || equip.tipo || "Equipamento"}
                    </p>
                    <p className="text-xs" style={{ color: "#6C757D" }}>
                      {equip.tipo}{equip.ano ? ` · ${equip.ano}` : ""}
                      {equip.descricao_livre && equip.tipo === "Outro" && ` · ${equip.descricao_livre.slice(0, 40)}...`}
                    </p>
                  </div>
                  <Link to={getCatalogUrl(equip)}>
                    <button className="flex items-center gap-1 h-7 px-2 text-xs font-mono-tech hover:bg-blue-50 transition-colors"
                      style={{ border: "1px solid rgba(29,78,216,0.2)", color: "#1D4ED8", borderRadius: "2px" }}>
                      Peças <ChevronRight className="w-3 h-3" />
                    </button>
                  </Link>
                  <button onClick={() => removeEquipamento(equip.id)}
                    className="w-7 h-7 flex items-center justify-center flex-shrink-0 hover:bg-red-50 transition-colors"
                    style={{ borderRadius: "2px", color: "#9CA3AF" }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )
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
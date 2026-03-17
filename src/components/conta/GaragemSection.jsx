import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, Wrench, Save, CheckCircle2, ChevronRight, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { analytics } from "@/components/analytics/analytics";

const TIPOS = ["Motor a Gasolina", "Motor a Diesel", "Gerador 4T", "Gerador 2T", "Motobomba", "Pulverizador", "Outro"];
const MARCAS = ["Honda", "Toyama", "Tekna", "Branco", "Buffalo", "Husqvarna", "Outra"];

// Maps garagem tipo to catalog search params
const TIPO_TO_CATALOG = {
  "Motor a Gasolina": { categoria: "Motores a Gasolina" },
  "Motor a Diesel": { categoria: "Motores a Diesel" },
  "Gerador 4T": { categoria: "Geradores 4 Tempos" },
  "Gerador 2T": { categoria: "Geradores 2 Tempos" },
  "Motobomba": { categoria: "Motobombas 4 Tempos" },
  "Pulverizador": { categoria: "Bombas de Pulverização" },
};

export default function GaragemSection({ lojista, onSaved }) {
  const [garagem, setGaragem] = useState(lojista?.garagem || []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [novoEquip, setNovoEquip] = useState({ modelo: "", marca: "", tipo: "", ano: "" });
  const [adding, setAdding] = useState(false);

  const addEquipamento = () => {
    if (!novoEquip.tipo) return;
    const equip = { ...novoEquip, id: Date.now().toString() };
    const updated = [...garagem, equip];
    setGaragem(updated);
    setNovoEquip({ modelo: "", marca: "", tipo: "", ano: "" });
    setAdding(false);
    analytics.filterApply("garagem_add", novoEquip.tipo);
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

  // Build catalog links per garagem entry (marca + tipo)
  const getCatalogUrl = (equip) => {
    const params = new URLSearchParams();
    const catMap = TIPO_TO_CATALOG[equip.tipo];
    if (catMap?.categoria) params.set("categoria", catMap.categoria);
    if (equip.marca && equip.marca !== "Outra") params.set("marca", equip.marca);
    return `${createPageUrl("Catalogo")}?${params.toString()}`;
  };

  // No lojista yet
  if (!lojista) {
    return (
      <div className="p-6 text-center" style={{ background: "#FFFFFF", border: "1px solid rgba(180,83,9,0.25)", borderRadius: "4px" }}>
        <AlertCircle className="w-10 h-10 mx-auto mb-3" style={{ color: "#B45309" }} />
        <p className="text-sm font-mono-tech mb-1" style={{ color: "#212529" }}>COMPLETE SEU CADASTRO PRIMEIRO</p>
        <p className="text-xs mb-4" style={{ color: "#9CA3AF" }}>
          Para registar a sua garagem, preencha primeiro os dados da empresa na aba "Dados da Empresa".
        </p>
        <button onClick={() => {}} className="text-xs font-mono-tech" style={{ color: "#D32F2F" }}>← Ir para Dados da Empresa</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
        <div className="flex items-center justify-between mb-3">
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
          <button onClick={() => setAdding(!adding)}
            className="flex items-center gap-1.5 h-8 px-3 text-xs font-mono-tech mm-btn-tactile"
            style={{ background: "rgba(211,47,47,0.08)", border: "1px solid rgba(211,47,47,0.25)", color: "#D32F2F", borderRadius: "2px" }}>
            <Plus className="w-3.5 h-3.5" /> ADICIONAR
          </button>
        </div>

        <p className="text-xs mb-4" style={{ color: "#9CA3AF" }}>
          Registre seus equipamentos. Cada um gera atalhos diretos às peças compatíveis no catálogo.
        </p>

        {/* Add form */}
        {adding && (
          <div className="p-4 mb-4 space-y-3" style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
            <p className="text-xs font-mono-tech" style={{ color: "#6C757D" }}>NOVO EQUIPAMENTO</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-mono-tech mb-1" style={{ color: "#9CA3AF" }}>TIPO *</label>
                <select value={novoEquip.tipo} onChange={(e) => setNovoEquip((n) => ({ ...n, tipo: e.target.value }))}
                  className="w-full h-9 px-2 text-xs focus:outline-none"
                  style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#212529", fontFamily: "'Space Grotesk', sans-serif" }}>
                  <option value="">Selecione...</option>
                  {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono-tech mb-1" style={{ color: "#9CA3AF" }}>MARCA</label>
                <select value={novoEquip.marca} onChange={(e) => setNovoEquip((n) => ({ ...n, marca: e.target.value }))}
                  className="w-full h-9 px-2 text-xs focus:outline-none"
                  style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#212529", fontFamily: "'Space Grotesk', sans-serif" }}>
                  <option value="">Selecione...</option>
                  {MARCAS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono-tech mb-1" style={{ color: "#9CA3AF" }}>MODELO</label>
                <input value={novoEquip.modelo} onChange={(e) => setNovoEquip((n) => ({ ...n, modelo: e.target.value }))}
                  placeholder="Ex: GX160" className="w-full h-9 px-2 text-xs focus:outline-none"
                  style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#212529", fontFamily: "'Space Grotesk', sans-serif" }} />
              </div>
              <div>
                <label className="block text-xs font-mono-tech mb-1" style={{ color: "#9CA3AF" }}>ANO</label>
                <input value={novoEquip.ano} onChange={(e) => setNovoEquip((n) => ({ ...n, ano: e.target.value }))}
                  placeholder="Ex: 2022" className="w-full h-9 px-2 text-xs focus:outline-none"
                  style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#212529", fontFamily: "'Space Grotesk', sans-serif" }} />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={addEquipamento} disabled={!novoEquip.tipo}
                className="h-8 px-4 text-xs font-mono-tech font-bold mm-btn-tactile disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "#fff", borderRadius: "2px", border: "none" }}>
                CONFIRMAR
              </button>
              <button onClick={() => setAdding(false)} className="h-8 px-4 text-xs font-mono-tech"
                style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#6C757D", borderRadius: "2px" }}>
                CANCELAR
              </button>
            </div>
          </div>
        )}

        {garagem.length === 0 ? (
          <div className="py-8 text-center">
            <Wrench className="w-10 h-10 mx-auto mb-2" style={{ color: "#E2E8F0" }} />
            <p className="text-xs font-mono-tech" style={{ color: "#9CA3AF" }}>GARAGEM VAZIA</p>
            <p className="text-xs mt-1" style={{ color: "#CBD5E1" }}>Adicione equipamentos para receber recomendações personalizadas</p>
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
                    {[equip.marca, equip.modelo].filter(Boolean).join(" ") || equip.tipo}
                  </p>
                  <p className="text-xs" style={{ color: "#6C757D" }}>
                    {equip.tipo}{equip.ano ? ` · ${equip.ano}` : ""}
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
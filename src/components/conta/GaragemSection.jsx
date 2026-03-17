import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, Wrench, Save, CheckCircle2, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const TIPOS = ["Motor a Gasolina", "Motor a Diesel", "Gerador 4T", "Gerador 2T", "Motobomba", "Pulverizador", "Outro"];
const MARCAS = ["Honda", "Toyama", "Tekna", "Branco", "Buffalo", "Husqvarna", "Outra"];

export default function GaragemSection({ lojista, onSaved }) {
  const [garagem, setGaragem] = useState(lojista?.garagem || []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [novoEquip, setNovoEquip] = useState({ modelo: "", marca: "", tipo: "", ano: "" });
  const [adding, setAdding] = useState(false);

  const addEquipamento = () => {
    if (!novoEquip.modelo && !novoEquip.tipo) return;
    const updated = [...garagem, { ...novoEquip, id: Date.now().toString() }];
    setGaragem(updated);
    setNovoEquip({ modelo: "", marca: "", tipo: "", ano: "" });
    setAdding(false);
  };

  const removeEquipamento = (id) => {
    setGaragem((g) => g.filter((e) => e.id !== id));
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

  // Group garagem by tipo for recommendations
  const tiposPresentes = [...new Set(garagem.map((e) => e.tipo).filter(Boolean))];

  return (
    <div className="space-y-4">
      {/* Equipamentos */}
      <div className="p-5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4" style={{ color: "#D32F2F" }} />
            <span className="text-xs font-mono-tech font-bold" style={{ color: "#212529" }}>MINHA GARAGEM</span>
          </div>
          <button
            onClick={() => setAdding(!adding)}
            className="flex items-center gap-1.5 h-8 px-3 text-xs font-mono-tech mm-btn-tactile"
            style={{ background: "rgba(211,47,47,0.08)", border: "1px solid rgba(211,47,47,0.25)", color: "#D32F2F", borderRadius: "2px" }}
          >
            <Plus className="w-3.5 h-3.5" /> ADICIONAR
          </button>
        </div>

        <p className="text-xs mb-4" style={{ color: "#9CA3AF" }}>
          Registre os equipamentos que você possui ou atende. Isso personaliza as recomendações de peças para a sua operação.
        </p>

        {/* Add form */}
        {adding && (
          <div className="p-4 mb-4 space-y-3" style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
            <p className="text-xs font-mono-tech" style={{ color: "#6C757D" }}>NOVO EQUIPAMENTO</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-mono-tech mb-1" style={{ color: "#9CA3AF" }}>TIPO</label>
                <select
                  value={novoEquip.tipo}
                  onChange={(e) => setNovoEquip((n) => ({ ...n, tipo: e.target.value }))}
                  className="w-full h-9 px-2 text-xs focus:outline-none"
                  style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#212529", fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <option value="">Selecione...</option>
                  {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono-tech mb-1" style={{ color: "#9CA3AF" }}>MARCA</label>
                <select
                  value={novoEquip.marca}
                  onChange={(e) => setNovoEquip((n) => ({ ...n, marca: e.target.value }))}
                  className="w-full h-9 px-2 text-xs focus:outline-none"
                  style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#212529", fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <option value="">Selecione...</option>
                  {MARCAS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono-tech mb-1" style={{ color: "#9CA3AF" }}>MODELO</label>
                <input
                  value={novoEquip.modelo}
                  onChange={(e) => setNovoEquip((n) => ({ ...n, modelo: e.target.value }))}
                  placeholder="Ex: GX160"
                  className="w-full h-9 px-2 text-xs focus:outline-none"
                  style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#212529", fontFamily: "'Space Grotesk', sans-serif" }}
                />
              </div>
              <div>
                <label className="block text-xs font-mono-tech mb-1" style={{ color: "#9CA3AF" }}>ANO</label>
                <input
                  value={novoEquip.ano}
                  onChange={(e) => setNovoEquip((n) => ({ ...n, ano: e.target.value }))}
                  placeholder="Ex: 2022"
                  className="w-full h-9 px-2 text-xs focus:outline-none"
                  style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#212529", fontFamily: "'Space Grotesk', sans-serif" }}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={addEquipamento} className="h-8 px-4 text-xs font-mono-tech font-bold mm-btn-tactile"
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

        {/* List */}
        {garagem.length === 0 ? (
          <div className="py-8 text-center" style={{ borderTop: adding ? "1px solid #E2E8F0" : "none" }}>
            <Wrench className="w-10 h-10 mx-auto mb-2" style={{ color: "#E2E8F0" }} />
            <p className="text-xs font-mono-tech" style={{ color: "#9CA3AF" }}>NENHUM EQUIPAMENTO CADASTRADO</p>
            <p className="text-xs mt-1" style={{ color: "#CBD5E1" }}>Adicione para receber recomendações personalizadas</p>
          </div>
        ) : (
          <div className="space-y-2">
            {garagem.map((equip, idx) => (
              <div key={equip.id || idx} className="flex items-center justify-between gap-3 p-3"
                style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px" }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(211,47,47,0.08)", border: "1px solid rgba(211,47,47,0.2)", borderRadius: "2px" }}>
                    <Wrench className="w-3.5 h-3.5" style={{ color: "#D32F2F" }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold font-mono-tech" style={{ color: "#212529" }}>
                      {equip.marca} {equip.modelo}
                    </p>
                    <p className="text-xs" style={{ color: "#6C757D" }}>
                      {equip.tipo}{equip.ano ? ` · ${equip.ano}` : ""}
                    </p>
                  </div>
                </div>
                <button onClick={() => removeEquipamento(equip.id || idx)}
                  className="w-7 h-7 flex items-center justify-center flex-shrink-0 hover:bg-red-50 transition-colors"
                  style={{ borderRadius: "2px", color: "#9CA3AF" }}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommendations */}
      {tiposPresentes.length > 0 && (
        <div className="p-4" style={{ background: "rgba(29,78,216,0.04)", border: "1px solid rgba(29,78,216,0.15)", borderRadius: "4px" }}>
          <p className="text-xs font-mono-tech mb-3" style={{ color: "#1D4ED8" }}>PEÇAS RECOMENDADAS PARA SUA GARAGEM:</p>
          <div className="flex flex-wrap gap-2">
            {tiposPresentes.map((tipo) => (
              <Link key={tipo} to={`${createPageUrl("Catalogo")}?q=${encodeURIComponent(tipo)}`}>
                <button className="flex items-center gap-1.5 h-8 px-3 text-xs font-mono-tech transition-all hover:bg-white"
                  style={{ background: "#FFFFFF", border: "1px solid rgba(29,78,216,0.25)", color: "#1D4ED8", borderRadius: "2px" }}>
                  Ver peças p/ {tipo} <ChevronRight className="w-3 h-3" />
                </button>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Save button */}
      {lojista && (
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
      )}
    </div>
  );
}
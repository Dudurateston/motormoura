import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, Wrench, Save, CheckCircle2, X, AlertCircle, ChevronRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";


// ─────────────────────────────────────────────
// DADOS CASCATA — Categoria → Marca → Modelos
// ─────────────────────────────────────────────
const CASCATA = {
  "Motor Estacionário": {
    marcas: ["Honda", "Toyama", "Tekna", "Branco", "Buffalo", "Lifan", "Loncin", "Robin", "Briggs & Stratton", "Kawasaki", "Kohler", "Outra"],
    modelos: {
      Honda: ["GX120", "GX160", "GX200", "GX270", "GX340", "GX390", "GX630", "GX690", "Outro"],
      Toyama: ["TE40F", "TE50F", "TE55F", "TE60F", "TE65F", "TD90FE", "Outro"],
      Tekna: ["TK3000E", "TK5500E", "TK7000E", "Outro"],
      Branco: ["B4T-2.8H", "B4T-3.5H", "B4T-5.5H", "B4T-7.0H", "Outro"],
      Buffalo: ["BFG-6500", "BFG-7500", "Outro"],
      default: ["Outro — digitar modelo"],
    }
  },
  "Gerador": {
    marcas: ["Honda", "Toyama", "Tekna", "Branco", "Buffalo", "Generac", "Yamaha", "Outra"],
    modelos: {
      Honda: ["EU2200i", "EU3000is", "EU7000is", "EB2200i", "EB5000", "Outro"],
      Toyama: ["TG2500CX", "TG3100CX", "TG4500CX", "TG6500CX", "TG8000CX", "TG12000CX3", "Outro"],
      Tekna: ["TG2800MX", "TG4000CX", "TG5500CX", "TG8000CX3", "Outro"],
      Branco: ["B4T-2500", "B4T-3500", "B4T-5500", "Outro"],
      default: ["Outro — digitar modelo"],
    }
  },
  "Motobomba": {
    marcas: ["Honda", "Toyama", "Tekna", "Branco", "Buffalo", "Dancor", "Outra"],
    modelos: {
      Honda: ["WB20XT", "WB30XT", "WT20X", "WT30X", "Outro"],
      Toyama: ["TBM2C", "TBM3C", "TBM4C", "TBMD2C", "TBMD3C", "Outro"],
      Tekna: ["TK20", "TK30", "TK40", "Outro"],
      default: ["Outro — digitar modelo"],
    }
  },
  "Máquina Agrícola": {
    marcas: ["Husqvarna", "Stihl", "Makita", "Toyama", "Honda", "Outra"],
    modelos: {
      Husqvarna: ["120i", "135", "135i", "140", "235", "240", "Outro"],
      Stihl: ["MS 170", "MS 180", "MS 250", "MS 290", "MS 361", "Outro"],
      default: ["Outro — digitar modelo"],
    }
  },
  "Compactador de Solo": {
    marcas: ["Wacker Neuson", "Honda", "Toyama", "Mikasa", "Dynapac", "Outra"],
    modelos: {
      default: ["BS50-2i", "BS60-2i", "BS70-2i", "BT60/4As", "Outro — digitar modelo"],
    }
  },
  "Veículo Leve": {
    marcas: ["Honda", "Toyota", "GM", "Ford", "Volkswagen", "Fiat", "Outra"],
    modelos: { default: ["Outro — digitar modelo"] }
  },
  "Caminhão / Pesado": {
    marcas: ["Scania", "Volvo", "Mercedes-Benz", "Man", "Iveco", "Ford", "Outra"],
    modelos: { default: ["Outro — digitar modelo"] }
  },
  "Outros": {
    marcas: ["Outra"],
    modelos: { default: ["Outro — digitar modelo"] }
  },
};

const TIPO_TO_CATALOG = {
  "Motor Estacionário": "Motores a Gasolina",
  "Gerador": "Geradores 4 Tempos",
  "Motobomba": "Motobombas 4 Tempos",
  "Máquina Agrícola": "Motores a Gasolina",
  "Compactador de Solo": "Motores a Gasolina",
};

function getCatalogUrl(equip) {
  const params = new URLSearchParams();
  const cat = TIPO_TO_CATALOG[equip.tipo_normalizado];
  if (cat) params.set("categoria", cat);
  if (equip.marca && equip.marca !== "Outra") {
    params.set("q", [equip.marca, equip.modelo !== "Outro — digitar modelo" ? equip.modelo : ""].filter(Boolean).join(" ").trim());
  }
  return `${createPageUrl("Catalogo")}?${params.toString()}`;
}

// ─────────────────────────────────────────────
// MODAL DE CADASTRO
// ─────────────────────────────────────────────
function AddEquipamentoModal({ onClose, onAdd }) {
  const [categoria, setCategoria] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [modeloCustom, setModeloCustom] = useState("");
  const [modeloBusca, setModeloBusca] = useState("");
  const [apelido, setApelido] = useState("");

  const categorias = Object.keys(CASCATA);
  const marcasDisponiveis = categoria ? CASCATA[categoria]?.marcas || [] : [];
  const modelos = (categoria && marca)
    ? (CASCATA[categoria]?.modelos?.[marca] || CASCATA[categoria]?.modelos?.default || [])
    : [];
  const modelosFiltrados = modelos.filter(m =>
    m.toLowerCase().includes(modeloBusca.toLowerCase())
  );
  const isModeloOutro = modelo === "Outro — digitar modelo" || modelo === "Outro";

  const handleAdd = () => {
    if (!categoria || !marca || !modelo) return;
    const modeloFinal = isModeloOutro ? (modeloCustom.trim() || modelo) : modelo;
    const equip = {
      id: Date.now().toString() + Math.random(),
      tipo_normalizado: categoria,
      marca,
      modelo: modeloFinal,
      apelido: apelido.trim() || null,
      potencial_pecas: [],
    };
    onAdd(equip);

    onClose();
  };

  const canSave = categoria && marca && modelo && (!isModeloOutro || modeloCustom.trim());

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-md flex flex-col" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px", boxShadow: "0 24px 64px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #E2E8F0" }}>
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4" style={{ color: "#D32F2F" }} />
            <span className="text-sm font-bold font-mono-tech" style={{ color: "#212529" }}>ADICIONAR EQUIPAMENTO</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors" style={{ borderRadius: "2px", color: "#6C757D" }}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="h-[2px]" style={{ background: "linear-gradient(90deg, #1D4ED8, #E53935)" }} />

        <div className="p-5 space-y-4">
          {/* Campo 1: Categoria */}
          <div>
            <label className="block text-xs font-mono-tech mb-1.5" style={{ color: "#6C757D", letterSpacing: "0.08em" }}>
              CATEGORIA <span style={{ color: "#D32F2F" }}>*</span>
            </label>
            <select
              value={categoria}
              onChange={(e) => { setCategoria(e.target.value); setMarca(""); setModelo(""); setModeloBusca(""); }}
              className="w-full h-9 px-3 text-sm font-mono-tech focus:outline-none appearance-none"
              style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px", color: categoria ? "#212529" : "#9CA3AF" }}
            >
              <option value="">Selecionar categoria...</option>
              {categorias.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Campo 2: Marca */}
          <div>
            <label className="block text-xs font-mono-tech mb-1.5" style={{ color: categoria ? "#6C757D" : "#CBD5E1", letterSpacing: "0.08em" }}>
              MARCA <span style={{ color: "#D32F2F" }}>*</span>
            </label>
            <select
              value={marca}
              onChange={(e) => { setMarca(e.target.value); setModelo(""); setModeloBusca(""); }}
              disabled={!categoria}
              className="w-full h-9 px-3 text-sm font-mono-tech focus:outline-none appearance-none disabled:opacity-40"
              style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px", color: marca ? "#212529" : "#9CA3AF" }}
            >
              <option value="">Selecionar marca...</option>
              {marcasDisponiveis.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {/* Campo 3: Modelo com busca interna */}
          <div>
            <label className="block text-xs font-mono-tech mb-1.5" style={{ color: marca ? "#6C757D" : "#CBD5E1", letterSpacing: "0.08em" }}>
              MODELO / ESPECIFICAÇÃO <span style={{ color: "#D32F2F" }}>*</span>
            </label>
            {marca && modelos.length > 0 ? (
              <div style={{ border: "1px solid #E2E8F0", borderRadius: "2px", background: "#F8F9FA" }}>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3" style={{ color: "#9CA3AF" }} />
                  <input
                    placeholder="Filtrar modelo..."
                    value={modeloBusca}
                    onChange={(e) => setModeloBusca(e.target.value)}
                    className="w-full h-8 pl-8 pr-3 text-xs font-mono-tech focus:outline-none bg-transparent"
                    style={{ borderBottom: "1px solid #E2E8F0", color: "#212529" }}
                  />
                </div>
                <div style={{ maxHeight: 160, overflowY: "auto" }}>
                  {modelosFiltrados.map(m => (
                    <button
                      key={m}
                      onClick={() => { setModelo(m); setModeloCustom(""); }}
                      className="w-full text-left px-3 py-2 text-sm font-mono-tech transition-colors"
                      style={{
                        background: modelo === m ? "rgba(211,47,47,0.08)" : "transparent",
                        color: modelo === m ? "#D32F2F" : "#212529",
                        borderBottom: "1px solid #F1F5F9",
                      }}
                      onMouseEnter={e => { if (modelo !== m) e.currentTarget.style.background = "#F1F5F9"; }}
                      onMouseLeave={e => { if (modelo !== m) e.currentTarget.style.background = "transparent"; }}
                    >
                      {m}
                    </button>
                  ))}
                  {modelosFiltrados.length === 0 && (
                    <p className="px-3 py-2 text-xs" style={{ color: "#9CA3AF" }}>Nenhum modelo encontrado</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-9 flex items-center px-3 text-xs" style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#CBD5E1" }}>
                Selecione a marca primeiro
              </div>
            )}
            {/* Campo manual para "Outro" */}
            {isModeloOutro && (
              <input
                placeholder="Digite o modelo (ex: GX200, 5.5HP...)"
                value={modeloCustom}
                onChange={(e) => setModeloCustom(e.target.value)}
                className="w-full h-9 px-3 mt-2 text-sm font-mono-tech focus:outline-none"
                style={{ background: "#F8F9FA", border: "1px solid rgba(29,78,216,0.35)", borderRadius: "2px", color: "#212529" }}
              />
            )}
          </div>

          {/* Campo 4: Apelido (opcional) */}
          <div>
            <label className="block text-xs font-mono-tech mb-1.5" style={{ color: "#6C757D", letterSpacing: "0.08em" }}>
              APELIDO / IDENTIFICAÇÃO <span style={{ color: "#9CA3AF" }}>(opcional)</span>
            </label>
            <input
              placeholder="Ex: Gerador da Obra Matriz, Honda do Sítio..."
              value={apelido}
              onChange={(e) => setApelido(e.target.value)}
              className="w-full h-9 px-3 text-sm focus:outline-none"
              style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#212529", fontFamily: "'Space Grotesk', sans-serif" }}
            />
          </div>

          {/* Botão salvar */}
          <button
            onClick={handleAdd}
            disabled={!canSave}
            className="w-full h-10 text-sm font-bold font-mono-tech mm-btn-tactile disabled:opacity-40"
            style={{ background: canSave ? "linear-gradient(135deg, #D32F2F, #B71C1C)" : "#E2E8F0", color: canSave ? "#fff" : "#9CA3AF", borderRadius: "2px", border: "none" }}
          >
            GUARDAR NA GARAGEM
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CARD DE EQUIPAMENTO
// ─────────────────────────────────────────────
function EquipamentoCard({ equip, onRemove }) {
  return (
    <div
      className="flex items-center gap-4 p-4"
      style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
    >
      {/* Ícone */}
      <div
        className="w-10 h-10 flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(211,47,47,0.08)", border: "1px solid rgba(211,47,47,0.2)", borderRadius: "4px" }}
      >
        <Wrench className="w-5 h-5" style={{ color: "#D32F2F" }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {equip.apelido && (
          <p className="text-sm font-bold font-mono-tech mb-0.5 truncate" style={{ color: "#212529" }}>
            {equip.apelido}
          </p>
        )}
        <p className={`font-mono-tech truncate ${equip.apelido ? "text-xs" : "text-sm font-bold"}`} style={{ color: equip.apelido ? "#6C757D" : "#212529" }}>
          {[equip.marca !== "Outra" ? equip.marca : null, equip.modelo].filter(Boolean).join(" ") || equip.tipo_normalizado}
        </p>
        <p className="text-xs font-mono-tech mt-0.5" style={{ color: "#9CA3AF" }}>
          {equip.tipo_normalizado}
        </p>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link to={getCatalogUrl(equip)}>
          <button
            className="flex items-center gap-1.5 h-8 px-3 text-xs font-mono-tech font-bold mm-btn-tactile"
            style={{ background: "rgba(211,47,47,0.08)", border: "1px solid rgba(211,47,47,0.25)", color: "#D32F2F", borderRadius: "2px" }}
          >
            Buscar Peças <ChevronRight className="w-3 h-3" />
          </button>
        </Link>
        <button
          onClick={() => onRemove(equip.id)}
          className="w-8 h-8 flex items-center justify-center hover:bg-red-50 transition-colors"
          style={{ borderRadius: "2px", color: "#9CA3AF" }}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────
export default function GaragemSection({ lojista, onSaved, onGoToDados }) {
  const [garagem, setGaragem] = useState(lojista?.garagem || []);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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

  const handleAdd = (equip) => {
    setGaragem((g) => [...g, equip]);
  };

  const handleRemove = (id) => {
    setGaragem((g) => g.filter((e) => e.id !== id));
  };

  const handleSave = async () => {
    setSaving(true);
    await base44.entities.Lojistas.update(lojista.id, { garagem });
    setSaving(false);
    setSaved(true);
    onSaved({ ...lojista, garagem });
    setTimeout(() => setSaved(false), 3500);
  };

  return (
    <div className="space-y-4">
      {/* Modal */}
      {modalOpen && (
        <AddEquipamentoModal
          onClose={() => setModalOpen(false)}
          onAdd={handleAdd}
        />
      )}

      {/* Header + CTA */}
      <div className="flex items-center justify-between">
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
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 h-9 px-4 text-xs font-mono-tech font-bold mm-btn-tactile"
          style={{ background: "#212529", color: "#FFFFFF", borderRadius: "2px", border: "1px solid #374151" }}
        >
          <Plus className="w-3.5 h-3.5" /> ADICIONAR EQUIPAMENTO
        </button>
      </div>

      {/* Lista de equipamentos */}
      {garagem.length === 0 ? (
        <div
          className="py-12 text-center"
          style={{ background: "#FFFFFF", border: "1px dashed #E2E8F0", borderRadius: "4px" }}
        >
          <Wrench className="w-10 h-10 mx-auto mb-2" style={{ color: "#E2E8F0" }} />
          <p className="text-xs font-mono-tech mb-1" style={{ color: "#9CA3AF" }}>GARAGEM VAZIA</p>
          <p className="text-xs mb-4" style={{ color: "#CBD5E1" }}>Cadastre seus equipamentos para receber recomendações de peças</p>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 mx-auto h-9 px-5 text-xs font-mono-tech font-bold mm-btn-tactile"
            style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "#fff", borderRadius: "2px", border: "none" }}
          >
            <Plus className="w-3.5 h-3.5" /> ADICIONAR PRIMEIRO EQUIPAMENTO
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {garagem.map((equip) => (
            <EquipamentoCard key={equip.id} equip={equip} onRemove={handleRemove} />
          ))}
        </div>
      )}

      {/* Salvar */}
      {garagem.length > 0 && (
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="mm-btn-tactile flex items-center gap-2 px-5 h-10 text-xs font-mono-tech font-bold disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "#fff", borderRadius: "2px", border: "none" }}
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "SALVANDO..." : "SALVAR GARAGEM"}
          </button>
          {saved && (
            <div className="flex items-center gap-2 px-3 h-10 text-xs font-mono-tech"
              style={{ background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.3)", color: "#16A34A", borderRadius: "2px" }}>
              <CheckCircle2 className="w-4 h-4" /> GARAGEM SALVA!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Save, CheckCircle2, Building2, User } from "lucide-react";
import { analytics } from "@/components/analytics/analytics";

const PERFIS = ["Oficina Mecânica", "Loja de Peças Revenda", "Locadora de Máquinas", "Construtora", "Autônomo"];
const VOLUMES = ["1", "2 a 5", "6 a 10", "10 a 20", "Mais de 20"];
const FUNCIONARIOS = ["Só eu", "2 a 5", "6 a 15", "16 a 50", "Mais de 50"];
const TEMPO_MERCADO = ["Menos de 1 ano", "1 a 3 anos", "3 a 10 anos", "Mais de 10 anos"];
const TIPO_CLIENTE = ["Consumidor final (B2C)", "Outras empresas (B2B)", "Ambos"];
const REGIOES_ATENDIMENTO = ["Local (cidade)", "Estadual", "Regional (alguns estados)", "Nacional"];

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-mono-tech mb-1.5" style={{ color: "#6C757D" }}>{label}</label>
      <input
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-10 px-3 text-sm focus:outline-none transition-colors"
        style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#212529", fontFamily: "'Space Grotesk', sans-serif" }}
      />
    </div>
  );
}

export default function DadosEmpresaForm({ lojista, user, logoUrl, onSaved }) {
  const isNew = !lojista;
  const [form, setForm] = useState({
    nome_loja: lojista?.nome_loja || "",
    nome_contato: lojista?.nome_contato || "",
    nif: lojista?.nif || "",
    telefone: lojista?.telefone || "",
    cidade: lojista?.cidade || "",
    estado: lojista?.estado || "",
    cep: lojista?.cep || "",
    endereco: lojista?.endereco || "",
    perfil_empresa: lojista?.perfil_empresa || "",
    volume_maquinas: lojista?.volume_maquinas || "",
    instagram: lojista?.instagram || "",
    num_funcionarios: lojista?.num_funcionarios || "",
    tempo_mercado: lojista?.tempo_mercado || "",
    tipo_cliente: lojista?.tipo_cliente || "",
    regiao_atendimento: lojista?.regiao_atendimento || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const fields = [form.nome_loja, form.nome_contato, form.nif, form.telefone, form.cidade, form.estado, form.cep, form.endereco, form.perfil_empresa, form.volume_maquinas, form.instagram, form.num_funcionarios, form.tempo_mercado];
  const filled = fields.filter(Boolean).length;
  const completeness = Math.round((filled / fields.length) * 100);

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form, user_email: user.email };
    // Include logo_url if it was uploaded before registering
    if (logoUrl) data.logo_url = logoUrl;

    if (lojista) {
      await base44.entities.Lojistas.update(lojista.id, form);
      onSaved({ ...lojista, ...form });
    } else {
      const novo = await base44.entities.Lojistas.create({ ...data, status: "pendente" });
      onSaved(novo);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  return (
    <div className="space-y-5">
      {/* Completeness bar */}
      <div className="p-3 flex items-center gap-3" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
        <div className="flex-1">
          <div className="flex justify-between mb-1">
            <span className="text-xs font-mono-tech" style={{ color: "#6C757D" }}>COMPLETUDE DO PERFIL</span>
            <span className="text-xs font-mono-tech font-bold" style={{ color: completeness >= 80 ? "#16A34A" : completeness >= 50 ? "#B45309" : "#D32F2F" }}>{completeness}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full" style={{ background: "#F1F5F9" }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${completeness}%`, background: completeness >= 80 ? "#16A34A" : completeness >= 50 ? "#B45309" : "#D32F2F" }} />
          </div>
        </div>
      </div>

      {/* Bloco A */}
      <div className="p-5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-4 h-4" style={{ color: "#D32F2F" }} />
          <span className="text-xs font-mono-tech font-bold" style={{ color: "#212529" }}>DADOS CADASTRAIS</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Field label="NOME DA LOJA / EMPRESA *" value={form.nome_loja} onChange={set("nome_loja")} placeholder="Ex: Loja do João Ltda." />
          </div>
          <Field label="NOME DO RESPONSÁVEL" value={form.nome_contato} onChange={set("nome_contato")} placeholder="Ex: João da Silva" />
          <Field label="NIF / CNPJ" value={form.nif} onChange={set("nif")} placeholder="00.000.000/0001-00" />
          <Field label="TELEFONE" value={form.telefone} onChange={set("telefone")} placeholder="(85) 99999-9999" />
          <Field label="CEP" value={form.cep} onChange={set("cep")} placeholder="00000-000" />
          <div className="md:col-span-2">
            <Field label="ENDEREÇO" value={form.endereco} onChange={set("endereco")} placeholder="Rua, Número, Complemento, Bairro" />
          </div>
          <Field label="CIDADE" value={form.cidade} onChange={set("cidade")} placeholder="Fortaleza" />
          <Field label="ESTADO" value={form.estado} onChange={set("estado")} placeholder="CE" />
        </div>
      </div>

      {/* Bloco B */}
      <div className="p-5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
        <div className="flex items-center gap-2 mb-1">
          <User className="w-4 h-4" style={{ color: "#1D4ED8" }} />
          <span className="text-xs font-mono-tech font-bold" style={{ color: "#212529" }}>INTELIGÊNCIA DE NEGÓCIO</span>
        </div>
        <p className="text-xs mb-4 ml-6" style={{ color: "#9CA3AF" }}>Personaliza sua experiência e recomendações de produtos</p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono-tech mb-2" style={{ color: "#6C757D" }}>QUAL O PERFIL DA SUA EMPRESA?</label>
            <div className="flex flex-wrap gap-2">
              {PERFIS.map((p) => (
                <button key={p} type="button"
                  onClick={() => setForm((f) => ({ ...f, perfil_empresa: f.perfil_empresa === p ? "" : p }))}
                  className="px-3 h-8 text-xs font-mono-tech transition-all duration-200"
                  style={{
                    background: form.perfil_empresa === p ? "rgba(211,47,47,0.1)" : "#F8F9FA",
                    border: `1px solid ${form.perfil_empresa === p ? "rgba(211,47,47,0.4)" : "#E2E8F0"}`,
                    color: form.perfil_empresa === p ? "#D32F2F" : "#6C757D",
                    borderRadius: "2px"
                  }}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-tech mb-2" style={{ color: "#6C757D" }}>VOLUME DE MÁQUINAS QUE ATENDE/POSSUI?</label>
            <div className="flex flex-wrap gap-2">
              {VOLUMES.map((v) => (
                <button key={v} type="button"
                  onClick={() => setForm((f) => ({ ...f, volume_maquinas: f.volume_maquinas === v ? "" : v }))}
                  className="px-3 h-8 text-xs font-mono-tech transition-all duration-200"
                  style={{
                    background: form.volume_maquinas === v ? "rgba(29,78,216,0.1)" : "#F8F9FA",
                    border: `1px solid ${form.volume_maquinas === v ? "rgba(29,78,216,0.4)" : "#E2E8F0"}`,
                    color: form.volume_maquinas === v ? "#1D4ED8" : "#6C757D",
                    borderRadius: "2px"
                  }}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-tech mb-1.5" style={{ color: "#6C757D" }}>REDE SOCIAL DA LOJA (INSTAGRAM)</label>
            <input value={form.instagram || ""} onChange={set("instagram")} placeholder="https://instagram.com/minha_loja"
              className="w-full h-10 px-3 text-sm focus:outline-none"
              style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#212529", fontFamily: "'Space Grotesk', sans-serif" }} />
          </div>

          <div>
            <label className="block text-xs font-mono-tech mb-2" style={{ color: "#6C757D" }}>QUANTOS FUNCIONÁRIOS A EMPRESA POSSUI?</label>
            <div className="flex flex-wrap gap-2">
              {FUNCIONARIOS.map((v) => (
                <button key={v} type="button"
                  onClick={() => setForm((f) => ({ ...f, num_funcionarios: f.num_funcionarios === v ? "" : v }))}
                  className="px-3 h-8 text-xs font-mono-tech transition-all duration-200"
                  style={{
                    background: form.num_funcionarios === v ? "rgba(29,78,216,0.1)" : "#F8F9FA",
                    border: `1px solid ${form.num_funcionarios === v ? "rgba(29,78,216,0.4)" : "#E2E8F0"}`,
                    color: form.num_funcionarios === v ? "#1D4ED8" : "#6C757D",
                    borderRadius: "2px"
                  }}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-tech mb-2" style={{ color: "#6C757D" }}>HÁ QUANTO TEMPO A EMPRESA ESTÁ NO MERCADO?</label>
            <div className="flex flex-wrap gap-2">
              {TEMPO_MERCADO.map((v) => (
                <button key={v} type="button"
                  onClick={() => setForm((f) => ({ ...f, tempo_mercado: f.tempo_mercado === v ? "" : v }))}
                  className="px-3 h-8 text-xs font-mono-tech transition-all duration-200"
                  style={{
                    background: form.tempo_mercado === v ? "rgba(211,47,47,0.1)" : "#F8F9FA",
                    border: `1px solid ${form.tempo_mercado === v ? "rgba(211,47,47,0.4)" : "#E2E8F0"}`,
                    color: form.tempo_mercado === v ? "#D32F2F" : "#6C757D",
                    borderRadius: "2px"
                  }}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-tech mb-2" style={{ color: "#6C757D" }}>PARA QUEM VOCÊ VENDE PRINCIPALMENTE?</label>
            <div className="flex flex-wrap gap-2">
              {TIPO_CLIENTE.map((v) => (
                <button key={v} type="button"
                  onClick={() => setForm((f) => ({ ...f, tipo_cliente: f.tipo_cliente === v ? "" : v }))}
                  className="px-3 h-8 text-xs font-mono-tech transition-all duration-200"
                  style={{
                    background: form.tipo_cliente === v ? "rgba(22,163,74,0.1)" : "#F8F9FA",
                    border: `1px solid ${form.tipo_cliente === v ? "rgba(22,163,74,0.4)" : "#E2E8F0"}`,
                    color: form.tipo_cliente === v ? "#16A34A" : "#6C757D",
                    borderRadius: "2px"
                  }}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-tech mb-2" style={{ color: "#6C757D" }}>ABRANGÊNCIA DE ATENDIMENTO</label>
            <div className="flex flex-wrap gap-2">
              {REGIOES_ATENDIMENTO.map((v) => (
                <button key={v} type="button"
                  onClick={() => setForm((f) => ({ ...f, regiao_atendimento: f.regiao_atendimento === v ? "" : v }))}
                  className="px-3 h-8 text-xs font-mono-tech transition-all duration-200"
                  style={{
                    background: form.regiao_atendimento === v ? "rgba(180,83,9,0.1)" : "#F8F9FA",
                    border: `1px solid ${form.regiao_atendimento === v ? "rgba(180,83,9,0.4)" : "#E2E8F0"}`,
                    color: form.regiao_atendimento === v ? "#B45309" : "#6C757D",
                    borderRadius: "2px"
                  }}>
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={handleSave} disabled={saving || !form.nome_loja}
          className="mm-btn-tactile flex items-center gap-2 px-5 h-10 text-xs font-mono-tech font-bold disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "#fff", borderRadius: "2px", border: "none" }}>
          <Save className="w-3.5 h-3.5" />
          {saving ? "SALVANDO..." : isNew ? "REGISTAR COMO LOJISTA" : "SALVAR ALTERAÇÕES"}
        </button>
        {saved && (
          <div className="flex items-center gap-2 px-3 h-10 text-xs font-mono-tech font-semibold"
            style={{ background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.3)", color: "#16A34A", borderRadius: "2px" }}>
            <CheckCircle2 className="w-4 h-4" /> DADOS SALVOS COM SUCESSO!
          </div>
        )}
      </div>
    </div>
  );
}
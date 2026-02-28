import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User, Building2, Phone, MapPin, Clock, CheckCircle, XCircle, AlertCircle, ShoppingCart, Package, MessageCircle, ChevronRight, Zap, ArrowRight } from "lucide-react";

const statusConfig = {
  pendente: {
    label: "Pendente de Aprovação",
    desc: "Sua conta está sendo analisada. Em até 24h você receberá retorno.",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.3)",
    Icon: Clock,
  },
  aprovado: {
    label: "Lojista Homologado",
    desc: "Acesso completo ao catálogo com preços B2B e sistema de cotação.",
    color: "#4ADE80",
    bg: "rgba(74,222,128,0.1)",
    border: "rgba(74,222,128,0.3)",
    Icon: CheckCircle,
  },
  suspenso: {
    label: "Conta Suspensa",
    desc: "Sua conta foi suspensa. Entre em contato pelo WhatsApp para regularizar.",
    color: "#F87171",
    bg: "rgba(248,113,113,0.1)",
    border: "rgba(248,113,113,0.3)",
    Icon: XCircle,
  },
};

function InputMM({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-mono-tech mb-1.5" style={{ color: "#6B7280", letterSpacing: "0.08em" }}>{label}</label>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-10 px-3 text-sm focus:outline-none font-mono-tech"
        style={{
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "2px", color: "#F3F4F6",
        }}
        onFocus={(e) => { e.target.style.border = "1px solid rgba(29,78,216,0.5)"; }}
        onBlur={(e) => { e.target.style.border = "1px solid rgba(255,255,255,0.1)"; }}
      />
    </div>
  );
}

export default function MinhaConta() {
  const [user, setUser] = useState(null);
  const [lojista, setLojista] = useState(null);
  const [form, setForm] = useState({ nome_loja: "", nif: "", telefone: "", cidade: "", estado: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    base44.auth.me().then(async (u) => {
      setUser(u);
      const lojistas = await base44.entities.Lojistas.filter({ user_email: u.email });
      if (lojistas.length > 0) {
        setLojista(lojistas[0]);
        setForm({
          nome_loja: lojistas[0].nome_loja || "",
          nif: lojistas[0].nif || "",
          telefone: lojistas[0].telefone || "",
          cidade: lojistas[0].cidade || "",
          estado: lojistas[0].estado || "",
        });
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    if (lojista) {
      await base44.entities.Lojistas.update(lojista.id, form);
    } else {
      const novoLojista = await base44.entities.Lojistas.create({ ...form, user_email: user.email, status: "pendente" });
      setLojista(novoLojista);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // ── NOT LOGGED IN ──
  if (!user && !loading) {
    return (
      <div className="mm-bg min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto flex items-center justify-center mb-6" style={{
            background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.3)", borderRadius: "2px",
          }}>
            <User className="w-8 h-8" style={{ color: "#FB923C" }} />
          </div>
          <h2 className="text-2xl font-bold font-mono-tech mb-3" style={{ color: "#F3F4F6" }}>ACESSO RESTRITO</h2>
          <p className="mb-6 text-sm" style={{ color: "#9CA3AF" }}>Faça login para aceder à sua conta B2B e gestão de cotações.</p>
          <button
            onClick={() => base44.auth.redirectToLogin()}
            className="mm-btn-tactile inline-flex items-center gap-2 px-8 h-12 font-bold font-mono-tech text-sm"
            style={{ background: "linear-gradient(135deg, #FB923C, #EA7C28)", color: "#fff", borderRadius: "2px", border: "none" }}
          >
            ENTRAR / REGISTAR <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ── LOADING ──
  if (loading) {
    return (
      <div className="mm-bg min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] mm-data-blink" />
          <span className="text-xs font-mono-tech" style={{ color: "#4B5563" }}>CARREGANDO CONTA...</span>
        </div>
      </div>
    );
  }

  const status = lojista ? statusConfig[lojista.status] || statusConfig.pendente : null;

  return (
    <div className="mm-bg min-h-screen">
      {/* Hero strip */}
      <div style={{ background: "#0A0A0C", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="h-[2px]" style={{ background: "linear-gradient(90deg, #1D4ED8, #FB923C, #1D4ED8)" }} />
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-[2px]" style={{ background: "#FB923C" }} />
            <span className="text-xs font-mono-tech" style={{ color: "#FB923C", letterSpacing: "0.15em" }}>PLATAFORMA B2B</span>
          </div>
          <h1 className="text-xl font-bold font-mono-tech" style={{ color: "#F3F4F6" }}>MINHA CONTA</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── LEFT: Profile + Status + Actions ── */}
        <div className="space-y-4">

          {/* User card */}
          <div className="p-5" style={{ background: "rgba(27,27,31,0.95)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "4px" }}>
            <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="w-11 h-11 flex items-center justify-center font-bold text-lg font-mono-tech flex-shrink-0" style={{
                background: "linear-gradient(135deg, #FB923C, #EA7C28)", color: "#fff", borderRadius: "2px",
              }}>
                {user.full_name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: "#F3F4F6" }}>{user.full_name}</p>
                <p className="text-xs truncate font-mono-tech" style={{ color: "#4B5563" }}>{user.email}</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-tech" style={{ color: "#4B5563" }}>PERFIL</span>
                <span className="text-xs font-mono-tech px-2 py-0.5" style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.25)", color: "#FB923C", borderRadius: "2px" }}>
                  {user.role?.toUpperCase() || "USER"}
                </span>
              </div>
            </div>
          </div>

          {/* Status B2B */}
          {status ? (
            <div className="p-5" style={{ background: status.bg, border: `1px solid ${status.border}`, borderRadius: "4px" }}>
              <div className="flex items-center gap-2 mb-2">
                <status.Icon className="w-4 h-4" style={{ color: status.color }} />
                <span className="text-xs font-mono-tech font-bold" style={{ color: status.color }}>{status.label}</span>
              </div>
              <p className="text-xs" style={{ color: "#9CA3AF", lineHeight: 1.6 }}>{status.desc}</p>
            </div>
          ) : (
            <div className="p-5" style={{ background: "rgba(29,78,216,0.08)", border: "1px solid rgba(29,78,216,0.25)", borderRadius: "4px" }}>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4" style={{ color: "#60A5FA" }} />
                <span className="text-xs font-mono-tech font-bold" style={{ color: "#60A5FA" }}>AINDA NÃO REGISTADO</span>
              </div>
              <p className="text-xs" style={{ color: "#9CA3AF", lineHeight: 1.6 }}>
                Preencha os dados da empresa ao lado para solicitar acesso B2B.
              </p>
            </div>
          )}

          {/* Quick actions */}
          <div className="p-5 space-y-2" style={{ background: "rgba(27,27,31,0.95)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "4px" }}>
            <p className="text-xs font-mono-tech mb-3" style={{ color: "#4B5563", letterSpacing: "0.1em" }}>ATALHOS RÁPIDOS</p>
            <Link to={createPageUrl("Catalogo")} className="flex items-center gap-3 p-2.5 rounded group transition-all" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "2px" }}>
              <Package className="w-4 h-4 flex-shrink-0" style={{ color: "#FB923C" }} />
              <span className="text-xs font-mono-tech" style={{ color: "#9CA3AF" }}>Ver Catálogo</span>
              <ChevronRight className="w-3 h-3 ml-auto" style={{ color: "#4B5563" }} />
            </Link>
            <Link to={createPageUrl("Orcamento")} className="flex items-center gap-3 p-2.5 transition-all" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "2px" }}>
              <ShoppingCart className="w-4 h-4 flex-shrink-0" style={{ color: "#1D4ED8" }} />
              <span className="text-xs font-mono-tech" style={{ color: "#9CA3AF" }}>Minha Lista de Cotação</span>
              <ChevronRight className="w-3 h-3 ml-auto" style={{ color: "#4B5563" }} />
            </Link>
            <a href="https://api.whatsapp.com/send?phone=5511999999999" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2.5 transition-all" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "2px" }}>
              <MessageCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#4ADE80" }} />
              <span className="text-xs font-mono-tech" style={{ color: "#9CA3AF" }}>Falar com Atendimento</span>
              <ChevronRight className="w-3 h-3 ml-auto" style={{ color: "#4B5563" }} />
            </a>
          </div>

          {/* Logout */}
          <button
            onClick={() => base44.auth.logout()}
            className="w-full h-9 text-xs font-mono-tech mm-btn-tactile"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", color: "#4B5563", borderRadius: "2px" }}
          >
            TERMINAR SESSÃO
          </button>
        </div>

        {/* ── RIGHT: Empresa form ── */}
        <div className="lg:col-span-2">
          <div className="p-6" style={{ background: "rgba(27,27,31,0.95)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "4px" }}>
            <div className="flex items-center gap-2 mb-6 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <Building2 className="w-4 h-4" style={{ color: "#FB923C" }} />
              <span className="text-sm font-bold font-mono-tech" style={{ color: "#F3F4F6" }}>DADOS DA EMPRESA</span>
              {lojista && (
                <span className="ml-auto text-xs font-mono-tech px-2 py-0.5" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ADE80", borderRadius: "2px" }}>
                  ATIVO
                </span>
              )}
            </div>

            {!lojista && (
              <div className="flex items-start gap-3 p-3 mb-5" style={{ background: "rgba(29,78,216,0.08)", border: "1px solid rgba(29,78,216,0.25)", borderRadius: "2px" }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#60A5FA" }} />
                <p className="text-xs font-mono-tech" style={{ color: "#93C5FD", lineHeight: 1.6 }}>
                  Preencha os dados abaixo para se registar como lojista. Após registo, a sua conta será analisada em até 24h.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <InputMM
                  label="NOME DA LOJA / EMPRESA *"
                  value={form.nome_loja}
                  onChange={(e) => setForm({ ...form, nome_loja: e.target.value })}
                  placeholder="Ex: Loja do João Ltda."
                />
              </div>
              <InputMM
                label="NIF / CNPJ"
                value={form.nif}
                onChange={(e) => setForm({ ...form, nif: e.target.value })}
                placeholder="00.000.000/0001-00"
              />
              <InputMM
                label="TELEFONE"
                value={form.telefone}
                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                placeholder="+55 (11) 99999-9999"
              />
              <InputMM
                label="CIDADE"
                value={form.cidade}
                onChange={(e) => setForm({ ...form, cidade: e.target.value })}
                placeholder="São Paulo"
              />
              <InputMM
                label="ESTADO (UF)"
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value })}
                placeholder="SP"
              />
            </div>

            <div className="flex items-center gap-3 mt-6 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <button
                onClick={handleSave}
                disabled={saving || !form.nome_loja}
                className="mm-btn-tactile flex items-center gap-2 px-6 h-10 text-xs font-bold font-mono-tech disabled:opacity-40"
                style={{ background: saved ? "rgba(74,222,128,0.15)" : "linear-gradient(135deg, #FB923C, #EA7C28)", color: saved ? "#4ADE80" : "#fff", border: saved ? "1px solid rgba(74,222,128,0.4)" : "none", borderRadius: "2px" }}
              >
                {saving ? "GUARDANDO..." : saved ? "✓ GUARDADO!" : lojista ? "ATUALIZAR DADOS" : "REGISTAR COMO LOJISTA"}
              </button>
              {!saved && !saving && (
                <p className="text-xs font-mono-tech" style={{ color: "#374151" }}>* Campo obrigatório</p>
              )}
            </div>
          </div>

          {/* B2B benefits box */}
          {!lojista && (
            <div className="mt-4 p-5" style={{ background: "rgba(251,146,60,0.05)", border: "1px solid rgba(251,146,60,0.2)", borderRadius: "4px" }}>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4" style={{ color: "#FB923C" }} />
                <span className="text-xs font-mono-tech font-bold" style={{ color: "#FB923C" }}>BENEFÍCIOS DO PROGRAMA B2B</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { title: "Preços de Atacado", desc: "Acesso exclusivo a tabela B2B" },
                  { title: "+1.000 SKUs", desc: "Catálogo técnico completo" },
                  { title: "Cotação Rápida", desc: "Via WhatsApp em minutos" },
                ].map((b) => (
                  <div key={b.title} className="p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "2px" }}>
                    <p className="text-xs font-mono-tech font-bold mb-1" style={{ color: "#F3F4F6" }}>{b.title}</p>
                    <p className="text-xs" style={{ color: "#6B7280" }}>{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
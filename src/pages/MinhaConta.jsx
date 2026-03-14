import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import {
  User, Building2, Clock, CheckCircle, XCircle,
  AlertCircle, ShoppingCart, Package, MessageCircle, ArrowRight,
  Zap, Star, LogOut, ChevronRight, Edit3, Save
} from "lucide-react";
import SEOHead from "../components/SEOHead";

const WHATSAPP_B2B = "https://api.whatsapp.com/send?phone=5585986894081";

const statusConfig = {
  pendente: {
    label: "Aguardando Aprovação",
    sublabel: "Cadastro em análise. Retorno em até 24h úteis.",
    color: "#B45309",
    bg: "rgba(180,83,9,0.08)",
    border: "rgba(180,83,9,0.25)",
    Icon: Clock,
  },
  aprovado: {
    label: "Lojista Aprovado ✓",
    sublabel: "Você tem acesso aos preços de atacado e cotação B2B.",
    color: "#16A34A",
    bg: "rgba(22,163,74,0.08)",
    border: "rgba(22,163,74,0.25)",
    Icon: CheckCircle,
  },
  suspenso: {
    label: "Conta Suspensa",
    sublabel: "Entre em contacto com a equipa B2B para regularizar.",
    color: "#D32F2F",
    bg: "rgba(211,47,47,0.08)",
    border: "rgba(211,47,47,0.25)",
    Icon: XCircle,
  },
};

const BENEFICIOS = [
  { icon: Package, title: "Catálogo Técnico", desc: "+1.000 SKUs disponíveis", color: "#D32F2F" },
  { icon: Star, title: "Preços Atacado", desc: "Tabela exclusiva B2B", color: "#1D4ED8" },
  { icon: MessageCircle, title: "WhatsApp B2B", desc: "Atendimento prioritário", color: "#16A34A" },
  { icon: Zap, title: "Cotação Rápida", desc: "Resposta em até 24h úteis", color: "#B45309" },
];

function StyledInput({ label, value, onChange, placeholder, disabled }) {
  return (
    <div>
      <label className="block text-xs font-mono-tech mb-1.5" style={{ color: "#6C757D" }}>{label}</label>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full h-10 px-3 text-sm focus:outline-none transition-colors"
        style={{
          background: disabled ? "#F8F9FA" : "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "2px",
          color: "#212529",
          fontFamily: "'Space Grotesk', sans-serif",
        }}
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
  const [editMode, setEditMode] = useState(false);
  const [cartCount, setCartCount] = useState(0);

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
      } else {
        setEditMode(true);
      }
      setLoading(false);
    }).catch(() => setLoading(false));

    const syncCart = () => {
      const stored = localStorage.getItem("motormoura_cart");
      const cart = stored ? JSON.parse(stored) : [];
      setCartCount(cart.reduce((s, i) => s + i.quantidade, 0));
    };
    syncCart();
    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    if (lojista) {
      await base44.entities.Lojistas.update(lojista.id, form);
    } else {
      const novo = await base44.entities.Lojistas.create({ ...form, user_email: user.email, status: "pendente" });
      setLojista(novo);
    }
    setSaving(false);
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 3000);
  };

  // ── LOADING ──
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" style={{ background: "#F8F9FA" }}>
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3"
            style={{ borderColor: "#D32F2F", borderTopColor: "transparent" }} />
          <p className="text-xs font-mono-tech" style={{ color: "#9CA3AF" }}>CARREGANDO...</p>
        </div>
      </div>
    );
  }

  // ── NOT LOGGED IN ──
  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4" style={{ background: "#F8F9FA" }}>
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center" style={{
            background: "rgba(211,47,47,0.08)", border: "1px solid rgba(211,47,47,0.2)", borderRadius: "4px"
          }}>
            <User className="w-8 h-8" style={{ color: "#D32F2F" }} />
          </div>
          <h2 className="text-xl font-bold font-mono-tech mb-2" style={{ color: "#212529" }}>Acesso Restrito</h2>
          <p className="mb-6 text-sm" style={{ color: "#6C757D" }}>Faça login para aceder à sua conta de lojista.</p>
          <button
            onClick={() => base44.auth.redirectToLogin()}
            className="mm-btn-tactile w-full h-11 font-bold font-mono-tech text-sm"
            style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "#fff", borderRadius: "2px", border: "none" }}
          >
            ENTRAR / REGISTAR
          </button>
          <Link to={createPageUrl("Sobre")}>
            <p className="mt-4 text-xs font-mono-tech" style={{ color: "#9CA3AF" }}>Conheça o programa de revendedores →</p>
          </Link>
        </div>
      </div>
    );
  }

  const status = lojista ? (statusConfig[lojista.status] || statusConfig.pendente) : null;
  const initials = user.full_name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "MM";

  return (
    <>
      <SEOHead
        title="Minha Conta - Área do Lojista | MotorMoura"
        description="Gerencie sua conta de lojista MotorMoura. Acesse preços de atacado, faça cotações e acompanhe seus pedidos."
        keywords="conta lojista, área cliente, cadastro lojista, B2B motormoura"
      />
      <div style={{ background: "#F8F9FA", minHeight: "100vh" }}>
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Page header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-[2px]" style={{ background: "#D32F2F" }} />
            <span className="text-xs font-mono-tech" style={{ color: "#D32F2F", letterSpacing: "0.15em" }}>ÁREA DO LOJISTA</span>
          </div>
          <h1 className="text-xl font-bold font-mono-tech" style={{ color: "#212529" }}>Minha Conta</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── COL ESQUERDA ── */}
          <div className="space-y-4">

            {/* Avatar + Info */}
            <div className="p-5 relative overflow-hidden" style={{
              background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            }}>
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, #D32F2F, #1D4ED8)" }} />
              <div className="flex flex-col items-center text-center pt-2">
                <div className="w-16 h-16 flex items-center justify-center font-bold text-xl font-mono-tech mb-3" style={{
                  background: "linear-gradient(135deg, #D32F2F, #B71C1C)", borderRadius: "4px", color: "#fff"
                }}>
                  {initials}
                </div>
                <p className="font-semibold text-sm mb-0.5" style={{ color: "#212529" }}>{user.full_name}</p>
                <p className="text-xs font-mono-tech mb-4" style={{ color: "#9CA3AF" }}>{user.email}</p>

                {status && (
                  <>
                    <div className="w-full flex items-center gap-2 px-3 py-2" style={{
                      background: status.bg, border: `1px solid ${status.border}`, borderRadius: "2px"
                    }}>
                      <status.Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: status.color }} />
                      <span className="text-xs font-mono-tech font-semibold" style={{ color: status.color }}>{status.label}</span>
                    </div>
                    <p className="text-xs mt-2 text-center" style={{ color: "#6C757D" }}>{status.sublabel}</p>
                  </>
                )}
              </div>
            </div>

            {/* Acesso Rápido */}
            <div className="p-4" style={{
              background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
            }}>
              <p className="text-xs font-mono-tech mb-3" style={{ color: "#9CA3AF", letterSpacing: "0.1em" }}>ACESSO RÁPIDO</p>
              <div className="space-y-1">
                <Link to={createPageUrl("Catalogo")} className="flex items-center justify-between px-3 py-2.5 transition-colors hover:bg-gray-50" style={{ borderRadius: "2px" }}>
                  <div className="flex items-center gap-2">
                    <Package className="w-3.5 h-3.5" style={{ color: "#D32F2F" }} />
                    <span className="text-xs font-mono-tech" style={{ color: "#6C757D" }}>Catálogo de Peças</span>
                  </div>
                  <ChevronRight className="w-3 h-3" style={{ color: "#CBD5E1" }} />
                </Link>
                <Link to={createPageUrl("Orcamento")} className="flex items-center justify-between px-3 py-2.5 transition-colors hover:bg-gray-50" style={{ borderRadius: "2px" }}>
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-3.5 h-3.5" style={{ color: "#1D4ED8" }} />
                    <span className="text-xs font-mono-tech" style={{ color: "#6C757D" }}>Minha Lista</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {cartCount > 0 && (
                      <span className="text-xs font-mono-tech px-1.5 py-0.5" style={{
                        background: "rgba(211,47,47,0.08)", border: "1px solid rgba(211,47,47,0.2)", color: "#D32F2F", borderRadius: "2px"
                      }}>{cartCount}</span>
                    )}
                    <ChevronRight className="w-3 h-3" style={{ color: "#CBD5E1" }} />
                  </div>
                </Link>
                <a href={WHATSAPP_B2B} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2.5 transition-colors hover:bg-gray-50" style={{ borderRadius: "2px" }}>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-3.5 h-3.5" style={{ color: "#16A34A" }} />
                    <span className="text-xs font-mono-tech" style={{ color: "#6C757D" }}>WhatsApp B2B</span>
                  </div>
                  <ChevronRight className="w-3 h-3" style={{ color: "#CBD5E1" }} />
                </a>
              </div>
            </div>

            {/* Sair */}
            <button
              onClick={() => base44.auth.logout()}
              className="w-full flex items-center justify-center gap-2 h-9 text-xs font-mono-tech transition-colors hover:bg-red-50"
              style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#9CA3AF", borderRadius: "2px" }}
            >
              <LogOut className="w-3.5 h-3.5" /> SAIR DA CONTA
            </button>
          </div>

          {/* ── COL DIREITA ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Banner cadastro incompleto */}
            {!lojista && (
              <div className="p-4 flex items-start gap-3" style={{
                background: "rgba(29,78,216,0.05)", border: "1px solid rgba(29,78,216,0.2)", borderRadius: "4px"
              }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#1D4ED8" }} />
                <div>
                  <p className="text-sm font-semibold font-mono-tech mb-1" style={{ color: "#1D4ED8" }}>COMPLETE SEU CADASTRO</p>
                  <p className="text-xs" style={{ color: "#6C757D" }}>Preencha os dados da empresa abaixo para se tornar um lojista homologado e acessar os preços de atacado.</p>
                </div>
              </div>
            )}

            {/* Dados da Empresa */}
            <div className="p-5" style={{
              background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
            }}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" style={{ color: "#D32F2F" }} />
                  <span className="font-bold text-sm font-mono-tech" style={{ color: "#212529" }}>DADOS DA EMPRESA</span>
                </div>
                {lojista && !editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-1.5 px-3 h-7 text-xs font-mono-tech transition-colors hover:bg-gray-50"
                    style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", color: "#6C757D", borderRadius: "2px" }}
                  >
                    <Edit3 className="w-3 h-3" /> EDITAR
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <StyledInput label="NOME DA LOJA / EMPRESA *" value={form.nome_loja}
                    onChange={(e) => setForm({ ...form, nome_loja: e.target.value })}
                    placeholder="Ex: Loja do João Ltda." disabled={!editMode} />
                </div>
                <StyledInput label="NIF / CNPJ" value={form.nif}
                  onChange={(e) => setForm({ ...form, nif: e.target.value })}
                  placeholder="00.000.000/0001-00" disabled={!editMode} />
                <StyledInput label="TELEFONE" value={form.telefone}
                  onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                  placeholder="(85) 99999-9999" disabled={!editMode} />
                <StyledInput label="CIDADE" value={form.cidade}
                  onChange={(e) => setForm({ ...form, cidade: e.target.value })}
                  placeholder="Fortaleza" disabled={!editMode} />
                <StyledInput label="ESTADO" value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value })}
                  placeholder="CE" disabled={!editMode} />
              </div>

              {editMode && (
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={handleSave}
                    disabled={saving || !form.nome_loja}
                    className="mm-btn-tactile flex items-center gap-2 px-5 h-9 text-xs font-mono-tech font-bold disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "#fff", borderRadius: "2px", border: "none" }}
                  >
                    <Save className="w-3.5 h-3.5" />
                    {saving ? "SALVANDO..." : saved ? "✓ SALVO!" : lojista ? "SALVAR ALTERAÇÕES" : "REGISTAR COMO LOJISTA"}
                  </button>
                  {lojista && (
                    <button onClick={() => setEditMode(false)}
                      className="px-4 h-9 text-xs font-mono-tech transition-colors hover:bg-gray-50"
                      style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", color: "#6C757D", borderRadius: "2px" }}>
                      CANCELAR
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Benefícios */}
            <div className="p-5" style={{
              background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
            }}>
              <p className="text-xs font-mono-tech mb-4" style={{ color: "#D32F2F", letterSpacing: "0.12em" }}>BENEFÍCIOS DO PROGRAMA B2B</p>
              <div className="grid grid-cols-2 gap-3">
                {BENEFICIOS.map((b) => (
                  <div key={b.title} className="flex items-start gap-2.5 p-3" style={{
                    background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px"
                  }}>
                    <b.icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: b.color }} />
                    <div>
                      <p className="text-xs font-semibold font-mono-tech" style={{ color: "#212529" }}>{b.title}</p>
                      <p className="text-xs" style={{ color: "#9CA3AF" }}>{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA catálogo */}
            <div className="p-5 flex items-center justify-between flex-wrap gap-3" style={{
              background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
            }}>
              <div>
                <p className="font-bold font-mono-tech text-sm mb-1" style={{ color: "#212529" }}>Pronto para cotar?</p>
                <p className="text-xs" style={{ color: "#9CA3AF" }}>Explore o catálogo e adicione peças à sua lista de cotação.</p>
              </div>
              <Link to={createPageUrl("Catalogo")}>
                <button className="mm-btn-tactile flex items-center gap-2 px-4 h-9 text-xs font-mono-tech font-bold flex-shrink-0" style={{
                  background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "#fff", borderRadius: "2px", border: "none"
                }}>
                  IR AO CATÁLOGO <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>

          </div>
        </div>
      </div>
      </div>
    </>
  );
}
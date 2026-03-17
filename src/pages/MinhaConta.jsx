import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import {
  User, Clock, CheckCircle, XCircle, ShoppingCart, Package,
  MessageCircle, ChevronRight, LogOut, Camera, Heart, Wrench, Building2, FileText
} from "lucide-react";
import SEOHead from "../components/SEOHead";
import DadosEmpresaForm from "../components/conta/DadosEmpresaForm";
import GaragemSection from "../components/conta/GaragemSection";
import FavoritosTab from "../components/conta/FavoritosTab";

const WHATSAPP_B2B = "https://api.whatsapp.com/send?phone=5585986894081";

const statusConfig = {
  pendente: { label: "Aguardando Aprovação", sublabel: "Cadastro em análise. Retorno em até 24h úteis.", color: "#B45309", bg: "rgba(180,83,9,0.08)", border: "rgba(180,83,9,0.25)", Icon: Clock },
  aprovado: { label: "Lojista Aprovado ✓", sublabel: "Você tem acesso aos preços de atacado e cotação B2B.", color: "#16A34A", bg: "rgba(22,163,74,0.08)", border: "rgba(22,163,74,0.25)", Icon: CheckCircle },
  suspenso: { label: "Conta Suspensa", sublabel: "Entre em contacto com a equipa B2B para regularizar.", color: "#D32F2F", bg: "rgba(211,47,47,0.08)", border: "rgba(211,47,47,0.25)", Icon: XCircle },
};

const TABS = [
  { id: "dados", label: "Dados da Empresa", icon: Building2 },
  { id: "garagem", label: "Minha Garagem", icon: Wrench },
  { id: "favoritos", label: "Favoritos", icon: Heart },
  { id: "pedidos", label: "Meus Pedidos", icon: FileText },
];

export default function MinhaConta() {
  const [user, setUser] = useState(null);
  const [lojista, setLojista] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [activeTab, setActiveTab] = useState("dados");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    base44.auth.me().then(async (u) => {
      setUser(u);
      const lojistas = await base44.entities.Lojistas.filter({ user_email: u.email });
      if (lojistas.length > 0) setLojista(lojistas[0]);
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

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingLogo(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    if (lojista) {
      await base44.entities.Lojistas.update(lojista.id, { logo_url: file_url });
      setLojista((l) => ({ ...l, logo_url: file_url }));
    } else {
      // Will be saved when they register
      setLojista((l) => l ? { ...l, logo_url: file_url } : { logo_url: file_url });
    }
    setUploadingLogo(false);
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center" style={{ background: "#F8F9FA" }}>
      <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#D32F2F", borderTopColor: "transparent" }} />
    </div>
  );

  if (!user) return (
    <div className="min-h-[60vh] flex items-center justify-center px-4" style={{ background: "#F8F9FA" }}>
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center"
          style={{ background: "rgba(211,47,47,0.08)", border: "1px solid rgba(211,47,47,0.2)", borderRadius: "4px" }}>
          <User className="w-8 h-8" style={{ color: "#D32F2F" }} />
        </div>
        <h2 className="text-xl font-bold font-mono-tech mb-2" style={{ color: "#212529" }}>Acesso Restrito</h2>
        <p className="mb-6 text-sm" style={{ color: "#6C757D" }}>Faça login para aceder à sua conta de lojista.</p>
        <button onClick={() => base44.auth.redirectToLogin()}
          className="mm-btn-tactile w-full h-11 font-bold font-mono-tech text-sm"
          style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "#fff", borderRadius: "2px", border: "none" }}>
          ENTRAR / REGISTAR
        </button>
      </div>
    </div>
  );

  const status = lojista ? (statusConfig[lojista.status] || statusConfig.pendente) : null;
  const initials = user.full_name?.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "MM";

  return (
    <>
      <SEOHead
        title="Minha Conta - Área do Lojista | MotorMoura"
        description="Gerencie sua conta de lojista MotorMoura."
      />
      <div style={{ background: "#F8F9FA", minHeight: "100vh" }}>
        <div className="max-w-5xl mx-auto px-4 py-8">

          {/* Page header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-[2px]" style={{ background: "#D32F2F" }} />
              <span className="text-xs font-mono-tech" style={{ color: "#D32F2F", letterSpacing: "0.15em" }}>ÁREA DO LOJISTA</span>
            </div>
            <h1 className="text-xl font-bold font-mono-tech" style={{ color: "#212529" }}>Minha Conta</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* ── LEFT SIDEBAR ── */}
            <div className="space-y-4">

              {/* Avatar / Logo */}
              <div className="p-5 relative overflow-hidden" style={{
                background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
              }}>
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, #D32F2F, #1D4ED8)" }} />
                <div className="flex flex-col items-center text-center pt-2">

                  {/* Profile pic */}
                  <div className="relative mb-3">
                    {lojista?.logo_url ? (
                      <img src={lojista.logo_url} alt="Logo"
                        className="w-20 h-20 object-cover"
                        style={{ borderRadius: "4px", border: "2px solid #E2E8F0" }} />
                    ) : (
                      <div className="w-20 h-20 flex items-center justify-center font-bold text-2xl font-mono-tech"
                        style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", borderRadius: "4px", color: "#fff" }}>
                        {initials}
                      </div>
                    )}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingLogo}
                      className="absolute -bottom-2 -right-2 w-7 h-7 flex items-center justify-center mm-btn-tactile"
                      style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "50%", color: "#6C757D", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}
                      title="Alterar logo"
                    >
                      {uploadingLogo ? (
                        <div className="w-3 h-3 border border-t-transparent rounded-full animate-spin" style={{ borderColor: "#D32F2F", borderTopColor: "transparent" }} />
                      ) : (
                        <Camera className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </div>

                  <p className="font-semibold text-sm mb-0.5" style={{ color: "#212529" }}>{user.full_name}</p>
                  <p className="text-xs font-mono-tech mb-1" style={{ color: "#9CA3AF" }}>{user.email}</p>
                  {lojista?.nome_loja && (
                    <p className="text-xs font-mono-tech mb-3" style={{ color: "#6C757D" }}>{lojista.nome_loja}</p>
                  )}

                  {status && (
                    <>
                      <div className="w-full flex items-center gap-2 px-3 py-2"
                        style={{ background: status.bg, border: `1px solid ${status.border}`, borderRadius: "2px" }}>
                        <status.Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: status.color }} />
                        <span className="text-xs font-mono-tech font-semibold" style={{ color: status.color }}>{status.label}</span>
                      </div>
                      <p className="text-xs mt-2 text-center" style={{ color: "#6C757D" }}>{status.sublabel}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Quick links */}
              <div className="p-4" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
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
                        <span className="text-xs font-mono-tech px-1.5 py-0.5"
                          style={{ background: "rgba(211,47,47,0.08)", border: "1px solid rgba(211,47,47,0.2)", color: "#D32F2F", borderRadius: "2px" }}>
                          {cartCount}
                        </span>
                      )}
                      <ChevronRight className="w-3 h-3" style={{ color: "#CBD5E1" }} />
                    </div>
                  </Link>
                  <Link to={createPageUrl("MeusPedidos")} className="flex items-center justify-between px-3 py-2.5 transition-colors hover:bg-gray-50" style={{ borderRadius: "2px" }}>
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5" style={{ color: "#B45309" }} />
                      <span className="text-xs font-mono-tech" style={{ color: "#6C757D" }}>Meus Pedidos</span>
                    </div>
                    <ChevronRight className="w-3 h-3" style={{ color: "#CBD5E1" }} />
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

              {/* Logout */}
              <button
                onClick={() => base44.auth.logout()}
                className="w-full flex items-center justify-center gap-2 h-9 text-xs font-mono-tech transition-colors hover:bg-red-50"
                style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#9CA3AF", borderRadius: "2px" }}>
                <LogOut className="w-3.5 h-3.5" /> SAIR DA CONTA
              </button>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="lg:col-span-2">

              {/* Tabs */}
              <div className="flex gap-1 mb-5 overflow-x-auto" style={{ borderBottom: "1px solid #E2E8F0", paddingBottom: "0px" }}>
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="flex items-center gap-1.5 px-4 py-3 text-xs font-mono-tech whitespace-nowrap transition-all duration-200 relative"
                      style={{
                        color: isActive ? "#D32F2F" : "#6C757D",
                        background: "transparent",
                        border: "none",
                        borderBottom: isActive ? "2px solid #D32F2F" : "2px solid transparent",
                        marginBottom: "-1px",
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content — smooth transition */}
              <div style={{ animation: "fadeIn 0.25s ease" }}>
                {activeTab === "dados" && (
                  <DadosEmpresaForm
                    lojista={lojista}
                    user={user}
                    onSaved={(updated) => setLojista(updated)}
                  />
                )}
                {activeTab === "garagem" && (
                  <GaragemSection
                    lojista={lojista}
                    onSaved={(updated) => setLojista(updated)}
                  />
                )}
                {activeTab === "favoritos" && <FavoritosTab user={user} />}
                {activeTab === "pedidos" && (
                  <div className="p-6 text-center" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
                    <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: "#E2E8F0" }} />
                    <p className="text-sm font-mono-tech mb-4" style={{ color: "#6C757D" }}>HISTÓRICO DE ORÇAMENTOS</p>
                    <Link to={createPageUrl("MeusPedidos")}>
                      <button className="h-9 px-5 text-sm font-mono-tech font-bold mm-btn-tactile"
                        style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "#fff", borderRadius: "2px", border: "none" }}>
                        VER TODOS OS PEDIDOS →
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
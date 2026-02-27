import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { ShoppingCart, Menu, X, Zap, Trash2, Plus, Minus, MessageCircle, Mail, Instagram, ExternalLink } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const syncCart = () => {
    const stored = localStorage.getItem("motormoura_cart");
    setCart(stored ? JSON.parse(stored) : []);
  };

  useEffect(() => {
    syncCart();
    window.addEventListener("storage", syncCart);
    window.addEventListener("cartUpdated", () => { syncCart(); setCartOpen(true); });
    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener("cartUpdated", syncCart);
    };
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantidade, 0);

  const saveCart = (c) => {
    localStorage.setItem("motormoura_cart", JSON.stringify(c));
    setCart(c);
    window.dispatchEvent(new Event("storage"));
  };

  const updateQtd = (sku, delta) => {
    const updated = cart.map(item =>
      item.sku_codigo === sku
        ? { ...item, quantidade: Math.max(1, item.quantidade + delta) }
        : item
    );
    saveCart(updated);
  };

  const removeItem = (sku) => {
    saveCart(cart.filter(i => i.sku_codigo !== sku));
  };

  const handleSendWhatsApp = async () => {
    const WHATSAPP_NUMBER = "5511999999999";
    await base44.entities.Orcamentos.create({
      lojista_email: user?.email || "anonimo",
      lojista_nome: user?.full_name || "Visitante",
      itens: cart,
      status: "pendente",
      numero_orcamento: `ORC-${Date.now()}`,
    });
    let msg = "Olá, equipa MotorMoura! Gostaria de cotar as seguintes peças:\n\n";
    cart.forEach(item => { msg += `• ${item.quantidade}x ${item.nome_peca} (SKU: ${item.sku_codigo})\n`; });
    if (user) msg += `\nAtenciosamente,\n${user.full_name}`;
    const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(msg)}`;
    saveCart([]);
    setCartOpen(false);
    window.open(url, "_blank");
  };

  const navLinks = [
    { label: "INÍCIO", page: "Home" },
    { label: "CATÁLOGO", page: "Catalogo" },
    { label: "CONTA", page: "MinhaConta" },
  ];
  if (user?.role === "admin") navLinks.push({ label: "ADMIN", page: "Admin" });

  return (
    <div
      className="min-h-screen mm-bg"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {/* ── HEADER ─────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: "rgba(15,15,17,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #FB923C, #EA7C28)",
                  clipPath: "polygon(4px 0%, 100% 0%, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0% 100%, 0% 4px)",
                }}
              >
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <span
                  className="font-bold text-lg leading-none tracking-tight"
                  style={{ fontFamily: "'Space Mono', monospace", color: "#E5E7EB" }}
                >
                  Motor
                </span>
                <span
                  className="font-bold text-lg leading-none tracking-tight"
                  style={{ fontFamily: "'Space Mono', monospace", color: "#FB923C" }}
                >
                  Moura
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)}
                  className="text-xs font-mono-tech transition-colors relative"
                  style={{
                    color: currentPageName === link.page ? "#FB923C" : "#6B7280",
                    letterSpacing: "0.1em",
                  }}
                >
                  {link.label}
                  {currentPageName === link.page && (
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-[1px]"
                      style={{ background: "#FB923C" }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Cart button */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 px-3 h-9 mm-btn-tactile"
                style={{
                  background: totalItems > 0 ? "rgba(251,146,60,0.1)" : "rgba(255,255,255,0.04)",
                  border: totalItems > 0 ? "1px solid rgba(251,146,60,0.3)" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "2px",
                  color: totalItems > 0 ? "#FB923C" : "#6B7280",
                }}
              >
                <ShoppingCart className="w-4 h-4" />
                {totalItems > 0 && (
                  <span className="text-xs font-mono-tech font-bold">{totalItems}</span>
                )}
              </button>

              {/* Auth */}
              {user ? (
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-xs font-mono-tech" style={{ color: "#6B7280" }}>
                    {user.full_name?.split(" ")[0].toUpperCase()}
                  </span>
                  <button
                    onClick={() => base44.auth.logout()}
                    className="text-xs font-mono-tech mm-btn-tactile px-3 h-9"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#4B5563",
                      borderRadius: "2px",
                    }}
                  >
                    SAIR
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => base44.auth.redirectToLogin()}
                  className="hidden md:flex mm-btn-tactile px-4 h-9 text-xs font-mono-tech font-bold items-center"
                  style={{
                    background: "linear-gradient(135deg, #FB923C, #EA7C28)",
                    color: "#fff",
                    borderRadius: "2px",
                    border: "none",
                  }}
                >
                  ENTRAR
                </button>
              )}

              {/* Mobile toggle */}
              <button
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{ color: "#6B7280" }}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <div
            className="md:hidden px-4 py-3 space-y-1"
            style={{ background: "rgba(10,10,12,0.98)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.page}
                to={createPageUrl(link.page)}
                className="block py-2 text-xs font-mono-tech"
                style={{ color: currentPageName === link.page ? "#FB923C" : "#6B7280", letterSpacing: "0.1em" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <button
                onClick={() => base44.auth.redirectToLogin()}
                className="w-full h-9 mt-2 text-xs font-mono-tech font-bold mm-btn-tactile"
                style={{
                  background: "linear-gradient(135deg, #FB923C, #EA7C28)",
                  color: "#fff",
                  borderRadius: "2px",
                  border: "none",
                }}
              >
                ENTRAR / REGISTAR
              </button>
            )}
          </div>
        )}
      </header>

      {/* ── MAIN ───────────────────────────────────────────────── */}
      <main>{children}</main>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer style={{ background: "#0A0A0C", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="h-[2px]" style={{ background: "linear-gradient(90deg, #1D4ED8, #FB923C, #1D4ED8)" }} />
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1: Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{
                background: "linear-gradient(135deg, #FB923C, #EA7C28)",
                clipPath: "polygon(4px 0%, 100% 0%, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0% 100%, 0% 4px)",
              }}>
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-bold text-base font-mono-tech" style={{ color: "#F3F4F6" }}>Motor</span>
                <span className="font-bold text-base font-mono-tech" style={{ color: "#FB923C" }}>Moura</span>
              </div>
            </div>
            <p style={{ color: "#6B7280", fontSize: "15px", lineHeight: 1.7, marginBottom: "12px" }}>
              Distribuidora técnica especializada em peças de reposição para motores, geradores e motobombas.
            </p>
            <p className="text-xs font-mono-tech" style={{ color: "#374151" }}>CNPJ: 12.345.678/0001-99</p>
            <p className="text-xs font-mono-tech mt-1" style={{ color: "#374151" }}>São Paulo — SP, Brasil</p>
          </div>

          {/* Col 2: Institucional */}
          <div>
            <h4 className="text-xs font-mono-tech mb-4" style={{ color: "#FB923C", letterSpacing: "0.15em" }}>INSTITUCIONAL</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Sobre a Importadora", page: "MinhaConta" },
                { label: "Seja um Revendedor", page: "MinhaConta" },
                { label: "Política de Garantia", page: "MinhaConta" },
                { label: "Minha Conta", page: "MinhaConta" },
              ].map(link => (
                <li key={link.label}>
                  <Link to={createPageUrl(link.page)} className="transition-colors hover:text-[#FB923C]" style={{ color: "#6B7280", fontSize: "15px" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Catálogo Rápido */}
          <div>
            <h4 className="text-xs font-mono-tech mb-4" style={{ color: "#FB923C", letterSpacing: "0.15em" }}>CATÁLOGO RÁPIDO</h4>
            <ul className="space-y-2.5">
              {["Motores a Gasolina","Motores a Diesel","Motobombas 4 Tempos","Geradores 4 Tempos","Geradores 2 Tempos","Bombas de Pulverização"].map(cat => (
                <li key={cat}>
                  <Link to={createPageUrl("Catalogo") + "?categoria=" + encodeURIComponent(cat)} className="transition-colors hover:text-[#FB923C]" style={{ color: "#6B7280", fontSize: "15px" }}>
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Atendimento */}
          <div>
            <h4 className="text-xs font-mono-tech mb-4" style={{ color: "#FB923C", letterSpacing: "0.15em" }}>ATENDIMENTO B2B</h4>
            <div className="space-y-4">
              <a href="https://api.whatsapp.com/send?phone=5511999999999&text=Olá,%20MotorMoura!" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: "rgba(22,163,74,0.15)", border: "1px solid rgba(22,163,74,0.3)", borderRadius: "2px" }}>
                  <MessageCircle className="w-4 h-4" style={{ color: "#4ADE80" }} />
                </div>
                <div>
                  <p className="text-xs font-mono-tech" style={{ color: "#4B5563" }}>WHATSAPP B2B</p>
                  <p className="group-hover:text-[#4ADE80] transition-colors" style={{ color: "#9CA3AF", fontSize: "14px" }}>(11) 99999-9999</p>
                </div>
              </a>
              <a href="mailto:b2b@motormoura.com.br" className="flex items-center gap-3 group">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: "rgba(29,78,216,0.15)", border: "1px solid rgba(29,78,216,0.3)", borderRadius: "2px" }}>
                  <Mail className="w-4 h-4" style={{ color: "#60A5FA" }} />
                </div>
                <div>
                  <p className="text-xs font-mono-tech" style={{ color: "#4B5563" }}>E-MAIL CORPORATIVO</p>
                  <p className="group-hover:text-[#60A5FA] transition-colors" style={{ color: "#9CA3AF", fontSize: "14px" }}>b2b@motormoura.com.br</p>
                </div>
              </a>
              <a href="https://www.instagram.com/motormouraequipamentos" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.25)", borderRadius: "2px" }}>
                  <Instagram className="w-4 h-4" style={{ color: "#FB923C" }} />
                </div>
                <div>
                  <p className="text-xs font-mono-tech" style={{ color: "#4B5563" }}>INSTAGRAM OFICIAL</p>
                  <p className="group-hover:text-[#FB923C] transition-colors flex items-center gap-1" style={{ color: "#9CA3AF", fontSize: "14px" }}>
                    @motormouraequipamentos <ExternalLink className="w-3 h-3" />
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="px-4 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs font-mono-tech" style={{ color: "#374151" }}>© 2026 MOTORMOURA DISTRIBUIDORA — TODOS OS DIREITOS RESERVADOS</p>
            <p className="text-xs font-mono-tech" style={{ color: "#1F2937" }}>PLATAFORMA B2B · EXCLUSIVA PARA LOJISTAS HOMOLOGADOS</p>
          </div>
        </div>
      </footer>

      {/* ── CART SIDE PANEL ────────────────────────────────────── */}
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[60] transition-opacity duration-300"
        style={{
          background: "rgba(0,0,0,0.7)",
          opacity: cartOpen ? 1 : 0,
          pointerEvents: cartOpen ? "auto" : "none",
          backdropFilter: cartOpen ? "blur(2px)" : "none",
        }}
        onClick={() => setCartOpen(false)}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 h-full z-[70] flex flex-col"
        style={{
          width: "min(420px, 100vw)",
          background: "#17171A",
          borderLeft: "1px solid rgba(29,78,216,0.25)",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.6)",
          transform: cartOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        {/* Panel header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" style={{ color: "#FB923C" }} />
            <span className="text-sm font-bold font-mono-tech" style={{ color: "#E5E7EB" }}>
              LISTA DE COTAÇÃO
            </span>
            {totalItems > 0 && (
              <span
                className="text-xs px-2 py-0.5 font-mono-tech"
                style={{
                  background: "rgba(251,146,60,0.15)",
                  border: "1px solid rgba(251,146,60,0.3)",
                  color: "#FB923C",
                  borderRadius: "2px",
                }}
              >
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-white/10"
            style={{ color: "#6B7280", borderRadius: "2px" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Panel top accent */}
        <div className="h-[2px]" style={{ background: "linear-gradient(90deg, #1D4ED8, #FB923C, #1D4ED8)" }} />

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto py-4 px-5">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="w-12 h-12 mb-3" style={{ color: "#27272C" }} />
              <p className="text-sm font-mono-tech" style={{ color: "#4B5563" }}>LISTA VAZIA</p>
              <p className="text-xs mt-1" style={{ color: "#374151" }}>
                Adicione peças do catálogo
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.sku_codigo}
                  className="flex items-center gap-3 p-3"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "2px",
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "#E5E7EB" }}>
                      {item.nome_peca}
                    </p>
                    <p className="text-xs font-mono-tech mt-0.5" style={{ color: "#1D4ED8" }}>
                      SKU: {item.sku_codigo}
                    </p>
                  </div>
                  <div
                    className="flex items-center"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "2px",
                    }}
                  >
                    <button
                      onClick={() => updateQtd(item.sku_codigo, -1)}
                      className="w-6 h-7 flex items-center justify-center hover:bg-white/10 transition-colors"
                      style={{ color: "#6B7280" }}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center text-xs font-mono-tech" style={{ color: "#E5E7EB" }}>
                      {item.quantidade}
                    </span>
                    <button
                      onClick={() => updateQtd(item.sku_codigo, 1)}
                      className="w-6 h-7 flex items-center justify-center hover:bg-white/10 transition-colors"
                      style={{ color: "#6B7280" }}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.sku_codigo)}
                    className="w-7 h-7 flex items-center justify-center hover:bg-red-500/10 transition-colors"
                    style={{ color: "#4B5563", borderRadius: "2px" }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Panel footer actions */}
        {cart.length > 0 && (
          <div
            className="px-5 py-4 space-y-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="flex justify-between items-center py-2 px-3"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "2px",
              }}
            >
              <span className="text-xs font-mono-tech" style={{ color: "#6B7280" }}>TOTAL</span>
              <span className="text-sm font-bold font-mono-tech" style={{ color: "#FB923C" }}>
                {cart.reduce((s, i) => s + i.quantidade, 0)} unid. · {cart.length} ref.
              </span>
            </div>

            <button
              onClick={handleSendWhatsApp}
              className="w-full h-11 flex items-center justify-center gap-2 text-sm font-bold font-mono-tech mm-btn-tactile"
              style={{
                background: "linear-gradient(135deg, #16A34A, #15803D)",
                color: "#fff",
                borderRadius: "2px",
                border: "none",
                boxShadow: "0 4px 16px rgba(22,163,74,0.25)",
              }}
            >
              <MessageCircle className="w-4 h-4" />
              ENVIAR VIA WHATSAPP
            </button>

            <Link
              to={createPageUrl("Orcamento")}
              onClick={() => setCartOpen(false)}
              className="block w-full h-9 flex items-center justify-center text-xs font-mono-tech"
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#6B7280",
                borderRadius: "2px",
              }}
            >
              VER LISTA COMPLETA
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
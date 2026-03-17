import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { ShoppingCart, Menu, X, Trash2, Plus, Minus, MessageCircle, Mail, Instagram, ExternalLink, Search } from "lucide-react";
import HeaderSearch from "@/components/layout/HeaderSearch";
import { analytics } from "@/components/analytics/analytics";

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
    saveCart(cart.map(item =>
      item.sku_codigo === sku
        ? { ...item, quantidade: Math.max(1, item.quantidade + delta) }
        : item
    ));
  };

  const removeItem = (sku) => saveCart(cart.filter(i => i.sku_codigo !== sku));

  const handleSendWhatsApp = async () => {
    const WHATSAPP_NUMBER = "5585986894081";
    const totalItens = cart.reduce((s, i) => s + i.quantidade, 0);
    analytics.quoteSubmit(cart, totalItens);
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
    analytics.whatsappClick("cart_panel");
    saveCart([]);
    setCartOpen(false);
    window.open(url, "_blank");
  };

  const navLinks = [
    { label: "INÍCIO", page: "Home" },
    { label: "CATÁLOGO", page: "Catalogo" },
    { label: "SOBRE", page: "Sobre" },
    { label: "CONTA", page: "MinhaConta" },
  ];
  if (user?.role === "admin") navLinks.push({ label: "ADMIN", page: "Admin" });

  return (
    <div className="min-h-screen mm-bg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: scrolled
            ? "rgba(8,8,16,0.95)"
            : "rgba(8,8,16,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(255,255,255,0.04)",
          boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.4)" : "none",
          transition: "all 320ms cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
      >
        {/* Accent line top */}
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #DC2626 30%, #1D4ED8 70%, transparent)", opacity: scrolled ? 1 : 0.6, transition: "opacity 320ms ease" }} />

        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-2.5 group">
              <img
                src="https://media.base44.com/images/public/69a2232aaedb3f01dfc43e13/a9d157fda_LogoMOTORMOURASimplificada-cone.png"
                alt="MotorMoura"
                className="h-10 w-auto"
                style={{ objectFit: "contain", filter: "brightness(1)", transition: "filter 250ms ease" }}
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)}
                  className="relative px-4 py-2 text-xs font-mono-tech transition-all duration-200"
                  style={{
                    color: currentPageName === link.page ? "#FFFFFF" : "rgba(255,255,255,0.5)",
                    letterSpacing: "0.1em",
                    borderRadius: "4px",
                    background: currentPageName === link.page ? "rgba(255,255,255,0.07)" : "transparent",
                  }}
                  onMouseEnter={e => { if (currentPageName !== link.page) e.currentTarget.style.color = "rgba(255,255,255,0.85)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                  onMouseLeave={e => { if (currentPageName !== link.page) { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.background = "transparent"; } }}
                >
                  {link.label}
                  {currentPageName === link.page && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full" style={{ background: "#DC2626" }} />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop search */}
            <div className="hidden md:block" style={{ width: 260 }}>
              <HeaderSearch />
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 px-3 h-9 mm-btn"
                style={{
                  background: totalItems > 0 ? "rgba(220,38,38,0.15)" : "rgba(255,255,255,0.06)",
                  border: totalItems > 0 ? "1px solid rgba(220,38,38,0.4)" : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  color: totalItems > 0 ? "#EF4444" : "rgba(255,255,255,0.6)",
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
                  <span className="text-xs font-mono-tech" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {user.full_name?.split(" ")[0].toUpperCase()}
                  </span>
                  <button
                    onClick={() => base44.auth.logout()}
                    className="text-xs font-mono-tech mm-btn px-3 h-9"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.45)",
                      borderRadius: "6px",
                    }}
                  >
                    SAIR
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    analytics.loginAttempt();
                    base44.auth.redirectToLogin();
                  }}
                  className="hidden md:flex mm-btn px-4 h-9 text-xs font-mono-tech font-bold items-center"
                  style={{
                    background: "linear-gradient(135deg, #DC2626, #B91C1C)",
                    color: "#fff",
                    borderRadius: "6px",
                    border: "none",
                    boxShadow: "0 4px 16px rgba(220,38,38,0.3)",
                  }}
                >
                  ENTRAR
                </button>
              )}

              {/* Mobile search */}
              <button
                className="md:hidden flex items-center justify-center w-8 h-8 mm-btn"
                onClick={() => setMobileSearchOpen(true)}
                style={{ color: "rgba(255,255,255,0.6)", borderRadius: "6px" }}
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Mobile menu toggle */}
              <button
                className="md:hidden flex items-center justify-center w-8 h-8 mm-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{ color: "rgba(255,255,255,0.6)", borderRadius: "6px" }}
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
            style={{
              background: "rgba(8,8,16,0.98)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.page}
                to={createPageUrl(link.page)}
                className="block py-2.5 px-3 text-xs font-mono-tech rounded-md transition-all"
                style={{
                  color: currentPageName === link.page ? "#FFFFFF" : "rgba(255,255,255,0.5)",
                  background: currentPageName === link.page ? "rgba(220,38,38,0.12)" : "transparent",
                  letterSpacing: "0.1em",
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <button
                onClick={() => base44.auth.redirectToLogin()}
                className="w-full h-10 mt-2 text-xs font-mono-tech font-bold mm-btn"
                style={{
                  background: "linear-gradient(135deg, #DC2626, #B91C1C)",
                  color: "#fff",
                  borderRadius: "6px",
                  border: "none",
                }}
              >
                ENTRAR / REGISTAR
              </button>
            )}
          </div>
        )}
      </header>

      {/* ── MOBILE SEARCH OVERLAY ──────────────────────────────── */}
      {mobileSearchOpen && (
        <div
          className="fixed inset-0 z-[80] flex flex-col"
          style={{ background: "rgba(8,8,16,0.98)", backdropFilter: "blur(16px)" }}
        >
          <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex-1">
              <HeaderSearch mobile onClose={() => setMobileSearchOpen(false)} />
            </div>
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="flex items-center justify-center w-8 h-8 flex-shrink-0"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <Search className="w-10 h-10 mb-2" style={{ color: "rgba(255,255,255,0.08)" }} />
            <p className="text-xs font-mono-tech" style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>BUSQUE POR NOME, SKU OU MARCA</p>
          </div>
        </div>
      )}

      {/* ── MAIN ───────────────────────────────────────────────── */}
      <main>{children}</main>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer style={{ background: "#080810", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        {/* Accent line */}
        <div className="h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #DC2626 30%, #1D4ED8 70%, transparent)" }} />

        {/* Revendedores Oficiais Banner */}
        <div className="px-4 py-4" style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-4">
            <span className="text-xs font-mono-tech" style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em" }}>REVENDEDOR OFICIAL:</span>
            <span className="px-4 py-1.5 text-xs font-bold font-mono-tech" style={{ background: "rgba(29,78,216,0.1)", border: "1px solid rgba(29,78,216,0.25)", color: "#60A5FA", borderRadius: "4px" }}>MAKITA</span>
            <span className="px-4 py-1.5 text-xs font-bold font-mono-tech" style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.25)", color: "#F87171", borderRadius: "4px" }}>VIBROMAK</span>
            <span className="text-xs font-mono-tech" style={{ color: "rgba(255,255,255,0.2)" }}>+ Honda · Toyama · Tekna · Branco · Buffalo · Husqvarna</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1: Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img
                src="https://media.base44.com/images/public/69a2232aaedb3f01dfc43e13/a9d157fda_LogoMOTORMOURASimplificada-cone.png"
                alt="MotorMoura"
                className="h-10 w-auto"
                style={{ objectFit: "contain" }}
              />
            </div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px", lineHeight: 1.7, marginBottom: "12px" }}>
              Distribuidora técnica especializada em peças de reposição para motores, geradores e motobombas. Revendedor oficial Makita e Vibromak.
            </p>
            <p className="text-xs font-mono-tech" style={{ color: "rgba(255,255,255,0.2)" }}>Fortaleza — CE, Brasil</p>
            <p className="text-xs font-mono-tech mt-1" style={{ color: "rgba(255,255,255,0.15)" }}>PLATAFORMA B2B · CNPJ ativo</p>
          </div>

          {/* Col 2: Institucional */}
          <div>
            <h4 className="text-xs font-mono-tech mb-4" style={{ color: "#DC2626", letterSpacing: "0.15em" }}>INSTITUCIONAL</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Sobre a MotorMoura", page: "Sobre" },
                { label: "Seja um Revendedor", page: "MinhaConta" },
                { label: "Minha Conta", page: "MinhaConta" },
                { label: "Meus Pedidos", page: "MeusPedidos" },
                { label: "Lista de Cotação", page: "Orcamento" },
              ].map(link => (
                <li key={link.label}>
                  <Link
                    to={createPageUrl(link.page)}
                    className="transition-colors duration-200"
                    style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#DC2626"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Catálogo Rápido */}
          <div>
            <h4 className="text-xs font-mono-tech mb-4" style={{ color: "#DC2626", letterSpacing: "0.15em" }}>CATÁLOGO RÁPIDO</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Peças de Alto Giro 🔥", cat: "Peças de Alto Giro" },
                { label: "Motores Estacionários", cat: "Motores a Gasolina" },
                { label: "Geradores", cat: "Geradores 4 Tempos" },
                { label: "Motobombas", cat: "Motobombas 4 Tempos" },
                { label: "Sistema de Partida", q: "partida" },
                { label: "Carburadores", q: "carburador" },
                { label: "Filtros e Manutenção", q: "filtro" },
              ].map(item => (
                <li key={item.label}>
                  <Link
                    to={createPageUrl("Catalogo") + "?" + (item.cat ? "categoria=" + encodeURIComponent(item.cat) : "q=" + encodeURIComponent(item.q))}
                    className="transition-colors duration-200"
                    style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#DC2626"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Atendimento */}
          <div>
            <h4 className="text-xs font-mono-tech mb-4" style={{ color: "#DC2626", letterSpacing: "0.15em" }}>ATENDIMENTO B2B</h4>
            <div className="space-y-4">
              <a href="https://api.whatsapp.com/send?phone=5585986894081&text=Olá,%20MotorMoura!" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 group"
                onMouseEnter={e => e.currentTarget.querySelector('.contact-text').style.color = "#4ADE80"}
                onMouseLeave={e => e.currentTarget.querySelector('.contact-text').style.color = "rgba(255,255,255,0.35)"}
              >
                <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: "6px" }}>
                  <MessageCircle className="w-4 h-4" style={{ color: "#4ADE80" }} />
                </div>
                <div>
                  <p className="text-[10px] font-mono-tech" style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em" }}>WHATSAPP B2B</p>
                  <p className="contact-text text-sm transition-colors duration-200" style={{ color: "rgba(255,255,255,0.35)" }}>(85) 98689-4081</p>
                </div>
              </a>

              <a href="mailto:contato@motormoura.com.br" className="flex items-center gap-3 group"
                onMouseEnter={e => e.currentTarget.querySelector('.contact-text').style.color = "#60A5FA"}
                onMouseLeave={e => e.currentTarget.querySelector('.contact-text').style.color = "rgba(255,255,255,0.35)"}
              >
                <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: "6px" }}>
                  <Mail className="w-4 h-4" style={{ color: "#60A5FA" }} />
                </div>
                <div>
                  <p className="text-[10px] font-mono-tech" style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em" }}>E-MAIL</p>
                  <p className="contact-text text-sm transition-colors duration-200" style={{ color: "rgba(255,255,255,0.35)" }}>contato@motormoura.com.br</p>
                </div>
              </a>

              <a href="https://www.instagram.com/motormouraequipamentos" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 group"
                onMouseEnter={e => e.currentTarget.querySelector('.contact-text').style.color = "#F87171"}
                onMouseLeave={e => e.currentTarget.querySelector('.contact-text').style.color = "rgba(255,255,255,0.35)"}
              >
                <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "6px" }}>
                  <Instagram className="w-4 h-4" style={{ color: "#F87171" }} />
                </div>
                <div>
                  <p className="text-[10px] font-mono-tech" style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em" }}>INSTAGRAM</p>
                  <p className="contact-text text-sm transition-colors duration-200 flex items-center gap-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                    @motormouraequipamentos <ExternalLink className="w-3 h-3" />
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="px-4 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs font-mono-tech" style={{ color: "rgba(255,255,255,0.15)" }}>© 2026 MOTORMOURA DISTRIBUIDORA — TODOS OS DIREITOS RESERVADOS</p>
            <p className="text-xs font-mono-tech" style={{ color: "rgba(255,255,255,0.1)" }}>PLATAFORMA B2B · EXCLUSIVA PARA LOJISTAS HOMOLOGADOS</p>
          </div>
        </div>
      </footer>

      {/* ── CART SIDE PANEL ────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-[60] transition-all duration-300"
        style={{
          background: cartOpen ? "rgba(0,0,0,0.75)" : "rgba(0,0,0,0)",
          pointerEvents: cartOpen ? "auto" : "none",
          backdropFilter: cartOpen ? "blur(4px)" : "none",
        }}
        onClick={() => setCartOpen(false)}
      />

      <div
        className="fixed top-0 right-0 h-full z-[70] flex flex-col"
        style={{
          width: "min(420px, 100vw)",
          background: "#0D0D14",
          borderLeft: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "-12px 0 48px rgba(0,0,0,0.5)",
          transform: cartOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 360ms cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" style={{ color: "#DC2626" }} />
            <span className="text-sm font-bold font-mono-tech" style={{ color: "#FFFFFF" }}>LISTA DE COTAÇÃO</span>
            {totalItems > 0 && (
              <span className="text-xs px-2 py-0.5 font-mono-tech" style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", color: "#EF4444", borderRadius: "3px" }}>
                {totalItems}
              </span>
            )}
          </div>
          <button onClick={() => setCartOpen(false)} className="w-8 h-8 flex items-center justify-center mm-btn" style={{ color: "rgba(255,255,255,0.4)", borderRadius: "6px" }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="h-[2px]" style={{ background: "linear-gradient(90deg, #1D4ED8, #DC2626)" }} />

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-5">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="w-12 h-12 mb-3" style={{ color: "rgba(255,255,255,0.06)" }} />
              <p className="text-sm font-mono-tech" style={{ color: "rgba(255,255,255,0.2)" }}>LISTA VAZIA</p>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.12)" }}>Adicione peças do catálogo</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.sku_codigo} className="flex items-center gap-3 p-3"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px" }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "#FFFFFF" }}>{item.nome_peca}</p>
                    <p className="text-xs font-mono-tech mt-0.5" style={{ color: "#3B82F6" }}>SKU: {item.sku_codigo}</p>
                  </div>
                  <div className="flex items-center" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px" }}>
                    <button onClick={() => updateQtd(item.sku_codigo, -1)} className="w-6 h-7 flex items-center justify-center transition-colors" style={{ color: "rgba(255,255,255,0.4)" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center text-xs font-mono-tech" style={{ color: "#FFFFFF" }}>{item.quantidade}</span>
                    <button onClick={() => updateQtd(item.sku_codigo, 1)} className="w-6 h-7 flex items-center justify-center transition-colors" style={{ color: "rgba(255,255,255,0.4)" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.sku_codigo)} className="w-7 h-7 flex items-center justify-center mm-btn" style={{ color: "rgba(255,255,255,0.25)", borderRadius: "4px" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(220,38,38,0.1)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        {cart.length > 0 && (
          <div className="px-5 py-4 space-y-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex justify-between items-center py-2 px-3"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px" }}>
              <span className="text-xs font-mono-tech" style={{ color: "rgba(255,255,255,0.35)" }}>TOTAL</span>
              <span className="text-sm font-bold font-mono-tech" style={{ color: "#EF4444" }}>
                {cart.reduce((s, i) => s + i.quantidade, 0)} unid. · {cart.length} ref.
              </span>
            </div>
            <button onClick={handleSendWhatsApp}
              className="w-full h-11 flex items-center justify-center gap-2 text-sm font-bold font-mono-tech mm-btn"
              style={{ background: "linear-gradient(135deg, #25D366, #1DA851)", color: "#fff", borderRadius: "6px", border: "none", boxShadow: "0 4px 16px rgba(37,211,102,0.25)" }}>
              <MessageCircle className="w-4 h-4" /> ENVIAR VIA WHATSAPP
            </button>
            <Link to={createPageUrl("Orcamento")} onClick={() => setCartOpen(false)}
              className="block w-full h-9 flex items-center justify-center text-xs font-mono-tech transition-all duration-200 mm-btn"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", borderRadius: "6px" }}>
              VER LISTA COMPLETA
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
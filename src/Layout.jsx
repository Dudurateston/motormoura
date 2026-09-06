import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import {
  ShoppingCart, Menu, X, Trash2, Plus, Minus, MessageCircle, Mail,
  Instagram, ExternalLink, Search, MapPin, Phone, Clock, Heart,
} from "lucide-react";
import { whatsappUrl } from "@/lib/config";
import HeaderSearch from "@/components/layout/HeaderSearch";

// Contatos oficiais (set/2026)
const CONTATO = {
  tel: "(85) 98689-4081",
  email: "comercial@motormouraequipamentos.com.br",
  endereco: "Av. Deputado Paulino Rocha, 2122 — Boa Vista, Castelão · CEP 60867-585",
  cidade: "Fortaleza — CE",
  horario: "Seg–Sex · 8h–18h",
  instagram: "https://www.instagram.com/motormouraequipamentos",
  razao: "Motormoura Equipamentos e Acessórios Ltda",
};

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

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
    try {
      await base44.functions.invoke('submeterOrcamento', { itens: cart });
    } catch (e) {
      console.warn('Falha ao registrar orçamento:', e.message);
    }

    let msg = "Olá! Gostaria de cotar as seguintes peças:\n\n";
    cart.forEach(item => { msg += `• ${item.quantidade}x ${item.nome_peca} (SKU: ${item.sku_codigo})\n`; });
    if (user) msg += `\nAtenciosamente,\n${user.full_name}`;
    const url = whatsappUrl(msg);
    saveCart([]);
    setCartOpen(false);
    window.open(url, "_blank");
  };

  const navLinks = [
    { label: "Início", page: "Home" },
    { label: "Catálogo", page: "Catalogo" },
    { label: "Sobre", page: "Sobre" },
    { label: "Conta", page: "MinhaConta" },
  ];
  if (user?.role === "admin") navLinks.push({ label: "Admin", page: "Admin" });

  return (
    <div className="min-h-screen" style={{ background: "#F9F9F9", color: "#333333" }}>
      {/* ── TOPBAR ─────────────────────────────────────────────── */}
      <div style={{ background: '#333333', padding: '6px 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <span style={{ fontSize: '11px', color: '#BFBFBF', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <MapPin className="w-3 h-3" style={{ color: '#C1272D' }} /> Fortaleza — CE
        </span>
        <span style={{ fontSize: '11px', color: '#BFBFBF', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <Phone className="w-3 h-3" style={{ color: '#C1272D' }} /> (85) 98689-4081
        </span>
        <span style={{ fontSize: '11px', color: '#BFBFBF', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <Clock className="w-3 h-3" style={{ color: '#C1272D' }} /> Seg–Sex · 8h–18h
        </span>
        <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%', display: 'inline-block' }} />
          ESTOQUE EM FORTALEZA
        </span>
      </div>

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50"
        style={{ background: "#FFFFFF", borderBottom: "1px solid #E5E5E5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-2.5">
              <img
                src="/img/brand/logo_oficial.png"
                alt="Motormoura Equipamentos — Distribuidora B2B"
                className="h-12 md:h-14 w-auto"
                style={{ objectFit: "contain" }}
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)}
                  className="text-[13px] font-semibold transition-colors relative"
                  style={{
                    color: currentPageName === link.page ? "#C1272D" : "#595959",
                    letterSpacing: "0.01em",
                  }}
                >
                  {link.label}
                  {currentPageName === link.page && (
                    <span className="absolute -bottom-1.5 left-0 right-0 h-[2px]" style={{ background: "#C1272D" }} />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop search */}
            <div className="hidden lg:block" style={{ width: 230 }}>
              <HeaderSearch />
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 px-3 h-10 transition-colors"
                style={{
                  background: totalItems > 0 ? "rgba(193,39,45,0.08)" : "#F9F9F9",
                  border: "1px solid #E5E5E5",
                  borderRadius: 4,
                  color: "#333333",
                }}
                aria-label="Lista de cotação"
              >
                <ShoppingCart className="w-4 h-4" />
                {totalItems > 0 && (
                  <span className="text-xs font-bold" style={{ color: "#C1272D" }}>{totalItems}</span>
                )}
              </button>

              {/* Auth */}
              {user ? (
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-xs font-semibold" style={{ color: "#595959" }}>
                    {user.full_name?.split(" ")[0]}
                  </span>
                  <button
                    onClick={() => base44.auth.logout()}
                    className="text-xs font-semibold px-3 h-10 transition-colors"
                    style={{ background: "#F9F9F9", border: "1px solid #E5E5E5", color: "#595959", borderRadius: 4 }}
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => base44.auth.redirectToLogin()}
                  className="hidden md:flex mm-btn-primary px-4 h-10 text-xs items-center"
                >
                  ENTRAR
                </button>
              )}

              {/* CTA WhatsApp (desktop) */}
              <a
                href={whatsappUrl("Olá! Vim pelo site e gostaria de fazer uma cotação.")}
                target="_blank" rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 px-4 h-10 text-xs font-bold"
                style={{ background: "#25D366", color: "#fff", borderRadius: 4 }}
              >
                <MessageCircle className="w-4 h-4" /> ORÇAMENTO
              </a>

              {/* Mobile search */}
              <button
                className="md:hidden flex items-center justify-center w-9 h-9"
                onClick={() => setMobileSearchOpen(true)}
                style={{ color: "#333333" }}
                aria-label="Buscar"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Mobile toggle */}
              <button
                className="md:hidden flex items-center justify-center w-9 h-9"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{ color: "#333333" }}
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 py-3 space-y-1" style={{ background: "#FFFFFF", borderTop: "1px solid #E5E5E5" }}>
            {navLinks.map((link) => (
              <Link
                key={link.page}
                to={createPageUrl(link.page)}
                className="block py-3 text-sm font-semibold"
                style={{ color: currentPageName === link.page ? "#C1272D" : "#333333" }}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={whatsappUrl("Olá! Vim pelo site e gostaria de fazer uma cotação.")}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 mt-2 px-4 py-3 text-sm font-bold"
              style={{ background: "#25D366", color: "#fff", borderRadius: 4 }}
            >
              <MessageCircle className="w-4 h-4" /> PEDIR ORÇAMENTO NO WHATSAPP
            </a>
            {!user && (
              <Link to={createPageUrl("MinhaConta")} className="block py-3 text-sm font-semibold" style={{ color: "#595959" }}>
                Seja um revendedor (lojista B2B)
              </Link>
            )}
          </div>
        )}
      </header>

      {/* ── MOBILE SEARCH OVERLAY ─────────────────────────────── */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-[80] flex flex-col" style={{ background: "#FFFFFF" }}>
          <div className="flex items-center gap-2 p-4" style={{ borderBottom: "1px solid #E5E5E5" }}>
            <div className="flex-1">
              <HeaderSearch mobile onClose={() => setMobileSearchOpen(false)} />
            </div>
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="flex items-center justify-center w-9 h-9 flex-shrink-0"
              style={{ color: "#595959" }}
              aria-label="Fechar busca"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-2" style={{ color: "#595959" }}>
            <Search className="w-10 h-10 mb-2 opacity-20" />
            <p className="text-xs font-semibold" style={{ letterSpacing: "0.05em" }}>BUSQUE POR NOME, SKU OU MARCA</p>
          </div>
        </div>
      )}

      {/* ── MAIN ───────────────────────────────────────────────── */}
      <main>{children}</main>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer style={{ background: "#231F20", color: "#BFBFBF" }}>
        <div className="mm-diagonal" />
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1: Brand */}
          <div>
            <div className="inline-flex items-center mb-4" style={{ background: "#FFFFFF", borderRadius: 8, padding: "10px 14px" }}>
              <img src="/img/brand/logo_oficial.png" alt="Motormoura Equipamentos" className="h-12 w-auto" style={{ objectFit: "contain" }} />
            </div>
            <p style={{ fontSize: "13px", lineHeight: 1.7, marginBottom: "12px", color: "#BFBFBF" }}>
              Distribuidora de peças de reposição e equipamentos. Honda, Makita, Vibromak e Menegotti com estoque em Fortaleza e pronta entrega.
            </p>
            <p className="text-xs" style={{ color: "#808080" }}>{CONTATO.razao}</p>
            <p className="text-xs mt-1" style={{ color: "#808080" }}>{CONTATO.endereco}</p>
            <p className="text-xs mt-1" style={{ color: "#808080" }}>{CONTATO.cidade}</p>
          </div>

          {/* Col 2: Institucional */}
          <div>
            <h4 className="text-xs mb-4" style={{ color: "#C1272D", letterSpacing: "0.12em", fontWeight: 800 }}>INSTITUCIONAL</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Sobre a Motormoura", page: "Sobre" },
                { label: "Seja um Revendedor", page: "MinhaConta" },
                { label: "Minha Conta", page: "MinhaConta" },
                { label: "Minhas Cotações", page: "Orcamento" },
              ].map(link => (
                <li key={link.label}>
                  <Link to={createPageUrl(link.page)} className="transition-colors hover:text-white" style={{ color: "#BFBFBF", fontSize: "13px" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Catálogo Rápido */}
          <div>
            <h4 className="text-xs mb-4" style={{ color: "#C1272D", letterSpacing: "0.12em", fontWeight: 800 }}>CATÁLOGO RÁPIDO</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Peças de Alto Giro", cat: "Peças de Alto Giro" },
                { label: "Motores Estacionários", cat: "Motores Estacionários" },
                { label: "Geradores", cat: "Geradores" },
                { label: "Motobombas", cat: "Motobombas" },
                { label: "Sistema de Partida", q: "partida" },
                { label: "Carburadores", q: "carburador" },
                { label: "Filtros e Manutenção", q: "filtro" },
              ].map(item => (
                <li key={item.label}>
                  <Link
                    to={createPageUrl("Catalogo") + "?" + (item.cat ? "categoria=" + encodeURIComponent(item.cat) : "q=" + encodeURIComponent(item.q))}
                    className="transition-colors hover:text-white"
                    style={{ color: "#BFBFBF", fontSize: "13px" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Atendimento */}
          <div>
            <h4 className="text-xs mb-4" style={{ color: "#C1272D", letterSpacing: "0.12em", fontWeight: 800 }}>ATENDIMENTO</h4>
            <div className="space-y-4">
              <a href={whatsappUrl("Olá! Vim pelo site e gostaria de fazer uma cotação.")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: "rgba(37,211,102,0.12)", borderRadius: 4 }}>
                  <MessageCircle className="w-4 h-4" style={{ color: "#25D366" }} />
                </div>
                <div>
                  <p className="text-[10px] font-bold" style={{ color: "#808080" }}>WHATSAPP</p>
                  <p className="group-hover:text-white transition-colors text-sm" style={{ color: "#BFBFBF" }}>{CONTATO.tel}</p>
                </div>
              </a>
              <a href={`mailto:${CONTATO.email}`} className="flex items-center gap-3 group">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: "rgba(193,39,45,0.15)", borderRadius: 4 }}>
                  <Mail className="w-4 h-4" style={{ color: "#C1272D" }} />
                </div>
                <div>
                  <p className="text-[10px] font-bold" style={{ color: "#808080" }}>E-MAIL</p>
                  <p className="group-hover:text-white transition-colors text-[13px] break-all leading-snug" style={{ color: "#BFBFBF" }}>{CONTATO.email}</p>
                </div>
              </a>
              <a href={CONTATO.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: "rgba(251,146,60,0.12)", borderRadius: 4 }}>
                  <Instagram className="w-4 h-4" style={{ color: "#FB9224" }} />
                </div>
                <div>
                  <p className="text-[10px] font-bold" style={{ color: "#808080" }}>INSTAGRAM</p>
                  <p className="group-hover:text-white transition-colors flex items-center gap-1 text-[13px]" style={{ color: "#BFBFBF" }}>
                    @motormouraequipamentos <ExternalLink className="w-3 h-3" />
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="px-4 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[11px]" style={{ color: "#808080" }}>© 2026 {CONTATO.razao.toUpperCase()} — TODOS OS DIREITOS RESERVADOS</p>
            <a href="https://mirandafaria.com.br" target="_blank" rel="noopener noreferrer" className="text-[11px] flex items-center gap-1.5 transition-colors hover:text-white" style={{ color: "#808080" }}>
              Desenvolvido por <strong style={{ color: "#BFBFBF", fontWeight: 700 }}>Miranda Faria</strong> <Heart className="w-3 h-3" style={{ color: "#C1272D" }} />
            </a>
          </div>
        </div>
      </footer>

      {/* ── WHATSAPP FLUTUANTE ─────────────────────────────────── */}
      <a
        href={whatsappUrl("Olá! Vim pelo site e gostaria de fazer uma cotação.")}
        target="_blank" rel="noopener noreferrer"
        className="mm-float-wa"
        aria-label="Falar no WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>

      {/* ── CART SIDE PANEL ────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-[60] transition-opacity duration-300"
        style={{
          background: "rgba(0,0,0,0.55)",
          opacity: cartOpen ? 1 : 0,
          pointerEvents: cartOpen ? "auto" : "none",
        }}
        onClick={() => setCartOpen(false)}
      />

      <div
        className="fixed top-0 right-0 h-full z-[70] flex flex-col"
        style={{
          width: "min(420px, 100vw)",
          background: "#FFFFFF",
          borderLeft: "1px solid #E5E5E5",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.12)",
          transform: cartOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #E5E5E5" }}>
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" style={{ color: "#C1272D" }} />
            <span className="text-sm font-bold" style={{ color: "#333333" }}>
              LISTA DE COTAÇÃO
            </span>
            {totalItems > 0 && (
              <span className="text-xs px-2 py-0.5 font-bold" style={{ background: "rgba(193,39,45,0.1)", color: "#C1272D", borderRadius: 4 }}>
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-gray-100"
            style={{ color: "#595959", borderRadius: 4 }}
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="h-[3px]" style={{ background: "#C1272D" }} />

        <div className="flex-1 overflow-y-auto py-4 px-5">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="w-12 h-12 mb-3" style={{ color: "#E5E5E5" }} />
              <p className="text-sm font-bold" style={{ color: "#595959" }}>LISTA VAZIA</p>
              <p className="text-xs mt-1" style={{ color: "#808080" }}>
                Adicione peças do catálogo
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.sku_codigo}
                  className="flex items-center gap-3 p-3"
                  style={{ background: "#F9F9F9", border: "1px solid #E5E5E5", borderRadius: 4 }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "#333333" }}>
                      {item.nome_peca}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#808080" }}>
                      SKU: {item.sku_codigo}
                    </p>
                  </div>
                  <div className="flex items-center" style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: 4 }}>
                    <button
                      onClick={() => updateQtd(item.sku_codigo, -1)}
                      className="w-6 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      style={{ color: "#595959" }}
                      aria-label="Diminuir"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center text-xs font-bold" style={{ color: "#333333" }}>
                      {item.quantidade}
                    </span>
                    <button
                      onClick={() => updateQtd(item.sku_codigo, 1)}
                      className="w-6 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      style={{ color: "#595959" }}
                      aria-label="Aumentar"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.sku_codigo)}
                    className="w-7 h-7 flex items-center justify-center hover:bg-red-50 transition-colors"
                    style={{ color: "#808080", borderRadius: 4 }}
                    aria-label="Remover"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="px-5 py-4" style={{ borderTop: "1px solid #E5E5E5" }}>
            <button
              onClick={handleSendWhatsApp}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold"
              style={{ background: "#25D366", color: "#fff", borderRadius: 4 }}
            >
              <MessageCircle className="w-4 h-4" />
              ENVIAR COTAÇÃO NO WHATSAPP
            </button>
            <p className="text-center text-[11px] mt-2" style={{ color: "#808080" }}>
              Resposta média em 15–30 minutos
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

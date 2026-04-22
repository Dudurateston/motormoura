import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Search, ChevronRight, MessageCircle, Shield, Zap, Package, TrendingUp } from "lucide-react";
import { sanitizeSearchQuery } from "@/lib/apiCache";
import SEOHead from "../components/SEOHead";
import HomeCategoryCarousel from "../components/home/HomeCategoryCarousel";
import HomeVitrine from "../components/home/HomeVitrine";
import RecomendacoesFrota from "../components/home/RecomendacoesFrota";
import HeroCarousel from "../components/home/HeroCarousel";
import MarcasSection from "../components/home/MarcasSection";

const HERO_BG = "https://media.base44.com/images/public/69a2232aaedb3f01dfc43e13/92e3f7932_Image231.png";
const PARTS_IMG = "https://media.base44.com/images/public/69a2232aaedb3f01dfc43e13/73d1d5761_BannerCatlogo-MOTORMOURA.png";
const SEAL_IMG = "https://media.base44.com/images/public/69a2232aaedb3f01dfc43e13/73011c8a3_11_Selo_Garantia_Certificacao_MOTORMOURA.png";
import { whatsappUrl } from "@/lib/config";
const WA_LINK = whatsappUrl("Olá, preciso de ajuda técnica!");

// Hook para parallax via scroll
function useParallax(speed = 0.4) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return offset * speed;
}

// Hook para mouse tilt em cards
function useTilt(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14;
      el.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${y}deg) translateZ(6px)`;
    };
    const handleLeave = () => {
      el.style.transform = "perspective(600px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
    };
    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, []);
}

// Card KPI com tilt 3D
function KPICard({ valor, label, color, icon: Icon }) {
  const ref = useRef(null);
  useTilt(ref);
  return (
    <div
      ref={ref}
      className="text-center p-5 relative overflow-hidden cursor-default"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "8px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.3s ease, transform 0.15s ease",
        willChange: "transform"
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.1), 0 0 0 1px ${color}30`}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"}>
      
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      {Icon && <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: `${color}99` }} />}
      <p className="font-bold font-mono-tech mb-1" style={{ color, fontSize: "28px", lineHeight: 1 }}>{valor}</p>
      <p className="text-xs font-mono-tech" style={{ color: "#6C757D", letterSpacing: "0.06em" }}>{label}</p>
    </div>);

}




export default function Home() {
  const [searchText, setSearchText] = useState("");
  const parallaxY = useParallax(0.35);
  const [segment, setSegment] = useState('motores');
  const [typedText, setTypedText] = useState('');
  const [produtosCount, setProdutosCount] = useState(null);
  const [marcasCount, setMarcasCount] = useState(null);
  const typingRef = useRef({ wi: 0, ci: 0, deleting: false });

  const TYPING_SETS = {
    motores: ['sem esperar importação.', 'com garantia de origem.', 'no mesmo dia em Fortaleza.', 'direto do distribuidor.', 'para Honda, Toyama e Tekna.'],
    construcao: ['para Vibromak e Makita.', 'sem parar sua obra.', 'com suporte técnico real.', 'direto do distribuidor.', 'para compactadores e ferramentas.']
  };

  const segTheme = useMemo(() => segment === 'motores' ? {
    accent: '#D32F2F',
    accentA10: 'rgba(211,47,47,0.1)',
    accentA05: 'rgba(211,47,47,0.05)',
    accentA20: 'rgba(211,47,47,0.2)',
    glow: 'rgba(211,47,47,0.12)',
    label: 'MOTORES & MÁQUINAS'
  } : {
    accent: '#1d4ed8',
    accentA10: 'rgba(29,78,216,0.1)',
    accentA05: 'rgba(29,78,216,0.05)',
    accentA20: 'rgba(29,78,216,0.2)',
    glow: 'rgba(29,78,216,0.12)',
    label: 'CONSTRUÇÃO CIVIL'
  }, [segment]);

  const NUMEROS = useMemo(() => [
  {
    valor: produtosCount === null ? '...' : produtosCount > 0 ? `${produtosCount}` : 'NOVO',
    label: 'Produtos no Catálogo',
    color: '#D32F2F',
    icon: Package
  },
  {
    valor: marcasCount === null ? '...' : `${marcasCount}`,
    label: 'Marcas Parceiras',
    color: '#1D4ED8',
    icon: Zap
  },
  { valor: '24h', label: 'Entrega Fortaleza-CE', color: '#16A34A', icon: Shield },
  { valor: 'B2B', label: 'Exclusivo Lojistas', color: '#D32F2F', icon: TrendingUp }],
  [produtosCount, marcasCount]);

  useEffect(() => {
    base44.entities.Produtos.list().then((r) => setProdutosCount(r.length)).catch(() => setProdutosCount(null));
    base44.entities.MarcasCompativeis.list().then((r) => setMarcasCount(r.filter((m) => m.ativa !== false).length)).catch(() => setMarcasCount(null));
  }, []);

  useEffect(() => {
    const words = TYPING_SETS[segment];
    const s = typingRef.current;
    s.wi = 0;s.ci = 0;s.deleting = false;
    setTypedText('');
    let tid;
    function tick() {
      const w = words[s.wi];
      if (!s.deleting) {
        s.ci++;
        setTypedText(w.slice(0, s.ci));
        if (s.ci >= w.length) {s.deleting = true;tid = setTimeout(tick, 1900);return;}
        tid = setTimeout(tick, 85);
      } else {
        s.ci--;
        setTypedText(w.slice(0, s.ci));
        if (s.ci <= 0) {s.wi = (s.wi + 1) % words.length;s.deleting = false;tid = setTimeout(tick, 200);return;}
        tid = setTimeout(tick, 55);
      }
    }
    tid = setTimeout(tick, 400);
    return () => clearTimeout(tid);
  }, [segment]);

  const handleSearch = () => {
    const safe = sanitizeSearchQuery(searchText);
    if (!safe) return;
    window.location.href = createPageUrl("Catalogo") + "?q=" + encodeURIComponent(safe);
  };

  return (
    <>
      <SEOHead
        title="MotorMoura - Distribuidora de Peças para Motores, Geradores e Motobombas | Fortaleza-CE"
        description="Distribuidora técnica B2B especializada em peças de reposição para motores, geradores e motobombas. Mais de 1.000 SKUs em estoque. Importação direta. Fortaleza-CE."
        keywords="peças motor, peças gerador, peças motobomba, distribuidor B2B, importadora peças, Honda, Toyama, Tekna, Fortaleza" />
      

      <div style={{ background: "#F8F9FA" }}>

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section style={{ background: '#07090e', display: 'flex', minHeight: 'clamp(480px, 55vw, 680px)', position: 'relative', overflow: 'hidden' }}>
          {/* Carousel background images */}
          <HeroCarousel />
          {/* Corner marks */}
          <div style={{ position: 'absolute', top: 14, left: 14, width: 22, height: 22, borderTop: `1px solid ${segTheme.accentA20}`, borderLeft: `1px solid ${segTheme.accentA20}`, transition: 'border-color 0.4s', zIndex: 3 }} />
          <div style={{ position: 'absolute', top: 14, right: 14, width: 22, height: 22, borderTop: `1px solid ${segTheme.accentA20}`, borderRight: `1px solid ${segTheme.accentA20}`, transition: 'border-color 0.4s', zIndex: 3 }} />

          {/* MAIN CONTENT */}
          <div style={{ flex: 1, padding: 'clamp(28px, 5vw, 56px) clamp(20px, 5vw, 56px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 2 }}>
            {/* Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.35)', borderRadius: 20, padding: '4px 12px' }}>
                <span style={{ width: 6, height: 6, background: '#22c55e', borderRadius: '50%', display: 'inline-block', animation: 'dotpulse 2s infinite' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#ffffff', letterSpacing: '.1em' }}>DISTRIBUIDOR AUTORIZADO</span>
              </div>
            </div>

            {/* Headline */}
            <h1 style={{ fontSize: 'clamp(26px, 4.5vw, 48px)', fontWeight: 900, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-.01em', marginBottom: 10 }}>
              A peça certa.<br />
              Na hora certa.<br />
              <span style={{ color: segTheme.accent, transition: 'color 0.4s' }}>Para qualquer cliente.</span>
            </h1>

            {/* Typing line */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', minHeight: 30, marginBottom: 18, gap: 4 }}>
              <span style={{ fontSize: 'clamp(13px, 1.6vw, 17px)', color: 'rgba(255,255,255,0.65)', fontWeight: 400 }}>A peça chega&nbsp;</span>
              <span style={{ fontSize: 'clamp(13px, 1.6vw, 17px)', fontWeight: 700, color: '#fff', borderRight: `2px solid ${segTheme.accent}`, paddingRight: 3, minWidth: 2, animation: 'blinkcaret 0.65s step-end infinite', transition: 'border-color 0.4s' }}>{typedText}</span>
            </div>

            {/* Segment toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
              <span style={{ fontSize: 8, color: 'rgba(255,255,255,.25)', letterSpacing: '.12em', fontWeight: 700 }}>SEGMENTO:</span>
              <div style={{ display: 'flex', gap: 3, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 3, padding: 2 }}>
                <button onClick={() => setSegment('motores')} style={{ padding: '4px 10px', fontSize: 8, fontWeight: 700, letterSpacing: '.08em', borderRadius: 2, cursor: 'pointer', color: segment === 'motores' ? '#fff' : 'rgba(255,255,255,.35)', border: 'none', background: segment === 'motores' ? '#D32F2F' : 'transparent', transition: 'all 0.3s' }}>MOTORES &amp; MÁQUINAS</button>
                <button onClick={() => setSegment('construcao')} style={{ padding: '4px 10px', fontSize: 8, fontWeight: 700, letterSpacing: '.08em', borderRadius: 2, cursor: 'pointer', color: segment === 'construcao' ? '#fff' : 'rgba(255,255,255,.35)', border: 'none', background: segment === 'construcao' ? '#1d4ed8' : 'transparent', transition: 'all 0.3s' }}>CONSTRUÇÃO CIVIL</button>
              </div>
            </div>

            {/* Copy */}
            <p style={{ fontSize: 'clamp(12px, 1.4vw, 15px)', color: 'rgba(255,255,255,0.8)', lineHeight: 1.75, marginBottom: 20, maxWidth: 480 }}>
              Distribuidora técnica B2B para lojistas e revendedores.{' '}
              <span style={{ background: 'rgba(239,68,68,.18)', border: '1px solid rgba(239,68,68,.35)', color: '#ffb3b3', padding: '1px 5px', borderRadius: 2, fontSize: 9, fontWeight: 700 }}>Honda</span>{' '}
              motores, geradores e motobombas.{' '}
              <span style={{ background: 'rgba(59,130,246,.18)', border: '1px solid rgba(59,130,246,.35)', color: '#bfd7ff', padding: '1px 5px', borderRadius: 2, fontSize: 9, fontWeight: 700 }}>Vibromak</span>{' '}
              construção civil.{' '}
              <span style={{ background: 'rgba(14,165,233,.18)', border: '1px solid rgba(14,165,233,.35)', color: '#bae6fd', padding: '1px 5px', borderRadius: 2, fontSize: 9, fontWeight: 700 }}>Makita</span>{' '}
              ferramentas profissionais. <strong style={{ color: '#ffffff' }}>Um único fornecedor.</strong>
            </p>

            {/* Search widget */}
            <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)', borderRadius: 6, padding: '14px 16px', marginBottom: 20, maxWidth: 520 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.14em', color: segTheme.accent, marginBottom: 10, transition: 'color 0.4s' }}>LOCALIZAR PEÇA OU EQUIPAMENTO</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value.slice(0, 200))}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder={segment === 'motores' ? 'GX160 · EZ6500 · WB30 · carburador · partida retrátil…' : 'VK-85 · HR2470 · GA7020 · CPV-350 · compactador…'}
                  style={{ flex: 1, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 3, height: 38, padding: '0 12px', fontSize: 12, color: '#fff', outline: 'none' }} />
                
                <button
                  onClick={handleSearch}
                  style={{ background: segTheme.accent, border: 'none', borderRadius: 3, height: 38, padding: '0 18px', fontSize: 11, fontWeight: 700, color: '#fff', cursor: 'pointer', letterSpacing: '.04em', whiteSpace: 'nowrap', transition: 'background 0.4s' }}>
                  BUSCAR →
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <Link to={createPageUrl('Catalogo')}>
                <button style={{ background: segTheme.accent, color: '#fff', border: 'none', borderRadius: 4, padding: '11px 22px', fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: '.06em', display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.4s', boxShadow: `0 4px 14px ${segTheme.accent}55` }}>
                  <ChevronRight style={{ width: 13, height: 13 }} /> VER CATÁLOGO COMPLETO
                </button>
              </Link>
              <Link to={createPageUrl('MinhaConta')}>
                <button style={{ background: 'transparent', color: 'rgba(255,255,255,.75)', border: '1px solid rgba(255,255,255,.22)', borderRadius: 4, padding: '11px 20px', fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: '.06em' }}>
                  QUERO SER LOJISTA
                </button>
              </Link>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button style={{ background: 'linear-gradient(135deg,#25D366,#1DA851)', color: '#fff', border: 'none', borderRadius: 4, padding: '11px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: '.04em', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 14px rgba(37,211,102,0.35)' }}>
                  <MessageCircle style={{ width: 14, height: 14 }} /> WHATSAPP
                </button>
              </a>
            </div>
          </div>

          {/* RIGHT PANEL — 1/3 da largura total */}
          <div style={{ width: 'clamp(280px, 33%, 380px)', flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,.07)', display: 'flex', flexDirection: 'column', zIndex: 2 }} className="mr-8 pb-8 hidden lg:flex">
            {/* Brands */}
            <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.16em', color: 'rgba(255,255,255,.4)', marginBottom: 12 }}>PORTFÓLIO DE MARCAS</div>
              {[
              { name: 'HONDA', tag: 'MOTORES & MÁQUINAS', color: '#ef4444', items: ['GX160', 'GX390', 'EZ6500', 'EU22i', 'WB30'] },
              { name: 'VIBROMAK', tag: 'CONSTRUÇÃO CIVIL', color: '#f97316', items: ['VK-85', 'VMR-75H', 'CPV-350', 'MAV-2400'] },
              { name: 'MAKITA', tag: 'FERRAMENTAS PROF.', color: '#0ea5e9', items: ['GA7020', 'HR2470', 'HM1213C', '5007N'] }].
              map((b) =>
              <div key={b.name} style={{ borderRadius: 4, border: '1px solid rgba(255,255,255,.08)', marginBottom: 7, background: 'rgba(255,255,255,.03)', borderLeft: `3px solid ${b.color}`, padding: '10px 12px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 900, color: '#fff' }}>{b.name}</span>
                    <span style={{ fontSize: 9, color: 'rgba(255,255,255,.45)', letterSpacing: '.06em' }}>{b.tag}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {b.items.map((i) => <span key={i} style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,.55)', background: 'rgba(255,255,255,.07)', padding: '2px 6px', borderRadius: 2 }}>{i}</span>)}
                  </div>
                </div>
              )}
            </div>
            {/* Steps */}
            <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.16em', color: 'rgba(255,255,255,.4)', marginBottom: 12 }}>DO PEDIDO À ENTREGA</div>
              {[
              { n: 1, t: 'Busque pelo SKU, modelo ou equipamento' },
              { n: 2, t: 'Monte o orçamento e envie pelo WhatsApp' },
              { n: 3, t: 'Receba em 24h (CE) ou 48–72h (Brasil)' }].
              map((s, i) =>
              <React.Fragment key={s.n}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '5px 0' }}>
                    <div style={{ width: 20, height: 20, minWidth: 20, background: '#D32F2F', borderRadius: '50%', fontSize: 10, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>{s.n}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,.65)', lineHeight: 1.5 }}>{s.t}</div>
                  </div>
                  {i < 2 && <div style={{ width: 1, height: 8, background: 'rgba(211,47,47,.2)', marginLeft: 9 }} />}
                </React.Fragment>
              )}
            </div>
            {/* KPIs */}
            <div style={{ padding: '12px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {NUMEROS.map((n) =>
              <div key={n.label} style={{ textAlign: 'center', padding: '10px 6px', background: 'rgba(255,255,255,.035)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 4 }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: n.color, fontFamily: 'monospace', lineHeight: 1 }}>{n.valor}</div>
                  <div style={{ fontSize: 8, color: 'rgba(255,255,255,.4)', letterSpacing: '.07em', marginTop: 4, lineHeight: 1.4 }}>{n.label.toUpperCase()}</div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── SEGMENT INDICATOR BAND ── */}
        <div style={{ background: '#0d0d0d', padding: '10px 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `2px solid ${segTheme.accent}55`, transition: 'border-color 0.4s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: segTheme.accent, transition: 'background 0.4s', boxShadow: `0 0 8px ${segTheme.accent}` }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#ffffff', letterSpacing: '.12em', transition: 'color 0.4s' }}>
              VISUALIZANDO: <span style={{ color: segTheme.accent }}>{segTheme.label}</span>
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setSegment('motores')} style={{ padding: '5px 14px', fontSize: 11, fontWeight: 700, borderRadius: 3, cursor: 'pointer', color: segment === 'motores' ? '#fff' : 'rgba(255,255,255,.45)', border: `1px solid ${segment === 'motores' ? '#D32F2F' : 'rgba(255,255,255,.15)'}`, background: segment === 'motores' ? '#D32F2F' : 'transparent', letterSpacing: '.07em', transition: 'all 0.3s' }}>MOTORES</button>
            <button onClick={() => setSegment('construcao')} style={{ padding: '5px 14px', fontSize: 11, fontWeight: 700, borderRadius: 3, cursor: 'pointer', color: segment === 'construcao' ? '#fff' : 'rgba(255,255,255,.45)', border: `1px solid ${segment === 'construcao' ? '#1d4ed8' : 'rgba(255,255,255,.15)'}`, background: segment === 'construcao' ? '#1d4ed8' : 'transparent', letterSpacing: '.07em', transition: 'all 0.3s' }}>CONSTRUÇÃO</button>
          </div>
        </div>

        {/* ── GRADIENT DIVIDER ── */}
        <div style={{ height: "2px", background: "linear-gradient(90deg, #F8F9FA, #E53935 30%, #1D4ED8 70%, #F8F9FA)" }} />

        {/* ── CARROSSEL DE CATEGORIAS ── */}
        <HomeCategoryCarousel segment={segment} />

        {/* ── RECOMENDAÇÕES DA FROTA ── */}
        <RecomendacoesFrota />

        {/* ── VITRINE 1: PEÇAS DE ALTO GIRO ── */}
        <section style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 100%)" }}>
          <HomeVitrine
            title="Peças de Alto Giro"
            emoji="🔥"
            singleTab="Peças de Alto Giro" />
          
        </section>

        {/* ── BANNER CATÁLOGO (imagem peças) ── */}
        <section className="relative overflow-hidden" style={{ background: "#0A0A0C" }}>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${PARTS_IMG})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
              opacity: 0.22
            }} />
          
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(10,10,15,0.7) 0%, rgba(29,78,216,0.15) 100%)" }} />
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #E53935, transparent)" }} />

          <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-5 h-[1px]" style={{ background: "rgba(229,57,53,0.6)" }} />
              <span className="text-xs font-mono-tech tracking-widest" style={{ color: "rgba(229,57,53,0.85)", letterSpacing: "0.2em" }}>PROGRAMA DE REVENDEDORES B2B</span>
              <div className="w-5 h-[1px]" style={{ background: "rgba(229,57,53,0.6)" }} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-mono-tech mb-3" style={{ color: "#FFFFFF" }}>
              Abasteça sua loja com preços de importador.
            </h2>
            <p className="text-sm mb-8 max-w-xl mx-auto" style={{ color: "rgba(156,163,175,0.85)" }}>
              Acesso exclusivo a preços de atacado, catálogo técnico completo e suporte B2B dedicado para lojistas homologados.
            </p>

            {/* Seal + CTA side by side */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <img
                src={SEAL_IMG}
                alt="Peças Originais Garantidas" className="rounded-full w-24 h-24 object-contain"

                style={{ filter: "drop-shadow(0 4px 16px rgba(211,47,47,0.35))", animation: "sealSpin 20s linear infinite" }} />
              
              <Link to={createPageUrl("MinhaConta")}>
                <button
                  className="flex items-center gap-2 px-8 h-12 text-sm font-mono-tech font-bold"
                  style={{
                    background: "linear-gradient(135deg, #E53935, #C62828)",
                    color: "#fff",
                    borderRadius: "6px",
                    border: "none",
                    boxShadow: "0 4px 20px rgba(229,57,53,0.4)",
                    transition: "transform 0.15s, box-shadow 0.2s"
                  }}
                  onMouseEnter={(e) => {e.currentTarget.style.transform = "translateY(-2px)";e.currentTarget.style.boxShadow = "0 8px 28px rgba(229,57,53,0.55)";}}
                  onMouseLeave={(e) => {e.currentTarget.style.transform = "translateY(0)";e.currentTarget.style.boxShadow = "0 4px 20px rgba(229,57,53,0.4)";}}>
                  
                  Criar Conta de Revenda <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── VITRINE 2: EQUIPAMENTOS POR LINHA ── */}
        <section style={{ background: "linear-gradient(180deg, #F8F9FA 0%, #FFFFFF 100%)" }}>
          <HomeVitrine
            title="Equipamentos por Linha"
            segment={segment}
            tabs={["Motores Estacionários", "Geradores", "Motobombas"]} />
          
        </section>

        {/* ── MARCAS ── */}
        <MarcasSection />

        {/* ── CTA FINAL ── */}
        <section className="py-16 px-4" style={{ background: "linear-gradient(180deg, #F8F9FA 0%, #FFFFFF 100%)" }}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold font-mono-tech mb-3" style={{ color: "#212529" }}>
              Não encontrou o que procura?
            </h2>
            <p className="text-sm mb-7" style={{ color: "#6C757D" }}>
              Nossa equipe técnica identifica qualquer peça. Fale agora pelo WhatsApp.
            </p>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
              <button
                className="flex items-center gap-2 mx-auto px-8 h-12 text-sm font-mono-tech font-bold"
                style={{
                  background: "linear-gradient(135deg, #25D366, #1DA851)",
                  color: "#fff",
                  borderRadius: "6px",
                  border: "none",
                  boxShadow: "0 4px 16px rgba(29,185,84,0.3)",
                  transition: "transform 0.15s, box-shadow 0.2s"
                }}
                onMouseEnter={(e) => {e.currentTarget.style.transform = "translateY(-2px)";e.currentTarget.style.boxShadow = "0 8px 24px rgba(29,185,84,0.45)";}}
                onMouseLeave={(e) => {e.currentTarget.style.transform = "translateY(0)";e.currentTarget.style.boxShadow = "0 4px 16px rgba(29,185,84,0.3)";}}>
                
                <MessageCircle className="w-4 h-4" /> Falar com Especialista Técnico
              </button>
            </a>
          </div>
        </section>

      </div>

      <style>{`
        @keyframes sealSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes dotpulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes blinkcaret { 0%, 100% { border-color: inherit; } 50% { border-color: transparent; } }
      `}</style>
    </>);

}
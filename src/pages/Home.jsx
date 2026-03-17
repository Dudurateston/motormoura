import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Search, ChevronRight, MessageCircle, ShieldCheck, Truck, Zap, Package } from "lucide-react";
import SEOHead from "../components/SEOHead";
import HomeCategoryCarousel from "../components/home/HomeCategoryCarousel";
import HomeVitrine from "../components/home/HomeVitrine";
import RecomendacoesFrota from "../components/home/RecomendacoesFrota";

const HERO_BG = "https://media.base44.com/images/public/69a2232aaedb3f01dfc43e13/543e1e799_HeroBackgroundSutilMOTORMOURA.png";
const BANNER_PECAS = "https://media.base44.com/images/public/69a2232aaedb3f01dfc43e13/73d1d5761_BannerCatlogo-MOTORMOURA.png";
const SELO_GARANTIA = "https://media.base44.com/images/public/69a2232aaedb3f01dfc43e13/73011c8a3_11_Selo_Garantia_Certificacao_MOTORMOURA.png";
const WA_LINK = "https://api.whatsapp.com/send?phone=5585986894081&text=Olá,%20preciso%20de%20ajuda%20técnica!";

const NUMEROS = [
  { valor: "+1.000", label: "SKUs em Estoque", color: "#EF4444", icon: Package },
  { valor: "10+", label: "Categorias Técnicas", color: "#3B82F6", icon: Zap },
  { valor: "100%", label: "Suporte B2B", color: "#10B981", icon: ShieldCheck },
  { valor: "CE→BR", label: "Despacho Nacional", color: "#F59E0B", icon: Truck },
];

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = () => {
    if (!searchText.trim()) return;
    window.location.href = createPageUrl("Catalogo") + "?q=" + encodeURIComponent(searchText.trim());
  };

  const parallaxOffset = scrollY * 0.35;

  return (
    <>
      <SEOHead
        title="MotorMoura - Distribuidora de Peças para Motores, Geradores e Motobombas | Fortaleza-CE"
        description="Distribuidora técnica B2B especializada em peças de reposição para motores, geradores e motobombas. Mais de 1.000 SKUs em estoque. Importação direta. Fortaleza-CE."
        keywords="peças motor, peças gerador, peças motobomba, distribuidor B2B, importadora peças, Honda, Toyama, Tekna, Fortaleza"
      />

      <div style={{ background: "#0A0A0C", minHeight: "100vh" }}>

        {/* ══════════════════════════════════════════
            HERO — Imersivo com paralax e profundidade
        ══════════════════════════════════════════ */}
        <section
          ref={heroRef}
          className="relative flex items-center overflow-hidden"
          style={{ minHeight: "100vh", maxHeight: 900 }}
        >
          {/* Paralax background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${HERO_BG})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: `translateY(${parallaxOffset}px) scale(1.1)`,
              willChange: "transform",
            }}
          />

          {/* Gradient overlays — profundidade em camadas */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.92) 0%, rgba(10,10,12,0.75) 50%, rgba(0,0,0,0.88) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(211,47,47,0.12) 0%, transparent 60%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 80% 30%, rgba(29,78,216,0.08) 0%, transparent 50%)" }} />

          {/* Linha superior */}
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #D32F2F 30%, #E53935 50%, #1D4ED8 70%, transparent)" }} />

          {/* Grid lines decorativos — perspectiva */}
          <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="absolute top-0 bottom-0" style={{ left: `${i * 12.5}%`, width: "1px", background: "linear-gradient(180deg, transparent, #E2E8F0, transparent)" }} />
            ))}
          </div>

          {/* Conteúdo */}
          <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 w-full">
            <div className="grid md:grid-cols-2 gap-12 items-center">

              {/* Left — copy */}
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-6 h-[2px]" style={{ background: "#E53935" }} />
                  <span className="text-xs font-mono-tech tracking-[0.2em]" style={{ color: "#E53935" }}>
                    PLATAFORMA B2B · FORTALEZA-CE
                  </span>
                </div>

                <h1 className="font-bold font-mono-tech leading-[1.05] mb-4" style={{ color: "#FFFFFF", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
                  Reposição<br />
                  <span style={{
                    background: "linear-gradient(135deg, #EF4444, #DC2626, #B91C1C)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>
                    Imediata
                  </span>
                  <br />
                  <span style={{ color: "#CBD5E1" }}>para o seu Negócio.</span>
                </h1>

                <p className="text-base mb-8" style={{ color: "#94A3B8", lineHeight: 1.7 }}>
                  Estoque em Fortaleza para despacho rápido em todo o Brasil. Mais de +1.000 SKUs para motores, geradores e motobombas.
                </p>

                {/* Search */}
                <div
                  className="flex gap-2 mb-6 p-1.5"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "6px",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9CA3AF" }} />
                    <input
                      placeholder="Buscar por SKU, nome ou marca…"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="w-full h-11 pl-10 pr-3 text-sm font-mono-tech focus:outline-none bg-transparent"
                      style={{ color: "#FFFFFF" }}
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="px-5 h-11 text-sm font-mono-tech font-bold flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #D32F2F, #B71C1C)",
                      color: "#fff",
                      borderRadius: "4px",
                      border: "none",
                      boxShadow: "0 4px 16px rgba(211,47,47,0.4)",
                    }}
                  >
                    BUSCAR
                  </button>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3">
                  <Link to={createPageUrl("Catalogo")}>
                    <button
                      className="flex items-center gap-2 px-6 h-11 text-sm font-mono-tech font-bold"
                      style={{
                        background: "linear-gradient(135deg, #E53935, #C62828)",
                        color: "#fff",
                        borderRadius: "4px",
                        border: "none",
                        boxShadow: "0 8px 24px rgba(229,57,53,0.35)",
                        transition: "transform 0.2s, box-shadow 0.2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(229,57,53,0.5)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 24px rgba(229,57,53,0.35)"; }}
                    >
                      Ver Catálogo <ChevronRight className="w-4 h-4" />
                    </button>
                  </Link>
                  <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                    <button
                      className="flex items-center gap-2 px-6 h-11 text-sm font-mono-tech"
                      style={{
                        background: "rgba(37,211,102,0.1)",
                        border: "1px solid rgba(37,211,102,0.35)",
                        color: "#4ADE80",
                        borderRadius: "4px",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <MessageCircle className="w-4 h-4" /> Falar com Especialista
                    </button>
                  </a>
                </div>
              </div>

              {/* Right — 3D depth card */}
              <div className="hidden md:flex justify-center items-center">
                <div
                  style={{
                    perspective: "800px",
                    width: 340,
                    height: 400,
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                      transformStyle: "preserve-3d",
                      transform: "rotateY(-12deg) rotateX(4deg)",
                      transition: "transform 0.5s ease",
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = "rotateY(-6deg) rotateX(2deg) scale(1.02)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "rotateY(-12deg) rotateX(4deg)"}
                  >
                    {/* Card principal */}
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        backdropFilter: "blur(12px)",
                        boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)",
                      }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, #E53935, #1D4ED8)" }} />
                      <div className="p-6 h-full flex flex-col justify-between">
                        <div>
                          <p className="text-xs font-mono-tech mb-1" style={{ color: "#E53935", letterSpacing: "0.15em" }}>CATÁLOGO TÉCNICO B2B</p>
                          <p className="text-2xl font-bold font-mono-tech" style={{ color: "#FFFFFF" }}>+1.000 SKUs</p>
                          <p className="text-sm mt-1" style={{ color: "#64748B" }}>em estoque imediato</p>
                        </div>
                        {/* Marcas grid */}
                        <div className="grid grid-cols-3 gap-2">
                          {["HONDA", "TOYAMA", "TEKNA", "BRANCO", "BUFFALO", "HUSQVARNA"].map(m => (
                            <div key={m} className="flex items-center justify-center py-1.5 px-2 text-[10px] font-mono-tech"
                              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "3px", color: "#94A3B8" }}>
                              {m}
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#4ADE80" }} />
                          <span className="text-xs font-mono-tech" style={{ color: "#4ADE80" }}>ESTOQUE DISPONÍVEL</span>
                        </div>
                      </div>
                    </div>
                    {/* Sombra 3D traseira */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(135deg, #D32F2F22, #1D4ED822)",
                        borderRadius: "12px",
                        transform: "translateZ(-30px) translateX(12px) translateY(12px)",
                        filter: "blur(16px)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transição suave para próxima seção */}
          <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, #0A0A0C)" }} />

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
            <div className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5" style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
              <div className="w-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.5)" }} />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            KPIs — dark glass cards com glow
        ══════════════════════════════════════════ */}
        <section style={{ background: "linear-gradient(180deg, #0A0A0C 0%, #0F1117 100%)" }}>
          <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {NUMEROS.map((n) => {
              const Icon = n.icon;
              return (
                <div key={n.label} className="relative overflow-hidden p-5 flex flex-col items-center text-center group"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "8px",
                    transition: "transform 0.3s, box-shadow 0.3s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 16px 40px ${n.color}22`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${n.color}, transparent)` }} />
                  <Icon className="w-5 h-5 mb-2 opacity-60" style={{ color: n.color }} />
                  <p className="font-bold font-mono-tech mb-1" style={{ color: n.color, fontSize: "clamp(1.4rem, 3vw, 2rem)", lineHeight: 1 }}>{n.valor}</p>
                  <p className="text-xs font-mono-tech" style={{ color: "#64748B", letterSpacing: "0.05em" }}>{n.label}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CATEGORIAS CAROUSEL
        ══════════════════════════════════════════ */}
        <section style={{ background: "linear-gradient(180deg, #0F1117 0%, #111827 100%)" }}>
          <HomeCategoryCarousel />
        </section>

        {/* ══════════════════════════════════════════
            BANNER CATÁLOGO — Imagem das peças em perspectiva
        ══════════════════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ background: "#111827" }}>
          <div className="max-w-7xl mx-auto px-4 py-10">
            <div
              className="relative overflow-hidden"
              style={{
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
              }}
            >
              {/* Imagem com perspectiva */}
              <div className="relative h-[280px] md:h-[380px]">
                <img
                  src={BANNER_PECAS}
                  alt="Catálogo de Peças MotorMoura"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: "center 30%" }}
                />
                {/* Overlay gradiente para integrar */}
                <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(10,10,12,0.92) 0%, rgba(10,10,12,0.5) 50%, rgba(10,10,12,0.2) 100%)" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,12,0.8) 0%, transparent 40%)" }} />

                {/* Conteúdo sobre a imagem */}
                <div className="absolute inset-0 flex items-center">
                  <div className="px-8 md:px-14 max-w-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-4 h-[2px]" style={{ background: "#E53935" }} />
                      <span className="text-xs font-mono-tech tracking-widest" style={{ color: "#E53935" }}>PORTFÓLIO COMPLETO</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold font-mono-tech mb-3" style={{ color: "#FFFFFF" }}>
                      Peças para toda<br />sua operação.
                    </h2>
                    <p className="text-sm mb-5" style={{ color: "#94A3B8" }}>
                      Filtros, carburadores, kits de reparo, juntas, anéis e muito mais. Compatibilidade garantida com as principais marcas do mercado.
                    </p>
                    <Link to={createPageUrl("Catalogo")}>
                      <button
                        className="flex items-center gap-2 px-6 h-11 text-sm font-mono-tech font-bold"
                        style={{
                          background: "linear-gradient(135deg, #E53935, #C62828)",
                          color: "#fff",
                          borderRadius: "4px",
                          border: "none",
                          boxShadow: "0 8px 24px rgba(229,57,53,0.4)",
                        }}
                      >
                        Explorar Catálogo <ChevronRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Transição */}
          <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, #0D1117)" }} />
        </section>

        {/* ══════════════════════════════════════════
            RECOMENDAÇÕES DA FROTA
        ══════════════════════════════════════════ */}
        <section style={{ background: "linear-gradient(180deg, #0D1117 0%, #111827 100%)" }}>
          <RecomendacoesFrota />
        </section>

        {/* ══════════════════════════════════════════
            VITRINE: PEÇAS DE ALTO GIRO
        ══════════════════════════════════════════ */}
        <section style={{ background: "#111827" }}>
          <HomeVitrine
            title="Peças de Alto Giro"
            emoji="🔥"
            singleTab="Peças de Alto Giro"
          />
        </section>

        {/* ══════════════════════════════════════════
            B2B CTA — dark + garantia selo
        ══════════════════════════════════════════ */}
        <section className="relative overflow-hidden py-16 px-4" style={{ background: "#0A0A0C" }}>
          {/* BG glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(211,47,47,0.12) 0%, transparent 70%)", borderRadius: "50%" }} />
            <div style={{ position: "absolute", top: "20%", right: "10%", width: 300, height: 300, background: "radial-gradient(ellipse, rgba(29,78,216,0.08) 0%, transparent 70%)", borderRadius: "50%" }} />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                  <div className="w-5 h-[2px]" style={{ background: "#E53935" }} />
                  <span className="text-xs font-mono-tech tracking-widest" style={{ color: "#E53935" }}>PROGRAMA DE REVENDEDORES B2B</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-mono-tech mb-3" style={{ color: "#FFFFFF" }}>
                  Abasteça sua loja com preços de importador.
                </h2>
                <p className="text-sm mb-6" style={{ color: "#64748B" }}>
                  Acesso exclusivo a preços de atacado, catálogo técnico completo e suporte B2B dedicado para lojistas homologados.
                </p>
                <Link to={createPageUrl("MinhaConta")}>
                  <button
                    className="flex items-center gap-2 mx-auto md:mx-0 px-8 h-12 text-sm font-mono-tech font-bold"
                    style={{
                      background: "linear-gradient(135deg, #E53935, #C62828)",
                      color: "#fff",
                      borderRadius: "4px",
                      border: "none",
                      boxShadow: "0 8px 32px rgba(229,57,53,0.35)",
                    }}
                  >
                    Criar Conta de Revenda <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>

              {/* Selo de garantia */}
              <div className="flex justify-center">
                <div className="relative" style={{ width: 220, height: 220 }}>
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "radial-gradient(circle, rgba(211,47,47,0.15) 0%, transparent 70%)",
                      filter: "blur(20px)",
                    }}
                  />
                  <img
                    src={SELO_GARANTIA}
                    alt="Peças Originais Garantidas"
                    className="relative z-10 w-full h-full object-contain"
                    style={{
                      filter: "drop-shadow(0 8px 24px rgba(211,47,47,0.3))",
                      animation: "spinSlow 25s linear infinite",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            VITRINE: EQUIPAMENTOS POR LINHA
        ══════════════════════════════════════════ */}
        <section style={{ background: "linear-gradient(180deg, #0A0A0C 0%, #111827 100%)" }}>
          <HomeVitrine
            title="Equipamentos por Linha"
            tabs={["Motores Estacionários", "Geradores", "Motobombas"]}
          />
        </section>

        {/* ══════════════════════════════════════════
            MARCAS — glass cards
        ══════════════════════════════════════════ */}
        <section style={{ background: "#111827", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="max-w-5xl mx-auto px-4 py-10">
            <p className="text-center text-xs font-mono-tech mb-6" style={{ color: "#475569", letterSpacing: "0.2em" }}>
              PORTFÓLIO MULTIMARCAS — COMPATIBILIDADE GARANTIDA
            </p>
            <div className="flex items-center justify-center flex-wrap gap-3">
              {[
                { nome: "HONDA", color: "#E53935" },
                { nome: "TOYAMA", color: "#3B82F6" },
                { nome: "TEKNA", color: "#10B981" },
                { nome: "BRANCO", color: "#F59E0B" },
                { nome: "BUFFALO", color: "#8B5CF6" },
                { nome: "HUSQVARNA", color: "#E53935" },
              ].map(({ nome, color }) => (
                <div key={nome} className="px-5 py-2.5 font-bold font-mono-tech text-xs relative overflow-hidden group"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#94A3B8",
                    borderRadius: "4px",
                    letterSpacing: "0.12em",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `${color}18`;
                    e.currentTarget.style.borderColor = `${color}44`;
                    e.currentTarget.style.color = color;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color = "#94A3B8";
                  }}
                >
                  {nome}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CTA FINAL
        ══════════════════════════════════════════ */}
        <section className="relative py-20 px-4 overflow-hidden" style={{ background: "linear-gradient(135deg, #0A0A0C 0%, #0F172A 50%, #0A0A0C 100%)" }}>
          <div className="absolute inset-0 pointer-events-none">
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200, background: "linear-gradient(to top, rgba(29,78,216,0.06), transparent)" }} />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold font-mono-tech mb-3" style={{ color: "#FFFFFF" }}>
              Não encontrou o que procura?
            </h2>
            <p className="text-sm mb-6" style={{ color: "#64748B" }}>
              Nossa equipe técnica identifica qualquer peça. Fale agora pelo WhatsApp.
            </p>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
              <button
                className="flex items-center gap-2 mx-auto px-8 h-12 text-sm font-mono-tech font-bold"
                style={{
                  background: "linear-gradient(135deg, #25D366, #1DA851)",
                  color: "#fff",
                  borderRadius: "4px",
                  border: "none",
                  boxShadow: "0 8px 24px rgba(37,211,102,0.3)",
                }}
              >
                <MessageCircle className="w-4 h-4" /> Falar com Especialista Técnico
              </button>
            </a>
          </div>
        </section>

      </div>
    </>
  );
}
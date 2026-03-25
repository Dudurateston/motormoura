import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Search, ChevronRight, MessageCircle, Shield, Zap, Package, TrendingUp } from "lucide-react";
import { sanitizeSearchQuery } from "@/lib/apiCache";
import { whatsappUrl } from "@/lib/config";
import SEOHead from "../components/SEOHead";
import HomeCategoryCarousel from "../components/home/HomeCategoryCarousel";
import HomeVitrine from "../components/home/HomeVitrine";
import RecomendacoesFrota from "../components/home/RecomendacoesFrota";

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

const NUMEROS = [
{ valor: "+1.000", label: "SKUs em Estoque", color: "#D32F2F", icon: Package },
{ valor: "10+", label: "Categorias Técnicas", color: "#1D4ED8", icon: Zap },
{ valor: "100%", label: "Suporte B2B", color: "#16A34A", icon: Shield },
{ valor: "CE→BR", label: "Despacho Nacional", color: "#D32F2F", icon: TrendingUp }];


export default function Home() {
  const [searchText, setSearchText] = useState("");
  const parallaxY = useParallax(0.35);

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
        <section className="relative flex items-center min-h-[560px] md:min-h-[620px] overflow-hidden">
          {/* Parallax background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${HERO_BG})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: `translateY(${parallaxY}px)`,
              willChange: "transform",
              top: "-60px",
              bottom: "-60px"
            }} />
          

        

          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(90deg, #1D4ED8, #E53935, #1D4ED8)" }} />

          {/* Subtle bottom fade to white */}
          <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: "linear-gradient(to bottom, transparent, rgba(248,249,250,0.35))" }} />

          <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 w-full text-center">
            <div className="flex items-center justify-center gap-2 mb-5">
              <div className="w-8 h-[1px]" style={{ background: "rgba(229,57,53,0.7)" }} />
              <span className="text-xs font-mono-tech tracking-widest" style={{ color: "rgba(229,57,53,0.9)", letterSpacing: "0.18em" }}>
                PLATAFORMA B2B · FORTALEZA-CE
              </span>
              <div className="w-8 h-[1px]" style={{ background: "rgba(229,57,53,0.7)" }} />
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold font-mono-tech mb-4 leading-tight"
              style={{ color: "#FFFFFF", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
              
              Reposição Imediata para<br />
              <span style={{
                background: "linear-gradient(135deg, #EF5350, #E53935, #C62828)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                o seu Negócio.
              </span>
            </h1>

            <p className="text-base md:text-lg mb-10 max-w-xl mx-auto" style={{ color: "rgba(203,213,225,0.85)" }}>
              Estoque em Fortaleza para abastecimento rápido em todo o Norte e Nordete.
            </p>

            {/* Search bar — glassmorphism */}
            <div
              className="flex gap-2 max-w-xl mx-auto mb-7 p-2"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: "8px",
                backdropFilter: "blur(12px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)"
              }}>
              
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9CA3AF" }} />
                <input
                  placeholder="Buscar por SKU, nome ou marca…"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value.slice(0, 200))}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full h-11 pl-10 pr-3 text-sm font-mono-tech focus:outline-none bg-transparent"
                  style={{ color: "#FFFFFF" }} />
                
              </div>
              <button
                onClick={handleSearch}
                className="px-6 h-11 text-sm font-mono-tech font-bold flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #E53935, #C62828)",
                  color: "#fff",
                  borderRadius: "6px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(229,57,53,0.4)",
                  transition: "box-shadow 0.2s, transform 0.1s"
                }}
                onMouseEnter={(e) => {e.currentTarget.style.boxShadow = "0 6px 20px rgba(229,57,53,0.55)";e.currentTarget.style.transform = "translateY(-1px)";}}
                onMouseLeave={(e) => {e.currentTarget.style.boxShadow = "0 4px 12px rgba(229,57,53,0.4)";e.currentTarget.style.transform = "translateY(0)";}}>
                
                BUSCAR
              </button>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to={createPageUrl("Catalogo")}>
                <button
                  className="flex items-center gap-2 px-7 h-12 text-sm font-mono-tech font-bold"
                  style={{
                    background: "linear-gradient(135deg, #E53935, #C62828)",
                    color: "#fff",
                    borderRadius: "6px",
                    border: "none",
                    boxShadow: "0 4px 20px rgba(229,57,53,0.35)",
                    transition: "transform 0.15s, box-shadow 0.2s"
                  }}
                  onMouseEnter={(e) => {e.currentTarget.style.transform = "translateY(-2px)";e.currentTarget.style.boxShadow = "0 8px 28px rgba(229,57,53,0.5)";}}
                  onMouseLeave={(e) => {e.currentTarget.style.transform = "translateY(0)";e.currentTarget.style.boxShadow = "0 4px 20px rgba(229,57,53,0.35)";}}>
                  
                  Ver Catálogo Completo <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                <button
                  className="flex items-center gap-2 px-7 h-12 text-sm font-mono-tech"
                  style={{
                    background: "rgba(37,211,102,0.12)",
                    border: "1px solid rgba(37,211,102,0.35)",
                    color: "#4ADE80",
                    borderRadius: "6px",
                    backdropFilter: "blur(8px)",
                    transition: "background 0.2s, transform 0.15s"
                  }}
                  onMouseEnter={(e) => {e.currentTarget.style.background = "rgba(37,211,102,0.2)";e.currentTarget.style.transform = "translateY(-1px)";}}
                  onMouseLeave={(e) => {e.currentTarget.style.background = "rgba(37,211,102,0.12)";e.currentTarget.style.transform = "translateY(0)";}}>
                  
                  <MessageCircle className="w-4 h-4" /> Falar com Especialista
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* ── GRADIENT DIVIDER ── */}
        <div style={{ height: "2px", background: "linear-gradient(90deg, #F8F9FA, #E53935 30%, #1D4ED8 70%, #F8F9FA)" }} />

        {/* ── KPI STRIP ── */}
        <section style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 100%)", borderBottom: "1px solid #E2E8F0" }}>
          <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {NUMEROS.map((n) =>
            <KPICard key={n.label} {...n} />
            )}
          </div>
        </section>

        {/* ── CARROSSEL DE CATEGORIAS ── */}
        <section style={{ background: "#F8F9FA" }}>
          <HomeCategoryCarousel />
        </section>

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
            tabs={["Motores Estacionários", "Geradores", "Motobombas"]} />
          
        </section>

        {/* ── MARCAS ── */}
        <section style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 100%)",
          borderTop: "1px solid #E2E8F0",
          borderBottom: "1px solid #E2E8F0"
        }}>
          <div className="max-w-5xl mx-auto px-4 py-10">
            <p className="text-center text-xs font-mono-tech mb-6" style={{ color: "#9CA3AF", letterSpacing: "0.2em" }}>
              PORTFÓLIO MULTIMARCAS — COMPATIBILIDADE GARANTIDA
            </p>
            <div className="flex items-center justify-center flex-wrap gap-3">
              {["HONDA", "TOYAMA", "TEKNA", "MAKITA", "BUFFALO", "VIBROMAK"].map((marca) =>
              <div
                key={marca}
                className="px-5 py-2 font-bold font-mono-tech text-xs cursor-default"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  color: "#6C757D",
                  borderRadius: "4px",
                  letterSpacing: "0.12em",
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(211,47,47,0.35)";
                  e.currentTarget.style.color = "#D32F2F";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(211,47,47,0.12)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#E2E8F0";
                  e.currentTarget.style.color = "#6C757D";
                  e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}>
                
                  {marca}
                </div>
              )}
            </div>
          </div>
        </section>

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
      `}</style>
    </>);

}
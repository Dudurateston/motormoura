import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Search, ChevronRight, MessageCircle } from "lucide-react";
import SEOHead from "../components/SEOHead";
import HomeCategoryCarousel from "../components/home/HomeCategoryCarousel";
import HomeVitrine from "../components/home/HomeVitrine";

const HERO_BG = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a2232aaedb3f01dfc43e13/dc4446f88_BackgroundPatternIndustrial-MOTORMOURA.png";
const WA_LINK = "https://api.whatsapp.com/send?phone=5585986894081&text=Olá,%20preciso%20de%20ajuda%20técnica!";

const NUMEROS = [
  { valor: "+1.000", label: "SKUs em Estoque", color: "#D32F2F" },
  { valor: "10+", label: "Categorias Técnicas", color: "#1D4ED8" },
  { valor: "100%", label: "Suporte B2B", color: "#16A34A" },
  { valor: "CE→BR", label: "Despacho Nacional", color: "#D32F2F" },
];

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [marcas, setMarcas] = useState([]);

  useEffect(() => {
    base44.entities.MarcasCompativeis.list("nome").then(setMarcas).catch(() => {});
  }, []);

  const handleSearch = () => {
    if (!searchText.trim()) return;
    window.location.href = createPageUrl("Catalogo") + "?q=" + encodeURIComponent(searchText.trim());
  };

  return (
    <>
      <SEOHead
        title="MotorMoura - Distribuidora de Peças para Motores, Geradores e Motobombas | Fortaleza-CE"
        description="Distribuidora técnica B2B especializada em peças de reposição para motores, geradores e motobombas. Mais de 1.000 SKUs em estoque. Importação direta. Fortaleza-CE."
        keywords="peças motor, peças gerador, peças motobomba, distribuidor B2B, importadora peças, Honda, Toyama, Tekna, Fortaleza"
      />

      <div style={{ background: "#F8F9FA", minHeight: "100vh" }}>

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section
          className="relative flex items-center min-h-[480px] md:min-h-[540px] overflow-hidden"
          style={{
            backgroundImage: `url(${HERO_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0" style={{ background: "rgba(10,10,12,0.80)" }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(90deg, #1D4ED8, #E53935, #1D4ED8)" }} />

          <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 w-full text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-6 h-[2px]" style={{ background: "#E53935" }} />
              <span className="text-xs font-mono-tech tracking-widest" style={{ color: "#E53935" }}>
                PLATAFORMA B2B · FORTALEZA-CE
              </span>
              <div className="w-6 h-[2px]" style={{ background: "#E53935" }} />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-mono-tech mb-3 leading-tight" style={{ color: "#FFFFFF" }}>
              Reposição Imediata para<br />
              <span style={{ color: "#E53935" }}>o seu Negócio.</span>
            </h1>
            <p className="text-base md:text-lg mb-8 max-w-xl mx-auto" style={{ color: "#CBD5E1" }}>
              Estoque em Fortaleza para despacho rápido em todo o Brasil.
            </p>

            {/* Search bar */}
            <div
              className="flex gap-2 max-w-xl mx-auto mb-6 p-2"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "4px" }}
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
                className="px-6 h-11 text-sm font-mono-tech font-bold mm-btn-tactile flex-shrink-0"
                style={{ background: "#D32F2F", color: "#fff", borderRadius: "2px", border: "none" }}
              >
                BUSCAR
              </button>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to={createPageUrl("Catalogo")}>
                <button
                  className="flex items-center gap-2 px-6 h-11 text-sm font-mono-tech font-bold mm-btn-tactile"
                  style={{ background: "linear-gradient(135deg, #E53935, #C62828)", color: "#fff", borderRadius: "2px", border: "none" }}
                >
                  Ver Catálogo Completo <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                <button
                  className="flex items-center gap-2 px-6 h-11 text-sm font-mono-tech mm-btn-tactile"
                  style={{ background: "rgba(37,211,102,0.15)", border: "1px solid rgba(37,211,102,0.4)", color: "#4ADE80", borderRadius: "2px" }}
                >
                  <MessageCircle className="w-4 h-4" /> Falar com Especialista
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* ── NÚMEROS DE AUTORIDADE ── */}
        <section style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0" }}>
          <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {NUMEROS.map((n) => (
              <div key={n.label} className="text-center p-4 relative overflow-hidden" style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${n.color}, transparent)` }} />
                <p className="font-bold font-mono-tech mb-1" style={{ color: n.color, fontSize: "28px", lineHeight: 1 }}>{n.valor}</p>
                <p className="text-xs font-mono-tech" style={{ color: "#6C757D", letterSpacing: "0.06em" }}>{n.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CARROSSEL DE CATEGORIAS CIRCULARES ── */}
        <HomeCategoryCarousel />

        {/* ── VITRINE 1: PEÇAS DE ALTO GIRO ── */}
        <HomeVitrine
          title="Peças de Alto Giro"
          emoji="🔥"
          singleTab="Peças de Alto Giro"
        />

        {/* ── SPEED BUMP: CAPTAÇÃO B2B ── */}
        <section style={{ background: "#212529" }} className="py-12 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-5 h-[2px]" style={{ background: "#E53935" }} />
              <span className="text-xs font-mono-tech tracking-widest" style={{ color: "#E53935" }}>PROGRAMA DE REVENDEDORES B2B</span>
              <div className="w-5 h-[2px]" style={{ background: "#E53935" }} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-mono-tech mb-3" style={{ color: "#FFFFFF" }}>
              Abasteça sua loja com preços de importador.
            </h2>
            <p className="text-sm mb-6 max-w-xl mx-auto" style={{ color: "#9CA3AF" }}>
              Acesso exclusivo a preços de atacado, catálogo técnico completo e suporte B2B dedicado para lojistas homologados.
            </p>
            <Link to={createPageUrl("MinhaConta")}>
              <button
                className="flex items-center gap-2 mx-auto px-8 h-12 text-sm font-mono-tech font-bold mm-btn-tactile"
                style={{ background: "linear-gradient(135deg, #E53935, #C62828)", color: "#fff", borderRadius: "2px", border: "none", boxShadow: "0 4px 20px rgba(229,57,53,0.3)" }}
              >
                Criar Conta de Revenda <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </section>

        {/* ── VITRINE 2: EQUIPAMENTOS POR ABA ── */}
        <HomeVitrine
          title="Equipamentos por Linha"
          tabs={["Motores Estacionários", "Geradores", "Motobombas"]}
        />

        {/* ── MARCAS ── */}
        <section style={{ background: "#FFFFFF", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
          <div className="max-w-5xl mx-auto px-4 py-8">
            <p className="text-center text-xs font-mono-tech mb-5" style={{ color: "#9CA3AF", letterSpacing: "0.2em" }}>
              PORTFÓLIO MULTIMARCAS — COMPATIBILIDADE GARANTIDA
            </p>
            <div className="flex items-center justify-center flex-wrap gap-3">
              {["HONDA", "TOYAMA", "TEKNA", "BRANCO", "BUFFALO", "HUSQVARNA"].map((marca) => (
                <div key={marca} className="px-5 py-2 font-bold font-mono-tech text-xs" style={{
                  background: "#F8F9FA", border: "1px solid #E2E8F0",
                  color: "#6C757D", borderRadius: "2px", letterSpacing: "0.12em"
                }}>
                  {marca}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="py-16 px-4" style={{ background: "#F8F9FA" }}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold font-mono-tech mb-3" style={{ color: "#212529" }}>
              Não encontrou o que procura?
            </h2>
            <p className="text-sm mb-6" style={{ color: "#6C757D" }}>
              Nossa equipe técnica identifica qualquer peça. Fale agora pelo WhatsApp.
            </p>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
              <button
                className="flex items-center gap-2 mx-auto px-8 h-12 text-sm font-mono-tech font-bold mm-btn-tactile"
                style={{ background: "linear-gradient(135deg, #25D366, #1DA851)", color: "#fff", borderRadius: "2px", border: "none" }}
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
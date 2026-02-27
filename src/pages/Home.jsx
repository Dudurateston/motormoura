import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Search, ChevronRight, ArrowRight, Cpu, Shield, Truck } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import HeroPiston from "../components/home/HeroPiston";
import CategoryCard from "../components/home/CategoryCard";
import KitsCarousel from "../components/home/KitsCarousel";
import ComoSerLojista from "../components/home/ComoSerLojista";

export default function Home() {
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    base44.entities.MarcasCompativeis.list("nome").then(setMarcas);
    base44.entities.Categorias.list("nome").then(setCategorias);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedMarca && selectedMarca !== "all") params.set("marca", selectedMarca);
    if (selectedCategoria && selectedCategoria !== "all") params.set("categoria", selectedCategoria);
    if (searchText) params.set("q", searchText);
    window.location.href = createPageUrl("Catalogo") + "?" + params.toString();
  };

  return (
    <div className="mm-bg min-h-screen">

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden mm-scanlines"
        style={{
          background: "linear-gradient(145deg, #0F0F11 0%, #1A1A1F 50%, #0F0F11 100%)",
          minHeight: "90vh",
        }}
      >
        {/* Grid blueprint background */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(29,78,216,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(29,78,216,0.8) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Radial glow center */}
        <div
          className="absolute"
          style={{
            right: "10%",
            top: "50%",
            transform: "translateY(-50%)",
            width: 400,
            height: 400,
            background: "radial-gradient(ellipse, rgba(29,78,216,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center" style={{ zIndex: 2 }}>
          {/* Left: Copy */}
          <div>
            <div
              className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 text-xs font-mono-tech"
              style={{
                background: "rgba(29,78,216,0.1)",
                border: "1px solid rgba(29,78,216,0.3)",
                color: "#60A5FA",
                borderRadius: "2px",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] mm-data-blink inline-block" />
              PLATAFORMA B2B · SISTEMA ATIVO
            </div>

            <h1 className="mb-4 leading-tight" style={{ fontFamily: "'Space Mono', monospace" }}>
              <span className="block text-4xl md:text-5xl font-bold mm-text-metal">
                ESPECIALISTAS
              </span>
              <span className="block text-4xl md:text-5xl font-bold mm-text-metal">
                EM EQUIPAMENTOS
              </span>
              <span className="block text-3xl md:text-4xl font-bold mm-text-orange mt-1">
                QUE TRABALHAM
              </span>
              <span className="block text-3xl md:text-4xl font-bold mm-text-orange">
                COM VOCÊ.
              </span>
            </h1>

            <p className="mb-8 text-base" style={{ color: "#6B7280", maxWidth: 440, lineHeight: 1.7 }}>
              Distribuidora técnica de peças de reposição para motores, geradores e motobombas.
              Catálogo B2B completo, cotação direta via WhatsApp.
            </p>

            {/* ── ASSISTENTE DE REPOSIÇÃO ────────────────────── */}
            <div
              className="p-4 mb-6"
              style={{
                background: "rgba(27,27,31,0.9)",
                border: "1px solid rgba(29,78,216,0.35)",
                borderRadius: "4px",
                clipPath: "polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)",
                boxShadow: "0 0 30px rgba(29,78,216,0.1), inset 0 1px 0 rgba(29,78,216,0.2)",
              }}
            >
              <div
                className="flex items-center gap-2 mb-3 pb-2"
                style={{ borderBottom: "1px solid rgba(29,78,216,0.2)" }}
              >
                <Cpu className="w-3.5 h-3.5" style={{ color: "#1D4ED8" }} />
                <span className="text-xs font-mono-tech" style={{ color: "#60A5FA", letterSpacing: "0.1em" }}>
                  ASSISTENTE DE REPOSIÇÃO v2.0
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                <Select value={selectedMarca} onValueChange={setSelectedMarca}>
                  <SelectTrigger
                    className="h-10 text-sm font-mono-tech"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(29,78,216,0.3)",
                      color: "#9CA3AF",
                      borderRadius: "2px",
                    }}
                  >
                    <SelectValue placeholder="[ MARCA ]" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as marcas</SelectItem>
                    {marcas.map((m) => <SelectItem key={m.id} value={m.nome}>{m.nome}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
                  <SelectTrigger
                    className="h-10 text-sm font-mono-tech"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(29,78,216,0.3)",
                      color: "#9CA3AF",
                      borderRadius: "2px",
                    }}
                  >
                    <SelectValue placeholder="[ CATEGORIA ]" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categorias.map((c) => <SelectItem key={c.id} value={c.nome}>{c.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#1D4ED8" }} />
                  <input
                    placeholder="SKU ou nome da peça..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="w-full h-10 pl-9 pr-3 text-sm font-mono-tech focus:outline-none"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(29,78,216,0.3)",
                      borderRadius: "2px",
                      color: "#E5E7EB",
                    }}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="mm-btn-tactile flex items-center gap-2 px-5 h-10 font-semibold text-sm font-mono-tech"
                  style={{
                    background: "linear-gradient(135deg, #FB923C, #EA7C28)",
                    color: "#fff",
                    borderRadius: "2px",
                    boxShadow: "0 4px 16px rgba(251,146,60,0.3)",
                    border: "none",
                  }}
                >
                  <Search className="w-4 h-4" />
                  BUSCAR
                </button>
              </div>
            </div>

            <Link to={createPageUrl("Catalogo")}>
              <button
                className="mm-btn-tactile flex items-center gap-2 px-6 h-11 font-semibold text-sm"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(251,146,60,0.4)",
                  color: "#FB923C",
                  borderRadius: "2px",
                }}
              >
                VER CATÁLOGO COMPLETO <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* Right: Animated Piston */}
          <div className="hidden md:block relative" style={{ height: 380 }}>
            <HeroPiston />
          </div>
        </div>
      </section>

      {/* ── LINHAS DE REPOSIÇÃO ─────────────────────────────────── */}
      <section className="py-16 px-4" style={{ background: "#1A1A1F" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-[2px]" style={{ background: "#FB923C" }} />
                <span className="text-xs font-mono-tech" style={{ color: "#FB923C", letterSpacing: "0.15em" }}>
                  SEGMENTOS TÉCNICOS
                </span>
              </div>
              <h2 className="text-2xl font-bold font-mono-tech" style={{ color: "#F3F4F6" }}>
                Nossas Linhas de Reposição
              </h2>
              <p className="mt-1" style={{ color: "#9CA3AF", fontSize: "16px", fontWeight: 400 }}>
                Clique em uma linha para ver as peças disponíveis no catálogo.
              </p>
            </div>
            <Link to={createPageUrl("Catalogo")}>
              <button
                className="hidden md:flex items-center gap-2 px-4 h-9 text-sm font-mono-tech mm-btn-tactile"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#6B7280",
                  borderRadius: "2px",
                }}
              >
                Todo o catálogo <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              "Motores a Gasolina",
              "Motores a Diesel",
              "Motobombas 4 Tempos",
              "Geradores 4 Tempos",
              "Geradores 2 Tempos",
              "Bombas de Pulverização",
            ].map((nome) => {
              const cat = categorias.find(c => c.nome === nome) || { id: nome, nome };
              return <CategoryCard key={cat.id} categoria={cat} />;
            })}
          </div>
        </div>
      </section>

      {/* ── KITS ALTO GIRO ──────────────────────────────────────── */}
      <KitsCarousel />

      {/* ── COMO SER LOJISTA ────────────────────────────────────── */}
      <ComoSerLojista />

      {/* ── FEATURES BAR ────────────────────────────────────────── */}
      <section
        className="py-14 px-4"
        style={{
          background: "linear-gradient(145deg, #27272C, #1F1F23)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { Icon: Shield, title: "QUALIDADE CERTIFICADA", desc: "Peças white-label com qualidade testada e garantia de compatibilidade para cada aplicação.", color: "#1D4ED8" },
            { Icon: Truck, title: "LOGÍSTICA NACIONAL", desc: "Distribuição para todo o Brasil com rastreamento em tempo real e prazos garantidos.", color: "#FB923C" },
            { Icon: Cpu, title: "SUPORTE TÉCNICO", desc: "Nossa equipa especializada identifica a peça exata para cada motor, gerador ou motobomba.", color: "#4ADE80" },
          ].map((f) => (
            <div
              key={f.title}
              className="p-5 relative"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "4px",
              }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center mb-4"
                style={{
                  background: `${f.color}15`,
                  border: `1px solid ${f.color}40`,
                  borderRadius: "2px",
                }}
              >
                <f.Icon className="w-5 h-5" style={{ color: f.color }} />
              </div>
              <h3 className="font-bold text-sm mb-2 font-mono-tech" style={{ color: "#E5E7EB" }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── B2B CTA ─────────────────────────────────────────────── */}
      <section
        className="py-16 px-4 relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #0F0F11, #1A1A1F)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(29,78,216,0.03) 20px, rgba(29,78,216,0.03) 21px)",
          }}
        />
        <div className="relative max-w-2xl mx-auto text-center" style={{ zIndex: 2 }}>
          <h2
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{ fontFamily: "'Space Mono', monospace", color: "#E5E7EB" }}
          >
            SEJA UM REVENDEDOR OFICIAL
          </h2>
          <p className="mb-8 text-base" style={{ color: "#6B7280" }}>
            Acesso exclusivo a preços de atacado, catálogo técnico completo e sistema B2B de orçamento.
          </p>
          <Link to={createPageUrl("MinhaConta")}>
            <button
              className="mm-btn-tactile mm-glow-orange inline-flex items-center gap-2 px-8 h-12 font-bold font-mono-tech text-sm"
              style={{
                background: "linear-gradient(135deg, #FB923C, #EA7C28)",
                color: "#fff",
                borderRadius: "2px",
                border: "none",
              }}
            >
              QUERO SER REVENDEDOR <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
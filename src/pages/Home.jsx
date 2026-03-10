import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Search, ChevronRight, ArrowRight, Cpu, Shield, Truck, Zap, Award, Quote } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import HeroPiston from "../components/home/HeroPiston";
import CategoryCard from "../components/home/CategoryCard";
import KitsCarousel from "../components/home/KitsCarousel";
import ComoSerLojista from "../components/home/ComoSerLojista";

const LINHAS = [
"Motores a Gasolina",
"Motores a Diesel",
"Motobombas 4 Tempos",
"Geradores 4 Tempos",
"Geradores 2 Tempos",
"Bombas de Pulverização"];


const MARCAS = ["HONDA", "TOYAMA", "TEKNA", "BRANCO", "BUFFALO", "HUSQVARNA"];

const NUMEROS = [
{ valor: "+1.000", label: "Peças Catalogadas", color: "#E53935" },
{ valor: "6+", label: "Marcas Compatíveis", color: "#1D4ED8" },
{ valor: "100%", label: "Suporte B2B", color: "#4ADE80" },
{ valor: "∞", label: "Compromisso Técnico", color: "#E53935" }];


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
    <div style={{ background: "#F8F9FA", minHeight: "100vh" }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: "88vh" }}>
        {/* Background image — mobile */}
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a2232aaedb3f01dfc43e13/5e7ca15e4_HeroHomeMobile-MOTORMOURA.png"
          alt="MotorMoura — Motor Honda GX com peças"
          className="absolute inset-0 w-full h-full object-cover md:hidden"
          style={{ objectPosition: "center center" }} />
        {/* Background image — desktop */}
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a2232aaedb3f01dfc43e13/7c5d7ee3b_HeroHomeDesktop-MOTORMOURA.png"
          alt="MotorMoura — Motor Honda GX com peças"
          className="absolute inset-0 w-full h-full object-cover hidden md:block"
          style={{ objectPosition: "center 45%" }} />

        {/* Overlay — mais leve à direita para mostrar o motor */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(105deg, rgba(10,10,12,0.88) 0%, rgba(10,10,12,0.65) 40%, rgba(10,10,12,0.10) 70%, rgba(10,10,12,0.05) 100%)"
        }} />
        {/* Blueprint grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "linear-gradient(rgba(29,78,216,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(29,78,216,0.8) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />
        {/* Orange glow bottom-left */}
        <div className="absolute" style={{
          left: "40%", bottom: 0,
          width: 600, height: 300,
          background: "radial-gradient(ellipse, rgba(251,146,60,0.07) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />

        <div className="relative max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center" style={{ zIndex: 2 }}>
          {/* Left: Copy */}
          <div>
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 text-xs font-mono-tech" style={{
              background: "rgba(29,78,216,0.15)", border: "1px solid rgba(29,78,216,0.4)", color: "#93C5FD", borderRadius: "2px"
            }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] mm-data-blink inline-block" />
              PLATAFORMA B2B · SISTEMA ATIVO
            </div>

            <h1 className="text-slate-50 mb-4 leading-tight" style={{ fontFamily: "'Space Mono', monospace" }}>
              <span className="block text-4xl md:text-5xl font-bold mm-text-metal">ENGENHARIA</span>
              <span className="block text-4xl md:text-5xl font-bold mm-text-metal">GLOBAL,</span>
              <span className="block text-3xl md:text-4xl font-bold mm-text-orange mt-1">SUPORTE LOCAL.</span>
            </h1>

            <p className="mb-3" style={{ color: "#9CA3AF", fontSize: "17px", fontWeight: 400, maxWidth: 460, lineHeight: 1.75 }}>
              Distribuidora importadora especializada em peças de reposição para motores estacionários, geradores e motobombas. Conectamos tecnologia global ao balcão do seu negócio.
            </p>
            <p className="mb-8 text-sm font-mono-tech" style={{ color: "#E53935" }}>
              Não apenas vendemos peças. Garantimos que o trabalho não pare.
            </p>

            {/* ── ASSISTENTE DE REPOSIÇÃO ────────────────────── */}
            <div className="p-5 mb-6" style={{
              background: "rgba(0,0,0,0.6)",
              border: "1px solid rgba(29,78,216,0.4)",
              borderRadius: "4px",
              clipPath: "polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)",
              boxShadow: "0 0 40px rgba(29,78,216,0.12), inset 0 1px 0 rgba(29,78,216,0.2)"
            }}>
              <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: "1px solid rgba(29,78,216,0.2)" }}>
                <Cpu className="w-3.5 h-3.5" style={{ color: "#1D4ED8" }} />
                <span className="text-xs font-mono-tech" style={{ color: "#60A5FA", letterSpacing: "0.1em" }}>
                  ASSISTENTE DE REPOSIÇÃO v2.0
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                <Select value={selectedMarca} onValueChange={setSelectedMarca}>
                  <SelectTrigger className="h-10 text-sm font-mono-tech" style={{
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(29,78,216,0.35)",
                    color: selectedMarca ? "#F3F4F6" : "#6B7280", borderRadius: "2px"
                  }}>
                    <SelectValue placeholder="[ MARCA ]" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as marcas</SelectItem>
                    {marcas.map((m) => <SelectItem key={m.id} value={m.nome}>{m.nome}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
                  <SelectTrigger className="h-10 text-sm font-mono-tech" style={{
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(29,78,216,0.35)",
                    color: selectedCategoria ? "#F3F4F6" : "#6B7280", borderRadius: "2px"
                  }}>
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
                      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(29,78,216,0.35)",
                      borderRadius: "2px", color: "#F3F4F6"
                    }} />

                </div>
                <button onClick={handleSearch} className="mm-btn-tactile flex items-center gap-2 px-5 h-10 font-semibold text-sm font-mono-tech" style={{
                  background: "linear-gradient(135deg, #E53935, #C62828)", color: "#fff",
                  borderRadius: "2px", boxShadow: "0 4px 16px rgba(251,146,60,0.3)", border: "none"
                }}>
                  <Search className="w-4 h-4" /> BUSCAR
                </button>
              </div>
            </div>

            <Link to={createPageUrl("Catalogo")}>
              <button className="mm-btn-tactile flex items-center gap-2 px-6 h-11 font-semibold text-sm font-mono-tech" style={{
                background: "transparent", border: "1px solid rgba(251,146,60,0.4)",
                color: "#E53935", borderRadius: "2px"
              }}>
                VER CATÁLOGO COMPLETO <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* Right: 3D Product Showcase */}
          <div className="hidden md:flex flex-col gap-3">
            {/* Top row: Motor + Gerador */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a2232aaedb3f01dfc43e13/dfc94b073_Elemento3DMotorGasolina-MOTORMOURA.png",
                  label: "MOTORES A GASOLINA", color: "#D32F2F"
                },
                {
                  img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a2232aaedb3f01dfc43e13/9e70c6073_Elemento3DGerador-MOTORMOURA.png",
                  label: "GERADORES", color: "#1D4ED8"
                }
              ].map((item) => (
                <div key={item.label} className="relative overflow-hidden flex flex-col items-center justify-center p-4"
                  style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", border: `1px solid ${item.color}25`, borderRadius: "4px", minHeight: 160 }}>
                  <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}60, transparent)` }} />
                  <img src={item.img} alt={item.label} className="w-full object-contain" style={{ maxHeight: 110, filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.5))" }} loading="lazy" />
                  <span className="text-[10px] font-mono-tech mt-2" style={{ color: item.color, letterSpacing: "0.1em" }}>{item.label}</span>
                </div>
              ))}
            </div>
            {/* Bottom: Motobomba wide */}
            <div className="relative overflow-hidden flex items-center justify-between px-6 py-4"
              style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", border: "1px solid rgba(2,132,199,0.25)", borderRadius: "4px", minHeight: 140 }}>
              <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, rgba(2,132,199,0.6), transparent)" }} />
              <div>
                <span className="text-[10px] font-mono-tech block mb-1" style={{ color: "#0EA5E9", letterSpacing: "0.1em" }}>MOTOBOMBAS</span>
                <p className="text-xs font-mono-tech" style={{ color: "#6B7280" }}>Irrigação · Industrial</p>
              </div>
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a2232aaedb3f01dfc43e13/264db1544_Elemento3DMotobomba-MOTORMOURA.png"
                alt="Motobomba"
                className="object-contain"
                style={{ maxHeight: 110, filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.5))" }}
                loading="lazy"
              />
            </div>
            <div className="flex items-center gap-2 px-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] mm-data-blink" />
              <span className="text-xs font-mono-tech" style={{ color: "#374151" }}>PLATAFORMA ONLINE · PRONTA ENTREGA</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── NÚMEROS DE AUTORIDADE ───────────────────────────────── */}
      <section style={{ background: "#FFFFFF", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {NUMEROS.map((n) =>
          <div key={n.label} className="text-center p-5 relative overflow-hidden" style={{
            background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "4px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
          }}>
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${n.color}, transparent)` }} />
              <p className="font-bold font-mono-tech mb-1" style={{ color: n.color, fontSize: "30px", lineHeight: 1 }}>{n.valor}</p>
              <p className="text-xs font-mono-tech" style={{ color: "#6C757D", letterSpacing: "0.08em" }}>{n.label}</p>
            </div>
          )}
        </div>
      </section>

      {/* ── STORYTELLING / SOBRE ───────────────────────────────── */}
      <section className="py-20 px-4" style={{ background: "#F8F9FA" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Image */}
          <div className="relative overflow-hidden order-2 lg:order-1" style={{ borderRadius: "4px", minHeight: 360 }}>
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a2232aaedb3f01dfc43e13/c0e01f4c6_InstitucionalEstoqueFortaleza-MOTORMOURA.png"
              alt="Centro de distribuição MotorMoura em Fortaleza"
              className="w-full h-full object-cover"
              loading="lazy"
              style={{ minHeight: 360 }} />

            {/* Overlay gradient */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(10,10,12,0.5) 0%, transparent 60%)" }} />
            {/* Corner marks */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2" style={{ borderColor: "#E53935" }} />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2" style={{ borderColor: "#E53935" }} />
            {/* Badge */}
            <div className="absolute bottom-4 left-4 px-3 py-1.5 text-xs font-mono-tech" style={{
              background: "rgba(10,10,12,0.9)", border: "1px solid rgba(251,146,60,0.4)", color: "#E53935", borderRadius: "2px"
            }}>
              DISTRIBUIDORA TÉCNICA ESPECIALIZADA
            </div>
          </div>

          {/* Copy */}
          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-[2px]" style={{ background: "#E53935" }} />
              <span className="text-xs font-mono-tech" style={{ color: "#E53935", letterSpacing: "0.15em" }}>NOSSA HISTÓRIA</span>
            </div>
            <h2 className="text-3xl font-bold font-mono-tech mb-5" style={{ color: "#212529", lineHeight: 1.3 }}>
              Nascemos para que o trabalho não pare.
            </h2>
            <div className="space-y-4" style={{ color: "#6C757D", fontSize: "16px", lineHeight: 1.85 }}>
              <p>
                A <strong style={{ color: "#212529" }}>MotorMoura</strong> nasceu em Fortaleza, Ceará, com a missão de entregar precisão técnica e disponibilidade imediata para o mercado de força e energia. Como importadora especializada, conectamos a alta tecnologia de fabricação global diretamente ao balcão dos melhores lojistas e oficinas do Brasil.
              </p>
              <p>
                Nossa expertise reside na <strong style={{ color: "#D32F2F" }}>curadoria rigorosa de componentes</strong> para motores estacionários, geradores e motobombas, assegurando que cada item em nosso catálogo atenda aos mais altos padrões de durabilidade e performance.
              </p>
            </div>
            <Link to={createPageUrl("Sobre")}>
              <button className="mt-6 flex items-center gap-2 px-5 h-10 text-sm font-mono-tech font-semibold mm-btn-tactile" style={{
                background: "transparent", border: "1px solid rgba(251,146,60,0.35)", color: "#E53935", borderRadius: "2px"
              }}>
                CONHEÇA A MOTORMOURA <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── COMPATIBILIDADE MULTIMARCAS ──────────────────────────── */}
      <section style={{ background: "#FFFFFF", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="text-center text-xs font-mono-tech mb-6" style={{ color: "#9CA3AF", letterSpacing: "0.2em" }}>
            PORTFÓLIO MULTIMARCAS — COMPATIBILIDADE GARANTIDA
          </p>
          <div className="relative overflow-hidden" style={{ borderRadius: "4px", maxHeight: 380 }}>
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a2232aaedb3f01dfc43e13/338c2023f_InstitucionalCompatibilidadeMultimarcas-MOTORMOURA.png"
              alt="Compatibilidade multimarcas MotorMoura — Honda, Toyama, Makita"
              className="w-full object-cover"
              loading="lazy"
              style={{ maxHeight: 380, objectPosition: "center" }}
            />
          </div>
        </div>
      </section>

      {/* ── LINHAS DE REPOSIÇÃO ─────────────────────────────────── */}
      <section className="py-16 px-4" style={{ background: "#F8F9FA" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-[2px]" style={{ background: "#D32F2F" }} />
                <span className="text-xs font-mono-tech" style={{ color: "#D32F2F", letterSpacing: "0.15em" }}>SEGMENTOS TÉCNICOS</span>
              </div>
              <h2 className="text-2xl font-bold font-mono-tech" style={{ color: "#212529" }}>Nossas Linhas de Reposição</h2>
              <p className="mt-1" style={{ color: "#6C757D", fontSize: "16px", fontWeight: 400 }}>
                Clique em uma linha para ver as peças disponíveis no catálogo.
              </p>
            </div>
            <Link to={createPageUrl("Catalogo")}>
              <button className="hidden md:flex items-center gap-2 px-4 h-9 text-sm font-mono-tech mm-btn-tactile" style={{
                background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#6C757D", borderRadius: "2px"
              }}>
                Todo o catálogo <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {LINHAS.map((nome) => {
              const cat = categorias.find((c) => c.nome === nome) || { id: nome, nome };
              return <CategoryCard key={cat.id} categoria={cat} />;
            })}
          </div>
        </div>
      </section>

      {/* ── IMAGE BREAK — LOGÍSTICA REGIONAL ───────────────────── */}
      <section className="relative overflow-hidden" style={{ height: 280 }}>
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a2232aaedb3f01dfc43e13/19310ff54_InstitucionalLogsticaRegional-MOTORMOURA.png"
          alt="Logística regional MotorMoura — entrega para todo o Nordeste"
          className="w-full h-full object-cover"
          loading="lazy"
          style={{ objectPosition: "center 30%" }} />

        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(10,10,12,0.85) 0%, rgba(10,10,12,0.3) 50%, rgba(10,10,12,0.85) 100%)" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <p className="text-xs font-mono-tech mb-2" style={{ color: "#E53935", letterSpacing: "0.2em" }}>LOGÍSTICA REGIONAL ESPECIALIZADA</p>
            <h3 className="text-2xl md:text-3xl font-bold font-mono-tech mm-text-metal">
              De Fortaleza para todo<br />o Nordeste e Brasil.
            </h3>
          </div>
        </div>
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, #1D4ED8, #E53935, #1D4ED8)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, #1D4ED8, #E53935, #1D4ED8)" }} />
      </section>

      {/* ── KITS ALTO GIRO ──────────────────────────────────────── */}
      <KitsCarousel />

      {/* ── DIFERENCIAIS ───────────────────────────────────────── */}
      <section className="py-16 px-4" style={{ background: "#FFFFFF", borderTop: "1px solid #E2E8F0" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-5 h-[2px]" style={{ background: "#1D4ED8" }} />
              <span className="text-xs font-mono-tech" style={{ color: "#1D4ED8", letterSpacing: "0.15em" }}>POR QUE A MOTORMOURA</span>
              <div className="w-5 h-[2px]" style={{ background: "#1D4ED8" }} />
            </div>
            <h2 className="text-2xl font-bold font-mono-tech" style={{ color: "#212529" }}>O Elo Mais Forte da Sua Cadeia de Suprimentos.</h2>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
            { Icon: Shield, title: "QUALIDADE CERTIFICADA", desc: "Peças importadas com especificações técnicas rigorosas. Alternativa de alto desempenho que equilibra custo e longevidade.", color: "#1D4ED8",
              img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a2232aaedb3f01dfc43e13/dfc94b073_Elemento3DMotorGasolina-MOTORMOURA.png" },
            { Icon: Truck, title: "LOGÍSTICA DE ESCALA", desc: "Estruturados para operações B2B de grande volume. Sua loja sempre com o estoque necessário para nunca perder uma venda.", color: "#D32F2F",
              img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a2232aaedb3f01dfc43e13/9e70c6073_Elemento3DGerador-MOTORMOURA.png" },
            { Icon: Cpu, title: "SUPORTE TÉCNICO", desc: "Nossa equipe especializada identifica a peça exata. Do motor ao gerador, da motobomba à bomba de pulverização.", color: "#15803D",
              img: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a2232aaedb3f01dfc43e13/f54f36126_Elemento3DPeasFlutuantes-MOTORMOURA.png" }].
            map((f) =>
            <div key={f.title} className="p-5 relative overflow-hidden" style={{
              background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
            }}>
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${f.color}60, transparent)` }} />
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0" style={{
                    background: `${f.color}12`, border: `1px solid ${f.color}30`, borderRadius: "2px"
                  }}>
                    <f.Icon className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                  <img src={f.img} alt={f.title} className="w-16 h-16 object-contain opacity-80"
                    loading="lazy" style={{ filter: `drop-shadow(0 2px 8px ${f.color}25)` }} />
                </div>
                <h3 className="font-bold text-sm mb-2 font-mono-tech" style={{ color: "#212529" }}>{f.title}</h3>
                <p style={{ color: "#6C757D", fontSize: "15px", fontWeight: 400, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── IMAGE + QUOTE BREAK ─────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: "#F8F9FA", borderTop: "1px solid #E2E8F0" }}>
        <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch">
          <div className="relative overflow-hidden" style={{ minHeight: 320, borderRadius: "4px 0 0 4px" }}>
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a2232aaedb3f01dfc43e13/89677d3bd_InstitucionalParceriaB2B-MOTORMOURA.png"
              alt="Parceria B2B MotorMoura"
              className="w-full h-full object-cover"
              loading="lazy"
              style={{ objectPosition: "center" }} />
          </div>
          <div className="flex flex-col justify-center p-8 md:p-12" style={{
            background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "0 4px 4px 0",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)"
          }}>
            <Quote className="w-8 h-8 mb-4 opacity-20" style={{ color: "#D32F2F" }} />
            <blockquote className="text-xl font-bold font-mono-tech mb-4" style={{ color: "#212529", lineHeight: 1.5 }}>
              "Queremos ser mais que um fornecedor: o motor que impulsiona o crescimento do seu negócio."
            </blockquote>
            <p className="text-sm" style={{ color: "#6C757D" }}>
              — <span className="font-mono-tech" style={{ color: "#D32F2F" }}>MotorMoura</span> · Visão Estratégica B2B
            </p>
            <div className="mt-6 pt-6" style={{ borderTop: "1px solid #E2E8F0" }}>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#16A34A" }} />
                <span className="text-xs font-mono-tech" style={{ color: "#6C757D" }}>+1.000 ITENS DISPONÍVEIS PARA PRONTA ENTREGA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMO SER LOJISTA ────────────────────────────────────── */}
      <ComoSerLojista />

      {/* ── B2B CTA ─────────────────────────────────────────────── */}
      <section className="py-16 px-4 relative overflow-hidden" style={{ background: "#FFFFFF", borderTop: "1px solid #E2E8F0" }}>
        <div className="relative max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Award className="w-5 h-5" style={{ color: "#D32F2F" }} />
            <span className="text-xs font-mono-tech" style={{ color: "#D32F2F", letterSpacing: "0.15em" }}>PROGRAMA DE REVENDEDORES</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 font-mono-tech" style={{ color: "#212529" }}>
            POTENCIALIZE SEU ESTOQUE COM QUEM ENTENDE DE MECÂNICA.
          </h2>
          <p className="mb-8" style={{ color: "#6C757D", fontSize: "17px", fontWeight: 400 }}>
            Acesso exclusivo a preços de atacado, catálogo técnico completo e sistema B2B de cotação. Junte-se à rede de lojistas que nunca deixam o cliente na mão.
          </p>
          <Link to={createPageUrl("MinhaConta")}>
            <button className="mm-btn-tactile inline-flex items-center gap-2 px-8 font-bold font-mono-tech text-sm" style={{
              background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "#fff", borderRadius: "2px", border: "none",
              height: "52px", fontSize: "13px", boxShadow: "0 4px 16px rgba(211,47,47,0.25)"
            }}>
              QUERO SER UM REVENDEDOR PARCEIRO <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>

    </div>);

}
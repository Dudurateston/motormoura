import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  ChevronRight, Shield, Truck, Cpu, Zap, Award, Package,
  Globe, Target, ArrowRight, MapPin, Users, Clock, Star,
  CheckCircle, Wrench, Layers, MessageCircle } from
"lucide-react";
import SEOHead from "../components/SEOHead";

const MARCAS = ["Honda", "Toyama", "Tekna", "Branco", "Buffalo", "Husqvarna"];

const TIMELINE = [
{ ano: "2015", title: "Fundação", desc: "Nasce a MotorMoura em Fortaleza, Ceará, com a missão de ser a distribuidora técnica de referência no mercado de força e energia." },
{ ano: "2018", title: "Expansão Regional", desc: "Consolidação no mercado cearense e início de atendimento B2B para lojistas em todo o Nordeste." },
{ ano: "2021", title: "Importação Direta", desc: "Firmamos parcerias com fabricantes internacionais da Ásia e Europa para importação direta de componentes técnicos." },
{ ano: "2024", title: "Plataforma Digital", desc: "Lançamento da plataforma B2B com catálogo digital completo, busca por SKU e cotação instantânea via WhatsApp." }];


const DIFERENCIAIS = [
{ icon: Package, title: "Portfólio Multimarcas", desc: "Mais de 1.000 itens catalogados para Honda, Toyama, Tekna, Branco, Buffalo e Husqvarna.", color: "#E53935" },
{ icon: Award, title: "Qualidade Certificada", desc: "Peças importadas com especificações técnicas rigorosas, alta durabilidade e performance comprovada.", color: "#1D4ED8" },
{ icon: Truck, title: "Logística de Escala", desc: "Estruturados para operações B2B de grande volume. Sua loja nunca fica sem estoque.", color: "#4ADE80" },
{ icon: Wrench, title: "Suporte Técnico", desc: "Equipe especializada identifica a peça exata para qualquer modelo de motor, gerador ou motobomba.", color: "#E53935" },
{ icon: Layers, title: "Catálogo Digital", desc: "Plataforma com busca por SKU, filtros avançados e cotação direta via WhatsApp B2B.", color: "#1D4ED8" },
{ icon: Globe, title: "Importação Direta", desc: "Relação direta com fabricantes internacionais, garantindo preço competitivo e disponibilidade real.", color: "#4ADE80" }];


export default function Sobre() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <SEOHead
        title="Sobre a MotorMoura - Distribuidora de Peças para Motores | Fortaleza-CE"
        description="Conheça a história da MotorMoura, distribuidora técnica B2B especializada em peças de reposição para motores, geradores e motobombas. Importação direta desde 2015. Fortaleza-CE."
        keywords="sobre motormoura, distribuidora peças motor, importadora Fortaleza, história empresa, B2B peças motor"
      />
      <div className="mm-bg min-h-screen">

      {/* ── HERO com imagem de armazém / logística ─── */}
      <section className="relative overflow-hidden" style={{ minHeight: 520, background: "#F8F9FA" }}>
        <img
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&q=80"
          alt="Armazém de peças industriais"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          style={{ objectPosition: "center 40%" }} />

        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: "linear-gradient(rgba(33,37,41,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(33,37,41,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />

        <div className="relative max-w-5xl mx-auto px-4 py-24 flex flex-col items-start justify-center" style={{ zIndex: 2 }}>
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 text-xs font-mono-tech" style={{
            background: "rgba(211,47,47,0.08)", border: "1px solid rgba(211,47,47,0.25)", color: "#D32F2F", borderRadius: "2px", letterSpacing: "0.1em"
          }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D32F2F] mm-data-blink inline-block" />
            SOBRE A MOTORMOURA · DISTRIBUIDORA TÉCNICA B2B
          </div>

          <h1 className="text-slate-50 mb-4 font-mono-tech" style={{ fontSize: "clamp(30px, 5vw, 52px)", fontWeight: 700, lineHeight: 1.1 }}>
            <span className="block" style={{ color: "#212529" }}>QUASE UMA DÉCADA</span>
            <span className="block" style={{ color: "#212529" }}>FAZENDO O TRABALHO</span>
            <span className="block" style={{ color: "#D32F2F" }}>NÃO PARAR.</span>
          </h1>
          <p style={{ color: "#000000ff", fontSize: "17px", lineHeight: 1.8, maxWidth: 500, marginBottom: "32px" }}>
            Distribuidora importadora especializada em peças de reposição para motores, geradores e motobombas. Sua parceira técnica no Brasil.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to={createPageUrl("Catalogo")}>
              <button className="mm-btn-tactile flex items-center gap-2 px-5 h-10 text-xs font-mono-tech font-bold" style={{
                background: "linear-gradient(135deg, #E53935, #C62828)", color: "#fff", borderRadius: "2px", border: "none"
              }}>
                VER CATÁLOGO COMPLETO <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <a href="https://api.whatsapp.com/send?phone=5585986894081" target="_blank" rel="noopener noreferrer">
              <button className="mm-btn-tactile flex items-center gap-2 px-5 h-10 text-xs font-mono-tech" style={{
                background: "transparent", border: "1px solid rgba(74,222,128,0.4)", color: "#4ADE80", borderRadius: "2px"
              }}>
                <MessageCircle className="w-4 h-4" /> FALAR COM B2B
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* ── NÚMEROS ── */}
      <section style={{ background: "#FFFFFF", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
          { valor: "+1.000", label: "PEÇAS EM CATÁLOGO", color: "#D32F2F" },
          { valor: "6+", label: "MARCAS COMPATÍVEIS", color: "#1D4ED8" },
          { valor: "100%", label: "SUPORTE B2B", color: "#16A34A" },
          { valor: "CE", label: "FORTALEZA · CEARÁ", color: "#D32F2F" }].
          map((n) =>
          <div key={n.label} className="text-center p-5 relative overflow-hidden" style={{
            background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "4px"
          }}>
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${n.color}, transparent)` }} />
              <p className="font-bold font-mono-tech mb-1" style={{ color: n.color, fontSize: "32px", lineHeight: 1 }}>{n.valor}</p>
              <p className="text-xs font-mono-tech" style={{ color: "#6C757D", letterSpacing: "0.1em" }}>{n.label}</p>
            </div>
          )}
        </div>
      </section>

      {/* ── NOSSA HISTÓRIA — imagem de equipe/operação ── */}
      <section className="py-20 px-4" style={{ background: "#F8F9FA" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Imagem */}
          <div className="relative overflow-hidden" style={{ borderRadius: "4px", minHeight: 380 }}>
            <img
              src="https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&q=80"
              alt="Equipe técnica trabalhando com equipamentos"
              className="w-full h-full object-cover"
              style={{ minHeight: 380 }} />

            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(10,10,12,0.3) 0%, transparent 60%)" }} />
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2" style={{ borderColor: "#E53935" }} />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2" style={{ borderColor: "#E53935" }} />
            {/* Badge sobre a imagem */}
            <div className="absolute bottom-4 left-4 px-3 py-1.5 text-xs font-mono-tech" style={{
              background: "rgba(10,10,12,0.92)", border: "1px solid rgba(251,146,60,0.4)", color: "#E53935", borderRadius: "2px"
            }}>
              FORTALEZA · CEARÁ
            </div>
          </div>

          {/* Copy */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-[2px]" style={{ background: "#D32F2F" }} />
              <span className="text-xs font-mono-tech" style={{ color: "#D32F2F", letterSpacing: "0.15em" }}>NOSSA HISTÓRIA</span>
            </div>
            <h2 className="text-3xl font-bold font-mono-tech mb-5" style={{ color: "#212529", lineHeight: 1.3 }}>
              Nascemos para que o trabalho não pare.
            </h2>
            <div className="space-y-4" style={{ color: "#6C757D", fontSize: "16px", lineHeight: 1.85 }}>
              <p>
                A <strong style={{ color: "#212529" }}>MotorMoura Equipamentos e Acessórios</strong> nasceu em Fortaleza, Ceará, com a missão de entregar precisão técnica e disponibilidade imediata para o mercado de força e energia. Como importadora especializada, conectamos a alta tecnologia de fabricação global diretamente ao balcão dos melhores lojistas e oficinas do Brasil.
              </p>
              <p>
                Nossa expertise reside na <strong style={{ color: "#D32F2F" }}>curadoria rigorosa de componentes</strong> para motores estacionários, geradores e motobombas — garantindo que cada peça do catálogo atenda aos mais altos padrões de durabilidade e performance desde o primeiro dia.
              </p>
            </div>

            {/* Pilares rápidos */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              {[
              { Icon: MapPin, label: "Fortaleza, Ceará", color: "#D32F2F" },
              { Icon: Users, label: "Equipe Especializada", color: "#1D4ED8" },
              { Icon: Clock, label: "Nascida para Durar", color: "#16A34A" },
              { Icon: Star, label: "Referência em B2B", color: "#D32F2F" }].
              map((p) =>
              <div key={p.label} className="flex items-center gap-2 px-3 py-2" style={{
                background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "2px"
              }}>
                  <p.Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: p.color }} />
                  <span className="text-xs font-mono-tech" style={{ color: "#6C757D" }}>{p.label}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="py-20 px-4" style={{ background: "#FFFFFF" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-5 h-[2px]" style={{ background: "#D32F2F" }} />
              <span className="text-xs font-mono-tech" style={{ color: "#D32F2F", letterSpacing: "0.15em" }}>NOSSA TRAJETÓRIA</span>
              <div className="w-5 h-[2px]" style={{ background: "#D32F2F" }} />
            </div>
            <h2 className="text-2xl font-bold font-mono-tech" style={{ color: "#212529" }}>Quase Uma Década de Evolução.</h2>
          </div>

          <div className="relative">
            {/* Linha central */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block" style={{ background: "#E2E8F0" }} />

            <div className="space-y-8">
              {TIMELINE.map((item, i) =>
              <div key={item.ano} className={`flex flex-col md:flex-row items-center gap-4 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div className="inline-block p-4" style={{
                    background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "4px"
                  }}>
                      <h3 className="font-bold font-mono-tech text-sm mb-1" style={{ color: "#212529" }}>{item.title}</h3>
                      <p className="text-xs" style={{ color: "#6C757D", lineHeight: 1.6 }}>{item.desc}</p>
                    </div>
                  </div>
                  {/* Nó */}
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center font-bold font-mono-tech text-xs z-10" style={{
                  background: "#FFFFFF",
                  border: "2px solid #D32F2F", borderRadius: "4px", color: "#D32F2F"
                }}>
                    {item.ano}
                  </div>
                  <div className="flex-1 hidden md:block" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── IMAGE BREAK — peças em detalhe ── */}
      <section className="relative overflow-hidden" style={{ height: 300, background: "#F8F9FA" }}>
        <img
          src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1600&q=80"
          alt="Técnico inspecionando peças de motor"
          className="w-full h-full object-cover opacity-15"
          style={{ objectPosition: "center 35%" }} />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <p className="text-xs font-mono-tech mb-2" style={{ color: "#1D4ED8", letterSpacing: "0.2em" }}>QUALIDADE IMPORTADA · SUPORTE NACIONAL</p>
            <h3 className="text-2xl md:text-3xl font-bold font-mono-tech" style={{ color: "#212529" }}>
              Cada componente passa por<br />curadoria técnica rigorosa.
            </h3>
          </div>
        </div>
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, #1D4ED8, #D32F2F, #1D4ED8)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, #1D4ED8, #D32F2F, #1D4ED8)" }} />
      </section>

      {/* ── DIFERENCIAIS GRID ── */}
      <section className="py-20 px-4" style={{ background: "#FFFFFF" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-5 h-[2px]" style={{ background: "#D32F2F" }} />
              <span className="text-xs font-mono-tech" style={{ color: "#D32F2F", letterSpacing: "0.15em" }}>DIFERENCIAIS COMPETITIVOS</span>
              <div className="w-5 h-[2px]" style={{ background: "#D32F2F" }} />
            </div>
            <h2 className="text-2xl font-bold font-mono-tech" style={{ color: "#212529" }}>
              O Elo Mais Forte da Sua Cadeia de Suprimentos.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DIFERENCIAIS.map((d) =>
            <div key={d.title} className="p-5 relative overflow-hidden" style={{
              background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "4px"
            }}>
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${d.color}, transparent)` }} />
                <div className="w-10 h-10 flex items-center justify-center mb-4" style={{
                background: d.color === "#E53935" ? "rgba(211,47,47,0.08)" : d.color === "#1D4ED8" ? "rgba(29,78,216,0.08)" : "rgba(22,163,74,0.08)",
                border: `1px solid ${d.color === "#E53935" ? "rgba(211,47,47,0.25)" : d.color === "#1D4ED8" ? "rgba(29,78,216,0.25)" : "rgba(22,163,74,0.25)"}`,
                borderRadius: "2px"
              }}>
                  <d.icon className="w-5 h-5" style={{ color: d.color === "#E53935" ? "#D32F2F" : d.color === "#4ADE80" ? "#16A34A" : d.color }} />
                </div>
                <h3 className="font-bold font-mono-tech text-sm mb-2" style={{ color: "#212529" }}>{d.title}</h3>
                <p style={{ color: "#6C757D", fontSize: "14px", lineHeight: 1.7 }}>{d.desc}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── MARCAS ── */}
      <section style={{ background: "#F8F9FA", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="text-center text-xs font-mono-tech mb-8" style={{ color: "#6C757D", letterSpacing: "0.2em" }}>
            PORTFÓLIO MULTIMARCAS — COMPATIBILIDADE GARANTIDA
          </p>
          <div className="flex items-center justify-center flex-wrap gap-3">
            {MARCAS.map((marca) =>
            <div key={marca} className="px-5 py-2.5 font-bold font-mono-tech text-sm transition-colors hover:bg-white hover:border-gray-300" style={{
              background: "#FFFFFF", border: "1px solid #E2E8F0",
              color: "#6C757D", borderRadius: "2px", letterSpacing: "0.1em"
            }}>
                {marca.toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── TECNOLOGIA — imagem de laptop/digital ── */}
      <section className="py-20 px-4 relative overflow-hidden" style={{ background: "#FFFFFF" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Copy */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-[2px]" style={{ background: "#1D4ED8" }} />
              <span className="text-xs font-mono-tech" style={{ color: "#1D4ED8", letterSpacing: "0.15em" }}>PLATAFORMA DIGITAL B2B</span>
            </div>
            <h2 className="text-3xl font-bold font-mono-tech mb-5" style={{ color: "#212529", lineHeight: 1.3 }}>
              Tecnologia a Serviço do Lojista.
            </h2>
            <p style={{ color: "#6C757D", fontSize: "16px", lineHeight: 1.85, marginBottom: "20px" }}>
              Diferente de catálogos estáticos e processos lentos, a MotorMoura investe em ferramentas que facilitam o seu dia a dia. Nosso <strong style={{ color: "#212529" }}>Assistente de Reposição Inteligente</strong> encontra a peça exata em segundos, otimizando seu tempo e garantindo o atendimento perfeito ao cliente final.
            </p>
            <ul className="space-y-2 mb-6">
              {["Busca por SKU ou nome da peça", "Filtro por marca, categoria e linha de equipamento", "Cotação direta via WhatsApp B2B", "Plataforma exclusiva para lojistas homologados"].map((item) =>
              <li key={item} className="flex items-center gap-2.5 text-sm" style={{ color: "#6C757D" }}>
                  <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#16A34A" }} />
                  {item}
                </li>
              )}
            </ul>
            <Link to={createPageUrl("Catalogo")}>
              <button className="mm-btn-tactile flex items-center gap-2 px-5 h-10 text-xs font-mono-tech font-bold" style={{
                background: "linear-gradient(135deg, #1D4ED8, #2563EB)", color: "#fff", borderRadius: "2px", border: "none",
                boxShadow: "0 4px 16px rgba(29,78,216,0.3)"
              }}>
                <Cpu className="w-4 h-4" /> ACESSAR O CATÁLOGO TÉCNICO
              </button>
            </Link>
          </div>

          {/* Imagem — tela de computador / operações */}
          <div className="relative overflow-hidden" style={{ borderRadius: "4px", minHeight: 360 }}>
            <img
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80"
              alt="Circuitos e tecnologia de precisão"
              className="w-full h-full object-cover"
              style={{ minHeight: 360 }} />

            <div className="absolute inset-0" style={{ background: "linear-gradient(45deg, rgba(10,10,12,0.6) 0%, transparent 60%)" }} />
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2" style={{ borderColor: "#1D4ED8" }} />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2" style={{ borderColor: "#1D4ED8" }} />
            <div className="absolute bottom-4 left-4 px-3 py-1.5 text-xs font-mono-tech" style={{
              background: "rgba(10,10,12,0.92)", border: "1px solid rgba(29,78,216,0.4)", color: "#60A5FA", borderRadius: "2px"
            }}>
              ASSISTENTE DE REPOSIÇÃO v2.0
            </div>
          </div>
        </div>
      </section>

      {/* ── VISÃO ── */}
      <section className="py-20 px-4" style={{ background: "#F8F9FA" }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-5 h-[2px]" style={{ background: "#16A34A" }} />
            <span className="text-xs font-mono-tech" style={{ color: "#16A34A", letterSpacing: "0.15em" }}>NOSSA VISÃO</span>
            <div className="w-5 h-[2px]" style={{ background: "#16A34A" }} />
          </div>
          <h2 className="text-3xl font-bold font-mono-tech mb-6" style={{ color: "#212529" }}>
            Movendo o Progresso do Ceará e do Brasil.
          </h2>
          <p style={{ color: "#6C757D", fontSize: "17px", lineHeight: 1.85, maxWidth: 680, margin: "0 auto 40px" }}>
            Nosso objetivo é ser a <strong style={{ color: "#212529" }}>primeira escolha de todo revendedor e mecânico</strong> que busca confiança. Queremos eliminar a complexidade na busca por peças de reposição, sendo <strong style={{ color: "#D32F2F" }}>o motor que impulsiona o crescimento do seu negócio</strong>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
            { icon: Target, title: "1ª Escolha", desc: "De todo revendedor que busca confiança e precisão técnica.", color: "#D32F2F" },
            { icon: Cpu, title: "Tecnologia Ágil", desc: "Plataforma onde a informação é clara e o pedido é rápido.", color: "#1D4ED8" },
            { icon: Zap, title: "Parceria Real", desc: "Muito mais que fornecedor — motor do seu crescimento.", color: "#16A34A" }].
            map((item) =>
            <div key={item.title} className="p-5 text-left" style={{
              background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px"
            }}>
                <div className="w-9 h-9 flex items-center justify-center mb-3" style={{
                background: item.color === "#D32F2F" ? "rgba(211,47,47,0.08)" : item.color === "#1D4ED8" ? "rgba(29,78,216,0.08)" : "rgba(22,163,74,0.08)",
                border: `1px solid ${item.color === "#D32F2F" ? "rgba(211,47,47,0.25)" : item.color === "#1D4ED8" ? "rgba(29,78,216,0.25)" : "rgba(22,163,74,0.25)"}`,
                borderRadius: "2px"
              }}>
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <h4 className="font-bold font-mono-tech text-sm mb-2" style={{ color: "#212529" }}>{item.title}</h4>
                <p style={{ color: "#6C757D", fontSize: "14px", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA DUPLO ── */}
      <section className="py-16 px-4 relative overflow-hidden" style={{ background: "#FFFFFF" }}>
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, #1D4ED8, #D32F2F, #1D4ED8)" }} />
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CTA Catálogo */}
          <div className="p-8 relative overflow-hidden" style={{
            background: "rgba(29,78,216,0.05)", border: "1px solid rgba(29,78,216,0.2)", borderRadius: "4px"
          }}>
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, #1D4ED8, transparent)" }} />
            <Package className="w-8 h-8 mb-4" style={{ color: "#1D4ED8" }} />
            <h3 className="font-bold font-mono-tech text-lg mb-2" style={{ color: "#212529" }}>Explore o Catálogo</h3>
            <p className="text-sm mb-5" style={{ color: "#6C757D", lineHeight: 1.6 }}>
              Mais de 1.000 peças catalogadas com busca por SKU, filtros por marca e linha de equipamento.
            </p>
            <Link to={createPageUrl("Catalogo")}>
              <button className="mm-btn-tactile flex items-center gap-2 px-5 h-9 text-xs font-mono-tech font-bold" style={{
                background: "linear-gradient(135deg, #1D4ED8, #2563EB)", color: "#fff", borderRadius: "2px", border: "none"
              }}>
                ACESSAR CATÁLOGO <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
          {/* CTA Revendedor */}
          <div className="p-8 relative overflow-hidden" style={{
            background: "rgba(211,47,47,0.05)", border: "1px solid rgba(211,47,47,0.2)", borderRadius: "4px"
          }}>
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, #D32F2F, transparent)" }} />
            <Award className="w-8 h-8 mb-4" style={{ color: "#D32F2F" }} />
            <h3 className="font-bold font-mono-tech text-lg mb-2" style={{ color: "#212529" }}>Seja um Revendedor</h3>
            <p className="text-sm mb-5" style={{ color: "#6C757D", lineHeight: 1.6 }}>
              Acesse preços de atacado exclusivos e faça parte da rede de lojistas homologados MotorMoura.
            </p>
            <Link to={createPageUrl("MinhaConta")}>
              <button className="mm-btn-tactile flex items-center gap-2 px-5 h-9 text-xs font-mono-tech font-bold" style={{
                background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "#fff", borderRadius: "2px", border: "none"
              }}>
                QUERO SER REVENDEDOR <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      </div>
    </>
  );

}
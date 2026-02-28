import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronRight, Shield, Truck, Cpu, Zap, Award, Package, Globe, Target, ArrowRight, Quote, MessageCircle } from "lucide-react";

const MARCAS = ["Honda", "Toyama", "Tekna", "Branco", "Buffalo", "Husqvarna"];

const NUMEROS = [
  { valor: "+1.000", label: "PEÇAS EM CATÁLOGO", color: "#FB923C" },
  { valor: "6+", label: "MARCAS COMPATÍVEIS", color: "#1D4ED8" },
  { valor: "100%", label: "SUPORTE B2B", color: "#4ADE80" },
  { valor: "BR", label: "ENVIO NACIONAL", color: "#FB923C" },
];

const DIFERENCIAIS = [
  { icon: Package, title: "Portfólio Multimarcas", desc: "Linha completa de reposição para Honda, Toyama, Tekna, Branco, Buffalo e Husqvarna. +1.000 itens catalogados com precisão cirúrgica.", color: "#FB923C" },
  { icon: Award, title: "Qualidade Premium", desc: "Peças importadas com especificações técnicas rigorosas — alternativa de alto desempenho que equilibra custo e longevidade.", color: "#1D4ED8" },
  { icon: Truck, title: "Logística de Escala", desc: "Estruturados para B2B de grande volume. Sua loja sempre abastecida para nunca perder uma venda.", color: "#4ADE80" },
];

export default function Sobre() {
  return (
    <div className="mm-bg min-h-screen">

      {/* ── HERO com imagem real ── */}
      <section className="relative overflow-hidden" style={{ minHeight: "60vh" }}>
        <img
          src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1600&q=80"
          alt="Motor industrial"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 55%" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, rgba(10,10,12,0.97) 0%, rgba(10,10,12,0.75) 55%, rgba(10,10,12,0.45) 100%)" }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "linear-gradient(rgba(29,78,216,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(29,78,216,0.8) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

        <div className="relative max-w-5xl mx-auto px-4 py-24 flex flex-col justify-center" style={{ zIndex: 2 }}>
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 text-xs font-mono-tech w-fit" style={{
            background: "rgba(29,78,216,0.15)", border: "1px solid rgba(29,78,216,0.4)", color: "#93C5FD", borderRadius: "2px",
          }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] mm-data-blink inline-block" />
            SOBRE A MOTORMOURA · DISTRIBUIDORA TÉCNICA B2B
          </div>
          <h1 className="font-mono-tech mb-4" style={{ fontSize: "clamp(30px, 5vw, 52px)", fontWeight: 700, lineHeight: 1.15 }}>
            <span className="mm-text-metal block">ENGENHARIA GLOBAL,</span>
            <span className="mm-text-orange block">SUPORTE LOCAL.</span>
          </h1>
          <p style={{ color: "#9CA3AF", fontSize: "18px", lineHeight: 1.8, maxWidth: 520 }}>
            Especialistas em peças de reposição para motores, geradores e motobombas — conectando a tecnologia global ao seu negócio.
          </p>
        </div>
      </section>

      {/* ── NÚMEROS ── */}
      <section style={{ background: "#17171A", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {NUMEROS.map((n) => (
            <div key={n.label} className="text-center p-5 relative overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px" }}>
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${n.color}, transparent)` }} />
              <p className="font-bold font-mono-tech mb-1" style={{ color: n.color, fontSize: "32px", lineHeight: 1 }}>{n.valor}</p>
              <p className="text-xs font-mono-tech" style={{ color: "#4B5563", letterSpacing: "0.1em" }}>{n.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HISTÓRIA com imagem ── */}
      <section className="py-20 px-4" style={{ background: "#1F1F23" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Image */}
          <div className="relative overflow-hidden order-2 lg:order-1" style={{ borderRadius: "4px", minHeight: 380 }}>
            <img
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80"
              alt="Peças de motor"
              className="w-full h-full object-cover"
              style={{ minHeight: 380 }}
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(10,10,12,0.4) 0%, transparent 60%)" }} />
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2" style={{ borderColor: "#FB923C" }} />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2" style={{ borderColor: "#FB923C" }} />
            <div className="absolute bottom-4 left-4 px-3 py-1.5 text-xs font-mono-tech" style={{
              background: "rgba(10,10,12,0.9)", border: "1px solid rgba(251,146,60,0.4)", color: "#FB923C", borderRadius: "2px",
            }}>
              IMPORTAÇÃO DIRETA DE ALTA PRECISÃO
            </div>
          </div>

          {/* Copy */}
          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-[2px]" style={{ background: "#FB923C" }} />
              <span className="text-xs font-mono-tech" style={{ color: "#FB923C", letterSpacing: "0.15em" }}>A NOSSA HISTÓRIA</span>
            </div>
            <h2 className="text-3xl font-bold font-mono-tech mb-6" style={{ color: "#F3F4F6", lineHeight: 1.3 }}>Quem Somos</h2>
            <div className="space-y-4" style={{ color: "#9CA3AF", fontSize: "16px", lineHeight: 1.85 }}>
              <p>
                A <strong style={{ color: "#F3F4F6" }}>MotorMoura Equipamentos e Acessórios</strong> nasceu da necessidade de entregar precisão técnica e disponibilidade imediata para o mercado de força e energia no Brasil. Como distribuidora importadora especializada, conectamos a alta tecnologia de fabricação global diretamente ao balcão dos melhores lojistas e oficinas do país.
              </p>
              <p>
                Não apenas vendemos peças; nós <strong style={{ color: "#FB923C" }}>garantimos que o trabalho não pare</strong>. Nossa expertise é a curadoria rigorosa de componentes para motores estacionários, geradores e motobombas, assegurando que cada item atenda aos mais altos padrões de durabilidade.
              </p>
            </div>
            <Link to={createPageUrl("Catalogo")}>
              <button className="mt-6 flex items-center gap-2 px-5 h-10 text-sm font-mono-tech font-semibold mm-btn-tactile" style={{
                background: "transparent", border: "1px solid rgba(251,146,60,0.4)", color: "#FB923C", borderRadius: "2px",
              }}>
                VER CATÁLOGO COMPLETO <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── DIFERENCIAIS ── */}
      <section className="py-20 px-4" style={{ background: "linear-gradient(145deg, #0A0A0C, #15151A)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-5 h-[2px]" style={{ background: "#1D4ED8" }} />
              <span className="text-xs font-mono-tech" style={{ color: "#1D4ED8", letterSpacing: "0.15em" }}>DIFERENCIAIS COMPETITIVOS</span>
              <div className="w-5 h-[2px]" style={{ background: "#1D4ED8" }} />
            </div>
            <h2 className="text-3xl font-bold font-mono-tech" style={{ color: "#F3F4F6" }}>O Elo Mais Forte da Sua<br />Cadeia de Suprimentos.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {DIFERENCIAIS.map((d) => (
              <div key={d.title} className="p-6 relative overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "4px" }}>
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${d.color}, transparent)` }} />
                <div className="w-11 h-11 flex items-center justify-center mb-4" style={{ background: `${d.color}18`, border: `1px solid ${d.color}40`, borderRadius: "2px" }}>
                  <d.icon className="w-5 h-5" style={{ color: d.color }} />
                </div>
                <h3 className="font-bold font-mono-tech text-sm mb-3" style={{ color: "#F3F4F6" }}>{d.title}</h3>
                <p style={{ color: "#6B7280", fontSize: "15px", lineHeight: 1.75 }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMAGE BREAK ── */}
      <section className="relative overflow-hidden" style={{ height: 280 }}>
        <img
          src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1600&q=80"
          alt="Gerador industrial"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(10,10,12,0.85) 0%, rgba(10,10,12,0.3) 50%, rgba(10,10,12,0.85) 100%)" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <p className="text-xs font-mono-tech mb-2" style={{ color: "#FB923C", letterSpacing: "0.2em" }}>NOSSA MISSÃO</p>
            <h3 className="text-2xl md:text-3xl font-bold font-mono-tech mm-text-metal">
              Garantir que o trabalho<br />nunca pare.
            </h3>
          </div>
        </div>
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, #1D4ED8, #FB923C, #1D4ED8)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, #1D4ED8, #FB923C, #1D4ED8)" }} />
      </section>

      {/* ── MARCAS ── */}
      <section style={{ background: "#17171A", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="text-center text-xs font-mono-tech mb-8" style={{ color: "#374151", letterSpacing: "0.2em" }}>
            MARCAS COMPATÍVEIS EM NOSSO CATÁLOGO
          </p>
          <div className="flex items-center justify-center flex-wrap gap-3">
            {MARCAS.map((marca) => (
              <div key={marca} className="px-5 py-2.5 font-bold font-mono-tech text-sm mm-cat-card" style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                color: "#6B7280", borderRadius: "2px", letterSpacing: "0.1em",
              }}>
                {marca.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VISÃO + imagem ── */}
      <section className="py-20 px-4 relative overflow-hidden" style={{ background: "#0A0A0C" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch">
          <div className="relative overflow-hidden" style={{ minHeight: 320, borderRadius: "4px 0 0 4px" }}>
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
              alt="Peças de precisão"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent 60%, rgba(10,10,12,0.9) 100%)" }} />
          </div>
          <div className="flex flex-col justify-center p-8 md:p-12" style={{
            background: "rgba(29,78,216,0.06)", border: "1px solid rgba(29,78,216,0.2)", borderRadius: "0 4px 4px 0",
          }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-[2px]" style={{ background: "#4ADE80" }} />
              <span className="text-xs font-mono-tech" style={{ color: "#4ADE80", letterSpacing: "0.15em" }}>NOSSA VISÃO</span>
            </div>
            <h2 className="text-2xl font-bold font-mono-tech mb-4" style={{ color: "#F3F4F6", lineHeight: 1.3 }}>Movendo o Progresso do Brasil.</h2>
            <p style={{ color: "#9CA3AF", fontSize: "16px", lineHeight: 1.85 }}>
              Ser a <strong style={{ color: "#F3F4F6" }}>primeira escolha de todo revendedor</strong> que busca confiança. Trabalhamos para eliminar a complexidade na busca por peças, oferecendo uma plataforma onde a informação é clara e o pedido é ágil.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
              {[
                { icon: Target, title: "1ª Escolha", color: "#FB923C" },
                { icon: Cpu, title: "Tecnologia Ágil", color: "#1D4ED8" },
                { icon: Zap, title: "Parceria Real", color: "#4ADE80" },
              ].map((item) => (
                <div key={item.title} className="p-3 flex items-center gap-2.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "2px" }}>
                  <item.icon className="w-4 h-4 flex-shrink-0" style={{ color: item.color }} />
                  <span className="text-xs font-mono-tech" style={{ color: "#E5E7EB" }}>{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TECNOLOGIA ── */}
      <section className="py-20 px-4 relative overflow-hidden" style={{ background: "linear-gradient(145deg, #17171A, #1F1F23)" }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(29,78,216,0.08) 20px, rgba(29,78,216,0.08) 21px)",
        }} />
        <div className="relative max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" style={{ zIndex: 2 }}>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-[2px]" style={{ background: "#1D4ED8" }} />
              <span className="text-xs font-mono-tech" style={{ color: "#1D4ED8", letterSpacing: "0.15em" }}>PLATAFORMA DIGITAL</span>
            </div>
            <h2 className="text-3xl font-bold font-mono-tech mb-5" style={{ color: "#F3F4F6", lineHeight: 1.3 }}>
              Tecnologia a Serviço<br />do Lojista.
            </h2>
            <p style={{ color: "#9CA3AF", fontSize: "16px", lineHeight: 1.85 }}>
              Nosso <strong style={{ color: "#F3F4F6" }}>Assistente de Reposição Inteligente</strong> permite localizar a peça exata pelo SKU ou compatibilidade em segundos, com cotação instantânea via WhatsApp B2B.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link to={createPageUrl("Catalogo")}>
                <button className="flex items-center gap-2 px-5 h-10 text-sm font-mono-tech font-bold mm-btn-tactile" style={{
                  background: "linear-gradient(135deg, #1D4ED8, #2563EB)", color: "#fff", borderRadius: "2px", border: "none",
                  boxShadow: "0 4px 16px rgba(29,78,216,0.3)",
                }}>
                  <Cpu className="w-4 h-4" /> ACESSAR O CATÁLOGO
                </button>
              </Link>
              <a href="https://api.whatsapp.com/send?phone=5511999999999&text=Olá, MotorMoura!" target="_blank" rel="noopener noreferrer">
                <button className="flex items-center gap-2 px-5 h-10 text-sm font-mono-tech mm-btn-tactile" style={{
                  background: "rgba(22,163,74,0.12)", border: "1px solid rgba(22,163,74,0.35)", color: "#4ADE80", borderRadius: "2px",
                }}>
                  <MessageCircle className="w-4 h-4" /> FALAR NO WHATSAPP
                </button>
              </a>
            </div>
          </div>

          <div className="p-6" style={{ background: "rgba(29,78,216,0.06)", border: "1px solid rgba(29,78,216,0.25)", borderRadius: "4px" }}>
            <div className="flex items-center gap-2 mb-5 pb-4" style={{ borderBottom: "1px solid rgba(29,78,216,0.15)" }}>
              <Cpu className="w-4 h-4" style={{ color: "#1D4ED8" }} />
              <span className="text-xs font-mono-tech" style={{ color: "#60A5FA", letterSpacing: "0.1em" }}>ASSISTENTE DE REPOSIÇÃO v2.0</span>
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#4ADE80] mm-data-blink" />
            </div>
            {[
              { label: "BUSCA POR SKU", value: "Código → Peça em segundos", color: "#93C5FD" },
              { label: "MULTI-MARCAS", value: "Honda, Toyama, Branco e mais", color: "#FB923C" },
              { label: "FILTROS AVANÇADOS", value: "Linha, tipo de peça, marca", color: "#4ADE80" },
              { label: "COTAÇÃO DIRETA", value: "WhatsApp B2B instantâneo", color: "#60A5FA" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span className="text-xs font-mono-tech" style={{ color: "#374151" }}>{item.label}</span>
                <span className="text-xs font-mono-tech" style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="py-20 px-4 relative overflow-hidden" style={{ background: "linear-gradient(145deg, #27272C, #1F1F23)" }}>
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, #1D4ED8, #FB923C, #1D4ED8)" }} />
        <div className="relative max-w-2xl mx-auto text-center" style={{ zIndex: 2 }}>
          <Quote className="w-8 h-8 mx-auto mb-4 opacity-20" style={{ color: "#FB923C" }} />
          <h2 className="text-2xl md:text-3xl font-bold font-mono-tech mb-4" style={{ color: "#F3F4F6", lineHeight: 1.3 }}>
            Potencialize seu estoque com<br />quem entende de mecânica.
          </h2>
          <p className="mb-8" style={{ color: "#9CA3AF", fontSize: "16px", lineHeight: 1.75 }}>
            Junte-se à rede de lojistas que confiam na MotorMoura para nunca deixar o cliente na mão.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={createPageUrl("MinhaConta")}>
              <button className="mm-btn-tactile mm-glow-orange inline-flex items-center gap-2 px-8 font-bold font-mono-tech text-sm" style={{
                background: "linear-gradient(135deg, #FB923C, #EA7C28)", color: "#fff", borderRadius: "2px", border: "none", height: "52px",
              }}>
                QUERO SER REVENDEDOR <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link to={createPageUrl("Catalogo")}>
              <button className="inline-flex items-center gap-2 px-8 font-mono-tech text-sm mm-btn-tactile" style={{
                background: "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "#6B7280", borderRadius: "2px", height: "52px",
              }}>
                VER CATÁLOGO
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
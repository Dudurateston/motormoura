import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronRight, Shield, Truck, Cpu, Zap, Award, Package, Globe, Target, ArrowRight } from "lucide-react";

const MARCAS = ["Honda", "Toyama", "Tekna", "Branco", "Buffalo", "Husqvarna"];

const NUMEROS = [
  { valor: "+1.000", label: "PEÇAS EM CATÁLOGO", color: "#FB923C" },
  { valor: "6+", label: "MARCAS COMPATÍVEIS", color: "#1D4ED8" },
  { valor: "100%", label: "SUPORTE TÉCNICO B2B", color: "#4ADE80" },
  { valor: "BR", label: "ENVIO NACIONAL", color: "#FB923C" },
];

const DIFERENCIAIS = [
  {
    icon: Package,
    title: "Portfólio Multimarcas",
    desc: "Oferecemos a linha mais completa de reposição para as gigantes do mercado, incluindo Honda, Toyama, Tekna, Branco, Buffalo e Husqvarna. São mais de 1.000 itens catalogados para atender qualquer demanda com precisão cirúrgica.",
    color: "#FB923C",
  },
  {
    icon: Award,
    title: "Qualidade White-Label Premium",
    desc: "Nossas peças são importadas seguindo especificações técnicas rigorosas, oferecendo uma alternativa de alto desempenho que equilibra custo e longevidade.",
    color: "#1D4ED8",
  },
  {
    icon: Truck,
    title: "Logística de Escala",
    desc: "Estruturados para operações B2B de grande volume, garantimos que sua loja tenha o estoque necessário para nunca perder uma venda.",
    color: "#4ADE80",
  },
];

export default function Sobre() {
  return (
    <div className="mm-bg min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(145deg, #0A0A0C 0%, #15151A 60%, #0A0A0C 100%)", paddingTop: "80px", paddingBottom: "80px" }}>
        {/* Blueprint grid */}
        <div className="absolute inset-0 opacity-[0.035]" style={{
          backgroundImage: "linear-gradient(rgba(29,78,216,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(29,78,216,0.9) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(29,78,216,0.07) 0%, transparent 70%)",
        }} />

        <div className="relative max-w-4xl mx-auto px-4 text-center" style={{ zIndex: 2 }}>
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 text-xs font-mono-tech" style={{
            background: "rgba(29,78,216,0.15)", border: "1px solid rgba(29,78,216,0.4)", color: "#93C5FD", borderRadius: "2px",
          }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] mm-data-blink inline-block" />
            SOBRE A MOTORMOURA · DISTRIBUIDORA TÉCNICA B2B
          </div>

          <h1 className="mb-4 font-mono-tech" style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 700, lineHeight: 1.2 }}>
            <span className="mm-text-metal block">ENGENHARIA GLOBAL,</span>
            <span className="mm-text-orange block">SUPORTE LOCAL.</span>
          </h1>

          <p className="mx-auto" style={{ color: "#9CA3AF", fontSize: "18px", lineHeight: 1.8, maxWidth: 560 }}>
            Especialistas em equipamentos que trabalham com você.
          </p>
        </div>
      </section>

      {/* ── NÚMEROS ────────────────────────────────────────────── */}
      <section style={{ background: "#17171A", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {NUMEROS.map((n) => (
            <div key={n.label} className="text-center p-5 relative overflow-hidden" style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px",
            }}>
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${n.color}, transparent)` }} />
              <p className="font-bold font-mono-tech mb-1" style={{ color: n.color, fontSize: "32px", lineHeight: 1 }}>{n.valor}</p>
              <p className="text-xs font-mono-tech" style={{ color: "#4B5563", letterSpacing: "0.1em" }}>{n.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SOBRE ──────────────────────────────────────────────── */}
      <section className="py-20 px-4" style={{ background: "#1F1F23" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Copy */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-[2px]" style={{ background: "#FB923C" }} />
              <span className="text-xs font-mono-tech" style={{ color: "#FB923C", letterSpacing: "0.15em" }}>A NOSSA HISTÓRIA</span>
            </div>
            <h2 className="text-3xl font-bold font-mono-tech mb-6" style={{ color: "#F3F4F6", lineHeight: 1.3 }}>
              Quem Somos
            </h2>
            <div className="space-y-4" style={{ color: "#9CA3AF", fontSize: "16px", lineHeight: 1.85 }}>
              <p>
                A <strong style={{ color: "#F3F4F6" }}>MotorMoura Equipamentos e Acessórios</strong> nasceu da necessidade de entregar precisão técnica e disponibilidade imediata para o mercado de força e energia no Brasil. Como uma distribuidora importadora especializada, conectamos a alta tecnologia de fabricação global diretamente ao balcão dos melhores lojistas e oficinas do país.
              </p>
              <p>
                Não apenas vendemos peças; nós <strong style={{ color: "#FB923C" }}>garantimos que o trabalho não pare</strong>. Nossa expertise reside na curadoria rigorosa de componentes para motores estacionários, geradores e motobombas, assegurando que cada item em nosso catálogo atenda aos mais altos padrões de durabilidade e performance.
              </p>
            </div>
          </div>

          {/* Visual panel */}
          <div className="relative" style={{ minHeight: 320 }}>
            <div className="absolute inset-0" style={{
              background: "linear-gradient(145deg, rgba(29,78,216,0.08), rgba(251,146,60,0.06))",
              border: "1px solid rgba(29,78,216,0.25)",
              borderRadius: "4px",
            }} />
            {/* Corner marks */}
            {["top-3 left-3 border-t border-l", "top-3 right-3 border-t border-r", "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r"].map((cls, i) => (
              <div key={i} className={`absolute w-5 h-5 opacity-60 ${cls}`} style={{ borderColor: "#FB923C" }} />
            ))}
            <div className="relative p-8 h-full flex flex-col justify-center gap-5" style={{ zIndex: 1 }}>
              {[
                { icon: Globe, label: "ORIGEM", value: "Importação Direta Internacional", color: "#1D4ED8" },
                { icon: Shield, label: "PADRÃO", value: "Especificação Técnica Rigorosa", color: "#FB923C" },
                { icon: Zap, label: "SEGMENTO", value: "Motores, Geradores, Motobombas", color: "#4ADE80" },
                { icon: Cpu, label: "PLATAFORMA", value: "B2B Digital — Catálogo + Cotação", color: "#93C5FD" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{
                    background: `${item.color}18`, border: `1px solid ${item.color}40`, borderRadius: "2px",
                  }}>
                    <item.icon className="w-4 h-4" style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-xs font-mono-tech" style={{ color: "#4B5563" }}>{item.label}</p>
                    <p className="text-sm font-medium" style={{ color: "#E5E7EB" }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DIFERENCIAIS ───────────────────────────────────────── */}
      <section className="py-20 px-4" style={{ background: "linear-gradient(145deg, #0A0A0C, #15151A)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-5 h-[2px]" style={{ background: "#1D4ED8" }} />
              <span className="text-xs font-mono-tech" style={{ color: "#1D4ED8", letterSpacing: "0.15em" }}>DIFERENCIAIS COMPETITIVOS</span>
              <div className="w-5 h-[2px]" style={{ background: "#1D4ED8" }} />
            </div>
            <h2 className="text-3xl font-bold font-mono-tech" style={{ color: "#F3F4F6" }}>
              O Elo Mais Forte da Sua<br />Cadeia de Suprimentos.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {DIFERENCIAIS.map((d, i) => (
              <div key={i} className="p-6 relative overflow-hidden" style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "4px",
              }}>
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${d.color}, transparent)` }} />
                <div className="w-11 h-11 flex items-center justify-center mb-4" style={{
                  background: `${d.color}18`, border: `1px solid ${d.color}40`, borderRadius: "2px",
                }}>
                  <d.icon className="w-5 h-5" style={{ color: d.color }} />
                </div>
                <h3 className="font-bold font-mono-tech text-sm mb-3" style={{ color: "#F3F4F6", letterSpacing: "0.05em" }}>{d.title}</h3>
                <p style={{ color: "#6B7280", fontSize: "15px", lineHeight: 1.75 }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARCAS CAROUSEL ────────────────────────────────────── */}
      <section style={{ background: "#17171A", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="text-center text-xs font-mono-tech mb-8" style={{ color: "#374151", letterSpacing: "0.2em" }}>
            MARCAS COMPATÍVEIS EM NOSSO CATÁLOGO
          </p>
          <div className="flex items-center justify-center flex-wrap gap-3">
            {MARCAS.map((marca) => (
              <div key={marca} className="px-5 py-2.5 font-bold font-mono-tech text-sm" style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                color: "#6B7280", borderRadius: "2px", letterSpacing: "0.1em",
              }}>
                {marca.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OBJETIVOS ──────────────────────────────────────────── */}
      <section className="py-20 px-4" style={{ background: "#1F1F23" }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-5 h-[2px]" style={{ background: "#4ADE80" }} />
            <span className="text-xs font-mono-tech" style={{ color: "#4ADE80", letterSpacing: "0.15em" }}>NOSSA VISÃO</span>
            <div className="w-5 h-[2px]" style={{ background: "#4ADE80" }} />
          </div>
          <h2 className="text-3xl font-bold font-mono-tech mb-6" style={{ color: "#F3F4F6" }}>
            Movendo o Progresso do Brasil.
          </h2>
          <p style={{ color: "#9CA3AF", fontSize: "17px", lineHeight: 1.85, maxWidth: 680, margin: "0 auto" }}>
            Nosso objetivo é ser a <strong style={{ color: "#F3F4F6" }}>primeira escolha de todo revendedor e mecânico</strong> que busca confiança. Trabalhamos para eliminar a complexidade na busca por peças de reposição, oferecendo uma plataforma tecnológica onde a informação é clara e o pedido é ágil. Queremos ser mais que um fornecedor: queremos ser <strong style={{ color: "#FB923C" }}>o motor que impulsiona o crescimento do seu negócio</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
            {[
              { icon: Target, title: "1ª Escolha", desc: "De todo revendedor que busca confiança e precisão técnica.", color: "#FB923C" },
              { icon: Cpu, title: "Tecnologia Ágil", desc: "Plataforma onde a informação é clara e o pedido é rápido.", color: "#1D4ED8" },
              { icon: Zap, title: "Parceria Real", desc: "Muito mais que fornecedor — motor do seu crescimento.", color: "#4ADE80" },
            ].map((item) => (
              <div key={item.title} className="p-5 text-left" style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px",
              }}>
                <div className="w-9 h-9 flex items-center justify-center mb-3" style={{
                  background: `${item.color}18`, border: `1px solid ${item.color}40`, borderRadius: "2px",
                }}>
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <h4 className="font-bold font-mono-tech text-sm mb-2" style={{ color: "#F3F4F6" }}>{item.title}</h4>
                <p style={{ color: "#6B7280", fontSize: "14px", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECNOLOGIA ─────────────────────────────────────────── */}
      <section className="py-20 px-4 relative overflow-hidden" style={{ background: "linear-gradient(145deg, #0A0A0C, #15151A)" }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(29,78,216,0.08) 20px, rgba(29,78,216,0.08) 21px)",
        }} />
        <div className="relative max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" style={{ zIndex: 2 }}>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-[2px]" style={{ background: "#1D4ED8" }} />
              <span className="text-xs font-mono-tech" style={{ color: "#1D4ED8", letterSpacing: "0.15em" }}>DESTAQUE TECNOLÓGICO</span>
            </div>
            <h2 className="text-3xl font-bold font-mono-tech mb-5" style={{ color: "#F3F4F6", lineHeight: 1.3 }}>
              Tecnologia a Serviço<br />do Lojista.
            </h2>
            <p style={{ color: "#9CA3AF", fontSize: "16px", lineHeight: 1.85 }}>
              Diferente de catálogos estáticos e processos lentos, a MotorMoura investe em ferramentas que facilitam o seu dia a dia. Nosso <strong style={{ color: "#F3F4F6" }}>Assistente de Reposição Inteligente</strong> foi desenhado para que você encontre a peça exata pelo código SKU ou compatibilidade em segundos, otimizando o seu tempo e garantindo o atendimento perfeito ao seu cliente final.
            </p>
            <Link to={createPageUrl("Catalogo")}>
              <button className="mt-6 flex items-center gap-2 px-5 h-10 text-sm font-mono-tech font-bold mm-btn-tactile" style={{
                background: "linear-gradient(135deg, #1D4ED8, #2563EB)", color: "#fff", borderRadius: "2px", border: "none",
                boxShadow: "0 4px 16px rgba(29,78,216,0.3)",
              }}>
                <Cpu className="w-4 h-4" /> ACESSAR O CATÁLOGO
              </button>
            </Link>
          </div>

          <div className="p-6" style={{
            background: "rgba(29,78,216,0.06)", border: "1px solid rgba(29,78,216,0.25)",
            borderRadius: "4px",
          }}>
            <div className="flex items-center gap-2 mb-5 pb-4" style={{ borderBottom: "1px solid rgba(29,78,216,0.15)" }}>
              <Cpu className="w-4 h-4" style={{ color: "#1D4ED8" }} />
              <span className="text-xs font-mono-tech" style={{ color: "#60A5FA", letterSpacing: "0.1em" }}>ASSISTENTE DE REPOSIÇÃO v2.0</span>
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#4ADE80] mm-data-blink" />
            </div>
            {[
              { label: "BUSCA POR SKU", value: "Código → Peça em segundos", color: "#93C5FD" },
              { label: "MULTI-MARCAS", value: "Honda, Toyama, Branco e mais", color: "#FB923C" },
              { label: "FILTROS AVANÇADOS", value: "Categoria, marca, palavra-chave", color: "#4ADE80" },
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

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="py-20 px-4 relative overflow-hidden" style={{ background: "linear-gradient(145deg, #27272C, #1F1F23)" }}>
        <div className="absolute inset-0 h-[2px] top-0" style={{ background: "linear-gradient(90deg, #1D4ED8, #FB923C, #1D4ED8)" }} />
        <div className="relative max-w-2xl mx-auto text-center" style={{ zIndex: 2 }}>
          <h2 className="text-2xl md:text-3xl font-bold font-mono-tech mb-4" style={{ color: "#F3F4F6", lineHeight: 1.3 }}>
            Potencialize seu estoque com<br />quem entende de mecânica.
          </h2>
          <p className="mb-8" style={{ color: "#9CA3AF", fontSize: "16px", lineHeight: 1.75 }}>
            Junte-se à rede de lojistas e oficinas que confiam na MotorMoura para nunca deixar o cliente na mão.
          </p>
          <Link to={createPageUrl("MinhaConta")}>
            <button className="mm-btn-tactile mm-glow-orange inline-flex items-center gap-2 px-8 h-13 font-bold font-mono-tech text-sm" style={{
              background: "linear-gradient(135deg, #FB923C, #EA7C28)", color: "#fff", borderRadius: "2px", border: "none",
              padding: "0 32px", height: "52px", fontSize: "13px",
            }}>
              QUERO SER UM REVENDEDOR PARCEIRO <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
}
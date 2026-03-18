import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Settings, Package, DollarSign, MessageCircle, ChevronRight } from "lucide-react";

import { whatsappUrl } from "@/lib/config";
const WA_LINK = whatsappUrl("Olá, preciso de ajuda técnica!");

const HERO_BG = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a2232aaedb3f01dfc43e13/dc4446f88_BackgroundPatternIndustrial-MOTORMOURA.png";
const IMG_EXPERTISE = "https://media.base44.com/images/public/69a2232aaedb3f01dfc43e13/29ae079cf_SobreMOTORMOURA-ExpertiseTcnica.png";
const IMG_B2B = "https://media.base44.com/images/public/69a2232aaedb3f01dfc43e13/a37c8a934_SobreMOTORMOURA-ValoreseMisso.png";
const IMG_ESTOQUE = "https://media.base44.com/images/public/69a2232aaedb3f01dfc43e13/f6d3c0ae0_SobreMOTORMOURA-EstoqueLocalFortaleza.png";

export default function Sobre() {
  return (
    <div style={{ background: "#F8F9FA", color: "#212529", fontFamily: "'Space Grotesk', sans-serif" }}>

      {/* ── SEÇÃO 1: HERO ── */}
      <section
        className="relative flex items-center justify-center min-h-[520px] md:min-h-[600px] overflow-hidden"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0" style={{ background: "rgba(10,10,12,0.72)" }} />
        {/* Blueprint accent line */}
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(90deg, #1D4ED8, #E53935, #1D4ED8)" }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
          <div className="flex items-center justify-center gap-2 mb-5">
            <div className="w-8 h-[2px]" style={{ background: "#E53935" }} />
            <span className="text-xs font-mono-tech tracking-widest" style={{ color: "#E53935" }}>MOTORMOURA · DISTRIBUIDORA TÉCNICA</span>
            <div className="w-8 h-[2px]" style={{ background: "#E53935" }} />
          </div>

          <h1
            className="text-4xl md:text-6xl font-bold font-mono-tech mb-5 leading-tight"
            style={{ color: "#FFFFFF" }}
          >
            A Peça Certa.<br />
            <span style={{ color: "#E53935" }}>No Momento Exato.</span>
          </h1>

          <p className="text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: "#CBD5E1" }}>
            Distribuidora técnica focada em peças de reposição de alto giro para motores, geradores e motobombas. Do Ceará para o Brasil.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={createPageUrl("Catalogo")}>
              <button
                className="flex items-center gap-2 px-8 h-12 text-sm font-mono-tech font-bold mm-btn-tactile"
                style={{ background: "linear-gradient(135deg, #E53935, #C62828)", color: "#fff", borderRadius: "2px", border: "none", boxShadow: "0 4px 20px rgba(229,57,53,0.35)" }}
              >
                Explorar Peças de Alto Giro <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
              <button
                className="flex items-center gap-2 px-8 h-12 text-sm font-mono-tech font-bold mm-btn-tactile"
                style={{ background: "linear-gradient(135deg, #25D366, #1DA851)", color: "#fff", borderRadius: "2px", border: "none", boxShadow: "0 4px 20px rgba(37,211,102,0.25)" }}
              >
                <MessageCircle className="w-4 h-4" />
                Falar com um Especialista Técnico
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 2: MANIFESTO DA MARCA ── */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* Coluna Esquerda: Texto */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-[2px]" style={{ background: "#E53935" }} />
              <span className="text-xs font-mono-tech tracking-widest" style={{ color: "#E53935" }}>NOSSA MISSÃO</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-mono-tech mb-6 leading-snug" style={{ color: "#212529" }}>
              Nascemos para que o trabalho não pare.
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: "#495057", lineHeight: 1.8 }}>
              A máquina parada é o maior prejuízo de frotistas e oficinas. A <strong>MOTORMOURA</strong> é a sua parceira estratégica estruturada para eliminar esse gargalo. Garantimos a disponibilidade imediata e a precisão técnica dos componentes de alto giro que o seu cliente exige todos os dias, fazendo com que o seu balcão venda mais e o trabalho no campo nunca pare.
            </p>
            <div className="flex flex-col gap-3">
              {[
                "Importação direta sem intermediários",
                "Estoque dedicado para pronta entrega",
                "Suporte técnico especializado",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#E53935" }} />
                  <span className="text-sm font-mono-tech" style={{ color: "#495057" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Coluna Direita: Imagem */}
          <div className="relative">
            <div
              className="absolute -top-4 -left-4 w-full h-full"
              style={{ border: "2px solid rgba(229,57,53,0.2)", borderRadius: "4px", zIndex: 0 }}
            />
            <img
              src={IMG_B2B}
              alt="MOTORMOURA Parceria B2B"
              className="relative z-10 w-full object-cover"
              style={{ borderRadius: "4px", maxHeight: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}
            />
            <div
              className="absolute -bottom-3 -right-3 px-4 py-2 font-mono-tech text-xs font-bold z-20"
              style={{ background: "#E53935", color: "#fff", borderRadius: "2px" }}
            >
              PARCERIA B2B
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 3: OS 3 PILARES ── */}
      <section style={{ background: "#212529" }} className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-5 h-[2px]" style={{ background: "#E53935" }} />
              <span className="text-xs font-mono-tech tracking-widest" style={{ color: "#E53935" }}>POR QUE A MOTORMOURA</span>
              <div className="w-5 h-[2px]" style={{ background: "#E53935" }} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-mono-tech" style={{ color: "#FFFFFF" }}>
              Três Pilares. Uma Promessa.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 - Curadoria com imagem */}
            <div
              className="relative overflow-hidden group"
              style={{ borderRadius: "4px", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="h-52 overflow-hidden">
                <img
                  src={IMG_EXPERTISE}
                  alt="Curadoria Técnica"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6" style={{ background: "#2D3239" }}>
                <div
                  className="w-10 h-10 flex items-center justify-center mb-4 -mt-10 relative z-10"
                  style={{ background: "#E53935", borderRadius: "2px" }}
                >
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold font-mono-tech mb-2" style={{ color: "#FFFFFF" }}>Curadoria Técnica</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
                  Peças com padrão de linha de montagem para zerar o seu índice de retorno (RMA).
                </p>
              </div>
            </div>

            {/* Card 2 - Estoque com imagem */}
            <div
              className="relative overflow-hidden group"
              style={{ borderRadius: "4px", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="h-52 overflow-hidden">
                <img
                  src={IMG_ESTOQUE}
                  alt="Pronta Entrega"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6" style={{ background: "#2D3239" }}>
                <div
                  className="w-10 h-10 flex items-center justify-center mb-4 -mt-10 relative z-10"
                  style={{ background: "#1D4ED8", borderRadius: "2px" }}
                >
                  <Package className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold font-mono-tech mb-2" style={{ color: "#FFFFFF" }}>Pronta Entrega</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
                  Estoque inteligente em Fortaleza-CE para despacho ágil em todo Norte e Nordeste.
                </p>
              </div>
            </div>

            {/* Card 3 - Margem sem imagem mas com visual forte */}
            <div
              className="relative overflow-hidden"
              style={{ borderRadius: "4px", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div
                className="h-52 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, rgba(29,78,216,0.3) 0%, rgba(229,57,53,0.2) 100%), url(${HERO_BG})`,
                  backgroundSize: "cover",
                }}
              >
                <div className="text-center px-6">
                  <p className="text-5xl font-bold font-mono-tech" style={{ color: "#FFFFFF" }}>+40%</p>
                  <p className="text-xs font-mono-tech mt-1 tracking-wider" style={{ color: "#CBD5E1" }}>DE MARGEM MÉDIA</p>
                </div>
              </div>
              <div className="p-6" style={{ background: "#2D3239" }}>
                <div
                  className="w-10 h-10 flex items-center justify-center mb-4 -mt-10 relative z-10"
                  style={{ background: "#16A34A", borderRadius: "2px" }}
                >
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold font-mono-tech mb-2" style={{ color: "#FFFFFF" }}>Margem de Lucro</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
                  Preço direto de importador. Cortamos os intermediários para a sua loja lucrar mais.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 4: QUEBRA DE OBJEÇÃO ── */}
      <section style={{ background: "#E9ECEF" }} className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-5 h-[2px]" style={{ background: "#E53935" }} />
            <span className="text-xs font-mono-tech tracking-widest" style={{ color: "#E53935" }}>SUPORTE ESPECIALIZADO</span>
            <div className="w-5 h-[2px]" style={{ background: "#E53935" }} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-mono-tech mb-4" style={{ color: "#212529" }}>
            Dúvida sobre compatibilidade ou aplicação?
          </h2>
          <p className="text-base md:text-lg mb-8 max-w-2xl mx-auto" style={{ color: "#495057", lineHeight: 1.8 }}>
            Não perca tempo procurando códigos. Nossa equipe respira mecânica e está pronta para indicar a peça exata para a sua máquina.
          </p>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
            <button
              className="flex items-center gap-2 mx-auto px-8 h-12 text-sm font-mono-tech font-bold mm-btn-tactile"
              style={{ background: "linear-gradient(135deg, #25D366, #1DA851)", color: "#fff", borderRadius: "2px", border: "none", boxShadow: "0 4px 20px rgba(37,211,102,0.25)" }}
            >
              <MessageCircle className="w-4 h-4" />
              Falar com um Especialista Técnico
            </button>
          </a>
        </div>
      </section>

      {/* ── SEÇÃO 5: CONVERSÃO FINAL ── */}
      <section
        className="relative overflow-hidden py-24 md:py-32"
        style={{ background: "#212529" }}
      >
        {/* Background pattern overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${HERO_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(90deg, #1D4ED8, #E53935, #1D4ED8)" }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-5">
            <div className="w-5 h-[2px]" style={{ background: "#E53935" }} />
            <span className="text-xs font-mono-tech tracking-widest" style={{ color: "#E53935" }}>ACESSO B2B</span>
            <div className="w-5 h-[2px]" style={{ background: "#E53935" }} />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-mono-tech mb-5 leading-tight" style={{ color: "#FFFFFF" }}>
            Pronto para aumentar a margem do seu balcão?
          </h2>
          <p className="text-base md:text-lg mb-10 max-w-2xl mx-auto" style={{ color: "#9CA3AF", lineHeight: 1.8 }}>
            Junte-se a lojistas e frotistas que já otimizam suas compras com a MOTORMOURA. Cadastro rápido e aprovação imediata para CNPJ.
          </p>
          <Link to={createPageUrl("MinhaConta")}>
            <button
              className="flex items-center gap-2 mx-auto px-10 h-14 text-sm font-mono-tech font-bold mm-btn-tactile"
              style={{ background: "linear-gradient(135deg, #E53935, #C62828)", color: "#fff", borderRadius: "2px", border: "none", boxShadow: "0 6px 28px rgba(229,57,53,0.4)", fontSize: "0.9rem" }}
            >
              Desbloquear Preços de Atacado <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
          <p className="text-xs font-mono-tech mt-4" style={{ color: "#6B7280" }}>
            EXCLUSIVO PARA CNPJ · SEM MENSALIDADE · APROVAÇÃO IMEDIATA
          </p>
        </div>
      </section>

    </div>
  );
}
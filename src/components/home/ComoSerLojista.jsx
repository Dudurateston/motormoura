import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ClipboardList, Tag, Package, ChevronRight } from "lucide-react";

const STEPS = [
  {
    num: "01",
    Icon: ClipboardList,
    title: "Cadastre seu CNPJ",
    desc: "Crie sua conta gratuitamente, informe o CNPJ da sua empresa e preencha os dados da loja no painel.",
    color: "#D32F2F",
  },
  {
    num: "02",
    Icon: Tag,
    title: "Acesse Preços de Atacado",
    desc: "Após validação em até 24h, você desbloqueia o catálogo completo com preços exclusivos para revendedores.",
    color: "#1D4ED8",
  },
  {
    num: "03",
    Icon: Package,
    title: "Receba em Lote",
    desc: "Monte sua cotação, envie via WhatsApp e receba com logística dedicada para todo o Brasil.",
    color: "#15803D",
  },
];

export default function ComoSerLojista() {
  return (
    <section className="py-16 px-4" style={{
      background: "#FFFFFF",
      borderTop: "1px solid #E2E8F0",
    }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-[2px]" style={{ background: "#D32F2F" }} />
            <span className="text-xs font-mono-tech" style={{ color: "#D32F2F", letterSpacing: "0.15em" }}>PROGRAMA DE PARCERIAS</span>
            <div className="w-6 h-[2px]" style={{ background: "#D32F2F" }} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-mono-tech" style={{ color: "#212529" }}>
            Como Ser um Lojista Parceiro
          </h2>
          <p className="mt-3 max-w-xl mx-auto" style={{ color: "#6C757D", fontSize: "16px", fontWeight: 400 }}>
            Processo simples e rápido. Em 24 horas você já acessa preços de atacado e monta seus pedidos.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {STEPS.map((step, i) => (
            <div key={step.num} className="relative">
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-full h-[1px] z-0"
                  style={{ background: "linear-gradient(90deg, #E2E8F0, transparent)", transform: "translateX(-50%)", width: "calc(100% - 80px)", left: "90%" }} />
              )}

              <div className="relative p-6 z-10" style={{
                background: "#FFFFFF",
                border: `1px solid ${step.color}25`,
                borderRadius: "4px",
                clipPath: "polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}>
                <div className="text-5xl font-bold font-mono-tech absolute top-4 right-4 opacity-[0.06]"
                  style={{ color: step.color, lineHeight: 1 }}>
                  {step.num}
                </div>

                <div className="w-12 h-12 flex items-center justify-center mb-5" style={{
                  background: `${step.color}10`, border: `1px solid ${step.color}30`, borderRadius: "4px",
                }}>
                  <step.Icon className="w-6 h-6" style={{ color: step.color }} />
                </div>

                <div className="text-xs font-mono-tech mb-2" style={{ color: step.color, letterSpacing: "0.1em" }}>
                  PASSO {step.num}
                </div>

                <h3 className="text-base font-bold mb-3" style={{ color: "#212529", fontFamily: "'Space Mono', monospace" }}>
                  {step.title}
                </h3>

                <p style={{ color: "#6C757D", fontSize: "15px", fontWeight: 400, lineHeight: 1.65 }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to={createPageUrl("MinhaConta")}>
            <button className="mm-btn-tactile inline-flex items-center gap-2 px-8 h-12 font-bold font-mono-tech text-sm" style={{
              background: "linear-gradient(135deg, #D32F2F, #B71C1C)",
              color: "#fff", borderRadius: "2px", border: "none",
              boxShadow: "0 4px 16px rgba(211,47,47,0.25)",
            }}>
              CADASTRAR MINHA EMPRESA <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
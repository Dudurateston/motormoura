import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Zap, MessageCircle, Mail, Instagram, ExternalLink } from "lucide-react";

const CATEGORIAS = [
  "Motores a Gasolina",
  "Motores a Diesel",
  "Motobombas 4 Tempos",
  "Geradores 4 Tempos",
  "Geradores 2 Tempos",
  "Bombas de Pulverização",
];

export default function Footer() {
  return (
    <footer style={{ background: "#0A0A0C", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      {/* Top accent */}
      <div className="h-[2px]" style={{ background: "linear-gradient(90deg, #1D4ED8, #FB923C, #1D4ED8)" }} />

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Col 1: Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="w-8 h-8 flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #FB923C, #EA7C28)",
                clipPath: "polygon(4px 0%, 100% 0%, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0% 100%, 0% 4px)",
              }}
            >
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-base font-mono-tech" style={{ color: "#F3F4F6" }}>Motor</span>
              <span className="font-bold text-base font-mono-tech" style={{ color: "#FB923C" }}>Moura</span>
            </div>
          </div>
          <p style={{ color: "#6B7280", fontSize: "15px", lineHeight: 1.7, marginBottom: "12px" }}>
            Distribuidora técnica especializada em peças de reposição para motores estacionários, geradores e motobombas.
          </p>
          <p className="text-xs font-mono-tech" style={{ color: "#374151" }}>
            CNPJ: 12.345.678/0001-99
          </p>
          <p className="text-xs font-mono-tech mt-1" style={{ color: "#374151" }}>
            São Paulo — SP, Brasil
          </p>
        </div>

        {/* Col 2: Institucional */}
        <div>
          <h4 className="text-xs font-mono-tech mb-4" style={{ color: "#FB923C", letterSpacing: "0.15em" }}>
            INSTITUCIONAL
          </h4>
          <ul className="space-y-2.5">
            {[
              { label: "Sobre a Importadora", page: "MinhaConta" },
              { label: "Seja um Revendedor", page: "MinhaConta" },
              { label: "Política de Garantia", page: "MinhaConta" },
              { label: "Minha Conta", page: "MinhaConta" },
              { label: "Painel Admin", page: "Admin" },
            ].map(link => (
              <li key={link.label}>
                <Link
                  to={createPageUrl(link.page)}
                  className="transition-colors hover:text-[#FB923C]"
                  style={{ color: "#6B7280", fontSize: "15px" }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Catálogo Rápido */}
        <div>
          <h4 className="text-xs font-mono-tech mb-4" style={{ color: "#FB923C", letterSpacing: "0.15em" }}>
            CATÁLOGO RÁPIDO
          </h4>
          <ul className="space-y-2.5">
            {CATEGORIAS.map(cat => (
              <li key={cat}>
                <Link
                  to={createPageUrl("Catalogo") + "?categoria=" + encodeURIComponent(cat)}
                  className="transition-colors hover:text-[#FB923C]"
                  style={{ color: "#6B7280", fontSize: "15px" }}
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Atendimento */}
        <div>
          <h4 className="text-xs font-mono-tech mb-4" style={{ color: "#FB923C", letterSpacing: "0.15em" }}>
            ATENDIMENTO B2B
          </h4>
          <div className="space-y-4">
            <a
              href="https://api.whatsapp.com/send?phone=5511999999999&text=Olá,%20MotorMoura!%20Gostaria%20de%20saber%20mais."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
            >
              <div
                className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(22,163,74,0.15)", border: "1px solid rgba(22,163,74,0.3)", borderRadius: "2px" }}
              >
                <MessageCircle className="w-4 h-4" style={{ color: "#4ADE80" }} />
              </div>
              <div>
                <p className="text-xs font-mono-tech" style={{ color: "#4B5563" }}>WHATSAPP B2B</p>
                <p className="group-hover:text-[#4ADE80] transition-colors" style={{ color: "#9CA3AF", fontSize: "14px" }}>
                  (11) 99999-9999
                </p>
              </div>
            </a>

            <a
              href="mailto:b2b@motormoura.com.br"
              className="flex items-center gap-3 group"
            >
              <div
                className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(29,78,216,0.15)", border: "1px solid rgba(29,78,216,0.3)", borderRadius: "2px" }}
              >
                <Mail className="w-4 h-4" style={{ color: "#60A5FA" }} />
              </div>
              <div>
                <p className="text-xs font-mono-tech" style={{ color: "#4B5563" }}>E-MAIL CORPORATIVO</p>
                <p className="group-hover:text-[#60A5FA] transition-colors" style={{ color: "#9CA3AF", fontSize: "14px" }}>
                  b2b@motormoura.com.br
                </p>
              </div>
            </a>

            <a
              href="https://www.instagram.com/motormouraequipamentos"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
            >
              <div
                className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.25)", borderRadius: "2px" }}
              >
                <Instagram className="w-4 h-4" style={{ color: "#FB923C" }} />
              </div>
              <div>
                <p className="text-xs font-mono-tech" style={{ color: "#4B5563" }}>INSTAGRAM OFICIAL</p>
                <p className="group-hover:text-[#FB923C] transition-colors flex items-center gap-1" style={{ color: "#9CA3AF", fontSize: "14px" }}>
                  @motormouraequipamentos <ExternalLink className="w-3 h-3" />
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="px-4 py-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs font-mono-tech" style={{ color: "#374151" }}>
            © 2026 MOTORMOURA DISTRIBUIDORA — TODOS OS DIREITOS RESERVADOS
          </p>
          <p className="text-xs font-mono-tech" style={{ color: "#1F2937" }}>
            PLATAFORMA B2B · EXCLUSIVA PARA LOJISTAS HOMOLOGADOS
          </p>
        </div>
      </div>
    </footer>
  );
}
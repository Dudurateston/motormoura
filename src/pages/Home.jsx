import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { whatsappUrl } from "@/lib/config";
import SEOHead from "@/components/SEOHead";
import {
  MessageCircle, Zap, Truck, Wrench, Globe, Handshake, CheckCircle2,
  ArrowRight, Package, Clock, Percent, Star, MapPin, Phone, Mail, ChevronRight,
} from "lucide-react";

const MARCAS = [
  { nome: "Honda", sub: "Motores e Equipamentos", logo: "/img/brand/marca_honda.svg" },
  { nome: "Makita", sub: "Ferramentas e Equipamentos", logo: "/img/brand/marca_makita.svg" },
  { nome: "Vibromak", sub: "Construção e Compactação", logo: "/img/brand/marca_vibromak.webp" },
  { nome: "Menegotti", sub: "Equipamentos e Betoneiras", logo: "/img/brand/marca_menegotti.svg" },
];

const DIFERENCIAIS = [
  {
    icon: Clock,
    titulo: "Pronta Entrega",
    texto: "Estoque em Fortaleza. Peça hoje, receba amanhã — sua máquina não para.",
  },
  {
    icon: Truck,
    titulo: "Sem Frete Caro",
    texto: "Elimine a espera e o custo de comprar longe. Estamos na sua região.",
  },
  {
    icon: Wrench,
    titulo: "Compatibilidade Garantida",
    texto: "Peças compatíveis com Honda, Makita, Vibromak e Menegotti. Qualidade testada.",
  },
  {
    icon: Globe,
    titulo: "Portal Inteligente",
    texto: "Busca rápida por SKU. Monte sua lista de cotação em poucos cliques.",
  },
  {
    icon: Handshake,
    titulo: "Atendimento Regional",
    texto: "Falamos a língua do mecânico nordestino. Suporte técnico de verdade.",
  },
];

const PASSOS = [
  { n: 1, texto: "Acesse o site e encontre a peça pelo SKU ou busca inteligente" },
  { n: 2, texto: "Monte sua lista de cotação — ou envie direto no WhatsApp" },
  { n: 3, texto: "Receba preço e prazo na hora, com atendimento humano" },
  { n: 4, texto: "Retire na loja ou receba com entrega rápida (pronta entrega!)" },
];

const FAQ = [
  {
    q: "Vocês entregam fora de Fortaleza?",
    a: "Sim! Entregamos em toda Fortaleza em até 48h e no interior do Ceará e Norte/Nordeste em até 96h.",
  },
  {
    q: "Qual o pedido mínimo para revendedores?",
    a: "R$ 50,00 por pedido. Pagando via PIX acima de R$ 900, você ainda ganha 5% de desconto.",
  },
  {
    q: "Como sei se a peça serve na minha máquina?",
    a: "Nosso time é técnico: manda o modelo no WhatsApp que a gente indica a peça exata para Honda, Makita, Vibromak e Menegotti.",
  },
  {
    q: "Compro direto do Sul e sai mais barato. Por que com vocês?",
    a: "O preço da peça é menor, mas sua máquina fica parada esperando e o frete é alto. Nós entregamos amanhã, com estoque local em Fortaleza. Tempo é dinheiro.",
  },
];

export default function Home() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    base44.entities.Categorias.list({ limit: 12 })
      .then(res => setCategorias((res.data || res || []).filter(c => c.ativa)))
      .catch(() => setCategorias([]));
  }, []);

  return (
    <div style={{ background: "#F9F9F9", color: "#333333" }}>
      <SEOHead
        title="Motormoura Equipamentos | Peças de Reposição e Equipamentos em Fortaleza"
        description="Peças de reposição e equipamentos Honda, Makita, Vibromak e Menegotti com estoque em Fortaleza e pronta entrega. Atacado B2B para lojistas: cotação pelo site ou WhatsApp."
        keywords="peças de reposição, Honda, Makita, Vibromak, Menegotti, Fortaleza, motobomba, motor estacionário, gerador, carburador, partida retrátil, atacado B2B, distribuidora"
      />

      {/* ══ HERO ═══════════════════════════════════════════════ */}
      <section style={{ background: "#FFFFFF" }}>
        <div className="max-w-7xl mx-auto px-4 pt-12 pb-16 md:pt-20 md:pb-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-6"
              style={{ background: "rgba(193,39,45,0.08)", borderRadius: 999 }}
            >
              <span style={{ width: 8, height: 8, background: "#22c55e", borderRadius: "50%", display: "inline-block" }} />
              <span className="text-xs font-bold" style={{ color: "#C1272D", letterSpacing: ".06em" }}>
                ESTOQUE EM FORTALEZA · PRONTA ENTREGA
              </span>
            </div>

            <h1
              style={{ fontSize: "clamp(30px, 4.6vw, 52px)", fontWeight: 800, lineHeight: 1.08, color: "#333333", letterSpacing: "-0.5px" }}
            >
              Reposição imediata de peças e <span style={{ color: "#C1272D" }}>equipamentos</span>
            </h1>

            <p className="mt-5 text-base md:text-lg" style={{ color: "#595959", lineHeight: 1.65, maxWidth: 520 }}>
              Distribuidora B2B multimarcas — <strong style={{ color: "#333333" }}>Honda, Makita, Vibromak e Menegotti</strong>.
              Peça hoje, receba amanhã. Do Ceará para todo o Norte e Nordeste.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href={whatsappUrl("Olá! Vim pelo site e gostaria de fazer uma cotação.")}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-7 py-4 text-sm font-bold"
                style={{ background: "#25D366", color: "#fff", borderRadius: 4 }}
              >
                <MessageCircle className="w-5 h-5" />
                PEDIR ORÇAMENTO NO WHATSAPP
              </a>
              <Link
                to={createPageUrl("Catalogo")}
                className="mm-btn-outline flex items-center justify-center gap-2 px-7 py-4 text-sm"
              >
                VER CATÁLOGO <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {["Resposta em 15–30 min", "Pedido mínimo R$ 50", "5% OFF no PIX acima de R$ 900"].map(t => (
                <span key={t} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#595959" }}>
                  <CheckCircle2 className="w-4 h-4" style={{ color: "#C1272D" }} /> {t}
                </span>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div
              className="w-full flex items-center justify-center"
              style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.07)", padding: "clamp(28px, 5vw, 56px)" }}
            >
              <img
                src="/img/brand/logo_oficial.png"
                alt="Motormoura Equipamentos — logo oficial"
                className="w-full h-auto"
                style={{ maxWidth: 560 }}
                loading="eager"
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { src: "/img/brand/selo_estoque.png", alt: "Estoque em Fortaleza" },
                { src: "/img/brand/selo_pronta_entrega.png", alt: "Pronta Entrega" },
                { src: "/img/brand/selo_parceria_b2b.png", alt: "Parceria B2B" },
              ].map(s => (
                <img key={s.src} src={s.src} alt={s.alt} className="w-full h-auto" style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: 8, padding: 6 }} loading="lazy" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ MARCAS ═════════════════════════════════════════════ */}
      <section style={{ background: "#F9F9F9", borderTop: "1px solid #E5E5E5", borderBottom: "1px solid #E5E5E5" }}>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <p className="text-center text-xs font-bold mb-6" style={{ color: "#808080", letterSpacing: ".15em" }}>
            DISTRIBUIDORA DAS PRINCIPAIS MARCAS
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {MARCAS.map(m => (
              <div
                key={m.nome}
                className="flex flex-col items-center justify-center py-6 px-4"
                style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: 6 }}
              >
                <img src={m.logo} alt={`Logo oficial ${m.nome}`} className="w-auto h-9 md:h-11" style={{ objectFit: "contain" }} loading="lazy" />
                <span className="text-[11px] mt-2" style={{ color: "#808080" }}>{m.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CATEGORIAS ═════════════════════════════════════════ */}
      <section style={{ background: "#F9F9F9" }} id="categorias">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color: "#333333" }}>
              O que você procura?
            </h2>
            <p className="mt-2 text-sm" style={{ color: "#595959" }}>
              Peças de reposição e equipamentos por linha de produto
            </p>
          </div>

          {categorias.length === 0 ? (
            <div className="text-center py-10">
              <Package className="w-10 h-10 mx-auto mb-3" style={{ color: "#BFBFBF" }} />
              <p className="text-sm" style={{ color: "#595959" }}>
                Catálogo em atualização — fale com a gente no WhatsApp que encontramos sua peça.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorias.map(cat => (
                <Link
                  key={cat.id}
                  to={createPageUrl("Catalogo") + "?categoria=" + encodeURIComponent(cat.nome)}
                  className="group flex items-center justify-between p-5 transition-all"
                  style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: 6 }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-11 h-11 flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(193,39,45,0.07)", borderRadius: 6 }}
                    >
                      <Wrench className="w-5 h-5" style={{ color: "#C1272D" }} />
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: "#333333" }}>{cat.nome}</p>
                      <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "#808080" }}>
                        {cat.descricao || "Peças e componentes de reposição"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" style={{ color: "#C1272D" }} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══ POR QUE A MOTORMOURA ═══════════════════════════════ */}
      <section style={{ background: "#FFFFFF", borderTop: "1px solid #E5E5E5" }}>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <p className="text-xs font-bold mb-2" style={{ color: "#C1272D", letterSpacing: ".15em" }}>
              REPOSIÇÃO QUE TRABALHA COM VOCÊ
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color: "#333333" }}>
              Por que comprar com a Motormoura?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DIFERENCIAIS.map((d, i) => (
              <div
                key={d.titulo}
                className="p-6"
                style={{
                  background: "#F9F9F9",
                  border: "1px solid #E5E5E5",
                  borderRadius: 6,
                }}
              >
                <div
                  className="w-11 h-11 flex items-center justify-center mb-4"
                  style={{ background: "rgba(193,39,45,0.08)", borderRadius: 6 }}
                >
                  <d.icon className="w-5 h-5" style={{ color: "#C1272D" }} />
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: "#333333" }}>{d.titulo}</h3>
                <p className="text-sm" style={{ color: "#595959", lineHeight: 1.6 }}>{d.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ COMO COTAR ══════════════════════════════════════════ */}
      <section style={{ background: "#F9F9F9" }}>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color: "#333333" }}>
              Como fazer uma cotação
            </h2>
            <p className="mt-2 text-sm" style={{ color: "#595959" }}>Simples, rápido e sem cadastro para consultar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {PASSOS.map(p => (
              <div key={p.n} className="relative p-6" style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: 6 }}>
                <span
                  className="flex items-center justify-center w-9 h-9 font-extrabold mb-4"
                  style={{ background: "#C1272D", color: "#fff", borderRadius: "50%" }}
                >
                  {p.n}
                </span>
                <p className="text-sm" style={{ color: "#333333", lineHeight: 1.6 }}>{p.texto}</p>
              </div>
            ))}
          </div>

          <div
            className="mt-8 flex items-center justify-center gap-3 py-4 px-6"
            style={{ background: "#C1272D", borderRadius: 6 }}
          >
            <Zap className="w-5 h-5" style={{ color: "#fff" }} />
            <p className="text-sm md:text-base font-bold text-center" style={{ color: "#fff" }}>
              TEMPO MÉDIO DE RESPOSTA: 15–30 MINUTOS
            </p>
          </div>
        </div>
      </section>

      {/* ══ PROGRAMA B2B ════════════════════════════════════════ */}
      <section style={{ background: "#231F20" }}>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-bold mb-2" style={{ color: "#C1272D", letterSpacing: ".15em" }}>
                PROGRAMA DE REVENDEDORES
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                Preço de atacado para o seu balcão
              </h2>
              <p className="mt-4 text-sm md:text-base" style={{ color: "#BFBFBF", lineHeight: 1.7 }}>
                Lojista e revendedor: cadastre-se e compre direto de importador.
                Margem melhor para você, sem mensalidade e sem burocracia.
              </p>
              <Link
                to={createPageUrl("MinhaConta")}
                className="mm-btn-primary inline-flex items-center gap-2 mt-6 px-6 py-3.5 text-sm"
              >
                QUERO SER REVENDEDOR <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Package, v: "R$ 50", l: "pedido mínimo" },
                { icon: Percent, v: "5%", l: "OFF no PIX acima de R$ 900" },
                { icon: Clock, v: "48h/96h", l: "Fortaleza / interior" },
              ].map(b => (
                <div key={b.l} className="p-5 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6 }}>
                  <b.icon className="w-5 h-5 mx-auto mb-3" style={{ color: "#C1272D" }} />
                  <p className="text-xl md:text-2xl font-extrabold text-white">{b.v}</p>
                  <p className="text-[11px] mt-1" style={{ color: "#808080" }}>{b.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FAQ ═════════════════════════════════════════════════ */}
      <section style={{ background: "#F9F9F9" }}>
        <div className="max-w-3xl mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color: "#333333" }}>
              Perguntas frequentes
            </h2>
          </div>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details
                key={i}
                className="p-5"
                style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: 6 }}
              >
                <summary className="font-bold text-sm cursor-pointer" style={{ color: "#333333" }}>
                  {f.q}
                </summary>
                <p className="text-sm mt-3" style={{ color: "#595959", lineHeight: 1.65 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA FINAL ════════════════════════════════════════════ */}
      <section style={{ background: "#C1272D" }}>
        <div className="mm-diagonal" style={{ opacity: 0.35 }} />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white" style={{ lineHeight: 1.15 }}>
            A peça que você precisa,
            <br />
            no momento que você precisa.
          </h2>
          <p className="mt-4 text-sm md:text-base" style={{ color: "rgba(255,255,255,0.85)" }}>
            Fale agora com um especialista técnico — resposta em minutos, não em dias.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={whatsappUrl("Olá! Vim pelo site e gostaria de fazer uma cotação.")}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold"
              style={{ background: "#FFFFFF", color: "#C1272D", borderRadius: 4 }}
            >
              <MessageCircle className="w-5 h-5" /> (85) 98689-4081
            </a>
            <a
              href="mailto:comercial@motormouraequipamentos.com.br"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold"
              style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "2px solid rgba(255,255,255,0.5)", borderRadius: 4 }}
            >
              <Mail className="w-5 h-5" /> comercial@motormouraequipamentos.com.br
            </a>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
            <MapPin className="w-4 h-4" />
            Av. Deputado Paulino Rocha, 2122 — Boa Vista, Castelão · CEP 60867-585 · Fortaleza/CE
          </div>
        </div>
      </section>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const OFICIAIS = ["Honda", "Makita", "Vibromak"];

const OFICIAL_META = {
  Honda: {
    color: "#cc0000",
    bg: "rgba(204,0,0,0.07)",
    border: "rgba(204,0,0,0.3)",
    logo: (
      <svg viewBox="0 0 80 20" style={{ width: 64, height: 16 }} aria-label="Honda">
        <text x="0" y="17" style={{ fontFamily: "'Arial Black', sans-serif", fontSize: 18, fontWeight: 900, fill: "#cc0000", letterSpacing: 1 }}>HONDA</text>
      </svg>
    ),
    tag: "MOTORES · GERADORES · MOTOBOMBAS",
  },
  Makita: {
    color: "#007dc5",
    bg: "rgba(0,125,197,0.07)",
    border: "rgba(0,125,197,0.3)",
    logo: (
      <svg viewBox="0 0 80 20" style={{ width: 64, height: 16 }} aria-label="Makita">
        <text x="0" y="17" style={{ fontFamily: "'Arial Black', sans-serif", fontSize: 16, fontWeight: 900, fill: "#007dc5", fontStyle: "italic" }}>makita</text>
      </svg>
    ),
    tag: "FERRAMENTAS PROFISSIONAIS",
  },
  Vibromak: {
    color: "#e67e00",
    bg: "rgba(230,126,0,0.07)",
    border: "rgba(230,126,0,0.3)",
    logo: (
      <svg viewBox="0 0 90 20" style={{ width: 70, height: 16 }} aria-label="Vibromak">
        <text x="0" y="17" style={{ fontFamily: "'Arial Black', sans-serif", fontSize: 15, fontWeight: 900, fill: "#e67e00" }}>VIBROMAK</text>
      </svg>
    ),
    tag: "CONSTRUÇÃO CIVIL",
  },
};

export default function MarcasSection() {
  const [marcas, setMarcas] = useState([]);

  useEffect(() => {
    base44.entities.MarcasCompativeis.list().then(r => setMarcas(r.filter(m => m.ativa !== false))).catch(() => {});
  }, []);

  // Separate oficiais from others
  const marcasOficiais = OFICIAIS.filter(o => marcas.some(m => m.nome?.toLowerCase() === o.toLowerCase()) || true); // always show 3 oficiais
  const marcasOutras = marcas.filter(m => !OFICIAIS.some(o => o.toLowerCase() === m.nome?.toLowerCase())).map(m => m.nome);

  return (
    <section style={{ background: "#fff", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 28, height: 2, background: '#E53935' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.18em', color: '#E53935', fontFamily: 'monospace' }}>REVENDEDOR OFICIAL</span>
            <div style={{ width: 28, height: 2, background: '#E53935' }} />
          </div>
          <p style={{ fontSize: 12, color: '#9CA3AF', letterSpacing: '.14em', fontFamily: 'monospace' }}>PORTFÓLIO MULTIMARCAS — COMPATIBILIDADE GARANTIDA</p>
        </div>

        {/* Oficial brands — highlighted cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 28 }}>
          {marcasOficiais.map(nome => {
            const meta = OFICIAL_META[nome];
            return (
              <Link key={nome} to={`${createPageUrl("Catalogo")}?q=${encodeURIComponent(nome)}`} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    background: meta.bg,
                    border: `1px solid ${meta.border}`,
                    borderLeft: `4px solid ${meta.color}`,
                    borderRadius: 6,
                    padding: '18px 20px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${meta.color}22`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {/* Official badge */}
                  <div style={{ position: 'absolute', top: 8, right: 8, background: meta.color, color: '#fff', fontSize: 7, fontWeight: 800, padding: '2px 7px', borderRadius: 2, letterSpacing: '.1em', fontFamily: 'monospace' }}>
                    OFICIAL
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: meta.color, fontFamily: "'Arial Black', sans-serif", letterSpacing: 1, marginBottom: 6 }}>
                    {nome.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 8.5, color: meta.color, opacity: 0.7, letterSpacing: '.1em', fontFamily: 'monospace', fontWeight: 700 }}>
                    {meta.tag}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Other compatible brands */}
        {marcasOutras.length > 0 && (
          <>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.16em', color: '#9CA3AF', fontFamily: 'monospace', textAlign: 'center', marginBottom: 12 }}>
              TAMBÉM COMPATÍVEL COM
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {marcasOutras.map(nome => (
                <Link key={nome} to={`${createPageUrl("Catalogo")}?q=${encodeURIComponent(nome)}`} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      background: '#F8F9FA',
                      border: '1px solid #E2E8F0',
                      color: '#6C757D',
                      padding: '6px 14px',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      letterSpacing: '.1em',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(211,47,47,0.35)'; e.currentTarget.style.color = '#D32F2F'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 10px rgba(211,47,47,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#6C757D'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {nome.toUpperCase()}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
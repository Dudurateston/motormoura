import React, { useState, useEffect } from "react";

// Desktop slides — objectPosition ajustado para ponto focal na esquerda/centro
const SLIDES_DESKTOP = [
  "https://media.base44.com/images/public/69a2232aaedb3f01dfc43e13/566e61de7_Hero_1_MOTORMOURA_Destaque.png",
  "https://media.base44.com/images/public/69a2232aaedb3f01dfc43e13/b5385abdc_Hero_2_Revendedor_Oficial.png",
  "https://media.base44.com/images/public/69a2232aaedb3f01dfc43e13/e0ff7fcd8_Hero_3_Pronta_Entrega_Fortaleza.png",
];

// Mobile slides — versões verticais fornecidas pelo usuário
const SLIDES_MOBILE = [
  "https://media.base44.com/images/public/69a2232aaedb3f01dfc43e13/f6cd5bee5_HeroMobile1A-MOTORMOURASutil.png",
  "https://media.base44.com/images/public/69a2232aaedb3f01dfc43e13/9bd2da198_HeroMobile2A-RevendedorOficialSutil.png",
  "https://media.base44.com/images/public/69a2232aaedb3f01dfc43e13/5883aff69_HeroMobile3A-ProntaEntregaSutil.png",
];

// Ponto focal de cada slide (desktop) — alinhado à terça parte esquerda da imagem
const FOCAL_POINTS = [
  "30% center",
  "30% center",
  "30% center",
];

const INTERVAL_MS = 30000; // 30 segundos por slide

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setPrev(current);
      setTransitioning(true);
      setCurrent(c => (c + 1) % SLIDES_DESKTOP.length);
      setTimeout(() => { setPrev(null); setTransitioning(false); }, 900);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [current]);

  const goTo = (i) => {
    if (i === current) return;
    setPrev(current);
    setTransitioning(true);
    setCurrent(i);
    setTimeout(() => { setPrev(null); setTransitioning(false); }, 900);
  };

  const slides = isMobile ? SLIDES_MOBILE : SLIDES_DESKTOP;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* Previous slide fading out */}
      {prev !== null && (
        <img
          src={slides[prev]}
          alt=""
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover',
            objectPosition: isMobile ? 'center top' : FOCAL_POINTS[prev],
            opacity: transitioning ? 0 : 1,
            transition: 'opacity 0.9s ease',
          }}
        />
      )}
      {/* Current slide */}
      <img
        src={slides[current]}
        alt=""
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover',
          objectPosition: isMobile ? 'center top' : FOCAL_POINTS[current],
          opacity: 1,
          transition: 'opacity 0.9s ease',
        }}
      />

      {/* Dark overlay — mobile mais escuro para garantir legibilidade */}
      <div style={{
        position: 'absolute', inset: 0,
        background: isMobile
          ? 'linear-gradient(180deg, rgba(4,5,10,0.72) 0%, rgba(4,5,10,0.88) 60%, rgba(4,5,10,0.95) 100%)'
          : 'linear-gradient(90deg, rgba(5,7,12,0.92) 0%, rgba(5,7,12,0.65) 55%, rgba(5,7,12,0.18) 100%)'
      }} />

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 7, zIndex: 10 }}>
        {SLIDES_DESKTOP.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === current ? 26 : 8, height: 8,
              borderRadius: 4, border: 'none', cursor: 'pointer',
              background: i === current ? '#D32F2F' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.4s ease', padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
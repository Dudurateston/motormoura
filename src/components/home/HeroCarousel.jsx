import React, { useState, useEffect } from "react";

const SLIDES = [
  "https://media.base44.com/images/public/69a2232aaedb3f01dfc43e13/566e61de7_Hero_1_MOTORMOURA_Destaque.png",
  "https://media.base44.com/images/public/69a2232aaedb3f01dfc43e13/b5385abdc_Hero_2_Revendedor_Oficial.png",
  "https://media.base44.com/images/public/69a2232aaedb3f01dfc43e13/e0ff7fcd8_Hero_3_Pronta_Entrega_Fortaleza.png",
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setPrev(current);
      setTransitioning(true);
      setCurrent(c => (c + 1) % SLIDES.length);
      setTimeout(() => { setPrev(null); setTransitioning(false); }, 700);
    }, 5000);
    return () => clearInterval(id);
  }, [current]);

  const goTo = (i) => {
    if (i === current) return;
    setPrev(current);
    setTransitioning(true);
    setCurrent(i);
    setTimeout(() => { setPrev(null); setTransitioning(false); }, 700);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* Previous slide fading out */}
      {prev !== null && (
        <img
          src={SLIDES[prev]}
          alt=""
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            opacity: transitioning ? 0 : 1,
            transition: 'opacity 0.7s ease',
          }}
        />
      )}
      {/* Current slide */}
      <img
        src={SLIDES[current]}
        alt=""
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center',
          opacity: 1,
          transition: 'opacity 0.7s ease',
        }}
      />
      {/* Dark overlay so text is readable */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(5,7,12,0.82) 0%, rgba(5,7,12,0.55) 55%, rgba(5,7,12,0.25) 100%)' }} />

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, zIndex: 10 }}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === current ? 22 : 7, height: 7,
              borderRadius: 4, border: 'none', cursor: 'pointer',
              background: i === current ? '#D32F2F' : 'rgba(255,255,255,0.35)',
              transition: 'all 0.4s ease', padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
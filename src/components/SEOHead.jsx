import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = "https://www.motormouraequipamentos.com.br";
const LOGO_URL = "https://media.base44.com/images/public/69a2232aaedb3f01dfc43e13/a9d157fda_LogoMOTORMOURASimplificada-cone.png";

export default function SEOHead({
  title = "Motormoura Equipamentos | Peças de Reposição e Equipamentos em Fortaleza",
  description = "Peças de reposição e equipamentos Honda, Makita, Vibromak e Menegotti com estoque em Fortaleza e pronta entrega. Atacado B2B para lojistas: cotação pelo site ou WhatsApp (85) 98689-4081.",
  keywords = "peças de reposição, Honda, Makita, Vibromak, Menegotti, Fortaleza, motobomba, motor estacionário, gerador, carburador, partida retrátil, betoneira, ferramenta elétrica, atacado B2B, distribuidora de peças",
  image = LOGO_URL,
  type = "website"
}) {
  const location = useLocation();
  const canonicalUrl = `${SITE_URL}${location.pathname}`;

  useEffect(() => {
    document.title = title;

    const updateMeta = (name, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('description', description);
    updateMeta('keywords', keywords);
    updateMeta('author', 'Motormoura Equipamentos e Acessórios Ltda');
    updateMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', image, true);
    updateMeta('og:url', canonicalUrl, true);
    updateMeta('og:type', type, true);
    updateMeta('og:site_name', 'Motormoura Equipamentos', true);
    updateMeta('og:locale', 'pt_BR', true);

    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);

    updateMeta('geo.region', 'BR-CE');
    updateMeta('geo.placename', 'Fortaleza');
    updateMeta('geo.position', '-3.7319;-38.5267');
    updateMeta('ICBM', '-3.7319, -38.5267');

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // JSON-LD: Organization
    let jsonLdScript = document.querySelector('script[type="application/ld+json"]#organization-schema');
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.type = 'application/ld+json';
      jsonLdScript.id = 'organization-schema';
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Motormoura Equipamentos e Acessórios Ltda",
      "alternateName": "Motormoura",
      "url": SITE_URL,
      "logo": LOGO_URL,
      "description": "Distribuidora B2B de peças de reposição e equipamentos Honda, Makita, Vibromak e Menegotti, com estoque em Fortaleza e pronta entrega no Norte e Nordeste.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Av. Deputado Paulino Rocha, 2122 — Boa Vista, Castelão",
        "addressLocality": "Fortaleza",
        "addressRegion": "CE",
        "addressCountry": "BR"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+55-85-98689-4081",
        "contactType": "Sales",
        "email": "comercial@motormouraequipamentos.com.br",
        "areaServed": "BR",
        "availableLanguage": "Portuguese"
      },
      "sameAs": [
        "https://www.instagram.com/motormouraequipamentos"
      ]
    });

    // JSON-LD: LocalBusiness (loja física)
    let localBusinessScript = document.querySelector('script[type="application/ld+json"]#local-business-schema');
    if (!localBusinessScript) {
      localBusinessScript = document.createElement('script');
      localBusinessScript.type = 'application/ld+json';
      localBusinessScript.id = 'local-business-schema';
      document.head.appendChild(localBusinessScript);
    }
    localBusinessScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Motormoura Equipamentos e Acessórios",
      "image": LOGO_URL,
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Av. Deputado Paulino Rocha, 2122 — Boa Vista, Castelão",
        "addressLocality": "Fortaleza",
        "addressRegion": "CE",
        "addressCountry": "BR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -3.7319,
        "longitude": -38.5267
      },
      "url": SITE_URL,
      "telephone": "+5585986894081",
      "openingHoursSpecification": [{
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "18:00"
      }]
    });

  }, [title, description, keywords, image, canonicalUrl, type]);

  return null;
}

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function SEOHead({ 
  title = "MotorMoura - Distribuidora de Peças para Motores, Geradores e Motobombas",
  description = "Distribuidora técnica B2B especializada em peças de reposição para motores, geradores e motobombas. Mais de 1.000 SKUs em estoque. Importação direta. Fortaleza-CE.",
  keywords = "peças motor, peças gerador, peças motobomba, distribuidor peças motor, importadora peças motor, Honda, Toyama, Tekna, Branco, Buffalo, Husqvarna, Fortaleza",
  image = "https://media.base44.com/images/public/69a2232aaedb3f01dfc43e13/a9d157fda_LogoMOTORMOURASimplificada-cone.png",
  type = "website"
}) {
  const location = useLocation();
  const canonicalUrl = `https://www.motormoura.com.br${location.pathname}`;

  useEffect(() => {
    // Update title
    document.title = title;

    // Update or create meta tags
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

    // Standard meta tags
    updateMeta('description', description);
    updateMeta('keywords', keywords);
    updateMeta('author', 'MotorMoura Equipamentos e Acessórios');
    updateMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // Open Graph
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', image, true);
    updateMeta('og:url', canonicalUrl, true);
    updateMeta('og:type', type, true);
    updateMeta('og:site_name', 'MotorMoura', true);
    updateMeta('og:locale', 'pt_BR', true);

    // Twitter Card
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);

    // Geo tags
    updateMeta('geo.region', 'BR-CE');
    updateMeta('geo.placename', 'Fortaleza');
    updateMeta('geo.position', '-3.7319;-38.5267');
    updateMeta('ICBM', '-3.7319, -38.5267');

    // Business info
    updateMeta('contact', 'b2b@motormoura.com.br');
    updateMeta('coverage', 'Brasil');
    updateMeta('distribution', 'Global');
    updateMeta('rating', 'General');

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // Add JSON-LD structured data for Organization
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
      "name": "MotorMoura Equipamentos e Acessórios",
      "alternateName": "MotorMoura",
      "url": "https://www.motormoura.com.br",
      "logo": "https://media.base44.com/images/public/69a2232aaedb3f01dfc43e13/a9d157fda_LogoMOTORMOURASimplificada-cone.png",
      "description": "Distribuidora técnica B2B especializada em peças de reposição para motores, geradores e motobombas",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Fortaleza",
        "addressRegion": "CE",
        "addressCountry": "BR"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+55-85-98689-4081",
        "contactType": "Sales",
        "areaServed": "BR",
        "availableLanguage": "Portuguese"
      },
      "sameAs": [
        "https://www.instagram.com/motormouraequipamentos"
      ]
    });

    // Add LocalBusiness structured data
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
      "name": "MotorMoura Equipamentos e Acessórios",
      "image": "https://media.base44.com/images/public/69a2232aaedb3f01dfc43e13/a9d157fda_LogoMOTORMOURASimplificada-cone.png",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Fortaleza",
        "addressRegion": "CE",
        "postalCode": "60000-000",
        "addressCountry": "BR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -3.7319,
        "longitude": -38.5267
      },
      "url": "https://www.motormoura.com.br",
      "telephone": "+5585986894081",
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "18:00"
      }
    });

  }, [title, description, keywords, image, canonicalUrl, type]);

  return null;
}
import { base44 } from "@/api/base44Client";

export const trackEvent = (eventName, properties = {}) => {
  try {
    base44.analytics.track({ eventName, properties });
  } catch (_e) {
    // silently fail
  }
};

export const analytics = {
  productView: (p) =>
    trackEvent("product_view", {
      sku: p.sku_codigo,
      nome: p.nome_peca,
      categoria: p.relacionamento_categoria,
      marca: p.relacionamento_marca,
    }),
  productAddToCart: (p, qty) =>
    trackEvent("add_to_cart", {
      sku: p.sku_codigo,
      nome: p.nome_peca,
      quantidade: qty,
    }),
  cartRemoveItem: (p) =>
    trackEvent("remove_from_cart", { sku: p.sku_codigo }),
  search: (query, filters = {}) =>
    trackEvent("search", { query, ...filters }),
  quoteSubmit: (itens, total) =>
    trackEvent("quote_submit", {
      num_itens: itens.length,
      total_quantidade: total,
    }),
  loginAttempt: () => trackEvent("login_attempt"),
  registerLojista: (status) => trackEvent("lojista_register", { status }),
  categoryClick: (categoria) => trackEvent("category_click", { categoria }),
  filterApply: (filterType, value) =>
    trackEvent("filter_apply", { filter_type: filterType, filter_value: value }),
  whatsappClick: (context) => trackEvent("whatsapp_click", { context }),
  externalLink: (url, context) =>
    trackEvent("external_link_click", { url, context }),
};
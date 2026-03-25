import { base44 } from "@/api/base44Client";

function track(eventName, properties = {}) {
  try {
    base44.analytics.track({ eventName, properties });
  } catch (e) {
    // silently fail
  }
}

export const trackEvent = track;

export const analytics = {
  productView: (p) => track("product_view", { sku: p.sku_codigo, nome: p.nome_peca, categoria: p.relacionamento_categoria, marca: p.relacionamento_marca }),
  productAddToCart: (p, qty) => track("add_to_cart", { sku: p.sku_codigo, nome: p.nome_peca, quantidade: qty, categoria: p.relacionamento_categoria }),
  cartRemoveItem: (p) => track("remove_from_cart", { sku: p.sku_codigo, nome: p.nome_peca }),
  search: (query, filters = {}) => track("search", { query, categoria: filters.categoria || null, tipo: filters.tipo || null }),
  quoteSubmit: (itens, total) => track("quote_submit", { num_itens: itens.length, total_quantidade: total, via: "whatsapp" }),
  loginAttempt: () => track("login_attempt"),
  registerLojista: (status) => track("lojista_register", { status }),
  categoryClick: (categoria) => track("category_click", { categoria }),
  filterApply: (filterType, value) => track("filter_apply", { filter_type: filterType, filter_value: value }),
  whatsappClick: (context) => track("whatsapp_click", { context }),
  externalLink: (url, context) => track("external_link_click", { url, context }),
};

export default analytics;
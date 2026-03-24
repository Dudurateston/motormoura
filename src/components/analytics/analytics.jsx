import { base44 } from "@/api/base44Client";

const trackEvent = (eventName, properties = {}) => {
  try {
    base44.analytics.track({ eventName, properties });
  } catch (error) {
    console.error("Analytics error:", error);
  }
};

export const analytics = {
  productView: (produto) => trackEvent("product_view", {
    sku: produto.sku_codigo,
    nome: produto.nome_peca,
    categoria: produto.relacionamento_categoria,
    marca: produto.relacionamento_marca,
    preco: produto.preco_base_atacado || 0
  }),
  productAddToCart: (produto, quantidade) => trackEvent("add_to_cart", {
    sku: produto.sku_codigo,
    nome: produto.nome_peca,
    quantidade,
    categoria: produto.relacionamento_categoria,
    marca: produto.relacionamento_marca
  }),
  cartRemoveItem: (produto) => trackEvent("remove_from_cart", {
    sku: produto.sku_codigo,
    nome: produto.nome_peca
  }),
  search: (query, filters = {}) => trackEvent("search", {
    query,
    categoria: filters.categoria || null,
    marca: filters.marca || null,
    tipo: filters.tipo || null
  }),
  quoteSubmit: (itens, total) => trackEvent("quote_submit", {
    num_itens: itens.length,
    total_quantidade: total,
    via: "whatsapp"
  }),
  loginAttempt: () => trackEvent("login_attempt"),
  registerLojista: (status) => trackEvent("lojista_register", { status }),
  categoryClick: (categoria) => trackEvent("category_click", { categoria }),
  filterApply: (filterType, value) => trackEvent("filter_apply", {
    filter_type: filterType,
    filter_value: value
  }),
  whatsappClick: (context) => trackEvent("whatsapp_click", { context }),
  externalLink: (url, context) => trackEvent("external_link_click", { url, context })
};
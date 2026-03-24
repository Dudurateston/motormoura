import { base44 } from "@/api/base44Client";

// Track user interactions
export const trackEvent = (eventName, properties = {}) => {
  try {
    base44.analytics.track({
      eventName,
      properties
    });
  } catch (error) {
    console.error("Analytics error:", error);
  }
};

// Predefined event trackers
export const analytics = {
  // Product interactions
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
    quantidade: quantidade,
    categoria: produto.relacionamento_categoria,
    marca: produto.relacionamento_marca
  }),

  cartRemoveItem: (produto) => trackEvent("remove_from_cart", {
    sku: produto.sku_codigo,
    nome: produto.nome_peca
  }),

  // Search
  search: (query, filters = {}) => trackEvent("search", {
    query: query,
    categoria: filters.categoria || null,
    marca: filters.marca || null,
    tipo: filters.tipo || null
  }),

  // Quote/Order
  quoteSubmit: (itens, total) => trackEvent("quote_submit", {
    num_itens: itens.length,
    total_quantidade: total,
    via: "whatsapp"
  }),

  // User actions
  loginAttempt: () => trackEvent("login_attempt"),
  
  registerLojista: (status) => trackEvent("lojista_register", {
    status: status
  }),

  // Category navigation
  categoryClick: (categoria) => trackEvent("category_click", {
    categoria: categoria
  }),

  // Filter usage
  filterApply: (filterType, value) => trackEvent("filter_apply", {
    filter_type: filterType,
    filter_value: value
  }),

  // WhatsApp clicks
  whatsappClick: (context) => trackEvent("whatsapp_click", {
    context: context
  }),

  // External links
  externalLink: (url, context) => trackEvent("external_link_click", {
    url: url,
    context: context
  })
};
import { base44 } from "@/api/base44Client";

function track(eventName, properties = {}) {
  try {
    base44.analytics.track({ eventName, properties });
  } catch (_) {}
}

const analytics = {
  track,
  search: (query, filters = {}) => track("search", { query, ...filters }),
  filterApply: (filterType, value) => track("filter_apply", { filter_type: filterType, value }),
  productView: (produto) => track("product_view", { sku: produto.sku_codigo, name: produto.nome_peca }),
  addToCart: (produto, quantidade) => track("add_to_cart", { sku: produto.sku_codigo, name: produto.nome_peca, quantidade }),
  productAddToCart: (produto, quantidade) => track("add_to_cart", { sku: produto.sku_codigo, name: produto.nome_peca, quantidade }),
  quoteSubmit: (items, total) => track("quote_submit", { item_count: items.length, total_units: total }),
  whatsappClick: (source) => track("whatsapp_click", { source }),
  loginAttempt: () => track("login_attempt"),
  categoryClick: (name) => track("category_click", { name }),
  registerLojista: (status) => track("register_lojista", { status }),
};

export { analytics };
export default analytics;
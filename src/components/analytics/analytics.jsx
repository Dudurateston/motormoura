import { base44 } from "@/api/base44Client";

export const analytics = {
  track: (eventName, properties = {}) => {
    base44.analytics.track({ eventName, properties });
  },
  search: (query, filters = {}) => {
    base44.analytics.track({ eventName: "search", properties: { query, ...filters } });
  },
  filterApply: (filterType, value) => {
    base44.analytics.track({ eventName: "filter_apply", properties: { filter_type: filterType, value } });
  },
  productView: (produto) => {
    base44.analytics.track({ eventName: "product_view", properties: { sku: produto.sku_codigo, name: produto.nome_peca } });
  },
  addToCart: (produto, quantidade) => {
    base44.analytics.track({ eventName: "add_to_cart", properties: { sku: produto.sku_codigo, name: produto.nome_peca, quantidade } });
  },
  quoteSubmit: (items, total) => {
    base44.analytics.track({ eventName: "quote_submit", properties: { item_count: items.length, total_units: total } });
  },
  whatsappClick: (source) => {
    base44.analytics.track({ eventName: "whatsapp_click", properties: { source } });
  },
  loginAttempt: () => {
    base44.analytics.track({ eventName: "login_attempt" });
  },
};

export default analytics;
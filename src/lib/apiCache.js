/**
 * Centralized API cache with TTL
 * Prevents redundant API calls across components
 */

const store = new Map();
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

export const apiCache = {
  /**
   * Get or fetch: returns cached value if fresh, otherwise fetches and caches.
   * @param {string} key - cache key
   * @param {Function} fetcher - async function that returns the data
   * @param {number} ttl - time to live in ms (default 5 min)
   */
  async get(key, fetcher, ttl = DEFAULT_TTL) {
    const cached = store.get(key);
    if (cached && Date.now() - cached.ts < ttl) {
      return cached.data;
    }
    const data = await fetcher();
    store.set(key, { data, ts: Date.now() });
    return data;
  },

  /** Invalidate a specific key */
  invalidate(key) {
    store.delete(key);
  },

  /** Invalidate all keys matching a prefix */
  invalidatePrefix(prefix) {
    for (const key of store.keys()) {
      if (key.startsWith(prefix)) store.delete(key);
    }
  },

  /** Clear everything */
  clear() {
    store.clear();
  },
};

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}

/**
 * Sanitize for use as a search query (strip dangerous chars, keep alphanumeric + spaces)
 */
export function sanitizeSearchQuery(str) {
  if (typeof str !== "string") return "";
  return str.replace(/[<>'";&|`\\]/g, "").slice(0, 200).trim();
}
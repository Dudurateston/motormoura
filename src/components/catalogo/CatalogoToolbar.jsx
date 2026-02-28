import React from "react";
import { Search, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";

const SORT_OPTIONS = [
  { val: "az", label: "A → Z" },
  { val: "za", label: "Z → A" },
  { val: "sku_asc", label: "SKU ↑" },
  { val: "sku_desc", label: "SKU ↓" },
];

export default function CatalogoToolbar({
  searchText, setSearchText,
  sortOrder, setSortOrder,
  totalFiltered, page, totalPages,
  loading,
  onMobileFilterOpen,
  hasFilters,
  activeFilterPills,
}) {
  return (
    <div className="mb-5">
      {/* Top row: search + sort + mobile filter btn */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 z-10" style={{ color: "#1D4ED8" }} />
          <input
            placeholder="SKU, nome, HP… (multi-termos)"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full h-9 pl-9 pr-8 text-xs font-mono-tech focus:outline-none"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(29,78,216,0.35)",
              borderRadius: "2px",
              color: "#F3F4F6",
            }}
          />
          {searchText && (
            <button onClick={() => setSearchText("")} className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: "#4B5563" }}>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#4B5563" }} />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="h-9 px-2 text-xs font-mono-tech focus:outline-none appearance-none"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "2px",
              color: "#9CA3AF",
              minWidth: 110,
            }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.val} value={o.val} style={{ background: "#1F1F23" }}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Mobile filter btn */}
        <button
          className="md:hidden flex items-center gap-1.5 px-3 h-9 text-xs font-mono-tech"
          style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#6B7280", borderRadius: "2px",
          }}
          onClick={onMobileFilterOpen}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          FILTROS
          {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
        </button>

        {/* Count */}
        <span className="text-xs font-mono-tech ml-auto" style={{ color: "#4B5563", flexShrink: 0 }}>
          {loading ? "CARREGANDO..." : `${totalFiltered} ITENS · PÁG. ${page}/${Math.max(1, totalPages)}`}
        </span>
      </div>

      {/* Active filter pills */}
      {activeFilterPills.length > 0 && (
        <div className="flex gap-1.5 flex-wrap">
          {activeFilterPills}
        </div>
      )}
    </div>
  );
}
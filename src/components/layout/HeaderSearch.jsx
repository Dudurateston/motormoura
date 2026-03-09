import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, Package, Layers, ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { useNavigate } from "react-router-dom";

// Module-level cache so data is loaded only once per session
let _cachedProdutos = null;
let _cachedCategorias = null;

async function getSearchData() {
  if (!_cachedProdutos) {
    _cachedProdutos = await base44.entities.Produtos.list("-created_date", 2000);
  }
  if (!_cachedCategorias) {
    _cachedCategorias = await base44.entities.Categorias.list("nome");
  }
  return { produtos: _cachedProdutos, categorias: _cachedCategorias };
}

function highlight(text, query) {
  if (!query || !text) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: "rgba(229,57,53,0.3)", color: "#FCA5A5", borderRadius: "1px" }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function HeaderSearch({ mobile = false, onClose }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState({ produtos: [], categorias: [] });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (mobile && inputRef.current) inputRef.current.focus();
  }, [mobile]);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleInput = useCallback((value) => {
    setQuery(value);
    clearTimeout(debounceRef.current);
    if (value.trim().length < 2) {
      setSuggestions({ produtos: [], categorias: [] });
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const { produtos, categorias } = await getSearchData();
        const terms = value.toLowerCase().trim().split(/\s+/);
        const matchedProdutos = produtos
          .filter(p => p.ativo !== false && terms.every(t =>
            `${p.nome_peca} ${p.sku_codigo} ${p.relacionamento_marca || ""}`.toLowerCase().includes(t)
          ))
          .slice(0, 7);
        const matchedCategorias = categorias
          .filter(c => c.ativa !== false && c.nome?.toLowerCase().includes(value.toLowerCase().trim()))
          .slice(0, 3);
        setSuggestions({ produtos: matchedProdutos, categorias: matchedCategorias });
        setOpen(matchedProdutos.length > 0 || matchedCategorias.length > 0);
      } finally {
        setLoading(false);
      }
    }, 220);
  }, []);

  const goToSearch = () => {
    if (!query.trim()) return;
    navigate(createPageUrl("Catalogo") + "?q=" + encodeURIComponent(query.trim()));
    setQuery(""); setOpen(false); onClose?.();
  };

  const handleSelectProduto = (produto) => {
    navigate(createPageUrl("ProdutoDetalhe") + "?id=" + produto.id);
    setQuery(""); setOpen(false); onClose?.();
  };

  const handleSelectCategoria = (categoria) => {
    navigate(createPageUrl("Catalogo") + "?categoria=" + encodeURIComponent(categoria.nome));
    setQuery(""); setOpen(false); onClose?.();
  };

  const hasSuggestions = suggestions.produtos.length > 0 || suggestions.categorias.length > 0;
  const firstTerm = query.trim().split(/\s+/)[0];

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={(e) => { e.preventDefault(); goToSearch(); }}>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none transition-colors"
            style={{ color: loading ? "#E53935" : open ? "#E53935" : "#4B5563" }}
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            onFocus={() => query.length >= 2 && hasSuggestions && setOpen(true)}
            placeholder="Buscar peça, SKU, marca..."
            autoComplete="off"
            className="w-full h-9 pl-9 pr-8 text-xs font-mono-tech focus:outline-none transition-all"
            style={{
              background: "#F8F9FA",
              border: open ? "1px solid rgba(211,47,47,0.45)" : "1px solid #E2E8F0",
              borderRadius: "2px",
              color: "#212529",
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); setOpen(false); setSuggestions({ produtos: [], categorias: [] }); inputRef.current?.focus(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 transition-colors hover:text-white"
              style={{ color: "#4B5563" }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </form>

      {open && hasSuggestions && (
        <div
          className="absolute left-0 right-0 top-full mt-1"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderTop: "2px solid #D32F2F",
            borderRadius: "0 0 4px 4px",
            boxShadow: "0 16px 48px rgba(0,0,0,0.65)",
            zIndex: 300,
            maxHeight: 420,
            overflowY: "auto",
          }}
        >
          {suggestions.categorias.length > 0 && (
            <div>
              <div className="px-3 py-1.5 flex items-center gap-1.5" style={{ background: "rgba(29,78,216,0.06)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <Layers className="w-3 h-3" style={{ color: "#1D4ED8" }} />
                <span className="text-xs font-mono-tech" style={{ color: "#4B5563", letterSpacing: "0.1em" }}>CATEGORIAS</span>
              </div>
              {suggestions.categorias.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategoria(cat)}
                  className="w-full text-left px-3 py-2.5 flex items-center gap-2.5 transition-colors group"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0" style={{ background: "rgba(29,78,216,0.15)", border: "1px solid rgba(29,78,216,0.3)", borderRadius: "2px" }}>
                    <Layers className="w-3.5 h-3.5" style={{ color: "#60A5FA" }} />
                  </div>
                  <span className="text-sm" style={{ color: "#212529" }}>{highlight(cat.nome, firstTerm)}</span>
                  <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#E53935" }} />
                </button>
              ))}
            </div>
          )}

          {suggestions.produtos.length > 0 && (
            <div>
              <div className="px-3 py-1.5 flex items-center gap-1.5" style={{ background: "rgba(229,57,53,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", borderTop: suggestions.categorias.length > 0 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
                <Package className="w-3 h-3" style={{ color: "#E53935" }} />
                <span className="text-xs font-mono-tech" style={{ color: "#4B5563", letterSpacing: "0.1em" }}>PRODUTOS</span>
              </div>
              {suggestions.produtos.map((produto) => (
                <button
                  key={produto.id}
                  onClick={() => handleSelectProduto(produto)}
                  className="w-full text-left px-3 py-2.5 flex items-center gap-2.5 transition-colors group"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0" style={{ background: "rgba(229,57,53,0.1)", border: "1px solid rgba(229,57,53,0.25)", borderRadius: "2px" }}>
                    <Package className="w-3.5 h-3.5" style={{ color: "#E53935" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate" style={{ color: "#212529" }}>{highlight(produto.nome_peca, firstTerm)}</p>
                    <p className="text-xs font-mono-tech" style={{ color: "#1D4ED8" }}>{produto.sku_codigo}</p>
                  </div>
                  {produto.relacionamento_marca && (
                    <span className="text-xs font-mono-tech flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#6B7280" }}>
                      {produto.relacionamento_marca}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={goToSearch}
            className="w-full px-3 py-2.5 flex items-center justify-center gap-2 text-xs font-mono-tech transition-colors"
            style={{ color: "#D32F2F", borderTop: "1px solid #E2E8F0" }}
            onMouseEnter={e => e.currentTarget.style.background = "#FEF2F2"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <Search className="w-3 h-3" />
            VER TODOS OS RESULTADOS PARA "{query}"
          </button>
        </div>
      )}
    </div>
  );
}
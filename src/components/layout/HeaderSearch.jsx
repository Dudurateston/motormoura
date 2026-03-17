import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, Package, Layers, Tag, CornerDownRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────
// 1. DICIONÁRIO DE SINÔNIMOS B2B / GÍRIAS
// ─────────────────────────────────────────────
const SINONIMOS = [
  { termos: ["cordinha", "puxador", "corda", "tirante", "cordinh"], expand: ["partida retratil", "cordao de partida", "partida", "retrátil"] },
  { termos: ["boia", "bóia"], expand: ["carburador", "boia carburador", "agulha carburador"] },
  { termos: ["agulha"], expand: ["agulha carburador", "carburador", "agulha"] },
  { termos: ["sapo", "pula-pula", "pulapula", "compactador"], expand: ["compactador", "solo", "percussao"] },
  { termos: ["borboleta"], expand: ["borboleta carburador", "carburador", "aceleracao"] },
  { termos: ["kit motor", "motor completo", "revisão", "revisao"], expand: ["kit", "junta", "anel", "pistao", "segmento"] },
  { termos: ["vela"], expand: ["vela ignicao", "vela", "spark plug"] },
  { termos: ["vedacao", "vedação", "oring", "o-ring", "retentor"], expand: ["retentor", "vedacao", "oring", "junta"] },
  { termos: ["combustivel", "combustível", "tanque", "tampa combustivel"], expand: ["tanque", "tampa combustivel", "filtro combustivel"] },
  { termos: ["filtro ar", "filtro de ar", "esponja"], expand: ["filtro ar", "filtro de ar"] },
  { termos: ["diafragma", "bomba combustivel", "bomba de combustivel"], expand: ["diafragma", "bomba combustivel"] },
  { termos: ["polia", "roldana"], expand: ["polia partida", "partida retratil"] },
  { termos: ["mola", "mola valvula", "mola de valvula"], expand: ["mola valvula", "valvula"] },
  { termos: ["escova", "carvao", "carvão"], expand: ["escova alternador", "carvao gerador"] },
  { termos: ["gerador", "grupo eletrogeno", "eletrogeno"], expand: ["gerador", "estator", "rotor", "alternador"] },
  { termos: ["bomba dagua", "bomba d'agua", "motobomba"], expand: ["motobomba", "bomba", "diafragma"] },
  { termos: ["graxa", "oleo", "óleo", "lubrificante"], expand: ["oleo", "lubrificante", "vareta oleo"] },
];

// Expande o termo buscado com sinônimos
function expandirTermos(input) {
  const lower = input.toLowerCase().trim();
  const termos = [lower];
  for (const entry of SINONIMOS) {
    if (entry.termos.some((t) => lower.includes(t) || t.includes(lower))) {
      termos.push(...entry.expand);
    }
  }
  return [...new Set(termos)];
}

// ─────────────────────────────────────────────
// 2. CORREÇÃO DE TYPOS — Distância de Levenshtein simplificada
// ─────────────────────────────────────────────
const VOCABULARIO_B2B = [
  "carburador", "pistão", "anel", "segmento", "biela", "virabrequim",
  "vela", "bobina", "ignição", "filtro", "filtro ar", "filtro oleo",
  "partida", "cordão", "retratil", "válvula", "valvula", "mola",
  "junta", "kit", "retentor", "vedação", "oring", "diafragma",
  "bomba", "motobomba", "gerador", "alternador", "estator", "rotor",
  "tanque", "tampa", "cabo", "alavanca", "manete", "gatilho",
  "parafuso", "porca", "grampo", "pino", "suporte", "protetor",
  "óleo", "lubrificante", "vareta", "escova", "fusivel",
];

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i]);
  for (let j = 1; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function sugerirCorrecao(input) {
  const lower = input.toLowerCase().trim();
  if (lower.length < 4) return null;
  let best = null, bestDist = Infinity;
  for (const word of VOCABULARIO_B2B) {
    const dist = levenshtein(lower, word);
    const threshold = lower.length <= 5 ? 1 : lower.length <= 8 ? 2 : 3;
    if (dist > 0 && dist <= threshold && dist < bestDist) {
      best = word;
      bestDist = dist;
    }
  }
  return best;
}

// ─────────────────────────────────────────────
// CACHE DE DADOS
// ─────────────────────────────────────────────
let _cachedProdutos = null;
let _cachedCategorias = null;

async function getSearchData() {
  if (!_cachedProdutos) _cachedProdutos = await base44.entities.Produtos.list("-created_date", 2000);
  if (!_cachedCategorias) _cachedCategorias = await base44.entities.Categorias.list("nome");
  return { produtos: _cachedProdutos, categorias: _cachedCategorias };
}

// ─────────────────────────────────────────────
// HIGHLIGHT
// ─────────────────────────────────────────────
function highlight(text, term) {
  if (!term || !text) return text;
  const idx = text.toLowerCase().indexOf(term.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: "rgba(211,47,47,0.18)", color: "#B91C1C", borderRadius: "1px", padding: "0 1px" }}>
        {text.slice(idx, idx + term.length)}
      </mark>
      {text.slice(idx + term.length)}
    </>
  );
}

// ─────────────────────────────────────────────
// MARCAS ÚNICAS para sugestão
// ─────────────────────────────────────────────
const MARCAS_CONHECIDAS = ["Honda", "Toyama", "Tekna", "Branco", "Buffalo", "Husqvarna", "Makita", "Vibromak"];

// ─────────────────────────────────────────────
// COMPONENTE
// ─────────────────────────────────────────────
export default function HeaderSearch({ mobile = false, onClose }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState({ produtos: [], categorias: [], marcas: [] });
  const [correcao, setCorrecao] = useState(null); // { original, sugerido }
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
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const runSearch = useCallback(async (value) => {
    if (value.trim().length < 2) {
      setSuggestions({ produtos: [], categorias: [], marcas: [] });
      setCorrecao(null);
      setOpen(false);
      return;
    }

    setLoading(true);
    try {
      const { produtos, categorias } = await getSearchData();

      // Expansão semântica
      const termosExpandidos = expandirTermos(value);

      // Busca com todos os termos expandidos
      const matchedProdutos = produtos.filter((p) => {
        if (p.ativo === false) return false;
        const hay = `${p.nome_peca} ${p.sku_codigo} ${p.relacionamento_marca || ""} ${p.relacionamento_categoria || ""}`.toLowerCase();
        return termosExpandidos.some((t) => hay.includes(t));
      }).slice(0, 7);

      // Categorias
      const lower = value.toLowerCase().trim();
      const matchedCategorias = categorias.filter((c) => {
        const n = (c.nome || "").toLowerCase();
        return c.ativa !== false && (
          n.includes(lower) ||
          termosExpandidos.some((t) => n.includes(t))
        );
      }).slice(0, 3);

      // Marcas
      const matchedMarcas = MARCAS_CONHECIDAS.filter((m) =>
        m.toLowerCase().includes(lower) || lower.includes(m.toLowerCase())
      ).slice(0, 3);

      // Typo correction: só se não achou nada
      let typo = null;
      if (matchedProdutos.length === 0 && matchedCategorias.length === 0) {
        const sugestao = sugerirCorrecao(value.trim());
        if (sugestao) {
          typo = { original: value.trim(), sugerido: sugestao };
          // Busca com o termo corrigido
          const corrProdutos = produtos.filter((p) => {
            if (p.ativo === false) return false;
            const hay = `${p.nome_peca} ${p.sku_codigo} ${p.relacionamento_marca || ""}`.toLowerCase();
            return hay.includes(sugestao);
          }).slice(0, 6);
          setSuggestions({ produtos: corrProdutos, categorias: [], marcas: [] });
          setCorrecao(typo);
          setOpen(true);
          return;
        }
      }

      setSuggestions({ produtos: matchedProdutos, categorias: matchedCategorias, marcas: matchedMarcas });
      setCorrecao(null);
      setOpen(matchedProdutos.length > 0 || matchedCategorias.length > 0 || matchedMarcas.length > 0);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInput = useCallback((value) => {
    setQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(value), 200);
  }, [runSearch]);

  const goToSearch = (q) => {
    const term = q || query;
    if (!term.trim()) return;
    navigate(createPageUrl("Catalogo") + "?q=" + encodeURIComponent(term.trim()));
    setQuery(""); setOpen(false); setCorrecao(null); onClose?.();
  };

  const handleSelectProduto = (produto) => {
    navigate(createPageUrl("ProdutoDetalhe") + "?id=" + produto.id);
    setQuery(""); setOpen(false); onClose?.();
  };

  const handleSelectCategoria = (categoria) => {
    navigate(createPageUrl("Catalogo") + "?categoria=" + encodeURIComponent(categoria.nome));
    setQuery(""); setOpen(false); onClose?.();
  };

  const handleSelectMarca = (marca) => {
    navigate(createPageUrl("Catalogo") + "?q=" + encodeURIComponent(marca));
    setQuery(""); setOpen(false); onClose?.();
  };

  const hasSuggestions = suggestions.produtos.length > 0 || suggestions.categorias.length > 0 || suggestions.marcas.length > 0;
  const firstTerm = query.trim().split(/\s+/)[0];

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={(e) => { e.preventDefault(); goToSearch(); }}>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
            style={{ color: loading ? "#E53935" : open ? "#E53935" : "#4B5563" }}
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            onFocus={() => query.length >= 2 && (hasSuggestions || correcao) && setOpen(true)}
            placeholder="Buscar peça, SKU, gíria mecânica..."
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
              onClick={() => { setQuery(""); setOpen(false); setCorrecao(null); setSuggestions({ produtos: [], categorias: [], marcas: [] }); inputRef.current?.focus(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 transition-colors hover:text-red-500"
              style={{ color: "#4B5563" }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </form>

      {open && (hasSuggestions || correcao) && (
        <div
          className="absolute left-0 right-0 top-full mt-1"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderTop: "2px solid #D32F2F",
            borderRadius: "0 0 4px 4px",
            boxShadow: "0 16px 48px rgba(0,0,0,0.18)",
            zIndex: 300,
            maxHeight: 460,
            overflowY: "auto",
          }}
        >
          {/* TYPO CORRECTION BANNER */}
          {correcao && (
            <div className="px-3 py-2.5 flex items-center gap-2" style={{ background: "#FEF3C7", borderBottom: "1px solid #FDE68A" }}>
              <CornerDownRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#B45309" }} />
              <span className="text-xs" style={{ color: "#78350F" }}>
                Você quis dizer:{" "}
                <button
                  onClick={() => goToSearch(correcao.sugerido)}
                  className="font-bold underline"
                  style={{ color: "#B45309" }}
                >
                  {correcao.sugerido}
                </button>
                ?
              </span>
            </div>
          )}

          {/* CATEGORIAS */}
          {suggestions.categorias.length > 0 && (
            <div>
              <div className="px-3 py-1.5 flex items-center gap-1.5" style={{ background: "#F8F9FA", borderBottom: "1px solid #E2E8F0" }}>
                <Layers className="w-3 h-3" style={{ color: "#1D4ED8" }} />
                <span className="text-[10px] font-mono-tech tracking-widest" style={{ color: "#9CA3AF" }}>CATEGORIAS</span>
              </div>
              {suggestions.categorias.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategoria(cat)}
                  className="w-full text-left px-3 py-2.5 flex items-center gap-2.5 group"
                  style={{ borderBottom: "1px solid #F1F5F9" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#F8F9FA"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0" style={{ background: "rgba(29,78,216,0.1)", border: "1px solid rgba(29,78,216,0.2)", borderRadius: "2px" }}>
                    <Layers className="w-3.5 h-3.5" style={{ color: "#1D4ED8" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm" style={{ color: "#212529" }}>{highlight(cat.nome, firstTerm)}</p>
                    <p className="text-[10px] font-mono-tech" style={{ color: "#9CA3AF" }}>Ir para categoria</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* MARCAS */}
          {suggestions.marcas.length > 0 && (
            <div>
              <div className="px-3 py-1.5 flex items-center gap-1.5" style={{ background: "#F8F9FA", borderBottom: "1px solid #E2E8F0" }}>
                <Tag className="w-3 h-3" style={{ color: "#B45309" }} />
                <span className="text-[10px] font-mono-tech tracking-widest" style={{ color: "#9CA3AF" }}>MARCAS</span>
              </div>
              {suggestions.marcas.map((marca) => (
                <button
                  key={marca}
                  onClick={() => handleSelectMarca(marca)}
                  className="w-full text-left px-3 py-2.5 flex items-center gap-2.5 group"
                  style={{ borderBottom: "1px solid #F1F5F9" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#F8F9FA"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0" style={{ background: "rgba(180,83,9,0.1)", border: "1px solid rgba(180,83,9,0.2)", borderRadius: "2px" }}>
                    <Tag className="w-3.5 h-3.5" style={{ color: "#B45309" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono-tech" style={{ color: "#212529" }}>{marca}</p>
                    <p className="text-[10px] font-mono-tech" style={{ color: "#9CA3AF" }}>Ver peças desta marca</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* PRODUTOS */}
          {suggestions.produtos.length > 0 && (
            <div>
              <div className="px-3 py-1.5 flex items-center gap-1.5" style={{ background: "#FEF2F2", borderBottom: "1px solid #E2E8F0" }}>
                <Package className="w-3 h-3" style={{ color: "#D32F2F" }} />
                <span className="text-[10px] font-mono-tech tracking-widest" style={{ color: "#9CA3AF" }}>PRODUTOS</span>
                {correcao && (
                  <span className="text-[10px] font-mono-tech ml-1" style={{ color: "#B45309" }}>
                    (resultado para "{correcao.sugerido}")
                  </span>
                )}
              </div>
              {suggestions.produtos.map((produto) => (
                <button
                  key={produto.id}
                  onClick={() => handleSelectProduto(produto)}
                  className="w-full text-left px-3 py-2.5 flex items-center gap-2.5 group"
                  style={{ borderBottom: "1px solid #F1F5F9" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#F8F9FA"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {produto.imagem_url ? (
                    <img src={produto.imagem_url} alt="" className="w-7 h-7 object-cover flex-shrink-0" style={{ borderRadius: "2px", border: "1px solid #E2E8F0" }} />
                  ) : (
                    <div className="w-7 h-7 flex items-center justify-center flex-shrink-0" style={{ background: "rgba(211,47,47,0.08)", border: "1px solid rgba(211,47,47,0.2)", borderRadius: "2px" }}>
                      <Package className="w-3.5 h-3.5" style={{ color: "#D32F2F" }} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate" style={{ color: "#212529" }}>
                      {highlight(produto.nome_peca, correcao ? correcao.sugerido : firstTerm)}
                    </p>
                    <p className="text-[10px] font-mono-tech" style={{ color: "#1D4ED8" }}>
                      SKU: {produto.sku_codigo}
                      {produto.relacionamento_marca ? ` · ${produto.relacionamento_marca}` : ""}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* VER TODOS */}
          <button
            onClick={() => goToSearch()}
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
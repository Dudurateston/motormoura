import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Search, Filter, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import ProdutoCard from "../components/catalogo/ProdutoCard";

function addToCart(produto, quantidade) {
  const stored = localStorage.getItem("motormoura_cart");
  const cart = stored ? JSON.parse(stored) : [];
  const existingIdx = cart.findIndex((i) => i.sku_codigo === produto.sku_codigo);
  if (existingIdx >= 0) {
    cart[existingIdx].quantidade += quantidade;
  } else {
    cart.push({
      sku_codigo: produto.sku_codigo,
      nome_peca: produto.nome_peca,
      quantidade,
    });
  }
  localStorage.setItem("motormoura_cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
}

export default function Catalogo() {
  const [produtos, setProdutos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const urlParams = new URLSearchParams(window.location.search);
  const [selectedMarca, setSelectedMarca] = useState(urlParams.get("marca") || "");
  const [selectedCategoria, setSelectedCategoria] = useState(urlParams.get("categoria") || "");
  const [searchText, setSearchText] = useState(urlParams.get("q") || "");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    Promise.all([
      base44.entities.Produtos.list("-created_date", 200),
      base44.entities.MarcasCompativeis.list("nome"),
      base44.entities.Categorias.list("nome"),
    ]).then(([p, m, c]) => {
      setProdutos(p);
      setMarcas(m);
      setCategorias(c);
      setLoading(false);
    });
  }, []);

  const filtered = produtos.filter((p) => {
    if (!p.ativo) return false;
    const marcaMatch = !selectedMarca || selectedMarca === "all" || p.relacionamento_marca === selectedMarca;
    const catMatch = !selectedCategoria || selectedCategoria === "all" || p.relacionamento_categoria === selectedCategoria;
    const textMatch =
      !searchText ||
      p.sku_codigo.toLowerCase().includes(searchText.toLowerCase()) ||
      p.nome_peca.toLowerCase().includes(searchText.toLowerCase());
    return marcaMatch && catMatch && textMatch;
  });

  const clearFilters = () => {
    setSelectedMarca("");
    setSelectedCategoria("");
    setSearchText("");
  };

  const hasFilters = selectedMarca || selectedCategoria || searchText;

  const handleAddToCart = (produto, quantidade) => {
    addToCart(produto, quantidade);
    // Simple toast feedback
    const evt = new CustomEvent("showToast", { detail: { message: `${produto.nome_peca} adicionado à cotação!` } });
    window.dispatchEvent(evt);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0a2540]">Catálogo de Peças</h1>
        <p className="text-gray-500 text-sm mt-1">
          {loading ? "Carregando..." : `${filtered.length} produto(s) encontrado(s)`}
        </p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-48">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="SKU ou nome da peça..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
          </div>

          <Select value={selectedMarca || "all"} onValueChange={(v) => setSelectedMarca(v === "all" ? "" : v)}>
            <SelectTrigger className="w-44 h-10">
              <SelectValue placeholder="Marca" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as marcas</SelectItem>
              {marcas.map((m) => <SelectItem key={m.id} value={m.nome}>{m.nome}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={selectedCategoria || "all"} onValueChange={(v) => setSelectedCategoria(v === "all" ? "" : v)}>
            <SelectTrigger className="w-52 h-10">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categorias.map((c) => <SelectItem key={c.id} value={c.nome}>{c.nome}</SelectItem>)}
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1.5 text-gray-500 h-10">
              <X className="w-3.5 h-3.5" /> Limpar
            </Button>
          )}
        </div>

        {/* Active filter pills */}
        {hasFilters && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {selectedMarca && selectedMarca !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Marca: {selectedMarca}
                <button onClick={() => setSelectedMarca("")}><X className="w-3 h-3" /></button>
              </Badge>
            )}
            {selectedCategoria && selectedCategoria !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {selectedCategoria}
                <button onClick={() => setSelectedCategoria("")}><X className="w-3 h-3" /></button>
              </Badge>
            )}
            {searchText && (
              <Badge variant="secondary" className="gap-1">
                "{searchText}"
                <button onClick={() => setSearchText("")}><X className="w-3 h-3" /></button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 h-56 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Nenhuma peça encontrada</p>
          <p className="text-sm mt-1">Tente ajustar os filtros de pesquisa</p>
          <Button variant="outline" onClick={clearFilters} className="mt-4">Limpar filtros</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((produto) => (
            <ProdutoCard key={produto.id} produto={produto} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}
    </div>
  );
}
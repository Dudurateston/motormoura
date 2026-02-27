import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Package, AlertTriangle } from "lucide-react";
import FiltrosBusca from "../components/catalogo/FiltrosBusca";
import ProdutoCard from "../components/catalogo/ProdutoCard";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function Catalogo() {
  const { toast } = useToast();
  const [produtos, setProdutos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Read initial filters from URL
  const urlParams = new URLSearchParams(window.location.search);
  const [filtros, setFiltros] = useState({
    busca: urlParams.get("busca") || "",
    marca: urlParams.get("marca") || "",
    categoria: urlParams.get("categoria") || "",
  });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      base44.entities.Produtos.list(),
      base44.entities.MarcasCompativeis.list(),
      base44.entities.Categorias.list(),
    ]).then(([prods, marcasData, catsData]) => {
      setProdutos(prods.filter(p => p.ativo !== false));
      setMarcas(marcasData.filter(m => m.ativa !== false));
      setCategorias(catsData.filter(c => c.ativa !== false));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleFiltroChange = (key, value) => {
    setFiltros(prev => ({ ...prev, [key]: value }));
  };

  const handleLimparFiltros = () => {
    setFiltros({ busca: "", marca: "", categoria: "" });
  };

  const produtosFiltrados = produtos.filter((p) => {
    const matchMarca = !filtros.marca || p.relacionamento_marca === filtros.marca;
    const matchCategoria = !filtros.categoria || p.relacionamento_categoria === filtros.categoria;
    const matchBusca = !filtros.busca || (
      p.sku_codigo?.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      p.nome_peca?.toLowerCase().includes(filtros.busca.toLowerCase())
    );
    return matchMarca && matchCategoria && matchBusca;
  });

  const handleAddToCart = (produto, quantidade) => {
    const stored = localStorage.getItem("motormoura_cart");
    const cart = stored ? JSON.parse(stored) : [];
    const idx = cart.findIndex(item => item.sku_codigo === produto.sku_codigo);
    if (idx >= 0) {
      cart[idx].quantidade += quantidade;
    } else {
      cart.push({
        sku_codigo: produto.sku_codigo,
        nome_peca: produto.nome_peca,
        quantidade,
      });
    }
    localStorage.setItem("motormoura_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast({
      title: "Adicionado à cotação!",
      description: `${quantidade}x ${produto.nome_peca}`,
    });
  };

  // Group products by category for display
  const categoriasFiltradas = [...new Set(produtosFiltrados.map(p => p.relacionamento_categoria))];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Toaster />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0a2540] mb-1">Catálogo de Peças</h1>
        <p className="text-gray-500 text-sm">
          {produtosFiltrados.length} {produtosFiltrados.length === 1 ? "peça encontrada" : "peças encontradas"}
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-8">
        <FiltrosBusca
          filtros={filtros}
          onFiltroChange={handleFiltroChange}
          marcas={marcas}
          categorias={categorias}
          onLimpar={handleLimparFiltros}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 h-56 animate-pulse" />
          ))}
        </div>
      ) : produtosFiltrados.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Nenhuma peça encontrada</p>
          <p className="text-gray-400 text-sm">Tente ajustar os filtros de pesquisa</p>
        </div>
      ) : (
        <div className="space-y-10">
          {categoriasFiltradas.map((categoria) => {
            const prodsCat = produtosFiltrados.filter(p => p.relacionamento_categoria === categoria);
            const temEletricos = prodsCat.some(p => p.especificacoes_eletricas && Object.values(p.especificacoes_eletricas).some(v => v && v.trim?.() !== ""));
            return (
              <div key={categoria}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-lg font-bold text-[#0a2540]">{categoria}</h2>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    {prodsCat.length} peças
                  </span>
                  {temEletricos && (
                    <span className="flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                      <AlertTriangle className="w-3 h-3" />
                      Contém especificações elétricas — verificar amperagem e voltagem
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {prodsCat.map((produto) => (
                    <ProdutoCard
                      key={produto.id}
                      produto={produto}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
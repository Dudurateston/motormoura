import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Search, Zap, Fuel, Battery, Droplets, Settings, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categoryIcons = {
  "Motores a Gasolina": Zap,
  "Motores a Diesel": Fuel,
  "Geradores 4 Tempos": Battery,
  "Motobombas 4 Tempos": Droplets,
  "Bombas de Pulverização": Settings,
  "Acessórios Universais": Settings,
};

export default function Home() {
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    base44.entities.MarcasCompativeis.list("nome").then(setMarcas);
    base44.entities.Categorias.list("nome").then(setCategorias);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedMarca) params.set("marca", selectedMarca);
    if (selectedCategoria) params.set("categoria", selectedCategoria);
    if (searchText) params.set("q", searchText);
    window.location.href = createPageUrl("Catalogo") + "?" + params.toString();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div>
      {/* Hero */}
      <section
        className="relative bg-[#0a2540] text-white py-20 px-4 overflow-hidden"
        style={{
          backgroundImage: "linear-gradient(135deg, #0a2540 0%, #0d3060 60%, #0a2540 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1400)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6 text-sm text-yellow-300 font-medium">
            <Zap className="w-4 h-4" />
            Plataforma B2B exclusiva para lojistas
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Assistente de Reposição
            <span className="block text-[#e8b84b]">MotorMoura</span>
          </h1>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
            Encontre rapidamente as peças certas para motores, geradores e motobombas. Filtre por marca, categoria ou código SKU.
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-5 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <Select value={selectedMarca} onValueChange={setSelectedMarca}>
                <SelectTrigger className="h-11 text-gray-700 border-gray-200">
                  <SelectValue placeholder="Todas as marcas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as marcas</SelectItem>
                  {marcas.map((m) => (
                    <SelectItem key={m.id} value={m.nome}>{m.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
                <SelectTrigger className="h-11 text-gray-700 border-gray-200">
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categorias.map((c) => (
                    <SelectItem key={c.id} value={c.nome}>{c.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Digite o SKU ou nome da peça..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-11 border-gray-200 text-gray-700"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="w-full h-11 bg-[#0a2540] hover:bg-[#0d3060] text-white font-semibold gap-2 text-base"
            >
              <Search className="w-4 h-4" />
              Buscar Peças
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-14 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#0a2540]">Categorias de Produtos</h2>
            <p className="text-gray-500 mt-1">Navegue pelo nosso catálogo completo</p>
          </div>
          <Link to={createPageUrl("Catalogo")}>
            <Button variant="outline" className="gap-2 border-[#0a2540] text-[#0a2540] hidden md:flex">
              Ver todo o catálogo <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categorias.map((cat) => {
            const Icon = categoryIcons[cat.nome] || Settings;
            return (
              <Link
                key={cat.id}
                to={createPageUrl("Catalogo") + "?categoria=" + encodeURIComponent(cat.nome)}
                className="group bg-white rounded-xl border border-gray-200 p-4 text-center hover:border-[#0a2540] hover:shadow-md transition-all duration-200"
              >
                <div className="w-12 h-12 bg-blue-50 group-hover:bg-[#0a2540] rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors">
                  <Icon className="w-6 h-6 text-[#0a2540] group-hover:text-white transition-colors" />
                </div>
                <p className="text-sm font-medium text-gray-700 group-hover:text-[#0a2540] leading-tight">{cat.nome}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* B2B CTA */}
      <section className="py-14 bg-[#0a2540] px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Seja um Revendedor Oficial</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Acesso exclusivo a preços de atacado, catálogo completo e sistema de orçamento B2B.
          </p>
          <Link to={createPageUrl("MinhaConta")}>
            <Button className="bg-[#e8b84b] hover:bg-yellow-400 text-white font-semibold px-8 h-12 text-base gap-2">
              Quero ser Revendedor <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
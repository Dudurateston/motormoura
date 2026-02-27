import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Search, Zap, Fuel, Battery, Droplets, Sprout, Settings, ArrowRight, ShieldCheck, Truck, HeadphonesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const iconeCategoria = {
  "Motores a Gasolina": Zap,
  "Motores a Diesel": Fuel,
  "Geradores 4 Tempos": Battery,
  "Motobombas 4 Tempos": Droplets,
  "Bombas de Pulverização": Sprout,
  "Acessórios Universais": Settings,
};

export default function Home() {
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtros, setFiltros] = useState({ busca: "", marca: "", categoria: "" });

  useEffect(() => {
    base44.entities.MarcasCompativeis.list().then(setMarcas).catch(() => {});
    base44.entities.Categorias.list().then(setCategorias).catch(() => {});
  }, []);

  const handleBuscar = () => {
    const params = new URLSearchParams();
    if (filtros.busca) params.set("busca", filtros.busca);
    if (filtros.marca) params.set("marca", filtros.marca);
    if (filtros.categoria) params.set("categoria", filtros.categoria);
    window.location.href = createPageUrl("Catalogo") + (params.toString() ? `?${params.toString()}` : "");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleBuscar();
  };

  return (
    <div>
      {/* Hero */}
      <section
        className="relative bg-[#0a2540] text-white py-20 px-4 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#e8b84b] rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <ShieldCheck className="w-4 h-4 text-[#e8b84b]" />
            <span className="text-sm text-gray-200">Plataforma exclusiva para lojistas B2B</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Encontre a Peça Certa
            <br />
            <span className="text-[#e8b84b]">para Cada Motor</span>
          </h1>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
            Distribuidora especialista em peças de reposição para motores estacionários, geradores e motobombas. Pesquise pelo código SKU, marca ou categoria.
          </p>

          {/* Assistente de Pesquisa */}
          <div className="bg-white rounded-2xl p-4 shadow-2xl max-w-3xl mx-auto">
            <p className="text-[#0a2540] text-sm font-semibold mb-3 text-left">🔍 Assistente de Reposição</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Código SKU ou Nome da Peça"
                  value={filtros.busca}
                  onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
                  onKeyDown={handleKeyDown}
                  className="pl-9 text-gray-800 border-gray-300 h-11"
                />
              </div>

              <Select value={filtros.marca || "all"} onValueChange={(v) => setFiltros({ ...filtros, marca: v === "all" ? "" : v })}>
                <SelectTrigger className="text-gray-700 border-gray-300 h-11">
                  <SelectValue placeholder="Selecionar Marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as marcas</SelectItem>
                  {marcas.map((m) => (
                    <SelectItem key={m.id} value={m.nome}>{m.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filtros.categoria || "all"} onValueChange={(v) => setFiltros({ ...filtros, categoria: v === "all" ? "" : v })}>
                <SelectTrigger className="text-gray-700 border-gray-300 h-11">
                  <SelectValue placeholder="Selecionar Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categorias.map((c) => (
                    <SelectItem key={c.id} value={c.nome}>{c.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleBuscar}
              className="w-full h-11 bg-[#0a2540] hover:bg-[#0d3060] text-white font-semibold text-base gap-2"
            >
              <Search className="w-4 h-4" />
              Buscar Peças
            </Button>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#0a2540]">Categorias de Produtos</h2>
          <p className="text-gray-500 mt-1 text-sm">Clique para explorar o catálogo completo por categoria</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categorias.map((cat) => {
            const Icon = iconeCategoria[cat.nome] || Settings;
            return (
              <Link
                key={cat.id}
                to={createPageUrl("Catalogo") + `?categoria=${encodeURIComponent(cat.nome)}`}
                className="group bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center gap-3 hover:border-[#0a2540] hover:shadow-md transition-all duration-200 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0a2540]/5 group-hover:bg-[#0a2540] flex items-center justify-center transition-colors">
                  <Icon className="w-6 h-6 text-[#0a2540] group-hover:text-[#e8b84b] transition-colors" />
                </div>
                <span className="text-xs font-semibold text-gray-700 group-hover:text-[#0a2540] leading-tight">
                  {cat.nome}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-100 py-14">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, title: "Peças Originais", desc: "Componentes white-label com qualidade garantida e compatibilidade testada." },
            { icon: Truck, title: "Entrega para Todo Brasil", desc: "Logística eficiente para distribuidores e lojistas em todo o território nacional." },
            { icon: HeadphonesIcon, title: "Suporte Especializado", desc: "Nossa equipa técnica ajuda a identificar a peça certa para cada equipamento." },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-[#0a2540] flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-[#e8b84b]" />
              </div>
              <h3 className="font-semibold text-[#0a2540] mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Lojista */}
      <section className="max-w-4xl mx-auto px-4 py-14 text-center">
        <h2 className="text-2xl font-bold text-[#0a2540] mb-3">É Lojista ou Revendedor?</h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Registe-se na plataforma para aceder ao catálogo completo, visualizar preços de atacado e enviar cotações diretamente pelo WhatsApp.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            className="bg-[#0a2540] hover:bg-[#0d3060] text-white gap-2"
            onClick={() => base44.auth.redirectToLogin()}
          >
            Criar Conta de Lojista
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Link to={createPageUrl("Catalogo")}>
            <Button size="lg" variant="outline" className="border-[#0a2540] text-[#0a2540] hover:bg-[#0a2540] hover:text-white gap-2">
              Ver Catálogo
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
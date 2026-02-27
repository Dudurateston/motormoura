import React from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FiltrosBusca({ filtros, onFiltroChange, marcas, categorias, onLimpar }) {
  const temFiltros = filtros.busca || filtros.marca || filtros.categoria;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="w-4 h-4 text-[#0a2540]" />
        <h3 className="font-semibold text-[#0a2540] text-sm">Filtrar Peças</h3>
        {temFiltros && (
          <button
            onClick={onLimpar}
            className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="w-3 h-3" />
            Limpar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Busca livre */}
        <div className="relative sm:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Código SKU ou nome da peça"
            value={filtros.busca}
            onChange={(e) => onFiltroChange("busca", e.target.value)}
            className="pl-9 h-10 text-sm"
          />
        </div>

        {/* Dropdown Marca */}
        <Select
          value={filtros.marca || "all"}
          onValueChange={(v) => onFiltroChange("marca", v === "all" ? "" : v)}
        >
          <SelectTrigger className="h-10 text-sm">
            <SelectValue placeholder="Todas as marcas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as marcas</SelectItem>
            {marcas.map((m) => (
              <SelectItem key={m.id} value={m.nome}>{m.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Dropdown Categoria */}
        <Select
          value={filtros.categoria || "all"}
          onValueChange={(v) => onFiltroChange("categoria", v === "all" ? "" : v)}
        >
          <SelectTrigger className="h-10 text-sm">
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categorias.map((c) => (
              <SelectItem key={c.id} value={c.nome}>{c.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
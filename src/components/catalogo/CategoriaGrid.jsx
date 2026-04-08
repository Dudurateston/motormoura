import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import {
  Cpu, Zap, Droplets, Leaf, Filter, RotateCw, Fuel,
  Settings, Flame, Activity, Wrench, Star, Battery, Sprout
} from "lucide-react";

const ICON_MAP = {
  Cpu, Zap, Droplets, Leaf, Filter, RotateCw, Fuel,
  Settings, Flame, Activity, Wrench, Star, Battery, Sprout,
};

export default function CategoriaGrid({ onSelectCategory }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Categorias.list().then((list) => {
      setCategorias((list || []).filter((c) => c.ativa !== false));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse" style={{ background: "#E2E8F0", borderRadius: "4px" }} />
        ))}
      </div>
    );
  }

  if (categorias.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xs font-mono-tech" style={{ color: "#9CA3AF" }}>Nenhuma categoria cadastrada</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-4 h-[2px]" style={{ background: "#D32F2F" }} />
        <span className="text-xs font-mono-tech" style={{ color: "#D32F2F", letterSpacing: "0.12em" }}>LINHAS DE PRODUTO</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {categorias.map((cat) => {
          const Icon = ICON_MAP[cat.icone] || Settings;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.nome)}
              className="mm-cat-card text-left p-4 transition-all"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "4px",
              }}
            >
              <div className="w-8 h-8 flex items-center justify-center mb-3" style={{ background: "rgba(211,47,47,0.08)", borderRadius: "2px" }}>
                <Icon className="w-4 h-4" style={{ color: "#D32F2F" }} />
              </div>
              <p className="text-xs font-bold font-mono-tech leading-tight mb-1" style={{ color: "#212529" }}>{cat.nome}</p>
              {cat.descricao && (
                <p className="text-xs leading-snug line-clamp-2" style={{ color: "#9CA3AF" }}>{cat.descricao}</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
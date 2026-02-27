import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { User, Package, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const statusColors = {
  pendente: "bg-yellow-100 text-yellow-700 border-yellow-200",
  em_analise: "bg-blue-100 text-blue-700 border-blue-200",
  respondido: "bg-green-100 text-green-700 border-green-200",
  fechado: "bg-gray-100 text-gray-600 border-gray-200",
};

const statusLabels = {
  pendente: "Pendente",
  em_analise: "Em Análise",
  respondido: "Respondido",
  fechado: "Fechado",
};

export default function MinhaConta() {
  const [user, setUser] = useState(null);
  const [orcamentos, setOrcamentos] = useState([]);
  const [lojista, setLojista] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(async (u) => {
      setUser(u);
      const [orcs, lojs] = await Promise.all([
        base44.entities.Orcamentos.filter({ lojista_email: u.email }),
        base44.entities.Lojistas.filter({ user_email: u.email }),
      ]).catch(() => [[], []]);
      setOrcamentos(orcs || []);
      setLojista(lojs?.[0] || null);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Precisa de estar autenticado</h2>
        <Button
          onClick={() => base44.auth.redirectToLogin()}
          className="bg-[#0a2540] hover:bg-[#0d3060] text-white mt-4"
        >
          Entrar / Registar
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#0a2540] mb-6">Minha Conta</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Perfil */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#0a2540] flex items-center justify-center">
              <span className="text-white font-bold text-lg">{user.full_name?.[0] || "U"}</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{user.full_name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>

          {lojista ? (
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-400">Loja</p>
                <p className="text-sm font-medium">{lojista.nome_loja}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Status:</span>
                <Badge className={`text-xs border ${
                  lojista.status === "aprovado" ? "bg-green-100 text-green-700 border-green-200" :
                  lojista.status === "suspenso" ? "bg-red-100 text-red-700 border-red-200" :
                  "bg-yellow-100 text-yellow-700 border-yellow-200"
                }`}>
                  {lojista.status === "aprovado" ? "✓ Aprovado" :
                   lojista.status === "suspenso" ? "Suspenso" : "Pendente"}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="text-center py-3">
              <p className="text-xs text-gray-400 mb-3">Não é lojista registado</p>
              <Button size="sm" variant="outline" className="text-xs w-full">
                Solicitar Registo
              </Button>
            </div>
          )}
        </div>

        {/* Histórico */}
        <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-[#0a2540]" />
            Histórico de Cotações
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-50 rounded-lg animate-pulse" />)}
            </div>
          ) : orcamentos.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-8 h-8 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Sem cotações ainda</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {orcamentos.map((orc) => (
                <div key={orc.id} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-[#0a2540]">
                      {orc.numero_orcamento || `ORC-${orc.id?.slice(-6)}`}
                    </span>
                    <Badge className={`text-xs border ${statusColors[orc.status] || statusColors.pendente}`}>
                      {statusLabels[orc.status] || "Pendente"}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400">
                    {orc.itens?.length || 0} {orc.itens?.length === 1 ? "item" : "itens"} · {" "}
                    {new Date(orc.created_date).toLocaleDateString("pt-BR")}
                  </p>
                  {orc.itens?.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {orc.itens.map(i => i.nome_peca).join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
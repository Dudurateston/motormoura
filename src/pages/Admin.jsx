import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Users, Package, ShoppingBag, BarChart3, CheckCircle, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [orcamentos, setOrcamentos] = useState([]);
  const [lojistas, setLojistas] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(async (u) => {
      setUser(u);
      if (u.role === "admin") {
        const [orcs, lojs, prods] = await Promise.all([
          base44.entities.Orcamentos.list("-created_date"),
          base44.entities.Lojistas.list(),
          base44.entities.Produtos.list(),
        ]);
        setOrcamentos(orcs);
        setLojistas(lojs);
        setProdutos(prods);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <XCircle className="w-12 h-12 text-red-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-700">Acesso Restrito</h2>
        <p className="text-gray-500 mt-2">Esta página é exclusiva para administradores.</p>
      </div>
    );
  }

  const handleStatusLojista = async (id, status) => {
    await base44.entities.Lojistas.update(id, { status });
    setLojistas(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const handleStatusOrcamento = async (id, status) => {
    await base44.entities.Orcamentos.update(id, { status });
    setOrcamentos(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const stats = [
    { label: "Total Orçamentos", value: orcamentos.length, icon: ShoppingBag, color: "text-blue-600 bg-blue-50" },
    { label: "Pendentes", value: orcamentos.filter(o => o.status === "pendente").length, icon: Clock, color: "text-yellow-600 bg-yellow-50" },
    { label: "Lojistas", value: lojistas.length, icon: Users, color: "text-green-600 bg-green-50" },
    { label: "Produtos Ativos", value: produtos.filter(p => p.ativo !== false).length, icon: Package, color: "text-purple-600 bg-purple-50" },
  ];

  const statusColors = {
    pendente: "bg-yellow-100 text-yellow-700",
    em_analise: "bg-blue-100 text-blue-700",
    respondido: "bg-green-100 text-green-700",
    fechado: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#0a2540] mb-6">Painel Administrativo</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className={`w-9 h-9 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-4.5 h-4.5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="orcamentos">
        <TabsList className="mb-6">
          <TabsTrigger value="orcamentos">Orçamentos</TabsTrigger>
          <TabsTrigger value="lojistas">Lojistas</TabsTrigger>
        </TabsList>

        {/* Orçamentos */}
        <TabsContent value="orcamentos">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Nº Orçamento</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Lojista</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Itens</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Data</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {orcamentos.map((orc) => (
                    <tr key={orc.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-[#0a2540]">
                        {orc.numero_orcamento || `ORC-${orc.id?.slice(-6)}`}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <div>{orc.lojista_nome || "—"}</div>
                        <div className="text-xs text-gray-400">{orc.lojista_email}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{orc.itens?.length || 0} peças</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(orc.created_date).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[orc.status] || statusColors.pendente}`}>
                          {orc.status || "pendente"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Select
                          value={orc.status || "pendente"}
                          onValueChange={(v) => handleStatusOrcamento(orc.id, v)}
                        >
                          <SelectTrigger className="h-7 text-xs w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="em_analise">Em Análise</SelectItem>
                            <SelectItem value="respondido">Respondido</SelectItem>
                            <SelectItem value="fechado">Fechado</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orcamentos.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm">Sem orçamentos ainda</div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Lojistas */}
        <TabsContent value="lojistas">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Loja</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">NIF</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {lojistas.map((loj) => (
                    <tr key={loj.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{loj.nome_loja}</td>
                      <td className="px-4 py-3 text-gray-500">{loj.user_email}</td>
                      <td className="px-4 py-3 text-gray-500">{loj.nif || "—"}</td>
                      <td className="px-4 py-3">
                        <Badge className={
                          loj.status === "aprovado" ? "bg-green-100 text-green-700" :
                          loj.status === "suspenso" ? "bg-red-100 text-red-700" :
                          "bg-yellow-100 text-yellow-700"
                        }>
                          {loj.status || "pendente"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        {loj.status !== "aprovado" && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusLojista(loj.id, "aprovado")}
                            className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white gap-1"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Aprovar
                          </Button>
                        )}
                        {loj.status !== "suspenso" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusLojista(loj.id, "suspenso")}
                            className="h-7 text-xs text-red-500 border-red-200 hover:bg-red-50"
                          >
                            Suspender
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {lojistas.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm">Sem lojistas registados ainda</div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
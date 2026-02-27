import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Users, Package, FileText, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const statusColors = {
  pendente: "bg-yellow-100 text-yellow-800",
  aprovado: "bg-green-100 text-green-800",
  suspenso: "bg-red-100 text-red-800",
  em_analise: "bg-blue-100 text-blue-800",
  respondido: "bg-purple-100 text-purple-800",
  fechado: "bg-gray-100 text-gray-800",
};

export default function Admin() {
  const [user, setUser] = useState(null);
  const [lojistas, setLojistas] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(async (u) => {
      if (u.role !== "admin") {
        window.location.href = "/";
        return;
      }
      setUser(u);
      const [l, o, p] = await Promise.all([
        base44.entities.Lojistas.list("-created_date"),
        base44.entities.Orcamentos.list("-created_date", 50),
        base44.entities.Produtos.list("-created_date", 100),
      ]);
      setLojistas(l);
      setOrcamentos(o);
      setProdutos(p);
      setLoading(false);
    }).catch(() => { window.location.href = "/"; });
  }, []);

  const updateLojistaStatus = async (id, status) => {
    await base44.entities.Lojistas.update(id, { status });
    setLojistas((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
  };

  const updateOrcamentoStatus = async (id, status) => {
    await base44.entities.Orcamentos.update(id, { status });
    setOrcamentos((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-400">A carregar painel admin...</div>;
  }

  const stats = [
    { label: "Lojistas", value: lojistas.length, sub: `${lojistas.filter(l => l.status === "pendente").length} pendentes`, Icon: Users, color: "text-blue-600" },
    { label: "Orçamentos", value: orcamentos.length, sub: `${orcamentos.filter(o => o.status === "pendente").length} pendentes`, Icon: FileText, color: "text-green-600" },
    { label: "Produtos", value: produtos.length, sub: `${produtos.filter(p => p.ativo).length} ativos`, Icon: Package, color: "text-purple-600" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0a2540]">Painel de Administração</h1>
        <p className="text-gray-500 text-sm mt-1">Gestão de lojistas e orçamentos</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm">{s.label}</p>
                <p className="text-3xl font-bold text-[#0a2540] mt-1">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
              </div>
              <s.Icon className={`w-8 h-8 ${s.color} opacity-70`} />
            </div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="lojistas">
        <TabsList className="mb-6">
          <TabsTrigger value="lojistas">
            Lojistas
            {lojistas.filter(l => l.status === "pendente").length > 0 && (
              <span className="ml-1.5 bg-yellow-400 text-white text-xs rounded-full px-1.5 py-0.5">
                {lojistas.filter(l => l.status === "pendente").length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="orcamentos">Orçamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="lojistas">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Loja</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Contacto</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Localização</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lojistas.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{l.nome_loja}</p>
                      <p className="text-xs text-gray-400">{l.nif}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <p>{l.user_email}</p>
                      <p className="text-xs text-gray-400">{l.telefone}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {l.cidade}{l.estado ? `, ${l.estado}` : ""}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[l.status] || "bg-gray-100 text-gray-600"}`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {l.status !== "aprovado" && (
                          <Button size="sm" variant="outline" onClick={() => updateLojistaStatus(l.id, "aprovado")}
                            className="gap-1 text-green-600 border-green-300 hover:bg-green-50 h-7 text-xs">
                            <CheckCircle className="w-3 h-3" /> Aprovar
                          </Button>
                        )}
                        {l.status !== "suspenso" && (
                          <Button size="sm" variant="outline" onClick={() => updateLojistaStatus(l.id, "suspenso")}
                            className="gap-1 text-red-500 border-red-200 hover:bg-red-50 h-7 text-xs">
                            <XCircle className="w-3 h-3" /> Suspender
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {lojistas.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-10 text-gray-400">Nenhum lojista registado</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="orcamentos">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Referência</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Lojista</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Itens</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Data</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orcamentos.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{o.numero_orcamento || o.id.slice(0, 8)}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{o.lojista_nome || "—"}</p>
                      <p className="text-xs text-gray-400">{o.lojista_email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {o.itens?.length || 0} referência(s)
                      <p className="text-xs text-gray-400">
                        {o.itens?.reduce((s, i) => s + i.quantidade, 0)} unidades
                      </p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(o.created_date).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[o.status] || "bg-gray-100 text-gray-600"}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {o.status === "pendente" && (
                          <Button size="sm" variant="outline" onClick={() => updateOrcamentoStatus(o.id, "em_analise")}
                            className="h-7 text-xs">Em análise</Button>
                        )}
                        {o.status === "em_analise" && (
                          <Button size="sm" variant="outline" onClick={() => updateOrcamentoStatus(o.id, "respondido")}
                            className="h-7 text-xs text-green-600 border-green-300">Respondido</Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {orcamentos.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-10 text-gray-400">Nenhum orçamento registado</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
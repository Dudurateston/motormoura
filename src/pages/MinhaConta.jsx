import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { User, Building2, Phone, MapPin, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const statusConfig = {
  pendente: { label: "Pendente de aprovação", color: "bg-yellow-100 text-yellow-800", Icon: Clock },
  aprovado: { label: "Lojista aprovado", color: "bg-green-100 text-green-800", Icon: CheckCircle },
  suspenso: { label: "Conta suspensa", color: "bg-red-100 text-red-800", Icon: XCircle },
};

export default function MinhaConta() {
  const [user, setUser] = useState(null);
  const [lojista, setLojista] = useState(null);
  const [form, setForm] = useState({ nome_loja: "", nif: "", telefone: "", cidade: "", estado: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    base44.auth.me().then(async (u) => {
      setUser(u);
      const lojistas = await base44.entities.Lojistas.filter({ user_email: u.email });
      if (lojistas.length > 0) {
        setLojista(lojistas[0]);
        setForm({
          nome_loja: lojistas[0].nome_loja || "",
          nif: lojistas[0].nif || "",
          telefone: lojistas[0].telefone || "",
          cidade: lojistas[0].cidade || "",
          estado: lojistas[0].estado || "",
        });
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    if (lojista) {
      await base44.entities.Lojistas.update(lojista.id, form);
    } else {
      const novoLojista = await base44.entities.Lojistas.create({
        ...form,
        user_email: user.email,
        status: "pendente",
      });
      setLojista(novoLojista);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!user && !loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <User className="w-14 h-14 mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Acesso restrito</h2>
        <p className="text-gray-500 mb-6">Faça login para aceder à sua conta.</p>
        <Button
          onClick={() => base44.auth.redirectToLogin()}
          className="bg-[#0a2540] hover:bg-[#0d3060] text-white"
        >
          Entrar / Registar
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-gray-400">A carregar...</div>
    );
  }

  const status = lojista ? statusConfig[lojista.status] || statusConfig.pendente : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0a2540]">Minha Conta</h1>
        <p className="text-gray-500 text-sm mt-1">Gerencie os dados da sua loja</p>
      </div>

      {/* User Info */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#0a2540] rounded-full flex items-center justify-center text-white font-bold text-lg">
            {user.full_name?.charAt(0) || "U"}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user.full_name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          {status && (
            <div className={`ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
              <status.Icon className="w-3.5 h-3.5" />
              {status.label}
            </div>
          )}
        </div>
      </div>

      {/* Lojista Form */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#0a2540]" />
          Dados da Empresa
        </h2>

        {!lojista && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            Preencha os dados abaixo para se registar como lojista. Após registo, a sua conta será analisada em até 24h.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Nome da Loja / Empresa *</Label>
            <Input
              value={form.nome_loja}
              onChange={(e) => setForm({ ...form, nome_loja: e.target.value })}
              placeholder="Ex: Loja do João Ltda."
              className="h-10"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5 block">NIF / CNPJ</Label>
            <Input
              value={form.nif}
              onChange={(e) => setForm({ ...form, nif: e.target.value })}
              placeholder="00.000.000/0001-00"
              className="h-10"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Telefone</Label>
            <Input
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              placeholder="+55 (11) 99999-9999"
              className="h-10"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Cidade</Label>
            <Input
              value={form.cidade}
              onChange={(e) => setForm({ ...form, cidade: e.target.value })}
              placeholder="São Paulo"
              className="h-10"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Estado</Label>
            <Input
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
              placeholder="SP"
              className="h-10"
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving || !form.nome_loja}
          className="mt-5 bg-[#0a2540] hover:bg-[#0d3060] text-white gap-2"
        >
          {saving ? "A guardar..." : saved ? "✓ Guardado!" : lojista ? "Atualizar dados" : "Registar como Lojista"}
        </Button>
      </div>
    </div>
  );
}
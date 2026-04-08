import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import {
  Users, Package, FileText, CheckCircle, XCircle, Clock,
  TrendingUp, Heart, Wrench, BarChart2, Star, AlertTriangle,
  Search, Plus, Pencil, Trash2, X, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ─── ACCESS: role=admin only ──────────────────────────────────────────────────
// To grant admin access: go to Base44 Dashboard → Users → set user role to "admin"

const COLORS = ["#D32F2F", "#1D4ED8", "#16A34A", "#B45309", "#7C3AED", "#0891B2"];

const StatusBadge = ({ status }) => {
  const map = {
    pendente: { bg: "#FEF3C7", color: "#B45309" },
    aprovado: { bg: "#DCFCE7", color: "#16A34A" },
    suspenso: { bg: "#FEE2E2", color: "#D32F2F" },
    em_analise: { bg: "#DBEAFE", color: "#1D4ED8" },
    respondido: { bg: "#EDE9FE", color: "#7C3AED" },
    fechado: { bg: "#F3F4F6", color: "#6B7280" },
  };
  const s = map[status] || map.fechado;
  return (
    <span className="px-2 py-0.5 rounded text-xs font-mono-tech font-medium"
      style={{ background: s.bg, color: s.color }}>
      {status?.toUpperCase()}
    </span>
  );
};

function KPICard({ label, value, sub, icon: Icon, color, trend }) {
  return (
    <div className="p-5 relative overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: color }} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono-tech mb-1" style={{ color: "#9CA3AF" }}>{label}</p>
          <p className="text-3xl font-bold font-mono-tech" style={{ color: "#212529" }}>{value}</p>
          {sub && <p className="text-xs mt-1" style={{ color: "#6C757D" }}>{sub}</p>}
          {trend !== undefined && (
            <p className="text-xs mt-1 font-mono-tech" style={{ color: trend >= 0 ? "#16A34A" : "#D32F2F" }}>
              {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}% vs mês anterior
            </p>
          )}
        </div>
        <div className="w-10 h-10 flex items-center justify-center" style={{ background: `${color}15`, borderRadius: "2px" }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children, sub }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <div className="w-4 h-[2px]" style={{ background: "#D32F2F" }} />
        <h2 className="text-xs font-mono-tech font-bold" style={{ color: "#D32F2F", letterSpacing: "0.12em" }}>{children}</h2>
      </div>
      {sub && <p className="text-xs mt-0.5 ml-6" style={{ color: "#9CA3AF" }}>{sub}</p>}
    </div>
  );
}

export default function Admin() {
  const [user, setUser] = useState(null);
  const [lojistas, setLojistas] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Catálogo CRUD state
  const [catalogoBusca, setCatalogoBusca] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [formData, setFormData] = useState({});
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);

  // Categorias CRUD state
  const CAT_FORM_DEFAULT = { nome: "", descricao: "", icone: "Settings", ativa: true };
  const [catFormOpen, setCatFormOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [catForm, setCatForm] = useState(CAT_FORM_DEFAULT);
  const [catFeedback, setCatFeedback] = useState(null);
  const [catSaving, setCatSaving] = useState(false);

  // Marcas CRUD state
  const MARCA_FORM_DEFAULT = { nome: "", ativa: true };
  const [marcaFormOpen, setMarcaFormOpen] = useState(false);
  const [editingMarca, setEditingMarca] = useState(null);
  const [marcaForm, setMarcaForm] = useState(MARCA_FORM_DEFAULT);
  const [marcaFeedback, setMarcaFeedback] = useState(null);
  const [marcaSaving, setMarcaSaving] = useState(false);

  const FORM_DEFAULT = { sku_codigo: "", nome_peca: "", descricao: "", relacionamento_categoria: "", relacionamento_marca: "", preco_base_atacado: "", estoque_disponivel: "", imagem_url: "", destaque: false, ativo: true };

  const showFeedback = (msg, ok = true) => {
    setFeedback({ msg, ok });
    setTimeout(() => setFeedback(null), 3000);
  };

  const loadProdutos = async () => {
    const p = await base44.entities.Produtos.list("-created_date", 200);
    setProdutos(p || []);
  };

  const loadCategorias = async () => {
    const cats = await base44.entities.Categorias.list("-created_date");
    setCategorias(cats || []);
  };

  const showCatFeedback = (msg, ok = true) => {
    setCatFeedback({ msg, ok });
    setTimeout(() => setCatFeedback(null), 3000);
  };

  const openCatCreate = () => { setEditingCategoria(null); setCatForm(CAT_FORM_DEFAULT); setCatFormOpen(true); };
  const openCatEdit = (c) => {
    setEditingCategoria(c);
    setCatForm({ nome: c.nome || "", descricao: c.descricao || "", icone: c.icone || "Settings", ativa: c.ativa !== false });
    setCatFormOpen(true);
  };

  const handleCatSave = async () => {
    if (!catForm.nome) return;
    setCatSaving(true);
    try {
      if (editingCategoria) {
        await base44.entities.Categorias.update(editingCategoria.id, catForm);
        showCatFeedback("Categoria atualizada!");
      } else {
        await base44.entities.Categorias.create(catForm);
        showCatFeedback("Categoria criada!");
      }
      setCatFormOpen(false);
      await loadCategorias();
    } catch (e) {
      showCatFeedback("Erro: " + e.message, false);
    }
    setCatSaving(false);
  };

  const handleCatDelete = async (c) => {
    if (!window.confirm(`Excluir categoria "${c.nome}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await base44.entities.Categorias.delete(c.id);
      showCatFeedback("Categoria excluída.");
      await loadCategorias();
    } catch (e) {
      showCatFeedback("Erro ao excluir: " + e.message, false);
    }
  };

  const handleCatToggle = async (c) => {
    try {
      await base44.entities.Categorias.update(c.id, { ativa: !c.ativa });
      await loadCategorias();
    } catch (e) {
      showCatFeedback("Erro: " + e.message, false);
    }
  };

  const loadMarcas = async () => {
    const list = await base44.entities.MarcasCompativeis.list("-created_date");
    setMarcas(list || []);
  };

  const showMarcaFeedback = (msg, ok = true) => {
    setMarcaFeedback({ msg, ok });
    setTimeout(() => setMarcaFeedback(null), 3000);
  };

  const openMarcaCreate = () => { setEditingMarca(null); setMarcaForm(MARCA_FORM_DEFAULT); setMarcaFormOpen(true); };
  const openMarcaEdit = (m) => {
    setEditingMarca(m);
    setMarcaForm({ nome: m.nome || "", ativa: m.ativa !== false });
    setMarcaFormOpen(true);
  };

  const handleMarcaSave = async () => {
    if (!marcaForm.nome) return;
    setMarcaSaving(true);
    try {
      if (editingMarca) {
        await base44.entities.MarcasCompativeis.update(editingMarca.id, marcaForm);
        showMarcaFeedback("Marca atualizada!");
      } else {
        await base44.entities.MarcasCompativeis.create(marcaForm);
        showMarcaFeedback("Marca criada!");
      }
      setMarcaFormOpen(false);
      await loadMarcas();
    } catch (e) {
      showMarcaFeedback("Erro: " + e.message, false);
    }
    setMarcaSaving(false);
  };

  const handleMarcaDelete = async (m) => {
    if (!window.confirm(`Excluir marca "${m.nome}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await base44.entities.MarcasCompativeis.delete(m.id);
      showMarcaFeedback("Marca excluída.");
      await loadMarcas();
    } catch (e) {
      showMarcaFeedback("Erro ao excluir: " + e.message, false);
    }
  };

  const handleMarcaToggle = async (m) => {
    try {
      await base44.entities.MarcasCompativeis.update(m.id, { ativa: !m.ativa });
      await loadMarcas();
    } catch (e) {
      showMarcaFeedback("Erro: " + e.message, false);
    }
  };

  const loadCatalogOptions = async () => {
    const [cats, marcsList] = await Promise.all([
      base44.entities.Categorias.list(),
      base44.entities.MarcasCompativeis.list(),
    ]);
    setCategorias(cats || []);
    setMarcas(marcsList || []);
  };

  const openCreate = () => {
    setEditingProduto(null);
    setFormData(FORM_DEFAULT);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditingProduto(p);
    setFormData({
      sku_codigo: p.sku_codigo || "",
      nome_peca: p.nome_peca || "",
      descricao: p.descricao || "",
      relacionamento_categoria: p.relacionamento_categoria || "",
      relacionamento_marca: p.relacionamento_marca || "",
      preco_base_atacado: p.preco_base_atacado ?? "",
      estoque_disponivel: p.estoque_disponivel ?? "",
      imagem_url: p.imagem_url || "",
      destaque: !!p.destaque,
      ativo: p.ativo !== false,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.sku_codigo || !formData.nome_peca) return;
    setSaving(true);
    const data = {
      ...formData,
      preco_base_atacado: formData.preco_base_atacado !== "" ? parseFloat(formData.preco_base_atacado) : null,
      estoque_disponivel: formData.estoque_disponivel !== "" ? parseInt(formData.estoque_disponivel) : null,
    };
    try {
      if (editingProduto) {
        await base44.entities.Produtos.update(editingProduto.id, data);
        showFeedback("Produto atualizado com sucesso!");
      } else {
        await base44.entities.Produtos.create(data);
        showFeedback("Produto criado com sucesso!");
      }
      setModalOpen(false);
      await loadProdutos();
    } catch (e) {
      showFeedback("Erro: " + e.message, false);
    }
    setSaving(false);
  };

  const handleDelete = async (p) => {
    if (!window.confirm(`Excluir "${p.nome_peca}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await base44.entities.Produtos.delete(p.id);
      showFeedback("Produto excluído.");
      setProdutosSelecionados(prev => prev.filter(id => id !== p.id));
      await loadProdutos();
    } catch (e) {
      showFeedback("Erro ao excluir: " + e.message, false);
    }
  };

  const handleDeleteSelecionados = async () => {
    if (!window.confirm(`Excluir ${produtosSelecionados.length} produto(s) selecionado(s)? Esta ação não pode ser desfeita.`)) return;
    let errors = 0;
    const total = produtosSelecionados.length;
    for (const id of produtosSelecionados) {
      try {
        await base44.entities.Produtos.delete(id);
        await new Promise(r => setTimeout(r, 400));
      } catch (e) {
        errors++;
      }
    }
    if (errors === 0) {
      showFeedback(`${total} produto(s) excluído(s).`);
    } else {
      showFeedback(`${total - errors} excluído(s), ${errors} com erro.`, false);
    }
    setProdutosSelecionados([]);
    await loadProdutos();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "catalogo" && categorias.length === 0) loadCatalogOptions();
    if (tab === "categorias") loadCategorias();
    if (tab === "marcas") loadMarcas();
  };

  useEffect(() => {
    base44.auth.me().then(async (u) => {
      if (u.role !== "admin") { window.location.href = "/"; return; }
      setUser(u);
      const [l, o, p, f] = await Promise.all([
        base44.entities.Lojistas.list("-created_date"),
        base44.entities.Orcamentos.list("-created_date", 200),
        base44.entities.Produtos.list("-created_date", 200),
        base44.entities.Favoritos.list("-created_date", 500),
      ]);
      setLojistas(l || []);
      setOrcamentos(o || []);
      setProdutos(p || []);
      setFavoritos(f || []);
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

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]" style={{ background: "#F8F9FA" }}>
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: "#D32F2F", borderTopColor: "transparent" }} />
        <p className="text-xs font-mono-tech" style={{ color: "#9CA3AF" }}>CARREGANDO PAINEL...</p>
      </div>
    </div>
  );

  // ─── KPI CALCULATIONS ─────────────────────────────────────────────────────

  // Lojistas
  const lojistasPendentes = lojistas.filter(l => l.status === "pendente").length;
  const lojistasAprovados = lojistas.filter(l => l.status === "aprovado").length;
  const lojistasSuspensos = lojistas.filter(l => l.status === "suspenso").length;
  const lojistasComGaragem = lojistas.filter(l => l.garagem?.length > 0).length;

  // Perfil completeness avg
  const avgScore = lojistas.length > 0
    ? Math.round(lojistas.reduce((sum, l) => {
        const checks = [l.nome_loja, l.nome_contato, l.nif, l.telefone, l.cidade, l.estado, l.cep, l.endereco, l.perfil_empresa, l.volume_maquinas, l.instagram, l.logo_url, l.garagem?.length > 0];
        return sum + (checks.filter(Boolean).length / checks.length) * 100;
      }, 0) / lojistas.length)
    : 0;

  // Orçamentos
  const orcPendentes = orcamentos.filter(o => o.status === "pendente").length;
  const orcEmAnalise = orcamentos.filter(o => o.status === "em_analise").length;
  const orcRespondidos = orcamentos.filter(o => o.status === "respondido").length;
  const orcFechados = orcamentos.filter(o => o.status === "fechado").length;
  const totalItensOrcados = orcamentos.reduce((sum, o) => sum + (o.itens?.reduce((s, i) => s + (i.quantidade || 0), 0) || 0), 0);

  // Top SKUs cotados
  const skuCount = {};
  orcamentos.forEach(o => {
    o.itens?.forEach(item => {
      const key = item.nome_peca || item.sku_codigo;
      if (key) skuCount[key] = (skuCount[key] || 0) + (item.quantidade || 1);
    });
  });
  const topSkus = Object.entries(skuCount).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, qty]) => ({ name: name.length > 25 ? name.slice(0, 25) + "…" : name, qty }));

  // Orçamentos por mês (últimos 6 meses)
  const now = new Date();
  const monthLabels = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
  });
  const orcByMonth = monthLabels.map((label, i) => {
    const target = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const count = orcamentos.filter(o => {
      const d = new Date(o.created_date);
      return d.getMonth() === target.getMonth() && d.getFullYear() === target.getFullYear();
    }).length;
    return { label, count };
  });

  // Lojistas por status
  const lojistaStatusData = [
    { name: "Aprovados", value: lojistasAprovados },
    { name: "Pendentes", value: lojistasPendentes },
    { name: "Suspensos", value: lojistasSuspensos },
  ].filter(d => d.value > 0);

  // Perfis de empresa
  const perfisCount = {};
  lojistas.forEach(l => { if (l.perfil_empresa) perfisCount[l.perfil_empresa] = (perfisCount[l.perfil_empresa] || 0) + 1; });
  const perfisData = Object.entries(perfisCount).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);

  // Volume máquinas
  const volumeCount = {};
  lojistas.forEach(l => { if (l.volume_maquinas) volumeCount[l.volume_maquinas] = (volumeCount[l.volume_maquinas] || 0) + 1; });
  const volumeData = Object.entries(volumeCount).map(([name, count]) => ({ name, count }));

  // Equipamentos na garagem (top tipos e marcas)
  const garagemTipos = {};
  const garagemMarcas = {};
  lojistas.forEach(l => {
    l.garagem?.forEach(e => {
      if (e.tipo) garagemTipos[e.tipo] = (garagemTipos[e.tipo] || 0) + 1;
      if (e.marca) garagemMarcas[e.marca] = (garagemMarcas[e.marca] || 0) + 1;
    });
  });
  const topTipos = Object.entries(garagemTipos).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([name, count]) => ({ name, count }));
  const topMarcas = Object.entries(garagemMarcas).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, count]) => ({ name, count }));

  // Top favoritos
  const favCount = {};
  favoritos.forEach(f => { if (f.produto_nome) favCount[f.produto_nome] = (favCount[f.produto_nome] || 0) + 1; });
  const topFavs = Object.entries(favCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name: name.length > 28 ? name.slice(0, 28) + "…" : name, count }));

  // Estados
  const estadosCount = {};
  lojistas.forEach(l => { if (l.estado) estadosCount[l.estado.toUpperCase()] = (estadosCount[l.estado.toUpperCase()] || 0) + 1; });
  const topEstados = Object.entries(estadosCount).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, count]) => ({ name, count }));

  // Lojistas sem ação há mais de 30 dias (precisa de atenção)
  const lojistasAtencao = lojistas.filter(l => {
    const dias = (Date.now() - new Date(l.created_date)) / (1000 * 60 * 60 * 24);
    return l.status === "pendente" && dias > 3;
  });

  const TABS = ["dashboard", "lojistas", "orcamentos", "catalogo", "categorias", "marcas"];
  const TAB_LABELS = { dashboard: "Dashboard", lojistas: "Lojistas", orcamentos: "Orçamentos", catalogo: "Catálogo", categorias: "Categorias", marcas: "Marcas" };

  const ICON_OPTIONS = ["Cpu", "Zap", "Droplets", "Leaf", "Filter", "RotateCw", "Fuel", "Settings", "Flame", "Activity", "Wrench", "Star", "Battery", "Sprout", "Package"];

  return (
    <div style={{ background: "#F8F9FA", minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-[2px]" style={{ background: "#D32F2F" }} />
              <span className="text-xs font-mono-tech" style={{ color: "#D32F2F", letterSpacing: "0.15em" }}>ÁREA RESTRITA</span>
            </div>
            <h1 className="text-xl font-bold font-mono-tech" style={{ color: "#212529" }}>Painel de Administração</h1>
            <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>Acesso: {user?.email}</p>
          </div>
          {lojistasAtencao.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2" style={{ background: "rgba(180,83,9,0.1)", border: "1px solid rgba(180,83,9,0.3)", borderRadius: "4px" }}>
              <AlertTriangle className="w-4 h-4" style={{ color: "#B45309" }} />
              <span className="text-xs font-mono-tech" style={{ color: "#B45309" }}>{lojistasAtencao.length} lojista(s) pendente(s) há +3 dias</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-6 overflow-x-auto" style={{ borderBottom: "1px solid #E2E8F0" }}>
          {TABS.map((tab) => (
            <button key={tab} onClick={() => handleTabChange(tab)}
              className="px-5 py-3 text-xs font-mono-tech whitespace-nowrap transition-all duration-200"
              style={{
                color: activeTab === tab ? "#D32F2F" : "#6C757D",
                background: "transparent", border: "none",
                borderBottom: activeTab === tab ? "2px solid #D32F2F" : "2px solid transparent",
                marginBottom: "-1px"
              }}>
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        {/* ── DASHBOARD TAB ── */}
        {activeTab === "dashboard" && (
          <div key="dashboard" style={{ animation: "fadeInTab 0.2s ease" }} className="space-y-8">

            {/* KPI Cards */}
            <div>
              <SectionTitle sub="Visão geral em tempo real">INDICADORES PRINCIPAIS</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KPICard label="LOJISTAS TOTAL" value={lojistas.length} sub={`${lojistasAprovados} aprovados · ${lojistasPendentes} pendentes`} icon={Users} color="#D32F2F" />
                <KPICard label="ORÇAMENTOS TOTAL" value={orcamentos.length} sub={`${orcPendentes} aguardando resposta`} icon={FileText} color="#1D4ED8" />
                <KPICard label="PRODUTOS ATIVOS" value={produtos.filter(p => p.ativo !== false).length} sub={`${produtos.length} no catálogo`} icon={Package} color="#16A34A" />
                <KPICard label="FAVORITOS TOTAIS" value={favoritos.length} sub={`${[...new Set(favoritos.map(f => f.user_email))].length} usuários`} icon={Heart} color="#7C3AED" />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KPICard label="ITENS COTADOS" value={totalItensOrcados} sub="unidades totais pedidas" icon={TrendingUp} color="#B45309" />
              <KPICard label="COM GARAGEM" value={lojistasComGaragem} sub={`${lojistas.length > 0 ? Math.round(lojistasComGaragem / lojistas.length * 100) : 0}% dos lojistas`} icon={Wrench} color="#0891B2" />
              <KPICard label="PERFIL MÉDIO" value={`${avgScore}%`} sub="completude de cadastro" icon={Star} color="#16A34A" />
              <KPICard label="EM ANÁLISE" value={orcEmAnalise} sub={`${orcRespondidos} respondidos · ${orcFechados} fechados`} icon={BarChart2} color="#7C3AED" />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Orçamentos por mês */}
              <div className="p-5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
                <p className="text-xs font-mono-tech font-bold mb-4" style={{ color: "#212529" }}>ORÇAMENTOS — ÚLTIMOS 6 MESES</p>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={orcByMonth}>
                    <XAxis dataKey="label" tick={{ fontSize: 10, fontFamily: "Space Mono" }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(v) => [v, "Orçamentos"]} />
                    <Line type="monotone" dataKey="count" stroke="#D32F2F" strokeWidth={2} dot={{ r: 4, fill: "#D32F2F" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Lojistas por status */}
              <div className="p-5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
                <p className="text-xs font-mono-tech font-bold mb-4" style={{ color: "#212529" }}>LOJISTAS POR STATUS</p>
                {lojistaStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={lojistaStatusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                        {lojistaStatusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <div className="h-48 flex items-center justify-center text-xs" style={{ color: "#9CA3AF" }}>Sem dados</div>}
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top SKUs */}
              <div className="p-5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
                <p className="text-xs font-mono-tech font-bold mb-4" style={{ color: "#212529" }}>TOP 10 PEÇAS MAIS COTADAS</p>
                {topSkus.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={topSkus} layout="vertical">
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fontFamily: "Space Mono" }} width={140} />
                      <Tooltip />
                      <Bar dataKey="qty" fill="#D32F2F" radius={[0, 2, 2, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <div className="h-48 flex items-center justify-center text-xs" style={{ color: "#9CA3AF" }}>Sem cotações</div>}
              </div>

              {/* Perfis de empresa */}
              <div className="p-5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
                <p className="text-xs font-mono-tech font-bold mb-4" style={{ color: "#212529" }}>PERFIS DE EMPRESA DOS LOJISTAS</p>
                {perfisData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={perfisData} layout="vertical">
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fontFamily: "Space Mono" }} width={140} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#1D4ED8" radius={[0, 2, 2, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <div className="h-48 flex items-center justify-center text-xs" style={{ color: "#9CA3AF" }}>Sem dados de perfil</div>}
              </div>
            </div>

            {/* Charts Row 3 — Garagem + Volume */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
                <p className="text-xs font-mono-tech font-bold mb-4" style={{ color: "#212529" }}>TIPOS DE EQUIP. NA GARAGEM</p>
                {topTipos.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={topTipos} layout="vertical">
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={110} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#0891B2" radius={[0, 2, 2, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <div className="h-36 flex items-center justify-center text-xs" style={{ color: "#9CA3AF" }}>Sem dados</div>}
              </div>

              <div className="p-5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
                <p className="text-xs font-mono-tech font-bold mb-4" style={{ color: "#212529" }}>MARCAS NA GARAGEM</p>
                {topMarcas.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={topMarcas}>
                      <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#16A34A" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <div className="h-36 flex items-center justify-center text-xs" style={{ color: "#9CA3AF" }}>Sem dados</div>}
              </div>

              <div className="p-5 space-y-3" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
                <p className="text-xs font-mono-tech font-bold" style={{ color: "#212529" }}>TOP FAVORITOS</p>
                {topFavs.length > 0 ? topFavs.map((f, i) => (
                  <div key={f.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono-tech w-4" style={{ color: "#D32F2F" }}>#{i + 1}</span>
                      <span className="text-xs truncate" style={{ color: "#212529" }}>{f.name}</span>
                    </div>
                    <span className="text-xs font-mono-tech flex-shrink-0" style={{ color: "#6C757D" }}>{f.count}x</span>
                  </div>
                )) : <p className="text-xs" style={{ color: "#9CA3AF" }}>Nenhum favorito</p>}

                {topEstados.length > 0 && (
                  <>
                    <div className="pt-3" style={{ borderTop: "1px solid #E2E8F0" }}>
                      <p className="text-xs font-mono-tech font-bold mb-2" style={{ color: "#212529" }}>LOJISTAS POR ESTADO</p>
                    </div>
                    {topEstados.map((e) => (
                      <div key={e.name} className="flex items-center justify-between">
                        <span className="text-xs font-mono-tech" style={{ color: "#212529" }}>{e.name}</span>
                        <span className="text-xs font-mono-tech" style={{ color: "#6C757D" }}>{e.count}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Volume máquinas */}
            {volumeData.length > 0 && (
              <div className="p-5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
                <p className="text-xs font-mono-tech font-bold mb-4" style={{ color: "#212529" }}>VOLUME DE MÁQUINAS QUE ATENDEM</p>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={volumeData}>
                    <XAxis dataKey="name" tick={{ fontSize: 10, fontFamily: "Space Mono" }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(v) => [v, "Lojistas"]} />
                    <Bar dataKey="count" fill="#B45309" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Funil de conversão */}
            <div className="p-5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
              <SectionTitle sub="Do orçamento ao fechamento">FUNIL DE CONVERSÃO</SectionTitle>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "PENDENTE", value: orcPendentes, color: "#B45309" },
                  { label: "EM ANÁLISE", value: orcEmAnalise, color: "#1D4ED8" },
                  { label: "RESPONDIDO", value: orcRespondidos, color: "#16A34A" },
                  { label: "FECHADO", value: orcFechados, color: "#6B7280" },
                ].map((s) => (
                  <div key={s.label} className="p-4 text-center" style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
                    <p className="text-2xl font-bold font-mono-tech" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-xs font-mono-tech mt-1" style={{ color: "#9CA3AF" }}>{s.label}</p>
                    {orcamentos.length > 0 && (
                      <p className="text-xs mt-0.5" style={{ color: "#CBD5E1" }}>{Math.round(s.value / orcamentos.length * 100)}%</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ── LOJISTAS TAB ── */}
        {activeTab === "lojistas" && (
          <div key="lojistas" style={{ animation: "fadeInTab 0.2s ease" }}>
            <div className="overflow-x-auto" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
              <table className="w-full text-sm">
                <thead style={{ background: "#F8F9FA", borderBottom: "1px solid #E2E8F0" }}>
                  <tr>
                    {["Loja", "Contacto", "Perfil", "Garagem", "Localização", "Status", "Ações"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-mono-tech" style={{ color: "#6C757D" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lojistas.map((l) => (
                    <tr key={l.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {l.logo_url && <img src={l.logo_url} className="w-7 h-7 object-cover rounded" style={{ border: "1px solid #E2E8F0" }} />}
                          <div>
                            <p className="font-medium text-sm" style={{ color: "#212529" }}>{l.nome_loja}</p>
                            <p className="text-xs" style={{ color: "#9CA3AF" }}>{l.nif}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs" style={{ color: "#6C757D" }}>{l.user_email}</p>
                        <p className="text-xs" style={{ color: "#9CA3AF" }}>{l.telefone}</p>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#6C757D" }}>{l.perfil_empresa || "—"}</td>
                      <td className="px-4 py-3">
                        {l.garagem?.length > 0
                          ? <span className="text-xs font-mono-tech px-2 py-0.5" style={{ background: "rgba(22,163,74,0.1)", color: "#16A34A", borderRadius: "2px" }}>{l.garagem.length} equip.</span>
                          : <span className="text-xs" style={{ color: "#CBD5E1" }}>—</span>}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#6C757D" }}>{l.cidade}{l.estado ? `, ${l.estado}` : ""}</td>
                      <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          {l.status !== "aprovado" && (
                            <button onClick={() => updateLojistaStatus(l.id, "aprovado")}
                              className="h-7 px-3 text-xs font-mono-tech" style={{ background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.3)", color: "#16A34A", borderRadius: "2px" }}>
                              Aprovar
                            </button>
                          )}
                          {l.status !== "suspenso" && (
                            <button onClick={() => updateLojistaStatus(l.id, "suspenso")}
                              className="h-7 px-3 text-xs font-mono-tech" style={{ background: "rgba(211,47,47,0.08)", border: "1px solid rgba(211,47,47,0.2)", color: "#D32F2F", borderRadius: "2px" }}>
                              Suspender
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {lojistas.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-10 text-xs" style={{ color: "#9CA3AF" }}>Nenhum lojista registado</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── ORÇAMENTOS TAB ── */}
        {activeTab === "orcamentos" && (
          <div key="orcamentos" style={{ animation: "fadeInTab 0.2s ease" }}>
            <div className="overflow-x-auto" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
              <table className="w-full text-sm">
                <thead style={{ background: "#F8F9FA", borderBottom: "1px solid #E2E8F0" }}>
                  <tr>
                    {["Referência", "Lojista", "Itens", "Data", "Status", "Ações"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-mono-tech" style={{ color: "#6C757D" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orcamentos.map((o) => (
                    <tr key={o.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "#1D4ED8" }}>{o.numero_orcamento || o.id.slice(0, 8)}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-sm" style={{ color: "#212529" }}>{o.lojista_nome || "—"}</p>
                        <p className="text-xs" style={{ color: "#9CA3AF" }}>{o.lojista_email}</p>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#6C757D" }}>
                        {o.itens?.length || 0} ref. · {o.itens?.reduce((s, i) => s + (i.quantidade || 0), 0)} unid.
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#9CA3AF" }}>
                        {new Date(o.created_date).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          {o.status === "pendente" && (
                            <button onClick={() => updateOrcamentoStatus(o.id, "em_analise")}
                              className="h-7 px-3 text-xs font-mono-tech" style={{ background: "rgba(29,78,216,0.08)", border: "1px solid rgba(29,78,216,0.2)", color: "#1D4ED8", borderRadius: "2px" }}>
                              Em análise
                            </button>
                          )}
                          {o.status === "em_analise" && (
                            <button onClick={() => updateOrcamentoStatus(o.id, "respondido")}
                              className="h-7 px-3 text-xs font-mono-tech" style={{ background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.25)", color: "#16A34A", borderRadius: "2px" }}>
                              Respondido
                            </button>
                          )}
                          {o.status === "respondido" && (
                            <button onClick={() => updateOrcamentoStatus(o.id, "fechado")}
                              className="h-7 px-3 text-xs font-mono-tech" style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", color: "#6C757D", borderRadius: "2px" }}>
                              Fechar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {orcamentos.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-10 text-xs" style={{ color: "#9CA3AF" }}>Nenhum orçamento</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── MARCAS TAB ── */}
        {activeTab === "marcas" && (
          <div key="marcas" style={{ animation: "fadeInTab 0.2s ease" }}>
            {marcaFeedback && (
              <div className="flex items-center gap-2 mb-4 px-4 py-3" style={{ background: marcaFeedback.ok ? "rgba(22,163,74,0.08)" : "rgba(211,47,47,0.08)", border: `1px solid ${marcaFeedback.ok ? "rgba(22,163,74,0.3)" : "rgba(211,47,47,0.3)"}`, borderRadius: "4px" }}>
                {marcaFeedback.ok ? <CheckCircle2 className="w-4 h-4" style={{ color: "#16A34A" }} /> : <X className="w-4 h-4" style={{ color: "#D32F2F" }} />}
                <span className="text-xs font-mono-tech" style={{ color: marcaFeedback.ok ? "#16A34A" : "#D32F2F" }}>{marcaFeedback.msg}</span>
              </div>
            )}
            <div className="flex items-center gap-3 mb-4">
              <button onClick={openMarcaCreate}
                className="flex items-center gap-2 h-9 px-4 text-xs font-mono-tech font-bold"
                style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "#fff", border: "none", borderRadius: "2px" }}>
                <Plus className="w-3.5 h-3.5" /> NOVA MARCA
              </button>
              <span className="text-xs font-mono-tech ml-auto" style={{ color: "#9CA3AF" }}>
                {marcas.filter(m => m.ativa !== false).length} ativas · {marcas.filter(m => m.ativa === false).length} inativas
              </span>
            </div>

            {marcaFormOpen && (
              <div className="mb-5 p-5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono-tech font-bold" style={{ color: "#D32F2F" }}>{editingMarca ? "EDITAR MARCA" : "NOVA MARCA"}</span>
                  <button onClick={() => setMarcaFormOpen(false)} className="w-7 h-7 flex items-center justify-center hover:bg-gray-100" style={{ borderRadius: "2px", color: "#6C757D" }}><X className="w-4 h-4" /></button>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <label className="block text-xs font-mono-tech mb-1" style={{ color: "#6C757D" }}>NOME *</label>
                    <input value={marcaForm.nome} onChange={e => setMarcaForm(f => ({ ...f, nome: e.target.value }))}
                      className="w-full h-9 px-3 text-sm focus:outline-none"
                      style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#212529" }} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={marcaForm.ativa} onChange={e => setMarcaForm(f => ({ ...f, ativa: e.target.checked }))}
                      className="w-4 h-4" style={{ accentColor: "#16A34A" }} />
                    <span className="text-xs font-mono-tech" style={{ color: "#6C757D" }}>Marca ativa no catálogo</span>
                  </label>
                  <div className="flex gap-2">
                    <button onClick={() => setMarcaFormOpen(false)}
                      className="h-9 px-4 text-xs font-mono-tech"
                      style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", color: "#6C757D", borderRadius: "2px" }}>CANCELAR</button>
                    <button onClick={handleMarcaSave} disabled={marcaSaving || !marcaForm.nome}
                      className="h-9 px-5 text-xs font-mono-tech font-bold disabled:opacity-50"
                      style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "#fff", border: "none", borderRadius: "2px" }}>
                      {marcaSaving ? "SALVANDO..." : editingMarca ? "SALVAR" : "CRIAR"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="overflow-x-auto" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
              <table className="w-full text-sm">
                <thead style={{ background: "#F8F9FA", borderBottom: "1px solid #E2E8F0" }}>
                  <tr>
                    {["Nome", "Status", "Ações"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-mono-tech" style={{ color: "#6C757D" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {marcas.map((m) => (
                    <tr key={m.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td className="px-4 py-3 font-medium text-sm" style={{ color: "#212529" }}>{m.nome}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono-tech px-2 py-0.5" style={{
                          background: m.ativa !== false ? "rgba(22,163,74,0.1)" : "rgba(211,47,47,0.08)",
                          color: m.ativa !== false ? "#16A34A" : "#D32F2F", borderRadius: "2px"
                        }}>{m.ativa !== false ? "ATIVA" : "INATIVA"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <button onClick={() => openMarcaEdit(m)}
                            className="h-7 px-3 text-xs font-mono-tech flex items-center gap-1"
                            style={{ background: "rgba(29,78,216,0.08)", border: "1px solid rgba(29,78,216,0.2)", color: "#1D4ED8", borderRadius: "2px" }}>
                            <Pencil className="w-3 h-3" /> Editar
                          </button>
                          <button onClick={() => handleMarcaToggle(m)}
                            className="h-7 px-3 text-xs font-mono-tech"
                            style={{ background: "rgba(180,83,9,0.07)", border: "1px solid rgba(180,83,9,0.2)", color: "#B45309", borderRadius: "2px" }}>
                            {m.ativa !== false ? "Desativar" : "Ativar"}
                          </button>
                          <button onClick={() => handleMarcaDelete(m)}
                            className="h-7 px-3 text-xs font-mono-tech flex items-center gap-1"
                            style={{ background: "rgba(211,47,47,0.08)", border: "1px solid rgba(211,47,47,0.2)", color: "#D32F2F", borderRadius: "2px" }}>
                            <Trash2 className="w-3 h-3" /> Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {marcas.length === 0 && (
                    <tr><td colSpan={3} className="text-center py-10 text-xs" style={{ color: "#9CA3AF" }}>Nenhuma marca cadastrada</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── CATEGORIAS TAB ── */}
        {activeTab === "categorias" && (
          <div key="categorias" style={{ animation: "fadeInTab 0.2s ease" }}>
            {catFeedback && (
              <div className="flex items-center gap-2 mb-4 px-4 py-3" style={{ background: catFeedback.ok ? "rgba(22,163,74,0.08)" : "rgba(211,47,47,0.08)", border: `1px solid ${catFeedback.ok ? "rgba(22,163,74,0.3)" : "rgba(211,47,47,0.3)"}`, borderRadius: "4px" }}>
                {catFeedback.ok ? <CheckCircle2 className="w-4 h-4" style={{ color: "#16A34A" }} /> : <X className="w-4 h-4" style={{ color: "#D32F2F" }} />}
                <span className="text-xs font-mono-tech" style={{ color: catFeedback.ok ? "#16A34A" : "#D32F2F" }}>{catFeedback.msg}</span>
              </div>
            )}
            <div className="flex items-center gap-3 mb-4">
              <button onClick={openCatCreate}
                className="flex items-center gap-2 h-9 px-4 text-xs font-mono-tech font-bold"
                style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "#fff", border: "none", borderRadius: "2px" }}>
                <Plus className="w-3.5 h-3.5" /> NOVA CATEGORIA
              </button>
              <span className="text-xs font-mono-tech ml-auto" style={{ color: "#9CA3AF" }}>
                {categorias.filter(c => c.ativa !== false).length} ativas · {categorias.filter(c => c.ativa === false).length} inativas
              </span>
            </div>
            {catFormOpen && (
              <div className="mb-5 p-5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono-tech font-bold" style={{ color: "#D32F2F" }}>{editingCategoria ? "EDITAR CATEGORIA" : "NOVA CATEGORIA"}</span>
                  <button onClick={() => setCatFormOpen(false)} className="w-7 h-7 flex items-center justify-center hover:bg-gray-100" style={{ borderRadius: "2px", color: "#6C757D" }}><X className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-mono-tech mb-1" style={{ color: "#6C757D" }}>NOME *</label>
                    <input value={catForm.nome} onChange={e => setCatForm(f => ({ ...f, nome: e.target.value }))}
                      className="w-full h-9 px-3 text-sm focus:outline-none"
                      style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#212529" }} />
                  </div>
                  <div>
                    <label className="block text-xs font-mono-tech mb-1" style={{ color: "#6C757D" }}>ÍCONE</label>
                    <select value={catForm.icone} onChange={e => setCatForm(f => ({ ...f, icone: e.target.value }))}
                      className="w-full h-9 px-3 text-sm focus:outline-none appearance-none"
                      style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#212529" }}>
                      {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-mono-tech mb-1" style={{ color: "#6C757D" }}>DESCRIÇÃO</label>
                  <textarea value={catForm.descricao} onChange={e => setCatForm(f => ({ ...f, descricao: e.target.value }))}
                    rows={2} className="w-full px-3 py-2 text-sm focus:outline-none resize-none"
                    style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#212529" }} />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={catForm.ativa} onChange={e => setCatForm(f => ({ ...f, ativa: e.target.checked }))}
                      className="w-4 h-4" style={{ accentColor: "#16A34A" }} />
                    <span className="text-xs font-mono-tech" style={{ color: "#6C757D" }}>Categoria ativa no catálogo</span>
                  </label>
                  <div className="flex gap-2">
                    <button onClick={() => setCatFormOpen(false)}
                      className="h-9 px-4 text-xs font-mono-tech"
                      style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", color: "#6C757D", borderRadius: "2px" }}>CANCELAR</button>
                    <button onClick={handleCatSave} disabled={catSaving || !catForm.nome}
                      className="h-9 px-5 text-xs font-mono-tech font-bold disabled:opacity-50"
                      style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "#fff", border: "none", borderRadius: "2px" }}>
                      {catSaving ? "SALVANDO..." : editingCategoria ? "SALVAR" : "CRIAR"}
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="overflow-x-auto" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
              <table className="w-full text-sm">
                <thead style={{ background: "#F8F9FA", borderBottom: "1px solid #E2E8F0" }}>
                  <tr>
                    {["Ícone", "Nome", "Descrição", "Status", "Ações"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-mono-tech" style={{ color: "#6C757D" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {categorias.map((c) => (
                    <tr key={c.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td className="px-4 py-3"><span className="text-xs font-mono-tech px-2 py-0.5" style={{ background: "rgba(29,78,216,0.06)", border: "1px solid rgba(29,78,216,0.15)", color: "#1D4ED8", borderRadius: "2px" }}>{c.icone || "—"}</span></td>
                      <td className="px-4 py-3 font-medium text-sm" style={{ color: "#212529" }}>{c.nome}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#6C757D", maxWidth: 260 }}><p className="truncate">{c.descricao || "—"}</p></td>
                      <td className="px-4 py-3"><span className="text-xs font-mono-tech px-2 py-0.5" style={{ background: c.ativa !== false ? "rgba(22,163,74,0.1)" : "rgba(211,47,47,0.08)", color: c.ativa !== false ? "#16A34A" : "#D32F2F", borderRadius: "2px" }}>{c.ativa !== false ? "ATIVA" : "INATIVA"}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <button onClick={() => openCatEdit(c)} className="h-7 px-3 text-xs font-mono-tech flex items-center gap-1" style={{ background: "rgba(29,78,216,0.08)", border: "1px solid rgba(29,78,216,0.2)", color: "#1D4ED8", borderRadius: "2px" }}><Pencil className="w-3 h-3" /> Editar</button>
                          <button onClick={() => handleCatToggle(c)} className="h-7 px-3 text-xs font-mono-tech" style={{ background: "rgba(180,83,9,0.07)", border: "1px solid rgba(180,83,9,0.2)", color: "#B45309", borderRadius: "2px" }}>{c.ativa !== false ? "Desativar" : "Ativar"}</button>
                          <button onClick={() => handleCatDelete(c)} className="h-7 px-3 text-xs font-mono-tech flex items-center gap-1" style={{ background: "rgba(211,47,47,0.08)", border: "1px solid rgba(211,47,47,0.2)", color: "#D32F2F", borderRadius: "2px" }}><Trash2 className="w-3 h-3" /> Excluir</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {categorias.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-10 text-xs" style={{ color: "#9CA3AF" }}>Nenhuma categoria cadastrada</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "catalogo" && (
          <div key="catalogo" style={{ animation: "fadeInTab 0.2s ease" }}>

            {/* Feedback */}
            {feedback && (
              <div className="flex items-center gap-2 mb-4 px-4 py-3" style={{ background: feedback.ok ? "rgba(22,163,74,0.08)" : "rgba(211,47,47,0.08)", border: `1px solid ${feedback.ok ? "rgba(22,163,74,0.3)" : "rgba(211,47,47,0.3)"}`, borderRadius: "4px" }}>
                {feedback.ok ? <CheckCircle2 className="w-4 h-4" style={{ color: "#16A34A" }} /> : <X className="w-4 h-4" style={{ color: "#D32F2F" }} />}
                <span className="text-xs font-mono-tech" style={{ color: feedback.ok ? "#16A34A" : "#D32F2F" }}>{feedback.msg}</span>
              </div>
            )}

            {/* Bulk action bar */}
            {produtosSelecionados.length > 0 && (
              <div className="flex items-center gap-3 mb-3 px-4 py-2.5" style={{ background: "rgba(211,47,47,0.06)", border: "1px solid rgba(211,47,47,0.25)", borderRadius: "4px" }}>
                <span className="text-xs font-mono-tech" style={{ color: "#D32F2F" }}>{produtosSelecionados.length} produto(s) selecionado(s)</span>
                <button onClick={handleDeleteSelecionados}
                  className="flex items-center gap-1.5 h-7 px-3 text-xs font-mono-tech font-bold ml-auto"
                  style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "#fff", border: "none", borderRadius: "2px" }}>
                  <Trash2 className="w-3 h-3" /> EXCLUIR SELECIONADOS
                </button>
                <button onClick={() => setProdutosSelecionados([])}
                  className="h-7 px-3 text-xs font-mono-tech"
                  style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", color: "#6C757D", borderRadius: "2px" }}>
                  CANCELAR
                </button>
              </div>
            )}

            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#9CA3AF" }} />
                <input
                  placeholder="Buscar por nome ou SKU..."
                  value={catalogoBusca}
                  onChange={(e) => setCatalogoBusca(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 text-xs font-mono-tech focus:outline-none"
                  style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#212529" }}
                />
              </div>
              <button
                onClick={openCreate}
                className="flex items-center gap-2 h-9 px-4 text-xs font-mono-tech font-bold"
                style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "#fff", border: "none", borderRadius: "2px" }}
              >
                <Plus className="w-3.5 h-3.5" /> NOVO PRODUTO
              </button>
              <span className="text-xs font-mono-tech ml-auto" style={{ color: "#9CA3AF" }}>
                {produtos.filter(p => {
                  const q = catalogoBusca.toLowerCase();
                  return !q || p.nome_peca?.toLowerCase().includes(q) || p.sku_codigo?.toLowerCase().includes(q);
                }).length} produto(s)
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px" }}>
              <table className="w-full text-sm">
                <thead style={{ background: "#F8F9FA", borderBottom: "1px solid #E2E8F0" }}>
                  <tr>
                    <th className="px-4 py-3 w-8">
                      <input type="checkbox"
                        checked={produtosSelecionados.length > 0 && produtos.filter(p => { const q = catalogoBusca.toLowerCase(); return !q || p.nome_peca?.toLowerCase().includes(q) || p.sku_codigo?.toLowerCase().includes(q); }).every(p => produtosSelecionados.includes(p.id))}
                        onChange={(e) => {
                          const visiveis = produtos.filter(p => { const q = catalogoBusca.toLowerCase(); return !q || p.nome_peca?.toLowerCase().includes(q) || p.sku_codigo?.toLowerCase().includes(q); }).map(p => p.id);
                          setProdutosSelecionados(e.target.checked ? visiveis : []);
                        }}
                        style={{ accentColor: "#D32F2F", cursor: "pointer" }}
                      />
                    </th>
                    {["SKU", "Nome", "Categoria", "Marca", "Preço", "Estoque", "Status", "Ações"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-mono-tech" style={{ color: "#6C757D" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {produtos
                    .filter(p => {
                      const q = catalogoBusca.toLowerCase();
                      return !q || p.nome_peca?.toLowerCase().includes(q) || p.sku_codigo?.toLowerCase().includes(q);
                    })
                    .map((p) => (
                    <tr key={p.id} style={{ borderBottom: "1px solid #F1F5F9", background: produtosSelecionados.includes(p.id) ? "rgba(211,47,47,0.03)" : undefined }}>
                      <td className="px-4 py-3 w-8">
                        <input type="checkbox"
                          checked={produtosSelecionados.includes(p.id)}
                          onChange={(e) => setProdutosSelecionados(prev => e.target.checked ? [...prev, p.id] : prev.filter(id => id !== p.id))}
                          style={{ accentColor: "#D32F2F", cursor: "pointer" }}
                        />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "#1D4ED8" }}>{p.sku_codigo}</td>
                      <td className="px-4 py-3 text-sm font-medium" style={{ color: "#212529", maxWidth: 200 }}>
                        <p className="truncate">{p.nome_peca}</p>
                        {p.destaque && <span className="text-xs font-mono-tech" style={{ color: "#B45309" }}>★ DESTAQUE</span>}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#6C757D" }}>{p.relacionamento_categoria}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#6C757D" }}>{p.relacionamento_marca}</td>
                      <td className="px-4 py-3 text-xs font-mono-tech" style={{ color: "#212529" }}>
                        {p.preco_base_atacado ? `R$ ${p.preco_base_atacado.toFixed(2)}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: p.estoque_disponivel > 0 ? "#16A34A" : "#D32F2F" }}>
                        {p.estoque_disponivel ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono-tech px-2 py-0.5" style={{
                          background: p.ativo !== false ? "rgba(22,163,74,0.1)" : "rgba(211,47,47,0.08)",
                          color: p.ativo !== false ? "#16A34A" : "#D32F2F", borderRadius: "2px"
                        }}>
                          {p.ativo !== false ? "ATIVO" : "INATIVO"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <button onClick={() => openEdit(p)}
                            className="h-7 px-3 text-xs font-mono-tech flex items-center gap-1"
                            style={{ background: "rgba(29,78,216,0.08)", border: "1px solid rgba(29,78,216,0.2)", color: "#1D4ED8", borderRadius: "2px" }}>
                            <Pencil className="w-3 h-3" /> Editar
                          </button>
                          <button onClick={() => handleDelete(p)}
                            className="h-7 px-3 text-xs font-mono-tech flex items-center gap-1"
                            style={{ background: "rgba(211,47,47,0.08)", border: "1px solid rgba(211,47,47,0.2)", color: "#D32F2F", borderRadius: "2px" }}>
                            <Trash2 className="w-3 h-3" /> Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {produtos.length === 0 && (
                    <tr><td colSpan={8} className="text-center py-10 text-xs" style={{ color: "#9CA3AF" }}>Nenhum produto cadastrado</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal */}
            {modalOpen && (
              <>
                <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setModalOpen(false)} />
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "4px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
                    {/* Modal header */}
                    <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #E2E8F0" }}>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <div className="w-3 h-[2px]" style={{ background: "#D32F2F" }} />
                          <span className="text-xs font-mono-tech" style={{ color: "#D32F2F", letterSpacing: "0.12em" }}>{editingProduto ? "EDITAR PRODUTO" : "NOVO PRODUTO"}</span>
                        </div>
                      </div>
                      <button onClick={() => setModalOpen(false)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100" style={{ borderRadius: "2px", color: "#6C757D" }}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Form */}
                    <div className="px-6 py-5 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono-tech mb-1" style={{ color: "#6C757D" }}>SKU *</label>
                          <input value={formData.sku_codigo} onChange={e => setFormData(f => ({ ...f, sku_codigo: e.target.value }))}
                            className="w-full h-9 px-3 text-sm focus:outline-none"
                            style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#212529" }} />
                        </div>
                        <div>
                          <label className="block text-xs font-mono-tech mb-1" style={{ color: "#6C757D" }}>NOME DA PEÇA *</label>
                          <input value={formData.nome_peca} onChange={e => setFormData(f => ({ ...f, nome_peca: e.target.value }))}
                            className="w-full h-9 px-3 text-sm focus:outline-none"
                            style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#212529" }} />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono-tech mb-1" style={{ color: "#6C757D" }}>DESCRIÇÃO</label>
                        <textarea value={formData.descricao} onChange={e => setFormData(f => ({ ...f, descricao: e.target.value }))}
                          rows={3} className="w-full px-3 py-2 text-sm focus:outline-none resize-none"
                          style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#212529" }} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono-tech mb-1" style={{ color: "#6C757D" }}>CATEGORIA</label>
                          <select value={formData.relacionamento_categoria} onChange={e => setFormData(f => ({ ...f, relacionamento_categoria: e.target.value }))}
                            className="w-full h-9 px-3 text-sm focus:outline-none appearance-none"
                            style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#212529" }}>
                            <option value="">Selecione...</option>
                            {categorias.filter(c => c.ativa !== false).map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-mono-tech mb-1" style={{ color: "#6C757D" }}>MARCA COMPATÍVEL</label>
                          <select value={formData.relacionamento_marca} onChange={e => setFormData(f => ({ ...f, relacionamento_marca: e.target.value }))}
                            className="w-full h-9 px-3 text-sm focus:outline-none appearance-none"
                            style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#212529" }}>
                            <option value="">Selecione...</option>
                            {marcas.filter(m => m.ativa !== false).map(m => <option key={m.id} value={m.nome}>{m.nome}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono-tech mb-1" style={{ color: "#6C757D" }}>PREÇO ATACADO (R$)</label>
                          <input type="number" step="0.01" value={formData.preco_base_atacado} onChange={e => setFormData(f => ({ ...f, preco_base_atacado: e.target.value }))}
                            className="w-full h-9 px-3 text-sm focus:outline-none"
                            style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#212529" }} />
                        </div>
                        <div>
                          <label className="block text-xs font-mono-tech mb-1" style={{ color: "#6C757D" }}>ESTOQUE DISPONÍVEL</label>
                          <input type="number" step="1" value={formData.estoque_disponivel} onChange={e => setFormData(f => ({ ...f, estoque_disponivel: e.target.value }))}
                            className="w-full h-9 px-3 text-sm focus:outline-none"
                            style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#212529" }} />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono-tech mb-1" style={{ color: "#6C757D" }}>URL DA IMAGEM</label>
                        <input value={formData.imagem_url} onChange={e => setFormData(f => ({ ...f, imagem_url: e.target.value }))}
                          placeholder="https://..."
                          className="w-full h-9 px-3 text-sm focus:outline-none"
                          style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", borderRadius: "2px", color: "#212529" }} />
                      </div>

                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={formData.destaque} onChange={e => setFormData(f => ({ ...f, destaque: e.target.checked }))}
                            className="w-4 h-4" style={{ accentColor: "#D32F2F" }} />
                          <span className="text-xs font-mono-tech" style={{ color: "#6C757D" }}>Produto em destaque na Home</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={formData.ativo} onChange={e => setFormData(f => ({ ...f, ativo: e.target.checked }))}
                            className="w-4 h-4" style={{ accentColor: "#16A34A" }} />
                          <span className="text-xs font-mono-tech" style={{ color: "#6C757D" }}>Produto ativo no catálogo</span>
                        </label>
                      </div>
                    </div>

                    {/* Modal footer */}
                    <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: "1px solid #E2E8F0" }}>
                      <button onClick={() => setModalOpen(false)}
                        className="h-9 px-4 text-xs font-mono-tech"
                        style={{ background: "#F8F9FA", border: "1px solid #E2E8F0", color: "#6C757D", borderRadius: "2px" }}>
                        CANCELAR
                      </button>
                      <button onClick={handleSave} disabled={saving || !formData.sku_codigo || !formData.nome_peca}
                        className="h-9 px-5 text-xs font-mono-tech font-bold disabled:opacity-50"
                        style={{ background: "linear-gradient(135deg, #D32F2F, #B71C1C)", color: "#fff", border: "none", borderRadius: "2px" }}>
                        {saving ? "SALVANDO..." : editingProduto ? "SALVAR ALTERAÇÕES" : "CRIAR PRODUTO"}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeInTab {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
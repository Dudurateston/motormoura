import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

function sanitize(str) {
  if (!str) return '';
  return String(str).replace(/[<>"'&]/g, '').trim().slice(0, 200);
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const base44 = createClientFromRequest(req);
  const body = await req.json();

  const q = sanitize(body.q || '');
  const categoria = sanitize(body.categoria || '');
  const marca = sanitize(body.marca || '');
  const page = Math.max(1, parseInt(body.page) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(body.pageSize) || 36));

  // Buscar todos ativos (com filtros de DB onde possível)
  let filter = { ativo: true };
  if (categoria) filter.relacionamento_categoria = categoria;
  if (marca) filter.relacionamento_marca = marca;

  // Catálogo público — RLS de Produtos permite leitura sem autenticação (read: {})
  const todos = await base44.entities.Produtos.filter(filter, 'nome_peca', 5000);

  // Filtro por texto no servidor
  let resultado = todos;
  if (q) {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    resultado = todos.filter(p => {
      const hay = `${p.sku_codigo || ''} ${p.nome_peca || ''} ${p.relacionamento_marca || ''}`.toLowerCase();
      return terms.every(t => hay.includes(t));
    });
  }

  const total = resultado.length;
  const totalPages = Math.ceil(total / pageSize);
  const items = resultado.slice((page - 1) * pageSize, page * pageSize);

  // Retornar apenas campos necessários (reduz payload)
  const slim = items.map(p => ({
    id: p.id,
    sku_codigo: p.sku_codigo,
    nome_peca: p.nome_peca,
    relacionamento_categoria: p.relacionamento_categoria,
    relacionamento_marca: p.relacionamento_marca,
    preco_base_atacado: p.preco_base_atacado,
    estoque_disponivel: p.estoque_disponivel,
    imagem_url: p.imagem_url,
    destaque: p.destaque,
    especificacoes_eletricas: p.especificacoes_eletricas,
  }));

  return Response.json({ items: slim, total, totalPages, page });
});
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// Rate limit: max 5 orçamentos por IP nos últimos 10 minutos
const rateLimitMap = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const max = 5;

  if (!rateLimitMap.has(ip)) rateLimitMap.set(ip, []);
  const timestamps = rateLimitMap.get(ip).filter(t => now - t < windowMs);
  if (timestamps.length >= max) return false;
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return true;
}

function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>"'&]/g, '').trim().slice(0, 500);
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const ip = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown';
  if (!checkRateLimit(ip)) {
    return Response.json({ error: 'Muitas requisições. Aguarde alguns minutos.' }, { status: 429 });
  }

  const base44 = createClientFromRequest(req);
  let user = null;
  try { user = await base44.auth.me(); } catch (_) { /* anônimo */ }

  const body = await req.json();
  const { itens, observacoes } = body;

  // Validações
  if (!Array.isArray(itens) || itens.length === 0) {
    return Response.json({ error: 'Lista de itens inválida.' }, { status: 400 });
  }
  if (itens.length > 100) {
    return Response.json({ error: 'Máximo de 100 itens por orçamento.' }, { status: 400 });
  }

  // Sanitizar cada item
  const itensSanitizados = itens.map(item => ({
    sku_codigo: sanitizeString(item.sku_codigo || ''),
    nome_peca: sanitizeString(item.nome_peca || ''),
    quantidade: Math.max(1, Math.min(9999, parseInt(item.quantidade) || 1)),
  })).filter(item => item.sku_codigo && item.nome_peca);

  if (itensSanitizados.length === 0) {
    return Response.json({ error: 'Nenhum item válido encontrado.' }, { status: 400 });
  }

  // Verificar se SKUs existem no catálogo
  const skus = itensSanitizados.map(i => i.sku_codigo);
  const produtos = await base44.asServiceRole.entities.Produtos.filter({ sku_codigo: { $in: skus } });
  const skusValidos = new Set(produtos.map(p => p.sku_codigo));
  const itensVerificados = itensSanitizados.filter(i => skusValidos.has(i.sku_codigo));

  if (itensVerificados.length === 0) {
    return Response.json({ error: 'Nenhum SKU válido encontrado no catálogo.' }, { status: 400 });
  }

  // Usar serviceRole apenas para contornar RLS em criações anónimas validadas
  const orcamento = await base44.asServiceRole.entities.Orcamentos.create({
    numero_orcamento: `ORC-${Date.now()}`,
    lojista_email: user?.email || 'anonimo',
    lojista_nome: sanitizeString(user?.full_name || 'Visitante'),
    itens: itensVerificados,
    observacoes: observacoes ? sanitizeString(observacoes) : '',
    status: 'pendente',
  });

  return Response.json({ success: true, orcamento_id: orcamento.id, numero: orcamento.numero_orcamento });
});
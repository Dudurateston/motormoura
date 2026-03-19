import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    return Response.json({
      whatsapp_number: Deno.env.get("WHATSAPP_NUMBER") || "5585986894081",
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
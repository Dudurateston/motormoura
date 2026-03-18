import { base44 } from "@/api/base44Client";

// Valor padrão — será sobrescrito por loadConfig()
let _whatsappNumber = "5585986894081";

// Chama o backend para obter configurações (número do WhatsApp vem do secret)
export async function loadConfig() {
  try {
    const res = await base44.functions.invoke('getConfig', {});
    if (res?.data?.whatsapp_number) {
      _whatsappNumber = res.data.whatsapp_number;
    }
  } catch (_) {
    // Mantém o valor padrão em caso de falha
  }
}

export function whatsappUrl(msg = "") {
  return `https://api.whatsapp.com/send?phone=${_whatsappNumber}&text=${encodeURIComponent(msg || "Olá, MotorMoura!")}`;
}

export function getWhatsappNumber() {
  return _whatsappNumber;
}

// WHATSAPP_NUMBER exportado para retrocompatibilidade
export const WHATSAPP_NUMBER = _whatsappNumber;
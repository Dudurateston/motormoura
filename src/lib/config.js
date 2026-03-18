// Configurações centralizadas da aplicação
export const WHATSAPP_NUMBER = "5585986894081";
export const WHATSAPP_BASE_URL = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}`;
export const WHATSAPP_DEFAULT_MSG = encodeURIComponent("Olá, MotorMoura!");

export function whatsappUrl(msg = "") {
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(msg || "Olá, MotorMoura!")}`;
}
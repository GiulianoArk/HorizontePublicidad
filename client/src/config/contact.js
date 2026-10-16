export const phoneNumber = '5491112345678';

export const contactPhoneDisplay = '+54 9 11 1234-5678';

export const contactEmail = 'contacto@horizontepub.com';

export const defaultWhatsAppMessage =
  'Hola, me interesa alquilar un cartel publicitario';

export function buildWhatsAppUrl(message = defaultWhatsAppMessage) {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

export function buildCartelWhatsAppMessage(titulo, direccion) {
  return `Hola, me interesa consultar por el cartel "${titulo}" ubicado en ${direccion}.`;
}

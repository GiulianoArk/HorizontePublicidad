import { getCarteles } from '../api';

export async function loadCarteles() {
  if (import.meta.env.VITE_USE_API === 'true') {
    return getCarteles();
  }

  const response = await fetch('/data/carteles.json');
  if (!response.ok) {
    throw new Error('No se pudieron cargar los carteles publicados');
  }
  return response.json();
}

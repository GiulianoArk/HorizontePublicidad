async function apiRequest(path, options = {}) {
  const isForm = options.body instanceof FormData;
  const response = await fetch(path, {
    credentials: 'include',
    ...options,
    headers: isForm
      ? options.headers
      : {
          'Content-Type': 'application/json',
          ...options.headers,
        },
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(data?.error || 'Error de servidor');
    error.status = response.status;
    throw error;
  }
  return data;
}

export function getCarteles() {
  return apiRequest('/api/carteles');
}

export function login(email, password) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function logout() {
  return apiRequest('/api/auth/logout', { method: 'POST' });
}

export function getMe() {
  return apiRequest('/api/auth/me');
}

export function createCartel(formData) {
  return apiRequest('/api/carteles', { method: 'POST', body: formData });
}

export function updateCartel(id, formData) {
  return apiRequest(`/api/carteles/${id}`, { method: 'PUT', body: formData });
}

export function deleteCartel(id) {
  return apiRequest(`/api/carteles/${id}`, { method: 'DELETE' });
}

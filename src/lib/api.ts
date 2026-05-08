/**
 * Cliente HTTP do backend NestJS.
 * Configure VITE_API_URL no .env do frontend para apontar para o backend hospedado.
 * Default: http://localhost:3001/api (NestJS rodando local).
 */
const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3001/api';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((init.headers as Record<string, string>) ?? {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...init, headers });
  } catch (err) {
    throw new ApiError(
      'Não foi possível conectar ao servidor. Verifique se o backend NestJS está rodando.',
      0,
    );
  }

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) ||
      (typeof data === 'string' ? data : null) ||
      `Erro ${res.status}`;
    throw new ApiError(Array.isArray(msg) ? msg.join(', ') : msg, res.status);
  }
  return data as T;
}

function safeJson(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

// ── Auth helpers ─────────────────────────────────────
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  phone?: string | null;
  phoneVerified?: boolean;
}

export const authApi = {
  sendCode: (phone: string) =>
    api.post<{ status: string; to: string }>('/auth/send-code', { phone }),
  verifyCode: (phone: string, code: string) =>
    api.post<{ approved: boolean; verificationToken?: string }>('/auth/verify-code', {
      phone,
      code,
    }),
  register: (input: {
    email: string;
    name: string;
    password: string;
    phone: string;
    verificationToken: string;
  }) => api.post<{ user: AuthUser; token: string }>('/auth/register', input),
  login: (email: string, password: string) =>
    api.post<{ user: AuthUser; token: string }>('/auth/login', { email, password }),
  me: () => api.get<AuthUser>('/auth/me'),
};

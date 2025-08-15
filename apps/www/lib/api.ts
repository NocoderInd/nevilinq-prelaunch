// apps/www/lib/api.ts

/** Base URL for your backend (FastAPI, etc.) */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") || "http://127.0.0.1:8000";

/** Generic fetch helper with JSON + error extraction */
async function request<T = any>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    // credentials: "include", // <-- uncomment if using cookie-based auth
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      msg = (j && (j.detail || j.message)) || msg;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(msg);
  }
  return (res.status === 204 ? ({} as T) : ((await res.json()) as T));
}

/** Types */
export interface LoginResponse {
  access_token: string;
  token_type?: string;
  user?: any;
}

export interface EmailLoginPayload {
  email: string;
  password: string;
}

export interface IdentifierLoginPayload {
  /** email OR phone (E.164) */
  identifier: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  whatsapp?: string;
  telegram?: string;
}

/** Public API */
export const api = {
  /** Legacy email+password login */
  login(payload: EmailLoginPayload): Promise<LoginResponse> {
    return request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /** New: email OR phone (identifier)+password login */
  loginPrime(payload: IdentifierLoginPayload): Promise<LoginResponse> {
    return request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  signup(payload: SignupPayload) {
    return request("/auth/signup", { method: "POST", body: JSON.stringify(payload) });
  },

  me() {
    return request("/auth/me", { method: "GET" });
  },
};

export default api;

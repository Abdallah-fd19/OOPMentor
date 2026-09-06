export interface Result<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: string[] | null;
  status: number;
}

const API_URL = "https://localhost:7127/api";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

async function request<T>(
  endpoint: string,
  method: HttpMethod = "GET",
  body?: unknown,
  token?: string
): Promise<Result<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}/${endpoint}`, {
      method,
      headers,
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    return {
      success: false,
      message: "Network error — could not reach the server.",
      data: null,
      errors: [String(err)],
      status: 0,
    };
  }

  try {
    const result: Result<T> = await res.json();
    return { ...result, status: res.status };
  } catch {
    return {
      success: false,
      message: `Request failed with status ${res.status}.`,
      data: null,
      errors: null,
      status: res.status,
    };
  }
}

export interface AuthResponse {
  accessToken: string;
  email: string;
  displayName: string;
}

export interface RegisterRequest {
  email: string;
  displayName: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

function register(data: RegisterRequest) {
  return request<AuthResponse>("Auth/register", "POST", data);
}

function login(data: LoginRequest) {
  return request<AuthResponse>("Auth/login", "POST", data);
}

function refresh() {
  return request<AuthResponse>("Auth/refresh", "POST");
}

export { request, register, login, refresh };

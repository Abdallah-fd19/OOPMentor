import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  request,
  login as apiLogin,
  register as apiRegister,
  refresh as apiRefresh,
  type LoginRequest,
  type RegisterRequest,
  type AuthResponse,
  type Result,
  type HttpMethod,
} from "../api/client";

interface AuthUser {
  email: string;
  displayName: string;
}

interface AuthResult {
  success: boolean;
  message: string;
}

interface AuthContextValue {
  accessToken: string | null;
  user: AuthUser | null;
  isInitializing : boolean;
  login: (data: LoginRequest) => Promise<AuthResult>;
  register: (data: RegisterRequest) => Promise<AuthResult>;
  logout: () => void;
  authFetch: <T>(endpoint: string, method?: HttpMethod, body?: unknown) => Promise<Result<T>>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  useEffect(() => {
    async function restoreSession() {
      const res = await apiRefresh();
      if (res.data && res.success) {
        applyAuthResponse(res.data);
      }
      setIsInitializing(false);
    }
    restoreSession();
  }, [])

  function applyAuthResponse(data: AuthResponse) {
    setAccessToken(data.accessToken);
    setUser({ email: data.email, displayName: data.displayName });
  }

  async function login(data: LoginRequest): Promise<AuthResult> {
    const result = await apiLogin(data);
    if (result.success && result.data) {
      applyAuthResponse(result.data);
    }
    return { success: result.success, message: result.message };
  }

  async function register(data: RegisterRequest): Promise<AuthResult> {
    const result = await apiRegister(data);
    if (result.success && result.data) {
      applyAuthResponse(result.data);
    }
    return { success: result.success, message: result.message };
  }

  function logout() {
    setAccessToken(null);
    setUser(null);
  }

  async function authFetch<T>(
    endpoint: string,
    method: HttpMethod = "GET",
    body?: unknown
  ): Promise<Result<T>> {
    const result = await request<T>(endpoint, method, body, accessToken ?? undefined);

    if (result.status !== 401) {
      return result;
    }

    const refreshResult = await apiRefresh();
    if (!refreshResult.success || !refreshResult.data) {
      logout();
      return result;
    }

    applyAuthResponse(refreshResult.data);
    return request<T>(endpoint, method, body, refreshResult.data.accessToken);
  }

  return (
    <AuthContext.Provider value={{ accessToken, user, isInitializing, login, register, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

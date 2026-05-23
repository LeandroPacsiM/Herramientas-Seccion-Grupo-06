import { api } from "@/lib/api";

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
}

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    return api.post<AuthResponse>("/auth/register", data);
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return api.post<AuthResponse>("/auth/login", data);
  },
};

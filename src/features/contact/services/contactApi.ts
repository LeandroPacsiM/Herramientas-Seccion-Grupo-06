import { api } from "@/lib/api";

export interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

export const contactApi = {
  send: async (data: ContactRequest): Promise<void> => {
    await api.post("/api/contact", data);
  },
};

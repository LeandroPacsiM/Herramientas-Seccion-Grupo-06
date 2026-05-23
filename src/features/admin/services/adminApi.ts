import { api } from "@/lib/api";
import type { Expedition } from "@/features/expeditions/types";
import type { Booking } from "@/features/bookings/types";

export const adminApi = {
  getExpeditions: async (): Promise<Expedition[]> => {
    return api.get<Expedition[]>("/api/admin/expeditions");
  },

  getBookings: async (): Promise<Booking[]> => {
    return api.get<Booking[]>("/api/admin/bookings");
  },

  createExpedition: async (data: Omit<Expedition, "id">): Promise<Expedition> => {
    return api.post<Expedition>("/api/admin/expeditions", data);
  },

  updateExpedition: async (id: number, data: Partial<Expedition>): Promise<Expedition> => {
    return api.put<Expedition>(`/api/admin/expeditions/${id}`, data);
  },

  deleteExpedition: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/expeditions/${id}`);
  },
};

import { api } from "@/lib/api";
import type { Expedition } from "../types";

export const expeditionApi = {
  getAll: async (): Promise<Expedition[]> => {
    return api.get<Expedition[]>("/api/expeditions");
  },

  getById: async (id: number): Promise<Expedition> => {
    const all = await api.get<Expedition[]>("/api/expeditions");
    const found = all.find((e) => e.id === id);
    if (!found) throw new Error("Expedición no encontrada");
    return found;
  },

  getBySlug: async (slug: string): Promise<Expedition> => {
    const all = await api.get<Expedition[]>("/api/expeditions");
    const found = all.find((e) => e.slug === slug);
    if (!found) throw new Error("Expedición no encontrada");
    return found;
  },
};

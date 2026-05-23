import { api } from "@/lib/api";
import type { Booking } from "../types";

export interface CreateBookingRequest {
  availabilityId: number;
  peopleCount: number;
}

export const bookingApi = {
  getMyBookings: async (): Promise<Booking[]> => {
    return api.get<Booking[]>("/api/bookings");
  },

  create: async (data: CreateBookingRequest): Promise<Booking> => {
    return api.post<Booking>("/api/bookings", data);
  },

  cancel: async (id: number): Promise<void> => {
    await api.post(`/api/bookings/${id}/cancel`);
  },
};

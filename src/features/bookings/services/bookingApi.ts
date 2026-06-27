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

  getById: async (id: number): Promise<Booking> => {
    const bookings = await api.get<Booking[]>("/api/bookings");
    const found = bookings.find((b) => b.id === id);
    if (!found) throw new Error("Booking not found");
    return found;
  },

  create: async (data: CreateBookingRequest): Promise<Booking> => {
    return api.post<Booking>("/api/bookings", data);
  },

  pay: async (id: number): Promise<Booking> => {
    const fakePaymentId = `PAY-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
    return api.post<Booking>(`/api/bookings/${id}/pay?paymentId=${fakePaymentId}`);
  },

  cancel: async (id: number): Promise<void> => {
    await api.post(`/api/bookings/${id}/cancel`);
  },
};

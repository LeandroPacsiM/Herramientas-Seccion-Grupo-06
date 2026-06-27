import { api } from "@/lib/api";

export interface CreateCheckoutSessionResponse {
  sessionUrl: string;
  sessionId: string;
}

export interface PaymentDetails {
  bookingId: number;
  receiptNumber: string;
  expeditionName: string;
  startDate: string;
  endDate: string;
  peopleCount: number;
  totalAmount: number;
  status: string;
  paymentId: string;
  bookingDate: string;
  customerName: string;
  customerEmail: string;
}

export const paymentApi = {
  createCheckoutSession: async (bookingId: number): Promise<CreateCheckoutSessionResponse> => {
    return api.post<CreateCheckoutSessionResponse>(
      `/api/payments/create-checkout-session?bookingId=${bookingId}`
    );
  },

  getPaymentDetails: async (bookingId: number): Promise<PaymentDetails> => {
    return api.get<PaymentDetails>(`/api/payments/${bookingId}/details`);
  },
};

export interface Booking {
  id: number;
  peopleCount: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  userId: number;
  expeditionId: number;
  expeditionName: string;
  availabilityId: number;
  startDate: string;
  endDate: string;
}

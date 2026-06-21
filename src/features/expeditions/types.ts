export interface Itinerary {
  id: number;
  dayNumber: number;
  title: string;
  description: string;
}

export interface Image {
  id: number;
  url: string;
  imageOrder: number;
}

export interface Availability {
  id: number;
  startDate: string;
  endDate: string;
  capacity: number;
  availableSpots: number;
}

export interface Expedition {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  durationDays: number;
  difficulty: "EASY" | "MODERATE" | "HARD";
  location: string;
  itineraries: Itinerary[];
  images: Image[];
  availabilities: Availability[];
  latitude?: number;
  longitude?: number;
}

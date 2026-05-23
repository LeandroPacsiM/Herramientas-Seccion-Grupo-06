// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Toggle between mock data and real API
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

// Token Storage
export const TOKEN_KEY = "llamatours_token";
export const USER_KEY = "llamatours_user";

// Routes
export const ROUTES = {
  HOME: "/",
  EXPEDITIONS: "/viajes",
  EXPEDITION_DETAIL: "/viaje/:slug",
  CONTACT: "/contacto",
  ABOUT: "/nosotros",
  LOGIN: "/login",
  REGISTER: "/register",
  MY_BOOKINGS: "/mis-reservas",
  ADMIN: "/admin",
  ADMIN_EXPEDITIONS: "/admin/expediciones",
} as const;

import { Suspense } from "react";
import { Routes, Route } from "react-router";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import Loading from "./components/shared/Loading";

// Pages
import HomePage from "@/features/home/pages/HomePage";
import NosotrosPage from "@/features/home/pages/NosotrosPage";
import ViajesPage from "@/features/expeditions/pages/ViajesPage";
import ExpeditionDetailPage from "@/features/expeditions/pages/ExpeditionDetailPage";
import ContactoPage from "@/features/contact/pages/ContactoPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import MisReservasPage from "@/features/bookings/pages/MisReservasPage";
import AdminDashboardPage from "@/features/admin/pages/AdminDashboardPage";
import AdminExpeditionsPage from "@/features/admin/pages/AdminExpeditionsPage";

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/viajes" element={<ViajesPage />} />
        <Route path="/viajes/:slug" element={<ExpeditionDetailPage />} />
        <Route path="/contacto" element={<ContactoPage />} />
        <Route path="/nosotros" element={<NosotrosPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* User Protected Routes */}
        <Route
          path="/mis-reservas"
          element={
            <ProtectedRoute>
              <MisReservasPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes — requieren rol ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/expediciones"
          element={
            <ProtectedRoute requireAdmin>
              <AdminExpeditionsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

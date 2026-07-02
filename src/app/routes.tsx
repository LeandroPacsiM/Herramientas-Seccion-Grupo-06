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
import ClaimsPage from "@/features/claims/pages/ClaimsPage";
import MisReservasPage from "@/features/bookings/pages/MisReservasPage";
import CheckoutPage from "@/features/payment/pages/CheckoutPage";
import PaymentSuccessPage from "@/features/payment/pages/PaymentSuccessPage";
import PaymentReceiptPage from "@/features/payment/pages/PaymentReceiptPage";
import AdminDashboardPage from "@/features/admin/pages/AdminDashboardPage";
import AdminExpeditionsPage from "@/features/admin/pages/AdminExpeditionsPage";
import AdminClaimsPage from "@/features/admin/pages/AdminClaimsPage";

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
        <Route path="/libro-de-reclamaciones" element={<ClaimsPage />} />

        {/* User Protected Routes */}
        <Route
          path="/mis-reservas"
          element={
            <ProtectedRoute>
              <MisReservasPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout/:bookingId"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/success"
          element={
            <ProtectedRoute>
              <PaymentSuccessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/receipt/:bookingId"
          element={
            <ProtectedRoute>
              <PaymentReceiptPage />
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
        <Route
          path="/admin/reclamaciones"
          element={
            <ProtectedRoute requireAdmin>
              <AdminClaimsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

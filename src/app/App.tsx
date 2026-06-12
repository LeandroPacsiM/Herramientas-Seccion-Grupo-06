import { BrowserRouter, useLocation } from "react-router";
import { AuthProvider } from "@/context/AuthContext";
import { AccessibilityProvider } from "@/context/AccessibilityContext";
import AccessibilityDrawer from "./components/shared/AccessibilityDrawer";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AppRoutes from "./routes";
import ReadingMask from "./components/shared/ReadingMask";

function Layout() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <AppRoutes />;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <AppRoutes />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <AccessibilityProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Layout />
            <ReadingMask />
            <AccessibilityDrawer />
          </div>
        </AuthProvider>
      </AccessibilityProvider>
    </BrowserRouter>
  );
}

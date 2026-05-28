import { BrowserRouter, useLocation } from "react-router";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AppRoutes from "./routes";

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
      <AuthProvider>
        <div className="min-h-screen flex flex-col dark bg-background text-foreground">
          <Layout />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

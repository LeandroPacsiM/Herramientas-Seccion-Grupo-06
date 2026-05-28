import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { LogIn, LogOut, Menu, Sun, User as UserIcon, Shield, CalendarCheck, Lock } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [reservasPopover, setReservasPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cierra el popover al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setReservasPopover(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Viajes", href: "/viajes" },
    { name: "Contacto", href: "/contacto" },
    { name: "Sobre Nosotros", href: "/nosotros" },
  ];

  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl shadow-lg border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 transition-transform hover:scale-105 flex items-center gap-2">
          <div className="w-[70px] h-[70px] bg-brand/10 rounded-full flex items-center justify-center">
            <span className="text-4xl">🦙</span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center space-x-8 font-semibold text-sm">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href} className="text-foreground/80 hover:text-brand transition-colors">
              {link.name}
            </Link>
          ))}

          {/* Mis Reservas — solo para usuarios no-admin */}
          {!isAdmin && (
            <div className="relative" ref={popoverRef}>
              {isAuthenticated ? (
                <Link to="/mis-reservas" className="flex items-center gap-1.5 text-foreground/80 hover:text-brand transition-colors">
                  <CalendarCheck size={15} />
                  Mis Reservas
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => setReservasPopover((v) => !v)}
                    className="flex items-center gap-1.5 text-foreground/40 hover:text-foreground/60 transition-colors cursor-pointer"
                  >
                    <CalendarCheck size={15} />
                    Mis Reservas
                  </button>

                  {reservasPopover && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-60 bg-card border border-border rounded-xl shadow-xl p-4 space-y-3 z-50">
                      {/* Arrow */}
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-card border-t border-l border-border rotate-45" />
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Lock size={14} className="text-brand flex-shrink-0" />
                        <p className="text-xs leading-snug">
                          Debes iniciar sesión para acceder a tus reservas.
                        </p>
                      </div>
                      <Link to="/login?redirect=/mis-reservas" onClick={() => setReservasPopover(false)}>
                        <Button className="w-full h-8 text-xs font-bold">
                          <LogIn size={13} className="mr-1.5" />
                          Iniciar sesión
                        </Button>
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="text-brand rounded-full">
            <Sun size={20} />
          </Button>

          {isAuthenticated ? (
            <>
              {isAdmin ? (
                <Link to="/admin" className="hidden sm:flex items-center gap-2 text-sm text-brand hover:text-brand-soft transition-colors">
                  <Shield size={16} />
                  <span className="font-semibold">Admin</span>
                </Link>
              ) : (
                <Link to="/mis-reservas" className="hidden sm:flex items-center gap-2 text-sm text-foreground/80 hover:text-brand transition-colors">
                  <UserIcon size={16} />
                  <span className="font-semibold">{user?.name}</span>
                </Link>
              )}
              <Button onClick={handleLogout} variant="outline" className="hidden sm:flex font-bold border-white/10">
                <LogOut size={16} className="mr-2" />
                Salir
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="default" className="hidden sm:flex font-bold shadow-lg shadow-brand/10">
                <LogIn size={16} className="mr-2" />
                Ingresar
              </Button>
            </Link>
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-foreground">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="bg-background border-border">
              <SheetHeader>
                <SheetTitle className="text-brand font-bold">LlamaTours</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => (
                  <Link key={link.href} to={link.href} className="text-lg font-medium text-foreground hover:text-brand">
                    {link.name}
                  </Link>
                ))}

                {/* Mis Reservas mobile — solo no-admin */}
                {!isAdmin && (
                  isAuthenticated ? (
                    <Link to="/mis-reservas" className="text-lg font-medium text-foreground hover:text-brand flex items-center gap-2">
                      <CalendarCheck size={18} />
                      Mis Reservas
                    </Link>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-foreground/40">
                        <CalendarCheck size={18} />
                        <span className="text-lg font-medium">Mis Reservas</span>
                      </div>
                      <div className="flex items-center gap-2 bg-brand/5 border border-brand/20 rounded-xl px-3 py-2">
                        <Lock size={13} className="text-brand flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">
                          Inicia sesión para ver tus reservas.
                        </p>
                      </div>
                    </div>
                  )
                )}

                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <Link to="/admin" className="text-lg font-medium text-brand hover:text-brand-soft flex items-center gap-2">
                        <Shield size={18} />
                        Panel Admin
                      </Link>
                    )}
                    <p className="text-sm text-muted-foreground">Sesión: {user?.name}</p>
                    <Button onClick={handleLogout} variant="outline" className="w-full font-bold border-white/10">
                      <LogOut size={16} className="mr-2" />
                      Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button className="w-full font-bold">
                        <LogIn size={16} className="mr-2" />
                        Ingresar
                      </Button>
                    </Link>
                    <Link to="/register" className="text-center text-sm text-brand hover:underline">
                      ¿No tienes cuenta? Regístrate
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { LogIn, LogOut, Menu, User as UserIcon, Shield, CalendarCheck, Lock } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { t } = useTranslation();
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
        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
          <img src="/assets/img/icons/llama.png" alt="LlamaTOURS" className="h-24 w-24 object-contain" />
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
          <Button
            variant="ghost"
            size="icon"
            className="bg-primary text-primary-foreground rounded-full hover:bg-primary/90"
            onClick={() => window.dispatchEvent(new CustomEvent("toggle-accessibility"))}
            aria-label={t("accessibility.openAccessibility")}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4,8 L11,8 L11,14 L7,21 M20,8 L13,8 L13,14 L17,21 M12,5 C12.55,5 13,4.55 13,4 C13,3.45 12.55,3 12,3 C11.45,3 11,3.45 11,4 C11,4.55 11.45,5 12,5 Z M11,8 L13,8 L13,13 L11,13 L11,8 Z" />
            </svg>
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
            <SheetContent side="right" className="bg-background border-border p-0 flex flex-col">
              {/* Brand header */}
              <div className="bg-background border-b border-border px-5 py-5 flex items-center justify-center">
                <img src="/assets/img/icons/llama.png" alt="LlamaTOURS" className="h-12 w-12 object-contain" />
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto px-4 py-5 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-center gap-3 px-4 py-3.5 bg-card border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all shadow-sm text-foreground font-medium text-sm"
                  >
                    {link.name}
                  </Link>
                ))}

                <hr className="border-border my-3" />

                {/* Mis Reservas mobile — solo no-admin */}
                {!isAdmin && (
                  isAuthenticated ? (
                    <Link
                      to="/mis-reservas"
                      className="flex items-center gap-3 px-4 py-3.5 bg-card border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all shadow-sm text-foreground font-medium text-sm"
                    >
                      <CalendarCheck size={18} className="text-brand" />
                      Mis Reservas
                    </Link>
                  ) : (
                    <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarCheck size={18} />
                        <span className="font-medium text-sm">Mis Reservas</span>
                      </div>
                      <div className="flex items-start gap-2 bg-brand/5 border border-brand/20 rounded-lg px-3 py-2">
                        <Lock size={13} className="text-brand flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground">
                          Inicia sesión para ver tus reservas.
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Auth section */}
              <div className="px-4 py-4 bg-muted border-t border-border space-y-3">
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all shadow-sm text-brand font-medium text-sm"
                      >
                        <Shield size={18} />
                        Panel Admin
                      </Link>
                    )}
                    <p className="text-xs text-muted-foreground px-1">Sesión: {user?.name}</p>
                    <Button onClick={handleLogout} variant="outline" className="w-full font-bold">
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
                    <Link to="/register" className="block text-center text-sm text-brand hover:underline">
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

import { ReactNode } from "react";
import { LayoutDashboard, Map, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/expediciones", label: "Expediciones", icon: Map },
];

interface AdminLayoutProps {
  children: ReactNode;
  current: string;
}

export default function AdminLayout({ children, current }: AdminLayoutProps) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-card border-r border-border flex flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-border">
          <a href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🦙</span>
            <div>
              <p className="text-foreground font-bold leading-none">LlamaTours</p>
              <p className="text-brand text-xs font-semibold">Panel Admin</p>
            </div>
          </a>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = current === href;
            return (
              <a
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand/10 text-brand"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon size={18} />
                {label}
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </a>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="px-3 py-4 border-t border-border space-y-1">
          <div className="px-3 py-2">
            <p className="text-foreground text-sm font-medium truncate">{user?.name}</p>
            <p className="text-muted-foreground text-xs truncate">{user?.email}</p>
          </div>
          <a
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <Map size={16} />
            Ver sitio público
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-background">
        {children}
      </main>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Mail, Lock, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/features/auth/services/authApi";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const redirect = new URLSearchParams(window.location.search).get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authApi.login({ email, password });
      const userData = login(response.token, response.email, response.name, response.role);
      if (redirect !== "/") {
        navigate(redirect);
      } else {
        navigate(userData.role === "ADMIN" ? "/admin" : "/mis-reservas");
      }
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pl-10"
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
            Iniciando sesión...
          </>
        ) : (
          <>
            <LogIn size={18} className="mr-2" />
            Iniciar Sesión
          </>
        )}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-brand hover:text-brand-soft hover:underline font-semibold">
            Regístrate aquí
          </Link>
        </p>
      </div>

      {/* Helper para pruebas */}
      <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
        <p className="text-xs text-foreground mb-2 font-semibold">Credenciales de prueba:</p>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p><strong className="text-brand">Usuario:</strong> user@llamatours.com / password123</p>
          <p><strong className="text-brand">Admin:</strong> admin@llamatours.com / admin123</p>
        </div>
      </div>
    </form>
  );
}

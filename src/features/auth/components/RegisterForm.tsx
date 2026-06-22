import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Mail, Lock, User, UserPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/features/auth/services/authApi";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.register({ name, email, password });
      login(response.token, response.email, response.name, response.role);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Error al registrarse");
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
        <Label htmlFor="name">Nombre completo</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            id="name"
            type="text"
            placeholder="Juan Pérez"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="pl-10"
          />
        </div>
      </div>

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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="pl-10"
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
            Registrando...
          </>
        ) : (
          <>
            <UserPlus size={18} className="mr-2" />
            Crear Cuenta
          </>
        )}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-brand hover:text-brand-soft hover:underline font-semibold">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </form>
  );
}

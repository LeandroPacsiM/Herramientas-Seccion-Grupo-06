import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="flex-1 py-32 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <p className="text-brand font-bold tracking-widest uppercase text-sm mb-4">Únete</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4">
            Crea tu <span className="text-brand">Cuenta</span>
          </h1>
          <p className="text-muted-foreground">
            Regístrate para reservar expediciones y acceder a ofertas exclusivas.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-2xl">
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}

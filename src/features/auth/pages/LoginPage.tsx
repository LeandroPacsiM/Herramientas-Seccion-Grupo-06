import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex-1 py-32 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <p className="text-brand font-bold tracking-widest uppercase text-sm mb-4">Bienvenido</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Inicia <span className="text-brand">Sesión</span>
          </h1>
          <p className="text-slate-300">
            Accede a tu cuenta para gestionar tus reservas y descubrir nuevas aventuras.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-2xl">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}

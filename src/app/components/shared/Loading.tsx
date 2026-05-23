export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-brand/30 rounded-full" />
          <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-foreground font-semibold text-lg">Cargando...</p>
          <p className="text-muted-foreground text-sm">Preparando tu aventura</p>
        </div>
      </div>
    </div>
  );
}

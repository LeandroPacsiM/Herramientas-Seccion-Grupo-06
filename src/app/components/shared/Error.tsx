import { AlertCircle } from "lucide-react";

interface ErrorProps {
  message?: string;
  onRetry?: () => void;
}

export default function Error({ message = "Ocurrió un error", onRetry }: ErrorProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-6 max-w-md text-center px-4">
        <div className="w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center border-2 border-destructive/30">
          <AlertCircle className="w-10 h-10 text-destructive" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white">Error</h3>
          <p className="text-slate-200 text-lg">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-brand hover:bg-brand-soft text-black px-8 py-3 rounded-md font-bold transition-all shadow-lg shadow-brand/20"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}

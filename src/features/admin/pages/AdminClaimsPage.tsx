import { useEffect, useState } from "react";
import { Search, Eye, CheckCircle2, Clock, AlertCircle, FileText, X } from "lucide-react";
import AdminLayout from "@/app/components/layout/AdminLayout";
import { api } from "@/lib/api";
import { ClaimResponse, ClaimStatus } from "@/features/claims/types";

export default function AdminClaimsPage() {
  const [claims, setClaims] = useState<ClaimResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [selectedClaim, setSelectedClaim] = useState<ClaimResponse | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  const loadClaims = async () => {
    setLoading(true);
    let apiClaims: ClaimResponse[] = [];
    try {
      // Intentar obtener del backend
      apiClaims = await api.get<ClaimResponse[]>("/api/admin/claims");
    } catch (err) {
      console.warn("No se pudo conectar al backend para listar reclamos. Usando solo local storage:", err);
    }

    // Cargar también reclamos offline guardados en localStorage
    const offlineClaimsJson = localStorage.getItem("llamatours_offline_claims");
    const offlineClaims: ClaimResponse[] = offlineClaimsJson ? JSON.parse(offlineClaimsJson) : [];

    // Combinar (evitando duplicados por código)
    const combinedClaims = [...apiClaims];
    offlineClaims.forEach((oc) => {
      if (!combinedClaims.some((c) => c.code === oc.code)) {
        combinedClaims.push(oc);
      }
    });

    // Ordenar de más reciente a más antiguo
    combinedClaims.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setClaims(combinedClaims);
    setLoading(false);
  };

  useEffect(() => {
    loadClaims();
  }, []);

  const handleOpenDetail = (claim: ClaimResponse) => {
    setSelectedClaim(claim);
    setReplyText(claim.reply || "");
    setReplyError(null);
  };

  const handleCloseDetail = () => {
    setSelectedClaim(null);
    setReplyText("");
    setReplyError(null);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClaim || !replyText.trim()) return;

    setReplyLoading(true);
    setReplyError(null);

    const isOffline = selectedClaim.code.includes("-OFF-");

    try {
      if (!isOffline) {
        // Enviar al backend si no es offline
        const updated = await api.post<ClaimResponse>(`/api/admin/claims/${selectedClaim.id}/reply`, {
          reply: replyText,
        });
        
        // Actualizar estado local
        setClaims((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        setSelectedClaim(updated);
      } else {
        // Responder en localStorage si es offline
        const offlineClaimsJson = localStorage.getItem("llamatours_offline_claims");
        let offlineClaims: ClaimResponse[] = offlineClaimsJson ? JSON.parse(offlineClaimsJson) : [];
        
        offlineClaims = offlineClaims.map((oc) => {
          if (oc.code === selectedClaim.code) {
            return {
              ...oc,
              reply: replyText,
              repliedAt: new Date().toISOString(),
              status: "ATENDIDO",
            };
          }
          return oc;
        });

        localStorage.setItem("llamatours_offline_claims", JSON.stringify(offlineClaims));
        
        // Actualizar estado de la lista y detalle
        const updatedClaim = {
          ...selectedClaim,
          reply: replyText,
          repliedAt: new Date().toISOString(),
          status: "ATENDIDO" as ClaimStatus,
        };

        setClaims((prev) => prev.map((c) => (c.code === selectedClaim.code ? updatedClaim : c)));
        setSelectedClaim(updatedClaim);
      }
      
      // Recargar lista para asegurar sincronización
      loadClaims();
    } catch (err) {
      console.error(err);
      setReplyError("Ocurrió un error al enviar la respuesta al servidor. Intente responder en modo local.");
    } finally {
      setReplyLoading(false);
    }
  };

  // Filtrado
  const filtered = claims.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.documentNumber.includes(search);

    const matchesStatus =
      filterStatus === "ALL" ||
      (filterStatus === "PENDIENTE" && c.status === "PENDIENTE") ||
      (filterStatus === "ATENDIDO" && c.status === "ATENDIDO");

    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout current="/admin/reclamaciones">
      <div className="p-8 space-y-8">
        {/* Cabecera */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Libro de Reclamaciones</h1>
            <p className="text-muted-foreground text-sm mt-1">Gestione y responda a los reclamos y quejas de los usuarios.</p>
          </div>
        </div>

        {/* Filtros e Inputs */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por código, nombre o documento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-brand transition-colors"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus("ALL")}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                filterStatus === "ALL"
                  ? "bg-brand text-black border-brand"
                  : "bg-card text-muted-foreground border-border hover:border-muted-foreground/30"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterStatus("PENDIENTE")}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all flex items-center gap-1.5 ${
                filterStatus === "PENDIENTE"
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                  : "bg-card text-muted-foreground border-border hover:border-muted-foreground/30"
              }`}
            >
              <Clock className="w-4 h-4" />
              Pendientes
            </button>
            <button
              onClick={() => setFilterStatus("ATENDIDO")}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all flex items-center gap-1.5 ${
                filterStatus === "ATENDIDO"
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                  : "bg-card text-muted-foreground border-border hover:border-muted-foreground/30"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Atendidos
            </button>
          </div>
        </div>

        {/* Listado / Tabla */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground animate-pulse">
              Cargando reclamaciones...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              No se encontraron reclamaciones registradas.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-muted-foreground text-xs uppercase font-bold tracking-wider">
                    <th className="px-6 py-4">Código</th>
                    <th className="px-6 py-4">Fecha</th>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Tipo</th>
                    <th className="px-6 py-4">Bien</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {filtered.map((c) => (
                    <tr key={c.id || c.code} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-foreground">
                        {c.code}
                        {c.code.includes("-OFF-") && (
                          <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-400 rounded font-normal uppercase">
                            Offline
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(c.createdAt).toLocaleDateString("es-PE")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">{c.fullName}</div>
                        <div className="text-xs text-muted-foreground">{c.documentType}: {c.documentNumber}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                          c.claimType === "RECLAMO" ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"
                        }`}>
                          {c.claimType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {c.goodType}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          c.status === "ATENDIDO"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}>
                          {c.status === "ATENDIDO" ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              Atendido
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" />
                              Pendiente
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleOpenDetail(c)}
                          className="p-2 bg-accent hover:bg-brand/20 text-muted-foreground hover:text-brand rounded-lg transition-colors inline-flex items-center gap-1.5 text-xs font-semibold"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Ver y Responder
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalle */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-[750px] max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col">
            
            {/* Cabecera Modal */}
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/10">
              <div className="flex items-center gap-3">
                <FileText className="text-brand w-6 h-6" />
                <div>
                  <h3 className="font-extrabold text-foreground text-lg uppercase tracking-wide">
                    Hoja de Reclamación: {selectedClaim.code}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Registrado el: {new Date(selectedClaim.createdAt).toLocaleString("es-PE")}
                  </p>
                </div>
              </div>
              <button onClick={handleCloseDetail} className="p-1 bg-accent hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido Modal */}
            <div className="p-6 space-y-6">
              
              {/* Bloque 1: Consumidor */}
              <div className="space-y-3">
                <h4 className="text-brand font-bold text-xs uppercase tracking-wider border-l-2 border-brand pl-2">
                  1. Identificación del Consumidor
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-accent/30 p-4 rounded-xl border border-border">
                  <div>
                    <span className="text-muted-foreground block text-xs">Nombres y Apellidos:</span>
                    <span className="font-semibold text-foreground">{selectedClaim.fullName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">Documento:</span>
                    <span className="font-semibold text-foreground">{selectedClaim.documentType} - {selectedClaim.documentNumber}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-muted-foreground block text-xs">Dirección:</span>
                    <span className="font-semibold text-foreground">{selectedClaim.address}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">Email:</span>
                    <span className="font-semibold text-foreground">{selectedClaim.email}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">Teléfono:</span>
                    <span className="font-semibold text-foreground">{selectedClaim.phone}</span>
                  </div>
                </div>

                {selectedClaim.minor && (
                  <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl text-sm">
                    <span className="text-amber-500 font-bold block text-xs mb-2">Datos del Apoderado (Menor de edad)</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-muted-foreground block text-xs">Nombre:</span>
                        <span className="font-semibold text-foreground">{selectedClaim.guardianName}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs">Documento Tutor:</span>
                        <span className="font-semibold text-foreground">
                          {selectedClaim.guardianDocumentType} - {selectedClaim.guardianDocumentNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bloque 2: Bien */}
              <div className="space-y-3">
                <h4 className="text-brand font-bold text-xs uppercase tracking-wider border-l-2 border-brand pl-2">
                  2. Bien Contratado
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm bg-accent/30 p-4 rounded-xl border border-border">
                  <div>
                    <span className="text-muted-foreground block text-xs">Tipo:</span>
                    <span className="font-semibold text-foreground">{selectedClaim.goodType}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">Monto Reclamado:</span>
                    <span className="font-semibold text-foreground">
                      {selectedClaim.claimedAmount ? `S/. ${selectedClaim.claimedAmount.toFixed(2)}` : "-"}
                    </span>
                  </div>
                  <div className="sm:col-span-3">
                    <span className="text-muted-foreground block text-xs">Descripción:</span>
                    <p className="text-foreground mt-1 whitespace-pre-line bg-card/50 p-2.5 rounded border border-border/50 text-xs">
                      {selectedClaim.goodDescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bloque 3: Reclamación */}
              <div className="space-y-3">
                <h4 className="text-brand font-bold text-xs uppercase tracking-wider border-l-2 border-brand pl-2">
                  3. Detalle de Reclamación ({selectedClaim.claimType})
                </h4>
                <div className="space-y-4 text-sm bg-accent/30 p-4 rounded-xl border border-border">
                  <div>
                    <span className="text-muted-foreground block text-xs">Detalle del reclamo o queja:</span>
                    <p className="text-foreground mt-1 whitespace-pre-line bg-card/50 p-2.5 rounded border border-border/50 text-xs leading-relaxed">
                      {selectedClaim.description}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">Pedido (Solución solicitada):</span>
                    <p className="text-foreground mt-1 whitespace-pre-line bg-card/50 p-2.5 rounded border border-border/50 text-xs leading-relaxed">
                      {selectedClaim.consumerRequest}
                    </p>
                  </div>
                </div>
              </div>

              {/* Respuesta del Proveedor */}
              <div className="border-t border-border pt-6 space-y-4">
                <h4 className="text-brand font-bold text-xs uppercase tracking-wider border-l-2 border-brand pl-2">
                  4. Respuesta de la Empresa (Proveedor)
                </h4>
                
                {selectedClaim.status === "ATENDIDO" ? (
                  <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl text-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-emerald-500 font-bold text-xs">Respuesta Enviada</span>
                      {selectedClaim.repliedAt && (
                        <span className="text-xs text-muted-foreground">
                          Respondido el: {new Date(selectedClaim.repliedAt).toLocaleString("es-PE")}
                        </span>
                      )}
                    </div>
                    <p className="text-foreground whitespace-pre-line leading-relaxed italic bg-card/50 p-3 rounded border border-border/50 text-xs">
                      {selectedClaim.reply}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSendReply} className="space-y-4">
                    <div>
                      <textarea
                        rows={4}
                        required
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Escriba aquí la respuesta formal que se le enviará al consumidor reclamante..."
                        className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-brand transition-colors"
                      />
                    </div>

                    {replyError && (
                      <div className="bg-red-500/10 border border-red-500/25 text-red-400 p-3.5 rounded-xl text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{replyError}</span>
                      </div>
                    )}

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={handleCloseDetail}
                        className="px-5 py-2.5 bg-accent hover:bg-accent/80 text-muted-foreground rounded-xl text-xs font-bold transition-all"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={replyLoading}
                        className="px-6 py-2.5 bg-brand text-black hover:bg-yellow-400 disabled:bg-slate-800 disabled:text-slate-500 rounded-xl text-xs font-bold transition-all shadow-md"
                      >
                        {replyLoading ? "Enviando..." : "Enviar Respuesta Oficial"}
                      </button>
                    </div>
                  </form>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

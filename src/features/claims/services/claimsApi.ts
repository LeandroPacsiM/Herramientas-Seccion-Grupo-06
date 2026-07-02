import { api } from "@/lib/api";
import { CreateClaimRequest, ClaimResponse } from "../types";

export const claimsApi = {
  create: async (data: CreateClaimRequest): Promise<ClaimResponse> => {
    try {
      // Intentar enviar al backend
      const response = await api.post<ClaimResponse>("/api/claims", data);
      return response;
    } catch (error) {
      console.warn("Error enviando al backend. Guardando en modo local/offline:", error);
      
      // Fallback: Generar código de reclamo offline local
      const year = new Date().getFullYear();
      const randomId = Math.floor(10000 + Math.random() * 90000);
      const code = `${data.claimType}-${year}-OFF-${randomId}`;
      
      const offlineResponse: ClaimResponse = {
        id: Date.now(),
        code,
        createdAt: new Date().toISOString(),
        claimType: data.claimType,
        fullName: data.fullName,
        documentType: data.documentType,
        documentNumber: data.documentNumber,
        address: data.address,
        email: data.email,
        phone: data.phone,
        minor: data.minor,
        guardianName: data.minor ? data.guardianName : undefined,
        guardianDocumentType: data.minor ? data.guardianDocumentType : undefined,
        guardianDocumentNumber: data.minor ? data.guardianDocumentNumber : undefined,
        goodType: data.goodType,
        claimedAmount: data.claimedAmount,
        goodDescription: data.goodDescription,
        description: data.description,
        consumerRequest: data.consumerRequest,
        status: "PENDIENTE",
      };

      // Guardar en localStorage para respaldo local
      const existingClaimsJson = localStorage.getItem("llamatours_offline_claims");
      const existingClaims: ClaimResponse[] = existingClaimsJson ? JSON.parse(existingClaimsJson) : [];
      existingClaims.push(offlineResponse);
      localStorage.setItem("llamatours_offline_claims", JSON.stringify(existingClaims));

      return offlineResponse;
    }
  },
};

export type ClaimType = "RECLAMO" | "QUEJA";
export type DocumentType = "DNI" | "CE" | "PASAPORTE";
export type GoodType = "PRODUCTO" | "SERVICIO";
export type ClaimStatus = "PENDIENTE" | "ATENDIDO";

export interface CreateClaimRequest {
  claimType: ClaimType;
  fullName: string;
  documentType: DocumentType;
  documentNumber: string;
  address: string;
  email: string;
  phone: string;
  minor: boolean;
  guardianName?: string;
  guardianDocumentType?: DocumentType;
  guardianDocumentNumber?: string;
  goodType: GoodType;
  claimedAmount?: number;
  goodDescription: string;
  description: string;
  consumerRequest: string;
}

export interface ClaimResponse {
  id: number;
  code: string;
  createdAt: string;
  claimType: ClaimType;
  fullName: string;
  documentType: DocumentType;
  documentNumber: string;
  address: string;
  email: string;
  phone: string;
  minor: boolean;
  guardianName?: string;
  guardianDocumentType?: DocumentType;
  guardianDocumentNumber?: string;
  goodType: GoodType;
  claimedAmount?: number;
  goodDescription: string;
  description: string;
  consumerRequest: string;
  reply?: string;
  repliedAt?: string;
  status: ClaimStatus;
}

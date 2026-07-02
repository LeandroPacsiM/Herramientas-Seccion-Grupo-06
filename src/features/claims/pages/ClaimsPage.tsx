import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BookOpen, FileText, Printer, CheckCircle, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { claimsApi } from "../services/claimsApi";
import { ClaimResponse, CreateClaimRequest, ClaimType, DocumentType, GoodType } from "../types";

export default function ClaimsPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState<CreateClaimRequest>({
    claimType: "RECLAMO",
    fullName: "",
    documentType: "DNI",
    documentNumber: "",
    address: "",
    email: "",
    phone: "",
    minor: false,
    guardianName: "",
    guardianDocumentType: "DNI",
    guardianDocumentNumber: "",
    goodType: "SERVICIO",
    claimedAmount: undefined,
    goodDescription: "",
    description: "",
    consumerRequest: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submittedClaim, setSubmittedClaim] = useState<ClaimResponse | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm(prev => ({ ...prev, [name]: checked }));
      if (name === "minor" && !checked) {
        // Limpiar campos de tutor si ya no es menor
        setForm(prev => ({
          ...prev,
          guardianName: "",
          guardianDocumentNumber: "",
          guardianDocumentType: "DNI"
        }));
      }
    } else if (name === "claimedAmount") {
      const val = value ? parseFloat(value) : undefined;
      setForm(prev => ({ ...prev, [name]: val }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }

    // Limpiar error al escribir
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSelectType = (field: "claimType" | "goodType", value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validate = (): boolean => {
    const tempErrors: Record<string, string> = {};

    if (!form.fullName.trim()) tempErrors.fullName = t("claims.errors.fullName");
    if (!form.documentNumber.trim()) tempErrors.documentNumber = t("claims.errors.documentNumber");
    if (!form.address.trim()) tempErrors.address = t("claims.errors.address");
    
    if (!form.email.trim()) {
      tempErrors.email = t("claims.errors.email");
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      tempErrors.email = t("claims.errors.email");
    }

    if (!form.phone.trim()) tempErrors.phone = t("claims.errors.phone");

    if (form.minor) {
      if (!form.guardianName?.trim()) tempErrors.guardianName = t("claims.errors.guardianName");
      if (!form.guardianDocumentNumber?.trim()) tempErrors.guardianDocumentNumber = t("claims.errors.guardianDocumentNumber");
    }

    if (!form.goodDescription.trim()) tempErrors.goodDescription = t("claims.errors.goodDescription");
    if (!form.description.trim()) tempErrors.description = t("claims.errors.description");
    if (!form.consumerRequest.trim()) tempErrors.consumerRequest = t("claims.errors.consumerRequest");

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await claimsApi.create(form);
      setSubmittedClaim(response);
    } catch (err) {
      console.error(err);
      setErrors(prev => ({ ...prev, submit: t("claims.errors.submitError") }));
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setForm({
      claimType: "RECLAMO",
      fullName: "",
      documentType: "DNI",
      documentNumber: "",
      address: "",
      email: "",
      phone: "",
      minor: false,
      guardianName: "",
      guardianDocumentType: "DNI",
      guardianDocumentNumber: "",
      goodType: "SERVICIO",
      claimedAmount: undefined,
      goodDescription: "",
      description: "",
      consumerRequest: "",
    });
    setSubmittedClaim(null);
    setErrors({});
  };

  if (submittedClaim) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* CSS de Impresión */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body {
              background: white !important;
              color: black !important;
            }
            .no-print {
              display: none !important;
            }
            .print-container {
              border: none !important;
              box-shadow: none !important;
              background: white !important;
              color: black !important;
              padding: 0 !important;
              margin: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
            }
            .print-header {
              border-bottom: 2px solid black !important;
              padding-bottom: 1rem !important;
            }
            .print-table {
              border: 1px solid black !important;
            }
            .print-table th, .print-table td {
              border: 1px solid black !important;
              color: black !important;
            }
            .print-label {
              font-weight: bold !important;
              color: black !important;
            }
          }
        `}} />

        <div className="w-full max-w-[850px] no-print mb-8">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 flex items-start gap-4 shadow-lg animate-fade-in">
            <CheckCircle className="text-emerald-400 w-8 h-8 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xl font-bold text-emerald-400">{t("claims.successTitle")}</h2>
              <p className="text-slate-300 mt-1">{t("claims.successSubtitle")}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm text-slate-400 font-semibold">{t("claims.claimCode")}:</span>
                <span className="text-base text-yellow-400 font-mono font-bold bg-yellow-400/10 px-3 py-1 rounded border border-yellow-400/20">
                  {submittedClaim.code}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Hoja de Reclamación Oficial */}
        <div className="print-container w-full max-w-[850px] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-8 sm:p-12 text-slate-200">
          
          {/* Cabecera Oficial */}
          <div className="print-header border-b border-slate-800 pb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3">
                <img src="/assets/img/icons/llama.png" alt="LlamaTours Logo" className="h-10 w-10 object-contain" />
                <span className="text-2xl font-bold text-brand uppercase tracking-wider">LlamaTours</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">LLAMATOURS SAC | RUC: 20608543129</p>
              <p className="text-xs text-slate-400">Dirección: Av. 28 de Julio 1044, Miraflores, Lima - Perú</p>
            </div>
            
            <div className="text-right border border-brand/20 bg-brand/5 p-4 rounded-xl md:min-w-[280px]">
              <h3 className="text-brand font-bold text-lg uppercase tracking-wider">{t("claims.receiptTitle")}</h3>
              <p className="text-xs text-slate-400 mt-1">N° {submittedClaim.code}</p>
              <p className="text-xs text-slate-400">{t("claims.dateFiled")}: {new Date(submittedClaim.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-8 mt-8">
            {/* Sección 1: Consumidor */}
            <div>
              <h4 className="print-label text-brand font-bold text-sm uppercase tracking-wider border-l-4 border-brand pl-3 mb-4">
                {t("claims.personalInfo")}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-slate-900/50 p-4 rounded-xl border border-slate-900">
                <div>
                  <span className="text-slate-400 block">{t("claims.fullName")}:</span>
                  <span className="font-semibold text-slate-100">{submittedClaim.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t("claims.documentType")} / N°:</span>
                  <span className="font-semibold text-slate-100">{submittedClaim.documentType} - {submittedClaim.documentNumber}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 block">{t("claims.address")}:</span>
                  <span className="font-semibold text-slate-100">{submittedClaim.address}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t("claims.email")}:</span>
                  <span className="font-semibold text-slate-100">{submittedClaim.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t("claims.phone")}:</span>
                  <span className="font-semibold text-slate-100">{submittedClaim.phone}</span>
                </div>
              </div>

              {submittedClaim.minor && (
                <div className="mt-3 text-sm bg-yellow-400/5 p-4 rounded-xl border border-yellow-400/10">
                  <h5 className="font-bold text-yellow-400 mb-2">{t("claims.guardianInfo")}</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 block">{t("claims.guardianName")}:</span>
                      <span className="font-semibold text-slate-200">{submittedClaim.guardianName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{t("claims.documentType")} / N°:</span>
                      <span className="font-semibold text-slate-200">
                        {submittedClaim.guardianDocumentType} - {submittedClaim.guardianDocumentNumber}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sección 2: Bien Contratado */}
            <div>
              <h4 className="print-label text-brand font-bold text-sm uppercase tracking-wider border-l-4 border-brand pl-3 mb-4">
                {t("claims.goodInfo")}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm bg-slate-900/50 p-4 rounded-xl border border-slate-900">
                <div>
                  <span className="text-slate-400 block">{t("claims.goodType")}:</span>
                  <span className="font-semibold text-slate-100">
                    {submittedClaim.goodType === "PRODUCTO" ? t("claims.product") : t("claims.service")}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t("claims.claimedAmount")}:</span>
                  <span className="font-semibold text-slate-100">
                    {submittedClaim.claimedAmount ? `S/. ${submittedClaim.claimedAmount.toFixed(2)}` : "-"}
                  </span>
                </div>
                <div className="sm:col-span-3">
                  <span className="text-slate-400 block">{t("claims.goodDescription")}:</span>
                  <p className="text-slate-200 mt-1 whitespace-pre-line">{submittedClaim.goodDescription}</p>
                </div>
              </div>
            </div>

            {/* Sección 3: Reclamación */}
            <div>
              <h4 className="print-label text-brand font-bold text-sm uppercase tracking-wider border-l-4 border-brand pl-3 mb-4">
                {t("claims.claimDetail")}
              </h4>
              <div className="space-y-4 text-sm bg-slate-900/50 p-4 rounded-xl border border-slate-900">
                <div>
                  <span className="text-slate-400 block">{t("claims.claimType")}:</span>
                  <span className="inline-block bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border border-yellow-400/20 mt-1">
                    {submittedClaim.claimType === "RECLAMO" ? t("claims.claim") : t("claims.complaint")}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">{t("claims.description")}:</span>
                  <p className="text-slate-200 mt-1 whitespace-pre-line leading-relaxed">{submittedClaim.description}</p>
                </div>
                <div>
                  <span className="text-slate-400 block">{t("claims.consumerRequest")}:</span>
                  <p className="text-slate-200 mt-1 whitespace-pre-line leading-relaxed">{submittedClaim.consumerRequest}</p>
                </div>
              </div>
            </div>

            {/* Términos legales de INDECOPI */}
            <div className="border-t border-slate-800 pt-6 text-[11px] text-slate-400 leading-relaxed space-y-2">
              <p>
                * <strong>RECLAMO</strong>: Disconformidad relacionada a los productos o servicios. El proveedor cuenta con un plazo de hasta 15 días hábiles para responder, sin prórroga aplicable según Ley N° 29571.
              </p>
              <p>
                * <strong>QUEJA</strong>: Disconformidad no relacionada a los productos o servicios; malestar o descontento respecto a la atención al público.
              </p>
              <p className="italic">
                La formulación del reclamo en el Libro de Reclamaciones no impide acudir a otras vías de solución de controversias ni es una vía previa para interponer una denuncia ante INDECOPI.
              </p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="no-print w-full max-w-[850px] flex flex-col sm:flex-row gap-4 justify-between mt-8">
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold transition-all border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("claims.back")}
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-brand text-black hover:bg-yellow-400 rounded-xl font-bold transition-all shadow-lg shadow-brand/10 hover:shadow-brand/20"
          >
            <Printer className="w-5 h-5" />
            {t("claims.print")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[800px] mx-auto">
        
        {/* Cabecera */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-brand/10 rounded-2xl border border-brand/20 mb-4">
            <BookOpen className="text-brand w-10 h-10 animate-pulse" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-50 uppercase tracking-wide">
            {t("claims.title")}
          </h1>
          <p className="text-slate-400 mt-2 max-w-[550px] mx-auto text-sm sm:text-base leading-relaxed">
            {t("claims.subtitle")}
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8">
          
          {/* Tipo de Reclamación */}
          <div className="space-y-4">
            <label className="block text-brand font-bold text-xs uppercase tracking-widest">{t("claims.claimType")}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleSelectType("claimType", "RECLAMO")}
                className={`p-5 rounded-2xl text-left border transition-all flex flex-col ${
                  form.claimType === "RECLAMO"
                    ? "bg-brand/10 border-brand text-slate-100 shadow-lg shadow-brand/5"
                    : "bg-slate-900/30 border-slate-800 hover:border-slate-700 text-slate-400"
                }`}
              >
                <span className="font-bold text-sm sm:text-base">{t("claims.claim")}</span>
                <span className="text-xs text-slate-400 mt-2 leading-relaxed">{t("claims.claimDesc")}</span>
              </button>
              
              <button
                type="button"
                onClick={() => handleSelectType("claimType", "QUEJA")}
                className={`p-5 rounded-2xl text-left border transition-all flex flex-col ${
                  form.claimType === "QUEJA"
                    ? "bg-brand/10 border-brand text-slate-100 shadow-lg shadow-brand/5"
                    : "bg-slate-900/30 border-slate-800 hover:border-slate-700 text-slate-400"
                }`}
              >
                <span className="font-bold text-sm sm:text-base">{t("claims.complaint")}</span>
                <span className="text-xs text-slate-400 mt-2 leading-relaxed">{t("claims.complaintDesc")}</span>
              </button>
            </div>
          </div>

          <hr className="border-slate-800/80" />

          {/* 1. Datos del Consumidor */}
          <div className="space-y-6">
            <h3 className="text-brand font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand/10 text-brand text-xs font-extrabold">1</span>
              {t("claims.personalInfo")}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">{t("claims.fullName")} *</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Ej. Juan Pérez Quispe"
                  className={`w-full bg-slate-900/40 border ${errors.fullName ? "border-red-500" : "border-slate-800"} focus:border-brand rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition-all`}
                />
                {errors.fullName && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">{t("claims.documentType")} *</label>
                <select
                  name="documentType"
                  value={form.documentType}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-brand rounded-xl px-4 py-3 text-slate-100 outline-none transition-all"
                >
                  <option value="DNI">DNI</option>
                  <option value="CE">C.E.</option>
                  <option value="PASAPORTE">Pasaporte</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">{t("claims.documentNumber")} *</label>
                <input
                  type="text"
                  name="documentNumber"
                  value={form.documentNumber}
                  onChange={handleChange}
                  placeholder="Ej. 74895623"
                  className={`w-full bg-slate-900/40 border ${errors.documentNumber ? "border-red-500" : "border-slate-800"} focus:border-brand rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition-all`}
                />
                {errors.documentNumber && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.documentNumber}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">{t("claims.address")} *</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Ej. Av. Larco 456, Dpto 302, Miraflores, Lima"
                  className={`w-full bg-slate-900/40 border ${errors.address ? "border-red-500" : "border-slate-800"} focus:border-brand rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition-all`}
                />
                {errors.address && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.address}</p>}
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">{t("claims.email")} *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Ej. juan.perez@email.com"
                  className={`w-full bg-slate-900/40 border ${errors.email ? "border-red-500" : "border-slate-800"} focus:border-brand rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition-all`}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.email}</p>}
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">{t("claims.phone")} *</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Ej. 987654321"
                  className={`w-full bg-slate-900/40 border ${errors.phone ? "border-red-500" : "border-slate-800"} focus:border-brand rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition-all`}
                />
                {errors.phone && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.phone}</p>}
              </div>

              {/* Menor de edad checkbox */}
              <div className="sm:col-span-2 flex items-center gap-3 bg-slate-900/30 p-4 rounded-2xl border border-slate-900">
                <input
                  type="checkbox"
                  id="minor"
                  name="minor"
                  checked={form.minor}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-slate-800 text-brand bg-slate-900 focus:ring-brand outline-none"
                />
                <label htmlFor="minor" className="text-sm font-medium text-slate-300 select-none cursor-pointer">
                  {t("claims.isMinor")}
                </label>
              </div>
            </div>

            {/* Datos del apoderado */}
            {form.minor && (
              <div className="space-y-4 bg-yellow-400/5 border border-yellow-400/10 p-6 rounded-2xl animate-fade-in">
                <h4 className="font-bold text-yellow-400 text-sm">{t("claims.guardianInfo")}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 text-xs font-semibold mb-2">{t("claims.guardianName")} *</label>
                    <input
                      type="text"
                      name="guardianName"
                      value={form.guardianName}
                      onChange={handleChange}
                      className={`w-full bg-slate-900/40 border ${errors.guardianName ? "border-red-500" : "border-yellow-400/20"} focus:border-brand rounded-xl px-4 py-3 text-slate-100 outline-none transition-all`}
                    />
                    {errors.guardianName && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.guardianName}</p>}
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-2">{t("claims.guardianDocumentType")} *</label>
                    <select
                      name="guardianDocumentType"
                      value={form.guardianDocumentType}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-yellow-400/20 focus:border-brand rounded-xl px-4 py-3 text-slate-100 outline-none transition-all"
                    >
                      <option value="DNI">DNI</option>
                      <option value="CE">C.E.</option>
                      <option value="PASAPORTE">Pasaporte</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-2">{t("claims.guardianDocumentNumber")} *</label>
                    <input
                      type="text"
                      name="guardianDocumentNumber"
                      value={form.guardianDocumentNumber}
                      onChange={handleChange}
                      className={`w-full bg-slate-900/40 border ${errors.guardianDocumentNumber ? "border-red-500" : "border-yellow-400/20"} focus:border-brand rounded-xl px-4 py-3 text-slate-100 outline-none transition-all`}
                    />
                    {errors.guardianDocumentNumber && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.guardianDocumentNumber}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>

          <hr className="border-slate-800/80" />

          {/* 2. Identificación del Bien Contratado */}
          <div className="space-y-6">
            <h3 className="text-brand font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand/10 text-brand text-xs font-extrabold">2</span>
              {t("claims.goodInfo")}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">{t("claims.goodType")} *</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleSelectType("goodType", "SERVICIO")}
                    className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold tracking-wide transition-all ${
                      form.goodType === "SERVICIO"
                        ? "bg-brand text-black border-brand shadow-lg"
                        : "bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-400"
                    }`}
                  >
                    {t("claims.service")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectType("goodType", "PRODUCTO")}
                    className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold tracking-wide transition-all ${
                      form.goodType === "PRODUCTO"
                        ? "bg-brand text-black border-brand shadow-lg"
                        : "bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-400"
                    }`}
                  >
                    {t("claims.product")}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">{t("claims.claimedAmount")}</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold text-sm">S/.</span>
                  <input
                    type="number"
                    name="claimedAmount"
                    value={form.claimedAmount ?? ""}
                    onChange={handleChange}
                    placeholder={t("claims.claimedAmountPlaceholder")}
                    className="w-full bg-slate-900/40 border border-slate-800 focus:border-brand rounded-xl pl-12 pr-4 py-3 text-slate-100 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">{t("claims.goodDescription")} *</label>
                <textarea
                  name="goodDescription"
                  value={form.goodDescription}
                  onChange={handleChange}
                  rows={2}
                  placeholder={t("claims.goodDescriptionPlaceholder")}
                  className={`w-full bg-slate-900/40 border ${errors.goodDescription ? "border-red-500" : "border-slate-800"} focus:border-brand rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition-all resize-none`}
                />
                {errors.goodDescription && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.goodDescription}</p>}
              </div>
            </div>
          </div>

          <hr className="border-slate-800/80" />

          {/* 3. Detalle de la Reclamación */}
          <div className="space-y-6">
            <h3 className="text-brand font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand/10 text-brand text-xs font-extrabold">3</span>
              {t("claims.claimDetail")}
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  {t("claims.description")} ({t(`claims.${form.claimType.toLowerCase()}`)}) *
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder={t("claims.descriptionPlaceholder")}
                  className={`w-full bg-slate-900/40 border ${errors.description ? "border-red-500" : "border-slate-800"} focus:border-brand rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition-all`}
                />
                {errors.description && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.description}</p>}
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">{t("claims.consumerRequest")} *</label>
                <textarea
                  name="consumerRequest"
                  value={form.consumerRequest}
                  onChange={handleChange}
                  rows={3}
                  placeholder={t("claims.consumerRequestPlaceholder")}
                  className={`w-full bg-slate-900/40 border ${errors.consumerRequest ? "border-red-500" : "border-slate-800"} focus:border-brand rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition-all`}
                />
                {errors.consumerRequest && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.consumerRequest}</p>}
              </div>
            </div>
          </div>

          {/* Botón de Enviar */}
          <div className="pt-4 flex flex-col items-center">
            {errors.submit && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-2 mb-4 w-full">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{errors.submit}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto min-w-[240px] flex items-center justify-center gap-2 px-8 py-4 bg-brand text-black hover:bg-yellow-400 disabled:bg-slate-800 disabled:text-slate-500 rounded-2xl font-bold transition-all shadow-xl shadow-brand/10 hover:shadow-brand/20 outline-none"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  <span>{t("claims.submit")}</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

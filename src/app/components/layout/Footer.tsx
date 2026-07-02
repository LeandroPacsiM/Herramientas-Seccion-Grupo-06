import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-black text-slate-200 w-full mt-auto">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-12 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center">

        <div className="space-y-6 text-center">
          <div className="text-brand font-bold uppercase tracking-widest text-2xl flex items-center justify-center gap-2">
            <img src={`${import.meta.env.BASE_URL}assets/img/icons/llama.png`} alt="LlamaTOURS" className="h-10 w-10 object-contain" />
            <span>LlamaTours</span>
          </div>

          <p className="text-slate-300 text-lg leading-relaxed">
            {t("footer.tagline")}
          </p>

          <div className="flex justify-center space-x-4">
            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-brand/20 transition-colors text-brand">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-brand/20 transition-colors text-brand">
              <FaYoutube size={20} />
            </a>
            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-brand/20 transition-colors text-brand">
              <FaFacebookF size={20} />
            </a>
          </div>
        </div>

        <div className="space-y-6 text-left max-w-[220px]">
          <h4 className="text-brand font-bold text-lg">{t("footer.explore")}</h4>
          <ul className="space-y-3">
            <li><a href="/" className="hover:text-white transition-colors">{t("navbar.home")}</a></li>
            <li><a href="/viajes" className="hover:text-white transition-colors">{t("viajes.catalog")}</a></li>
            <li><a href="/nosotros" className="hover:text-white transition-colors">{t("navbar.about")}</a></li>
            <li><a href="/contacto" className="hover:text-white transition-colors">{t("navbar.contact")}</a></li>
            <li>
              <a href="/libro-de-reclamaciones" className="hover:text-brand transition-colors flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
                <svg className="w-5 h-5 text-brand flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                  <path d="M6 6h10" />
                  <path d="M6 10h10" />
                  <path d="M6 14h10" />
                </svg>
                <span className="text-sm font-semibold tracking-wide text-brand/90 hover:text-brand">{t("footer.claimsBook")}</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-6 text-left max-w-[260px]">
          <h4 className="text-brand font-bold text-lg">{t("footer.contactUs")}</h4>
          <ul className="space-y-4">
            <li className="flex items-start space-x-3">
              <Phone size={18} className="text-brand mt-1 flex-shrink-0" />
              <span>+51 900 460 347</span>
            </li>
            <li className="flex items-start space-x-3">
              <Mail size={18} className="text-brand mt-1 flex-shrink-0" />
              <span>contacto@llamatours.com</span>
            </li>
            <li className="flex items-start space-x-3">
              <MapPin size={18} className="text-brand mt-1 flex-shrink-0" />
              <span>{t("footer.address")}</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="border-t border-white/10 py-8 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto flex justify-center items-center text-sm text-slate-400">
        <p className="text-center">
          {t("footer.copyright")}
        </p>
      </div>

    </footer>
  );
}

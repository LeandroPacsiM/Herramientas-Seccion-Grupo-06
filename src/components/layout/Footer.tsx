import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";


export default function Footer() {
  return (
    <footer className="bg-slate-950 dark:bg-black text-slate-300 w-full mt-auto">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        <div className="space-y-6">
          <div className="text-brand font-bold uppercase tracking-widest text-2xl font-poppins flex items-center gap-2">
            <Image src="/img/index/header/llama.png" alt="Logo" width={40} height={40} />
            <span>LlamaTours</span>
          </div>
          <p className="text-slate-400 font-inter text-lg leading-relaxed">
            Creamos experiencias de aventura y elegancia en gran altitud a través de los picos más impresionantes del mundo.
          </p>
          <div className="flex space-x-4">
            <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-brand/20 transition-colors text-brand">
              <FaInstagram size={20} />
            </Link>
            <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-brand/20 transition-colors text-brand">
              <FaYoutube size={20} />
            </Link>
            <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-brand/20 transition-colors text-brand">
              <FaFacebookF size={20} />
            </Link>
          </div>
        </div>

        {/* links */}
        <div className="space-y-6">
          <h4 className="text-brand-soft font-poppins font-bold text-lg">Explorar</h4>
          <ul className="space-y-3">
            <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
            <li><Link href="/viajes" className="hover:text-white transition-colors">Buscador de Viajes</Link></li>
            <li><Link href="/nosotros" className="hover:text-white transition-colors">Sobre Nosotros</Link></li>
            <li><Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link></li>
          </ul>
        </div>

        {/* categorioas */}
        <div className="space-y-6">
          <h4 className="text-brand-soft font-poppins font-bold text-lg">Aventura</h4>
          <ul className="space-y-3">
            <li><Link href="#" className="hover:text-white transition-colors">Los Andes</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Los Alpes</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Los Himalayas</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Expediciones Privadas</Link></li>
          </ul>
        </div>

        {/* informacion de contacto */}
        <div className="space-y-6">
          <h4 className="text-brand-soft font-poppins font-bold text-lg">Contáctanos</h4>
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
              <span>Av. 28 de Julio, La Victoria, Lima - Perú</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 py-8 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto flex justify-center items-center text-sm text-slate-500">
  <p className="text-center">
    © 2026 LlamaTours. Creando experiencias inolvidables.
  </p>
</div>
    </footer>
  );
}

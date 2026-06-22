import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Expedition } from "../types";

// Import Leaflet assets to fix Vite asset path issues
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix for default marker icons in Leaflet when bundled with Vite
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const DEPARTMENT_COORDINATES: Record<string, { latitude: number; longitude: number }> = {
  cusco: { latitude: -13.5226, longitude: -71.9673 },
  ancash: { latitude: -9.5278, longitude: -77.5278 },
  lima: { latitude: -12.0464, longitude: -77.0428 },
  arequipa: { latitude: -16.4090, longitude: -71.5375 },
  puno: { latitude: -15.8402, longitude: -70.0219 },
  amazonas: { latitude: -6.2294, longitude: -77.8690 },
  ica: { latitude: -14.0678, longitude: -75.7286 },
  loreto: { latitude: -3.7437, longitude: -73.2516 },
  san_martin: { latitude: -6.4851, longitude: -76.3727 },
  pasco: { latitude: -10.6675, longitude: -76.2561 },
  junin: { latitude: -11.1583, longitude: -75.9931 },
  ayacucho: { latitude: -13.1588, longitude: -74.2239 },
  apurimac: { latitude: -13.6339, longitude: -72.8814 },
  huancavelica: { latitude: -12.7825, longitude: -74.9727 },
  huanuco: { latitude: -9.9306, longitude: -76.2422 },
  la_libertad: { latitude: -8.1160, longitude: -79.0300 },
  lambayeque: { latitude: -6.7011, longitude: -79.9061 },
  piura: { latitude: -5.1945, longitude: -80.6300 },
  tumbes: { latitude: -3.5669, longitude: -80.4514 },
  cajamarca: { latitude: -7.1638, longitude: -78.5003 },
  moquegua: { latitude: -17.1983, longitude: -70.9356 },
  tacna: { latitude: -18.0169, longitude: -70.2502 },
  madre_de_dios: { latitude: -12.5933, longitude: -69.1891 },
  ucayali: { latitude: -8.3791, longitude: -74.5539 },
  peru: { latitude: -9.19, longitude: -75.0152 },
};

function getDepartmentKey(location: string): string {
  const norm = (location || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  if (norm.includes("cusco")) return "cusco";
  if (norm.includes("huaraz") || norm.includes("ancash")) return "ancash";
  if (norm.includes("lima")) return "lima";
  if (norm.includes("arequipa")) return "arequipa";
  if (norm.includes("puno")) return "puno";
  if (norm.includes("amazonas") || norm.includes("chachapoyas")) return "amazonas";
  if (norm.includes("ica")) return "ica";
  if (norm.includes("loreto") || norm.includes("iquitos")) return "loreto";
  if (norm.includes("san martin") || norm.includes("tarapoto") || norm.includes("moyobamba")) return "san_martin";
  if (norm.includes("pasco")) return "pasco";
  if (norm.includes("junin") || norm.includes("huancayo")) return "junin";
  if (norm.includes("ayacucho")) return "ayacucho";
  if (norm.includes("apurimac") || norm.includes("abancay")) return "apurimac";
  if (norm.includes("huancavelica")) return "huancavelica";
  if (norm.includes("huanuco")) return "huanuco";
  if (norm.includes("la libertad") || norm.includes("trujillo")) return "la_libertad";
  if (norm.includes("lambayeque") || norm.includes("chiclayo")) return "lambayeque";
  if (norm.includes("piura")) return "piura";
  if (norm.includes("tumbes")) return "tumbes";
  if (norm.includes("cajamarca")) return "cajamarca";
  if (norm.includes("moquegua")) return "moquegua";
  if (norm.includes("tacna")) return "tacna";
  if (norm.includes("madre de dios") || norm.includes("puerto maldonado")) return "madre_de_dios";
  if (norm.includes("ucayali") || norm.includes("pucallpa")) return "ucayali";
  
  return "peru";
}

interface ExpeditionMapProps {
  expeditions: Expedition[];
  hoveredId: number | null;
  onMarkerClick?: (id: number) => void;
}

export default function ExpeditionMap({ expeditions, hoveredId, onMarkerClick }: ExpeditionMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<number, L.Marker>>({});

  // 1. Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Center on Peru by default
    const map = L.map(mapContainerRef.current, {
      center: [-9.19, -75.0152],
      zoom: 6,
      zoomControl: false, // We will add zoom control on the bottom-right for clean UI
      scrollWheelZoom: true,
    });

    // Add CartoDB Positron - Beautiful Light (Daytime) themed map
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 2. Update markers when expeditions list changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    const markerList: L.Marker[] = [];

    expeditions.forEach((exp) => {
      const deptKey = getDepartmentKey(exp.location || "");
      const baseCoords = DEPARTMENT_COORDINATES[deptKey] || DEPARTMENT_COORDINATES.peru;

      const idNum = exp.id || 0;
      const angle = (idNum * 137.5) * (Math.PI / 180);
      const radius = 0.12 + (idNum % 5) * 0.06;
      const lat = baseCoords.latitude + radius * Math.sin(angle);
      const lng = baseCoords.longitude + radius * Math.cos(angle);

      const popupContent = `
        <div class="p-1 space-y-2 max-w-[220px]">
          ${
            exp.images?.[0]?.url
              ? `<img src="${exp.images[0].url}" class="w-full h-24 object-cover rounded-lg shadow-sm" alt="${exp.name}" />`
              : ""
          }
          <div class="space-y-0.5">
            <h4 class="font-extrabold text-sm text-foreground m-0 leading-snug">${exp.name}</h4>
            <p class="text-xs text-muted-foreground m-0 flex items-center gap-1">📍 ${exp.location}</p>
          </div>
          <div class="flex items-center justify-between pt-1.5 border-t border-border mt-1">
            <span class="text-xs font-semibold text-muted-foreground">${exp.durationDays} días</span>
            <span class="text-sm font-extrabold text-brand">$${exp.price}</span>
          </div>
          <a href="${import.meta.env.BASE_URL}viajes/${exp.slug}" 
             class="block text-center bg-primary text-primary-foreground text-xs py-1.5 rounded-lg font-bold hover:opacity-90 transition-all mt-2 cursor-pointer shadow-sm" 
             style="text-decoration: none; color: var(--primary-foreground) !important;">
            Ver Detalles
          </a>
        </div>
      `;

      const marker = L.marker([lat, lng], {
        title: exp.name,
      });

      marker.bindPopup(popupContent, {
        className: "custom-leaflet-popup",
        closeButton: false,
        minWidth: 200,
      });

      if (onMarkerClick) {
        marker.on("click", () => onMarkerClick(exp.id));
      }

      marker.addTo(map);
      markersRef.current[exp.id] = marker;
      markerList.push(marker);
    });

    // Adjust map zoom/bounds to fit all displayed markers
    if (markerList.length === 1) {
      map.setView(markerList[0].getLatLng(), 10, { animate: true });
    } else if (markerList.length > 1) {
      const group = L.featureGroup(markerList);
      map.fitBounds(group.getBounds().pad(0.15), { animate: true });
    }
  }, [expeditions, onMarkerClick]);

  // 3. Sync map popup and center with card hover
  useEffect(() => {
    const map = mapRef.current;
    if (!map || hoveredId === null) return;

    const marker = markersRef.current[hoveredId];
    if (marker) {
      marker.openPopup();
      map.panTo(marker.getLatLng(), { animate: true });
    }
  }, [hoveredId]);

  return (
    <div className="relative w-full h-full">
      {/* Inline styles to override default leaflet popup styling with brand theme styling */}
      <style>{`
        .custom-leaflet-popup .leaflet-popup-content-wrapper {
          background-color: var(--card) !important;
          color: var(--card-foreground) !important;
          border-radius: var(--radius) !important;
          border: 1px solid var(--border) !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
          padding: 8px !important;
          font-family: inherit !important;
        }
        .custom-leaflet-popup .leaflet-popup-content {
          margin: 0 !important;
          line-height: inherit !important;
        }
        .custom-leaflet-popup .leaflet-popup-tip {
          background-color: var(--card) !important;
          border: 1px solid var(--border) !important;
          box-shadow: none !important;
        }
      `}</style>
      <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-0 bg-muted/20" />
    </div>
  );
}

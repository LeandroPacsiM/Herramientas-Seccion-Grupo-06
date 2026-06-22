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
      if (exp.latitude === undefined || exp.longitude === undefined) return;

      // Custom HTML popup content styled with Tailwind classes
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

      const marker = L.marker([exp.latitude, exp.longitude], {
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

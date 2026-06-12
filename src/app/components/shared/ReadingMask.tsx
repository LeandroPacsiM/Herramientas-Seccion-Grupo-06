import { useState, useEffect } from "react";
import { useAccessibility } from "@/context/AccessibilityContext";

const MASK_HEIGHT = 120;

/**
 * ReadingMask Component
 *
 * Máscara de lectura global que sigue el cursor del mouse.
 * Oscurece el contenido fuera de una franja horizontal centrada
 * en la posición Y del cursor, iluminando el área de lectura.
 *
 * Se renderiza a nivel global en App.tsx.
 */
export default function ReadingMask() {
  const { readingMask } = useAccessibility();
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    if (!readingMask) return;

    // Inicializar con la posición actual del cursor si existe
    setMouseY(window.innerHeight / 2);

    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [readingMask]);

  if (!readingMask) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[999]" role="presentation" aria-hidden="true">
      {/* Máscara superior (desde el tope hasta arriba de la barra) */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: 0,
          height: mouseY - MASK_HEIGHT / 2,
          background: "rgba(0,0,0,0.35)",
        }}
      />

      {/* Barra iluminada (franja que sigue al cursor) */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: mouseY - MASK_HEIGHT / 2,
          height: MASK_HEIGHT,
          background: "transparent",
        }}
      />

      {/* Máscara inferior (desde abajo de la barra hasta el fondo) */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: mouseY + MASK_HEIGHT / 2,
          bottom: 0,
          background: "rgba(0,0,0,0.35)",
        }}
      />
    </div>
  );
}

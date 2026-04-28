'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Tag } from 'lucide-react';

interface DestinoCardProps {
  destino: {
    id: number;
    codigoDestino: string;
    nombre: string;
    departamento: string;
    descripcionCorta: string;
    precio: number;
    moneda: string;
    imagenes: {
      card: string;
    };
    stats: {
      altitud: string;
      dificultad: string;
      duracionDias: number;
    };
  };
}

export default function DestinoCard({ destino }: DestinoCardProps) {
  return (
    <Card className="overflow-hidden group rounded-xl bg-white text-black h-full flex flex-col md:flex-row shadow-lg hover:shadow-xl transition-shadow border-0">
      {/* Image Section */}
      <div className="w-full md:w-[350px] shrink-0 relative h-[220px] md:h-auto overflow-hidden">
        <img
          src={destino.imagenes.card}
          alt={destino.nombre}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      
      {/* Content Section */}
      <CardContent className="p-6 flex flex-col flex-1 justify-center space-y-4">
        <h3 className="text-2xl font-bold text-slate-900">
          {destino.nombre}
        </h3>
        
        <div className="space-y-2 text-sm text-slate-700">
          <p>
            <span className="font-bold text-slate-900">Características:</span> {destino.descripcionCorta}
          </p>
          <p>
            <span className="font-bold text-slate-900">Actividad Principal:</span> {destino.stats.dificultad === 'Fácil' ? 'Caminata ligera y observación' : destino.stats.dificultad === 'Moderado' ? 'Trekking moderado' : 'Aventura de alta montaña'}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 uppercase tracking-wide pt-2">
          <span className="flex items-center gap-1">
            <MapPin size={16} className="text-brand" /> {destino.departamento}
          </span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1">
            <Clock size={16} className="text-brand" /> {destino.stats.duracionDias} {destino.stats.duracionDias === 1 ? 'día' : 'días'}
          </span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1">
            <Tag size={16} className="text-brand" /> {destino.moneda === 'PEN' ? 'S/.' : '$'} {destino.precio}
          </span>
        </div>

        <div className="pt-2">
          <Button
            variant="default"
            nativeButton={false}
            className="bg-brand text-black hover:bg-yellow-500 font-bold px-6 rounded-md shadow-md"
            render={
              <Link href={`/reserva/${destino.codigoDestino}`}>
                Más información
              </Link>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Disponibilidad {
  fechaSalida: string;
  stockDisponible: number;
}

interface ReservationFormProps {
  precio: number;
  moneda: string;
  disponibilidad: Disponibilidad[];
}

export default function ReservationForm({ precio, moneda, disponibilidad }: ReservationFormProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [passengers, setPassengers] = useState<number>(1);

  // Find the selected availability object
  const currentAvailability = disponibilidad.find(d => d.fechaSalida === selectedDate);
  const maxStock = currentAvailability ? currentAvailability.stockDisponible : 0;

  const totalPrice = precio * passengers;

  const handleReservation = () => {
    if (!selectedDate) {
      alert('Por favor selecciona una fecha de salida.');
      return;
    }
    if (passengers > maxStock) {
      alert(`No hay suficiente disponibilidad. Stock máximo: ${maxStock}`);
      return;
    }
    alert(`¡Reserva confirmada!\nFecha: ${selectedDate}\nPasajeros: ${passengers}\nTotal: ${moneda === 'PEN' ? 'S/.' : '$'} ${totalPrice}`);
  };

  return (
    <div className="flex flex-col w-full h-fit p-6 rounded-2xl bg-white/5 dark:bg-slate-900/40 backdrop-blur-lg shadow-xl border border-white/10 space-y-6">

      {/* Price Header */}
      <div className="flex justify-between items-baseline border-b border-white/10 pb-4">
        <span className="text-slate-400 text-xs font-bold tracking-widest uppercase">Precio base</span>
        <span className="text-3xl font-poppins font-extrabold text-white">
          {moneda === 'PEN' ? 'S/.' : '$'}{precio}
        </span>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">

        {/* Date Selection */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="date" className="text-slate-300 text-sm font-semibold">Fecha de Salida</label>
          <select
            id="date"
            className="bg-surface-container border border-white/10 rounded-md p-3 outline-none focus:border-brand"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setPassengers(1); // Reset passengers when date changes
            }}
          >
            <option value="" disabled>Selecciona una fecha</option>
            {disponibilidad.map((d) => (
              <option key={d.fechaSalida} value={d.fechaSalida} disabled={d.stockDisponible === 0}>
                {new Date(d.fechaSalida).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}
                {d.stockDisponible === 0 ? ' (Agotado)' : ` (${d.stockDisponible} cupos)`}
              </option>
            ))}
          </select>
        </div>

        {/* Passengers Selection */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="passengers" className="text-slate-300 text-sm font-semibold">Pasajeros</label>
          <input
            type="number"
            id="passengers"
            min="1"
            max={maxStock || 1}
            disabled={!selectedDate || maxStock === 0}
            className="bg-surface-container border border-white/10 text-white rounded-md p-3 outline-none focus:border-brand disabled:opacity-50"
            value={passengers}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val)) {
                setPassengers(Math.min(Math.max(1, val), maxStock));
              } else {
                setPassengers(1);
              }
            }}
          />
          {selectedDate && (
            <p className="text-xs text-brand/80">Cupos disponibles: {maxStock}</p>
          )}
        </div>

      </div>

      {/* Total Section */}
      <div className="flex justify-between items-center pt-4 border-t border-white/10">
        <span className="text-white font-bold">Total a pagar:</span>
        <span className="text-2xl font-bold text-brand">
          {moneda === 'PEN' ? 'S/.' : '$'}{selectedDate ? totalPrice : '0'}
        </span>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleReservation}
        disabled={!selectedDate || maxStock === 0}
        className="w-full py-6 bg-brand text-black hover:bg-yellow-500 font-bold font-poppins shadow-lg rounded-xl text-lg mt-4 disabled:opacity-50 disabled:hover:bg-brand"
      >
        Reservar Cupo
      </Button>
    </div>
  );
}

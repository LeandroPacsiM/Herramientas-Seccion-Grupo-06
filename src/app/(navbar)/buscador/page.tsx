'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PeruMap from './components/PeruMap';
import DestinoCard from './components/DestinoCard';

import data from '@/lib/data/destinos.json';

export default function BuscadorPage() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDestinos = data.destinos.filter((destino) => {
    const matchesRegion = selectedRegion ? destino.departamento === selectedRegion : true;
    const matchesSearch = destino.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      destino.descripcionCorta.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const handleRegionClick = (region: string) => {
    setSelectedRegion(prev => prev === region ? null : region);
  };

  return (
    <main className="flex flex-col w-full bg-[#202124] min-h-screen">

      <div className="w-full relative min-h-[600px] grid grid-cols-1 place-items-center py-12 overflow-hidden bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-no-repeat ">


        <div className="absolute inset-0 bg-black opacity-40" />


        <div className="w-full py-8 px-4 flex flex-col items-center justify-center">
          <h2 className="text-white text-2xl font-poppins font-semibold mb-4">Busca tu destino</h2>
          <div className="relative w-full max-w-4xl flex items-center">
            <Input
              placeholder="Elige el mejor destino para viajar..."
              className="w-full bg-white text-slate-900 h-12 pl-4 pr-12 rounded-none rounded-l-md border-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              className="h-12 rounded-none rounded-r-md bg-blue-600 hover:bg-blue-700 px-6 text-white"
              onClick={() => { }}
            >
              <Search size={20} />
            </Button>
          </div>
        </div>
        <div className="relative z-10 w-full max-w-[800px] drop-shadow-2xl">
          <PeruMap
            selectedRegion={selectedRegion}
            onRegionClick={handleRegionClick}
          />
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto py-16 px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-poppins font-bold text-white">
            {selectedRegion ? `Lugares turísticos en ${selectedRegion}` : 'Todos los Destinos'}
          </h2>
          <p className="text-slate-400 mt-2">
            {filteredDestinos.length} {filteredDestinos.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
          </p>
        </div>

        {filteredDestinos.length > 0 ? (
          <div className="flex flex-col gap-6">
            {filteredDestinos.map((destino) => (
              <DestinoCard key={destino.id} destino={destino} />
            ))}
          </div>
        ) : (
          <Card className="glass-panel border-white/5 flex flex-col items-center justify-center min-h-[300px] text-center p-12 bg-surface-container/30">
            <CardContent className="flex flex-col items-center border-none shadow-none pt-6">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Search size={24} className="text-slate-500" />
              </div>
              <h3 className="text-xl font-poppins font-bold text-white mb-2">No hay destinos</h3>
              <p className="text-slate-400 max-w-md mx-auto text-sm">
                No encontramos expediciones para los filtros seleccionados. Intenta buscar otra región o cambia tu palabra clave.
              </p>
              {(selectedRegion || searchQuery) && (
                <Button
                  variant="outline"
                  className="mt-6 border-white/10 text-white hover:text-black"
                  onClick={() => {
                    setSelectedRegion(null);
                    setSearchQuery('');
                  }}
                >
                  Limpiar filtros
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

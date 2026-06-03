import type { User } from "@/features/auth/types";
import type { Expedition } from "@/features/expeditions/types";
import type { Booking } from "@/features/bookings/types";

const mockUsers: User[] = [
  {
    id: 1,
    name: "Juan Pérez",
    email: "user@llamatours.com",
    password: "password123",
    role: "USER"
  },
  {
    id: 2,
    name: "Admin LlamaTours",
    email: "admin@llamatours.com",
    password: "admin123",
    role: "ADMIN"
  }
];

const mockExpeditions: Expedition[] = [
  {
    id: 1,
    name: "Camino Inca Clásico",
    slug: "camino-inca-clasico",
    description: "El trek más famoso de Sudamérica. Cuatro días de caminata atravesando paisajes andinos, ruinas incas y bosques nubosos hasta llegar a la majestuosa ciudadela de Machu Picchu.",
    price: 599.99,
    durationDays: 4,
    difficulty: "MODERATE",
    location: "Cusco, Perú",
    itineraries: [
      { id: 1, dayNumber: 1, title: "Inicio del Camino", description: "Salida desde Cusco hacia el km 82. Caminata de 12 km hasta Wayllabamba. Acampada en valle." },
      { id: 2, dayNumber: 2, title: "Paso de la Mujer Muerta", description: "Ascenso al punto más alto (4,215 msnm). Descenso hacia el valle de Pacaymayo." },
      { id: 3, dayNumber: 3, title: "Ruinas y Bosque Nuboso", description: "Visita a Runkurakay, Sayacmarca y Phuyupatamarca. Descenso a Wiñay Wayna." },
      { id: 4, dayNumber: 4, title: "Machu Picchu", description: "Salida temprano hacia Inti Punku (Puerta del Sol). Primera vista de Machu Picchu y tour guiado." }
    ],
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1532996152552-eaffc4edfc1a?w=1080", imageOrder: 1 },
      { id: 2, url: "https://images.unsplash.com/photo-1543385426-191664295b58?w=1080", imageOrder: 2 },
      { id: 3, url: "https://images.unsplash.com/photo-1509216242873-7786f446f465?w=1080", imageOrder: 3 }
    ],
    availabilities: [
      { id: 1, startDate: "2026-06-01", endDate: "2026-06-05", capacity: 20, availableSpots: 15 },
      { id: 2, startDate: "2026-07-15", endDate: "2026-07-19", capacity: 20, availableSpots: 8 },
      { id: 3, startDate: "2026-08-10", endDate: "2026-08-14", capacity: 20, availableSpots: 20 }
    ]
  },
  {
    id: 2,
    name: "Montaña de 7 Colores",
    slug: "montana-7-colores",
    description: "Vinicunca, la montaña arcoíris más famosa del mundo. Trek de un día a 5,200 msnm para contemplar las franjas naturales de colores creadas por minerales.",
    price: 89.99,
    durationDays: 1,
    difficulty: "MODERATE",
    location: "Cusco, Perú",
    itineraries: [
      { id: 5, dayNumber: 1, title: "Ascenso a la Montaña Arcoíris", description: "Salida 4 AM desde Cusco. Desayuno en ruta. Caminata de 2-3 horas hasta la cumbre. Retorno y almuerzo en Cusipata." }
    ],
    images: [
      { id: 4, url: "https://images.unsplash.com/photo-1631231248242-f82e0a0e2ea6?w=1080", imageOrder: 1 },
      { id: 5, url: "https://images.unsplash.com/photo-1744295816404-4c73fd69e0f2?w=1080", imageOrder: 2 },
      { id: 6, url: "https://images.unsplash.com/photo-1645740713640-ea2b2025dcba?w=1080", imageOrder: 3 }
    ],
    availabilities: [
      { id: 4, startDate: "2026-06-05", endDate: "2026-06-05", capacity: 30, availableSpots: 22 },
      { id: 5, startDate: "2026-06-12", endDate: "2026-06-12", capacity: 30, availableSpots: 30 },
      { id: 6, startDate: "2026-07-20", endDate: "2026-07-20", capacity: 30, availableSpots: 5 }
    ]
  },
  {
    id: 3,
    name: "Ausangate Trek",
    slug: "ausangate-trek",
    description: "Expedición mística alrededor del Apu Ausangate (6,384 msnm). Siete días de trekking atravesando glaciares, lagunas turquesas y comunidades andinas aisladas.",
    price: 945.00,
    durationDays: 7,
    difficulty: "HARD",
    location: "Cusco, Perú",
    itineraries: [
      { id: 7, dayNumber: 1, title: "Tinki - Upis", description: "Transfer a Tinki. Inicio del trek hacia Upis (4,400 msnm). Primera noche de acampada." },
      { id: 8, dayNumber: 2, title: "Upis - Arapa Pass", description: "Ascenso al paso Arapa (4,850 msnm). Vista de glaciares. Descenso a campamento Ausangate Cocha." },
      { id: 9, dayNumber: 3, title: "Ausangate Cocha - Paso Palomani", description: "Día exigente cruzando el paso Palomani (5,200 msnm). Vistas espectaculares del nevado Ausangate." },
      { id: 10, dayNumber: 4, title: "Laguna Sibinacocha", description: "Caminata hacia la laguna más grande de la región. Observación de fauna andina." },
      { id: 11, dayNumber: 5, title: "Jampa Pass", description: "Cruce del paso Jampa (5,100 msnm). Descenso hacia aguas termales de Pacchanta." },
      { id: 12, dayNumber: 6, title: "Comunidad de Pacchanta", description: "Descanso en aguas termales naturales. Interacción con comunidad local." },
      { id: 13, dayNumber: 7, title: "Retorno a Cusco", description: "Caminata final hacia Tinki. Transfer de regreso a Cusco." }
    ],
    images: [
      { id: 7, url: "https://www.iterraperu.com/images/packages/ausangate-trek-5-days.jpg", imageOrder: 1 },
      { id: 8, url: "https://images.unsplash.com/photo-1582161095006-7c4edf743cd9?w=1080", imageOrder: 2 },
      { id: 9, url: "https://images.unsplash.com/photo-1637580981046-6e14709be202?w=1080", imageOrder: 3 }
    ],
    availabilities: [
      { id: 7, startDate: "2026-06-10", endDate: "2026-06-17", capacity: 12, availableSpots: 7 },
      { id: 8, startDate: "2026-07-22", endDate: "2026-07-29", capacity: 12, availableSpots: 12 }
    ]
  },
  {
    id: 4,
    name: "Salkantay Trek",
    slug: "salkantay-trek",
    description: "Ruta alternativa a Machu Picchu atravesando el majestuoso nevado Salkantay (6,271 msnm). Cinco días de trekking por glaciares, selva alta y ruinas incas.",
    price: 475.00,
    durationDays: 5,
    difficulty: "MODERATE",
    location: "Cusco, Perú",
    itineraries: [
      { id: 14, dayNumber: 1, title: "Soraypampa", description: "Transfer a Mollepata. Caminata hasta Soraypampa (3,900 msnm). Vista del nevado Salkantay y Humantay." },
      { id: 15, dayNumber: 2, title: "Paso Salkantay", description: "Ascenso al paso Salkantay (4,650 msnm), punto más alto del trek. Descenso hacia Chaullay." },
      { id: 16, dayNumber: 3, title: "Selva Alta", description: "Cambio de ecosistema hacia la selva alta. Caminata por bosque nuboso hasta Santa Teresa." },
      { id: 17, dayNumber: 4, title: "Aguas Calientes", description: "Caminata por vías del tren hacia Aguas Calientes. Noche en pueblo base de Machu Picchu." },
      { id: 18, dayNumber: 5, title: "Machu Picchu", description: "Visita guiada a Machu Picchu. Retorno en tren a Cusco." }
    ],
    images: [
      { id: 10, url: "https://images.unsplash.com/photo-1614586125858-e695dd97d1b6?w=1080", imageOrder: 1 },
      { id: 11, url: "https://images.unsplash.com/photo-1598859409659-b88fc15bbc2f?w=1080", imageOrder: 2 }
    ],
    availabilities: [
      { id: 9, startDate: "2026-06-08", endDate: "2026-06-13", capacity: 16, availableSpots: 10 },
      { id: 10, startDate: "2026-07-05", endDate: "2026-07-10", capacity: 16, availableSpots: 16 }
    ]
  },
  {
    id: 5,
    name: "Huayhuash Circuit",
    slug: "huayhuash-circuit",
    description: "El circuito de trekking más espectacular de Perú. Diez días rodeando la Cordillera Huayhuash con vistas de picos nevados superiores a 6,000 msnm.",
    price: 1250.00,
    durationDays: 10,
    difficulty: "HARD",
    location: "Huaraz, Perú",
    itineraries: [
      { id: 19, dayNumber: 1, title: "Llamac - Cuartelhuain", description: "Inicio del circuito desde Llamac. Primera acampada a 4,200 msnm." },
      { id: 20, dayNumber: 2, title: "Paso Cacananpunta", description: "Cruce del primer paso a 4,700 msnm. Vistas del nevado Yerupajá." },
      { id: 21, dayNumber: 3, title: "Laguna Mitucocha", description: "Caminata hacia la laguna Mitucocha. Campamento junto al lago." },
      { id: 22, dayNumber: 4, title: "Paso Carhuac", description: "Ascenso al paso Carhuac (4,650 msnm). Panorámicas del Siulá y Yerupajá." },
      { id: 23, dayNumber: 5, title: "Huayhuash", description: "Campamento base del nevado Huayhuash. Día de aclimatación opcional." },
      { id: 24, dayNumber: 6, title: "Paso San Antonio", description: "Cruce del paso San Antonio (5,000 msnm). Descenso hacia valle Huanacpatay." },
      { id: 25, dayNumber: 7, title: "Laguna Jahuacocha", description: "Trekking hasta la laguna más hermosa del circuito." },
      { id: 26, dayNumber: 8, title: "Paso Tapush", description: "Cruce del paso Tapush (4,750 msnm). Vistas de Jirishanca." },
      { id: 27, dayNumber: 9, title: "Cajatambo", description: "Descenso final hacia el pueblo de Cajatambo." },
      { id: 28, dayNumber: 10, title: "Retorno a Huaraz", description: "Transfer de regreso a Huaraz. Fin del circuito." }
    ],
    images: [
      { id: 12, url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1080", imageOrder: 1 },
      { id: 13, url: "https://images.unsplash.com/photo-1582161095006-7c4edf743cd9?w=1080", imageOrder: 2 }
    ],
    availabilities: [
      { id: 11, startDate: "2026-06-15", endDate: "2026-06-25", capacity: 10, availableSpots: 4 },
      { id: 12, startDate: "2026-08-01", endDate: "2026-08-11", capacity: 10, availableSpots: 10 }
    ]
  },
  {
    id: 6,
    name: "Laguna 69",
    slug: "laguna-69",
    description: "Trek de un día a una de las lagunas más hermosas de la Cordillera Blanca. Agua turquesa rodeada de nevados a 4,600 msnm.",
    price: 65.00,
    durationDays: 1,
    difficulty: "MODERATE",
    location: "Huaraz, Perú",
    itineraries: [
      { id: 29, dayNumber: 1, title: "Laguna 69", description: "Salida desde Huaraz hacia Cebollapampa. Caminata de 3 horas hasta Laguna 69. Retorno y regreso a Huaraz." }
    ],
    images: [
      { id: 14, url: "https://bushop.com/peru/wp-content/uploads/sites/10/laguna69-featured-1_1.jpg", imageOrder: 1 }
    ],
    availabilities: [
      { id: 13, startDate: "2026-06-06", endDate: "2026-06-06", capacity: 25, availableSpots: 18 },
      { id: 14, startDate: "2026-06-20", endDate: "2026-06-20", capacity: 25, availableSpots: 25 },
      { id: 15, startDate: "2026-07-10", endDate: "2026-07-10", capacity: 25, availableSpots: 12 }
    ]
  },
  {
    id: 7,
    name: "Choquequirao Trek",
    slug: "choquequirao-trek",
    description: "La 'hermana sagrada' de Machu Picchu. Trek de cuatro días hacia una ciudad inca menos visitada pero igualmente impresionante, rodeada de montañas y cóndores.",
    price: 520.00,
    durationDays: 4,
    difficulty: "HARD",
    location: "Cusco, Perú",
    itineraries: [
      { id: 30, dayNumber: 1, title: "Cachora - Chiquisca", description: "Transfer a Cachora. Descenso al río Apurímac. Acampada en Chiquisca." },
      { id: 31, dayNumber: 2, title: "Choquequirao", description: "Ascenso empinado hasta las ruinas de Choquequirao. Tour guiado por la ciudadela." },
      { id: 32, dayNumber: 3, title: "Exploración", description: "Día completo explorando terrazas, plazas y observando cóndores." },
      { id: 33, dayNumber: 4, title: "Retorno", description: "Regreso a Cachora. Transfer a Cusco." }
    ],
    images: [
      { id: 15, url: "https://images.unsplash.com/photo-1530999811698-221aa9eb1739?w=1080", imageOrder: 1 },
      { id: 16, url: "https://images.unsplash.com/photo-1590835192370-3941b97e93fd?w=1080", imageOrder: 2 }
    ],
    availabilities: [
      { id: 16, startDate: "2026-06-18", endDate: "2026-06-22", capacity: 14, availableSpots: 9 },
      { id: 17, startDate: "2026-07-12", endDate: "2026-07-16", capacity: 14, availableSpots: 14 }
    ]
  },
  {
    id: 8,
    name: "Glaciar Pastoruri",
    slug: "glaciar-pastoruri",
    description: "Excursión de un día al glaciar Pastoruri en la Cordillera Blanca. Testigo del cambio climático, este glaciar en retroceso sigue siendo una maravilla natural.",
    price: 55.00,
    durationDays: 1,
    difficulty: "EASY",
    location: "Huaraz, Perú",
    itineraries: [
      { id: 34, dayNumber: 1, title: "Glaciar Pastoruri", description: "Salida desde Huaraz. Paradas en bosque de Puyas Raimondi y aguas gasificadas. Caminata corta al glaciar. Retorno." }
    ],
    images: [
      { id: 17, url: "https://images.unsplash.com/photo-1708394534994-4e66c2b09e1f?w=1080", imageOrder: 1 },
      { id: 18, url: "https://images.unsplash.com/photo-1736390739681-ab6580f53adc?w=1080", imageOrder: 2 }
    ],
    availabilities: [
      { id: 18, startDate: "2026-06-07", endDate: "2026-06-07", capacity: 20, availableSpots: 20 },
      { id: 19, startDate: "2026-06-14", endDate: "2026-06-14", capacity: 20, availableSpots: 15 },
      { id: 20, startDate: "2026-07-08", endDate: "2026-07-08", capacity: 20, availableSpots: 6 }
    ]
  },
  {
    id: 9,
    name: "Lares Trek",
    slug: "lares-trek",
    description: "Trek cultural de tres días por comunidades andinas tradicionales. Encuentros con tejedores locales, aguas termales y vistas del nevado Verónica.",
    price: 380.00,
    durationDays: 3,
    difficulty: "MODERATE",
    location: "Cusco, Perú",
    itineraries: [
      { id: 35, dayNumber: 1, title: "Lares - Huacahuasi", description: "Transfer a Lares. Baño en aguas termales. Caminata hasta la comunidad de Huacahuasi." },
      { id: 36, dayNumber: 2, title: "Paso Ipsaycocha", description: "Cruce del paso Ipsaycocha (4,500 msnm). Descenso a la comunidad de Patacancha." },
      { id: 37, dayNumber: 3, title: "Ollantaytambo - Machu Picchu", description: "Descenso a Ollantaytambo. Tren a Aguas Calientes y visita a Machu Picchu." }
    ],
    images: [
      { id: 19, url: "https://images.unsplash.com/photo-1637580981046-6e14709be202?w=1080", imageOrder: 1 },
      { id: 20, url: "https://images.unsplash.com/photo-1598859409659-b88fc15bbc2f?w=1080", imageOrder: 2 }
    ],
    availabilities: [
      { id: 21, startDate: "2026-06-09", endDate: "2026-06-12", capacity: 16, availableSpots: 11 },
      { id: 22, startDate: "2026-07-18", endDate: "2026-07-21", capacity: 16, availableSpots: 16 }
    ]
  },
  {
    id: 10,
    name: "Santa Cruz Trek",
    slug: "santa-cruz-trek",
    description: "El trek más popular de la Cordillera Blanca. Cuatro días atravesando valles glaciares, lagunas turquesas y el impresionante paso Punta Unión a 4,750 msnm.",
    price: 420.00,
    durationDays: 4,
    difficulty: "MODERATE",
    location: "Huaraz, Perú",
    itineraries: [
      { id: 38, dayNumber: 1, title: "Cashapampa - Llamacorral", description: "Inicio del trek desde Cashapampa. Caminata por la Quebrada Santa Cruz hasta Llamacorral." },
      { id: 39, dayNumber: 2, title: "Laguna Ichiccocha", description: "Caminata hasta la laguna Ichiccocha. Vistas del Alpamayo y Taulliraju." },
      { id: 40, dayNumber: 3, title: "Paso Punta Unión", description: "Ascenso al paso Punta Unión (4,750 msnm). Vista de 360° de los nevados. Descenso a Taullipampa." },
      { id: 41, dayNumber: 4, title: "Vaquería", description: "Descenso final por la Quebrada Huaripampa hasta Vaquería. Transfer a Huaraz." }
    ],
    images: [
      { id: 21, url: "https://images.unsplash.com/photo-1551779382-e65b3ec856ef?w=1080", imageOrder: 1 },
      { id: 22, url: "https://images.unsplash.com/photo-1575928185982-7660337c15e2?w=1080", imageOrder: 2 }
    ],
    availabilities: [
      { id: 23, startDate: "2026-06-16", endDate: "2026-06-20", capacity: 18, availableSpots: 13 },
      { id: 24, startDate: "2026-07-25", endDate: "2026-07-29", capacity: 18, availableSpots: 18 },
      { id: 25, startDate: "2026-08-15", endDate: "2026-08-19", capacity: 18, availableSpots: 3 }
    ]
  }
];

const mockBookings: Booking[] = [
  {
    id: 1,
    peopleCount: 2,
    status: "CONFIRMED",
    userId: 1,
    expeditionId: 1,
    expeditionName: "Camino Inca Clásico",
    availabilityId: 1,
    startDate: "2026-06-01",
    endDate: "2026-06-05"
  },
  {
    id: 2,
    peopleCount: 1,
    status: "PENDING",
    userId: 1,
    expeditionId: 2,
    expeditionName: "Montaña de 7 Colores",
    availabilityId: 4,
    startDate: "2026-06-05",
    endDate: "2026-06-05"
  }
];

export class MockApiClient {
  private delay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async get<T>(endpoint: string): Promise<T> {
    await this.delay();

    if (endpoint === "/api/expeditions") {
      return mockExpeditions as T;
    }

    if (endpoint.startsWith("/api/expeditions/")) {
      const id = parseInt(endpoint.split("/").pop() || "0");
      const expedition = mockExpeditions.find((e) => e.id === id);
      if (!expedition) throw new Error("Expedición no encontrada");
      return expedition as T;
    }

    if (endpoint === "/api/bookings") {
      const userStr = localStorage.getItem("llamatours_user");
      if (!userStr) throw new Error("No autenticado");
      const user = JSON.parse(userStr);
      const userBookings = mockBookings.filter((b) => b.userId === user.id);
      return userBookings as T;
    }

    if (endpoint === "/api/admin/expeditions") {
      return mockExpeditions as T;
    }

    if (endpoint === "/api/admin/bookings") {
      return mockBookings as T;
    }

    throw new Error(`Mock endpoint no implementado: ${endpoint}`);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    await this.delay();

    if (endpoint === "/auth/register") {
      const { name, email, password } = data as { name: string; email: string; password: string };

      if (mockUsers.find((u) => u.email === email)) {
        throw new Error("Email ya registrado");
      }

      const newUser: User = {
        id: mockUsers.length + 1,
        name,
        email,
        password,
        role: "USER",
      };

      mockUsers.push(newUser);

      return {
        token: `mock-token-${newUser.id}`,
        email: newUser.email,
        name: newUser.name,
      } as T;
    }

    if (endpoint === "/auth/login") {
      const { email, password } = data as { email: string; password: string };
      const user = mockUsers.find((u) => u.email === email && u.password === password);

      if (!user) {
        throw new Error("Credenciales inválidas");
      }

      return {
        token: `mock-token-${user.id}`,
        email: user.email,
        name: user.name,
      } as T;
    }

    if (endpoint === "/api/bookings") {
      const { availabilityId, peopleCount } = data as { availabilityId: number; peopleCount: number };
      const userStr = localStorage.getItem("llamatours_user");
      if (!userStr) throw new Error("No autenticado");
      const user = JSON.parse(userStr);

      let availability: any = null;
      let expedition: any = null;

      for (const exp of mockExpeditions) {
        const found = exp.availabilities.find((a) => a.id === availabilityId);
        if (found) {
          availability = found;
          expedition = exp;
          break;
        }
      }

      if (!availability) throw new Error("Disponibilidad no encontrada");
      if (availability.availableSpots < peopleCount) throw new Error("No hay suficientes cupos");

      availability.availableSpots -= peopleCount;

      const newBooking: Booking = {
        id: mockBookings.length + 1,
        peopleCount,
        status: "CONFIRMED",
        userId: user.id,
        expeditionId: expedition.id,
        expeditionName: expedition.name,
        availabilityId,
        startDate: availability.startDate,
        endDate: availability.endDate,
      };

      mockBookings.push(newBooking);

      return newBooking as T;
    }

    if (endpoint === "/api/contact") {
      return {} as T;
    }

    if (endpoint === "/api/admin/expeditions") {
      const payload = data as Expedition;
      const newExp: Expedition = {
        ...payload,
        id: Math.max(...mockExpeditions.map((e) => e.id)) + 1,
        itineraries: (payload.itineraries ?? []).map((it, i) => ({ ...it, id: Date.now() + i })),
        images: (payload.images ?? []).map((img, i) => ({ ...img, id: Date.now() + i + 100 })),
        availabilities: (payload.availabilities ?? []).map((av, i) => ({
          ...av,
          id: Date.now() + i + 200,
          availableSpots: av.capacity,
        })),
      };
      mockExpeditions.push(newExp);
      return newExp as T;
    }

    if (endpoint.match(/\/api\/bookings\/\d+\/cancel/)) {
      const id = parseInt(endpoint.split("/")[3]);
      const booking = mockBookings.find((b) => b.id === id);
      if (!booking) throw new Error("Reserva no encontrada");

      for (const exp of mockExpeditions) {
        const availability = exp.availabilities.find((a) => a.id === booking.availabilityId);
        if (availability) {
          availability.availableSpots += booking.peopleCount;
          break;
        }
      }

      booking.status = "CANCELLED";
      return {} as T;
    }

    throw new Error(`Mock endpoint no implementado: ${endpoint}`);
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    await this.delay();

    if (endpoint.startsWith("/api/admin/expeditions/")) {
      const id = parseInt(endpoint.split("/").pop() || "0");
      const idx = mockExpeditions.findIndex((e) => e.id === id);
      if (idx === -1) throw new Error("Expedición no encontrada");
      const payload = data as Partial<Expedition>;
      mockExpeditions[idx] = { ...mockExpeditions[idx], ...payload };
      return mockExpeditions[idx] as T;
    }

    throw new Error(`Mock endpoint no implementado: ${endpoint}`);
  }

  async delete<T>(endpoint: string): Promise<T> {
    await this.delay();

    if (endpoint.startsWith("/api/admin/expeditions/")) {
      const id = parseInt(endpoint.split("/").pop() || "0");
      const idx = mockExpeditions.findIndex((e) => e.id === id);
      if (idx === -1) throw new Error("Expedición no encontrada");
      mockExpeditions.splice(idx, 1);
      return {} as T;
    }

    throw new Error(`Mock endpoint no implementado: ${endpoint}`);
  }
}

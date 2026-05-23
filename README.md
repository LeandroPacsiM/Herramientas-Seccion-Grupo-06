# LlamaTOURS

Aplicación web de agencia de viajes y expediciones construida con React, TypeScript, Vite, Tailwind CSS v4 y shadcn/ui.

## Requisitos

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 9

## Instalación

```bash
pnpm install
```

## Desarrollo

```bash
pnpm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en el navegador.

## Build

```bash
pnpm run build
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm run dev` | Inicia el servidor de desarrollo Vite |
| `pnpm run build` | Compila el proyecto para producción |

## Backend

La app espera una API REST en `http://localhost:8080` por defecto. Para cambiar la URL o activar datos mock, editar `.env`:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_USE_MOCK_DATA=false
```

## Arquitectura

```
src/
├── app/              # Layout, routing, componentes compartidos y UI primitives
│   ├── components/
│   │   ├── layout/   # Navbar, Footer, AdminLayout
│   │   ├── shared/   # ProtectedRoute, Loading, Error
│   │   └── ui/       # shadcn/ui components
│   └── routes.tsx    # Definición de rutas
├── context/          # AuthContext
├── features/         # Módulos por dominio
│   ├── admin/        # Panel de administración
│   ├── auth/         # Autenticación (login, registro)
│   ├── bookings/     # Reservas
│   ├── contact/      # Contacto
│   ├── expeditions/  # Expediciones / viajes
│   └── home/         # Páginas principales
├── lib/
│   ├── api/          # Cliente HTTP (real y mock)
│   └── constants.ts  # Constantes de configuración
├── styles/           # Estilos globales
└── assets/           # Recursos estáticos
```

Cada feature contiene sus propios `types/`, `pages/`, `components/` y `services/`.

## Tecnologías

- **React 18** con TypeScript
- **Vite 6** como bundler
- **Tailwind CSS v4** para estilos
- **shadcn/ui** (Radix UI + Tailwind) para componentes de interfaz
- **React Router v7** para navegación
- **Recharts** para gráficos
- **date-fns** para manejo de fechas

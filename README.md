# Software FUMC

Plataforma web full stack para inventario, dropshipping/fulfillment, pedidos, despacho, liquidaciones y reportes.

## Stack

- Next.js App Router + React + TypeScript
- Tailwind CSS + componentes propios estilo shadcn/ui
- Prisma ORM + PostgreSQL
- Zod, JWT en cookie httpOnly y bcrypt
- Vitest para reglas de dominio

## Ejecutar localmente

```powershell
pnpm.cmd install
docker compose up -d
pnpm.cmd prisma:migrate --name init
pnpm.cmd prisma:seed
pnpm.cmd dev
```

Abrir `http://localhost:3000`.

## Usuarios demo

| Rol | Email | Password |
| --- | --- | --- |
| Administrador | `admin@fumc.edu.co` | `Admin123!` |
| Bodega | `bodega@fumc.edu.co` | `Bodega123!` |
| Vendedor | `vendedor@fumc.edu.co` | `Vendedor123!` |
| Cliente | `cliente@fumc.edu.co` | `Cliente123!` |

## Documentacion

La formulacion consolidada esta en `docs/FORMULACION_PROYECTO_FUMC.md`.

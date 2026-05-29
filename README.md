# Software FUMC

Plataforma web full stack para inventario, dropshipping/fulfillment, pedidos, despacho, liquidaciones y reportes.

## Stack

- Next.js App Router + React + TypeScript
- Tailwind CSS + componentes propios estilo shadcn/ui
- Prisma ORM + MySQL
- Zod, JWT en cookie httpOnly y bcrypt
- Vitest para reglas de dominio

## Ejecutar localmente

```powershell
pnpm.cmd install
pnpm.cmd prisma migrate deploy
pnpm.cmd dev
```

Abrir `http://localhost:3000`.

Para una base MySQL local opcional, usa `docker compose up -d` y una URL como
`mysql://fumc:fumc@localhost:3307/fumc?connection_limit=1`.

Para cargar datos demo en una base vacia:

```powershell
pnpm.cmd prisma:seed
```

Para repetir la transferencia desde el PostgreSQL local anterior hacia MySQL:

```powershell
pnpm.cmd tsx scripts\transfer-local-postgres-to-mysql.ts
```

## Usuarios demo

| Rol | Email | Password |
| --- | --- | --- |
| Administrador | `admin@fumc.edu.co` | `Admin123!` |
| Bodega | `bodega@fumc.edu.co` | `Bodega123!` |
| Vendedor | `vendedor@fumc.edu.co` | `Vendedor123!` |
| Cliente | `cliente@fumc.edu.co` | `Cliente123!` |

## Documentacion

La formulacion consolidada esta en `docs/FORMULACION_PROYECTO_FUMC.md`.

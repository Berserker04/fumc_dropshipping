export const roles = [
  "ADMINISTRADOR",
  "OPERADOR_BODEGA",
  "VENDEDOR_EXTERNO",
  "CLIENTE_FINAL"
] as const;

export type AppRole = (typeof roles)[number];

const permissionMap = {
  ADMINISTRADOR: [
    "dashboard:view",
    "catalog:view",
    "products:manage",
    "stock:manage",
    "orders:view-all",
    "orders:create",
    "dispatch:manage",
    "reports:view"
  ],
  OPERADOR_BODEGA: [
    "dashboard:view",
    "catalog:view",
    "stock:manage",
    "dispatch:manage"
  ],
  VENDEDOR_EXTERNO: [
    "dashboard:view",
    "catalog:view",
    "orders:create",
    "orders:view-own"
  ],
  CLIENTE_FINAL: ["catalog:view", "orders:view-own"]
} satisfies Record<AppRole, string[]>;

export function hasPermission(role: AppRole, permission: string) {
  return permissionMap[role].includes(permission);
}

export function roleLabel(role: AppRole) {
  const labels: Record<AppRole, string> = {
    ADMINISTRADOR: "Administrador",
    OPERADOR_BODEGA: "Operador bodega",
    VENDEDOR_EXTERNO: "Vendedor externo",
    CLIENTE_FINAL: "Cliente final"
  };

  return labels[role];
}

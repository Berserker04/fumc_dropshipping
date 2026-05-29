import Link from "next/link";
import {
  BarChart3,
  Boxes,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  PackageSearch,
  Truck,
  Users
} from "lucide-react";
import { logoutAction } from "@/app/actions";
import { getSession } from "@/lib/auth";
import { roleLabel, type AppRole } from "@/lib/domain/permissions";
import { Button } from "@/components/ui/button";

const navByRole: Record<AppRole, { href: string; label: string; icon: React.ReactNode }[]> = {
  ADMINISTRADOR: [
    { href: "/dashboard", label: "Panel", icon: <LayoutDashboard size={18} /> },
    { href: "/catalogo", label: "Catalogo", icon: <PackageSearch size={18} /> },
    { href: "/admin/usuarios", label: "Usuarios", icon: <Users size={18} /> },
    { href: "/admin/productos", label: "Inventario", icon: <Boxes size={18} /> },
    { href: "/bodega/despachos", label: "Despachos", icon: <Truck size={18} /> },
    { href: "/vendedor/pedidos", label: "Pedidos", icon: <ClipboardList size={18} /> },
    { href: "/reportes", label: "Reportes", icon: <BarChart3 size={18} /> }
  ],
  OPERADOR_BODEGA: [
    { href: "/dashboard", label: "Panel", icon: <LayoutDashboard size={18} /> },
    { href: "/catalogo", label: "Catalogo", icon: <PackageSearch size={18} /> },
    { href: "/bodega/despachos", label: "Despachos", icon: <Truck size={18} /> }
  ],
  VENDEDOR_EXTERNO: [
    { href: "/dashboard", label: "Panel", icon: <LayoutDashboard size={18} /> },
    { href: "/catalogo", label: "Catalogo", icon: <PackageSearch size={18} /> },
    { href: "/vendedor/pedidos", label: "Pedidos", icon: <ClipboardList size={18} /> }
  ],
  CLIENTE_FINAL: [
    { href: "/catalogo", label: "Catalogo", icon: <PackageSearch size={18} /> },
    { href: "/cliente/seguimiento", label: "Seguimiento", icon: <Truck size={18} /> }
  ]
};

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const nav = session ? navByRole[session.rol] : [];

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <Link href="/catalogo" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-ocean text-sm font-bold text-white">
              SF
            </span>
            <span>
              <span className="block text-sm font-semibold uppercase tracking-wide text-mint">
                Software FUMC
              </span>
              <span className="block text-lg font-semibold tracking-normal">
                Inventario y dropshipping
              </span>
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            {session ? (
              <>
                <div className="rounded-md border border-line bg-slate-50 px-3 py-2 text-sm">
                  <span className="font-semibold">{session.nombre}</span>
                  <span className="ml-2 text-slate-500">
                    {roleLabel(session.rol)}
                  </span>
                </div>
                <form action={logoutAction}>
                  <Button variant="secondary" size="sm" type="submit">
                    <LogOut size={16} /> Salir
                  </Button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-md bg-ocean px-4 py-2 text-sm font-semibold text-white hover:bg-ink"
              >
                Ingresar
              </Link>
            )}
          </div>
        </div>

        {nav.length > 0 ? (
          <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pb-3">
            {nav.map((item) => (
              <Link
                href={item.href}
                key={item.href}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-ink"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}

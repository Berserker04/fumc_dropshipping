import { RolUsuario } from "@prisma/client";
import { Users } from "lucide-react";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { roleLabel } from "@/lib/domain/permissions";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { ManagedUserForm } from "./managed-user-form";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function UsuariosAdminPage({
  searchParams
}: {
  searchParams?: SearchParams;
}) {
  await requireRole([RolUsuario.ADMINISTRADOR]);
  const params = searchParams ? await searchParams : {};
  const ok = typeof params.ok === "string" ? params.ok : null;
  const error = typeof params.error === "string" ? params.error : null;

  const usuarios = await db.usuario.findMany({
    where: {
      rol: {
        in: [RolUsuario.VENDEDOR_EXTERNO, RolUsuario.OPERADOR_BODEGA]
      }
    },
    include: { vendedor: true },
    orderBy: [{ rol: "asc" }, { nombre: "asc" }]
  });

  const vendedores = usuarios.filter(
    (usuario) => usuario.rol === RolUsuario.VENDEDOR_EXTERNO
  ).length;
  const bodegas = usuarios.filter(
    (usuario) => usuario.rol === RolUsuario.OPERADOR_BODEGA
  ).length;

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-mint">
          Administracion
        </p>
        <h1 className="text-3xl font-semibold tracking-normal text-ink">
          Usuarios operativos
        </h1>
        <p className="max-w-3xl text-slate-600">
          Crea cuentas de vendedores externos y operadores de bodega. Las
          cuentas de cliente y administrador siguen disponibles desde el registro publico.
        </p>
      </section>

      {ok ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {ok}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Usuarios operativos</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{usuarios.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Vendedores</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{vendedores}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Bodega</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{bodegas}</p>
        </Card>
      </section>

      <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={18} /> Nuevo usuario
            </CardTitle>
            <CardDescription>
              El administrador define la clave inicial de acceso.
            </CardDescription>
          </CardHeader>
          <ManagedUserForm />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usuarios registrados</CardTitle>
            <CardDescription>
              Listado de vendedores externos y operadores de bodega activos en el sistema.
            </CardDescription>
          </CardHeader>
          <Table>
            <thead>
              <tr>
                <Th>Nombre</Th>
                <Th>Correo</Th>
                <Th>Rol</Th>
                <Th>Perfil</Th>
                <Th>Estado</Th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <Td className="font-semibold text-ink">{usuario.nombre}</Td>
                  <Td>{usuario.email}</Td>
                  <Td>{roleLabel(usuario.rol)}</Td>
                  <Td>{usuario.vendedor?.nombreEmpresa ?? "-"}</Td>
                  <Td>
                    <Badge tone={usuario.activo ? "good" : "bad"}>
                      {usuario.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </Td>
                </tr>
              ))}
              {usuarios.length === 0 ? (
                <tr>
                  <Td colSpan={5}>Aun no hay usuarios operativos registrados.</Td>
                </tr>
              ) : null}
            </tbody>
          </Table>
        </Card>
      </div>
    </div>
  );
}

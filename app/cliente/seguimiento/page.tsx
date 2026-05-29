import { MapPinned } from "lucide-react";
import { RolUsuario } from "@prisma/client";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { formatDate, formatMoney, statusLabel } from "@/lib/format";
import { Badge, statusTone } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function SeguimientoClientePage() {
  const session = await requireRole([RolUsuario.CLIENTE_FINAL]);
  const email = session.email.toLowerCase();
  const clientes = await db.cliente.findMany({
    where: {
      OR: [{ userId: session.id }, { email }]
    },
    select: { id: true }
  });
  const clienteIds = clientes.map((cliente) => cliente.id);

  const pedidos = await db.pedido.findMany({
    where: { clienteId: { in: clienteIds.length > 0 ? clienteIds : ["__none__"] } },
    include: {
      lineas: { include: { producto: true } },
      ordenDespacho: true
    },
    orderBy: { actualizadoEn: "desc" }
  });

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-mint">
          Cliente final
        </p>
        <h1 className="text-3xl font-semibold tracking-normal text-ink">
          Seguimiento de entregas
        </h1>
        <p className="max-w-3xl text-slate-600">
          Consulta el estado logistico, productos y guia asociada a tus pedidos.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPinned size={18} /> Mis pedidos
          </CardTitle>
          <CardDescription>
            Vista sencilla para el receptor final del producto.
          </CardDescription>
        </CardHeader>
        <Table>
          <thead>
            <tr>
              <Th>Pedido</Th>
              <Th>Fecha</Th>
              <Th>Productos</Th>
              <Th>Total</Th>
              <Th>Estado</Th>
              <Th>Guia</Th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <Td className="font-mono text-xs">{pedido.id.slice(-8).toUpperCase()}</Td>
                <Td>{formatDate(pedido.creadoEn)}</Td>
                <Td>
                  {pedido.lineas.map((linea) => `${linea.cantidad}x ${linea.producto.nombre}`).join(", ")}
                </Td>
                <Td>{formatMoney(pedido.totalBruto)}</Td>
                <Td>
                  <Badge tone={statusTone(pedido.estado)}>
                    {statusLabel(pedido.estado)}
                  </Badge>
                </Td>
                <Td>{pedido.ordenDespacho?.numeroGuia ?? pedido.guiaEstimada ?? "Pendiente"}</Td>
              </tr>
            ))}
            {pedidos.length === 0 ? (
              <tr>
                <Td colSpan={6}>
                  No encontramos pedidos asociados a este correo de cliente.
                </Td>
              </tr>
            ) : null}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}

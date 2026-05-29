import { ClipboardCheck, Truck } from "lucide-react";
import { EstadoPedido, RolUsuario } from "@prisma/client";
import { advanceDispatchAction } from "@/app/actions";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { nextPedidoStates, type PedidoState } from "@/lib/domain/order-state";
import { formatDate, formatMoney, statusLabel } from "@/lib/format";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Label, Select } from "@/components/ui/field";
import { Table, Td, Th } from "@/components/ui/table";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function DespachosPage({
  searchParams
}: {
  searchParams?: SearchParams;
}) {
  await requireRole([RolUsuario.ADMINISTRADOR, RolUsuario.OPERADOR_BODEGA]);
  const params = searchParams ? await searchParams : {};
  const ok = typeof params.ok === "string" ? params.ok : null;
  const error = typeof params.error === "string" ? params.error : null;

  const pedidos = await db.pedido.findMany({
    where: {
      estado: {
        in: [
          EstadoPedido.CONFIRMADO,
          EstadoPedido.EN_PREPARACION,
          EstadoPedido.EMPACADO,
          EstadoPedido.DESPACHADO,
          EstadoPedido.EN_TRANSITO,
          EstadoPedido.DEVUELTO,
          EstadoPedido.ENTREGADO
        ]
      }
    },
    include: {
      cliente: true,
      vendedor: { include: { usuario: true } },
      lineas: { include: { producto: true } },
      ordenDespacho: { include: { operador: true } }
    },
    orderBy: { actualizadoEn: "desc" }
  });

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-mint">
          Bodega
        </p>
        <h1 className="text-3xl font-semibold tracking-normal text-ink">
          Ordenes de despacho
        </h1>
        <p className="max-w-3xl text-slate-600">
          Gestiona preparacion, empaque, despacho, transito, entrega y devolucion.
          Cada cambio registra una notificacion mock para el cliente.
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck size={18} /> Cola operativa
          </CardTitle>
          <CardDescription>
            Solo se muestran pedidos con orden de despacho o cierre logistico.
          </CardDescription>
        </CardHeader>
        <Table>
          <thead>
            <tr>
              <Th>Pedido</Th>
              <Th>Cliente</Th>
              <Th>Producto</Th>
              <Th>Total</Th>
              <Th>Estado</Th>
              <Th>Guia</Th>
              <Th>Avanzar</Th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => {
              const nextStates = nextPedidoStates(pedido.estado as PedidoState);
              return (
                <tr key={pedido.id}>
                  <Td>
                    <p className="font-mono text-xs">{pedido.id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-slate-500">{formatDate(pedido.creadoEn)}</p>
                  </Td>
                  <Td>
                    <p className="font-semibold text-ink">{pedido.cliente.nombre}</p>
                    <p className="text-xs text-slate-500">{pedido.cliente.ciudad}</p>
                  </Td>
                  <Td>
                    {pedido.lineas.map((linea) => `${linea.cantidad}x ${linea.producto.nombre}`).join(", ")}
                  </Td>
                  <Td>{formatMoney(pedido.totalBruto)}</Td>
                  <Td>
                    <Badge tone={statusTone(pedido.estado)}>
                      {statusLabel(pedido.estado)}
                    </Badge>
                  </Td>
                  <Td>
                    <p>{pedido.ordenDespacho?.numeroGuia ?? "-"}</p>
                    <p className="text-xs text-slate-500">
                      {pedido.ordenDespacho?.transportadora ?? "Sin transportadora"}
                    </p>
                  </Td>
                  <Td>
                    {nextStates.length > 0 ? (
                      <form action={advanceDispatchAction} className="flex min-w-[390px] items-end gap-2">
                        <input type="hidden" name="pedidoId" value={pedido.id} />
                        <Field className="w-40">
                          <Label className="sr-only" htmlFor={`state-${pedido.id}`}>Estado</Label>
                          <Select id={`state-${pedido.id}`} name="nextState">
                            {nextStates.map((state) => (
                              <option key={state} value={state}>
                                {statusLabel(state)}
                              </option>
                            ))}
                          </Select>
                        </Field>
                        <Field className="w-36">
                          <Label className="sr-only" htmlFor={`carrier-${pedido.id}`}>Transportadora</Label>
                          <Input
                            id={`carrier-${pedido.id}`}
                            name="transportadora"
                            defaultValue={pedido.ordenDespacho?.transportadora ?? "Transportadora Demo"}
                          />
                        </Field>
                        <Field className="w-36">
                          <Label className="sr-only" htmlFor={`guide-${pedido.id}`}>Guia</Label>
                          <Input
                            id={`guide-${pedido.id}`}
                            name="numeroGuia"
                            defaultValue={pedido.ordenDespacho?.numeroGuia ?? ""}
                            placeholder="Guia"
                          />
                        </Field>
                        <Button type="submit" variant="secondary" size="sm">
                          <ClipboardCheck size={14} /> Guardar
                        </Button>
                      </form>
                    ) : (
                      <span className="text-sm text-slate-500">Sin transiciones</span>
                    )}
                  </Td>
                </tr>
              );
            })}
            {pedidos.length === 0 ? (
              <tr>
                <Td colSpan={7}>No hay pedidos para despacho.</Td>
              </tr>
            ) : null}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}

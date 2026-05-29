import { PackagePlus, ReceiptText } from "lucide-react";
import { RolUsuario } from "@prisma/client";
import { createOrderAction } from "@/app/actions";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { formatDate, formatMoney, statusLabel } from "@/lib/format";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Label, Select } from "@/components/ui/field";
import { Table, Td, Th } from "@/components/ui/table";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function PedidosVendedorPage({
  searchParams
}: {
  searchParams?: SearchParams;
}) {
  const session = await requireRole([
    RolUsuario.VENDEDOR_EXTERNO,
    RolUsuario.ADMINISTRADOR
  ]);
  const params = searchParams ? await searchParams : {};
  const ok = typeof params.ok === "string" ? params.ok : null;
  const error = typeof params.error === "string" ? params.error : null;

  const vendedor =
    session.rol === RolUsuario.ADMINISTRADOR
      ? await db.vendedorExterno.findFirst()
      : await db.vendedorExterno.findUnique({ where: { userId: session.id } });

  const [productos, pedidos] = await Promise.all([
    db.producto.findMany({
      where: { activo: true },
      orderBy: [{ stockActual: "desc" }, { nombre: "asc" }]
    }),
    db.pedido.findMany({
      where: vendedor ? { vendedorId: vendedor.id } : { id: "__none__" },
      include: {
        cliente: true,
        lineas: { include: { producto: true } },
        ordenDespacho: true,
        liquidacion: true,
        pedidoEspecial: true
      },
      orderBy: { creadoEn: "desc" }
    })
  ]);

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-mint">
          Portal vendedor
        </p>
        <h1 className="text-3xl font-semibold tracking-normal text-ink">
          Crear y monitorear pedidos
        </h1>
        <p className="max-w-3xl text-slate-600">
          El vendedor registra el pedido del cliente final. Si existe stock, se
          descuenta inventario y se crea despacho; si no, queda como pedido especial.
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

      <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackagePlus size={18} /> Nuevo pedido
            </CardTitle>
            <CardDescription>
              Registra un producto por pedido.
            </CardDescription>
          </CardHeader>
          <form action={createOrderAction} className="space-y-4">
            <Field>
              <Label htmlFor="productoId">Producto</Label>
              <Select id="productoId" name="productoId" required>
                <option value="">Seleccionar producto</option>
                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.sku} - {producto.nombre} ({producto.stockActual})
                  </option>
                ))}
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <Label htmlFor="cantidad">Cantidad</Label>
                <Input id="cantidad" name="cantidad" type="number" min="1" defaultValue="1" required />
              </Field>
              <Field>
                <Label htmlFor="costoLogistico">Costo logistico</Label>
                <Input id="costoLogistico" name="costoLogistico" type="number" min="0" defaultValue="12000" required />
              </Field>
            </div>
            <Field>
              <Label htmlFor="clienteNombre">Cliente</Label>
              <Input id="clienteNombre" name="clienteNombre" required />
            </Field>
            <Field>
              <Label htmlFor="clienteEmail">Correo cliente</Label>
              <Input id="clienteEmail" name="clienteEmail" type="email" required />
            </Field>
            <Field>
              <Label htmlFor="clienteTelefono">Telefono</Label>
              <Input id="clienteTelefono" name="clienteTelefono" required />
            </Field>
            <Field>
              <Label htmlFor="clienteCiudad">Ciudad</Label>
              <Input id="clienteCiudad" name="clienteCiudad" required />
            </Field>
            <Field>
              <Label htmlFor="clienteDireccion">Direccion</Label>
              <Input id="clienteDireccion" name="clienteDireccion" required />
            </Field>
            <Button type="submit" className="w-full">
              Crear pedido
            </Button>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ReceiptText size={18} /> Historial
            </CardTitle>
            <CardDescription>
              Incluye despacho, pedido especial y liquidacion cuando aplique.
            </CardDescription>
          </CardHeader>
          <Table>
            <thead>
              <tr>
                <Th>Pedido</Th>
                <Th>Fecha</Th>
                <Th>Cliente</Th>
                <Th>Productos</Th>
                <Th>Total</Th>
                <Th>Estado</Th>
                <Th>Liquidacion</Th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <Td className="font-mono text-xs">{pedido.id.slice(-8).toUpperCase()}</Td>
                  <Td>{formatDate(pedido.creadoEn)}</Td>
                  <Td>{pedido.cliente.nombre}</Td>
                  <Td>
                    {pedido.lineas.map((linea) => `${linea.cantidad}x ${linea.producto.nombre}`).join(", ")}
                    {pedido.pedidoEspecial ? (
                      <p className="mt-1 text-xs text-amber-700">
                        Preventa estimada: {formatDate(pedido.pedidoEspecial.fechaEstimada)}
                      </p>
                    ) : null}
                  </Td>
                  <Td>{formatMoney(pedido.totalBruto)}</Td>
                  <Td>
                    <Badge tone={statusTone(pedido.estado)}>
                      {statusLabel(pedido.estado)}
                    </Badge>
                  </Td>
                  <Td>
                    {pedido.liquidacion
                      ? formatMoney(pedido.liquidacion.ganancia)
                      : formatMoney(pedido.liquidacionVendedor)}
                  </Td>
                </tr>
              ))}
              {pedidos.length === 0 ? (
                <tr>
                  <Td colSpan={7}>Aun no hay pedidos para este vendedor.</Td>
                </tr>
              ) : null}
            </tbody>
          </Table>
        </Card>
      </div>
    </div>
  );
}

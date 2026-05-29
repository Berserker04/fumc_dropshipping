import { BarChart3, Boxes, CircleDollarSign, RotateCcw } from "lucide-react";
import { EstadoPedido, RolUsuario } from "@prisma/client";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { formatMoney, statusLabel } from "@/lib/format";
import { Badge, statusTone } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function ReportesPage() {
  await requireRole([RolUsuario.ADMINISTRADOR]);

  const [
    pedidosPorEstado,
    ventas,
    liquidaciones,
    productos,
    topProductos
  ] = await Promise.all([
    db.pedido.groupBy({
      by: ["estado"],
      _count: { _all: true },
      orderBy: { estado: "asc" }
    }),
    db.pedido.aggregate({
      _sum: { totalBruto: true, costoLogistico: true },
      where: { estado: { not: EstadoPedido.CANCELADO } }
    }),
    db.liquidacion.aggregate({
      _sum: { ganancia: true },
      _count: { _all: true }
    }),
    db.producto.findMany({
      select: {
        id: true,
        sku: true,
        nombre: true,
        categoria: true,
        stockActual: true,
        stockMinimo: true
      },
      orderBy: { stockActual: "asc" }
    }),
    db.lineaPedido.groupBy({
      by: ["productoId"],
      _sum: { cantidad: true, subtotal: true },
      orderBy: { _sum: { cantidad: "desc" } },
      take: 5
    })
  ]);

  const productosMap = new Map(
    productos.map((producto) => [producto.id, producto])
  );
  const stockCritico = productos.filter(
    (producto) => producto.stockActual <= producto.stockMinimo
  );
  const devoluciones =
    pedidosPorEstado.find((item) => item.estado === EstadoPedido.DEVUELTO)?._count
      ._all ?? 0;
  const entregados =
    pedidosPorEstado.find((item) => item.estado === EstadoPedido.ENTREGADO)?._count
      ._all ?? 0;
  const tasaDevolucion =
    entregados + devoluciones === 0
      ? 0
      : Math.round((devoluciones / (entregados + devoluciones)) * 100);

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-mint">
          Reportes
        </p>
        <h1 className="text-3xl font-semibold tracking-normal text-ink">
          KPIs ejecutivos del MVP
        </h1>
        <p className="max-w-3xl text-slate-600">
          Vista inicial para ventas, inventario, despacho y liquidaciones.
          Los datos se calculan directamente desde PostgreSQL.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Ventas</p>
              <p className="mt-2 text-3xl font-semibold text-ink">
                {formatMoney(ventas._sum.totalBruto ?? 0)}
              </p>
            </div>
            <CircleDollarSign className="text-emerald-700" size={24} />
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Liquidaciones</p>
              <p className="mt-2 text-3xl font-semibold text-ink">
                {formatMoney(liquidaciones._sum.ganancia ?? 0)}
              </p>
            </div>
            <BarChart3 className="text-sky-700" size={24} />
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Stock critico</p>
              <p className="mt-2 text-3xl font-semibold text-ink">
                {stockCritico.length}
              </p>
            </div>
            <Boxes className="text-amber-700" size={24} />
          </div>
        </Card>
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Tasa devolucion</p>
              <p className="mt-2 text-3xl font-semibold text-ink">
                {tasaDevolucion}%
              </p>
            </div>
            <RotateCcw className="text-red-700" size={24} />
          </div>
        </Card>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pedidos por estado</CardTitle>
            <CardDescription>
              Base para reportes logisticos y seguimiento ejecutivo.
            </CardDescription>
          </CardHeader>
          <Table>
            <thead>
              <tr>
                <Th>Estado</Th>
                <Th>Cantidad</Th>
              </tr>
            </thead>
            <tbody>
              {pedidosPorEstado.map((item) => (
                <tr key={item.estado}>
                  <Td>
                    <Badge tone={statusTone(item.estado)}>
                      {statusLabel(item.estado)}
                    </Badge>
                  </Td>
                  <Td>{item._count._all}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productos mas vendidos</CardTitle>
            <CardDescription>
              Ranking por unidades procesadas en lineas de pedido.
            </CardDescription>
          </CardHeader>
          <Table>
            <thead>
              <tr>
                <Th>Producto</Th>
                <Th>Unidades</Th>
                <Th>Ventas</Th>
              </tr>
            </thead>
            <tbody>
              {topProductos.map((item) => {
                const producto = productosMap.get(item.productoId);
                return (
                  <tr key={item.productoId}>
                    <Td>{producto?.nombre ?? item.productoId}</Td>
                    <Td>{item._sum.cantidad ?? 0}</Td>
                    <Td>{formatMoney(item._sum.subtotal ?? 0)}</Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventario critico</CardTitle>
          <CardDescription>
            Productos cuyo stock actual esta en o por debajo del minimo.
          </CardDescription>
        </CardHeader>
        <Table>
          <thead>
            <tr>
              <Th>SKU</Th>
              <Th>Producto</Th>
              <Th>Categoria</Th>
              <Th>Stock</Th>
              <Th>Minimo</Th>
            </tr>
          </thead>
          <tbody>
            {stockCritico.map((producto) => (
              <tr key={producto.id}>
                <Td className="font-mono text-xs">{producto.sku}</Td>
                <Td>{producto.nombre}</Td>
                <Td>{producto.categoria}</Td>
                <Td>{producto.stockActual}</Td>
                <Td>{producto.stockMinimo}</Td>
              </tr>
            ))}
            {stockCritico.length === 0 ? (
              <tr>
                <Td colSpan={5}>No hay productos en stock critico.</Td>
              </tr>
            ) : null}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}

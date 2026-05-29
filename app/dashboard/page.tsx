import { AlertTriangle, Boxes, ClipboardList, DollarSign, Truck } from "lucide-react";
import { EstadoPedido } from "@prisma/client";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { formatMoney, statusLabel } from "@/lib/format";
import { Badge, statusTone } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await requireUser();

  const vendedor = session.rol === "VENDEDOR_EXTERNO"
    ? await db.vendedorExterno.findUnique({ where: { userId: session.id } })
    : null;

  const ownVendorFilter = vendedor ? { vendedorId: vendedor.id } : {};

  const [
    pedidosActivos,
    totalVentas,
    despachados,
    devoluciones,
    productosCriticos,
    ultimosPedidos,
    notificaciones
  ] = await Promise.all([
    db.pedido.count({
      where: {
        ...ownVendorFilter,
        estado: {
          in: [
            EstadoPedido.RECIBIDO,
            EstadoPedido.PEDIDO_ESPECIAL,
            EstadoPedido.CONFIRMADO,
            EstadoPedido.EN_PREPARACION,
            EstadoPedido.EMPACADO,
            EstadoPedido.DESPACHADO,
            EstadoPedido.EN_TRANSITO
          ]
        }
      }
    }),
    db.pedido.aggregate({
      _sum: { totalBruto: true },
      where: { ...ownVendorFilter, estado: { not: EstadoPedido.CANCELADO } }
    }),
    db.pedido.count({
      where: { ...ownVendorFilter, estado: EstadoPedido.ENTREGADO }
    }),
    db.pedido.count({
      where: { ...ownVendorFilter, estado: EstadoPedido.DEVUELTO }
    }),
    db.producto.findMany({
      select: { id: true, stockActual: true, stockMinimo: true }
    }),
    db.pedido.findMany({
      where: ownVendorFilter,
      include: {
        cliente: true,
        vendedor: true,
        lineas: { include: { producto: true } },
        ordenDespacho: true
      },
      orderBy: { creadoEn: "desc" },
      take: 8
    }),
    db.notificacion.findMany({
      orderBy: { creadaEn: "desc" },
      take: 5
    })
  ]);

  const stockCritico = productosCriticos.filter(
    (producto) => producto.stockActual <= producto.stockMinimo
  ).length;

  const metrics = [
    {
      label: "Pedidos activos",
      value: pedidosActivos,
      icon: <ClipboardList size={20} />,
      helper: "En flujo operativo"
    },
    {
      label: "Ventas registradas",
      value: formatMoney(totalVentas._sum.totalBruto ?? 0),
      icon: <DollarSign size={20} />,
      helper: "No incluye cancelados"
    },
    {
      label: "Entregados",
      value: despachados,
      icon: <Truck size={20} />,
      helper: "Listos para liquidacion"
    },
    {
      label: "Stock critico",
      value: stockCritico,
      icon: <AlertTriangle size={20} />,
      helper: "Productos bajo minimo"
    }
  ];

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-mint">
          Panel multirol
        </p>
        <h1 className="text-3xl font-semibold tracking-normal text-ink">
          Hola, {session.nombre}
        </h1>
        <p className="max-w-3xl text-slate-600">
          Este tablero resume pedidos, inventario, despacho y alertas para tomar
          decisiones operativas sin salir del flujo del MVP.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">{metric.label}</p>
                <p className="mt-2 text-3xl font-semibold text-ink">
                  {metric.value}
                </p>
                <p className="mt-2 text-sm text-slate-500">{metric.helper}</p>
              </div>
              <span className="rounded-md bg-emerald-50 p-2 text-emerald-700">
                {metric.icon}
              </span>
            </div>
          </Card>
        ))}
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Ultimos pedidos</CardTitle>
            <CardDescription>
              Vista trazable de cliente, producto, estado y guia.
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
              </tr>
            </thead>
            <tbody>
              {ultimosPedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <Td className="font-mono text-xs">
                    {pedido.id.slice(-8).toUpperCase()}
                  </Td>
                  <Td>{pedido.cliente.nombre}</Td>
                  <Td>
                    {pedido.lineas.map((linea) => linea.producto.nombre).join(", ")}
                  </Td>
                  <Td>{formatMoney(pedido.totalBruto)}</Td>
                  <Td>
                    <Badge tone={statusTone(pedido.estado)}>
                      {statusLabel(pedido.estado)}
                    </Badge>
                  </Td>
                  <Td>{pedido.ordenDespacho?.numeroGuia ?? pedido.guiaEstimada ?? "-"}</Td>
                </tr>
              ))}
              {ultimosPedidos.length === 0 ? (
                <tr>
                  <Td colSpan={6}>Aun no hay pedidos registrados.</Td>
                </tr>
              ) : null}
            </tbody>
          </Table>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Boxes size={18} /> Salud operativa
              </CardTitle>
              <CardDescription>
                Tasa de devolucion simple para el corte actual.
              </CardDescription>
            </CardHeader>
            <p className="text-4xl font-semibold text-ink">
              {despachados + devoluciones === 0
                ? "0%"
                : `${Math.round((devoluciones / (despachados + devoluciones)) * 100)}%`}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {devoluciones} devoluciones sobre {despachados + devoluciones} cierres.
            </p>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notificaciones mock</CardTitle>
              <CardDescription>
                Registro local de eventos que luego podran salir por email o WhatsApp.
              </CardDescription>
            </CardHeader>
            <div className="space-y-3">
              {notificaciones.map((item) => (
                <div key={item.id} className="rounded-md border border-line p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-ink">{item.asunto}</p>
                    <Badge tone={statusTone(item.estado)}>{item.canal}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{item.mensaje}</p>
                </div>
              ))}
              {notificaciones.length === 0 ? (
                <p className="text-sm text-slate-500">Sin notificaciones todavia.</p>
              ) : null}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

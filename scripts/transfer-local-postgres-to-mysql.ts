import { execFileSync } from "node:child_process";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type TableName =
  | "Usuario"
  | "Proveedor"
  | "Producto"
  | "VendedorExterno"
  | "Cliente"
  | "Pedido"
  | "LineaPedido"
  | "OrdenDespacho"
  | "Factura"
  | "MovimientoInventario"
  | "PedidoEspecial"
  | "Liquidacion"
  | "Notificacion";

function readPostgresTable<T>(table: TableName): T[] {
  const sql = `
    select coalesce(json_agg(row_to_json(t)), '[]'::json)
    from (select * from "${table}" order by 1) t;
  `;
  const output = execFileSync(
    "docker",
    ["exec", "fumc-postgres", "psql", "-U", "fumc", "-d", "fumc", "-tA", "-c", sql],
    { encoding: "utf8" }
  ).trim();

  return JSON.parse(output || "[]") as T[];
}

function asDate(value: string | null) {
  return value ? new Date(value) : null;
}

function mapDates<T extends Record<string, unknown>>(
  row: T,
  fields: Array<keyof T>
) {
  const mapped = { ...row };
  for (const field of fields) {
    mapped[field] = asDate(mapped[field] as string | null) as T[keyof T];
  }
  return mapped;
}

async function main() {
  const usuario = readPostgresTable<Record<string, unknown>>("Usuario").map((row) =>
    mapDates(row, ["creadoEn", "actualizadoEn"])
  );
  const proveedor = readPostgresTable<Record<string, unknown>>("Proveedor").map((row) =>
    mapDates(row, ["creadoEn", "actualizadoEn"])
  );
  const producto = readPostgresTable<Record<string, unknown>>("Producto").map((row) =>
    mapDates(row, ["creadoEn", "actualizadoEn"])
  );
  const vendedorExterno = readPostgresTable<Record<string, unknown>>("VendedorExterno").map(
    (row) => mapDates(row, ["creadoEn", "actualizadoEn"])
  );
  const cliente = readPostgresTable<Record<string, unknown>>("Cliente").map((row) =>
    mapDates(row, ["creadoEn", "actualizadoEn"])
  );
  const pedido = readPostgresTable<Record<string, unknown>>("Pedido").map((row) =>
    mapDates(row, ["creadoEn", "actualizadoEn"])
  );
  const lineaPedido = readPostgresTable<Record<string, unknown>>("LineaPedido");
  const ordenDespacho = readPostgresTable<Record<string, unknown>>("OrdenDespacho").map(
    (row) =>
      mapDates(row, ["fechaDespacho", "fechaEntrega", "creadoEn", "actualizadoEn"])
  );
  const factura = readPostgresTable<Record<string, unknown>>("Factura").map((row) =>
    mapDates(row, ["fechaEmision"])
  );
  const movimientoInventario = readPostgresTable<Record<string, unknown>>(
    "MovimientoInventario"
  ).map((row) => mapDates(row, ["fecha"]));
  const pedidoEspecial = readPostgresTable<Record<string, unknown>>("PedidoEspecial").map(
    (row) => mapDates(row, ["fechaEstimada", "creadoEn", "actualizadoEn"])
  );
  const liquidacion = readPostgresTable<Record<string, unknown>>("Liquidacion").map((row) =>
    mapDates(row, ["creadoEn", "actualizadoEn"])
  );
  const notificacion = readPostgresTable<Record<string, unknown>>("Notificacion").map((row) =>
    mapDates(row, ["creadaEn", "enviadaEn"])
  );

  await prisma.$transaction([
    prisma.notificacion.deleteMany(),
    prisma.liquidacion.deleteMany(),
    prisma.pedidoEspecial.deleteMany(),
    prisma.movimientoInventario.deleteMany(),
    prisma.factura.deleteMany(),
    prisma.ordenDespacho.deleteMany(),
    prisma.lineaPedido.deleteMany(),
    prisma.pedido.deleteMany(),
    prisma.cliente.deleteMany(),
    prisma.vendedorExterno.deleteMany(),
    prisma.producto.deleteMany(),
    prisma.proveedor.deleteMany(),
    prisma.usuario.deleteMany()
  ]);

  if (usuario.length) {
    await prisma.usuario.createMany({ data: usuario as Prisma.UsuarioCreateManyInput[] });
  }
  if (proveedor.length) {
    await prisma.proveedor.createMany({
      data: proveedor as Prisma.ProveedorCreateManyInput[]
    });
  }
  if (producto.length) {
    await prisma.producto.createMany({ data: producto as Prisma.ProductoCreateManyInput[] });
  }
  if (vendedorExterno.length) {
    await prisma.vendedorExterno.createMany({
      data: vendedorExterno as Prisma.VendedorExternoCreateManyInput[]
    });
  }
  if (cliente.length) {
    await prisma.cliente.createMany({ data: cliente as Prisma.ClienteCreateManyInput[] });
  }
  if (pedido.length) {
    await prisma.pedido.createMany({ data: pedido as Prisma.PedidoCreateManyInput[] });
  }
  if (lineaPedido.length) {
    await prisma.lineaPedido.createMany({
      data: lineaPedido as Prisma.LineaPedidoCreateManyInput[]
    });
  }
  if (ordenDespacho.length) {
    await prisma.ordenDespacho.createMany({
      data: ordenDespacho as Prisma.OrdenDespachoCreateManyInput[]
    });
  }
  if (factura.length) {
    await prisma.factura.createMany({ data: factura as Prisma.FacturaCreateManyInput[] });
  }
  if (movimientoInventario.length) {
    await prisma.movimientoInventario.createMany({
      data: movimientoInventario as Prisma.MovimientoInventarioCreateManyInput[]
    });
  }
  if (pedidoEspecial.length) {
    await prisma.pedidoEspecial.createMany({
      data: pedidoEspecial as Prisma.PedidoEspecialCreateManyInput[]
    });
  }
  if (liquidacion.length) {
    await prisma.liquidacion.createMany({
      data: liquidacion as Prisma.LiquidacionCreateManyInput[]
    });
  }
  if (notificacion.length) {
    await prisma.notificacion.createMany({
      data: notificacion as Prisma.NotificacionCreateManyInput[]
    });
  }

  const counts = {
    Usuario: await prisma.usuario.count(),
    Proveedor: await prisma.proveedor.count(),
    Producto: await prisma.producto.count(),
    VendedorExterno: await prisma.vendedorExterno.count(),
    Cliente: await prisma.cliente.count(),
    Pedido: await prisma.pedido.count(),
    LineaPedido: await prisma.lineaPedido.count(),
    OrdenDespacho: await prisma.ordenDespacho.count(),
    Factura: await prisma.factura.count(),
    MovimientoInventario: await prisma.movimientoInventario.count(),
    PedidoEspecial: await prisma.pedidoEspecial.count(),
    Liquidacion: await prisma.liquidacion.count(),
    Notificacion: await prisma.notificacion.count()
  };

  console.table(counts);
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

import { Plus, RotateCcw, Warehouse } from "lucide-react";
import { RolUsuario } from "@prisma/client";
import { createProductAction, createProviderAction, adjustStockAction } from "@/app/actions";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { formatMoney } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Label, Select, Textarea } from "@/components/ui/field";
import { Table, Td, Th } from "@/components/ui/table";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ProductosPage({
  searchParams
}: {
  searchParams?: SearchParams;
}) {
  const session = await requireRole([
    RolUsuario.ADMINISTRADOR,
    RolUsuario.OPERADOR_BODEGA
  ]);
  const params = searchParams ? await searchParams : {};
  const ok = typeof params.ok === "string" ? params.ok : null;
  const error = typeof params.error === "string" ? params.error : null;

  const [productos, proveedores, movimientos] = await Promise.all([
    db.producto.findMany({
      include: { proveedor: true },
      orderBy: [{ stockActual: "asc" }, { nombre: "asc" }]
    }),
    db.proveedor.findMany({ orderBy: { razonSocial: "asc" } }),
    db.movimientoInventario.findMany({
      include: { producto: true, usuario: true },
      orderBy: { fecha: "desc" },
      take: 8
    })
  ]);

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-mint">
          Administracion
        </p>
        <h1 className="text-3xl font-semibold tracking-normal text-ink">
          Inventario y proveedores
        </h1>
        <p className="max-w-3xl text-slate-600">
          Controla productos, proveedores, stock minimo y movimientos. El stock
          nunca puede quedar negativo.
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

      {session.rol === RolUsuario.ADMINISTRADOR ? (
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus size={18} /> Crear producto
            </CardTitle>
            <CardDescription>
              Campos alineados al SRS: SKU, precios, stock y proveedor.
            </CardDescription>
          </CardHeader>
          <form action={createProductAction} className="grid gap-4 md:grid-cols-2">
            <Field>
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" name="sku" required placeholder="FUMC-CAT-001" />
            </Field>
            <Field>
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" required />
            </Field>
            <Field className="md:col-span-2">
              <Label htmlFor="descripcion">Descripcion</Label>
              <Textarea id="descripcion" name="descripcion" required />
            </Field>
            <Field>
              <Label htmlFor="marca">Marca</Label>
              <Input id="marca" name="marca" required />
            </Field>
            <Field>
              <Label htmlFor="categoria">Categoria</Label>
              <Input id="categoria" name="categoria" required />
            </Field>
            <Field>
              <Label htmlFor="precioCosto">Precio costo</Label>
              <Input id="precioCosto" name="precioCosto" type="number" min="1" required />
            </Field>
            <Field>
              <Label htmlFor="precioBase">Precio base vendedor</Label>
              <Input id="precioBase" name="precioBase" type="number" min="1" required />
            </Field>
            <Field>
              <Label htmlFor="stockActual">Stock actual</Label>
              <Input id="stockActual" name="stockActual" type="number" min="0" required />
            </Field>
            <Field>
              <Label htmlFor="stockMinimo">Stock minimo</Label>
              <Input id="stockMinimo" name="stockMinimo" type="number" min="0" required />
            </Field>
            <Field>
              <Label htmlFor="tiempoDespacho">Tiempo despacho</Label>
              <Input id="tiempoDespacho" name="tiempoDespacho" defaultValue="24-48 horas" required />
            </Field>
            <Field>
              <Label htmlFor="proveedorId">Proveedor</Label>
              <Select id="proveedorId" name="proveedorId" required>
                <option value="">Seleccionar</option>
                {proveedores.map((proveedor) => (
                  <option key={proveedor.id} value={proveedor.id}>
                    {proveedor.razonSocial}
                  </option>
                ))}
              </Select>
            </Field>
            <Field className="md:col-span-2">
              <Label htmlFor="imagenUrl">Imagen URL</Label>
              <Input id="imagenUrl" name="imagenUrl" type="url" placeholder="https://..." />
            </Field>
            <div className="md:col-span-2">
              <Button type="submit">Crear producto</Button>
            </div>
          </form>
          </Card>

          <Card>
          <CardHeader>
            <CardTitle>Crear proveedor</CardTitle>
            <CardDescription>
              Base para relacionar productos, compras y pedidos especiales.
            </CardDescription>
          </CardHeader>
          <form action={createProviderAction} className="space-y-4">
            <Field>
              <Label htmlFor="razonSocial">Razon social</Label>
              <Input id="razonSocial" name="razonSocial" required />
            </Field>
            <Field>
              <Label htmlFor="nit">NIT</Label>
              <Input id="nit" name="nit" required />
            </Field>
            <Field>
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input id="ciudad" name="ciudad" required />
            </Field>
            <Field>
              <Label htmlFor="contacto">Contacto</Label>
              <Input id="contacto" name="contacto" required />
            </Field>
            <Field>
              <Label htmlFor="terminosPago">Terminos de pago</Label>
              <Input id="terminosPago" name="terminosPago" required />
            </Field>
            <Field>
              <Label htmlFor="categorias">Categorias</Label>
              <Input id="categorias" name="categorias" placeholder="Hogar, Tecnologia" required />
            </Field>
            <Button type="submit">Crear proveedor</Button>
          </form>
          </Card>
        </div>
      ) : (
        <Card>
          <CardTitle>Modo operador</CardTitle>
          <CardDescription className="mt-2">
            Puedes registrar movimientos de stock. La creacion de productos y
            proveedores queda reservada al administrador.
          </CardDescription>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Warehouse size={18} /> Productos registrados
          </CardTitle>
          <CardDescription>
            Los ajustes positivos o negativos quedan auditados como movimientos.
          </CardDescription>
        </CardHeader>
        <Table>
          <thead>
            <tr>
              <Th>SKU</Th>
              <Th>Producto</Th>
              <Th>Proveedor</Th>
              <Th>Precio base</Th>
              <Th>Stock</Th>
              <Th>Ajuste</Th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => {
              const low = producto.stockActual <= producto.stockMinimo;
              return (
                <tr key={producto.id}>
                  <Td className="font-mono text-xs">{producto.sku}</Td>
                  <Td>
                    <p className="font-semibold text-ink">{producto.nombre}</p>
                    <p className="text-xs text-slate-500">{producto.categoria} / {producto.marca}</p>
                  </Td>
                  <Td>{producto.proveedor.razonSocial}</Td>
                  <Td>{formatMoney(producto.precioBase)}</Td>
                  <Td>
                    <Badge tone={producto.stockActual === 0 ? "bad" : low ? "warn" : "good"}>
                      {producto.stockActual} / min {producto.stockMinimo}
                    </Badge>
                  </Td>
                  <Td>
                    <form action={adjustStockAction} className="flex min-w-[360px] items-end gap-2">
                      <input type="hidden" name="productoId" value={producto.id} />
                      <Field className="w-28">
                        <Label className="sr-only" htmlFor={`tipo-${producto.id}`}>Tipo</Label>
                        <Select id={`tipo-${producto.id}`} name="tipo" defaultValue="ENTRADA">
                          <option value="ENTRADA">Entrada</option>
                          <option value="DEVOLUCION">Devolucion</option>
                          <option value="AJUSTE">Ajuste</option>
                        </Select>
                      </Field>
                      <Field className="w-24">
                        <Label className="sr-only" htmlFor={`cantidad-${producto.id}`}>Cantidad</Label>
                        <Input id={`cantidad-${producto.id}`} name="cantidad" type="number" defaultValue="1" required />
                      </Field>
                      <Field className="w-40">
                        <Label className="sr-only" htmlFor={`referencia-${producto.id}`}>Referencia</Label>
                        <Input id={`referencia-${producto.id}`} name="referencia" defaultValue="Ajuste manual" required />
                      </Field>
                      <Button type="submit" variant="secondary" size="sm">
                        <RotateCcw size={14} /> Guardar
                      </Button>
                    </form>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ultimos movimientos</CardTitle>
          <CardDescription>
            Trazabilidad minima exigida para inventario y devoluciones.
          </CardDescription>
        </CardHeader>
        <Table>
          <thead>
            <tr>
              <Th>Fecha</Th>
              <Th>Producto</Th>
              <Th>Tipo</Th>
              <Th>Cantidad</Th>
              <Th>Referencia</Th>
              <Th>Usuario</Th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map((movimiento) => (
              <tr key={movimiento.id}>
                <Td>{movimiento.fecha.toLocaleDateString("es-CO")}</Td>
                <Td>{movimiento.producto.nombre}</Td>
                <Td>{movimiento.tipo}</Td>
                <Td>{movimiento.cantidad}</Td>
                <Td>{movimiento.referencia}</Td>
                <Td>{movimiento.usuario?.nombre ?? "Sistema"}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}

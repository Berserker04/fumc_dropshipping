import { Search, SlidersHorizontal } from "lucide-react";
import { db } from "@/lib/db";
import { formatMoney } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Label, Select } from "@/components/ui/field";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function CatalogoPage({
  searchParams
}: {
  searchParams?: SearchParams;
}) {
  const params = searchParams ? await searchParams : {};
  const q = getParam(params, "q") ?? "";
  const categoria = getParam(params, "categoria") ?? "";
  const marca = getParam(params, "marca") ?? "";
  const disponibilidad = getParam(params, "disponibilidad") ?? "";

  const [productos, categorias, marcas] = await Promise.all([
    db.producto.findMany({
      where: {
        activo: true,
        ...(q
          ? {
              OR: [
                { nombre: { contains: q } },
                { sku: { contains: q } },
                { descripcion: { contains: q } }
              ]
            }
          : {}),
        ...(categoria ? { categoria } : {}),
        ...(marca ? { marca } : {}),
        ...(disponibilidad === "stock" ? { stockActual: { gt: 0 } } : {}),
        ...(disponibilidad === "agotado" ? { stockActual: 0 } : {})
      },
      include: { proveedor: true },
      orderBy: [{ stockActual: "desc" }, { nombre: "asc" }]
    }),
    db.producto.findMany({
      where: { activo: true },
      distinct: ["categoria"],
      select: { categoria: true },
      orderBy: { categoria: "asc" }
    }),
    db.producto.findMany({
      where: { activo: true },
      distinct: ["marca"],
      select: { marca: true },
      orderBy: { marca: "asc" }
    })
  ]);

  return (
    <div className="space-y-6">
      <section className="grid gap-5 md:grid-cols-[1.2fr_0.8fr] md:items-end">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-mint">
            Catalogo disponible
          </p>
          <h1 className="text-3xl font-semibold tracking-normal text-ink">
            Productos disponibles para venta y despacho
          </h1>
          <p className="max-w-3xl text-base leading-7 text-slate-600">
            Consulta disponibilidad, margen sugerido y tiempo estimado de
            despacho antes de crear pedidos para clientes finales.
          </p>
        </div>
        <Card className="bg-ink text-white">
          <p className="text-sm text-slate-300">Productos activos</p>
          <p className="mt-1 text-4xl font-semibold">{productos.length}</p>
          <p className="mt-3 text-sm text-slate-300">
            Filtra por disponibilidad, marca, categoria o busqueda.
          </p>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal size={18} /> Filtros
          </CardTitle>
          <CardDescription>
            Encuentra productos por codigo, nombre, categoria, marca o disponibilidad.
          </CardDescription>
        </CardHeader>
        <form className="grid gap-4 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto]" method="get">
          <Field>
            <Label htmlFor="q">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <Input
                className="pl-10"
                id="q"
                name="q"
                defaultValue={q}
                placeholder="Codigo, nombre o descripcion"
              />
            </div>
          </Field>
          <Field>
            <Label htmlFor="categoria">Categoria</Label>
            <Select id="categoria" name="categoria" defaultValue={categoria}>
              <option value="">Todas</option>
              {categorias.map((item) => (
                <option key={item.categoria} value={item.categoria}>
                  {item.categoria}
                </option>
              ))}
            </Select>
          </Field>
          <Field>
            <Label htmlFor="marca">Marca</Label>
            <Select id="marca" name="marca" defaultValue={marca}>
              <option value="">Todas</option>
              {marcas.map((item) => (
                <option key={item.marca} value={item.marca}>
                  {item.marca}
                </option>
              ))}
            </Select>
          </Field>
          <Field>
            <Label htmlFor="disponibilidad">Disponibilidad</Label>
            <Select
              id="disponibilidad"
              name="disponibilidad"
              defaultValue={disponibilidad}
            >
              <option value="">Todas</option>
              <option value="stock">Con stock</option>
              <option value="agotado">Agotado</option>
            </Select>
          </Field>
          <div className="flex items-end">
            <Button type="submit" className="w-full">
              Filtrar
            </Button>
          </div>
        </form>
      </Card>

      {productos.length === 0 ? (
        <Card>
          <CardTitle>No hay productos con estos filtros</CardTitle>
          <CardDescription className="mt-2">
            Ajusta la busqueda o agrega productos desde inventario.
          </CardDescription>
        </Card>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {productos.map((producto) => {
            const imagenes = Array.isArray(producto.imagenes)
              ? producto.imagenes
              : [];
            const image = typeof imagenes[0] === "string" ? imagenes[0] : "";
            const costo = Number(producto.precioCosto.toString());
            const precio = Number(producto.precioBase.toString());
            const margen = precio - costo;
            const stockTone =
              producto.stockActual === 0
                ? "bad"
                : producto.stockActual <= producto.stockMinimo
                  ? "warn"
                  : "good";

            return (
              <article
                key={producto.id}
                className="overflow-hidden rounded-lg border border-line bg-white shadow-panel"
              >
                <div className="aspect-[16/9] bg-slate-100">
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image}
                      alt={producto.nombre}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-emerald-50 text-sm font-semibold text-slate-500">
                      {producto.sku}
                    </div>
                  )}
                </div>
                <div className="space-y-4 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {producto.sku}
                      </p>
                      <h2 className="mt-1 text-lg font-semibold tracking-normal text-ink">
                        {producto.nombre}
                      </h2>
                    </div>
                    <Badge tone={stockTone}>
                      {producto.stockActual > 0
                        ? `${producto.stockActual} unidades`
                        : "Agotado"}
                    </Badge>
                  </div>
                  <p className="line-clamp-2 text-sm leading-6 text-slate-600">
                    {producto.descripcion}
                  </p>
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-slate-500">Precio base</dt>
                      <dd className="font-semibold text-ink">
                        {formatMoney(producto.precioBase)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Margen sugerido</dt>
                      <dd className="font-semibold text-emerald-700">
                        {formatMoney(margen)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Marca</dt>
                      <dd className="font-medium text-ink">{producto.marca}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Despacho</dt>
                      <dd className="font-medium text-ink">
                        {producto.tiempoDespacho}
                      </dd>
                    </div>
                  </dl>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}

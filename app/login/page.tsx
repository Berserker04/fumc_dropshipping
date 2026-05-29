import Link from "next/link";
import { loginAction } from "@/app/actions";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Label } from "@/components/ui/field";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function LoginPage({
  searchParams
}: {
  searchParams?: SearchParams;
}) {
  const params = searchParams ? await searchParams : {};
  const error = typeof params.error === "string" ? params.error : null;

  return (
    <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-[1fr_420px] md:items-start">
      <section className="space-y-5">
        <div className="space-y-3">
          <h1 className="max-w-3xl text-3xl font-semibold tracking-normal text-ink md:text-4xl">
            Gestion operativa de inventario, pedidos y despacho
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600">
            Accede para gestionar inventario, pedidos, despachos,
            liquidaciones y reportes.
          </p>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Ingresar</CardTitle>
        </CardHeader>
        {error ? (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}
        <form action={loginAction} className="space-y-4">
          <Field>
            <Label htmlFor="email">Correo</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </Field>
          <Field>
            <Label htmlFor="password">Clave</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </Field>
          <Button className="w-full" type="submit">
            Entrar al sistema
          </Button>
        </form>
        <p className="mt-4 border-t border-line pt-4 text-sm text-slate-600">
          No tienes cuenta?{" "}
          <Link className="font-semibold text-ocean hover:text-ink" href="/registro">
            Registrate aqui
          </Link>
        </p>
      </Card>
    </div>
  );
}

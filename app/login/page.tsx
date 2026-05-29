import { ShieldCheck } from "lucide-react";
import { loginAction } from "@/app/actions";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">
          <ShieldCheck size={16} /> Acceso multirol MVP
        </div>
        <div className="space-y-3">
          <h1 className="max-w-3xl text-3xl font-semibold tracking-normal text-ink md:text-4xl">
            Gestion operativa de inventario, pedidos y despacho
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600">
            Ingresa con un usuario demo para operar el flujo completo: catalogo,
            stock, pedidos, bodega, liquidaciones y reportes.
          </p>
        </div>
        <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
          {[
            ["Administrador", "admin@fumc.edu.co", "Admin123!"],
            ["Bodega", "bodega@fumc.edu.co", "Bodega123!"],
            ["Vendedor", "vendedor@fumc.edu.co", "Vendedor123!"],
            ["Cliente", "cliente@fumc.edu.co", "Cliente123!"]
          ].map(([role, email, pass]) => (
            <div key={role} className="rounded-lg border border-line bg-white p-4">
              <p className="font-semibold text-ink">{role}</p>
              <p>{email}</p>
              <p className="font-mono text-xs text-slate-500">{pass}</p>
            </div>
          ))}
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Ingresar</CardTitle>
          <CardDescription>
            Las sesiones usan JWT en cookie httpOnly y password hash con bcrypt.
          </CardDescription>
        </CardHeader>
        {error ? (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}
        <form action={loginAction} className="space-y-4">
          <Field>
            <Label htmlFor="email">Correo</Label>
            <Input id="email" name="email" type="email" required />
          </Field>
          <Field>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </Field>
          <Button className="w-full" type="submit">
            Entrar al sistema
          </Button>
        </form>
      </Card>
    </div>
  );
}

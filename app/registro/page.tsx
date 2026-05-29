import Link from "next/link";
import { UserPlus } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "./register-form";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function RegistroPage({
  searchParams
}: {
  searchParams?: SearchParams;
}) {
  const params = searchParams ? await searchParams : {};
  const error = typeof params.error === "string" ? params.error : null;

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-mint">
          <UserPlus size={16} />
          Registro multirol
        </div>
        <div className="space-y-3">
          <h1 className="max-w-3xl text-3xl font-semibold tracking-normal text-ink md:text-4xl">
            Crea una cuenta para operar o seguir pedidos
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600">
            El acceso queda listo al terminar el registro y el sistema abre el
            portal correspondiente al rol elegido.
          </p>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Crear cuenta</CardTitle>
          <CardDescription>
            Usa el mismo correo del pedido para consultar su seguimiento.
          </CardDescription>
        </CardHeader>
        {error ? (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}
        <RegisterForm />
        <p className="mt-4 border-t border-line pt-4 text-sm text-slate-600">
          Ya tienes cuenta?{" "}
          <Link className="font-semibold text-ocean hover:text-ink" href="/login">
            Ingresa aqui
          </Link>
        </p>
      </Card>
    </div>
  );
}

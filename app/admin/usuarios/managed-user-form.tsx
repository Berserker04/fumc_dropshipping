"use client";

import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { Building2, UserPlus } from "lucide-react";
import { createManagedUserAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Field, Input, Label, Select } from "@/components/ui/field";

type ManagedRole = "VENDEDOR_EXTERNO" | "OPERADOR_BODEGA";

const roleOptions: { value: ManagedRole; label: string; description: string }[] = [
  {
    value: "VENDEDOR_EXTERNO",
    label: "Vendedor externo",
    description: "Acceso a catalogo, pedidos y liquidaciones."
  },
  {
    value: "OPERADOR_BODEGA",
    label: "Bodega",
    description: "Acceso operativo a inventario y despachos."
  }
];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" disabled={pending} type="submit">
      <UserPlus size={16} />
      {pending ? "Creando usuario..." : "Crear usuario"}
    </Button>
  );
}

export function ManagedUserForm() {
  const [role, setRole] = useState<ManagedRole>("VENDEDOR_EXTERNO");
  const selectedRole = useMemo(
    () => roleOptions.find((option) => option.value === role) ?? roleOptions[0],
    [role]
  );
  const needsVendorFields = role === "VENDEDOR_EXTERNO";

  return (
    <form action={createManagedUserAction} className="space-y-5">
      <Field>
        <Label htmlFor="rol">Rol operativo</Label>
        <Select
          id="rol"
          name="rol"
          value={role}
          onChange={(event) => setRole(event.target.value as ManagedRole)}
        >
          {roleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <p className="text-xs text-slate-500">{selectedRole.description}</p>
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <Label htmlFor="nombre">Nombre</Label>
          <Input id="nombre" name="nombre" autoComplete="name" required />
        </Field>
        <Field>
          <Label htmlFor="email">Correo</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </Field>
        <Field>
          <Label htmlFor="password">Clave inicial</Label>
          <Input
            id="password"
            name="password"
            type="password"
            minLength={6}
            autoComplete="new-password"
            required
          />
        </Field>
        <Field>
          <Label htmlFor="confirmPassword">Confirmar clave</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            minLength={6}
            autoComplete="new-password"
            required
          />
        </Field>
      </div>

      {needsVendorFields ? (
        <div className="rounded-md border border-line bg-slate-50 p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink">
            <Building2 size={16} />
            Datos del vendedor
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <Label htmlFor="nombreEmpresa">Empresa</Label>
              <Input id="nombreEmpresa" name="nombreEmpresa" required />
            </Field>
            <Field>
              <Label htmlFor="telefono">Telefono</Label>
              <Input id="telefono" name="telefono" autoComplete="tel" required />
            </Field>
            <Field>
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input id="ciudad" name="ciudad" autoComplete="address-level2" required />
            </Field>
            <Field>
              <Label htmlFor="direccion">Direccion</Label>
              <Input id="direccion" name="direccion" autoComplete="street-address" required />
            </Field>
            <Field className="md:col-span-2">
              <Label htmlFor="datosBancarios">Datos bancarios</Label>
              <Input id="datosBancarios" name="datosBancarios" required />
            </Field>
          </div>
        </div>
      ) : null}

      <SubmitButton />
    </form>
  );
}

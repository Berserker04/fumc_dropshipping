"use client";

import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { UserPlus } from "lucide-react";
import { registerAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Field, Input, Label, Select } from "@/components/ui/field";

type RegisterRole = "ADMINISTRADOR" | "CLIENTE_FINAL";

const roleOptions: { value: RegisterRole; label: string; description: string }[] = [
  {
    value: "CLIENTE_FINAL",
    label: "Cliente final",
    description: "Seguimiento de pedidos y guias."
  },
  {
    value: "ADMINISTRADOR",
    label: "Administrador",
    description: "Control completo y reportes."
  }
];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" disabled={pending} type="submit">
      <UserPlus size={16} />
      {pending ? "Creando cuenta..." : "Crear cuenta"}
    </Button>
  );
}

export function RegisterForm() {
  const [role, setRole] = useState<RegisterRole>("CLIENTE_FINAL");
  const selectedRole = useMemo(
    () => roleOptions.find((option) => option.value === role) ?? roleOptions[0],
    [role]
  );

  const needsClientFields = role === "CLIENTE_FINAL";

  return (
    <form action={registerAction} className="space-y-5">
      <Field>
        <Label htmlFor="rol">Tipo de cuenta</Label>
        <Select
          id="rol"
          name="rol"
          value={role}
          onChange={(event) => setRole(event.target.value as RegisterRole)}
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
          <Label htmlFor="password">Clave</Label>
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

      {needsClientFields ? (
        <div className="rounded-md border border-line bg-slate-50 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <Label htmlFor="telefono">Telefono</Label>
              <Input id="telefono" name="telefono" autoComplete="tel" required />
            </Field>
            <Field>
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input id="ciudad" name="ciudad" autoComplete="address-level2" required />
            </Field>
            <Field className="md:col-span-2">
              <Label htmlFor="direccion">Direccion</Label>
              <Input id="direccion" name="direccion" autoComplete="street-address" required />
            </Field>
          </div>
        </div>
      ) : null}

      <SubmitButton />
    </form>
  );
}

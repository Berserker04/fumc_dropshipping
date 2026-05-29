import { describe, expect, it } from "vitest";
import { applyStockMutation, hasAvailableStock, isLowStock } from "@/lib/domain/inventory";
import { calculateLiquidation } from "@/lib/domain/liquidation";
import { canTransitionPedido } from "@/lib/domain/order-state";
import { hasPermission } from "@/lib/domain/permissions";
import { adminUserSchema, registerSchema } from "@/lib/domain/schemas";

describe("inventory domain", () => {
  it("prevents negative stock", () => {
    expect(() => applyStockMutation(2, -3)).toThrow("stock no puede");
  });

  it("detects low stock and availability", () => {
    expect(isLowStock(4, 6)).toBe(true);
    expect(hasAvailableStock(4, 4)).toBe(true);
    expect(hasAvailableStock(4, 5)).toBe(false);
  });
});

describe("liquidation domain", () => {
  it("subtracts base cost and logistics from gross sale", () => {
    expect(
      calculateLiquidation({
        totalVenta: 200000,
        costoBase: 110000,
        costoLogistico: 15000
      }).ganancia
    ).toBe(75000);
  });
});

describe("pedido state machine", () => {
  it("allows the documented dispatch flow", () => {
    expect(canTransitionPedido("CONFIRMADO", "EN_PREPARACION")).toBe(true);
    expect(canTransitionPedido("EN_PREPARACION", "EMPACADO")).toBe(true);
    expect(canTransitionPedido("EMPACADO", "DESPACHADO")).toBe(true);
    expect(canTransitionPedido("DESPACHADO", "EN_TRANSITO")).toBe(true);
    expect(canTransitionPedido("EN_TRANSITO", "ENTREGADO")).toBe(true);
  });

  it("blocks invalid jumps", () => {
    expect(canTransitionPedido("CONFIRMADO", "ENTREGADO")).toBe(false);
    expect(canTransitionPedido("ENTREGADO", "CANCELADO")).toBe(false);
  });
});

describe("permissions", () => {
  it("keeps stock management away from sellers", () => {
    expect(hasPermission("VENDEDOR_EXTERNO", "stock:manage")).toBe(false);
    expect(hasPermission("OPERADOR_BODEGA", "stock:manage")).toBe(true);
  });
});

describe("register schema", () => {
  const baseUser = {
    nombre: "Carlos Perez",
    email: "carlos@gmail.com",
    password: "Cliente123!",
    confirmPassword: "Cliente123!"
  };

  it("rejects mismatched passwords", () => {
    expect(
      registerSchema.safeParse({
        ...baseUser,
        confirmPassword: "Otra123!",
        rol: "CLIENTE_FINAL",
        telefono: "3001234567",
        ciudad: "Bogota",
        direccion: "Calle 123"
      }).success
    ).toBe(false);
  });

  it("rejects operational roles in public registration", () => {
    expect(
      registerSchema.safeParse({
        ...baseUser,
        rol: "VENDEDOR_EXTERNO",
        nombreEmpresa: "Carlos Store",
        telefono: "3001234567",
        ciudad: "Bogota",
        direccion: "Calle 123",
        datosBancarios: "Bancolombia ahorro 0001"
      }).success
    ).toBe(false);
    expect(
      registerSchema.safeParse({
        ...baseUser,
        rol: "OPERADOR_BODEGA"
      }).success
    ).toBe(false);
  });

  it("requires client contact fields", () => {
    expect(
      registerSchema.safeParse({
        ...baseUser,
        rol: "CLIENTE_FINAL"
      }).success
    ).toBe(false);
  });

  it("accepts a valid client", () => {
    expect(
      registerSchema.safeParse({
        ...baseUser,
        rol: "CLIENTE_FINAL",
        telefono: "3001234567",
        ciudad: "Bogota",
        direccion: "Calle 123"
      }).success
    ).toBe(true);
  });

  it("accepts public admin with base fields", () => {
    expect(registerSchema.safeParse({ ...baseUser, rol: "ADMINISTRADOR" }).success).toBe(
      true
    );
  });
});

describe("admin user schema", () => {
  const baseUser = {
    nombre: "Operador Demo",
    email: "operador@gmail.com",
    password: "Operador123!",
    confirmPassword: "Operador123!"
  };

  it("rejects mismatched passwords", () => {
    expect(
      adminUserSchema.safeParse({
        ...baseUser,
        confirmPassword: "Otra123!",
        rol: "OPERADOR_BODEGA"
      }).success
    ).toBe(false);
  });

  it("requires seller profile fields", () => {
    expect(
      adminUserSchema.safeParse({
        ...baseUser,
        rol: "VENDEDOR_EXTERNO",
        telefono: "3001234567",
        ciudad: "Bogota",
        direccion: "Calle 123"
      }).success
    ).toBe(false);
  });

  it("accepts a valid seller", () => {
    expect(
      adminUserSchema.safeParse({
        ...baseUser,
        rol: "VENDEDOR_EXTERNO",
        nombreEmpresa: "Carlos Store",
        telefono: "3001234567",
        ciudad: "Bogota",
        direccion: "Calle 123",
        datosBancarios: "Bancolombia ahorro 0001"
      }).success
    ).toBe(true);
  });

  it("accepts warehouse with base fields", () => {
    expect(
      adminUserSchema.safeParse({ ...baseUser, rol: "OPERADOR_BODEGA" }).success
    ).toBe(true);
  });

  it("rejects public roles in admin-managed creation", () => {
    expect(
      adminUserSchema.safeParse({ ...baseUser, rol: "ADMINISTRADOR" }).success
    ).toBe(false);
    expect(
      adminUserSchema.safeParse({
        ...baseUser,
        rol: "CLIENTE_FINAL",
        telefono: "3001234567",
        ciudad: "Bogota",
        direccion: "Calle 123"
      }).success
    ).toBe(false);
  });
});

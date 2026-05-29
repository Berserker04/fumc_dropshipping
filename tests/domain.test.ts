import { describe, expect, it } from "vitest";
import { applyStockMutation, hasAvailableStock, isLowStock } from "@/lib/domain/inventory";
import { calculateLiquidation } from "@/lib/domain/liquidation";
import { canTransitionPedido } from "@/lib/domain/order-state";
import { hasPermission } from "@/lib/domain/permissions";

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

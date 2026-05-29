export function applyStockMutation(currentStock: number, delta: number) {
  const nextStock = currentStock + delta;

  if (!Number.isInteger(currentStock) || !Number.isInteger(delta)) {
    throw new Error("El stock y el movimiento deben ser numeros enteros.");
  }

  if (nextStock < 0) {
    throw new Error("El stock no puede quedar negativo.");
  }

  return nextStock;
}

export function isLowStock(stockActual: number, stockMinimo: number) {
  return stockActual <= stockMinimo;
}

export function hasAvailableStock(stockActual: number, requested: number) {
  return stockActual >= requested && requested > 0;
}

export type LiquidationInput = {
  totalVenta: number;
  costoBase: number;
  costoLogistico: number;
};

export function calculateLiquidation(input: LiquidationInput) {
  const ganancia = input.totalVenta - input.costoBase - input.costoLogistico;

  return {
    totalVenta: roundCurrency(input.totalVenta),
    costoBase: roundCurrency(input.costoBase),
    costoLogistico: roundCurrency(input.costoLogistico),
    ganancia: roundCurrency(ganancia)
  };
}

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

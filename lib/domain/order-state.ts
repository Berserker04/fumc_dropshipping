export const pedidoStates = [
  "RECIBIDO",
  "PEDIDO_ESPECIAL",
  "CONFIRMADO",
  "EN_PREPARACION",
  "EMPACADO",
  "DESPACHADO",
  "EN_TRANSITO",
  "ENTREGADO",
  "DEVUELTO",
  "CANCELADO"
] as const;

export type PedidoState = (typeof pedidoStates)[number];

const transitions: Record<PedidoState, PedidoState[]> = {
  RECIBIDO: ["CONFIRMADO", "PEDIDO_ESPECIAL", "CANCELADO"],
  PEDIDO_ESPECIAL: ["CONFIRMADO", "CANCELADO"],
  CONFIRMADO: ["EN_PREPARACION", "CANCELADO"],
  EN_PREPARACION: ["EMPACADO"],
  EMPACADO: ["DESPACHADO"],
  DESPACHADO: ["EN_TRANSITO"],
  EN_TRANSITO: ["ENTREGADO", "DEVUELTO"],
  ENTREGADO: [],
  DEVUELTO: ["EN_PREPARACION"],
  CANCELADO: []
};

export function canTransitionPedido(from: PedidoState, to: PedidoState) {
  return transitions[from]?.includes(to) ?? false;
}

export function nextPedidoStates(from: PedidoState) {
  return transitions[from] ?? [];
}

export function toDispatchState(state: PedidoState) {
  if (state === "EN_PREPARACION") return "EN_PREPARACION";
  if (state === "EMPACADO") return "EMPACADO";
  if (state === "DESPACHADO") return "DESPACHADO";
  if (state === "EN_TRANSITO") return "EN_TRANSITO";
  if (state === "ENTREGADO") return "ENTREGADO";
  if (state === "DEVUELTO") return "DEVUELTO";
  return "PENDIENTE";
}

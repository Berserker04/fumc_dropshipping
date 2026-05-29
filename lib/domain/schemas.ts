import { z } from "zod";
import { pedidoStates } from "@/lib/domain/order-state";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const providerSchema = z.object({
  razonSocial: z.string().min(3),
  nit: z.string().min(5),
  ciudad: z.string().min(2),
  contacto: z.string().min(3),
  terminosPago: z.string().min(3),
  categorias: z.string().min(3)
});

export const productSchema = z.object({
  sku: z.string().min(3),
  nombre: z.string().min(3),
  descripcion: z.string().min(8),
  marca: z.string().min(2),
  categoria: z.string().min(2),
  precioCosto: z.coerce.number().positive(),
  precioBase: z.coerce.number().positive(),
  stockActual: z.coerce.number().int().nonnegative(),
  stockMinimo: z.coerce.number().int().nonnegative(),
  tiempoDespacho: z.string().min(2),
  imagenUrl: z.string().url().optional().or(z.literal("")),
  proveedorId: z.string().min(1)
});

export const stockAdjustmentSchema = z.object({
  productoId: z.string().min(1),
  tipo: z.enum(["ENTRADA", "AJUSTE", "DEVOLUCION"]),
  cantidad: z.coerce.number().int(),
  referencia: z.string().min(3)
});

export const orderSchema = z.object({
  productoId: z.string().min(1),
  cantidad: z.coerce.number().int().positive(),
  costoLogistico: z.coerce.number().nonnegative(),
  clienteNombre: z.string().min(3),
  clienteEmail: z.string().email(),
  clienteTelefono: z.string().min(7),
  clienteCiudad: z.string().min(2),
  clienteDireccion: z.string().min(5)
});

export const dispatchSchema = z.object({
  pedidoId: z.string().min(1),
  nextState: z.enum(pedidoStates),
  transportadora: z.string().min(2),
  numeroGuia: z.string().optional()
});

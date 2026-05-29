"use server";

import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import {
  CanalNotificacion,
  EstadoLiquidacion,
  EstadoNotificacion,
  EstadoPedido,
  EstadoPedidoEspecial,
  RolUsuario,
  TipoMovimiento,
  type EstadoDespacho
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  clearSessionCookie,
  createSessionToken,
  requireRole,
  setSessionCookie
} from "@/lib/auth";
import {
  adminUserSchema,
  dispatchSchema,
  loginSchema,
  orderSchema,
  productSchema,
  providerSchema,
  registerSchema,
  stockAdjustmentSchema
} from "@/lib/domain/schemas";
import { applyStockMutation, hasAvailableStock } from "@/lib/domain/inventory";
import { calculateLiquidation } from "@/lib/domain/liquidation";
import {
  canTransitionPedido,
  toDispatchState,
  type PedidoState
} from "@/lib/domain/order-state";
import { generateMockLabel, generateMockTracking } from "@/lib/integrations/mock-adapters";

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function ok(path: string, message: string): never {
  redirect(`${path}?ok=${encodeURIComponent(message)}`);
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) fail("/login", "Ingresa credenciales validas.");

  const user = await db.usuario.findUnique({
    where: { email: parsed.data.email.toLowerCase() }
  });

  if (!user || !user.activo) fail("/login", "Usuario o password invalido.");

  const matches = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!matches) fail("/login", "Usuario o password invalido.");

  const token = await createSessionToken({
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol
  });

  await setSessionCookie(token);
  redirect("/dashboard");
}

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) fail("/registro", "Revisa los datos del registro.");

  const email = parsed.data.email.toLowerCase();
  const rol = parsed.data.rol as RolUsuario;
  const existingUser = await db.usuario.findUnique({ where: { email } });
  if (existingUser) fail("/registro", "Ya existe un usuario con ese correo.");

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  const user = await db.$transaction(async (tx) => {
    const createdUser = await tx.usuario.create({
      data: {
        nombre: parsed.data.nombre,
        email,
        passwordHash,
        rol
      }
    });

    if (rol === RolUsuario.CLIENTE_FINAL) {
      const existingClient = await tx.cliente.findFirst({
        where: { email, userId: null },
        orderBy: { creadoEn: "asc" }
      });

      if (existingClient) {
        await tx.cliente.update({
          where: { id: existingClient.id },
          data: {
            userId: createdUser.id,
            nombre: parsed.data.nombre,
            telefono: parsed.data.telefono ?? existingClient.telefono,
            ciudad: parsed.data.ciudad ?? existingClient.ciudad,
            direccion: parsed.data.direccion ?? existingClient.direccion
          }
        });
      } else {
        await tx.cliente.create({
          data: {
            userId: createdUser.id,
            nombre: parsed.data.nombre,
            email,
            telefono: parsed.data.telefono ?? "",
            ciudad: parsed.data.ciudad ?? "",
            direccion: parsed.data.direccion ?? ""
          }
        });
      }
    }

    return createdUser;
  });

  const token = await createSessionToken({
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol
  });

  await setSessionCookie(token);
  redirect(rol === RolUsuario.CLIENTE_FINAL ? "/cliente/seguimiento" : "/dashboard");
}

export async function createManagedUserAction(formData: FormData) {
  await requireRole([RolUsuario.ADMINISTRADOR]);
  const parsed = adminUserSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) fail("/admin/usuarios", "Revisa los datos del usuario.");

  const email = parsed.data.email.toLowerCase();
  const existingUser = await db.usuario.findUnique({ where: { email } });
  if (existingUser) fail("/admin/usuarios", "Ya existe un usuario con ese correo.");

  await db.$transaction(async (tx) => {
    const user = await tx.usuario.create({
      data: {
        nombre: parsed.data.nombre,
        email,
        passwordHash: await bcrypt.hash(parsed.data.password, 12),
        rol: parsed.data.rol as RolUsuario
      }
    });

    if (parsed.data.rol === RolUsuario.VENDEDOR_EXTERNO) {
      await tx.vendedorExterno.create({
        data: {
          userId: user.id,
          nombreEmpresa: parsed.data.nombreEmpresa ?? parsed.data.nombre,
          ciudad: parsed.data.ciudad ?? "",
          direccion: parsed.data.direccion ?? "",
          telefono: parsed.data.telefono ?? "",
          datosBancarios: parsed.data.datosBancarios ?? "",
          tokenIntegracion: `vnd_${randomUUID()}`,
          tiendas: []
        }
      });
    }
  });

  revalidatePath("/admin/usuarios");
  ok("/admin/usuarios", "Usuario creado.");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/catalogo");
}

export async function createProviderAction(formData: FormData) {
  await requireRole([RolUsuario.ADMINISTRADOR]);
  const parsed = providerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) fail("/admin/productos", "Proveedor incompleto o invalido.");

  await db.proveedor.create({
    data: {
      razonSocial: parsed.data.razonSocial,
      nit: parsed.data.nit,
      ciudad: parsed.data.ciudad,
      contacto: parsed.data.contacto,
      terminosPago: parsed.data.terminosPago,
      categorias: parsed.data.categorias
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    }
  });

  revalidatePath("/admin/productos");
  ok("/admin/productos", "Proveedor creado.");
}

export async function createProductAction(formData: FormData) {
  const session = await requireRole([RolUsuario.ADMINISTRADOR]);
  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) fail("/admin/productos", "Producto incompleto o invalido.");

  await db.$transaction(async (tx) => {
    const product = await tx.producto.create({
      data: {
        sku: parsed.data.sku,
        nombre: parsed.data.nombre,
        descripcion: parsed.data.descripcion,
        marca: parsed.data.marca,
        categoria: parsed.data.categoria,
        precioCosto: parsed.data.precioCosto,
        precioBase: parsed.data.precioBase,
        stockActual: parsed.data.stockActual,
        stockMinimo: parsed.data.stockMinimo,
        tiempoDespacho: parsed.data.tiempoDespacho,
        imagenes: parsed.data.imagenUrl ? [parsed.data.imagenUrl] : [],
        proveedorId: parsed.data.proveedorId
      }
    });

    if (parsed.data.stockActual > 0) {
      await tx.movimientoInventario.create({
        data: {
          productoId: product.id,
          tipo: TipoMovimiento.ENTRADA,
          cantidad: parsed.data.stockActual,
          referencia: "Alta inicial de producto",
          usuarioId: session.id
        }
      });
    }
  });

  revalidatePath("/catalogo");
  revalidatePath("/admin/productos");
  ok("/admin/productos", "Producto creado.");
}

export async function adjustStockAction(formData: FormData) {
  const session = await requireRole([
    RolUsuario.ADMINISTRADOR,
    RolUsuario.OPERADOR_BODEGA
  ]);
  const parsed = stockAdjustmentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) fail("/admin/productos", "Movimiento de stock invalido.");

  const product = await db.producto.findUnique({
    where: { id: parsed.data.productoId }
  });
  if (!product) fail("/admin/productos", "Producto no encontrado.");

  const delta =
    parsed.data.tipo === "ENTRADA" || parsed.data.tipo === "DEVOLUCION"
      ? Math.abs(parsed.data.cantidad)
      : parsed.data.cantidad;

  try {
    applyStockMutation(product.stockActual, delta);
  } catch (error) {
    fail(
      "/admin/productos",
      error instanceof Error ? error.message : "Stock invalido."
    );
  }

  await db.$transaction([
    db.producto.update({
      where: { id: product.id },
      data: { stockActual: { increment: delta } }
    }),
    db.movimientoInventario.create({
      data: {
        productoId: product.id,
        tipo: parsed.data.tipo as TipoMovimiento,
        cantidad: delta,
        referencia: parsed.data.referencia,
        usuarioId: session.id
      }
    })
  ]);

  revalidatePath("/admin/productos");
  revalidatePath("/catalogo");
  ok("/admin/productos", "Stock actualizado.");
}

export async function createOrderAction(formData: FormData) {
  const session = await requireRole([
    RolUsuario.VENDEDOR_EXTERNO,
    RolUsuario.ADMINISTRADOR
  ]);
  const parsed = orderSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) fail("/vendedor/pedidos", "Pedido incompleto o invalido.");

  const vendedor = await db.vendedorExterno.findFirst({
    where:
      session.rol === RolUsuario.ADMINISTRADOR
        ? {}
        : { userId: session.id }
  });
  if (!vendedor) fail("/vendedor/pedidos", "No hay vendedor asociado.");

  const pedidoId = await db.$transaction(async (tx) => {
    const product = await tx.producto.findUnique({
      where: { id: parsed.data.productoId },
      include: { proveedor: true }
    });

    if (!product || !product.activo) {
      throw new Error("Producto no disponible.");
    }

    const quantity = parsed.data.cantidad;
    const price = Number(product.precioBase.toString());
    const cost = Number(product.precioCosto.toString());
    const totalBruto = price * quantity;
    const costoBase = cost * quantity;
    const liquidacion = calculateLiquidation({
      totalVenta: totalBruto,
      costoBase,
      costoLogistico: parsed.data.costoLogistico
    });

    const cliente = await tx.cliente.create({
      data: {
        nombre: parsed.data.clienteNombre,
        email: parsed.data.clienteEmail.toLowerCase(),
        telefono: parsed.data.clienteTelefono,
        ciudad: parsed.data.clienteCiudad,
        direccion: parsed.data.clienteDireccion
      }
    });

    const stockDisponible = hasAvailableStock(product.stockActual, quantity);
    const pedido = await tx.pedido.create({
      data: {
        vendedorId: vendedor.id,
        clienteId: cliente.id,
        estado: stockDisponible
          ? EstadoPedido.CONFIRMADO
          : EstadoPedido.PEDIDO_ESPECIAL,
        totalBruto,
        costoBase,
        costoLogistico: parsed.data.costoLogistico,
        liquidacionVendedor: liquidacion.ganancia,
        lineas: {
          create: {
            productoId: product.id,
            cantidad: quantity,
            precioUnitario: price,
            costoUnitario: cost,
            subtotal: totalBruto,
            costoSubtotal: costoBase
          }
        }
      }
    });

    if (stockDisponible) {
      const tracking = generateMockTracking(pedido.id);
      await tx.producto.update({
        where: { id: product.id },
        data: { stockActual: { decrement: quantity } }
      });
      await tx.movimientoInventario.create({
        data: {
          productoId: product.id,
          tipo: TipoMovimiento.SALIDA,
          cantidad: -quantity,
          referencia: `Pedido ${pedido.id}`,
          usuarioId: session.id
        }
      });
      await tx.factura.create({
        data: {
          pedidoId: pedido.id,
          vendedorId: vendedor.id,
          totalFacturado: totalBruto,
          documentoEquivalente: `FUMC-FE-${pedido.id.slice(-6).toUpperCase()}`
        }
      });
      await tx.ordenDespacho.create({
        data: {
          pedidoId: pedido.id,
          estado: "PENDIENTE",
          transportadora: "Sin asignar",
          numeroGuia: tracking,
          etiquetaUrl: generateMockLabel(tracking)
        }
      });
      await tx.pedido.update({
        where: { id: pedido.id },
        data: { guiaEstimada: tracking }
      });
      await tx.notificacion.create({
        data: {
          pedidoId: pedido.id,
          canal: CanalNotificacion.EMAIL,
          destinatario: session.email,
          asunto: "Pedido confirmado",
          mensaje: `Pedido ${pedido.id} confirmado con guia ${tracking}.`,
          estado: EstadoNotificacion.ENVIADA,
          enviadaEn: new Date()
        }
      });
    } else {
      const fechaEstimada = new Date();
      fechaEstimada.setDate(fechaEstimada.getDate() + 10);

      await tx.pedidoEspecial.create({
        data: {
          pedidoId: pedido.id,
          vendedorId: vendedor.id,
          proveedorId: product.proveedorId,
          fechaEstimada,
          estado: EstadoPedidoEspecial.SOLICITADO,
          condicionesPago: product.proveedor.terminosPago
        }
      });
      await tx.notificacion.create({
        data: {
          pedidoId: pedido.id,
          canal: CanalNotificacion.EMAIL,
          destinatario: session.email,
          asunto: "Pedido especial creado",
          mensaje: `No hay stock suficiente de ${product.nombre}. Fecha estimada: ${fechaEstimada.toLocaleDateString("es-CO")}.`,
          estado: EstadoNotificacion.ENVIADA,
          enviadaEn: new Date()
        }
      });
    }

    return pedido.id;
  });

  revalidatePath("/vendedor/pedidos");
  revalidatePath("/dashboard");
  revalidatePath("/catalogo");
  ok("/vendedor/pedidos", `Pedido ${pedidoId.slice(-6).toUpperCase()} creado.`);
}

export async function advanceDispatchAction(formData: FormData) {
  const session = await requireRole([
    RolUsuario.ADMINISTRADOR,
    RolUsuario.OPERADOR_BODEGA
  ]);
  const parsed = dispatchSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) fail("/bodega/despachos", "Estado logistico invalido.");

  const pedido = await db.pedido.findUnique({
    where: { id: parsed.data.pedidoId },
    include: {
      lineas: true,
      ordenDespacho: true,
      cliente: true,
      vendedor: true
    }
  });

  if (!pedido || !pedido.ordenDespacho) {
    fail("/bodega/despachos", "Pedido o despacho no encontrado.");
  }

  if (
    !canTransitionPedido(
      pedido.estado as PedidoState,
      parsed.data.nextState as PedidoState
    )
  ) {
    fail("/bodega/despachos", "Transicion de estado no permitida.");
  }

  await db.$transaction(async (tx) => {
    const dispatchState = toDispatchState(parsed.data.nextState as PedidoState);
    await tx.pedido.update({
      where: { id: pedido.id },
      data: { estado: parsed.data.nextState as EstadoPedido }
    });

    await tx.ordenDespacho.update({
      where: { pedidoId: pedido.id },
      data: {
        operadorId: session.id,
        estado: dispatchState as EstadoDespacho,
        transportadora: parsed.data.transportadora,
        numeroGuia: parsed.data.numeroGuia || pedido.ordenDespacho?.numeroGuia,
        fechaDespacho:
          parsed.data.nextState === EstadoPedido.DESPACHADO
            ? new Date()
            : pedido.ordenDespacho?.fechaDespacho,
        fechaEntrega:
          parsed.data.nextState === EstadoPedido.ENTREGADO
            ? new Date()
            : pedido.ordenDespacho?.fechaEntrega
      }
    });

    if (parsed.data.nextState === EstadoPedido.DEVUELTO) {
      for (const line of pedido.lineas) {
        await tx.producto.update({
          where: { id: line.productoId },
          data: { stockActual: { increment: line.cantidad } }
        });
        await tx.movimientoInventario.create({
          data: {
            productoId: line.productoId,
            tipo: TipoMovimiento.DEVOLUCION,
            cantidad: line.cantidad,
            referencia: `Devolucion pedido ${pedido.id}`,
            usuarioId: session.id
          }
        });
      }
    }

    if (parsed.data.nextState === EstadoPedido.ENTREGADO) {
      const liquidation = calculateLiquidation({
        totalVenta: Number(pedido.totalBruto.toString()),
        costoBase: Number(pedido.costoBase.toString()),
        costoLogistico: Number(pedido.costoLogistico.toString())
      });

      await tx.liquidacion.upsert({
        where: { pedidoId: pedido.id },
        create: {
          pedidoId: pedido.id,
          vendedorId: pedido.vendedorId,
          totalVenta: liquidation.totalVenta,
          costoBase: liquidation.costoBase,
          costoLogistico: liquidation.costoLogistico,
          ganancia: liquidation.ganancia,
          estado: EstadoLiquidacion.PENDIENTE
        },
        update: {
          totalVenta: liquidation.totalVenta,
          costoBase: liquidation.costoBase,
          costoLogistico: liquidation.costoLogistico,
          ganancia: liquidation.ganancia
        }
      });
    }

    await tx.notificacion.create({
      data: {
        pedidoId: pedido.id,
        canal: CanalNotificacion.EMAIL,
        destinatario: pedido.cliente.email,
        asunto: "Actualizacion de pedido",
        mensaje: `Tu pedido cambio a estado ${parsed.data.nextState}.`,
        estado: EstadoNotificacion.ENVIADA,
        enviadaEn: new Date()
      }
    });
  });

  revalidatePath("/bodega/despachos");
  revalidatePath("/dashboard");
  revalidatePath("/reportes");
  ok("/bodega/despachos", "Estado actualizado.");
}

import { PrismaClient, RolUsuario, TipoMovimiento } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function hash(password: string) {
  return bcrypt.hash(password, 12);
}

async function main() {
  await prisma.notificacion.deleteMany();
  await prisma.liquidacion.deleteMany();
  await prisma.pedidoEspecial.deleteMany();
  await prisma.movimientoInventario.deleteMany();
  await prisma.factura.deleteMany();
  await prisma.ordenDespacho.deleteMany();
  await prisma.lineaPedido.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.vendedorExterno.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.proveedor.deleteMany();
  await prisma.usuario.deleteMany();

  const [admin, bodega, vendedorUser, clienteUser] = await Promise.all([
    prisma.usuario.create({
      data: {
        nombre: "Administrador FUMC",
        email: "admin@fumc.edu.co",
        passwordHash: await hash("Admin123!"),
        rol: RolUsuario.ADMINISTRADOR
      }
    }),
    prisma.usuario.create({
      data: {
        nombre: "Operador Bodega",
        email: "bodega@fumc.edu.co",
        passwordHash: await hash("Bodega123!"),
        rol: RolUsuario.OPERADOR_BODEGA
      }
    }),
    prisma.usuario.create({
      data: {
        nombre: "Vendedor Demo",
        email: "vendedor@fumc.edu.co",
        passwordHash: await hash("Vendedor123!"),
        rol: RolUsuario.VENDEDOR_EXTERNO
      }
    }),
    prisma.usuario.create({
      data: {
        nombre: "Cliente Final Demo",
        email: "cliente@fumc.edu.co",
        passwordHash: await hash("Cliente123!"),
        rol: RolUsuario.CLIENTE_FINAL
      }
    })
  ]);

  const proveedorHogar = await prisma.proveedor.create({
    data: {
      razonSocial: "Aliados Hogar SAS",
      nit: "900123456-1",
      ciudad: "Medellin",
      contacto: "compras@aliadoshogar.co",
      terminosPago: "30 dias",
      categorias: ["Hogar", "Cocina", "Organizacion"]
    }
  });

  const proveedorTech = await prisma.proveedor.create({
    data: {
      razonSocial: "TecnoFulfillment SAS",
      nit: "901654321-8",
      ciudad: "Bogota",
      contacto: "operaciones@tecnofulfillment.co",
      terminosPago: "Anticipo 50%",
      categorias: ["Tecnologia", "Accesorios", "Fitness"]
    }
  });

  const vendedor = await prisma.vendedorExterno.create({
    data: {
      userId: vendedorUser.id,
      nombreEmpresa: "Tienda Aliada Demo",
      ciudad: "Cali",
      direccion: "Carrera 10 #20-30",
      telefono: "+57 300 000 0000",
      datosBancarios: "Banco Demo - Cuenta de ahorros terminada en 1234",
      tokenIntegracion: "demo-shopify-token",
      tiendas: ["https://tienda-demo.example.com"]
    }
  });

  const clienteFinal = await prisma.cliente.create({
    data: {
      userId: clienteUser.id,
      nombre: "Cliente Final Demo",
      email: "cliente@fumc.edu.co",
      telefono: "+57 311 111 1111",
      ciudad: "Medellin",
      direccion: "Calle 45 #12-34"
    }
  });

  const productos = await prisma.producto.createManyAndReturn({
    data: [
      {
        sku: "FUMC-HOG-001",
        nombre: "Organizador modular de cocina",
        descripcion: "Set apilable para despensa y cocina con material lavable.",
        marca: "CasaFlex",
        categoria: "Hogar",
        precioCosto: 42000,
        precioBase: 69900,
        stockActual: 36,
        stockMinimo: 8,
        tiempoDespacho: "24-48 horas",
        imagenes: ["https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=600&q=80"],
        proveedorId: proveedorHogar.id
      },
      {
        sku: "FUMC-TEC-002",
        nombre: "Smartwatch deportivo",
        descripcion: "Reloj inteligente con monitoreo basico y bateria de larga duracion.",
        marca: "PulseOne",
        categoria: "Tecnologia",
        precioCosto: 86000,
        precioBase: 139900,
        stockActual: 14,
        stockMinimo: 5,
        tiempoDespacho: "24 horas",
        imagenes: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"],
        proveedorId: proveedorTech.id
      },
      {
        sku: "FUMC-ACC-003",
        nombre: "Mochila antirrobo urbana",
        descripcion: "Mochila resistente al agua con compartimento para portatil.",
        marca: "UrbanWay",
        categoria: "Accesorios",
        precioCosto: 62000,
        precioBase: 99900,
        stockActual: 4,
        stockMinimo: 6,
        tiempoDespacho: "48 horas",
        imagenes: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"],
        proveedorId: proveedorTech.id
      },
      {
        sku: "FUMC-HOG-004",
        nombre: "Lampara LED recargable",
        descripcion: "Lampara de escritorio con tres tonos de luz y carga USB.",
        marca: "Luma",
        categoria: "Hogar",
        precioCosto: 38000,
        precioBase: 64900,
        stockActual: 0,
        stockMinimo: 10,
        tiempoDespacho: "Sujeto a reabastecimiento",
        imagenes: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80"],
        proveedorId: proveedorHogar.id
      }
    ]
  });

  await prisma.movimientoInventario.createMany({
    data: productos.map((producto) => ({
      productoId: producto.id,
      tipo: TipoMovimiento.ENTRADA,
      cantidad: producto.stockActual,
      referencia: "Seed inicial",
      usuarioId: admin.id
    }))
  });

  const clientePedido = clienteFinal;

  const productoPedido = productos[0];
  const cantidad = 2;
  const totalBruto = Number(productoPedido.precioBase) * cantidad;
  const costoBase = Number(productoPedido.precioCosto) * cantidad;
  const costoLogistico = 12000;
  const ganancia = totalBruto - costoBase - costoLogistico;

  const pedido = await prisma.pedido.create({
    data: {
      vendedorId: vendedor.id,
      clienteId: clientePedido.id,
      estado: "CONFIRMADO",
      totalBruto,
      costoBase,
      costoLogistico,
      liquidacionVendedor: ganancia,
      guiaEstimada: "FUMC-DEMO-001",
      lineas: {
        create: {
          productoId: productoPedido.id,
          cantidad,
          precioUnitario: productoPedido.precioBase,
          costoUnitario: productoPedido.precioCosto,
          subtotal: totalBruto,
          costoSubtotal: costoBase
        }
      }
    }
  });

  await prisma.producto.update({
    where: { id: productoPedido.id },
    data: { stockActual: { decrement: cantidad } }
  });

  await prisma.movimientoInventario.create({
    data: {
      productoId: productoPedido.id,
      tipo: TipoMovimiento.SALIDA,
      cantidad: -cantidad,
      referencia: `Pedido ${pedido.id}`,
      usuarioId: admin.id
    }
  });

  await prisma.factura.create({
    data: {
      pedidoId: pedido.id,
      vendedorId: vendedor.id,
      totalFacturado: totalBruto,
      documentoEquivalente: `FUMC-FE-${pedido.id.slice(-6).toUpperCase()}`
    }
  });

  await prisma.ordenDespacho.create({
    data: {
      pedidoId: pedido.id,
      operadorId: bodega.id,
      estado: "PENDIENTE",
      transportadora: "Transportadora Demo",
      numeroGuia: "GUIA-DEMO-001",
      etiquetaUrl: "mock://etiqueta/GUIA-DEMO-001"
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

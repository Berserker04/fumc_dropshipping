-- CreateTable
CREATE TABLE `Usuario` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `rol` ENUM('ADMINISTRADOR', 'OPERADOR_BODEGA', 'VENDEDOR_EXTERNO', 'CLIENTE_FINAL') NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Proveedor` (
    `id` VARCHAR(191) NOT NULL,
    `razonSocial` VARCHAR(191) NOT NULL,
    `nit` VARCHAR(191) NOT NULL,
    `ciudad` VARCHAR(191) NOT NULL,
    `contacto` VARCHAR(191) NOT NULL,
    `terminosPago` VARCHAR(191) NOT NULL,
    `categorias` JSON NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Proveedor_nit_key`(`nit`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Producto` (
    `id` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `marca` VARCHAR(191) NOT NULL,
    `categoria` VARCHAR(191) NOT NULL,
    `precioCosto` DECIMAL(12, 2) NOT NULL,
    `precioBase` DECIMAL(12, 2) NOT NULL,
    `stockActual` INTEGER NOT NULL,
    `stockMinimo` INTEGER NOT NULL,
    `tiempoDespacho` VARCHAR(191) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `imagenes` JSON NOT NULL,
    `proveedorId` VARCHAR(191) NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Producto_sku_key`(`sku`),
    INDEX `Producto_nombre_idx`(`nombre`),
    INDEX `Producto_categoria_idx`(`categoria`),
    INDEX `Producto_marca_idx`(`marca`),
    INDEX `Producto_stockActual_idx`(`stockActual`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VendedorExterno` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `nombreEmpresa` VARCHAR(191) NOT NULL,
    `ciudad` VARCHAR(191) NOT NULL,
    `direccion` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `datosBancarios` VARCHAR(191) NOT NULL,
    `tokenIntegracion` VARCHAR(191) NOT NULL,
    `tiendas` JSON NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VendedorExterno_userId_key`(`userId`),
    UNIQUE INDEX `VendedorExterno_tokenIntegracion_key`(`tokenIntegracion`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cliente` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `ciudad` VARCHAR(191) NOT NULL,
    `direccion` VARCHAR(191) NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Cliente_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pedido` (
    `id` VARCHAR(191) NOT NULL,
    `vendedorId` VARCHAR(191) NOT NULL,
    `clienteId` VARCHAR(191) NOT NULL,
    `estado` ENUM('RECIBIDO', 'PEDIDO_ESPECIAL', 'CONFIRMADO', 'EN_PREPARACION', 'EMPACADO', 'DESPACHADO', 'EN_TRANSITO', 'ENTREGADO', 'DEVUELTO', 'CANCELADO') NOT NULL DEFAULT 'RECIBIDO',
    `totalBruto` DECIMAL(12, 2) NOT NULL,
    `costoBase` DECIMAL(12, 2) NOT NULL,
    `costoLogistico` DECIMAL(12, 2) NOT NULL,
    `liquidacionVendedor` DECIMAL(12, 2) NOT NULL,
    `guiaEstimada` VARCHAR(191) NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    INDEX `Pedido_estado_idx`(`estado`),
    INDEX `Pedido_creadoEn_idx`(`creadoEn`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LineaPedido` (
    `id` VARCHAR(191) NOT NULL,
    `pedidoId` VARCHAR(191) NOT NULL,
    `productoId` VARCHAR(191) NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `precioUnitario` DECIMAL(12, 2) NOT NULL,
    `costoUnitario` DECIMAL(12, 2) NOT NULL,
    `subtotal` DECIMAL(12, 2) NOT NULL,
    `costoSubtotal` DECIMAL(12, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrdenDespacho` (
    `id` VARCHAR(191) NOT NULL,
    `pedidoId` VARCHAR(191) NOT NULL,
    `operadorId` VARCHAR(191) NULL,
    `estado` ENUM('PENDIENTE', 'EN_PREPARACION', 'EMPACADO', 'DESPACHADO', 'EN_TRANSITO', 'ENTREGADO', 'DEVUELTO') NOT NULL DEFAULT 'PENDIENTE',
    `transportadora` VARCHAR(191) NOT NULL,
    `numeroGuia` VARCHAR(191) NULL,
    `etiquetaUrl` VARCHAR(191) NULL,
    `fechaDespacho` DATETIME(3) NULL,
    `fechaEntrega` DATETIME(3) NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `OrdenDespacho_pedidoId_key`(`pedidoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Factura` (
    `id` VARCHAR(191) NOT NULL,
    `pedidoId` VARCHAR(191) NOT NULL,
    `vendedorId` VARCHAR(191) NOT NULL,
    `fechaEmision` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `totalFacturado` DECIMAL(12, 2) NOT NULL,
    `documentoEquivalente` VARCHAR(191) NOT NULL,
    `anulada` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Factura_pedidoId_key`(`pedidoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MovimientoInventario` (
    `id` VARCHAR(191) NOT NULL,
    `productoId` VARCHAR(191) NOT NULL,
    `tipo` ENUM('ENTRADA', 'SALIDA', 'AJUSTE', 'DEVOLUCION') NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `referencia` VARCHAR(191) NOT NULL,
    `usuarioId` VARCHAR(191) NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `MovimientoInventario_tipo_idx`(`tipo`),
    INDEX `MovimientoInventario_fecha_idx`(`fecha`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PedidoEspecial` (
    `id` VARCHAR(191) NOT NULL,
    `pedidoId` VARCHAR(191) NOT NULL,
    `vendedorId` VARCHAR(191) NOT NULL,
    `proveedorId` VARCHAR(191) NOT NULL,
    `fechaEstimada` DATETIME(3) NOT NULL,
    `estado` ENUM('SOLICITADO', 'EN_COMPRA', 'RECIBIDO', 'CONVERTIDO', 'CANCELADO') NOT NULL DEFAULT 'SOLICITADO',
    `condicionesPago` VARCHAR(191) NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PedidoEspecial_pedidoId_key`(`pedidoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Liquidacion` (
    `id` VARCHAR(191) NOT NULL,
    `pedidoId` VARCHAR(191) NOT NULL,
    `vendedorId` VARCHAR(191) NOT NULL,
    `totalVenta` DECIMAL(12, 2) NOT NULL,
    `costoBase` DECIMAL(12, 2) NOT NULL,
    `costoLogistico` DECIMAL(12, 2) NOT NULL,
    `ganancia` DECIMAL(12, 2) NOT NULL,
    `estado` ENUM('PENDIENTE', 'APROBADA', 'PAGADA', 'ANULADA') NOT NULL DEFAULT 'PENDIENTE',
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Liquidacion_pedidoId_key`(`pedidoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notificacion` (
    `id` VARCHAR(191) NOT NULL,
    `pedidoId` VARCHAR(191) NULL,
    `canal` ENUM('EMAIL', 'WHATSAPP', 'SISTEMA') NOT NULL,
    `destinatario` VARCHAR(191) NOT NULL,
    `asunto` VARCHAR(191) NOT NULL,
    `mensaje` VARCHAR(191) NOT NULL,
    `estado` ENUM('PENDIENTE', 'ENVIADA', 'FALLIDA') NOT NULL DEFAULT 'PENDIENTE',
    `creadaEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `enviadaEn` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_proveedorId_fkey` FOREIGN KEY (`proveedorId`) REFERENCES `Proveedor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VendedorExterno` ADD CONSTRAINT `VendedorExterno_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cliente` ADD CONSTRAINT `Cliente_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_vendedorId_fkey` FOREIGN KEY (`vendedorId`) REFERENCES `VendedorExterno`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LineaPedido` ADD CONSTRAINT `LineaPedido_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `Pedido`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LineaPedido` ADD CONSTRAINT `LineaPedido_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrdenDespacho` ADD CONSTRAINT `OrdenDespacho_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `Pedido`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrdenDespacho` ADD CONSTRAINT `OrdenDespacho_operadorId_fkey` FOREIGN KEY (`operadorId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Factura` ADD CONSTRAINT `Factura_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `Pedido`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovimientoInventario` ADD CONSTRAINT `MovimientoInventario_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovimientoInventario` ADD CONSTRAINT `MovimientoInventario_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PedidoEspecial` ADD CONSTRAINT `PedidoEspecial_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `Pedido`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PedidoEspecial` ADD CONSTRAINT `PedidoEspecial_vendedorId_fkey` FOREIGN KEY (`vendedorId`) REFERENCES `VendedorExterno`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PedidoEspecial` ADD CONSTRAINT `PedidoEspecial_proveedorId_fkey` FOREIGN KEY (`proveedorId`) REFERENCES `Proveedor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Liquidacion` ADD CONSTRAINT `Liquidacion_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `Pedido`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Liquidacion` ADD CONSTRAINT `Liquidacion_vendedorId_fkey` FOREIGN KEY (`vendedorId`) REFERENCES `VendedorExterno`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notificacion` ADD CONSTRAINT `Notificacion_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `Pedido`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;


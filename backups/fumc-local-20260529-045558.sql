--
-- PostgreSQL database dump
--

\restrict 87qeTH0zRARLRos1VKvNykGyrlIh7UCa5UEDxawfLWU294lC7ge3lNmUzE8aq0L

-- Dumped from database version 16.13
-- Dumped by pg_dump version 16.13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public."VendedorExterno" DROP CONSTRAINT IF EXISTS "VendedorExterno_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Producto" DROP CONSTRAINT IF EXISTS "Producto_proveedorId_fkey";
ALTER TABLE IF EXISTS ONLY public."Pedido" DROP CONSTRAINT IF EXISTS "Pedido_vendedorId_fkey";
ALTER TABLE IF EXISTS ONLY public."Pedido" DROP CONSTRAINT IF EXISTS "Pedido_clienteId_fkey";
ALTER TABLE IF EXISTS ONLY public."PedidoEspecial" DROP CONSTRAINT IF EXISTS "PedidoEspecial_vendedorId_fkey";
ALTER TABLE IF EXISTS ONLY public."PedidoEspecial" DROP CONSTRAINT IF EXISTS "PedidoEspecial_proveedorId_fkey";
ALTER TABLE IF EXISTS ONLY public."PedidoEspecial" DROP CONSTRAINT IF EXISTS "PedidoEspecial_pedidoId_fkey";
ALTER TABLE IF EXISTS ONLY public."OrdenDespacho" DROP CONSTRAINT IF EXISTS "OrdenDespacho_pedidoId_fkey";
ALTER TABLE IF EXISTS ONLY public."OrdenDespacho" DROP CONSTRAINT IF EXISTS "OrdenDespacho_operadorId_fkey";
ALTER TABLE IF EXISTS ONLY public."Notificacion" DROP CONSTRAINT IF EXISTS "Notificacion_pedidoId_fkey";
ALTER TABLE IF EXISTS ONLY public."MovimientoInventario" DROP CONSTRAINT IF EXISTS "MovimientoInventario_usuarioId_fkey";
ALTER TABLE IF EXISTS ONLY public."MovimientoInventario" DROP CONSTRAINT IF EXISTS "MovimientoInventario_productoId_fkey";
ALTER TABLE IF EXISTS ONLY public."Liquidacion" DROP CONSTRAINT IF EXISTS "Liquidacion_vendedorId_fkey";
ALTER TABLE IF EXISTS ONLY public."Liquidacion" DROP CONSTRAINT IF EXISTS "Liquidacion_pedidoId_fkey";
ALTER TABLE IF EXISTS ONLY public."LineaPedido" DROP CONSTRAINT IF EXISTS "LineaPedido_productoId_fkey";
ALTER TABLE IF EXISTS ONLY public."LineaPedido" DROP CONSTRAINT IF EXISTS "LineaPedido_pedidoId_fkey";
ALTER TABLE IF EXISTS ONLY public."Factura" DROP CONSTRAINT IF EXISTS "Factura_pedidoId_fkey";
ALTER TABLE IF EXISTS ONLY public."Cliente" DROP CONSTRAINT IF EXISTS "Cliente_userId_fkey";
DROP INDEX IF EXISTS public."VendedorExterno_userId_key";
DROP INDEX IF EXISTS public."VendedorExterno_tokenIntegracion_key";
DROP INDEX IF EXISTS public."Usuario_email_key";
DROP INDEX IF EXISTS public."Proveedor_nit_key";
DROP INDEX IF EXISTS public."Producto_stockActual_idx";
DROP INDEX IF EXISTS public."Producto_sku_key";
DROP INDEX IF EXISTS public."Producto_nombre_idx";
DROP INDEX IF EXISTS public."Producto_marca_idx";
DROP INDEX IF EXISTS public."Producto_categoria_idx";
DROP INDEX IF EXISTS public."Pedido_estado_idx";
DROP INDEX IF EXISTS public."Pedido_creadoEn_idx";
DROP INDEX IF EXISTS public."PedidoEspecial_pedidoId_key";
DROP INDEX IF EXISTS public."OrdenDespacho_pedidoId_key";
DROP INDEX IF EXISTS public."MovimientoInventario_tipo_idx";
DROP INDEX IF EXISTS public."MovimientoInventario_fecha_idx";
DROP INDEX IF EXISTS public."Liquidacion_pedidoId_key";
DROP INDEX IF EXISTS public."Factura_pedidoId_key";
DROP INDEX IF EXISTS public."Cliente_userId_key";
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public."VendedorExterno" DROP CONSTRAINT IF EXISTS "VendedorExterno_pkey";
ALTER TABLE IF EXISTS ONLY public."Usuario" DROP CONSTRAINT IF EXISTS "Usuario_pkey";
ALTER TABLE IF EXISTS ONLY public."Proveedor" DROP CONSTRAINT IF EXISTS "Proveedor_pkey";
ALTER TABLE IF EXISTS ONLY public."Producto" DROP CONSTRAINT IF EXISTS "Producto_pkey";
ALTER TABLE IF EXISTS ONLY public."Pedido" DROP CONSTRAINT IF EXISTS "Pedido_pkey";
ALTER TABLE IF EXISTS ONLY public."PedidoEspecial" DROP CONSTRAINT IF EXISTS "PedidoEspecial_pkey";
ALTER TABLE IF EXISTS ONLY public."OrdenDespacho" DROP CONSTRAINT IF EXISTS "OrdenDespacho_pkey";
ALTER TABLE IF EXISTS ONLY public."Notificacion" DROP CONSTRAINT IF EXISTS "Notificacion_pkey";
ALTER TABLE IF EXISTS ONLY public."MovimientoInventario" DROP CONSTRAINT IF EXISTS "MovimientoInventario_pkey";
ALTER TABLE IF EXISTS ONLY public."Liquidacion" DROP CONSTRAINT IF EXISTS "Liquidacion_pkey";
ALTER TABLE IF EXISTS ONLY public."LineaPedido" DROP CONSTRAINT IF EXISTS "LineaPedido_pkey";
ALTER TABLE IF EXISTS ONLY public."Factura" DROP CONSTRAINT IF EXISTS "Factura_pkey";
ALTER TABLE IF EXISTS ONLY public."Cliente" DROP CONSTRAINT IF EXISTS "Cliente_pkey";
DROP TABLE IF EXISTS public._prisma_migrations;
DROP TABLE IF EXISTS public."VendedorExterno";
DROP TABLE IF EXISTS public."Usuario";
DROP TABLE IF EXISTS public."Proveedor";
DROP TABLE IF EXISTS public."Producto";
DROP TABLE IF EXISTS public."PedidoEspecial";
DROP TABLE IF EXISTS public."Pedido";
DROP TABLE IF EXISTS public."OrdenDespacho";
DROP TABLE IF EXISTS public."Notificacion";
DROP TABLE IF EXISTS public."MovimientoInventario";
DROP TABLE IF EXISTS public."Liquidacion";
DROP TABLE IF EXISTS public."LineaPedido";
DROP TABLE IF EXISTS public."Factura";
DROP TABLE IF EXISTS public."Cliente";
DROP TYPE IF EXISTS public."TipoMovimiento";
DROP TYPE IF EXISTS public."RolUsuario";
DROP TYPE IF EXISTS public."EstadoPedidoEspecial";
DROP TYPE IF EXISTS public."EstadoPedido";
DROP TYPE IF EXISTS public."EstadoNotificacion";
DROP TYPE IF EXISTS public."EstadoLiquidacion";
DROP TYPE IF EXISTS public."EstadoDespacho";
DROP TYPE IF EXISTS public."CanalNotificacion";
DROP SCHEMA IF EXISTS public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: CanalNotificacion; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."CanalNotificacion" AS ENUM (
    'EMAIL',
    'WHATSAPP',
    'SISTEMA'
);


--
-- Name: EstadoDespacho; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EstadoDespacho" AS ENUM (
    'PENDIENTE',
    'EN_PREPARACION',
    'EMPACADO',
    'DESPACHADO',
    'EN_TRANSITO',
    'ENTREGADO',
    'DEVUELTO'
);


--
-- Name: EstadoLiquidacion; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EstadoLiquidacion" AS ENUM (
    'PENDIENTE',
    'APROBADA',
    'PAGADA',
    'ANULADA'
);


--
-- Name: EstadoNotificacion; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EstadoNotificacion" AS ENUM (
    'PENDIENTE',
    'ENVIADA',
    'FALLIDA'
);


--
-- Name: EstadoPedido; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EstadoPedido" AS ENUM (
    'RECIBIDO',
    'PEDIDO_ESPECIAL',
    'CONFIRMADO',
    'EN_PREPARACION',
    'EMPACADO',
    'DESPACHADO',
    'EN_TRANSITO',
    'ENTREGADO',
    'DEVUELTO',
    'CANCELADO'
);


--
-- Name: EstadoPedidoEspecial; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EstadoPedidoEspecial" AS ENUM (
    'SOLICITADO',
    'EN_COMPRA',
    'RECIBIDO',
    'CONVERTIDO',
    'CANCELADO'
);


--
-- Name: RolUsuario; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."RolUsuario" AS ENUM (
    'ADMINISTRADOR',
    'OPERADOR_BODEGA',
    'VENDEDOR_EXTERNO',
    'CLIENTE_FINAL'
);


--
-- Name: TipoMovimiento; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TipoMovimiento" AS ENUM (
    'ENTRADA',
    'SALIDA',
    'AJUSTE',
    'DEVOLUCION'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Cliente; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Cliente" (
    id text NOT NULL,
    "userId" text,
    nombre text NOT NULL,
    email text NOT NULL,
    telefono text NOT NULL,
    ciudad text NOT NULL,
    direccion text NOT NULL,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


--
-- Name: Factura; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Factura" (
    id text NOT NULL,
    "pedidoId" text NOT NULL,
    "vendedorId" text NOT NULL,
    "fechaEmision" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "totalFacturado" numeric(12,2) NOT NULL,
    "documentoEquivalente" text NOT NULL,
    anulada boolean DEFAULT false NOT NULL
);


--
-- Name: LineaPedido; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."LineaPedido" (
    id text NOT NULL,
    "pedidoId" text NOT NULL,
    "productoId" text NOT NULL,
    cantidad integer NOT NULL,
    "precioUnitario" numeric(12,2) NOT NULL,
    "costoUnitario" numeric(12,2) NOT NULL,
    subtotal numeric(12,2) NOT NULL,
    "costoSubtotal" numeric(12,2) NOT NULL
);


--
-- Name: Liquidacion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Liquidacion" (
    id text NOT NULL,
    "pedidoId" text NOT NULL,
    "vendedorId" text NOT NULL,
    "totalVenta" numeric(12,2) NOT NULL,
    "costoBase" numeric(12,2) NOT NULL,
    "costoLogistico" numeric(12,2) NOT NULL,
    ganancia numeric(12,2) NOT NULL,
    estado public."EstadoLiquidacion" DEFAULT 'PENDIENTE'::public."EstadoLiquidacion" NOT NULL,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


--
-- Name: MovimientoInventario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."MovimientoInventario" (
    id text NOT NULL,
    "productoId" text NOT NULL,
    tipo public."TipoMovimiento" NOT NULL,
    cantidad integer NOT NULL,
    referencia text NOT NULL,
    "usuarioId" text,
    fecha timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Notificacion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Notificacion" (
    id text NOT NULL,
    "pedidoId" text,
    canal public."CanalNotificacion" NOT NULL,
    destinatario text NOT NULL,
    asunto text NOT NULL,
    mensaje text NOT NULL,
    estado public."EstadoNotificacion" DEFAULT 'PENDIENTE'::public."EstadoNotificacion" NOT NULL,
    "creadaEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "enviadaEn" timestamp(3) without time zone
);


--
-- Name: OrdenDespacho; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."OrdenDespacho" (
    id text NOT NULL,
    "pedidoId" text NOT NULL,
    "operadorId" text,
    estado public."EstadoDespacho" DEFAULT 'PENDIENTE'::public."EstadoDespacho" NOT NULL,
    transportadora text NOT NULL,
    "numeroGuia" text,
    "etiquetaUrl" text,
    "fechaDespacho" timestamp(3) without time zone,
    "fechaEntrega" timestamp(3) without time zone,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


--
-- Name: Pedido; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Pedido" (
    id text NOT NULL,
    "vendedorId" text NOT NULL,
    "clienteId" text NOT NULL,
    estado public."EstadoPedido" DEFAULT 'RECIBIDO'::public."EstadoPedido" NOT NULL,
    "totalBruto" numeric(12,2) NOT NULL,
    "costoBase" numeric(12,2) NOT NULL,
    "costoLogistico" numeric(12,2) NOT NULL,
    "liquidacionVendedor" numeric(12,2) NOT NULL,
    "guiaEstimada" text,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


--
-- Name: PedidoEspecial; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PedidoEspecial" (
    id text NOT NULL,
    "pedidoId" text NOT NULL,
    "vendedorId" text NOT NULL,
    "proveedorId" text NOT NULL,
    "fechaEstimada" timestamp(3) without time zone NOT NULL,
    estado public."EstadoPedidoEspecial" DEFAULT 'SOLICITADO'::public."EstadoPedidoEspecial" NOT NULL,
    "condicionesPago" text NOT NULL,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


--
-- Name: Producto; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Producto" (
    id text NOT NULL,
    sku text NOT NULL,
    nombre text NOT NULL,
    descripcion text NOT NULL,
    marca text NOT NULL,
    categoria text NOT NULL,
    "precioCosto" numeric(12,2) NOT NULL,
    "precioBase" numeric(12,2) NOT NULL,
    "stockActual" integer NOT NULL,
    "stockMinimo" integer NOT NULL,
    "tiempoDespacho" text NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    imagenes jsonb NOT NULL,
    "proveedorId" text NOT NULL,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


--
-- Name: Proveedor; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Proveedor" (
    id text NOT NULL,
    "razonSocial" text NOT NULL,
    nit text NOT NULL,
    ciudad text NOT NULL,
    contacto text NOT NULL,
    "terminosPago" text NOT NULL,
    categorias text[],
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


--
-- Name: Usuario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Usuario" (
    id text NOT NULL,
    nombre text NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    rol public."RolUsuario" NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


--
-- Name: VendedorExterno; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."VendedorExterno" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "nombreEmpresa" text NOT NULL,
    ciudad text NOT NULL,
    direccion text NOT NULL,
    telefono text NOT NULL,
    "datosBancarios" text NOT NULL,
    "tokenIntegracion" text NOT NULL,
    tiendas text[],
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Data for Name: Cliente; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Cliente" (id, "userId", nombre, email, telefono, ciudad, direccion, "creadoEn", "actualizadoEn") FROM stdin;
cmp6rcejm0009vbnslw5903zx	cmp6rcei60002vbnspiks0209	Cliente Final Demo	cliente@fumc.edu.co	+57 311 111 1111	Medellin	Calle 45 #12-34	2026-05-15 10:11:33.923	2026-05-15 10:11:33.923
\.


--
-- Data for Name: Factura; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Factura" (id, "pedidoId", "vendedorId", "fechaEmision", "totalFacturado", "documentoEquivalente", anulada) FROM stdin;
cmp6rcels000pvbnsdpp45bwn	cmp6rcekx000jvbnsh51qimh6	cmp6rcej40007vbnsaeayloz2	2026-05-15 10:11:34	139800.00	FUMC-FE-1QIMH6	f
\.


--
-- Data for Name: LineaPedido; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."LineaPedido" (id, "pedidoId", "productoId", cantidad, "precioUnitario", "costoUnitario", subtotal, "costoSubtotal") FROM stdin;
cmp6rcekx000lvbnserph921h	cmp6rcekx000jvbnsh51qimh6	cmp6rcejx000avbns7yotq3nj	2	69900.00	42000.00	139800.00	84000.00
\.


--
-- Data for Name: Liquidacion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Liquidacion" (id, "pedidoId", "vendedorId", "totalVenta", "costoBase", "costoLogistico", ganancia, estado, "creadoEn", "actualizadoEn") FROM stdin;
cmpqqcg4a0009vbtggsbwtibf	cmp6rcekx000jvbnsh51qimh6	cmp6rcej40007vbnsaeayloz2	139800.00	84000.00	12000.00	43800.00	PENDIENTE	2026-05-29 09:38:59.866	2026-05-29 09:38:59.866
\.


--
-- Data for Name: MovimientoInventario; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."MovimientoInventario" (id, "productoId", tipo, cantidad, referencia, "usuarioId", fecha) FROM stdin;
cmp6rceki000evbnszakp37q2	cmp6rcejx000avbns7yotq3nj	ENTRADA	36	Seed inicial	cmp6rcei60001vbns9lp2925e	2026-05-15 10:11:33.954
cmp6rceki000fvbnsy15ma08j	cmp6rcejx000bvbnsrl6426xq	ENTRADA	14	Seed inicial	cmp6rcei60001vbns9lp2925e	2026-05-15 10:11:33.954
cmp6rceki000gvbns0zigzrow	cmp6rcejx000cvbns4762dunp	ENTRADA	4	Seed inicial	cmp6rcei60001vbns9lp2925e	2026-05-15 10:11:33.954
cmp6rceki000hvbnsoviy4dt5	cmp6rcejx000dvbnsd8qsp79m	ENTRADA	0	Seed inicial	cmp6rcei60001vbns9lp2925e	2026-05-15 10:11:33.954
cmp6rcell000nvbnsa336x5ud	cmp6rcejx000avbns7yotq3nj	SALIDA	-2	Pedido cmp6rcekx000jvbnsh51qimh6	cmp6rcei60001vbns9lp2925e	2026-05-15 10:11:33.993
\.


--
-- Data for Name: Notificacion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Notificacion" (id, "pedidoId", canal, destinatario, asunto, mensaje, estado, "creadaEn", "enviadaEn") FROM stdin;
cmpqqaba80001vbtg8cqeyr0x	cmp6rcekx000jvbnsh51qimh6	EMAIL	cliente@fumc.edu.co	Actualizacion de pedido	Tu pedido cambio a estado EN_PREPARACION.	ENVIADA	2026-05-29 09:37:20.288	2026-05-29 09:37:20.286
cmpqqbael0003vbtgfwllco6b	cmp6rcekx000jvbnsh51qimh6	EMAIL	cliente@fumc.edu.co	Actualizacion de pedido	Tu pedido cambio a estado EMPACADO.	ENVIADA	2026-05-29 09:38:05.806	2026-05-29 09:38:05.804
cmpqqc76k0005vbtgd0lb6r7h	cmp6rcekx000jvbnsh51qimh6	EMAIL	cliente@fumc.edu.co	Actualizacion de pedido	Tu pedido cambio a estado DESPACHADO.	ENVIADA	2026-05-29 09:38:48.284	2026-05-29 09:38:48.283
cmpqqcaxw0007vbtgaycn4afz	cmp6rcekx000jvbnsh51qimh6	EMAIL	cliente@fumc.edu.co	Actualizacion de pedido	Tu pedido cambio a estado EN_TRANSITO.	ENVIADA	2026-05-29 09:38:53.157	2026-05-29 09:38:53.156
cmpqqcg4h000bvbtgqx00okeo	cmp6rcekx000jvbnsh51qimh6	EMAIL	cliente@fumc.edu.co	Actualizacion de pedido	Tu pedido cambio a estado ENTREGADO.	ENVIADA	2026-05-29 09:38:59.874	2026-05-29 09:38:59.872
\.


--
-- Data for Name: OrdenDespacho; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."OrdenDespacho" (id, "pedidoId", "operadorId", estado, transportadora, "numeroGuia", "etiquetaUrl", "fechaDespacho", "fechaEntrega", "creadoEn", "actualizadoEn") FROM stdin;
cmp6rcely000rvbnskcuk7i9w	cmp6rcekx000jvbnsh51qimh6	cmp6rcehb0000vbnshrx3r4qr	ENTREGADO	Transportadora Demo	GUIA-DEMO-001	mock://etiqueta/GUIA-DEMO-001	2026-05-29 09:38:48.282	2026-05-29 09:38:59.863	2026-05-15 10:11:34.007	2026-05-29 09:38:59.864
\.


--
-- Data for Name: Pedido; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Pedido" (id, "vendedorId", "clienteId", estado, "totalBruto", "costoBase", "costoLogistico", "liquidacionVendedor", "guiaEstimada", "creadoEn", "actualizadoEn") FROM stdin;
cmp6rcekx000jvbnsh51qimh6	cmp6rcej40007vbnsaeayloz2	cmp6rcejm0009vbnslw5903zx	ENTREGADO	139800.00	84000.00	12000.00	43800.00	FUMC-DEMO-001	2026-05-15 10:11:33.969	2026-05-29 09:38:59.862
\.


--
-- Data for Name: PedidoEspecial; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PedidoEspecial" (id, "pedidoId", "vendedorId", "proveedorId", "fechaEstimada", estado, "condicionesPago", "creadoEn", "actualizadoEn") FROM stdin;
\.


--
-- Data for Name: Producto; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Producto" (id, sku, nombre, descripcion, marca, categoria, "precioCosto", "precioBase", "stockActual", "stockMinimo", "tiempoDespacho", activo, imagenes, "proveedorId", "creadoEn", "actualizadoEn") FROM stdin;
cmp6rcejx000bvbnsrl6426xq	FUMC-TEC-002	Smartwatch deportivo	Reloj inteligente con monitoreo basico y bateria de larga duracion.	PulseOne	Tecnologia	86000.00	139900.00	14	5	24 horas	t	["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"]	cmp6rceiv0005vbnsshuc9y7f	2026-05-15 10:11:33.933	2026-05-15 10:11:33.933
cmp6rcejx000cvbns4762dunp	FUMC-ACC-003	Mochila antirrobo urbana	Mochila resistente al agua con compartimento para portatil.	UrbanWay	Accesorios	62000.00	99900.00	4	6	48 horas	t	["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"]	cmp6rceiv0005vbnsshuc9y7f	2026-05-15 10:11:33.933	2026-05-15 10:11:33.933
cmp6rcejx000dvbnsd8qsp79m	FUMC-HOG-004	Lampara LED recargable	Lampara de escritorio con tres tonos de luz y carga USB.	Luma	Hogar	38000.00	64900.00	0	10	Sujeto a reabastecimiento	t	["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80"]	cmp6rceim0004vbns14l85c15	2026-05-15 10:11:33.933	2026-05-15 10:11:33.933
cmp6rcejx000avbns7yotq3nj	FUMC-HOG-001	Organizador modular de cocina	Set apilable para despensa y cocina con material lavable.	CasaFlex	Hogar	42000.00	69900.00	34	8	24-48 horas	t	["https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=600&q=80"]	cmp6rceim0004vbns14l85c15	2026-05-15 10:11:33.933	2026-05-15 10:11:33.986
\.


--
-- Data for Name: Proveedor; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Proveedor" (id, "razonSocial", nit, ciudad, contacto, "terminosPago", categorias, "creadoEn", "actualizadoEn") FROM stdin;
cmp6rceim0004vbns14l85c15	Aliados Hogar SAS	900123456-1	Medellin	compras@aliadoshogar.co	30 dias	{Hogar,Cocina,Organizacion}	2026-05-15 10:11:33.886	2026-05-15 10:11:33.886
cmp6rceiv0005vbnsshuc9y7f	TecnoFulfillment SAS	901654321-8	Bogota	operaciones@tecnofulfillment.co	Anticipo 50%	{Tecnologia,Accesorios,Fitness}	2026-05-15 10:11:33.895	2026-05-15 10:11:33.895
\.


--
-- Data for Name: Usuario; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Usuario" (id, nombre, email, "passwordHash", rol, activo, "creadoEn", "actualizadoEn") FROM stdin;
cmp6rcehb0000vbnshrx3r4qr	Operador Bodega	bodega@fumc.edu.co	$2b$12$WrTQoywxHJpCUs8yLaovX.hLKFdJulHp4M5LtVmvZJIdZBl61tkym	OPERADOR_BODEGA	t	2026-05-15 10:11:33.839	2026-05-15 10:11:33.839
cmp6rcei60001vbns9lp2925e	Administrador FUMC	admin@fumc.edu.co	$2b$12$1p5T0uOnJYYwbZURdMAEKeVfUBExhk.MJEF5JL6TTCAPHKqDp7YNS	ADMINISTRADOR	t	2026-05-15 10:11:33.839	2026-05-15 10:11:33.839
cmp6rcei60002vbnspiks0209	Cliente Final Demo	cliente@fumc.edu.co	$2b$12$B39fI9//Uk98QdcvJlOY1uGgxAgwFZaPmGt0WZSBHJFR1fKzRvQIu	CLIENTE_FINAL	t	2026-05-15 10:11:33.839	2026-05-15 10:11:33.839
cmp6rceia0003vbnsz0x81c5k	Vendedor Demo	vendedor@fumc.edu.co	$2b$12$e4Vf.3paYoweRW.xWIWj/eCY128MgnrVKqrfpDlyWcBDoACnnDctW	VENDEDOR_EXTERNO	t	2026-05-15 10:11:33.839	2026-05-15 10:11:33.839
\.


--
-- Data for Name: VendedorExterno; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."VendedorExterno" (id, "userId", "nombreEmpresa", ciudad, direccion, telefono, "datosBancarios", "tokenIntegracion", tiendas, "creadoEn", "actualizadoEn") FROM stdin;
cmp6rcej40007vbnsaeayloz2	cmp6rceia0003vbnsz0x81c5k	Tienda Aliada Demo	Cali	Carrera 10 #20-30	+57 300 000 0000	Banco Demo - Cuenta de ahorros terminada en 1234	demo-shopify-token	{https://tienda-demo.example.com}	2026-05-15 10:11:33.904	2026-05-15 10:11:33.904
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
8ebc9843-d63d-4122-97fc-8eea7485dd66	72c4473ec65cc0ad9be37416fb35073831cfcc17105e55b4525cc387fe845eb2	2026-05-15 10:11:18.672249+00	20260515101118_init	\N	\N	2026-05-15 10:11:18.200567+00	1
\.


--
-- Name: Cliente Cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Cliente"
    ADD CONSTRAINT "Cliente_pkey" PRIMARY KEY (id);


--
-- Name: Factura Factura_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Factura"
    ADD CONSTRAINT "Factura_pkey" PRIMARY KEY (id);


--
-- Name: LineaPedido LineaPedido_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LineaPedido"
    ADD CONSTRAINT "LineaPedido_pkey" PRIMARY KEY (id);


--
-- Name: Liquidacion Liquidacion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Liquidacion"
    ADD CONSTRAINT "Liquidacion_pkey" PRIMARY KEY (id);


--
-- Name: MovimientoInventario MovimientoInventario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MovimientoInventario"
    ADD CONSTRAINT "MovimientoInventario_pkey" PRIMARY KEY (id);


--
-- Name: Notificacion Notificacion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notificacion"
    ADD CONSTRAINT "Notificacion_pkey" PRIMARY KEY (id);


--
-- Name: OrdenDespacho OrdenDespacho_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrdenDespacho"
    ADD CONSTRAINT "OrdenDespacho_pkey" PRIMARY KEY (id);


--
-- Name: PedidoEspecial PedidoEspecial_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PedidoEspecial"
    ADD CONSTRAINT "PedidoEspecial_pkey" PRIMARY KEY (id);


--
-- Name: Pedido Pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Pedido"
    ADD CONSTRAINT "Pedido_pkey" PRIMARY KEY (id);


--
-- Name: Producto Producto_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Producto"
    ADD CONSTRAINT "Producto_pkey" PRIMARY KEY (id);


--
-- Name: Proveedor Proveedor_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Proveedor"
    ADD CONSTRAINT "Proveedor_pkey" PRIMARY KEY (id);


--
-- Name: Usuario Usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Usuario"
    ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY (id);


--
-- Name: VendedorExterno VendedorExterno_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."VendedorExterno"
    ADD CONSTRAINT "VendedorExterno_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Cliente_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Cliente_userId_key" ON public."Cliente" USING btree ("userId");


--
-- Name: Factura_pedidoId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Factura_pedidoId_key" ON public."Factura" USING btree ("pedidoId");


--
-- Name: Liquidacion_pedidoId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Liquidacion_pedidoId_key" ON public."Liquidacion" USING btree ("pedidoId");


--
-- Name: MovimientoInventario_fecha_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "MovimientoInventario_fecha_idx" ON public."MovimientoInventario" USING btree (fecha);


--
-- Name: MovimientoInventario_tipo_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "MovimientoInventario_tipo_idx" ON public."MovimientoInventario" USING btree (tipo);


--
-- Name: OrdenDespacho_pedidoId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "OrdenDespacho_pedidoId_key" ON public."OrdenDespacho" USING btree ("pedidoId");


--
-- Name: PedidoEspecial_pedidoId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "PedidoEspecial_pedidoId_key" ON public."PedidoEspecial" USING btree ("pedidoId");


--
-- Name: Pedido_creadoEn_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Pedido_creadoEn_idx" ON public."Pedido" USING btree ("creadoEn");


--
-- Name: Pedido_estado_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Pedido_estado_idx" ON public."Pedido" USING btree (estado);


--
-- Name: Producto_categoria_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Producto_categoria_idx" ON public."Producto" USING btree (categoria);


--
-- Name: Producto_marca_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Producto_marca_idx" ON public."Producto" USING btree (marca);


--
-- Name: Producto_nombre_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Producto_nombre_idx" ON public."Producto" USING btree (nombre);


--
-- Name: Producto_sku_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Producto_sku_key" ON public."Producto" USING btree (sku);


--
-- Name: Producto_stockActual_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Producto_stockActual_idx" ON public."Producto" USING btree ("stockActual");


--
-- Name: Proveedor_nit_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Proveedor_nit_key" ON public."Proveedor" USING btree (nit);


--
-- Name: Usuario_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Usuario_email_key" ON public."Usuario" USING btree (email);


--
-- Name: VendedorExterno_tokenIntegracion_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "VendedorExterno_tokenIntegracion_key" ON public."VendedorExterno" USING btree ("tokenIntegracion");


--
-- Name: VendedorExterno_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "VendedorExterno_userId_key" ON public."VendedorExterno" USING btree ("userId");


--
-- Name: Cliente Cliente_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Cliente"
    ADD CONSTRAINT "Cliente_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Usuario"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Factura Factura_pedidoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Factura"
    ADD CONSTRAINT "Factura_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES public."Pedido"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LineaPedido LineaPedido_pedidoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LineaPedido"
    ADD CONSTRAINT "LineaPedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES public."Pedido"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LineaPedido LineaPedido_productoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LineaPedido"
    ADD CONSTRAINT "LineaPedido_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES public."Producto"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Liquidacion Liquidacion_pedidoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Liquidacion"
    ADD CONSTRAINT "Liquidacion_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES public."Pedido"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Liquidacion Liquidacion_vendedorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Liquidacion"
    ADD CONSTRAINT "Liquidacion_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES public."VendedorExterno"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MovimientoInventario MovimientoInventario_productoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MovimientoInventario"
    ADD CONSTRAINT "MovimientoInventario_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES public."Producto"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MovimientoInventario MovimientoInventario_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MovimientoInventario"
    ADD CONSTRAINT "MovimientoInventario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public."Usuario"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Notificacion Notificacion_pedidoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Notificacion"
    ADD CONSTRAINT "Notificacion_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES public."Pedido"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: OrdenDespacho OrdenDespacho_operadorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrdenDespacho"
    ADD CONSTRAINT "OrdenDespacho_operadorId_fkey" FOREIGN KEY ("operadorId") REFERENCES public."Usuario"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: OrdenDespacho OrdenDespacho_pedidoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrdenDespacho"
    ADD CONSTRAINT "OrdenDespacho_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES public."Pedido"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PedidoEspecial PedidoEspecial_pedidoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PedidoEspecial"
    ADD CONSTRAINT "PedidoEspecial_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES public."Pedido"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PedidoEspecial PedidoEspecial_proveedorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PedidoEspecial"
    ADD CONSTRAINT "PedidoEspecial_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES public."Proveedor"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PedidoEspecial PedidoEspecial_vendedorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PedidoEspecial"
    ADD CONSTRAINT "PedidoEspecial_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES public."VendedorExterno"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Pedido Pedido_clienteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Pedido"
    ADD CONSTRAINT "Pedido_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES public."Cliente"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Pedido Pedido_vendedorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Pedido"
    ADD CONSTRAINT "Pedido_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES public."VendedorExterno"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Producto Producto_proveedorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Producto"
    ADD CONSTRAINT "Producto_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES public."Proveedor"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: VendedorExterno VendedorExterno_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."VendedorExterno"
    ADD CONSTRAINT "VendedorExterno_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Usuario"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict 87qeTH0zRARLRos1VKvNykGyrlIh7UCa5UEDxawfLWU294lC7ge3lNmUzE8aq0L


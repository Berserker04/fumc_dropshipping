# Formulacion del Proyecto Software FUMC

## 1. Identificacion del Proyecto

**Nombre:** Software FUMC - Plataforma de Gestion de Inventario y Dropshipping como Servicio  
**Version documental:** 1.0  
**Fecha base:** 2026-03-29  
**Fuente principal:** `docs/documents/SRS_Software_FUMC (1).pdf` y diagramas UML FUMC en HTML  
**Tipo de proyecto:** Aplicacion web full stack academica con arquitectura preparada para evolucion productiva

Software FUMC es una plataforma web para centralizar inventario, catalogo, pedidos, despacho, trazabilidad logistica, liquidaciones y reportes en un modelo de dropshipping/fulfillment. El operador administra inventario fisico y lo ofrece a vendedores externos, quienes pueden vender productos sin almacenar stock propio. La plataforma gestiona el ciclo operativo desde la publicacion del catalogo hasta la entrega al cliente final y el calculo de ganancias del vendedor.

## 2. Problema y Oportunidad

El negocio actualmente depende de procesos manuales dispersos, hojas de calculo y canales informales para coordinar inventario, vendedores, pedidos, despacho y seguimiento. Esto genera baja trazabilidad, riesgo de vender productos sin stock, reprocesos en bodega, poca visibilidad para vendedores y dificultad para calcular liquidaciones.

La oportunidad es construir una solucion centralizada que permita:

- Exponer inventario disponible a vendedores externos.
- Registrar pedidos manuales o provenientes de integraciones futuras.
- Controlar stock, movimientos, devoluciones y pedidos especiales.
- Gestionar preparacion, despacho, guia y estado logistico.
- Calcular liquidaciones de vendedores descontando precio base y costos logisticos.
- Obtener reportes operativos de ventas, inventario, logistica y rendimiento.

## 3. Objetivo General

Diseñar e implementar una plataforma web full stack, responsiva y multirol que permita gestionar inventario propio y ofrecerlo como servicio para vendedores externos bajo un modelo de dropshipping/fulfillment, con trazabilidad de pedidos, despacho, liquidaciones y reportes.

## 4. Objetivos Especificos

- Implementar un catalogo publico y privado con busqueda, filtros, imagenes, SKU, precio base, margen sugerido y disponibilidad.
- Gestionar autenticacion, sesiones seguras y autorizacion por rol.
- Administrar productos, proveedores, stock minimo, stock actual, movimientos e importacion/exportacion futura.
- Registrar vendedores externos, clientes finales, tiendas conectadas y datos de liquidacion.
- Procesar pedidos con validacion de stock, descuento automatico, facturacion basica y orden de despacho.
- Soportar pedidos especiales/preventas cuando no exista stock suficiente.
- Gestionar el ciclo logistico desde preparacion hasta entrega, devolucion o reintento.
- Calcular liquidaciones por vendedor y generar reportes operativos.
- Dejar adaptadores preparados para integraciones reales de correo, imagenes, transportadoras y e-commerce.

## 5. Alcance V1: MVP Academico

El MVP tendra backend real, datos persistidos y flujos funcionales principales. Las integraciones externas se implementaran como interfaces/adaptadores mock para permitir sustitucion posterior por servicios reales.

### Incluido en MVP

- Sitio publico con catalogo, busqueda y filtros basicos.
- Login multirol para administrador, operador de bodega, vendedor externo y cliente final.
- Proteccion de rutas y permisos por rol.
- CRUD operativo de productos, proveedores y stock.
- Registro de movimientos de inventario.
- Gestion de vendedores externos y clientes.
- Creacion de pedidos manuales desde portal de vendedor.
- Validacion de stock, bloqueo ante stock cero y generacion de pedido especial por faltante.
- Ordenes de despacho con estados logisticos.
- Generacion simulada de etiqueta/guia.
- Liquidacion de vendedor por pedido entregado.
- Reportes basicos de pedidos, ventas, inventario critico y tasa de devolucion.
- Notificaciones simuladas registradas en base de datos.
- Documentacion tecnica, manual basico de usuario y criterios de aceptacion.

### Fuera del MVP

- Pasarelas de pago reales Wompi/PayU.
- WhatsApp Business real.
- Chatbot con IA.
- BI avanzado o analisis predictivo.
- Integracion contable con Siigo, World Office u otros ERP.
- App movil nativa para bodega.
- Expansion internacional.
- Marketplace publico completo.

## 6. Actores y Roles

| Rol | Descripcion | Capacidades principales |
| --- | --- | --- |
| Administrador | Usuario con control total del sistema | Gestionar productos, proveedores, usuarios, inventario, parametros, reportes y cancelaciones |
| Operador de bodega | Usuario operativo de fulfillment | Registrar entradas/salidas, preparar pedidos, confirmar empaque, generar guia y actualizar estados logisticos |
| Vendedor externo | Dropshipper o empresa aliada | Explorar catalogo, crear pedidos, revisar estados, consultar liquidaciones e integrar tienda futura |
| Cliente final | Comprador receptor del producto | Consultar estado de entrega y recibir notificaciones |
| Sistema externo e-commerce | Tienda conectada en fase posterior | Enviar pedidos mediante API/webhook validado |

## 7. Requisitos Funcionales Consolidados

| ID | Requisito | MVP |
| --- | --- | --- |
| RF-001 | Mostrar pagina de inicio/catalogo con informacion de empresa, CTA y beneficios | Si |
| RF-002 | Buscar y filtrar catalogo por nombre, categoria, marca, precio y stock | Si |
| RF-003 | Mostrar imagen, SKU, precio base, margen sugerido, stock y tiempo de despacho | Si |
| RF-004 | Incluir formulario/contacto, mailto, tel y ubicacion de bodega | Parcial |
| RF-005 | Permitir login por rol | Si |
| RF-006 | Proteger rutas y funciones por rol | Si |
| RF-007 | Sesiones seguras, restablecimiento y 2FA para administradores | Parcial: sesiones seguras; 2FA fase posterior |
| RF-008 | Crear, editar, inactivar y consultar productos | Si |
| RF-009 | Gestionar stock en tiempo real, alertas y bloqueo en cero | Si |
| RF-010 | Registrar entradas, salidas, ajustes y devoluciones | Si |
| RF-011 | Importar/exportar inventario CSV/Excel | Posterior |
| RF-012 | Soportar multiples imagenes y sincronizacion con tiendas | Parcial: imagenes; sincronizacion mock |
| RF-013 | Gestionar proveedores | Si |
| RF-014 | Relacionar proveedores con productos e historial de ordenes | Parcial |
| RF-015 | Registrar vendedores externos con datos de liquidacion | Si |
| RF-016 | Asociar tiendas online mediante token API | Parcial: token registrado, sin integracion real |
| RF-017 | Historial de pedidos, liquidaciones, devoluciones y metricas por vendedor | Si |
| RF-018 | Registrar clientes finales para trazabilidad | Si |
| RF-019 | Recibir pedidos por API o ingreso manual | Parcial: ingreso manual y adaptador API mock |
| RF-020 | Descontar stock al confirmar pedido y actualizar tienda | Parcial: descuento real, tienda mock |
| RF-021 | Generar factura/documento equivalente por pedido | Parcial: documento interno simulado |
| RF-022 | Historial de ventas con filtros y exportacion | Parcial: filtros; exportacion posterior |
| RF-023 | Calcular liquidacion de ganancias por vendedor | Si |
| RF-024 | Crear ordenes de despacho con operador, transportadora y guia | Si |
| RF-025 | Soportar ciclo de estados logisticos | Si |
| RF-026 | Generar e imprimir etiquetas compatibles con transportadoras | Parcial: etiqueta simulada |
| RF-027 | Consolidar costos logisticos por pedido | Si |
| RF-028 | Crear pedido especial/preventa por stock insuficiente | Si |
| RF-029 | Registrar vendedor, proveedor, fecha estimada, estado y condiciones | Si |
| RF-030 | Notificar al vendedor al recibir stock | Parcial: notificacion mock |
| RF-031 | Reportes de ventas por vendedor, producto, categoria, periodo y estado | Parcial |
| RF-032 | Reportes de inventario, rotacion, stock critico y reabastecimiento | Parcial |
| RF-033 | Notificaciones por correo y/o WhatsApp | Parcial: correo/WhatsApp mock |
| RF-034 | Dashboard ejecutivo con KPIs en tiempo real | Si |

## 8. Requisitos No Funcionales

| Categoria | Requisito |
| --- | --- |
| Desempeno | Dashboards criticos deben cargar en menos de 2 segundos en condiciones normales; busqueda y filtros deben responder en menos de 1 segundo para hasta 50.000 productos como objetivo de arquitectura |
| Concurrencia | La arquitectura debe apuntar a 500 vendedores concurrentes sin degradacion perceptible |
| Seguridad | JWT con cookies seguras, bcrypt, autorizacion por rol, validacion Zod, proteccion contra inyeccion SQL via Prisma y rate limiting futuro |
| Trazabilidad | Pedidos, inventario y liquidaciones deben registrar eventos/auditoria y no modificarse sin rastro |
| Calidad | Interfaz consistente, accesible WCAG 2.1 AA, codigo modular, pruebas unitarias e integracion sobre flujos principales |
| Disponibilidad | Meta productiva 99.5% mensual; backups diarios y retencion de 30 dias en despliegue productivo |
| Recuperacion | RTO maximo objetivo de 4 horas |
| Legal | Adecuacion a Ley 1581 de 2012, Ley 1480 de 2011 y resoluciones DIAN aplicables |

## 9. Arquitectura Tecnica

### Stack

- Frontend: Next.js App Router, React, TypeScript, Tailwind CSS y componentes estilo shadcn/ui.
- Backend: Route Handlers y Server Actions.
- Datos: PostgreSQL, Prisma ORM y migraciones versionadas.
- Validacion: Zod en limites de entrada.
- Seguridad: JWT en cookie httpOnly, bcrypt para contraseñas, permisos por rol.
- Pruebas: Vitest para logica de dominio; pruebas E2E futuras con Playwright.
- Despliegue: Vercel, Railway, Render o AWS con PostgreSQL gestionado.

### Capas

1. **Presentacion:** catalogo publico, dashboard administrador, panel bodega, portal vendedor y seguimiento cliente.
2. **Aplicacion:** acciones de servidor para autenticacion, inventario, pedidos, despacho, reportes y notificaciones.
3. **Dominio:** reglas de stock, transiciones de pedido, liquidaciones, permisos y eventos.
4. **Infraestructura:** Prisma/PostgreSQL, adaptadores mock de correo, storage, transportadoras y e-commerce.

## 10. Modelo de Dominio

Entidades principales:

- `Usuario`: credenciales, rol, estado y relacion con vendedor/cliente.
- `Producto`: SKU, nombre, descripcion, categoria, marca, precios, stock, imagenes y proveedor.
- `Proveedor`: razon social, NIT, ciudad, contacto, terminos de pago y categorias.
- `VendedorExterno`: empresa/persona, ciudad, datos bancarios, token de integracion y tiendas.
- `Cliente`: datos de contacto y direccion de entrega.
- `Pedido`: vendedor, cliente, estado, totales, costo logistico y liquidacion.
- `LineaPedido`: producto, cantidad, precio unitario y subtotal.
- `OrdenDespacho`: operador, transportadora, guia, estado y fechas.
- `Factura`: documento interno equivalente, total y estado.
- `MovimientoInventario`: entradas, salidas, ajustes y devoluciones.
- `PedidoEspecial`: preventa por faltante, proveedor, fecha estimada y condiciones.
- `Liquidacion`: ganancia del vendedor, costos descontados y estado de pago.
- `Notificacion`: canal, destinatario, mensaje, estado y referencia.

Estados de pedido:

`Recibido -> Confirmado -> EnPreparacion -> Empacado -> Despachado -> EnTransito -> Entregado`

Ramas:

- `Recibido -> PedidoEspecial -> Confirmado`
- `Recibido/Confirmado -> Cancelado`
- `EnTransito -> Devuelto -> EnPreparacion` para reintento
- `Devuelto -> cierre por devolucion final`

## 11. Reglas de Negocio

- Un pedido solo puede confirmarse si existe stock suficiente para todas sus lineas.
- Si no hay stock suficiente, el sistema debe crear pedido especial/preventa y notificar fecha estimada.
- El stock no puede quedar negativo.
- Cada movimiento de stock debe guardar tipo, cantidad, usuario, fecha y referencia.
- La liquidacion del vendedor se calcula como: total de venta - costo base de productos - costo logistico.
- Solo administrador puede cancelar pedidos confirmados.
- Operador de bodega puede avanzar estados logisticos operativos.
- Vendedor solo puede ver sus pedidos y liquidaciones.
- Cliente final solo puede consultar estados de sus pedidos.
- Las integraciones externas deben entrar por adaptadores para no contaminar reglas de dominio.

## 12. Patrones de Diseno Aplicables

- **Strategy:** calculo de costos logisticos, liquidaciones y reglas futuras por transportadora.
- **Adapter:** correo, WhatsApp, storage, transportadoras, Shopify/WooCommerce.
- **Observer/Eventos:** notificaciones ante cambios de estado, stock recibido y pedido entregado.
- **State:** transiciones validas del pedido y orden de despacho.
- **Pure Fabrication:** servicios tecnicos como repositorios, notificadores y adaptadores externos.

## 13. Roadmap de 12 Semanas

| Semana | Enfoque | Entregable |
| --- | --- | --- |
| 1 | Requisitos y alcance | SRS consolidado, documento maestro y backlog |
| 2 | Arquitectura y datos | Modelo Prisma, permisos, flujos principales |
| 3 | Base de proyecto | Next.js, Tailwind, auth, layout, seed inicial |
| 4 | Catalogo e inventario | Productos, proveedores, stock y movimientos |
| 5 | Portal vendedor | Catalogo privado, clientes y creacion de pedidos |
| 6 | Pedidos y stock | Validacion, descuento, pedido especial y factura simulada |
| 7 | Bodega y despacho | Ordenes, estados, guia y devoluciones |
| 8 | Liquidaciones | Calculo, historico y consulta por vendedor |
| 9 | Reportes | KPIs, inventario critico y ventas por estado |
| 10 | QA funcional | Pruebas unitarias/integracion, correccion de defectos |
| 11 | Endurecimiento | Accesibilidad, errores, logging y documentacion |
| 12 | Despliegue | Build productivo, seed demo, manuales y entrega |

## 14. Presupuesto de Referencia

Segun la plantilla de presupuesto localizada en `docs/documents/plantilla_presupuesto_software (1) 1.docx`:

- Subtotal: COP $45.300.000
- Contingencia: COP $4.530.000
- Impuestos: COP $9.467.700
- Total propuesta: COP $59.297.700
- Duracion estimada: 12 semanas
- Forma de pago sugerida: 30% anticipo, 40% durante desarrollo, 30% contra entrega

Planes de soporte sugeridos:

- Basico: COP $500.000 / mes
- Estandar: COP $900.000 / mes
- Premium: COP $1.500.000 / mes

## 15. Riesgos Principales

| Riesgo | Impacto | Mitigacion |
| --- | --- | --- |
| Alcance excesivo para MVP | Alto | Separar integraciones reales y BI avanzado para fase posterior |
| Reglas de stock incorrectas | Alto | Pruebas unitarias, transacciones y bloqueo de stock negativo |
| Complejidad en integraciones logisticas | Medio | Usar adaptadores mock y contratos claros |
| Datos sensibles de vendedores/clientes | Alto | Cookies httpOnly, bcrypt, permisos por rol y validacion server-side |
| Bajo rendimiento en catalogo grande | Medio | Indices por SKU, nombre, categoria, marca y stock |
| Falta de claridad legal/DIAN | Medio | Manejar factura como documento interno en MVP y documentar integracion futura |

## 16. Criterios de Aceptacion del MVP

- Un administrador puede iniciar sesion, crear proveedores/productos y ajustar stock.
- El catalogo publico muestra productos activos y permite buscar/filtrar.
- Un vendedor puede crear un pedido manual para un cliente final.
- Si hay stock, el pedido queda confirmado, descuenta inventario, genera factura simulada y orden de despacho.
- Si no hay stock, el pedido queda como pedido especial y se registra fecha estimada.
- Un operador puede avanzar una orden por preparacion, empaque, despacho, transito, entrega o devolucion.
- Al entregar un pedido, el sistema calcula liquidacion del vendedor.
- El dashboard muestra KPIs de pedidos, ingresos, productos despachados, devoluciones e inventario critico.
- Las notificaciones mock quedan registradas ante confirmacion, despacho, entrega y pedido especial.
- Las rutas no autorizadas redirigen o bloquean segun rol.
- Las pruebas unitarias cubren permisos, stock, liquidacion y transiciones de estado.

## 17. Trazabilidad Documental

- `SRS_Software_FUMC (1).pdf`: fuente canonica de alcance, requisitos RF/RNF, actores y tecnologia.
- Diagramas FUMC HTML: fuente de clases, componentes, casos de uso, secuencia, estados y actividad de despacho.
- `srs_template-ieee (1).docx` y diagramas SGIM: antecedente conceptual de inventario SaaS/multiempresa, no fuente canonica.
- Plantillas de presupuesto: referencia de costo, duracion y soporte.
- Workbook TSPI: referencia de planeacion academica, fases, riesgos y seguimiento.

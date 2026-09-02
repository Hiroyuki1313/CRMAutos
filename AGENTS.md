<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Autosuz 1.0 — Contexto Maestro del Proyecto y Reglas de Desarrollo

Este documento define la arquitectura, flujos de negocio, modelo de permisos y lineamientos técnicos para el desarrollo en **Autosuz 1.0**. Cualquier agente o desarrollador que trabaje en esta base de código debe ceñirse estrictamente a estas especificaciones.

---

## 1. Visión y Propósito del Sistema

**Autosuz 1.0** es una plataforma integral de **CRM y ERP automotriz** para agencias de seminuevos. Su objetivo es gobernar el ciclo de vida completo del negocio:
1. **Inventario y Costeo Fino**: Control de stock, días en patio, cálculo de reacondicionamiento (11 rubros mecánicos y estéticos) y márgenes de utilidad (proyectada vs. real).
2. **CRM y Embudo Comercial**: Seguimiento de prospectos multicanal (piso, pauta digital, redes y WhatsApp bot), citas, pruebas de manejo y expedientes crediticios.
3. **Módulo de Avalúos**: Tasación física y financiera de vehículos ofrecidos a cambio (tomas a cuenta).
4. **Cierre de Ventas y Finanzas**: Registro transaccional de ventas, comisiones, retorno de inversión (ROI) y analítica ejecutiva (KPIs de rotación y efectividad de asesores).

---

## 2. Stack Tecnológico

| Capa | Tecnología | Notas clave |
|---|---|---|
| **Framework** | Next.js 15.1.10 (App Router) | React 19. `params`, `searchParams` y `cookies()` son asíncronos (`await`). |
| **Estilos** | Tailwind CSS v4 + Vanilla CSS tokens | Variables CSS de marca definidas en `globals.css`. |
| **Iconografía** | Lucide React | Consistencia de íconos en toda la interfaz. |
| **Base de Datos** | MySQL (con `mysql2/promise` pool) | Consultas SQL directas y parametrizadas (`?`) en repositorios. Transacciones ACID manuales. |
| **Autenticación** | JWT con `jose` + Bcrypt.js | Sesión HttpOnly en cookie `autosuz_session`. Verificación en `middleware.ts`. |
| **Procesamiento de Medios** | Sharp | Toda imagen subida se optimiza y convierte a `.webp`. |
| **Almacenamiento** | `StorageProvider` (SFTP Hostinger / Local Disk) | Conmutación transparente según variables de entorno. |
| **Reportes** | jsPDF + jsPDF-AutoTable | Generación de reportes ejecutivos en PDF descargables. |
| **Automatización** | Twilio + OpenAI (`gpt-4o-mini`) | Webhook de WhatsApp con calificador de prospectos y bot conversacional. |

---

## 3. Arquitectura del Código (Clean Architecture / Hexagonal)

```
src/
├── app/                       # Rutas Next.js (App Router)
│   ├── (dashboard)/           # Layout autenticado universal con Sidebar lateral
│   │   ├── inicio/            # Dashboard bifurcado (Gerencial vs. Vendedor)
│   │   ├── auto/              # Catálogo, nuevo auto, detalle (/auto/[id]) y edición
│   │   ├── clientes/          # Directorio de clientes y alta (/clientes/nuevo)
│   │   ├── cliente/[id]/      # Perfil de cliente, expediente y bitácora
│   │   ├── apartados/         # CRM comercial interactivo (SeguimientosTable)
│   │   ├── apartado/[id]/     # Detalle de apartado y crédito
│   │   ├── avaluos/           # Bandeja, registro (/avaluos/nuevo) y dictamen (/avaluos/[id])
│   │   ├── ventas/            # Centro de mando financiero directivo (Centro de Utilidad, KPIs)
│   │   └── usuarios/nuevo/    # Creación de cuentas de staff
│   ├── api/                   # Webhooks y rutas de soporte (/api/uploads, /api/whatsapp/webhook)
│   └── login/                 # Formulario de acceso y persistencia
├── core/
│   ├── domain/
│   │   ├── entities/          # Auto, Cliente, Apartado, Avaluo, Venta, Usuario, etc.
│   │   ├── repositories/      # Interfaces (IAutoRepository, IClientRepository, etc.)
│   │   └── services/          # Lógica de cálculo pura:
│   │       ├── AutoFinancialCalculator.ts  # Costeo total, reacondicionamiento y precio sugerido
│   │       ├── CentroUtilidadService.ts    # ROI, utilidades reales y alertas de antigüedad
│   │       └── ReportesKPIService.ts       # Rotación de inventario, conversión y marketing
│   └── usecases/              # authService.ts, autoService.ts, salesService.ts
├── infrastructure/
│   ├── db/                    # Pool MySQL (`connection.ts`) y esquemas SQL
│   ├── repositories/          # Implementaciones MySQL (MySQLAutoRepository, etc.)
│   ├── services/              # StorageProvider, SFTPStorageService, LocalStorageService, Sharp, Twilio, OpenAI
│   └── utils/                 # storageUtils.ts (uploadFileGeneric, deleteFileGeneric)
└── presentation/
    ├── components/            # Atomic design: molecules y organisms (tablas, carruseles, modales)
    ├── hooks/                 # useDragAndDrop, etc.
    └── utils/                 # imageUtils, formatters
```

---

## 4. Control de Acceso Basado en Roles (RBAC)

Los roles soportados son: `director`, `gerente`, `vendedor`, `ti`, `redes`.

| Módulo / Acción | `director` | `gerente` | `vendedor` | Regla / Comportamiento |
|---|:---:|:---:|:---:|---|
| **/inicio** | Vista Gerencial | Vista Gerencial | Vista Vendedor | Gerencia ve métricas de equipo; vendedor ve su propio tráfico. |
| **/ventas** | ✅ Total | ❌ Bloqueado | ❌ Bloqueado | Solo `director` puede auditar utilidades y transacciones de venta. |
| **/clientes** (Directorio) | ✅ Total | ✅ Total | ❌ Oculto | Oculto al vendedor en navbar; solo gerencia y dirección tienen acceso global. |
| **/avaluos** (Bandeja) | ✅ Total | ✅ Total | ⚠️ Parcial | Oculto en navbar al vendedor; solo puede tasar si viene de un apartado propio. |
| **Costos y Precios de Autos** | ✅ Edición | ✅ Edición | 👁️ Solo lectura | Vendedor solo ve precio sugerido; no puede editar márgenes ni compras. |
| **Reasignación de Asesores** | ✅ Sí | ✅ Sí | ❌ No | Solo gerencia/dirección puede transferir prospectos o clientes entre asesores. |
| **Crear Usuarios Staff** | ✅ Sí | ❌ No | ❌ No | Exclusivo del `director`. |

---

## 5. Reglas de Negocio y Ciclos de Vida Críticos

### A. Ciclo de Vida del Vehículo (`autos.estado_logico`)
- **`frio`**: Vehículo en proceso de avalúo/tasación. **No aparece** en el catálogo de `/`.
- **`inventario`**: Unidad disponible en patio. Se muestra en el catálogo y puede ser apartada.
  - **Alerta de Permanencia**:
    - `< 90 días`: Estado normal.
    - `90 - 119 días`: Alerta de riesgo (amarillo).
    - `≥ 120 días`: Alerta crítica de permanencia (rojo).
- **`venta`**: Unidad vendida y entregada. Sale del catálogo principal y pasa al historial de ventas.

### B. Fórmula Financiera de Inversión Total (`AutoFinancialCalculator`)
$$\text{Total Invertido} = \text{Costo Adquisición} + \sum(\text{11 Rubros de Acondicionamiento}) + \text{Publicidad} + \text{Gestión Adm.} + \text{Comisión}$$
*Los 11 rubros de reacondicionamiento son: llantas, pintura, mecánica general, refacciones, accesorios, limpieza/estética, tapicería, odómetros, pulido, servicios mecánicos preventivos y reparaciones mecánicas correctivas.*

### C. Ciclo Comercial y Transacción de Venta (ACID)
Al confirmar una venta desde un seguimiento comercial (`confirmSaleFromSeguimientoAction`), se ejecuta una transacción estricta de 6 pasos:
1. Verifica que el seguimiento tenga un auto asignado.
2. Suma los costos de acondicionamiento acumulados en `autos`.
3. Sincroniza o crea el registro en `clientes` con `probabilidad = 'venta'` y copia sus documentos (INE, comprobante de domicilio, estados de cuenta, licencia, seguro).
4. Inserta el registro oficial en la tabla `ventas` con el precio de cierre y los costos.
5. Cambia el vehículo a `autos.estado_logico = 'venta'`.
6. Marca el seguimiento en `apartados` con `estatus_credito = 'vendido'` y `probabilidad = 'Venta'`.

### D. Flujo de Avalúos y Promoción a Inventario
Cuando un cliente ofrece un auto a cambio:
1. Se registra en `avaluos/nuevo` como un auto con `estado_logico = 'frio'`.
2. Se evalúan compras, ofertas y hoja de avalúo.
3. Si la gerencia dictamina el estado como `'toma'`, el auto pasa automáticamente a `estado_logico = 'inventario'` con `fecha_registro_inventario = NOW()`, incorporándose de inmediato al catálogo disponible.

### E. Detección de Teléfonos Duplicados
- Al registrar un prospecto o nuevo cliente, el sistema valida en tiempo real si el número ya existe en `clientes` o `apartados`. Si coincide, advierte de inmediato indicando a qué asesor pertenece para evitar duplicidades o conflictos entre vendedores.

---

## 6. Convenciones de Código y Buenas Prácticas

1. **Next.js 15 Asincronía**:
   - Resuelve siempre `params` y `searchParams` con `await` en páginas y layouts:
     ```typescript
     export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ q?: string }> }) {
       const { id } = await params;
       const { q } = await searchParams;
     }
     ```
   - Resuelve `await cookies()` antes de leer o escribir cookies.
2. **Server Actions**:
   - Todo archivo de acción debe declarar `'use server';` en la primera línea.
   - Valida siempre la sesión del usuario (`getSession()`) y sus permisos antes de mutar datos.
   - Invoca `revalidatePath('/ruta')` tras cualquier mutación para invalidar la caché del App Router.
3. **Persistencia y Archivos**:
   - No guardes archivos directamente con `fs` en producción. Usa siempre `uploadFileGeneric` o `StorageProvider.getStorageService(...)`.
   - Toda imagen debe pasar por `SharpImageProcessor.optimize(buffer)` para garantizar compresión `.webp`.
4. **Base de Datos**:
   - Usa siempre queries parametrizadas con `?` en `pool.query(...)`.
   - Las bitácoras de notas (`comentarios_vendedor` y `comentarios_historial`) se almacenan como arrays serializados en JSON con `{ date, text, author/user, tipo_accion }`.
5. **Componentes React**:
   - Mantén componentes de servidor (Server Components) por defecto para el fetch de datos.
   - Usa componentes cliente (`'use client';`) únicamente donde se requiera estado local (`useState`, `useTransition`), listeners del navegador o interactividad reactiva.


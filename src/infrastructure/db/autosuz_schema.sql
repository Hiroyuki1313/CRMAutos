-- Archivo: src/infrastructure/db/autosuz_schema.sql
-- Diseño de Base de Datos para Autosuz 1.0 (MVP)
-- Estructura alineada con el modelo de Dominio (Hexagonal) y los principios SOLID.

CREATE TABLE IF NOT EXISTS Usuarios (
    id CHAR(36) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    rol VARCHAR(50) NOT NULL, -- Gerente, Vendedor, Admin
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Vehiculos (
    id CHAR(36) PRIMARY KEY,
    vin VARCHAR(100) UNIQUE NOT NULL,
    folio_interno VARCHAR(50) UNIQUE NOT NULL,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    anio INT NOT NULL,
    version VARCHAR(100),
    kilometraje DECIMAL(10, 2) DEFAULT 0,
    estado VARCHAR(50) DEFAULT 'DISPONIBLE', -- DISPONIBLE, APARTADO, VENDIDO, ACONDICIONAMIENTO
    precio_compra DECIMAL(12, 2) NOT NULL DEFAULT 0,
    precio_min_autorizado DECIMAL(12, 2) NOT NULL DEFAULT 0,
    precio_objetivo DECIMAL(12, 2) NOT NULL DEFAULT 0,
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SRP: Tabla dedicada exclusivamente al costeo y transacciones de los vehículos
CREATE TABLE IF NOT EXISTS GastosCosteo (
    id CHAR(36) PRIMARY KEY,
    vehiculo_id CHAR(36) NOT NULL,
    categoria VARCHAR(100) NOT NULL, -- Mecanico, Pintura, Llantas, Marketing
    monto DECIMAL(12, 2) NOT NULL,
    fecha_gasto TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    descripcion TEXT,
    FOREIGN KEY (vehiculo_id) REFERENCES Vehiculos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Prospectos (
    id CHAR(36) PRIMARY KEY,
    usuario_asignado_id CHAR(36), -- FK a Usuarios (Vendedor)
    vehiculo_interes_id CHAR(36), -- FK a Vehiculos
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    ciudad VARCHAR(100),
    origen VARCHAR(50), -- FACEBOOK, TIKTOK, INSTAGRAM, WHATSAPP, REFERIDO
    etapa_embudo VARCHAR(50) DEFAULT 'NUEVO', 
    score_financiamiento VARCHAR(50) DEFAULT 'NO_APLICA', -- ALTA, MEDIA, BAJA, NO_APLICA
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_asignado_id) REFERENCES Usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (vehiculo_interes_id) REFERENCES Vehiculos(id) ON DELETE SET NULL
);

-- Seguimientos del CRM. Maneja la Alerta Roja
CREATE TABLE IF NOT EXISTS Seguimientos (
    id CHAR(36) PRIMARY KEY,
    prospecto_id CHAR(36) NOT NULL,
    fecha_actividad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_proxima_accion TIMESTAMP NOT NULL,
    tipo_accion VARCHAR(50) NOT NULL, -- Llamada, Mensaje, Cita
    notas TEXT,
    completado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (prospecto_id) REFERENCES Prospectos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ApartadosVentas (
    id CHAR(36) PRIMARY KEY,
    vehiculo_id CHAR(36) NOT NULL,
    prospecto_id CHAR(36) NOT NULL,
    monto_apartado DECIMAL(12, 2) NOT NULL,
    fecha_apartado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(50) DEFAULT 'ACTIVO', -- ACTIVO, CONCRETADO, CANCELADO
    FOREIGN KEY (vehiculo_id) REFERENCES Vehiculos(id),
    FOREIGN KEY (prospecto_id) REFERENCES Prospectos(id)
);

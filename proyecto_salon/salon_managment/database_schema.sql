-- ============================================================================
-- Script de Creación de Base de Datos: Salon Management System
-- Base de Datos: salon_managment
-- Motor: MySQL
-- ============================================================================

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS salon_managment CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE salon_managment;

-- ============================================================================
-- TABLA: roles
-- Descripción: Gestiona los diferentes roles de usuarios en el sistema
-- ============================================================================
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) DEFAULT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_roles_name (name),
    INDEX idx_roles_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA: members
-- Descripción: Miembros del sistema (empleados)
-- Información personal y detalles de cada empleado que ofrece servicios
-- ============================================================================
CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(15) DEFAULT NULL,
    membership_start_date DATE NOT NULL,
    membership_end_date DATE DEFAULT NULL,
    specialty VARCHAR(255) DEFAULT NULL,
    rol_id INT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_members_email (email),
    INDEX idx_members_rol_id (rol_id),
    INDEX idx_members_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA: clients
-- Descripción: Clientes del sistema
-- Información básica de clientes que reciben servicios
-- ============================================================================
CREATE TABLE IF NOT EXISTS clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    number_id VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(15) DEFAULT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_clients_number_id (number_id),
    INDEX idx_clients_email (email),
    INDEX idx_clients_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA: category_services
-- Descripción: Categorías para servicios
-- Permite organizar y clasificar servicios en diferentes grupos
-- ============================================================================
CREATE TABLE IF NOT EXISTS category_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) DEFAULT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category_services_name (name),
    INDEX idx_category_services_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA: category_products
-- Descripción: Categorías para productos
-- Permite organizar y clasificar productos en diferentes grupos
-- ============================================================================
CREATE TABLE IF NOT EXISTS category_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) DEFAULT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category_products_name (name),
    INDEX idx_category_products_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA: services
-- Descripción: Servicios ofrecidos por el salón
-- Información completa de servicios: categoría, precio, duración
-- ============================================================================
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_service_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) DEFAULT NULL,
    price FLOAT NOT NULL,
    duration_minutes INT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_service_id) REFERENCES category_services(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_services_category_id (category_service_id),
    INDEX idx_services_name (name),
    INDEX idx_services_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA: products
-- Descripción: Productos del sistema
-- Inventario de productos con categoría, precio y stock
-- ============================================================================
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category_product_id INT NOT NULL,
    description VARCHAR(255) DEFAULT NULL,
    price FLOAT NOT NULL,
    stock INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_product_id) REFERENCES category_products(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_products_category_id (category_product_id),
    INDEX idx_products_name (name),
    INDEX idx_products_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA: appointments
-- Descripción: Citas programadas
-- Gestiona citas entre clientes y miembros con fecha y estado
-- ============================================================================
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    member_id INT NOT NULL,
    scheduled_date DATETIME NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_appointments_client_id (client_id),
    INDEX idx_appointments_member_id (member_id),
    INDEX idx_appointments_scheduled_date (scheduled_date),
    INDEX idx_appointments_status (status),
    INDEX idx_appointments_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA: promotions
-- Descripción: Promociones y descuentos
-- Gestiona promociones con tipo de descuento, valor y fechas de vigencia
-- ============================================================================
CREATE TABLE IF NOT EXISTS promotions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) DEFAULT NULL,
    discount_type VARCHAR(50) NOT NULL COMMENT 'porcentual o fijo',
    discount_value FLOAT NOT NULL COMMENT 'valor del descuento',
    start_date DATETIME NOT NULL COMMENT 'fecha de inicio de la promoción',
    end_date DATETIME NOT NULL COMMENT 'fecha de fin de la promoción',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_promotions_name (name),
    INDEX idx_promotions_dates (start_date, end_date),
    INDEX idx_promotions_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA: additionals
-- Descripción: Elementos adicionales en citas
-- Servicios extra o productos adicionales agregados a una cita
-- ============================================================================
CREATE TABLE IF NOT EXISTS additionals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL,
    concept VARCHAR(255) DEFAULT NULL,
    price FLOAT NOT NULL DEFAULT 0.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_additionals_appointment_id (appointment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA: appointment_services
-- Descripción: Relación entre citas y servicios
-- Una cita puede tener múltiples servicios asociados
-- ============================================================================
CREATE TABLE IF NOT EXISTS appointment_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL,
    service_id INT NOT NULL,
    price_applied INT NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_appointment_services_appointment_id (appointment_id),
    INDEX idx_appointment_services_service_id (service_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA: service_products
-- Descripción: Relación entre servicios de citas y productos utilizados
-- Vincula productos específicos utilizados durante un servicio en una cita
-- ============================================================================
CREATE TABLE IF NOT EXISTS service_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_service_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity_product INT NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_service_id) REFERENCES appointment_services(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_service_products_appointment_service_id (appointment_service_id),
    INDEX idx_service_products_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA: service_promotions
-- Descripción: Relación entre servicios y promociones
-- Vincula múltiples promociones a servicios específicos
-- ============================================================================
CREATE TABLE IF NOT EXISTS service_promotions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id INT NOT NULL,
    promotion_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_service_promotions_service_id (service_id),
    INDEX idx_service_promotions_promotion_id (promotion_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA: marketing
-- Descripción: Campañas de marketing
-- Gestiona campañas de marketing y promociones asociadas
-- ============================================================================
CREATE TABLE IF NOT EXISTS marketing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) DEFAULT NULL,
    media_url VARCHAR(255) DEFAULT NULL,
    promotion_id INT DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_date DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_marketing_name (name),
    INDEX idx_marketing_promotion_id (promotion_id),
    INDEX idx_marketing_is_active (is_active),
    INDEX idx_marketing_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA: marketing_items
-- Descripción: Elementos de marketing
-- Productos o servicios específicos asociados a campañas de marketing
-- ============================================================================
CREATE TABLE IF NOT EXISTS marketing_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marketing_id INT NOT NULL,
    item_type VARCHAR(100) NOT NULL COMMENT 'producto o servicio',
    service_id INT DEFAULT NULL,
    product_id INT DEFAULT NULL,
    price_promotion FLOAT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (marketing_id) REFERENCES marketing(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_marketing_items_marketing_id (marketing_id),
    INDEX idx_marketing_items_service_id (service_id),
    INDEX idx_marketing_items_product_id (product_id),
    INDEX idx_marketing_items_item_type (item_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
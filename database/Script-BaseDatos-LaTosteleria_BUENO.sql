-- Base de datos La Tostelería
-- Script limpio para MariaDB 10.4.32 / XAMPP
-- Ejecutar sobre una instalación limpia.

CREATE DATABASE IF NOT EXISTS `latosteleria`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `latosteleria`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Creación de tablas en orden de dependencias

-- Tabla: categorias
CREATE TABLE `categorias` (
`id_categoria` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_categoria` varchar(100) NOT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: estaciones
CREATE TABLE `estaciones` (
`id_estacion` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_estacion` varchar(100) NOT NULL,
  PRIMARY KEY (`id_estacion`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: ingredientes
CREATE TABLE `ingredientes` (
`id_ingrediente` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_ingrediente` varchar(100) NOT NULL,
  PRIMARY KEY (`id_ingrediente`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: menus
CREATE TABLE `menus` (
`id_menu` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_menu` varchar(100) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_menu`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: repartidores
CREATE TABLE `repartidores` (
`id_repartidor` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `vehiculo` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_repartidor`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: roles
CREATE TABLE `roles` (
`id_rol` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_rol` varchar(50) NOT NULL,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: combos
CREATE TABLE `combos` (
`id_combo` int(11) NOT NULL AUTO_INCREMENT,
  `categoria_id` int(11) NOT NULL,
  `nombre_combo` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio_especial` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_combo`),
  KEY `fk_combos_categorias` (`categoria_id`),
  CONSTRAINT `fk_combos_categorias` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id_categoria`) ON UPDATE CASCADE,
  `activo` TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: productos
CREATE TABLE `productos` (
`id_producto` int(11) NOT NULL AUTO_INCREMENT,
  `categoria_id` int(11) NOT NULL,
  `nombre_producto` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_producto`),
  UNIQUE KEY `uk_productos_nombre` (`nombre_producto`),
  KEY `fk_productos_categorias` (`categoria_id`),
  CONSTRAINT `fk_productos_categorias` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id_categoria`) ON UPDATE CASCADE,
  `activo` TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: usuarios
CREATE TABLE `usuarios` (
`id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `rol_id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(150) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `token_recuperacion` varchar(255) DEFAULT NULL,
  `fecha_expiracion_token` datetime DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `uk_usuarios_correo` (`correo`),
  KEY `fk_usuarios_roles` (`rol_id`),
  CONSTRAINT `fk_usuarios_roles` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id_rol`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: combo_producto
CREATE TABLE `combo_producto` (
`combo_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`combo_id`,`producto_id`),
  KEY `fk_combo_prod_productos` (`producto_id`),
  CONSTRAINT `fk_combo_prod_combos` FOREIGN KEY (`combo_id`) REFERENCES `combos` (`id_combo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_combo_prod_productos` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id_producto`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: direcciones_envio
CREATE TABLE `direcciones_envio` (
`id_direccion` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `detalles` text NOT NULL,
  `referencias` text DEFAULT NULL,
  `costo_zona` decimal(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id_direccion`),
  KEY `fk_direcciones_usuarios` (`usuario_id`),
  CONSTRAINT `fk_direcciones_usuarios` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: menu_items
CREATE TABLE `menu_items` (
`id_item` int(11) NOT NULL AUTO_INCREMENT,
  `menu_id` int(11) NOT NULL,
  `producto_id` int(11) DEFAULT NULL,
  `combo_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_item`),
  KEY `fk_menu_items_menus` (`menu_id`),
  KEY `fk_menu_items_productos` (`producto_id`),
  KEY `fk_menu_items_combos` (`combo_id`),
  CONSTRAINT `fk_menu_items_combos` FOREIGN KEY (`combo_id`) REFERENCES `combos` (`id_combo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_menu_items_menus` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id_menu`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_menu_items_productos` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: pedidos
CREATE TABLE `pedidos` (
`id_pedido` int(11) NOT NULL AUTO_INCREMENT,
  `cliente_id` int(11) NOT NULL,
  `estado_id` int(11) NOT NULL,
  `metodo_entrega` enum('Domicilio','Tienda') NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `impuestos` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `costo_envio` decimal(10,2) NOT NULL DEFAULT 0.00,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_pedido`),
  KEY `fk_pedidos_usuarios` (`cliente_id`),
  CONSTRAINT `fk_pedidos_usuarios` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: procesos_preparacion
CREATE TABLE `procesos_preparacion` (
`id_proceso` int(11) NOT NULL AUTO_INCREMENT,
  `producto_id` int(11) NOT NULL,
  `estacion_id` int(11) NOT NULL,
  `orden_paso` int(11) NOT NULL,
  `tiempo_estimado_minutos` int(11) NOT NULL,
  PRIMARY KEY (`id_proceso`),
  KEY `fk_procesos_productos` (`producto_id`),
  KEY `fk_procesos_estaciones` (`estacion_id`),
  CONSTRAINT `fk_procesos_estaciones` FOREIGN KEY (`estacion_id`) REFERENCES `estaciones` (`id_estacion`) ON UPDATE CASCADE,
  CONSTRAINT `fk_procesos_productos` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: producto_ingrediente
CREATE TABLE `producto_ingrediente` (
`producto_id` int(11) NOT NULL,
  `ingrediente_id` int(11) NOT NULL,
  PRIMARY KEY (`producto_id`,`ingrediente_id`),
  KEY `fk_prod_ing_ingredientes` (`ingrediente_id`),
  CONSTRAINT `fk_prod_ing_ingredientes` FOREIGN KEY (`ingrediente_id`) REFERENCES `ingredientes` (`id_ingrediente`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_prod_ing_productos` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: detalle_pedido
CREATE TABLE `detalle_pedido` (
`id_detalle` int(11) NOT NULL AUTO_INCREMENT,
  `pedido_id` int(11) NOT NULL,
  `producto_id` int(11) DEFAULT NULL,
  `combo_id` int(11) DEFAULT NULL,
  `cantidad` int(11) NOT NULL,
  `observaciones` text DEFAULT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `fk_detalle_pedidos` (`pedido_id`),
  KEY `fk_detalle_productos` (`producto_id`),
  KEY `fk_detalle_combos` (`combo_id`),
  CONSTRAINT `fk_detalle_combos` FOREIGN KEY (`combo_id`) REFERENCES `combos` (`id_combo`) ON UPDATE CASCADE,
  CONSTRAINT `fk_detalle_pedidos` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id_pedido`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_detalle_productos` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id_producto`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: pagos_simulados
CREATE TABLE `pagos_simulados` (
`id_pago` int(11) NOT NULL AUTO_INCREMENT,
  `pedido_id` int(11) NOT NULL,
  `metodo_pago` enum('Tarjeta','Efectivo') NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha_pago` datetime NOT NULL DEFAULT current_timestamp(),
  `ultimos_cuatro_digitos` char(4) DEFAULT NULL,
  `marca_tarjeta` varchar(50) DEFAULT NULL,
  `monto_recibido` decimal(10,2) DEFAULT NULL,
  `vuelto` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_pago`),
  KEY `fk_pagos_pedidos` (`pedido_id`),
  CONSTRAINT `fk_pagos_pedidos` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id_pedido`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: seguimiento_pedido
CREATE TABLE `seguimiento_pedido` (
`id_seguimiento` int(11) NOT NULL AUTO_INCREMENT,
  `pedido_id` int(11) NOT NULL,
  `repartidor_id` int(11) DEFAULT NULL,
  `estado_nombre` varchar(100) NOT NULL,
  `fecha_hora` datetime NOT NULL DEFAULT current_timestamp(),
  `comentario` text DEFAULT NULL,
  `latitud` decimal(10,8) DEFAULT NULL,
  `longitud` decimal(11,8) DEFAULT NULL,
  PRIMARY KEY (`id_seguimiento`),
  KEY `fk_seguimiento_pedidos` (`pedido_id`),
  KEY `fk_seguimiento_repartidores` (`repartidor_id`),
  CONSTRAINT `fk_seguimiento_pedidos` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id_pedido`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_seguimiento_repartidores` FOREIGN KEY (`repartidor_id`) REFERENCES `repartidores` (`id_repartidor`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserción de datos

-- Datos: categorias
INSERT INTO `categorias` VALUES (1,'Bebidas'),(2,'Tostadas'),(3,'Postres');

-- Datos: estaciones
INSERT INTO `estaciones` VALUES (1,'Preparación'),(2,'Cocción'),(3,'Decoración');

-- Datos: ingredientes
INSERT INTO `ingredientes` VALUES (1,'Café espresso'),(2,'Leche'),(3,'Pan artesanal'),(4,'Aguacate'),(5,'Queso crema'),(6,'Galleta'),(7,'Chocolate'),(8,'Harina'),(9,'Azúcar');

-- Datos: menus
INSERT INTO `menus` VALUES (1,'Menú Desayuno','2026-06-01','2026-12-31','07:00:00','10:30:00',1),(2,'Menú Almuerzo','2026-06-01','2026-12-31','11:00:00','14:00:00',1),(3,'Menú Tarde','2026-06-01','2026-12-31','14:00:00','17:30:00',1),(4,'Menú Especial','2026-06-01','2026-12-31','08:00:00','18:00:00',1);

-- Datos: repartidores
INSERT INTO `repartidores` VALUES (1,'Carlos Ramirez','8888-8888','Motocicleta'),(2,'Ana Mora','8777-7777','Automovil');

-- Datos: roles
INSERT INTO `roles` VALUES (1,'Administrador'),(2,'Cliente');

-- Datos: usuarios
-- Credenciales iniciales del administrador:
-- correo: admin@latosteleria.com
-- contrasena: Admin123!
INSERT INTO `usuarios` VALUES
(1,1,'Administrador General','admin@latosteleria.com','$2y$10$8txu.MMIP0sB2AG.jPgGSuTM/j/mu9QyOscvjPMG4tsNPmmVOtSdu',NULL,NULL);

-- Datos: combos
INSERT INTO `combos` VALUES (1,1,'Combo Desayuno Tostelero','Incluye café latte, tostada de aguacate y cheesecake.',6500.00),(2,1,'Combo Dulce Café','Incluye café latte y cheesecake.',4000.00),(3,2,'Combo Merienda','Incluye café latte y brownie de chocolate',2800.00),(4,3,'Combo Postres','Incluye cheesecake y brownie',3500.00);

-- Datos: productos
INSERT INTO `productos` VALUES (1,1,'Café Latte','Café con leche espumada',1800.00,'cafe-latte.jpg'),(2,2,'Tostada de Aguacate','Tostada artesanal con aguacate fresco',3200.00,'tostada-aguacate.jpg'),(3,3,'Cheesecake','Postre frío con base de galleta',2500.00,'cheesecake.jpg'),(4,3,'Brownie Chocolate','Brownie artesanal de chocolate con textura suave',1500.00,'brownie.jpg');

-- Datos: combo_producto
INSERT INTO `combo_producto` VALUES (1,1,1),(1,2,1),(1,3,1),(2,1,1),(2,3,1),(3,1,1),(3,4,1),(4,3,1),(4,4,1);

-- Datos: menu_items
INSERT INTO `menu_items` VALUES (1,1,1,NULL),(2,1,2,NULL),(3,1,NULL,1),(4,2,2,NULL),(5,2,NULL,2),(6,3,3,NULL),(7,3,4,NULL),(8,3,NULL,3),(9,4,NULL,4);

-- Datos: procesos_preparacion
INSERT INTO `procesos_preparacion` VALUES (1,1,1,1,3),(2,2,1,1,4),(3,2,2,2,5),(4,3,1,1,6),(5,3,2,2,10),(6,3,3,3,4);

-- Datos: producto_ingrediente
INSERT INTO `producto_ingrediente` VALUES (1,1),(1,2),(2,3),(2,4),(3,5),(3,6),(4,7),(4,8),(4,9);

/* =====================================================
   DATOS ADICIONALES
   ===================================================== */

-- Nuevas categorías
INSERT INTO categorias (id_categoria,nombre_categoria) VALUES
(4,'Sandwiches'),
(5,'Frappés');

-- Nuevas estaciones
INSERT INTO estaciones (id_estacion,nombre_estacion) VALUES
(4,'Empaque'),
(5,'Bebidas Frías');

-- Nuevos ingredientes
INSERT INTO ingredientes VALUES
(10,'Jamón'),
(11,'Queso Mozzarella'),
(12,'Tomate'),
(13,'Albahaca'),
(14,'Pollo'),
(15,'Mantequilla'),
(16,'Canela'),
(17,'Helado de Vainilla'),
(18,'Caramelo'),
(19,'Fresas');

-- Nuevos menús
INSERT INTO menus VALUES
(5,'Menú Frappés','2026-06-01','2026-12-31','12:00:00','18:00:00',0),
(6,'Menú Fin de Semana','2026-06-01','2026-12-31','08:00:00','16:00:00',0);

-- Nuevos repartidores
INSERT INTO repartidores VALUES
(3,'Luis Hernández','8666-1111','Motocicleta'),
(4,'María Gómez','8555-2222','Bicicleta');

-- Nuevo rol
INSERT INTO roles VALUES
(3,'Empleado');

-- Nuevos productos
INSERT INTO productos VALUES
(5,1,'Cappuccino','Café espresso con espuma de leche',2000.00,'cappuccino.jpg'),
(6,1,'Chocolate Caliente','Chocolate caliente artesanal',2200.00,'chocolate-caliente.jpg'),
(7,2,'Tostada Caprese','Pan artesanal con tomate, mozzarella y albahaca',3500.00,'caprese.jpg'),
(8,2,'Sándwich de Pollo','Pan artesanal con pollo y queso',4200.00,'sandwich-pollo.jpg'),
(9,3,'Pie de Manzana','Pie artesanal con canela',2800.00,'pie-manzana.jpg'),
(10,5,'Frappé de Caramelo','Frappé con caramelo y crema batida',3200.00,'frappe-caramelo.jpg');

-- Nuevos combos
INSERT INTO combos VALUES
(5,1,'Combo Cappuccino','Cappuccino con cheesecake',4200.00),
(6,2,'Combo Caprese','Tostada Caprese y café latte',5000.00),
(7,5,'Combo Frappé Dulce','Frappé de Caramelo y Brownie',4500.00);

-- Relación combos-productos
INSERT INTO combo_producto VALUES
(5,5,1),
(5,3,1),
(6,7,1),
(6,1,1),
(7,10,1),
(7,4,1);

-- Nuevos elementos de menú
INSERT INTO menu_items VALUES
(10,5,10,NULL),
(11,5,NULL,7),
(12,6,5,NULL),
(13,6,7,NULL),
(14,6,8,NULL),
(15,6,NULL,6);

-- Procesos de preparación
INSERT INTO procesos_preparacion VALUES
(7,5,1,1,3),
(8,6,1,1,5),
(9,7,1,1,4),
(10,7,2,2,5),
(11,8,1,1,5),
(12,8,2,2,6),
(13,9,1,1,8),
(14,10,5,1,6);

-- Relación producto-ingrediente
INSERT INTO producto_ingrediente VALUES
(5,1),
(5,2),
(6,7),
(6,2),
(7,3),
(7,11),
(7,12),
(7,13),
(8,3),
(8,14),
(8,11),
(9,8),
(9,9),
(9,16),
(10,2),
(10,17),
(10,18);

SET FOREIGN_KEY_CHECKS = 1;

-- Fin del script
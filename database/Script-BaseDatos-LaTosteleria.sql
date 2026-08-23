-- Base de datos La Tostelería
-- Script final para MariaDB / XAMPP

CREATE DATABASE IF NOT EXISTS `latosteleria`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `latosteleria`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `seguimiento_pedido`;
DROP TABLE IF EXISTS `pagos_simulados`;
DROP TABLE IF EXISTS `detalle_pedido`;
DROP TABLE IF EXISTS `pedidos`;
DROP TABLE IF EXISTS `direcciones_envio`;
DROP TABLE IF EXISTS `menu_items`;
DROP TABLE IF EXISTS `combo_producto`;
DROP TABLE IF EXISTS `combos`;
DROP TABLE IF EXISTS `procesos_preparacion`;
DROP TABLE IF EXISTS `producto_ingrediente`;
DROP TABLE IF EXISTS `productos`;
DROP TABLE IF EXISTS `usuarios`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `repartidores`;
DROP TABLE IF EXISTS `menus`;
DROP TABLE IF EXISTS `ingredientes`;
DROP TABLE IF EXISTS `estaciones`;
DROP TABLE IF EXISTS `categorias`;

CREATE TABLE `categorias` (
  `id_categoria` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_categoria` varchar(100) NOT NULL,
  PRIMARY KEY (`id_categoria`),
  UNIQUE KEY `uk_categorias_nombre` (`nombre_categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `estaciones` (
  `id_estacion` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_estacion` varchar(100) NOT NULL,
  PRIMARY KEY (`id_estacion`),
  UNIQUE KEY `uk_estaciones_nombre` (`nombre_estacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `ingredientes` (
  `id_ingrediente` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_ingrediente` varchar(100) NOT NULL,
  PRIMARY KEY (`id_ingrediente`),
  UNIQUE KEY `uk_ingredientes_nombre` (`nombre_ingrediente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_rol` varchar(50) NOT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `uk_roles_nombre` (`nombre_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

CREATE TABLE `repartidores` (
  `id_repartidor` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `vehiculo` varchar(50) NOT NULL,
  `disponible` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_repartidor`),
  UNIQUE KEY `uk_repartidores_telefono` (`telefono`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `menus` (
  `id_menu` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_menu` varchar(100) NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_menu`),
  UNIQUE KEY `uk_menus_nombre` (`nombre_menu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL AUTO_INCREMENT,
  `categoria_id` int(11) NOT NULL,
  `nombre_producto` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_producto`),
  UNIQUE KEY `uk_productos_nombre` (`nombre_producto`),
  KEY `fk_productos_categorias` (`categoria_id`),
  CONSTRAINT `fk_productos_categorias` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id_categoria`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `combos` (
  `id_combo` int(11) NOT NULL AUTO_INCREMENT,
  `categoria_id` int(11) NOT NULL,
  `nombre_combo` varchar(100) NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `precio_especial` decimal(10,2) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_combo`),
  UNIQUE KEY `uk_combos_nombre` (`nombre_combo`),
  KEY `fk_combos_categorias` (`categoria_id`),
  CONSTRAINT `fk_combos_categorias` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id_categoria`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `combo_producto` (
  `combo_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`combo_id`,`producto_id`),
  KEY `fk_combo_prod_productos` (`producto_id`),
  CONSTRAINT `fk_combo_prod_combos` FOREIGN KEY (`combo_id`) REFERENCES `combos` (`id_combo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_combo_prod_productos` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id_producto`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `producto_ingrediente` (
  `producto_id` int(11) NOT NULL,
  `ingrediente_id` int(11) NOT NULL,
  PRIMARY KEY (`producto_id`,`ingrediente_id`),
  KEY `fk_prod_ing_ingredientes` (`ingrediente_id`),
  CONSTRAINT `fk_prod_ing_ingredientes` FOREIGN KEY (`ingrediente_id`) REFERENCES `ingredientes` (`id_ingrediente`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_prod_ing_productos` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `procesos_preparacion` (
  `id_proceso` int(11) NOT NULL AUTO_INCREMENT,
  `producto_id` int(11) NOT NULL,
  `estacion_id` int(11) NOT NULL,
  `orden_paso` int(11) NOT NULL,
  `tiempo_estimado_minutos` int(11) NOT NULL,
  PRIMARY KEY (`id_proceso`),
  UNIQUE KEY `uk_procesos_producto_estacion_orden` (`producto_id`,`estacion_id`,`orden_paso`),
  KEY `fk_procesos_productos` (`producto_id`),
  KEY `fk_procesos_estaciones` (`estacion_id`),
  CONSTRAINT `fk_procesos_estaciones` FOREIGN KEY (`estacion_id`) REFERENCES `estaciones` (`id_estacion`) ON UPDATE CASCADE,
  CONSTRAINT `fk_procesos_productos` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `direcciones_envio` (
  `id_direccion` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `detalles` text NOT NULL,
  `referencias` text DEFAULT NULL,
  `latitud` decimal(10,8) DEFAULT NULL,
  `longitud` decimal(11,8) DEFAULT NULL,
  `costo_zona` decimal(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id_direccion`),
  KEY `fk_direcciones_usuarios` (`usuario_id`),
  CONSTRAINT `fk_direcciones_usuarios` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `pedidos` (
  `id_pedido` int(11) NOT NULL AUTO_INCREMENT,
  `cliente_id` int(11) NOT NULL,
  `encargado_id` int(11) DEFAULT NULL,
  `estado_id` int(11) NOT NULL,
  `metodo_entrega` enum('Domicilio','Tienda') NOT NULL,
  `direccion_id` int(11) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `impuestos` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `costo_envio` decimal(10,2) NOT NULL DEFAULT 0.00,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_pedido`),
  KEY `fk_pedidos_usuarios` (`cliente_id`),
  KEY `fk_pedidos_encargado` (`encargado_id`),
  KEY `fk_pedidos_direccion` (`direccion_id`),
  CONSTRAINT `fk_pedidos_usuarios` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`id_usuario`) ON UPDATE CASCADE,
  CONSTRAINT `fk_pedidos_encargado` FOREIGN KEY (`encargado_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_pedidos_direccion` FOREIGN KEY (`direccion_id`) REFERENCES `direcciones_envio` (`id_direccion`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  CONSTRAINT `fk_menu_items_productos` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE,
  CHECK ((`producto_id` IS NOT NULL AND `combo_id` IS NULL) OR (`producto_id` IS NULL AND `combo_id` IS NOT NULL))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  CONSTRAINT `fk_detalle_productos` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id_producto`) ON UPDATE CASCADE,
  CHECK ((`producto_id` IS NOT NULL AND `combo_id` IS NULL) OR (`producto_id` IS NULL AND `combo_id` IS NOT NULL))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

INSERT INTO `categorias` (`id_categoria`, `nombre_categoria`)
SELECT 1, 'Bebidas' UNION ALL
SELECT 2, 'Tostadas' UNION ALL
SELECT 3, 'Postres' UNION ALL
SELECT 4, 'Sandwiches' UNION ALL
SELECT 5, 'Frappés';

INSERT INTO `estaciones` (`id_estacion`, `nombre_estacion`)
SELECT 1, 'Preparación' UNION ALL
SELECT 2, 'Cocción' UNION ALL
SELECT 3, 'Decoración' UNION ALL
SELECT 4, 'Empaque' UNION ALL
SELECT 5, 'Bebidas Frías';

INSERT INTO `ingredientes` (`id_ingrediente`, `nombre_ingrediente`)
SELECT 1, 'Café espresso' UNION ALL
SELECT 2, 'Leche' UNION ALL
SELECT 3, 'Pan artesanal' UNION ALL
SELECT 4, 'Aguacate' UNION ALL
SELECT 5, 'Queso crema' UNION ALL
SELECT 6, 'Galleta' UNION ALL
SELECT 7, 'Chocolate' UNION ALL
SELECT 8, 'Harina' UNION ALL
SELECT 9, 'Azúcar' UNION ALL
SELECT 10, 'Jamón' UNION ALL
SELECT 11, 'Queso Mozzarella' UNION ALL
SELECT 12, 'Tomate' UNION ALL
SELECT 13, 'Albahaca' UNION ALL
SELECT 14, 'Pollo' UNION ALL
SELECT 15, 'Mantequilla' UNION ALL
SELECT 16, 'Canela' UNION ALL
SELECT 17, 'Helado de Vainilla' UNION ALL
SELECT 18, 'Caramelo' UNION ALL
SELECT 19, 'Fresas' UNION ALL
SELECT 20, 'Masa de croissant' UNION ALL
SELECT 21, 'Salmón ahumado' UNION ALL
SELECT 22, 'Arándanos' UNION ALL
SELECT 23, 'Chispas de chocolate' UNION ALL
SELECT 24, 'Nueces' UNION ALL
SELECT 25, 'Vainilla' UNION ALL
SELECT 26, 'Matcha' UNION ALL
SELECT 27, 'Té negro' UNION ALL
SELECT 28, 'Limón' UNION ALL
SELECT 29, 'Crema batida';

INSERT INTO `roles` (`id_rol`, `nombre_rol`)
SELECT 1, 'Administrador' UNION ALL
SELECT 2, 'Cliente' UNION ALL
SELECT 3, 'Encargado' UNION ALL
SELECT 4, 'Cocina';

INSERT INTO `usuarios` (`id_usuario`, `rol_id`, `nombre`, `correo`, `contrasena`, `token_recuperacion`, `fecha_expiracion_token`)
SELECT 1, 1, 'Administrador General', 'admin@latosteleria.com', '$2y$10$ZKc.NCagjTWKETLuR71YtOkAEX9ybXBQJ7gyAhJnq4dW2P4xxrPxO', NULL, NULL UNION ALL
SELECT 2, 2, 'Cliente Demo', 'cliente@latosteleria.com', '$2y$10$soR8dBLDIblltcguYhhKLOy9cxCWUV3y21G.eGSUFDZpXkgthnDGS', NULL, NULL UNION ALL
SELECT 3, 3, 'Encargado Demo', 'encargado@latosteleria.com', '$2y$10$KuaE4FY.ch6xfduFJ6.nCej.4gF3CIg30OyjyuyDF1rPPjmWulhde', NULL, NULL UNION ALL
SELECT 4, 4, 'Cocina Demo', 'cocina@latosteleria.com', '$2y$10$ViCGWyoTQghrT4m6l/NMhuFOXXPB.wyroH32Y66kCMENbDMDtpkra', NULL, NULL;

INSERT INTO `repartidores` (`id_repartidor`, `nombre`, `telefono`, `vehiculo`, `disponible`)
SELECT 1, 'Carlos Ramirez', '8888-8888', 'Motocicleta', 1 UNION ALL
SELECT 2, 'Ana Mora', '8777-7777', 'Automovil', 1 UNION ALL
SELECT 3, 'Luis Hernández', '8666-1111', 'Motocicleta', 1 UNION ALL
SELECT 4, 'María Gómez', '8555-2222', 'Bicicleta', 1;

INSERT INTO `productos` (`id_producto`, `categoria_id`, `nombre_producto`, `descripcion`, `precio`, `imagen`, `activo`)
SELECT 1, 1, 'Cappuccino', 'Café espresso con espuma de leche', 2000.00, 'cappuccino.jpg', 1 UNION ALL
SELECT 2, 1, 'Chocolate Caliente', 'Chocolate caliente artesanal', 2200.00, 'chocolate-caliente.jpg', 1 UNION ALL
SELECT 3, 2, 'Tostada Caprese', 'Pan artesanal con tomate, mozzarella y albahaca', 3500.00, 'caprese.jpg', 1 UNION ALL
SELECT 4, 4, 'Sándwich de Pollo', 'Pan artesanal con pollo y queso', 4200.00, 'sandwich-pollo.jpg', 1 UNION ALL
SELECT 5, 3, 'Pie de Manzana', 'Pie artesanal con canela', 2800.00, 'pie-manzana.jpg', 1 UNION ALL
SELECT 6, 5, 'Frappé de Caramelo', 'Frappé con caramelo y crema batida', 3200.00, 'frappe-caramelo.jpg', 1 UNION ALL
SELECT 7, 2, 'Croissant de Jamón y Queso', 'Croissant horneado relleno de jamón y queso mozzarella', 3200.00, 'croissant-jamon-queso.jpg', 1 UNION ALL
SELECT 8, 3, 'Croissant de Chocolate', 'Croissant hojaldrado relleno de chocolate', 2800.00, 'croissant-chocolate.jpg', 1 UNION ALL
SELECT 9, 4, 'Sándwich de Jamón y Queso', 'Pan artesanal con jamón y queso mozzarella tostado', 3900.00, 'sandwich-jamon-queso.jpg', 1 UNION ALL
SELECT 10, 4, 'Panini Caprese', 'Panini caliente con tomate, mozzarella y albahaca', 4200.00, 'panini-caprese.jpg', 1 UNION ALL
SELECT 11, 2, 'Tostada de Salmón y Queso Crema', 'Pan artesanal con salmón ahumado y queso crema', 5200.00, 'tostada-salmon-queso-crema.jpg', 1 UNION ALL
SELECT 12, 4, 'Bagel de Pollo y Queso Crema', 'Bagel con pollo sazonado y queso crema', 4600.00, 'bagel-pollo-queso-crema.jpg', 1 UNION ALL
SELECT 13, 3, 'Muffin de Arándanos', 'Muffin artesanal con arándanos', 2200.00, 'muffin-arandanos.jpg', 1 UNION ALL
SELECT 14, 3, 'Galleta de Chispas de Chocolate', 'Galleta horneada con chispas de chocolate', 1600.00, 'galleta-chispas-chocolate.jpg', 1 UNION ALL
SELECT 15, 3, 'Cheesecake de Frutos Rojos', 'Cheesecake cremoso con salsa de frutos rojos', 3400.00, 'cheesecake-frutos-rojos.jpg', 1 UNION ALL
SELECT 16, 3, 'Brownie con Nueces', 'Brownie de chocolate con nueces tostadas', 2400.00, 'brownie-nueces.jpg', 1 UNION ALL
SELECT 17, 1, 'Espresso Doble', 'Doble carga de café espresso', 1800.00, 'espresso-doble.jpg', 1 UNION ALL
SELECT 18, 1, 'Americano', 'Café espresso suavizado con agua caliente', 1700.00, 'americano.jpg', 1 UNION ALL
SELECT 19, 1, 'Latte de Vainilla', 'Café espresso con leche y vainilla', 2600.00, 'latte-vainilla.jpg', 1 UNION ALL
SELECT 20, 1, 'Latte de Caramelo', 'Café espresso con leche y caramelo', 2700.00, 'latte-caramelo.jpg', 1 UNION ALL
SELECT 21, 1, 'Mocha', 'Café espresso con chocolate y leche', 2800.00, 'mocha.jpg', 1 UNION ALL
SELECT 22, 1, 'Café Macchiato', 'Espresso marcado con espuma de leche', 2100.00, 'cafe-macchiato.jpg', 1 UNION ALL
SELECT 23, 1, 'Matcha Latte', 'Bebida de matcha con leche espumada', 2900.00, 'matcha-latte.jpg', 1 UNION ALL
SELECT 24, 1, 'Chai Latte', 'Té chai especiado con leche', 2800.00, 'chai-latte.jpg', 1 UNION ALL
SELECT 25, 1, 'Té Frío de Limón', 'Té negro frío con limón', 2000.00, 'te-frio-limon.jpg', 1 UNION ALL
SELECT 26, 5, 'Frappé de Chocolate', 'Frappé frío de chocolate con crema batida', 3500.00, 'frappe-chocolate.jpg', 1;

INSERT INTO `producto_ingrediente` (`producto_id`, `ingrediente_id`)
SELECT 1, 1 UNION ALL SELECT 1, 2 UNION ALL
SELECT 2, 7 UNION ALL SELECT 2, 2 UNION ALL
SELECT 3, 3 UNION ALL SELECT 3, 12 UNION ALL SELECT 3, 11 UNION ALL SELECT 3, 13 UNION ALL
SELECT 4, 3 UNION ALL SELECT 4, 14 UNION ALL SELECT 4, 11 UNION ALL
SELECT 5, 8 UNION ALL SELECT 5, 9 UNION ALL SELECT 5, 16 UNION ALL
SELECT 6, 2 UNION ALL SELECT 6, 17 UNION ALL SELECT 6, 18 UNION ALL SELECT 6, 29 UNION ALL
SELECT 7, 20 UNION ALL SELECT 7, 10 UNION ALL SELECT 7, 11 UNION ALL
SELECT 8, 20 UNION ALL SELECT 8, 7 UNION ALL
SELECT 9, 3 UNION ALL SELECT 9, 10 UNION ALL SELECT 9, 11 UNION ALL
SELECT 10, 3 UNION ALL SELECT 10, 12 UNION ALL SELECT 10, 11 UNION ALL SELECT 10, 13 UNION ALL
SELECT 11, 3 UNION ALL SELECT 11, 21 UNION ALL SELECT 11, 5 UNION ALL
SELECT 12, 3 UNION ALL SELECT 12, 14 UNION ALL SELECT 12, 5 UNION ALL
SELECT 13, 8 UNION ALL SELECT 13, 9 UNION ALL SELECT 13, 22 UNION ALL SELECT 13, 15 UNION ALL
SELECT 14, 8 UNION ALL SELECT 14, 9 UNION ALL SELECT 14, 23 UNION ALL SELECT 14, 15 UNION ALL
SELECT 15, 5 UNION ALL SELECT 15, 6 UNION ALL SELECT 15, 19 UNION ALL
SELECT 16, 7 UNION ALL SELECT 16, 8 UNION ALL SELECT 16, 24 UNION ALL SELECT 16, 9 UNION ALL
SELECT 17, 1 UNION ALL
SELECT 18, 1 UNION ALL
SELECT 19, 1 UNION ALL SELECT 19, 2 UNION ALL SELECT 19, 25 UNION ALL
SELECT 20, 1 UNION ALL SELECT 20, 2 UNION ALL SELECT 20, 18 UNION ALL
SELECT 21, 1 UNION ALL SELECT 21, 2 UNION ALL SELECT 21, 7 UNION ALL
SELECT 22, 1 UNION ALL SELECT 22, 2 UNION ALL
SELECT 23, 26 UNION ALL SELECT 23, 2 UNION ALL
SELECT 24, 27 UNION ALL SELECT 24, 2 UNION ALL SELECT 24, 16 UNION ALL
SELECT 25, 27 UNION ALL SELECT 25, 28 UNION ALL SELECT 25, 9 UNION ALL
SELECT 26, 7 UNION ALL SELECT 26, 2 UNION ALL SELECT 26, 17 UNION ALL SELECT 26, 29;

INSERT INTO `procesos_preparacion` (`id_proceso`, `producto_id`, `estacion_id`, `orden_paso`, `tiempo_estimado_minutos`)
SELECT 1, 1, 1, 1, 3 UNION ALL
SELECT 2, 2, 1, 1, 5 UNION ALL
SELECT 3, 3, 1, 1, 5 UNION ALL
SELECT 4, 3, 2, 2, 7 UNION ALL
SELECT 5, 3, 4, 3, 2 UNION ALL
SELECT 6, 4, 1, 1, 5 UNION ALL
SELECT 7, 4, 2, 2, 6 UNION ALL
SELECT 8, 4, 4, 3, 2 UNION ALL
SELECT 9, 5, 1, 1, 8 UNION ALL
SELECT 10, 6, 1, 1, 6 UNION ALL
SELECT 11, 6, 5, 2, 4 UNION ALL
SELECT 12, 7, 1, 1, 8 UNION ALL
SELECT 13, 7, 2, 2, 15 UNION ALL
SELECT 14, 7, 4, 3, 2 UNION ALL
SELECT 15, 8, 1, 1, 7 UNION ALL
SELECT 16, 8, 2, 2, 15 UNION ALL
SELECT 17, 8, 4, 3, 2 UNION ALL
SELECT 18, 9, 1, 1, 5 UNION ALL
SELECT 19, 9, 2, 2, 6 UNION ALL
SELECT 20, 9, 4, 3, 2 UNION ALL
SELECT 21, 10, 1, 1, 5 UNION ALL
SELECT 22, 10, 2, 2, 7 UNION ALL
SELECT 23, 10, 4, 3, 2 UNION ALL
SELECT 24, 11, 1, 1, 5 UNION ALL
SELECT 25, 11, 3, 2, 3 UNION ALL
SELECT 26, 12, 1, 1, 6 UNION ALL
SELECT 27, 12, 2, 2, 5 UNION ALL
SELECT 28, 12, 4, 3, 2 UNION ALL
SELECT 29, 13, 1, 1, 8 UNION ALL
SELECT 30, 13, 2, 2, 20 UNION ALL
SELECT 31, 13, 4, 3, 2 UNION ALL
SELECT 32, 14, 1, 1, 6 UNION ALL
SELECT 33, 14, 2, 2, 12 UNION ALL
SELECT 34, 14, 4, 3, 1 UNION ALL
SELECT 35, 15, 1, 1, 8 UNION ALL
SELECT 36, 15, 3, 2, 4 UNION ALL
SELECT 37, 16, 1, 1, 7 UNION ALL
SELECT 38, 16, 2, 2, 20 UNION ALL
SELECT 39, 16, 4, 3, 2 UNION ALL
SELECT 40, 17, 1, 1, 3 UNION ALL
SELECT 41, 18, 1, 1, 3 UNION ALL
SELECT 42, 19, 1, 1, 4 UNION ALL
SELECT 43, 19, 3, 2, 2 UNION ALL
SELECT 44, 20, 1, 1, 4 UNION ALL
SELECT 45, 20, 3, 2, 2 UNION ALL
SELECT 46, 21, 1, 1, 5 UNION ALL
SELECT 47, 21, 3, 2, 2 UNION ALL
SELECT 48, 22, 1, 1, 4 UNION ALL
SELECT 49, 22, 3, 2, 1 UNION ALL
SELECT 50, 23, 1, 1, 5 UNION ALL
SELECT 51, 23, 3, 2, 2 UNION ALL
SELECT 52, 24, 1, 1, 6 UNION ALL
SELECT 53, 24, 3, 2, 1 UNION ALL
SELECT 54, 25, 1, 1, 5 UNION ALL
SELECT 55, 25, 5, 2, 3 UNION ALL
SELECT 56, 26, 1, 1, 6 UNION ALL
SELECT 57, 26, 5, 2, 4 UNION ALL
SELECT 58, 26, 3, 3, 2;

INSERT INTO `combos` (`id_combo`, `categoria_id`, `nombre_combo`, `imagen`, `descripcion`, `precio_especial`, `activo`)
SELECT 1, 1, 'Combo Desayuno Tostelero', 'Combo Desayuno Tostelero.jpg', 'Incluye café latte, tostada de aguacate y cheesecake.', 6500.00, 1 UNION ALL
SELECT 2, 1, 'Combo Croissant Cafetero', 'Combo Croissant Cafetero.jpg', 'Croissant de jamón y queso con latte de vainilla', 5200.00, 1 UNION ALL
SELECT 3, 4, 'Combo Panini Caprese', 'Combo Panini Caprese.avif', 'Panini caprese con americano', 5500.00, 1 UNION ALL
SELECT 4, 3, 'Combo Muffin y Latte', 'Combo Muffin y Latte.webp', 'Muffin de arándanos con latte de caramelo', 4600.00, 1 UNION ALL
SELECT 5, 3, 'Combo Galleta y Café', 'Combo Galleta y Café.jpg', 'Galleta de chocolate con café macchiato', 3300.00, 1 UNION ALL
SELECT 6, 3, 'Combo Cheesecake Especial', 'Combo Cheesecake Especial.jpg', 'Cheesecake de frutos rojos con mocha', 5800.00, 1 UNION ALL
SELECT 7, 3, 'Combo Brownie Chocolate', 'Combo Brownie Chocolate.jpg', 'Brownie con nueces y chocolate caliente', 4200.00, 1 UNION ALL
SELECT 8, 5, 'Combo Merienda Completa', 'Combo Merienda Completa.jpg', 'Bagel de pollo, frappé de chocolate y cheesecake', 8900.00, 1 UNION ALL
SELECT 9, 1, 'Combo Cappuccino', 'Combo Cappuccino.jpg', 'Cappuccino con cheesecake', 4200.00, 1 UNION ALL
SELECT 10, 2, 'Combo Caprese', 'Combo Caprese.jpg', 'Tostada Caprese y café latte', 5000.00, 1 UNION ALL
SELECT 11, 5, 'Combo Frappé Dulce', 'Combo Frappé Dulce.webp', 'Frappé de Caramelo y Brownie', 4500.00, 1;

INSERT INTO `combo_producto` (`combo_id`, `producto_id`, `cantidad`)
SELECT 1, 19, 1 UNION ALL
SELECT 1, 3, 1 UNION ALL
SELECT 1, 15, 1 UNION ALL
SELECT 2, 7, 1 UNION ALL
SELECT 2, 19, 1 UNION ALL
SELECT 3, 10, 1 UNION ALL
SELECT 3, 18, 1 UNION ALL
SELECT 4, 13, 1 UNION ALL
SELECT 4, 20, 1 UNION ALL
SELECT 5, 14, 1 UNION ALL
SELECT 5, 22, 1 UNION ALL
SELECT 6, 15, 1 UNION ALL
SELECT 6, 21, 1 UNION ALL
SELECT 7, 16, 1 UNION ALL
SELECT 7, 2, 1 UNION ALL
SELECT 8, 12, 1 UNION ALL
SELECT 8, 26, 1 UNION ALL
SELECT 8, 15, 1 UNION ALL
SELECT 9, 1, 1 UNION ALL
SELECT 9, 15, 1 UNION ALL
SELECT 10, 3, 1 UNION ALL
SELECT 10, 19, 1 UNION ALL
SELECT 11, 6, 1 UNION ALL
SELECT 11, 16, 1;

INSERT INTO `menus` (`id_menu`, `nombre_menu`, `imagen`, `fecha_inicio`, `fecha_fin`, `hora_inicio`, `hora_fin`, `activo`)
SELECT 1, 'Menú Desayuno', 'Menú Desayuno.jpg', '2026-06-01', '2026-12-31', '07:00:00', '10:30:00', 1 UNION ALL
SELECT 2, 'Menú Almuerzo', 'Menú Almuerzo.webp', '2026-06-01', '2026-12-31', '11:00:00', '14:00:00', 1 UNION ALL
SELECT 3, 'Menú Tarde', 'Menú Tarde.jpg', '2026-06-01', '2026-12-31', '14:00:00', '17:30:00', 1 UNION ALL
SELECT 4, 'Menú Especial', 'Menú Especial.png', '2026-06-01', '2026-12-31', '08:00:00', '18:00:00', 1 UNION ALL
SELECT 5, 'Menú Frappés', 'Menú Frappés.jpg', '2026-06-01', '2026-12-31', '12:00:00', '18:00:00', 0 UNION ALL
SELECT 6, 'Menú Fin de Semana', 'Menú Fin de Semana.webp', '2026-06-01', '2026-12-31', '08:00:00', '16:00:00', 0 UNION ALL
SELECT 7, 'Menú 24/7', 'Menú 247.jpg', '2026-01-01', '2035-12-31', '00:00:00', '23:59:59', 1;

INSERT INTO `menu_items` (`menu_id`, `producto_id`, `combo_id`)
SELECT 1, 19, NULL UNION ALL
SELECT 1, 7, NULL UNION ALL
SELECT 1, 1, NULL UNION ALL
SELECT 1, NULL, 2 UNION ALL
SELECT 2, 10, NULL UNION ALL
SELECT 2, 11, NULL UNION ALL
SELECT 2, 26, NULL UNION ALL
SELECT 2, NULL, 3 UNION ALL
SELECT 3, 13, NULL UNION ALL
SELECT 3, 14, NULL UNION ALL
SELECT 3, 15, NULL UNION ALL
SELECT 3, 16, NULL UNION ALL
SELECT 3, NULL, 4 UNION ALL
SELECT 3, NULL, 7 UNION ALL
SELECT 4, 17, NULL UNION ALL
SELECT 4, 18, NULL UNION ALL
SELECT 4, 23, NULL UNION ALL
SELECT 4, 24, NULL UNION ALL
SELECT 4, NULL, 8 UNION ALL
SELECT 5, 6, NULL UNION ALL
SELECT 5, 26, NULL UNION ALL
SELECT 5, NULL, 11 UNION ALL
SELECT 6, 1, NULL UNION ALL
SELECT 6, 3, NULL UNION ALL
SELECT 6, 4, NULL UNION ALL
SELECT 6, NULL, 10 UNION ALL
SELECT 7, 1, NULL UNION ALL
SELECT 7, 2, NULL UNION ALL
SELECT 7, 3, NULL UNION ALL
SELECT 7, 4, NULL UNION ALL
SELECT 7, 5, NULL UNION ALL
SELECT 7, 6, NULL UNION ALL
SELECT 7, 7, NULL UNION ALL
SELECT 7, 8, NULL UNION ALL
SELECT 7, 9, NULL UNION ALL
SELECT 7, 10, NULL UNION ALL
SELECT 7, 11, NULL UNION ALL
SELECT 7, 12, NULL UNION ALL
SELECT 7, 13, NULL UNION ALL
SELECT 7, 14, NULL UNION ALL
SELECT 7, 15, NULL UNION ALL
SELECT 7, 16, NULL UNION ALL
SELECT 7, 17, NULL UNION ALL
SELECT 7, 18, NULL UNION ALL
SELECT 7, 19, NULL UNION ALL
SELECT 7, 20, NULL UNION ALL
SELECT 7, 21, NULL UNION ALL
SELECT 7, 22, NULL UNION ALL
SELECT 7, 23, NULL UNION ALL
SELECT 7, 24, NULL UNION ALL
SELECT 7, 25, NULL UNION ALL
SELECT 7, 26, NULL UNION ALL
SELECT 7, NULL, 1 UNION ALL
SELECT 7, NULL, 2 UNION ALL
SELECT 7, NULL, 3 UNION ALL
SELECT 7, NULL, 4 UNION ALL
SELECT 7, NULL, 5 UNION ALL
SELECT 7, NULL, 6 UNION ALL
SELECT 7, NULL, 7 UNION ALL
SELECT 7, NULL, 8 UNION ALL
SELECT 7, NULL, 9 UNION ALL
SELECT 7, NULL, 10 UNION ALL
SELECT 7, NULL, 11;

SET FOREIGN_KEY_CHECKS = 1;

-- Fin del script
-- Base de datos La Tostelería
-- Script unificado para MariaDB 10.4.32 / XAMPP
-- Incluye cambios de avances 3 y 5, entrega/direcciones, encargado de pedido y procesos adicionales
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
  `nombre` varchar(100) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `vehiculo` varchar(50) NOT NULL,
  `disponible` tinyint(1) NOT NULL DEFAULT 1,
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
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_combo`),
  KEY `fk_combos_categorias` (`categoria_id`),
  CONSTRAINT `fk_combos_categorias` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id_categoria`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: productos
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
  `latitud` decimal(10,8) DEFAULT NULL,
  `longitud` decimal(11,8) DEFAULT NULL,
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
INSERT INTO `repartidores` (`id_repartidor`,`nombre`,`telefono`,`vehiculo`,`disponible`) VALUES (1,'Carlos Ramirez','8888-8888','Motocicleta',1),(2,'Ana Mora','8777-7777','Automovil',1);

-- Datos: roles
INSERT INTO `roles` VALUES
(1,'Administrador'),
(2,'Cliente'),
(3,'Encargado'),
(4,'Cocina');

-- Datos: usuarios
-- Credenciales iniciales del administrador:
-- correo: admin@latosteleria.com
-- contrasena: Admin123!
-- Credenciales iniciales del cliente:
-- correo: cliente@latosteleria.com
-- contrasena: Cliente123!
-- Credenciales iniciales del encargado:
-- correo: encargado@latosteleria.com
-- contrasena: Encargado123!
-- Credenciales iniciales de cocina:
-- correo: cocina@latosteleria.com
-- contrasena: Cocina123!
INSERT INTO `usuarios` VALUES
(1,1,'Administrador General','admin@latosteleria.com','$2y$10$ZKc.NCagjTWKETLuR71YtOkAEX9ybXBQJ7gyAhJnq4dW2P4xxrPxO',NULL,NULL),
(2,2,'Cliente Demo','cliente@latosteleria.com','$2y$10$soR8dBLDIblltcguYhhKLOy9cxCWUV3y21G.eGSUFDZpXkgthnDGS',NULL,NULL),
(3,3,'Encargado Demo','encargado@latosteleria.com','$2y$10$KuaE4FY.ch6xfduFJ6.nCej.4gF3CIg30OyjyuyDF1rPPjmWulhde',NULL,NULL),
(4,4,'Cocina Demo','cocina@latosteleria.com','$2y$10$ViCGWyoTQghrT4m6l/NMhuFOXXPB.wyroH32Y66kCMENbDMDtpkra',NULL,NULL);

-- Datos: combos
INSERT INTO `combos` VALUES (1,1,'Combo Desayuno Tostelero','Incluye café latte, tostada de aguacate y cheesecake.',6500.00,1),(2,1,'Combo Dulce Café','Incluye café latte y cheesecake.',4000.00,1),(3,2,'Combo Merienda','Incluye café latte y brownie de chocolate',2800.00,1),(4,3,'Combo Postres','Incluye cheesecake y brownie',3500.00,1);

-- Datos: productos
INSERT INTO `productos` VALUES (1,1,'Café Latte','Café con leche espumada',1800.00,'cafe-latte.jpg',1),(2,2,'Tostada de Aguacate','Tostada artesanal con aguacate fresco',3200.00,'tostada-aguacate.jpg',1),(3,3,'Cheesecake','Postre frío con base de galleta',2500.00,'cheesecake.jpg',1),(4,3,'Brownie Chocolate','Brownie artesanal de chocolate con textura suave',1500.00,'brownie.jpg',1);

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

START TRANSACTION;

-- Categorías y estaciones que ya forman parte del catálogo ampliado.
INSERT INTO categorias (nombre_categoria)
SELECT 'Sandwiches' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nombre_categoria = 'Sandwiches');
INSERT INTO categorias (nombre_categoria)
SELECT 'Frappés' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nombre_categoria = 'Frappés');
INSERT INTO estaciones (nombre_estacion)
SELECT 'Empaque' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM estaciones WHERE nombre_estacion = 'Empaque');
INSERT INTO estaciones (nombre_estacion)
SELECT 'Bebidas Frías' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM estaciones WHERE nombre_estacion = 'Bebidas Frías');

-- Ingredientes adicionales; los existentes se reutilizan por nombre.
INSERT INTO ingredientes (nombre_ingrediente)
SELECT nuevos.nombre_ingrediente
FROM (
  SELECT 'Jamón' AS nombre_ingrediente UNION ALL SELECT 'Queso Mozzarella'
  UNION ALL SELECT 'Tomate' UNION ALL SELECT 'Albahaca' UNION ALL SELECT 'Pollo'
  UNION ALL SELECT 'Mantequilla' UNION ALL SELECT 'Canela' UNION ALL SELECT 'Helado de Vainilla'
  UNION ALL SELECT 'Caramelo' UNION ALL SELECT 'Fresas' UNION ALL SELECT 'Masa de croissant'
  UNION ALL SELECT 'Salmón ahumado' UNION ALL SELECT 'Arándanos' UNION ALL SELECT 'Chispas de chocolate'
  UNION ALL SELECT 'Nueces' UNION ALL SELECT 'Vainilla' UNION ALL SELECT 'Matcha'
  UNION ALL SELECT 'Té negro' UNION ALL SELECT 'Limón' UNION ALL SELECT 'Crema batida'
) nuevos
WHERE NOT EXISTS (
  SELECT 1 FROM ingredientes existentes
  WHERE existentes.nombre_ingrediente = nuevos.nombre_ingrediente
);

-- Datos adicionales que ya existían en el script, conservados e idempotentes.
INSERT INTO menus (nombre_menu, fecha_inicio, fecha_fin, hora_inicio, hora_fin, activo)
SELECT 'Menú Frappés', '2026-06-01', '2026-12-31', '12:00:00', '18:00:00', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM menus WHERE nombre_menu = 'Menú Frappés');
INSERT INTO menus (nombre_menu, fecha_inicio, fecha_fin, hora_inicio, hora_fin, activo)
SELECT 'Menú Fin de Semana', '2026-06-01', '2026-12-31', '08:00:00', '16:00:00', 0 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM menus WHERE nombre_menu = 'Menú Fin de Semana');
INSERT INTO repartidores (nombre, telefono, vehiculo, disponible)
SELECT 'Luis Hernández', '8666-1111', 'Motocicleta', 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM repartidores WHERE telefono = '8666-1111');
INSERT INTO repartidores (nombre, telefono, vehiculo, disponible)
SELECT 'María Gómez', '8555-2222', 'Bicicleta', 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM repartidores WHERE telefono = '8555-2222');

-- Conserva los productos, combos y relaciones del bloque adicional original.
INSERT INTO productos (categoria_id, nombre_producto, descripcion, precio, imagen, activo)
SELECT c.id_categoria, datos.nombre_producto, datos.descripcion, datos.precio, datos.imagen, 1
FROM (
  SELECT 'Bebidas' categoria, 'Cappuccino' nombre_producto, 'Café espresso con espuma de leche' descripcion, 2000.00 precio, 'cappuccino.jpg' imagen UNION ALL
  SELECT 'Bebidas', 'Chocolate Caliente', 'Chocolate caliente artesanal', 2200.00, 'chocolate-caliente.jpg' UNION ALL
  SELECT 'Tostadas', 'Tostada Caprese', 'Pan artesanal con tomate, mozzarella y albahaca', 3500.00, 'caprese.jpg' UNION ALL
  SELECT 'Tostadas', 'Sándwich de Pollo', 'Pan artesanal con pollo y queso', 4200.00, 'sandwich-pollo.jpg' UNION ALL
  SELECT 'Postres', 'Pie de Manzana', 'Pie artesanal con canela', 2800.00, 'pie-manzana.jpg' UNION ALL
  SELECT 'Frappés', 'Frappé de Caramelo', 'Frappé con caramelo y crema batida', 3200.00, 'frappe-caramelo.jpg'
) datos JOIN categorias c ON c.nombre_categoria = datos.categoria
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre_producto = datos.nombre_producto);
INSERT INTO producto_ingrediente (producto_id, ingrediente_id)
SELECT p.id_producto, i.id_ingrediente
FROM (
  SELECT 'Cappuccino' producto, 'Café espresso' ingrediente UNION ALL SELECT 'Cappuccino', 'Leche' UNION ALL
  SELECT 'Chocolate Caliente', 'Chocolate' UNION ALL SELECT 'Chocolate Caliente', 'Leche' UNION ALL
  SELECT 'Tostada Caprese', 'Pan artesanal' UNION ALL SELECT 'Tostada Caprese', 'Queso Mozzarella' UNION ALL SELECT 'Tostada Caprese', 'Tomate' UNION ALL SELECT 'Tostada Caprese', 'Albahaca' UNION ALL
  SELECT 'Sándwich de Pollo', 'Pan artesanal' UNION ALL SELECT 'Sándwich de Pollo', 'Pollo' UNION ALL SELECT 'Sándwich de Pollo', 'Queso Mozzarella' UNION ALL
  SELECT 'Pie de Manzana', 'Harina' UNION ALL SELECT 'Pie de Manzana', 'Azúcar' UNION ALL SELECT 'Pie de Manzana', 'Canela' UNION ALL
  SELECT 'Frappé de Caramelo', 'Leche' UNION ALL SELECT 'Frappé de Caramelo', 'Helado de Vainilla' UNION ALL SELECT 'Frappé de Caramelo', 'Caramelo'
) datos JOIN productos p ON p.nombre_producto = datos.producto JOIN ingredientes i ON i.nombre_ingrediente = datos.ingrediente
WHERE NOT EXISTS (SELECT 1 FROM producto_ingrediente pi WHERE pi.producto_id = p.id_producto AND pi.ingrediente_id = i.id_ingrediente);
INSERT INTO procesos_preparacion (producto_id, estacion_id, orden_paso, tiempo_estimado_minutos)
SELECT p.id_producto, e.id_estacion, datos.orden_paso, datos.minutos
FROM (
  SELECT 'Cappuccino' producto, 'Preparación' estacion, 1 orden_paso, 3 minutos UNION ALL SELECT 'Chocolate Caliente', 'Preparación', 1, 5 UNION ALL
  SELECT 'Tostada Caprese', 'Preparación', 1, 4 UNION ALL SELECT 'Tostada Caprese', 'Cocción', 2, 5 UNION ALL
  SELECT 'Sándwich de Pollo', 'Preparación', 1, 5 UNION ALL SELECT 'Sándwich de Pollo', 'Cocción', 2, 6 UNION ALL
  SELECT 'Pie de Manzana', 'Preparación', 1, 8 UNION ALL SELECT 'Frappé de Caramelo', 'Bebidas Frías', 1, 6 UNION ALL
  SELECT 'Brownie Chocolate', 'Preparación', 1, 5 UNION ALL SELECT 'Brownie Chocolate', 'Cocción', 2, 18 UNION ALL SELECT 'Brownie Chocolate', 'Decoración', 3, 5
) datos JOIN productos p ON p.nombre_producto = datos.producto JOIN estaciones e ON e.nombre_estacion = datos.estacion
WHERE NOT EXISTS (SELECT 1 FROM procesos_preparacion pp WHERE pp.producto_id = p.id_producto AND pp.estacion_id = e.id_estacion AND pp.orden_paso = datos.orden_paso);

-- Diez productos de cafetería y diez bebidas nuevas.
INSERT INTO productos (categoria_id, nombre_producto, descripcion, precio, imagen, activo)
SELECT categorias.id_categoria, nuevos.nombre_producto, nuevos.descripcion, nuevos.precio, nuevos.imagen, 1
FROM (
  SELECT 'Tostadas' AS categoria, 'Croissant de Jamón y Queso' AS nombre_producto, 'Croissant horneado relleno de jamón y queso mozzarella' AS descripcion, 3200.00 AS precio, 'croissant-jamon-queso.jpg' AS imagen
  UNION ALL SELECT 'Postres', 'Croissant de Chocolate', 'Croissant hojaldrado relleno de chocolate', 2800.00, 'croissant-chocolate.jpg'
  UNION ALL SELECT 'Sandwiches', 'Sándwich de Jamón y Queso', 'Pan artesanal con jamón y queso mozzarella tostado', 3900.00, 'sandwich-jamon-queso.jpg'
  UNION ALL SELECT 'Sandwiches', 'Panini Caprese', 'Panini caliente con tomate, mozzarella y albahaca', 4200.00, 'panini-caprese.jpg'
  UNION ALL SELECT 'Tostadas', 'Tostada de Salmón y Queso Crema', 'Pan artesanal con salmón ahumado y queso crema', 5200.00, 'tostada-salmon-queso-crema.jpg'
  UNION ALL SELECT 'Sandwiches', 'Bagel de Pollo y Queso Crema', 'Bagel con pollo sazonado y queso crema', 4600.00, 'bagel-pollo-queso-crema.jpg'
  UNION ALL SELECT 'Postres', 'Muffin de Arándanos', 'Muffin artesanal con arándanos', 2200.00, 'muffin-arandanos.jpg'
  UNION ALL SELECT 'Postres', 'Galleta de Chispas de Chocolate', 'Galleta horneada con chispas de chocolate', 1600.00, 'galleta-chispas-chocolate.jpg'
  UNION ALL SELECT 'Postres', 'Cheesecake de Frutos Rojos', 'Cheesecake cremoso con salsa de frutos rojos', 3400.00, 'cheesecake-frutos-rojos.jpg'
  UNION ALL SELECT 'Postres', 'Brownie con Nueces', 'Brownie de chocolate con nueces tostadas', 2400.00, 'brownie-nueces.jpg'
  UNION ALL SELECT 'Bebidas', 'Espresso Doble', 'Doble carga de café espresso', 1800.00, 'espresso-doble.jpg'
  UNION ALL SELECT 'Bebidas', 'Americano', 'Café espresso suavizado con agua caliente', 1700.00, 'americano.jpg'
  UNION ALL SELECT 'Bebidas', 'Latte de Vainilla', 'Café espresso con leche y vainilla', 2600.00, 'latte-vainilla.jpg'
  UNION ALL SELECT 'Bebidas', 'Latte de Caramelo', 'Café espresso con leche y caramelo', 2700.00, 'latte-caramelo.jpg'
  UNION ALL SELECT 'Bebidas', 'Mocha', 'Café espresso con chocolate y leche', 2800.00, 'mocha.jpg'
  UNION ALL SELECT 'Bebidas', 'Café Macchiato', 'Espresso marcado con espuma de leche', 2100.00, 'cafe-macchiato.jpg'
  UNION ALL SELECT 'Bebidas', 'Matcha Latte', 'Bebida de matcha con leche espumada', 2900.00, 'matcha-latte.jpg'
  UNION ALL SELECT 'Bebidas', 'Chai Latte', 'Té chai especiado con leche', 2800.00, 'chai-latte.jpg'
  UNION ALL SELECT 'Bebidas', 'Té Frío de Limón', 'Té negro frío con limón', 2000.00, 'te-frio-limon.jpg'
  UNION ALL SELECT 'Frappés', 'Frappé de Chocolate', 'Frappé frío de chocolate con crema batida', 3500.00, 'frappe-chocolate.jpg'
) nuevos
JOIN categorias ON categorias.nombre_categoria = nuevos.categoria
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre_producto = nuevos.nombre_producto);

-- Ingredientes de los 20 productos nuevos.
INSERT INTO producto_ingrediente (producto_id, ingrediente_id)
SELECT p.id_producto, i.id_ingrediente
FROM (
  SELECT 'Croissant de Jamón y Queso' producto, 'Masa de croissant' ingrediente UNION ALL SELECT 'Croissant de Jamón y Queso', 'Jamón' UNION ALL SELECT 'Croissant de Jamón y Queso', 'Queso Mozzarella'
  UNION ALL SELECT 'Croissant de Chocolate', 'Masa de croissant' UNION ALL SELECT 'Croissant de Chocolate', 'Chocolate'
  UNION ALL SELECT 'Sándwich de Jamón y Queso', 'Pan artesanal' UNION ALL SELECT 'Sándwich de Jamón y Queso', 'Jamón' UNION ALL SELECT 'Sándwich de Jamón y Queso', 'Queso Mozzarella'
  UNION ALL SELECT 'Panini Caprese', 'Pan artesanal' UNION ALL SELECT 'Panini Caprese', 'Tomate' UNION ALL SELECT 'Panini Caprese', 'Queso Mozzarella' UNION ALL SELECT 'Panini Caprese', 'Albahaca'
  UNION ALL SELECT 'Tostada de Salmón y Queso Crema', 'Pan artesanal' UNION ALL SELECT 'Tostada de Salmón y Queso Crema', 'Salmón ahumado' UNION ALL SELECT 'Tostada de Salmón y Queso Crema', 'Queso crema'
  UNION ALL SELECT 'Bagel de Pollo y Queso Crema', 'Pan artesanal' UNION ALL SELECT 'Bagel de Pollo y Queso Crema', 'Pollo' UNION ALL SELECT 'Bagel de Pollo y Queso Crema', 'Queso crema'
  UNION ALL SELECT 'Muffin de Arándanos', 'Harina' UNION ALL SELECT 'Muffin de Arándanos', 'Azúcar' UNION ALL SELECT 'Muffin de Arándanos', 'Arándanos' UNION ALL SELECT 'Muffin de Arándanos', 'Mantequilla'
  UNION ALL SELECT 'Galleta de Chispas de Chocolate', 'Harina' UNION ALL SELECT 'Galleta de Chispas de Chocolate', 'Azúcar' UNION ALL SELECT 'Galleta de Chispas de Chocolate', 'Chispas de chocolate' UNION ALL SELECT 'Galleta de Chispas de Chocolate', 'Mantequilla'
  UNION ALL SELECT 'Cheesecake de Frutos Rojos', 'Queso crema' UNION ALL SELECT 'Cheesecake de Frutos Rojos', 'Galleta' UNION ALL SELECT 'Cheesecake de Frutos Rojos', 'Fresas'
  UNION ALL SELECT 'Brownie con Nueces', 'Chocolate' UNION ALL SELECT 'Brownie con Nueces', 'Harina' UNION ALL SELECT 'Brownie con Nueces', 'Nueces' UNION ALL SELECT 'Brownie con Nueces', 'Azúcar'
  UNION ALL SELECT 'Espresso Doble', 'Café espresso' UNION ALL SELECT 'Americano', 'Café espresso' UNION ALL SELECT 'Americano', 'Leche'
  UNION ALL SELECT 'Latte de Vainilla', 'Café espresso' UNION ALL SELECT 'Latte de Vainilla', 'Leche' UNION ALL SELECT 'Latte de Vainilla', 'Vainilla'
  UNION ALL SELECT 'Latte de Caramelo', 'Café espresso' UNION ALL SELECT 'Latte de Caramelo', 'Leche' UNION ALL SELECT 'Latte de Caramelo', 'Caramelo'
  UNION ALL SELECT 'Mocha', 'Café espresso' UNION ALL SELECT 'Mocha', 'Leche' UNION ALL SELECT 'Mocha', 'Chocolate'
  UNION ALL SELECT 'Café Macchiato', 'Café espresso' UNION ALL SELECT 'Café Macchiato', 'Leche'
  UNION ALL SELECT 'Matcha Latte', 'Matcha' UNION ALL SELECT 'Matcha Latte', 'Leche'
  UNION ALL SELECT 'Chai Latte', 'Té negro' UNION ALL SELECT 'Chai Latte', 'Leche' UNION ALL SELECT 'Chai Latte', 'Canela'
  UNION ALL SELECT 'Té Frío de Limón', 'Té negro' UNION ALL SELECT 'Té Frío de Limón', 'Limón' UNION ALL SELECT 'Té Frío de Limón', 'Azúcar'
  UNION ALL SELECT 'Frappé de Chocolate', 'Chocolate' UNION ALL SELECT 'Frappé de Chocolate', 'Leche' UNION ALL SELECT 'Frappé de Chocolate', 'Helado de Vainilla' UNION ALL SELECT 'Frappé de Chocolate', 'Crema batida'
) relaciones
JOIN productos p ON p.nombre_producto = relaciones.producto
JOIN ingredientes i ON i.nombre_ingrediente = relaciones.ingrediente
WHERE NOT EXISTS (SELECT 1 FROM producto_ingrediente pi WHERE pi.producto_id = p.id_producto AND pi.ingrediente_id = i.id_ingrediente);

-- Procesos completos: las estaciones se resuelven por nombre, nunca por un ID supuesto.
INSERT INTO procesos_preparacion (producto_id, estacion_id, orden_paso, tiempo_estimado_minutos)
SELECT p.id_producto, e.id_estacion, pasos.orden_paso, pasos.minutos
FROM (
  SELECT 'Croissant de Jamón y Queso' producto, 'Preparación' estacion, 1 orden_paso, 8 minutos UNION ALL SELECT 'Croissant de Jamón y Queso', 'Cocción', 2, 15 UNION ALL SELECT 'Croissant de Jamón y Queso', 'Empaque', 3, 2
  UNION ALL SELECT 'Croissant de Chocolate', 'Preparación', 1, 7 UNION ALL SELECT 'Croissant de Chocolate', 'Cocción', 2, 15 UNION ALL SELECT 'Croissant de Chocolate', 'Empaque', 3, 2
  UNION ALL SELECT 'Sándwich de Jamón y Queso', 'Preparación', 1, 5 UNION ALL SELECT 'Sándwich de Jamón y Queso', 'Cocción', 2, 6 UNION ALL SELECT 'Sándwich de Jamón y Queso', 'Empaque', 3, 2
  UNION ALL SELECT 'Panini Caprese', 'Preparación', 1, 5 UNION ALL SELECT 'Panini Caprese', 'Cocción', 2, 7 UNION ALL SELECT 'Panini Caprese', 'Empaque', 3, 2
  UNION ALL SELECT 'Tostada de Salmón y Queso Crema', 'Preparación', 1, 5 UNION ALL SELECT 'Tostada de Salmón y Queso Crema', 'Decoración', 2, 3
  UNION ALL SELECT 'Bagel de Pollo y Queso Crema', 'Preparación', 1, 6 UNION ALL SELECT 'Bagel de Pollo y Queso Crema', 'Cocción', 2, 5 UNION ALL SELECT 'Bagel de Pollo y Queso Crema', 'Empaque', 3, 2
  UNION ALL SELECT 'Muffin de Arándanos', 'Preparación', 1, 8 UNION ALL SELECT 'Muffin de Arándanos', 'Cocción', 2, 20 UNION ALL SELECT 'Muffin de Arándanos', 'Empaque', 3, 2
  UNION ALL SELECT 'Galleta de Chispas de Chocolate', 'Preparación', 1, 6 UNION ALL SELECT 'Galleta de Chispas de Chocolate', 'Cocción', 2, 12 UNION ALL SELECT 'Galleta de Chispas de Chocolate', 'Empaque', 3, 1
  UNION ALL SELECT 'Cheesecake de Frutos Rojos', 'Preparación', 1, 8 UNION ALL SELECT 'Cheesecake de Frutos Rojos', 'Decoración', 2, 4
  UNION ALL SELECT 'Brownie con Nueces', 'Preparación', 1, 7 UNION ALL SELECT 'Brownie con Nueces', 'Cocción', 2, 20 UNION ALL SELECT 'Brownie con Nueces', 'Empaque', 3, 2
  UNION ALL SELECT 'Espresso Doble', 'Preparación', 1, 3 UNION ALL SELECT 'Americano', 'Preparación', 1, 3
  UNION ALL SELECT 'Latte de Vainilla', 'Preparación', 1, 4 UNION ALL SELECT 'Latte de Vainilla', 'Decoración', 2, 2
  UNION ALL SELECT 'Latte de Caramelo', 'Preparación', 1, 4 UNION ALL SELECT 'Latte de Caramelo', 'Decoración', 2, 2
  UNION ALL SELECT 'Mocha', 'Preparación', 1, 5 UNION ALL SELECT 'Mocha', 'Decoración', 2, 2
  UNION ALL SELECT 'Café Macchiato', 'Preparación', 1, 4 UNION ALL SELECT 'Café Macchiato', 'Decoración', 2, 1
  UNION ALL SELECT 'Matcha Latte', 'Preparación', 1, 5 UNION ALL SELECT 'Matcha Latte', 'Decoración', 2, 2
  UNION ALL SELECT 'Chai Latte', 'Preparación', 1, 6 UNION ALL SELECT 'Chai Latte', 'Decoración', 2, 1
  UNION ALL SELECT 'Té Frío de Limón', 'Preparación', 1, 5 UNION ALL SELECT 'Té Frío de Limón', 'Bebidas Frías', 2, 3
  UNION ALL SELECT 'Frappé de Chocolate', 'Preparación', 1, 6 UNION ALL SELECT 'Frappé de Chocolate', 'Bebidas Frías', 2, 4 UNION ALL SELECT 'Frappé de Chocolate', 'Decoración', 3, 2
) pasos
JOIN productos p ON p.nombre_producto = pasos.producto
JOIN estaciones e ON e.nombre_estacion = pasos.estacion
WHERE NOT EXISTS (
  SELECT 1 FROM procesos_preparacion pp
  WHERE pp.producto_id = p.id_producto AND pp.estacion_id = e.id_estacion AND pp.orden_paso = pasos.orden_paso
);

-- Siete combos nuevos, cada uno con al menos dos productos.
INSERT INTO combos (categoria_id, nombre_combo, descripcion, precio_especial, activo)
SELECT c.id_categoria, nuevos.nombre_combo, nuevos.descripcion, nuevos.precio, 1
FROM (
  SELECT 'Bebidas' categoria, 'Combo Croissant Cafetero' nombre_combo, 'Croissant de jamón y queso con latte de vainilla' descripcion, 5200.00 precio UNION ALL
  SELECT 'Sandwiches', 'Combo Panini Caprese', 'Panini caprese con americano', 5500.00 UNION ALL
  SELECT 'Postres', 'Combo Muffin y Latte', 'Muffin de arándanos con latte de caramelo', 4600.00 UNION ALL
  SELECT 'Postres', 'Combo Galleta y Café', 'Galleta de chocolate con café macchiato', 3300.00 UNION ALL
  SELECT 'Postres', 'Combo Cheesecake Especial', 'Cheesecake de frutos rojos con mocha', 5800.00 UNION ALL
  SELECT 'Postres', 'Combo Brownie Chocolate', 'Brownie con nueces y chocolate caliente', 4200.00 UNION ALL
  SELECT 'Frappés', 'Combo Merienda Completa', 'Bagel de pollo, frappé de chocolate y cheesecake', 8900.00
) nuevos
JOIN categorias c ON c.nombre_categoria = nuevos.categoria
WHERE NOT EXISTS (SELECT 1 FROM combos WHERE nombre_combo = nuevos.nombre_combo);

INSERT INTO combos (categoria_id, nombre_combo, descripcion, precio_especial, activo)
SELECT c.id_categoria, datos.nombre_combo, datos.descripcion, datos.precio, 1
FROM (
  SELECT 'Bebidas' categoria, 'Combo Cappuccino' nombre_combo, 'Cappuccino con cheesecake' descripcion, 4200.00 precio UNION ALL
  SELECT 'Tostadas', 'Combo Caprese', 'Tostada Caprese y café latte', 5000.00 UNION ALL
  SELECT 'Frappés', 'Combo Frappé Dulce', 'Frappé de Caramelo y Brownie', 4500.00
) datos JOIN categorias c ON c.nombre_categoria = datos.categoria
WHERE NOT EXISTS (SELECT 1 FROM combos WHERE nombre_combo = datos.nombre_combo);

INSERT INTO combo_producto (combo_id, producto_id, cantidad)
SELECT c.id_combo, p.id_producto, 1
FROM (
  SELECT 'Combo Croissant Cafetero' combo, 'Croissant de Jamón y Queso' producto UNION ALL SELECT 'Combo Croissant Cafetero', 'Latte de Vainilla'
  UNION ALL SELECT 'Combo Panini Caprese', 'Panini Caprese' UNION ALL SELECT 'Combo Panini Caprese', 'Americano'
  UNION ALL SELECT 'Combo Muffin y Latte', 'Muffin de Arándanos' UNION ALL SELECT 'Combo Muffin y Latte', 'Latte de Caramelo'
  UNION ALL SELECT 'Combo Galleta y Café', 'Galleta de Chispas de Chocolate' UNION ALL SELECT 'Combo Galleta y Café', 'Café Macchiato'
  UNION ALL SELECT 'Combo Cheesecake Especial', 'Cheesecake de Frutos Rojos' UNION ALL SELECT 'Combo Cheesecake Especial', 'Mocha'
  UNION ALL SELECT 'Combo Brownie Chocolate', 'Brownie con Nueces' UNION ALL SELECT 'Combo Brownie Chocolate', 'Chocolate Caliente'
  UNION ALL SELECT 'Combo Merienda Completa', 'Bagel de Pollo y Queso Crema' UNION ALL SELECT 'Combo Merienda Completa', 'Frappé de Chocolate' UNION ALL SELECT 'Combo Merienda Completa', 'Cheesecake'
  UNION ALL SELECT 'Combo Cappuccino', 'Cappuccino' UNION ALL SELECT 'Combo Cappuccino', 'Cheesecake'
  UNION ALL SELECT 'Combo Caprese', 'Tostada Caprese' UNION ALL SELECT 'Combo Caprese', 'Café Latte'
  UNION ALL SELECT 'Combo Frappé Dulce', 'Frappé de Caramelo' UNION ALL SELECT 'Combo Frappé Dulce', 'Brownie Chocolate'
) relaciones
JOIN combos c ON c.nombre_combo = relaciones.combo
JOIN productos p ON p.nombre_producto = relaciones.producto
WHERE NOT EXISTS (SELECT 1 FROM combo_producto cp WHERE cp.combo_id = c.id_combo AND cp.producto_id = p.id_producto);

-- Menús apropiados para el catálogo nuevo.
INSERT INTO menu_items (menu_id, producto_id, combo_id)
SELECT m.id_menu, p.id_producto, NULL
FROM menus m
JOIN productos p ON p.nombre_producto IN (
  'Croissant de Jamón y Queso', 'Croissant de Chocolate', 'Sándwich de Jamón y Queso',
  'Bagel de Pollo y Queso Crema', 'Espresso Doble', 'Americano', 'Latte de Vainilla',
  'Latte de Caramelo', 'Mocha', 'Café Macchiato', 'Matcha Latte', 'Chai Latte'
)
WHERE m.nombre_menu IN ('Menú Desayuno', 'Menú Fin de Semana')
  AND NOT EXISTS (SELECT 1 FROM menu_items mi WHERE mi.menu_id = m.id_menu AND mi.producto_id = p.id_producto AND mi.combo_id IS NULL);
INSERT INTO menu_items (menu_id, producto_id, combo_id)
SELECT m.id_menu, p.id_producto, NULL
FROM menus m
JOIN productos p ON p.nombre_producto IN (
  'Panini Caprese', 'Tostada de Salmón y Queso Crema', 'Té Frío de Limón', 'Frappé de Chocolate'
)
WHERE m.nombre_menu IN ('Menú Almuerzo', 'Menú Frappés')
  AND NOT EXISTS (SELECT 1 FROM menu_items mi WHERE mi.menu_id = m.id_menu AND mi.producto_id = p.id_producto AND mi.combo_id IS NULL);
INSERT INTO menu_items (menu_id, producto_id, combo_id)
SELECT m.id_menu, p.id_producto, NULL
FROM menus m
JOIN productos p ON p.nombre_producto IN (
  'Muffin de Arándanos', 'Galleta de Chispas de Chocolate', 'Cheesecake de Frutos Rojos', 'Brownie con Nueces'
)
WHERE m.nombre_menu IN ('Menú Tarde', 'Menú Especial')
  AND NOT EXISTS (SELECT 1 FROM menu_items mi WHERE mi.menu_id = m.id_menu AND mi.producto_id = p.id_producto AND mi.combo_id IS NULL);
INSERT INTO menu_items (menu_id, producto_id, combo_id)
SELECT m.id_menu, NULL, c.id_combo
FROM menus m
JOIN combos c ON c.nombre_combo IN ('Combo Croissant Cafetero', 'Combo Panini Caprese', 'Combo Muffin y Latte', 'Combo Galleta y Café', 'Combo Cheesecake Especial', 'Combo Brownie Chocolate', 'Combo Merienda Completa')
WHERE m.nombre_menu IN ('Menú Desayuno', 'Menú Almuerzo', 'Menú Tarde', 'Menú Especial')
  AND NOT EXISTS (SELECT 1 FROM menu_items mi WHERE mi.menu_id = m.id_menu AND mi.combo_id = c.id_combo AND mi.producto_id IS NULL);

  -- Elementos de menú del bloque adicional original, conservados por nombre.
  INSERT INTO menu_items (menu_id, producto_id, combo_id)
  SELECT m.id_menu, p.id_producto, NULL
  FROM menus m JOIN productos p ON p.nombre_producto IN ('Frappé de Caramelo', 'Cappuccino', 'Tostada Caprese', 'Sándwich de Pollo')
  WHERE ((m.nombre_menu = 'Menú Frappés' AND p.nombre_producto = 'Frappé de Caramelo') OR
      (m.nombre_menu = 'Menú Fin de Semana' AND p.nombre_producto IN ('Cappuccino', 'Tostada Caprese', 'Sándwich de Pollo')))
    AND NOT EXISTS (SELECT 1 FROM menu_items mi WHERE mi.menu_id = m.id_menu AND mi.producto_id = p.id_producto AND mi.combo_id IS NULL);
  INSERT INTO menu_items (menu_id, producto_id, combo_id)
  SELECT m.id_menu, NULL, c.id_combo
  FROM menus m JOIN combos c ON c.nombre_combo IN ('Combo Frappé Dulce', 'Combo Caprese')
  WHERE ((m.nombre_menu = 'Menú Frappés' AND c.nombre_combo = 'Combo Frappé Dulce') OR
      (m.nombre_menu = 'Menú Fin de Semana' AND c.nombre_combo = 'Combo Caprese'))
    AND NOT EXISTS (SELECT 1 FROM menu_items mi WHERE mi.menu_id = m.id_menu AND mi.combo_id = c.id_combo AND mi.producto_id IS NULL);

-- Crear o reutilizar el Menú 24/7 y poblarlo sin duplicar elementos.
INSERT INTO menus (nombre_menu, fecha_inicio, fecha_fin, hora_inicio, hora_fin, activo)
SELECT 'Menú 24/7', '2026-01-01', '2035-12-31', '00:00:00', '23:59:59', 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM menus WHERE nombre_menu = 'Menú 24/7');
SET @menu_id = (SELECT id_menu FROM menus WHERE nombre_menu = 'Menú 24/7' ORDER BY id_menu LIMIT 1);
INSERT INTO menu_items (menu_id, producto_id, combo_id)
SELECT @menu_id, p.id_producto, NULL
FROM productos p
WHERE p.activo = 1
  AND NOT EXISTS (SELECT 1 FROM menu_items mi WHERE mi.menu_id = @menu_id AND mi.producto_id = p.id_producto AND mi.combo_id IS NULL);
INSERT INTO menu_items (menu_id, producto_id, combo_id)
SELECT @menu_id, NULL, c.id_combo
FROM combos c
WHERE c.activo = 1
  AND NOT EXISTS (SELECT 1 FROM menu_items mi WHERE mi.menu_id = @menu_id AND mi.combo_id = c.id_combo AND mi.producto_id IS NULL);

/* =====================================================
   VALIDACIONES DE DATOS NUEVOS
   ===================================================== */
SELECT 'Productos nuevos' validacion, COUNT(*) cantidad
FROM productos WHERE nombre_producto IN ('Croissant de Jamón y Queso', 'Croissant de Chocolate', 'Sándwich de Jamón y Queso', 'Panini Caprese', 'Tostada de Salmón y Queso Crema', 'Bagel de Pollo y Queso Crema', 'Muffin de Arándanos', 'Galleta de Chispas de Chocolate', 'Cheesecake de Frutos Rojos', 'Brownie con Nueces');
SELECT 'Bebidas nuevas' validacion, COUNT(*) cantidad
FROM productos WHERE nombre_producto IN ('Espresso Doble', 'Americano', 'Latte de Vainilla', 'Latte de Caramelo', 'Mocha', 'Café Macchiato', 'Matcha Latte', 'Chai Latte', 'Té Frío de Limón', 'Frappé de Chocolate');
SELECT 'Productos nuevos sin ingrediente' validacion, COUNT(*) cantidad
FROM productos p LEFT JOIN producto_ingrediente pi ON pi.producto_id = p.id_producto
WHERE p.nombre_producto IN ('Croissant de Jamón y Queso', 'Croissant de Chocolate', 'Sándwich de Jamón y Queso', 'Panini Caprese', 'Tostada de Salmón y Queso Crema', 'Bagel de Pollo y Queso Crema', 'Muffin de Arándanos', 'Galleta de Chispas de Chocolate', 'Cheesecake de Frutos Rojos', 'Brownie con Nueces', 'Espresso Doble', 'Americano', 'Latte de Vainilla', 'Latte de Caramelo', 'Mocha', 'Café Macchiato', 'Matcha Latte', 'Chai Latte', 'Té Frío de Limón', 'Frappé de Chocolate') AND pi.producto_id IS NULL;
SELECT 'Productos nuevos sin proceso' validacion, COUNT(*) cantidad
FROM productos p LEFT JOIN procesos_preparacion pp ON pp.producto_id = p.id_producto
WHERE p.nombre_producto IN ('Croissant de Jamón y Queso', 'Croissant de Chocolate', 'Sándwich de Jamón y Queso', 'Panini Caprese', 'Tostada de Salmón y Queso Crema', 'Bagel de Pollo y Queso Crema', 'Muffin de Arándanos', 'Galleta de Chispas de Chocolate', 'Cheesecake de Frutos Rojos', 'Brownie con Nueces', 'Espresso Doble', 'Americano', 'Latte de Vainilla', 'Latte de Caramelo', 'Mocha', 'Café Macchiato', 'Matcha Latte', 'Chai Latte', 'Té Frío de Limón', 'Frappé de Chocolate') AND pp.producto_id IS NULL;
SELECT 'Combos nuevos' validacion, COUNT(*) cantidad FROM combos WHERE nombre_combo IN ('Combo Croissant Cafetero', 'Combo Panini Caprese', 'Combo Muffin y Latte', 'Combo Galleta y Café', 'Combo Cheesecake Especial', 'Combo Brownie Chocolate', 'Combo Merienda Completa');
SELECT 'Combos nuevos con menos de dos productos' validacion, COUNT(*) cantidad
FROM combos c LEFT JOIN combo_producto cp ON cp.combo_id = c.id_combo
WHERE c.nombre_combo IN ('Combo Croissant Cafetero', 'Combo Panini Caprese', 'Combo Muffin y Latte', 'Combo Galleta y Café', 'Combo Cheesecake Especial', 'Combo Brownie Chocolate', 'Combo Merienda Completa')
GROUP BY c.id_combo HAVING COUNT(cp.producto_id) < 2;
SELECT 'Productos nuevos fuera de Menú 24/7' validacion, COUNT(*) cantidad
FROM productos p LEFT JOIN menu_items mi ON mi.producto_id = p.id_producto AND mi.menu_id = @menu_id
WHERE p.nombre_producto IN ('Croissant de Jamón y Queso', 'Croissant de Chocolate', 'Sándwich de Jamón y Queso', 'Panini Caprese', 'Tostada de Salmón y Queso Crema', 'Bagel de Pollo y Queso Crema', 'Muffin de Arándanos', 'Galleta de Chispas de Chocolate', 'Cheesecake de Frutos Rojos', 'Brownie con Nueces', 'Espresso Doble', 'Americano', 'Latte de Vainilla', 'Latte de Caramelo', 'Mocha', 'Café Macchiato', 'Matcha Latte', 'Chai Latte', 'Té Frío de Limón', 'Frappé de Chocolate') AND mi.producto_id IS NULL;
SELECT 'Referencias inválidas' validacion, (SELECT COUNT(*) FROM productos p LEFT JOIN categorias c ON c.id_categoria = p.categoria_id WHERE c.id_categoria IS NULL) + (SELECT COUNT(*) FROM procesos_preparacion pp LEFT JOIN estaciones e ON e.id_estacion = pp.estacion_id WHERE e.id_estacion IS NULL) + (SELECT COUNT(*) FROM menu_items mi LEFT JOIN menus m ON m.id_menu = mi.menu_id WHERE m.id_menu IS NULL) + (SELECT COUNT(*) FROM menu_items mi LEFT JOIN productos p ON p.id_producto = mi.producto_id WHERE mi.producto_id IS NOT NULL AND p.id_producto IS NULL) + (SELECT COUNT(*) FROM menu_items mi LEFT JOIN combos c ON c.id_combo = mi.combo_id WHERE mi.combo_id IS NOT NULL AND c.id_combo IS NULL) cantidad;
SELECT 'Productos sin ingrediente' validacion, COUNT(*) cantidad FROM productos p LEFT JOIN producto_ingrediente pi ON pi.producto_id = p.id_producto WHERE pi.producto_id IS NULL;
SELECT 'Productos sin proceso' validacion, COUNT(*) cantidad FROM productos p LEFT JOIN procesos_preparacion pp ON pp.producto_id = p.id_producto WHERE pp.producto_id IS NULL;
SELECT 'Combos sin categoría' validacion, COUNT(*) cantidad FROM combos c LEFT JOIN categorias cat ON cat.id_categoria = c.categoria_id WHERE cat.id_categoria IS NULL;
SELECT 'Combos sin productos' validacion, COUNT(*) cantidad FROM combos c LEFT JOIN combo_producto cp ON cp.combo_id = c.id_combo WHERE cp.combo_id IS NULL;
SELECT 'Nombres nuevos duplicados' validacion, COUNT(*) - COUNT(DISTINCT nombre_producto) cantidad FROM productos WHERE nombre_producto IN ('Croissant de Jamón y Queso', 'Croissant de Chocolate', 'Sándwich de Jamón y Queso', 'Panini Caprese', 'Tostada de Salmón y Queso Crema', 'Bagel de Pollo y Queso Crema', 'Muffin de Arándanos', 'Galleta de Chispas de Chocolate', 'Cheesecake de Frutos Rojos', 'Brownie con Nueces', 'Espresso Doble', 'Americano', 'Latte de Vainilla', 'Latte de Caramelo', 'Mocha', 'Café Macchiato', 'Matcha Latte', 'Chai Latte', 'Té Frío de Limón', 'Frappé de Chocolate');

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;

-- Fin del script
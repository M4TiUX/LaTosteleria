USE latosteleria;

-- Tabla nueva para guardar los datos de los repartidores
CREATE TABLE repartidores (
    id_repartidor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    vehiculo VARCHAR(50) NOT NULL,
    disponible TINYINT(1) NOT NULL DEFAULT 1
);

-- La tabla seguimiento_pedido ya existe.
-- Se amplía para relacionarla con un repartidor
-- y guardar coordenadas del pedido durante la entrega.

ALTER TABLE seguimiento_pedido
    ADD COLUMN repartidor_id INT NULL AFTER pedido_id,
    ADD COLUMN latitud DECIMAL(10,8) NULL AFTER comentario,
    ADD COLUMN longitud DECIMAL(11,8) NULL AFTER latitud,
    ADD CONSTRAINT fk_seguimiento_repartidor
        FOREIGN KEY (repartidor_id)
        REFERENCES repartidores(id_repartidor)
        ON UPDATE CASCADE
        ON DELETE SET NULL;
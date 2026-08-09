<?php

class PedidoModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all($clienteId = null)
    {
        try {
            $clienteFilter = '';

            if ($clienteId !== null && (int) $clienteId > 0) {
                $clienteId = (int) $clienteId;
                $clienteFilter = "WHERE p.cliente_id = $clienteId";
            }

            $sql = "SELECT
                    p.id_pedido,
                    p.cliente_id,
                    u.nombre AS cliente_nombre,
                    u.correo AS cliente_correo,
                    p.metodo_entrega,
                    p.observaciones,
                    p.subtotal,
                    p.impuestos,
                    p.total,
                    p.fecha_creacion,
                    latest.estado_nombre AS estado_actual,
                    latest.fecha_hora AS fecha_ultimo_estado,
                    COALESCE(items.total_items, 0) AS total_items
                FROM pedidos p
                INNER JOIN usuarios u
                    ON u.id_usuario = p.cliente_id
                LEFT JOIN (
                    SELECT sp1.pedido_id, sp1.estado_nombre, sp1.fecha_hora
                    FROM seguimiento_pedido sp1
                    INNER JOIN (
                        SELECT pedido_id, MAX(id_seguimiento) AS last_id
                        FROM seguimiento_pedido
                        GROUP BY pedido_id
                    ) last_tracking
                        ON last_tracking.last_id = sp1.id_seguimiento
                ) latest
                    ON latest.pedido_id = p.id_pedido
                LEFT JOIN (
                    SELECT pedido_id, SUM(cantidad) AS total_items
                    FROM detalle_pedido
                    GROUP BY pedido_id
                ) items
                    ON items.pedido_id = p.id_pedido
                $clienteFilter
                ORDER BY p.fecha_creacion DESC, p.id_pedido DESC";

            $pedidos = $this->enlace->executeSQL($sql);

            if (!is_array($pedidos) || empty($pedidos)) {
                return [];
            }

            foreach ($pedidos as $pedido) {
                $pedido->items = $this->getOrderItems((int) $pedido->id_pedido);
            }

            return $pedidos;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($pedidoId)
    {
        try {
            $pedidoId = (int) $pedidoId;

            if ($pedidoId <= 0) {
                return null;
            }

            $sql = "SELECT
                    p.id_pedido,
                    p.cliente_id,
                    u.nombre AS cliente_nombre,
                    u.correo AS cliente_correo,
                    p.metodo_entrega,
                    p.observaciones,
                    p.subtotal,
                    p.impuestos,
                    p.total,
                    p.fecha_creacion
                FROM pedidos p
                INNER JOIN usuarios u
                    ON u.id_usuario = p.cliente_id
                WHERE p.id_pedido = $pedidoId
                LIMIT 1";

            $pedido = $this->enlace->executeSQL($sql);

            if (!is_array($pedido) || empty($pedido)) {
                return null;
            }

            $pedido = $pedido[0];
            $pedido->items = $this->getOrderItems($pedidoId);

            return $pedido;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getRepartidorId($pedidoId)
    {
        $pedidoId = (int) $pedidoId;
        if ($pedidoId <= 0) {
            return null;
        }

        $sql = "SELECT repartidor_id
            FROM seguimiento_pedido
            WHERE pedido_id = $pedidoId
            ORDER BY id_seguimiento DESC
            LIMIT 1";

        $result = $this->enlace->executeSQL($sql);

        if (!is_array($result) || empty($result)) {
            return null;
        }

        return isset($result[0]->repartidor_id) ? (int) $result[0]->repartidor_id : null;
    }

    public function updateEstado($pedidoId, $estadoId)
    {
        $pedidoId = (int) $pedidoId;
        $estadoId = (int) $estadoId;

        if ($pedidoId <= 0 || $estadoId <= 0) {
            return false;
        }

        $estado = $this->getEstadoById($estadoId);
        if ($estado === null) {
            return false;
        }

        $sql = "UPDATE pedidos
            SET estado_id = $estadoId
            WHERE id_pedido = $pedidoId";

        $this->enlace->executeSQL_DML($sql);

        $repartidorId = $this->getRepartidorId($pedidoId);
        $estadoNombre = $this->escape($estado->nombre_estado);
        $fechaActual = $this->escape(date('Y-m-d H:i:s'));

        $trackingSql = "INSERT INTO seguimiento_pedido
            (pedido_id, repartidor_id, estado_nombre, fecha_hora, comentario)
            VALUES
            ($pedidoId, $repartidorId, '$estadoNombre', '$fechaActual', 'Estado actualizado desde la API')";

        $this->enlace->executeSQL_DML($trackingSql);

        return true;
    }

    public function create($pedido)
    {
        try {
            if (!is_object($pedido)) {
                throw new Exception('Debe enviar la informacion del pedido en formato JSON.');
            }

            $items = isset($pedido->items) && is_array($pedido->items) ? $pedido->items : [];
            if (empty($items)) {
                throw new Exception('Debe agregar al menos un producto o combo al pedido.');
            }

            $clienteId = isset($pedido->cliente_id) ? (int) $pedido->cliente_id : 0;
            if ($clienteId <= 0) {
                throw new Exception('Debe iniciar sesion para registrar un pedido.');
            }

            $metodoEntrega = 'Tienda';
            $observaciones = isset($pedido->observaciones)
                ? $this->sanitizeObservation($pedido->observaciones)
                : null;

            $validatedItems = $this->validateItems($items);

            $subtotal = 0.0;
            foreach ($validatedItems as $item) {
                $subtotal += $item['unit_price'] * $item['cantidad'];
            }

            $subtotal = round($subtotal, 2);
            $impuestos = 0.00;
            $total = round($subtotal + $impuestos, 2);
            $fechaCreacion = $this->escape(date('Y-m-d H:i:s'));
            $observacionesSql = $observaciones === null ? 'NULL' : "'" . $this->escape($observaciones) . "'";

            $estado = $this->getInitialEstado();
            $estadoId = isset($estado->id_estado) ? (int) $estado->id_estado : 1;
            $estadoNombre = isset($estado->nombre_estado) ? $estado->nombre_estado : 'Pendiente';
            $repartidorId = $this->asignarRepartidor();

            $sql = "INSERT INTO pedidos
                (cliente_id, estado_id, metodo_entrega, observaciones, subtotal, impuestos, total, costo_envio, fecha_creacion)
                VALUES
<<<<<<< HEAD
                ($clienteId, $estadoId, '$metodoEntrega', $subtotal, $impuestos, $total, 0.00, '$fechaCreacion')";
=======
                ($clienteId, 1, '$metodoEntrega', $observacionesSql, $subtotal, $impuestos, $total, 0.00, '$fechaCreacion')";
>>>>>>> b3ada1788635360c0ac0684501106c9681b0e97a

            $pedidoId = $this->enlace->executeSQL_DML_last($sql);

            if ($pedidoId <= 0) {
                throw new Exception('No fue posible registrar el pedido.');
            }

            foreach ($validatedItems as $item) {
                $productoId = $item['item_type'] === 'producto' ? (int) $item['item_id'] : 'NULL';
                $comboId = $item['item_type'] === 'combo' ? (int) $item['item_id'] : 'NULL';
                $cantidad = (int) $item['cantidad'];
                $observacionDetalle = $item['observaciones'] === null
                    ? 'NULL'
                    : "'" . $this->escape($item['observaciones']) . "'";

                $detailSql = "INSERT INTO detalle_pedido
                    (pedido_id, producto_id, combo_id, cantidad, observaciones)
                    VALUES
                    ($pedidoId, $productoId, $comboId, $cantidad, $observacionDetalle)";

                $this->enlace->executeSQL_DML($detailSql);
            }

            $this->createPaymentRecord($pedidoId, $pedido, $total);

            $trackingSql = "INSERT INTO seguimiento_pedido
                (pedido_id, repartidor_id, estado_nombre, fecha_hora, comentario)
                VALUES
                ($pedidoId, $repartidorId, '$estadoNombre', '$fechaCreacion', 'Pedido creado y enviado a seguimiento automatico.')";

            $this->enlace->executeSQL_DML($trackingSql);

            $seguimientoModel = new SeguimientoPedidoModel();

            return $seguimientoModel->getTracking($pedidoId);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    private function getOrderItems($pedidoId)
    {
        $pedidoId = (int) $pedidoId;

        $sql = "SELECT
                dp.id_detalle,
                dp.cantidad,
                dp.observaciones,
                CASE
                    WHEN dp.producto_id IS NOT NULL THEN 'producto'
                    ELSE 'combo'
                END AS item_type,
                COALESCE(dp.producto_id, dp.combo_id) AS item_id,
                COALESCE(p.nombre_producto, c.nombre_combo) AS nombre,
                COALESCE(p.precio, c.precio_especial) AS precio_unitario,
                (COALESCE(p.precio, c.precio_especial) * dp.cantidad) AS subtotal
            FROM detalle_pedido dp
            LEFT JOIN productos p
                ON p.id_producto = dp.producto_id
            LEFT JOIN combos c
                ON c.id_combo = dp.combo_id
            WHERE dp.pedido_id = $pedidoId
            ORDER BY dp.id_detalle ASC";

        $items = $this->enlace->executeSQL($sql);

        return is_array($items) ? $items : [];
    }

    private function validateItems($items)
    {
        $validatedItems = [];

        foreach ($items as $item) {
            $itemType = isset($item->item_type) ? strtolower(trim((string) $item->item_type)) : '';
            $itemId = isset($item->item_id) ? (int) $item->item_id : 0;
            $cantidad = isset($item->cantidad) ? (int) $item->cantidad : 0;
            $observaciones = isset($item->observaciones)
                ? $this->sanitizeDetailObservation($item->observaciones)
                : null;

            if (($itemType !== 'producto' && $itemType !== 'combo') || $itemId <= 0 || $cantidad <= 0) {
                throw new Exception('Existe un elemento invalido dentro del pedido.');
            }

            $catalogItem = $itemType === 'producto'
                ? $this->getProduct($itemId)
                : $this->getCombo($itemId);

            if ($catalogItem === null) {
                throw new Exception('Uno de los elementos seleccionados ya no se encuentra disponible.');
            }

            $unitPrice = $itemType === 'producto'
                ? (float) $catalogItem->precio
                : (float) $catalogItem->precio_especial;

            $validatedItems[] = [
                'item_type' => $itemType,
                'item_id' => $itemId,
                'cantidad' => $cantidad,
                'unit_price' => $unitPrice,
                'observaciones' => $observaciones,
            ];
        }

        return $validatedItems;
    }

    private function getProduct($productId)
    {
        $productId = (int) $productId;

        $sql = "SELECT id_producto, nombre_producto, precio, activo
            FROM productos
            WHERE id_producto = $productId
            LIMIT 1";

        $result = $this->enlace->executeSQL($sql);

        if (!is_array($result) || empty($result)) {
            return null;
        }

        $product = $result[0];

        return (int) $product->activo === 1 ? $product : null;
    }

    private function getCombo($comboId)
    {
        $comboId = (int) $comboId;

        $sql = "SELECT id_combo, nombre_combo, precio_especial, activo
            FROM combos
            WHERE id_combo = $comboId
            LIMIT 1";

        $result = $this->enlace->executeSQL($sql);

        if (!is_array($result) || empty($result)) {
            return null;
        }

        $combo = $result[0];

        return (int) $combo->activo === 1 ? $combo : null;
    }

    private function sanitizeObservation($observacion)
    {
        $observacion = trim((string) $observacion);

        if ($observacion === '') {
            return null;
        }

        return mb_substr($observacion, 0, 500);
    }

    private function sanitizeDetailObservation($observacion)
    {
        $observacion = trim((string) $observacion);

        if ($observacion === '') {
            return null;
        }

        return mb_substr($observacion, 0, 300);
    }

    private function escape($value)
    {
        return addslashes(trim((string) $value));
    }

    private function getInitialEstado()
    {
        return $this->getEstadoById(1);
    }

    private function getEstadoById($estadoId)
    {
        $estadoId = (int) $estadoId;
        if ($estadoId <= 0) {
            return null;
        }

        $sql = "SELECT id_estado, nombre_estado
            FROM estados
            WHERE id_estado = $estadoId
            LIMIT 1";

        $result = $this->enlace->executeSQL($sql);

        if (!is_array($result) || empty($result)) {
            return null;
        }

        return $result[0];
    }

    private function asignarRepartidor()
    {
        $sql = "SELECT id_repartidor
            FROM repartidores
            ORDER BY id_repartidor ASC
            LIMIT 1";

        $result = $this->enlace->executeSQL($sql);

        if (!is_array($result) || empty($result)) {
            return null;
        }

        return (int) $result[0]->id_repartidor;
    }

    private function createPaymentRecord($pedidoId, $pedido, $total)
    {
        $metodoPago = isset($pedido->metodo_pago) ? strtolower(trim((string) $pedido->metodo_pago)) : 'efectivo';
        $metodoPago = $metodoPago === 'tarjeta' ? 'Tarjeta' : 'Efectivo';

        $monto = round((float) $total, 2);
        $fechaPago = $this->escape(date('Y-m-d H:i:s'));
        $ultimosCuatro = isset($pedido->ultimos_cuatro_digitos)
            ? $this->escape((string) $pedido->ultimos_cuatro_digitos)
            : null;
        $marcaTarjeta = isset($pedido->marca_tarjeta)
            ? $this->escape((string) $pedido->marca_tarjeta)
            : null;
        $montoRecibido = isset($pedido->monto_recibido) ? round((float) $pedido->monto_recibido, 2) : null;
        $vuelto = isset($pedido->vuelto) ? round((float) $pedido->vuelto, 2) : null;

        $sql = "INSERT INTO pagos_simulados
            (pedido_id, metodo_pago, monto, fecha_pago, ultimos_cuatro_digitos, marca_tarjeta, monto_recibido, vuelto)
            VALUES
            ($pedidoId, '$metodoPago', $monto, '$fechaPago', '$ultimosCuatro', '$marcaTarjeta', $montoRecibido, $vuelto)";

        $this->enlace->executeSQL_DML($sql);
    }
}

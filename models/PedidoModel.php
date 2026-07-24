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
                $clienteId = $this->getDefaultClientId();
            }

            if ($clienteId <= 0) {
                throw new Exception('No existe un cliente valido para registrar el pedido.');
            }

            $metodoEntrega = isset($pedido->metodo_entrega)
                ? $this->normalizarMetodoEntrega($pedido->metodo_entrega)
                : 'Tienda';

            $validatedItems = $this->validateItems($items);

            $subtotal = 0.0;
            foreach ($validatedItems as $item) {
                $subtotal += $item['unit_price'] * $item['cantidad'];
            }

            $impuestos = round($subtotal * 0.13, 2);
            $total = round($subtotal + $impuestos, 2);
            $fechaCreacion = $this->escape(date('Y-m-d H:i:s'));

            $sql = "INSERT INTO pedidos
                (cliente_id, estado_id, metodo_entrega, subtotal, impuestos, total, costo_envio, fecha_creacion)
                VALUES
                ($clienteId, 1, '$metodoEntrega', $subtotal, $impuestos, $total, 0.00, '$fechaCreacion')";

            $pedidoId = $this->enlace->executeSQL_DML_last($sql);

            if ($pedidoId <= 0) {
                throw new Exception('No fue posible registrar el pedido.');
            }

            foreach ($validatedItems as $item) {
                $productoId = $item['item_type'] === 'producto' ? (int) $item['item_id'] : 'NULL';
                $comboId = $item['item_type'] === 'combo' ? (int) $item['item_id'] : 'NULL';
                $cantidad = (int) $item['cantidad'];
                $observacion = $this->escape('Pedido creado desde el menú seleccionado en la aplicación.');

                $detailSql = "INSERT INTO detalle_pedido
                    (pedido_id, producto_id, combo_id, cantidad, observaciones)
                    VALUES
                    ($pedidoId, $productoId, $comboId, $cantidad, '$observacion')";

                $this->enlace->executeSQL_DML($detailSql);
            }

            $trackingSql = "INSERT INTO seguimiento_pedido
                (pedido_id, estado_nombre, fecha_hora, comentario)
                VALUES
                ($pedidoId, 'Recibido', '$fechaCreacion', 'Pedido creado y enviado a seguimiento automatico.')";

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

    private function getDefaultClientId()
    {
        $sql = "SELECT id_usuario
            FROM usuarios
            ORDER BY id_usuario ASC
            LIMIT 1";

        $result = $this->enlace->executeSQL($sql);

        if (!is_array($result) || empty($result)) {
            return 0;
        }

        return (int) $result[0]->id_usuario;
    }

    private function normalizarMetodoEntrega($metodo)
    {
        $metodo = strtolower(trim((string) $metodo));

        if ($metodo === 'domicilio') {
            return 'Domicilio';
        }

        return 'Tienda';
    }

    private function escape($value)
    {
        return addslashes(trim((string) $value));
    }
}
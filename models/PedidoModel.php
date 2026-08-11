<?php

class PedidoModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    // =========================================================
    // LISTAR PEDIDOS
    // =========================================================

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
                    p.encargado_id,

                    u.nombre AS cliente_nombre,
                    u.correo AS cliente_correo,

                    e.nombre AS encargado_nombre,

                    p.metodo_entrega,
                    p.observaciones,
                    p.subtotal,
                    p.impuestos,
                    p.total,
                    p.fecha_creacion,

                    latest.estado_nombre AS estado_actual,
                    latest.fecha_hora AS fecha_ultimo_estado,

                    COALESCE(items.total_items, 0) AS total_items,

                    pago.metodo_pago,
                    pago.monto AS monto_pago,
                    pago.monto_recibido,
                    pago.vuelto,
                    pago.ultimos_cuatro_digitos,
                    pago.marca_tarjeta

                FROM pedidos p

                INNER JOIN usuarios u
                    ON u.id_usuario = p.cliente_id

                LEFT JOIN usuarios e
                    ON e.id_usuario = p.encargado_id

                LEFT JOIN (
                    SELECT
                        sp1.pedido_id,
                        sp1.estado_nombre,
                        sp1.fecha_hora

                    FROM seguimiento_pedido sp1

                    INNER JOIN (
                        SELECT
                            pedido_id,
                            MAX(id_seguimiento) AS last_id

                        FROM seguimiento_pedido

                        GROUP BY pedido_id
                    ) last_tracking
                        ON last_tracking.last_id =
                            sp1.id_seguimiento

                ) latest
                    ON latest.pedido_id =
                        p.id_pedido

                LEFT JOIN (
                    SELECT
                        pedido_id,
                        SUM(cantidad) AS total_items

                    FROM detalle_pedido

                    GROUP BY pedido_id
                ) items
                    ON items.pedido_id =
                        p.id_pedido

                LEFT JOIN pagos_simulados pago
                    ON pago.pedido_id =
                        p.id_pedido

                $clienteFilter

                ORDER BY
                    p.fecha_creacion DESC,
                    p.id_pedido DESC";

            $pedidos =
                $this->enlace->executeSQL($sql);

            if (
                !is_array($pedidos) ||
                empty($pedidos)
            ) {
                return [];
            }

            foreach ($pedidos as $pedido) {
                $pedido->items =
                    $this->getOrderItems(
                        (int) $pedido->id_pedido
                    );
            }

            return $pedidos;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // =========================================================
    // OBTENER PEDIDO POR ID
    // =========================================================

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
                    p.encargado_id,

                    u.nombre AS cliente_nombre,
                    u.correo AS cliente_correo,

                    e.nombre AS encargado_nombre,

                    p.metodo_entrega,
                    p.observaciones,
                    p.subtotal,
                    p.impuestos,
                    p.total,
                    p.fecha_creacion,

                    latest.estado_nombre AS estado_actual,

                    pago.metodo_pago,
                    pago.monto AS monto_pago,
                    pago.fecha_pago,
                    pago.ultimos_cuatro_digitos,
                    pago.marca_tarjeta,
                    pago.monto_recibido,
                    pago.vuelto

                FROM pedidos p

                INNER JOIN usuarios u
                    ON u.id_usuario =
                        p.cliente_id

                LEFT JOIN usuarios e
                    ON e.id_usuario =
                        p.encargado_id

                LEFT JOIN (
                    SELECT
                        sp1.pedido_id,
                        sp1.estado_nombre

                    FROM seguimiento_pedido sp1

                    INNER JOIN (
                        SELECT
                            pedido_id,
                            MAX(id_seguimiento) AS last_id

                        FROM seguimiento_pedido

                        GROUP BY pedido_id
                    ) last_tracking
                        ON last_tracking.last_id =
                            sp1.id_seguimiento

                ) latest
                    ON latest.pedido_id =
                        p.id_pedido

                LEFT JOIN pagos_simulados pago
                    ON pago.pedido_id =
                        p.id_pedido

                WHERE p.id_pedido =
                    $pedidoId

                LIMIT 1";

            $pedido =
                $this->enlace->executeSQL($sql);

            if (
                !is_array($pedido) ||
                empty($pedido)
            ) {
                return null;
            }

            $pedido = $pedido[0];

            $pedido->items =
                $this->getOrderItems(
                    $pedidoId
                );

            return $pedido;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // =========================================================
    // CREAR PEDIDO
    // =========================================================

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

            $metodoEntrega = isset($pedido->metodo_entrega) ? trim((string) $pedido->metodo_entrega) : 'Tienda';
            if (!in_array($metodoEntrega, ['Tienda', 'Domicilio'], true)) {
                throw new Exception('El metodo de entrega debe ser "Tienda" o "Domicilio".');
            }

            $direccionId = null;
            $costoEnvio = 0.00;

            if ($metodoEntrega === 'Domicilio') {
                $direccionId = isset($pedido->direccion_id) ? (int) $pedido->direccion_id : 0;
                if ($direccionId <= 0) {
                    throw new Exception('Debe seleccionar una direccion de entrega registrada.');
                }

                $direccion = $this->getDireccionEnvio($direccionId, $clienteId);
                if ($direccion === null) {
                    throw new Exception('La direccion seleccionada no es valida o no le pertenece.');
                }

                $costoEnvio = (float) $direccion->costo_zona;
            }

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
            $total = round($subtotal + $impuestos + $costoEnvio, 2);
            $pagoValidado = $this->validatePayment($pedido, $total);
            $fechaCreacion = $this->escape(date('Y-m-d H:i:s'));
            $observacionesSql = $observaciones === null ? 'NULL' : "'" . $this->escape($observaciones) . "'";
            $direccionIdSql = $direccionId === null ? 'NULL' : (int) $direccionId;

            $sql = "INSERT INTO pedidos
            (cliente_id, estado_id, metodo_entrega, direccion_id, observaciones, subtotal, impuestos, total, costo_envio, fecha_creacion)
            VALUES
            ($clienteId, 1, '$metodoEntrega', $direccionIdSql, $observacionesSql, $subtotal, $impuestos, $total, $costoEnvio, '$fechaCreacion')";

            $pedidoId = $this->enlace->executeSQL_DML_last($sql);

            if ($pedidoId <= 0) {
                throw new Exception('No fue posible registrar el pedido.');
            }

            $this->registerPayment($pedidoId, $pagoValidado, $total, $fechaCreacion);
            
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

    private function getDireccionEnvio($direccionId, $clienteId)
    {
        $direccionId = (int) $direccionId;
        $clienteId = (int) $clienteId;

        $sql = "SELECT id_direccion, detalles, referencias, latitud, longitud, costo_zona
        FROM direcciones_envio
        WHERE id_direccion = $direccionId AND usuario_id = $clienteId
        LIMIT 1";

        $result = $this->enlace->executeSQL($sql);

        return (is_array($result) && !empty($result)) ? $result[0] : null;
    }

    // =========================================================
    // VALIDAR PAGO
    // =========================================================

    private function validatePayment(
        $pedido,
        $total
    ) {
        if (
            !isset($pedido->pago) ||
            !is_object($pedido->pago)
        ) {
            throw new Exception(
                'Debe seleccionar un metodo de pago.'
            );
        }

        $pago =
            $pedido->pago;

        $metodoPago =
            isset($pago->metodo_pago)
            ? trim(
                (string)
                $pago->metodo_pago
            )
            : '';

        if (
            $metodoPago !== 'Efectivo' &&
            $metodoPago !== 'Tarjeta'
        ) {
            throw new Exception(
                'El metodo de pago seleccionado no es valido.'
            );
        }

        // =====================================================
        // EFECTIVO
        // =====================================================

        if (
            $metodoPago ===
            'Efectivo'
        ) {
            $montoRecibido =
                isset(
                    $pago->monto_recibido
                )
                ? (float)
                $pago->monto_recibido
                : 0;

            if (
                $montoRecibido <= 0
            ) {
                throw new Exception(
                    'Debe indicar el monto recibido.'
                );
            }

            if (
                $montoRecibido <
                $total
            ) {
                throw new Exception(
                    'El monto recibido es insuficiente para pagar el pedido.'
                );
            }

            $vuelto =
                round(
                    $montoRecibido -
                        $total,
                    2
                );

            return [
                'metodo_pago' =>
                'Efectivo',

                'monto_recibido' =>
                round(
                    $montoRecibido,
                    2
                ),

                'vuelto' =>
                $vuelto,

                'ultimos_cuatro_digitos' =>
                null,

                'marca_tarjeta' =>
                null,
            ];
        }

        // =====================================================
        // TARJETA
        // =====================================================

        $ultimosCuatro =
            isset(
                $pago
                    ->ultimos_cuatro_digitos
            )
            ? trim(
                (string)
                $pago
                    ->ultimos_cuatro_digitos
            )
            : '';

        if (
            !preg_match(
                '/^[0-9]{4}$/',
                $ultimosCuatro
            )
        ) {
            throw new Exception(
                'Debe indicar los ultimos 4 digitos de la tarjeta.'
            );
        }

        $marcaTarjeta =
            isset(
                $pago->marca_tarjeta
            )
            ? trim(
                (string)
                $pago->marca_tarjeta
            )
            : '';

        if (
            $marcaTarjeta === ''
        ) {
            throw new Exception(
                'Debe seleccionar la marca de la tarjeta.'
            );
        }

        $marcasPermitidas = [
            'Visa',
            'Mastercard',
            'American Express',
        ];

        if (
            !in_array(
                $marcaTarjeta,
                $marcasPermitidas,
                true
            )
        ) {
            throw new Exception(
                'La marca de tarjeta seleccionada no es valida.'
            );
        }

        return [
            'metodo_pago' =>
            'Tarjeta',

            'monto_recibido' =>
            round(
                $total,
                2
            ),

            'vuelto' =>
            0.00,

            'ultimos_cuatro_digitos' =>
            $ultimosCuatro,

            'marca_tarjeta' =>
            $marcaTarjeta,
        ];
    }

    // =========================================================
    // REGISTRAR PAGO
    // =========================================================

    private function registerPayment(
        $pedidoId,
        $pago,
        $total,
        $fechaPago
    ) {
        $pedidoId =
            (int) $pedidoId;

        $metodoPago =
            $this->escape(
                $pago['metodo_pago']
            );

        $total =
            round(
                (float) $total,
                2
            );

        // -----------------------------------------------------
        // EFECTIVO
        // -----------------------------------------------------

        if (
            $pago['metodo_pago'] ===
            'Efectivo'
        ) {
            $montoRecibido =
                round(
                    (float)
                    $pago['monto_recibido'],
                    2
                );

            $vuelto =
                round(
                    (float)
                    $pago['vuelto'],
                    2
                );

            $sql =
                "INSERT INTO pagos_simulados
                (
                    pedido_id,
                    metodo_pago,
                    monto,
                    fecha_pago,
                    ultimos_cuatro_digitos,
                    marca_tarjeta,
                    monto_recibido,
                    vuelto
                )
                VALUES
                (
                    $pedidoId,
                    '$metodoPago',
                    $total,
                    '$fechaPago',
                    NULL,
                    NULL,
                    $montoRecibido,
                    $vuelto
                )";

            $this->enlace
                ->executeSQL_DML(
                    $sql
                );

            return;
        }

        // -----------------------------------------------------
        // TARJETA
        // -----------------------------------------------------

        $ultimosCuatro =
            $this->escape(
                $pago['ultimos_cuatro_digitos']
            );

        $marcaTarjeta =
            $this->escape(
                $pago['marca_tarjeta']
            );

        /*
         * En tarjeta:
         * monto recibido = total
         * vuelto = 0
         */

        $sql =
            "INSERT INTO pagos_simulados
            (
                pedido_id,
                metodo_pago,
                monto,
                fecha_pago,
                ultimos_cuatro_digitos,
                marca_tarjeta,
                monto_recibido,
                vuelto
            )
            VALUES
            (
                $pedidoId,
                '$metodoPago',
                $total,
                '$fechaPago',
                '$ultimosCuatro',
                '$marcaTarjeta',
                $total,
                0.00
            )";

        $this->enlace
            ->executeSQL_DML(
                $sql
            );
    }

    // =========================================================
    // ITEMS
    // =========================================================

    private function getOrderItems(
        $pedidoId
    ) {
        $pedidoId =
            (int) $pedidoId;

        $sql =
            "SELECT
                dp.id_detalle,
                dp.cantidad,
                dp.observaciones,

                CASE
                    WHEN
                        dp.producto_id
                        IS NOT NULL
                    THEN 'producto'
                    ELSE 'combo'
                END AS item_type,

                COALESCE(
                    dp.producto_id,
                    dp.combo_id
                ) AS item_id,

                COALESCE(
                    p.nombre_producto,
                    c.nombre_combo
                ) AS nombre,

                COALESCE(
                    p.precio,
                    c.precio_especial
                ) AS precio_unitario,

                (
                    COALESCE(
                        p.precio,
                        c.precio_especial
                    ) *
                    dp.cantidad
                ) AS subtotal

            FROM detalle_pedido dp

            LEFT JOIN productos p
                ON p.id_producto =
                    dp.producto_id

            LEFT JOIN combos c
                ON c.id_combo =
                    dp.combo_id

            WHERE dp.pedido_id =
                $pedidoId

            ORDER BY
                dp.id_detalle ASC";

        $items =
            $this->enlace
            ->executeSQL(
                $sql
            );

        return is_array($items)
            ? $items
            : [];
    }

    // =========================================================
    // VALIDAR ITEMS
    // =========================================================

    private function validateItems(
        $items
    ) {
        $validatedItems = [];

        foreach ($items as $item) {

            $itemType =
                isset(
                    $item->item_type
                )
                ? strtolower(
                    trim(
                        (string)
                        $item->item_type
                    )
                )
                : '';

            $itemId =
                isset(
                    $item->item_id
                )
                ? (int)
                $item->item_id
                : 0;

            $cantidad =
                isset(
                    $item->cantidad
                )
                ? (int)
                $item->cantidad
                : 0;

            $observaciones =
                isset(
                    $item->observaciones
                )
                ? $this
                ->sanitizeDetailObservation(
                    $item
                        ->observaciones
                )
                : null;

            if (
                (
                    $itemType !==
                    'producto' &&
                    $itemType !==
                    'combo'
                ) ||
                $itemId <= 0 ||
                $cantidad <= 0
            ) {
                throw new Exception(
                    'Existe un elemento invalido dentro del pedido.'
                );
            }

            $catalogItem =
                $itemType ===
                'producto'
                ? $this->getProduct(
                    $itemId
                )
                : $this->getCombo(
                    $itemId
                );

            if (
                $catalogItem ===
                null
            ) {
                throw new Exception(
                    'Uno de los elementos seleccionados ya no se encuentra disponible.'
                );
            }

            $unitPrice =
                $itemType ===
                'producto'
                ? (float)
                $catalogItem
                    ->precio
                : (float)
                $catalogItem
                    ->precio_especial;

            $validatedItems[] = [
                'item_type' =>
                $itemType,

                'item_id' =>
                $itemId,

                'cantidad' =>
                $cantidad,

                'unit_price' =>
                $unitPrice,

                'observaciones' =>
                $observaciones,
            ];
        }

        return $validatedItems;
    }

    // =========================================================
    // PRODUCTO
    // =========================================================

    private function getProduct(
        $productId
    ) {
        $productId =
            (int) $productId;

        $sql =
            "SELECT
                id_producto,
                nombre_producto,
                precio,
                activo

            FROM productos

            WHERE id_producto =
                $productId

            LIMIT 1";

        $result =
            $this->enlace
            ->executeSQL(
                $sql
            );

        if (
            !is_array($result) ||
            empty($result)
        ) {
            return null;
        }

        $product =
            $result[0];

        return
            (int) $product->activo ===
            1
            ? $product
            : null;
    }

    // =========================================================
    // COMBO
    // =========================================================

    private function getCombo(
        $comboId
    ) {
        $comboId =
            (int) $comboId;

        $sql =
            "SELECT
                id_combo,
                nombre_combo,
                precio_especial,
                activo

            FROM combos

            WHERE id_combo =
                $comboId

            LIMIT 1";

        $result =
            $this->enlace
            ->executeSQL(
                $sql
            );

        if (
            !is_array($result) ||
            empty($result)
        ) {
            return null;
        }

        $combo =
            $result[0];

        return
            (int) $combo->activo ===
            1
            ? $combo
            : null;
    }

    // =========================================================
    // OBSERVACIÓN GENERAL
    // =========================================================

    private function sanitizeObservation(
        $observacion
    ) {
        $observacion =
            trim(
                (string)
                $observacion
            );

        if (
            $observacion === ''
        ) {
            return null;
        }

        return mb_substr(
            $observacion,
            0,
            500
        );
    }

    // =========================================================
    // OBSERVACIÓN DETALLE
    // =========================================================

    private function sanitizeDetailObservation(
        $observacion
    ) {
        $observacion =
            trim(
                (string)
                $observacion
            );

        if (
            $observacion === ''
        ) {
            return null;
        }

        return mb_substr(
            $observacion,
            0,
            300
        );
    }

    // =========================================================
    // ESCAPE
    // =========================================================

    private function escape(
        $value
    ) {
        return addslashes(
            trim(
                (string)
                $value
            )
        );
    }
}

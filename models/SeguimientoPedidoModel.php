<?php

class SeguimientoPedidoModel
{
    private const STATES = [
        [
            'name' => 'Pendiente de pago',
            'progress' => 0,
            'comment' => 'Pedido registrado y pendiente de confirmacion de pago.'
        ],
        [
            'name' => 'Recibido',
            'progress' => 25,
            'comment' => 'Pedido recibido y pendiente de preparacion.'
        ],
        [
            'name' => 'En preparacion',
            'progress' => 50,
            'comment' => 'El equipo de cocina ya esta preparando el pedido.'
        ],
        [
            'name' => 'En camino',
            'progress' => 75,
            'comment' => 'El pedido salio a entrega o esta listo para retiro.'
        ],
        [
            'name' => 'Entregado',
            'progress' => 100,
            'comment' => 'Pedido entregado al cliente.'
        ],
    ];

    private const UPDATE_INTERVAL_SECONDS = 5;
    private const TIENDA_LAT = 9.928069;
    private const TIENDA_LNG = -84.090725;
    private const DELIVERY_DURATION_SECONDS = 60; // duracion simulada del trayecto

    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function getTracking($pedidoId)
    {
        try {
            $pedidoId = (int) $pedidoId;

            if ($pedidoId <= 0) {
                return null;
            }

            $pedido = $this->getPedido($pedidoId);
            if ($pedido === null) {
                return null;
            }

            $this->ensureInitialTracking($pedido);
            $this->advanceTrackingIfNeeded($pedidoId);

            return $this->buildTrackingResponse($pedidoId);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function avanzarManual($pedidoId, $comentario = null)
    {
        try {
            $pedidoId = (int) $pedidoId;
            $pedido = $this->getPedido($pedidoId);
            if ($pedido === null) {
                return null;
            }

            $this->avanzarAlSiguienteEstado($pedidoId, $comentario);

            return $this->buildTrackingResponse($pedidoId);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function createDemoOrder()
    {
        try {
            $cliente = $this->getDemoClient();
            if ($cliente === null) {
                throw new Exception('No existe ningun usuario para asignar al pedido demo.');
            }

            $now = $this->getCurrentTimestamp();

            $sql = "INSERT INTO pedidos
                (cliente_id, estado_id, metodo_entrega, subtotal, impuestos, total, costo_envio, fecha_creacion)
                VALUES
                ({$cliente->id_usuario}, 1, 'Domicilio', 6500.00, 845.00, 7345.00, 0.00, '$now')";

            $pedidoId = $this->enlace->executeSQL_DML_last($sql);

            if ($pedidoId <= 0) {
                throw new Exception('No fue posible crear el pedido demo.');
            }

            $this->insertTrackingRow($pedidoId, self::STATES[0], $now);

            return $this->buildTrackingResponse($pedidoId);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    private function avanzarAlSiguienteEstado($pedidoId, $comentarioOverride = null)
    {
        $history = $this->getTrackingHistory($pedidoId);
        if (empty($history)) {
            return false;
        }

        $latest = end($history);
        reset($history);

        $currentIndex = $this->findStateIndex($latest->estado_nombre);
        if ($currentIndex === null || $currentIndex >= count(self::STATES) - 1) {
            return false;
        }

        $nextIndex = $currentIndex + 1;
        $nextState = self::STATES[$nextIndex];
        if ($comentarioOverride) {
            $nextState['comment'] = trim($comentarioOverride);
        }

        $repartidorId = null;
        $latitud = null;
        $longitud = null;

        if ($nextState['name'] === 'En camino') {
            $repartidorId = $this->asignarRepartidor();
            $latitud = self::TIENDA_LAT;
            $longitud = self::TIENDA_LNG;
        }

        $this->insertTrackingRow($pedidoId, $nextState, null, $repartidorId, $latitud, $longitud);
        $this->updatePedidoEstado($pedidoId, $nextIndex + 1);

        return true;
    }

    private function buildTrackingResponse($pedidoId)
    {
        $pedido = $this->getPedido($pedidoId);
        $history = $this->getTrackingHistory($pedidoId);
        $latest = end($history);
        reset($history);

        $direccion = $this->getDireccionPedido($pedidoId);
        $ubicacionRepartidor = $this->calcularUbicacionRepartidor($latest, $direccion);

        return (object) [
            'pedido_id' => (int) $pedido->id_pedido,
            'cliente' => (object) [
                'id' => (int) $pedido->cliente_id,
                'nombre' => $pedido->cliente_nombre,
                'correo' => $pedido->cliente_correo,
            ],
            'metodo_entrega' => $pedido->metodo_entrega,
            'direccion_entrega' => $direccion,
            'fecha_creacion' => $pedido->fecha_creacion,
            'estado_actual' => $latest->estado_nombre,
            'comentario_actual' => $latest->comentario,
            'progreso' => (int) $latest->progreso,
            'repartidor_id' => $latest->repartidor_id,
            'ubicacion_repartidor' => $ubicacionRepartidor,
            'actualizacion_automatica_segundos' => self::UPDATE_INTERVAL_SECONDS,
            'historial' => $history,
        ];
    }

    private function getPedido($pedidoId)
    {
        $pedidoId = (int) $pedidoId;

        $sql = "SELECT
                p.id_pedido,
                p.cliente_id,
                p.metodo_entrega,
                p.fecha_creacion,
                u.nombre AS cliente_nombre,
                u.correo AS cliente_correo
            FROM pedidos p
            INNER JOIN usuarios u
                ON u.id_usuario = p.cliente_id
            WHERE p.id_pedido = $pedidoId
            LIMIT 1";

        $result = $this->enlace->executeSQL($sql);

        if (!is_array($result) || empty($result)) {
            return null;
        }

        return $result[0];
    }

    private function getDireccionPedido($pedidoId)
    {
        $pedidoId = (int) $pedidoId;

        $sql = "SELECT de.id_direccion, de.detalles, de.referencias, de.latitud, de.longitud
            FROM pedidos p
            INNER JOIN direcciones_envio de ON de.id_direccion = p.direccion_id
            WHERE p.id_pedido = $pedidoId
            LIMIT 1";

        $result = $this->enlace->executeSQL($sql);

        return (is_array($result) && !empty($result)) ? $result[0] : null;
    }

    private function calcularUbicacionRepartidor($latestTracking, $direccion)
    {
        if ($direccion === null || $latestTracking === false) {
            return null; // Pedido para retirar en tienda, no aplica mapa
        }

        if ($latestTracking->estado_nombre === 'Entregado') {
            return (object) [
                'latitud' => (float) $direccion->latitud,
                'longitud' => (float) $direccion->longitud,
                'progreso_ruta' => 100,
            ];
        }

        if ($latestTracking->estado_nombre !== 'En camino') {
            return null;
        }

        $latInicio = self::TIENDA_LAT;
        $lngInicio = self::TIENDA_LNG;
        $latFin = (float) $direccion->latitud;
        $lngFin = (float) $direccion->longitud;

        $inicioTimestamp = strtotime($latestTracking->fecha_hora);
        $elapsed = $inicioTimestamp !== false ? (time() - $inicioTimestamp) : 0;
        $fraction = self::DELIVERY_DURATION_SECONDS > 0
            ? min(1, max(0, $elapsed / self::DELIVERY_DURATION_SECONDS))
            : 1;

        return (object) [
            'latitud' => round($latInicio + (($latFin - $latInicio) * $fraction), 8),
            'longitud' => round($lngInicio + (($lngFin - $lngInicio) * $fraction), 8),
            'progreso_ruta' => (int) round($fraction * 100),
        ];
    }

    private function getDemoClient()
    {
        $sql = "SELECT id_usuario, nombre, correo
            FROM usuarios
            ORDER BY id_usuario ASC
            LIMIT 1";

        $result = $this->enlace->executeSQL($sql);

        return (is_array($result) && !empty($result)) ? $result[0] : null;
    }

    private function getTrackingHistory($pedidoId)
    {
        $pedidoId = (int) $pedidoId;

        $sql = "SELECT
                id_seguimiento,
                pedido_id,
                repartidor_id,
                estado_nombre,
                comentario,
                fecha_hora,
                latitud,
                longitud
            FROM seguimiento_pedido
            WHERE pedido_id = $pedidoId
            ORDER BY fecha_hora DESC, id_seguimiento DESC";

        $rows = $this->enlace->executeSQL($sql);
        if (!is_array($rows) || empty($rows)) {
            return [];
        }

        $history = [];

        foreach ($rows as $row) {
            $stateMeta = $this->findState($row->estado_nombre);

            $history[] = (object) [
                'id_seguimiento' => (int) $row->id_seguimiento,
                'pedido_id' => (int) $row->pedido_id,
                'repartidor_id' => $row->repartidor_id !== null ? (int) $row->repartidor_id : null,
                'estado_nombre' => $row->estado_nombre,
                'comentario' => $row->comentario,
                'fecha_hora' => $row->fecha_hora,
                'progreso' => $stateMeta['progress'],
            ];
        }

        return $history;
    }

    private function ensureInitialTracking($pedido)
    {
        $pedidoId = (int) $pedido->id_pedido;
        $history = $this->getTrackingHistory($pedidoId);

        if (!empty($history)) {
            return;
        }

        $createdAt = $this->escape($pedido->fecha_creacion);
        $state = self::STATES[0];
        $comment = $this->escape($state['comment']);

        $sql = "INSERT INTO seguimiento_pedido
            (pedido_id, estado_nombre, fecha_hora, comentario)
            VALUES
            ($pedidoId, '{$state['name']}', '$createdAt', '$comment')";

        $this->enlace->executeSQL_DML($sql);
        $this->updatePedidoEstado($pedidoId, 1);
    }

    private function advanceTrackingIfNeeded($pedidoId)
    {
        $history = $this->getTrackingHistory($pedidoId);
        if (empty($history)) {
            return;
        }

        $latest = end($history);
        reset($history);

        $lastUpdateTime = strtotime($latest->fecha_hora);
        if ($lastUpdateTime === false) {
            return;
        }

        if ((time() - $lastUpdateTime) < self::UPDATE_INTERVAL_SECONDS) {
            return;
        }

        $this->avanzarAlSiguienteEstado($pedidoId);
    }

    private function asignarRepartidor()
    {
        $sql = "SELECT id_repartidor FROM repartidores ORDER BY RAND() LIMIT 1";
        $result = $this->enlace->executeSQL($sql);

        return (is_array($result) && !empty($result)) ? (int) $result[0]->id_repartidor : null;
    }

    private function insertTrackingRow($pedidoId, $state, $timestamp = null, $repartidorId = null, $latitud = null, $longitud = null)
    {
        $pedidoId = (int) $pedidoId;
        $stateName = $this->escape($state['name']);
        $comment = $this->escape($state['comment']);
        $timestamp = $this->escape($timestamp ?? $this->getCurrentTimestamp());
        $repartidorSql = $repartidorId === null ? 'NULL' : (int) $repartidorId;
        $latSql = $latitud === null ? 'NULL' : (float) $latitud;
        $lngSql = $longitud === null ? 'NULL' : (float) $longitud;

        $sql = "INSERT INTO seguimiento_pedido
            (pedido_id, repartidor_id, estado_nombre, comentario, fecha_hora, latitud, longitud)
            VALUES
            ($pedidoId, $repartidorSql, '$stateName', '$comment', '$timestamp', $latSql, $lngSql)";

        $this->enlace->executeSQL_DML($sql);
    }

    private function updatePedidoEstado($pedidoId, $estadoId)
    {
        $pedidoId = (int) $pedidoId;
        $estadoId = (int) $estadoId;

        $sql = "UPDATE pedidos
            SET estado_id = $estadoId
            WHERE id_pedido = $pedidoId";

        $this->enlace->executeSQL_DML($sql);
    }

    private function findState($stateName)
    {
        $stateIndex = $this->findStateIndex($stateName);

        return $stateIndex === null ? self::STATES[0] : self::STATES[$stateIndex];
    }

    private function findStateIndex($stateName)
    {
        foreach (self::STATES as $index => $state) {
            if (strcasecmp($state['name'], (string) $stateName) === 0) {
                return $index;
            }
        }

        return null;
    }

    private function escape($value)
    {
        return addslashes(trim((string) $value));
    }

    private function getCurrentTimestamp()
    {
        return date('Y-m-d H:i:s');
    }
}
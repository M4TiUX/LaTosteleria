<?php

class SeguimientoPedidoModel
{
    private const STATES = [
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

    private function buildTrackingResponse($pedidoId)
    {
        $pedido = $this->getPedido($pedidoId);
        $history = $this->getTrackingHistory($pedidoId);
        $latest = end($history);
        reset($history);

        return (object) [
            'pedido_id' => (int) $pedido->id_pedido,
            'cliente' => (object) [
                'id' => (int) $pedido->cliente_id,
                'nombre' => $pedido->cliente_nombre,
                'correo' => $pedido->cliente_correo,
            ],
            'metodo_entrega' => $pedido->metodo_entrega,
            'fecha_creacion' => $pedido->fecha_creacion,
            'estado_actual' => $latest->estado_nombre,
            'comentario_actual' => $latest->comentario,
            'progreso' => (int) $latest->progreso,
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

    private function getDemoClient()
    {
        $sql = "SELECT id_usuario, nombre, correo
            FROM usuarios
            ORDER BY id_usuario ASC
            LIMIT 1";

        $result = $this->enlace->executeSQL($sql);

        if (!is_array($result) || empty($result)) {
            return null;
        }

        return $result[0];
    }

    private function getTrackingHistory($pedidoId)
    {
        $pedidoId = (int) $pedidoId;

        $sql = "SELECT
                id_seguimiento,
                pedido_id,
                estado_nombre,
                comentario,
                fecha_hora
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

        $currentIndex = $this->findStateIndex($latest->estado_nombre);
        if ($currentIndex === null || $currentIndex >= count(self::STATES) - 1) {
            return;
        }

        $lastUpdateTime = strtotime($latest->fecha_hora);
        if ($lastUpdateTime === false) {
            return;
        }

        if ((time() - $lastUpdateTime) < self::UPDATE_INTERVAL_SECONDS) {
            return;
        }

        $nextIndex = $currentIndex + 1;
        $nextState = self::STATES[$nextIndex];

        $this->insertTrackingRow($pedidoId, $nextState);
        $this->updatePedidoEstado($pedidoId, $nextIndex + 1);
    }

    private function insertTrackingRow($pedidoId, $state, $timestamp = null)
    {
        $pedidoId = (int) $pedidoId;
        $stateName = $this->escape($state['name']);
        $comment = $this->escape($state['comment']);
        $timestamp = $this->escape($timestamp ?? $this->getCurrentTimestamp());

        $sql = "INSERT INTO seguimiento_pedido
            (pedido_id, estado_nombre, comentario, fecha_hora)
            VALUES
            ($pedidoId, '$stateName', '$comment', '$timestamp')";

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
<?php

// ============================================================
// update_location.php
//
// Endpoint standalone (NO pasa por RoutesController) para la
// ubicacion en tiempo real del repartidor.
//
// GET  ?pedido_id=5   -> SIMULA la posicion actual del repartidor
//                        (interpola entre la tienda y la direccion
//                        de entrega segun el tiempo transcurrido).
//
// POST { "pedido_id": 5, "latitud": 9.93, "longitud": -84.09 }
//                     -> RECIBE una posicion real (por ejemplo,
//                        desde el dispositivo GPS de un repartidor)
//                        y la guarda como la posicion mas reciente.
// ============================================================

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Mismos requires que usa index.php, para cargar exactamente
// las mismas clases del mismo modo (Composer autoload + core).
require_once __DIR__ . '/vendor/autoload.php';

require_once __DIR__ . '/controllers/core/Config.php';
require_once __DIR__ . '/controllers/core/HandleException.php';
require_once __DIR__ . '/controllers/core/Logger.php';
require_once __DIR__ . '/controllers/core/MySqlConnect.php';
require_once __DIR__ . '/controllers/core/Request.php';
require_once __DIR__ . '/controllers/core/Response.php';

// Ubicacion de la tienda (debe coincidir con la usada en
// SeguimientoPedidoModel::TIENDA_LAT / TIENDA_LNG)
const TIENDA_LAT = 9.928069;
const TIENDA_LNG = -84.090725;
const DELIVERY_DURATION_SECONDS = 60; // duracion simulada del trayecto

function responderError($mensaje, $status = 400)
{
    http_response_code($status);
    echo json_encode([
        'status' => 'error',
        'message' => $mensaje,
    ]);
    exit();
}

function responderOk($data)
{
    echo json_encode(array_merge(['status' => 'ok'], $data));
    exit();
}

function escapeValue($enlace, $value)
{
    return addslashes(trim((string) $value));
}

try {
    $enlace = new MySqlConnect();
    $metodo = $_SERVER['REQUEST_METHOD'];

    // ========================================================
    // GET -> SIMULAR posicion actual (interpolacion)
    // ========================================================

    if ($metodo === 'GET') {
        $pedidoId = isset($_GET['pedido_id']) ? (int) $_GET['pedido_id'] : 0;

        if ($pedidoId <= 0) {
            responderError('Debe indicar pedido_id.');
        }

        // Traer el pedido y su direccion de entrega
        $sqlPedido = "SELECT p.id_pedido, p.metodo_entrega,
                de.latitud AS destino_lat, de.longitud AS destino_lng
            FROM pedidos p
            LEFT JOIN direcciones_envio de ON de.id_direccion = p.direccion_id
            WHERE p.id_pedido = $pedidoId
            LIMIT 1";

        $pedidoResult = $enlace->executeSQL($sqlPedido);

        if (!is_array($pedidoResult) || empty($pedidoResult)) {
            responderError('Pedido no encontrado.', 404);
        }

        $pedido = $pedidoResult[0];

        if ($pedido->metodo_entrega !== 'Domicilio' || $pedido->destino_lat === null) {
            responderOk([
                'pedido_id' => $pedidoId,
                'ubicacion_repartidor' => null,
                'message' => 'Este pedido no tiene entrega a domicilio.',
            ]);
        }

        // Traer el ultimo registro de seguimiento
        $sqlSeguimiento = "SELECT estado_nombre, fecha_hora
            FROM seguimiento_pedido
            WHERE pedido_id = $pedidoId
            ORDER BY fecha_hora DESC, id_seguimiento DESC
            LIMIT 1";

        $seguimientoResult = $enlace->executeSQL($sqlSeguimiento);

        if (!is_array($seguimientoResult) || empty($seguimientoResult)) {
            responderOk([
                'pedido_id' => $pedidoId,
                'ubicacion_repartidor' => null,
            ]);
        }

        $latest = $seguimientoResult[0];

        // Si ya fue entregado, el repartidor "esta" en el destino
        if ($latest->estado_nombre === 'Entregado') {
            responderOk([
                'pedido_id' => $pedidoId,
                'estado_actual' => $latest->estado_nombre,
                'ubicacion_repartidor' => [
                    'latitud' => (float) $pedido->destino_lat,
                    'longitud' => (float) $pedido->destino_lng,
                    'progreso_ruta' => 100,
                ],
            ]);
        }

        // Si todavia no esta "En camino", no hay posicion que mostrar
        if ($latest->estado_nombre !== 'En camino') {
            responderOk([
                'pedido_id' => $pedidoId,
                'estado_actual' => $latest->estado_nombre,
                'ubicacion_repartidor' => null,
            ]);
        }

        // Interpolar posicion segun el tiempo transcurrido desde
        // que el pedido paso a "En camino"
        $inicioTimestamp = strtotime($latest->fecha_hora);
        $elapsed = $inicioTimestamp !== false ? (time() - $inicioTimestamp) : 0;
        $fraction = DELIVERY_DURATION_SECONDS > 0
            ? min(1, max(0, $elapsed / DELIVERY_DURATION_SECONDS))
            : 1;

        $latActual = TIENDA_LAT + ((float) $pedido->destino_lat - TIENDA_LAT) * $fraction;
        $lngActual = TIENDA_LNG + ((float) $pedido->destino_lng - TIENDA_LNG) * $fraction;

        responderOk([
            'pedido_id' => $pedidoId,
            'estado_actual' => $latest->estado_nombre,
            'ubicacion_repartidor' => [
                'latitud' => round($latActual, 8),
                'longitud' => round($lngActual, 8),
                'progreso_ruta' => (int) round($fraction * 100),
            ],
        ]);
    }

    // ========================================================
    // POST -> RECIBIR una posicion real del repartidor
    // ========================================================

    if ($metodo === 'POST') {
        $rawBody = file_get_contents('php://input');
        $body = json_decode($rawBody);

        if (!is_object($body)) {
            responderError('Debe enviar un JSON valido.');
        }

        $pedidoId = isset($body->pedido_id) ? (int) $body->pedido_id : 0;
        $latitud = isset($body->latitud) ? (float) $body->latitud : null;
        $longitud = isset($body->longitud) ? (float) $body->longitud : null;

        if ($pedidoId <= 0 || $latitud === null || $longitud === null) {
            responderError('Debe indicar pedido_id, latitud y longitud.');
        }

        $sqlCheck = "SELECT id_seguimiento, estado_nombre
            FROM seguimiento_pedido
            WHERE pedido_id = $pedidoId
            ORDER BY fecha_hora DESC, id_seguimiento DESC
            LIMIT 1";

        $latestResult = $enlace->executeSQL($sqlCheck);

        if (!is_array($latestResult) || empty($latestResult)) {
            responderError('El pedido no tiene seguimiento registrado.', 404);
        }

        $latest = $latestResult[0];

        if ($latest->estado_nombre !== 'En camino') {
            responderError('Solo se puede actualizar la ubicacion cuando el pedido esta "En camino".');
        }

        $idSeguimiento = (int) $latest->id_seguimiento;

        $sqlUpdate = "UPDATE seguimiento_pedido
            SET latitud = $latitud, longitud = $longitud
            WHERE id_seguimiento = $idSeguimiento";

        $enlace->executeSQL_DML($sqlUpdate);

        responderOk([
            'message' => 'Ubicacion del repartidor actualizada.',
            'pedido_id' => $pedidoId,
            'ubicacion_repartidor' => [
                'latitud' => $latitud,
                'longitud' => $longitud,
            ],
        ]);
    }

    responderError('Metodo no permitido.', 405);
} catch (Exception $e) {
    if (function_exists('handleException')) {
        handleException($e);
    } else {
        responderError($e->getMessage(), 500);
    }
}
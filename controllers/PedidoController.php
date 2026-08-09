<?php

class pedido
{
    public function index()
    {
        try {
            $response = new Response();
            $pedidoModel = new PedidoModel();

            $clienteId = isset($_GET['cliente_id']) ? (int) $_GET['cliente_id'] : null;
            $result = $pedidoModel->all($clienteId);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $response = new Response();
            $pedidoModel = new PedidoModel();

            $result = $pedidoModel->get((int) $id);

            if ($result === null) {
                $response->status(404)->toJSON([
                    'message' => 'No se encontro el pedido solicitado.'
                ]);
                return;
            }

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            $pedidoModel = new PedidoModel();

            $inputJSON = $request->getJSON();
            $result = $pedidoModel->create($inputJSON);

            $response->status(201)->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // appLaTosteleria/controllers/PedidoController.php

    public function getUbicacionRepartidor($idPedido)
    {
        try {
            $response = new Response();
            $pedidoModel = new PedidoModel();
            $repartidorModel = new RepartidorModel();

            // Obtener el repartidor_id del pedido
            $repartidorId = $pedidoModel->getRepartidorId((int) $idPedido);
            if (!$repartidorId) {
                $response->status(404)->toJSON(['error' => 'Pedido no tiene repartidor asignado']);
                return;
            }

            // Obtener ubicación del repartidor
            $ubicacion = $repartidorModel->getUbicacionRepartidor($repartidorId);
            if (!$ubicacion || !isset($ubicacion->latitud) || !isset($ubicacion->longitud)) {
                $response->status(404)->toJSON(['error' => 'Ubicación no disponible']);
                return;
            }

            $response->toJSON($ubicacion);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function actualizarEstado($idPedido)
    {
        try {
            $request = new Request();
            $response = new Response();
            $pedidoModel = new PedidoModel();

            $data = $request->getJSON();
            $nuevoEstadoId = $data['estado_id'] ?? null;

            if (!$nuevoEstadoId) {
                $response->status(400)->toJSON(['error' => 'Estado requerido']);
                return;
            }

            $result = $pedidoModel->updateEstado((int) $idPedido, (int) $nuevoEstadoId);
            $response->toJSON(['success' => $result]);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}

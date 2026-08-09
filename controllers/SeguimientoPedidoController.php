<?php

class seguimientoPedido
{
    public function get($id)
    {
        try {
            $response = new Response();
            $seguimientoModel = new SeguimientoPedidoModel();

            $result = $seguimientoModel->getTracking((int) $id);

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

    public function createDemo()
    {
        try {
            $response = new Response();
            $seguimientoModel = new SeguimientoPedidoModel();

            $result = $seguimientoModel->createDemoOrder();

            $response->status(201)->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
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
}
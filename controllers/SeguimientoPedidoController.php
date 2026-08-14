<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class seguimientoPedido
{
    public function get($id)
    {
        try {
            $response = new Response();
            $seguimientoModel = new SeguimientoPedidoModel();

            $authUser = $this->getAuthenticatedUser();
            if (!$authUser) {
                $response->status(401)->toJSON(['message' => 'No autenticado.']);
                return;
            }

            $role = $authUser->rol->name ?? '';
            $authId = isset($authUser->id) ? (int) $authUser->id : 0;

            $result = $seguimientoModel->getTracking((int) $id);

            if ($result === null) {
                $response->status(404)->toJSON([
                    'message' => 'No se encontro el pedido solicitado.'
                ]);
                return;
            }

            if (
                $role === 'Cliente' &&
                isset($result->cliente->id) &&
                (int) $result->cliente->id !== $authId
            ) {
                $response->status(403)->toJSON([
                    'message' => 'No puede consultar el seguimiento de pedidos de otro cliente.'
                ]);
                return;
            }

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update($id)
    {
        try {
            $request = new Request();
            $response = new Response();
            $seguimientoModel = new SeguimientoPedidoModel();

            $authUser = $this->getAuthenticatedUser();
            if (!$authUser) {
                $response->status(401)->toJSON(['message' => 'No autenticado.']);
                return;
            }

            $role = $authUser->rol->name ?? '';
            if ($role !== 'Administrador' && $role !== 'Encargado' && $role !== 'Cocina') {
                $response->status(403)->toJSON(['message' => 'No tiene permisos para actualizar seguimiento.']);
                return;
            }

            $body = $request->getJSON();

            $result = $seguimientoModel->avanzarManual((int) $id, $body->comentario ?? null);
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

            $authUser = $this->getAuthenticatedUser();
            if (!$authUser) {
                $response->status(401)->toJSON(['message' => 'No autenticado.']);
                return;
            }

            $role = $authUser->rol->name ?? '';
            if ($role !== 'Administrador' && $role !== 'Encargado') {
                $response->status(403)->toJSON(['message' => 'No tiene permisos para crear pedidos demo.']);
                return;
            }

            $result = $seguimientoModel->createDemoOrder();

            $response->status(201)->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    private function getAuthenticatedUser()
    {
        try {
            $headers = function_exists('apache_request_headers') ? apache_request_headers() : [];
            $authHeader = '';

            foreach ($headers as $key => $value) {
                if (strtolower($key) === 'authorization') {
                    $authHeader = $value;
                    break;
                }
            }

            if (!$authHeader && isset($_SERVER['HTTP_AUTHORIZATION'])) {
                $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
            }

            if (!$authHeader || !preg_match('/Bearer\s+(\S+)/i', $authHeader, $matches)) {
                return null;
            }

            return JWT::decode(
                $matches[1],
                new Key(config::get('SECRET_KEY'), 'HS256')
            );
        } catch (Exception $e) {
            return null;
        }
    }
}
<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class direccionEnvio
{
    public function index()
    {
        try {
            $response = new Response();
            $model = new DireccionEnvioModel();

            $authUser = $this->getAuthenticatedUser();
            if (!$authUser) {
                $response->status(401)->toJSON(['message' => 'No autenticado.']);
                return;
            }

            $role = $authUser->rol->name ?? '';
            $authId = isset($authUser->id) ? (int) $authUser->id : 0;

            $usuarioId = isset($_GET['usuario_id']) ? (int) $_GET['usuario_id'] : 0;
            if ($usuarioId <= 0) {
                $response->status(400)->toJSON(['message' => 'Debe indicar el usuario_id.']);
                return;
            }

            if (($role === 'Cliente' || $role === 'Cocina') && $usuarioId !== $authId) {
                $response->status(403)->toJSON(['message' => 'No puede consultar direcciones de otro usuario.']);
                return;
            }

            $result = $model->all($usuarioId);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $response = new Response();
            $model = new DireccionEnvioModel();

            $authUser = $this->getAuthenticatedUser();
            if (!$authUser) {
                $response->status(401)->toJSON(['message' => 'No autenticado.']);
                return;
            }

            $role = $authUser->rol->name ?? '';
            $authId = isset($authUser->id) ? (int) $authUser->id : 0;

            $result = $model->get((int) $id);

            if ($result === null) {
                $response->status(404)->toJSON(['message' => 'Direccion no encontrada.']);
                return;
            }

            if (($role === 'Cliente' || $role === 'Cocina') && (int) $result->usuario_id !== $authId) {
                $response->status(403)->toJSON(['message' => 'No puede consultar direcciones de otro usuario.']);
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
            $model = new DireccionEnvioModel();

            $authUser = $this->getAuthenticatedUser();
            if (!$authUser) {
                $response->status(401)->toJSON(['message' => 'No autenticado.']);
                return;
            }

            $role = $authUser->rol->name ?? '';
            $authId = isset($authUser->id) ? (int) $authUser->id : 0;
            $body = $request->getJSON();

            if (!is_object($body)) {
                $response->status(400)->toJSON(['message' => 'Debe enviar la informacion de la direccion.']);
                return;
            }

            if ($role === 'Cliente' || $role === 'Cocina') {
                $body->usuario_id = $authId;
            }

            $result = $model->create($body);
            $response->status(201)->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update($id)
    {
        try {
            $request = new Request();
            $response = new Response();
            $model = new DireccionEnvioModel();

            $authUser = $this->getAuthenticatedUser();
            if (!$authUser) {
                $response->status(401)->toJSON(['message' => 'No autenticado.']);
                return;
            }

            $role = $authUser->rol->name ?? '';
            $authId = isset($authUser->id) ? (int) $authUser->id : 0;

            $current = $model->get((int) $id);
            if ($current === null) {
                $response->status(404)->toJSON(['message' => 'Direccion no encontrada.']);
                return;
            }

            if (($role === 'Cliente' || $role === 'Cocina') && (int) $current->usuario_id !== $authId) {
                $response->status(403)->toJSON(['message' => 'No puede modificar direcciones de otro usuario.']);
                return;
            }

            $result = $model->update((int) $id, $request->getJSON());
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function delete($id)
    {
        try {
            $response = new Response();
            $model = new DireccionEnvioModel();

            $authUser = $this->getAuthenticatedUser();
            if (!$authUser) {
                $response->status(401)->toJSON(['message' => 'No autenticado.']);
                return;
            }

            $role = $authUser->rol->name ?? '';
            $authId = isset($authUser->id) ? (int) $authUser->id : 0;

            $current = $model->get((int) $id);
            if ($current === null) {
                $response->status(404)->toJSON(['message' => 'Direccion no encontrada.']);
                return;
            }

            if (($role === 'Cliente' || $role === 'Cocina') && (int) $current->usuario_id !== $authId) {
                $response->status(403)->toJSON(['message' => 'No puede eliminar direcciones de otro usuario.']);
                return;
            }

            $model->delete((int) $id);
            $response->toJSON(['message' => 'Direccion eliminada correctamente.']);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    private function getAuthenticatedUser()
    {
        try {
            $headers = function_exists('getallheaders') ? getallheaders() : [];

            if (function_exists('apache_request_headers')) {
                $headers = array_merge($headers, apache_request_headers());
            }
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

            if (!$authHeader && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
                $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
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

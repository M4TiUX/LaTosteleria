<?php

class direccionEnvio
{
    public function index()
    {
        try {
            $response = new Response();
            $model = new DireccionEnvioModel();

            $usuarioId = isset($_GET['usuario_id']) ? (int) $_GET['usuario_id'] : 0;
            if ($usuarioId <= 0) {
                $response->status(400)->toJSON(['message' => 'Debe indicar el usuario_id.']);
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

            $result = $model->get((int) $id);

            if ($result === null) {
                $response->status(404)->toJSON(['message' => 'Direccion no encontrada.']);
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

            $result = $model->create($request->getJSON());
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

            $model->delete((int) $id);
            $response->toJSON(['message' => 'Direccion eliminada correctamente.']);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}

//prueba de git 1.0
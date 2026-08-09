<?php
class RepartidorController
{
    private $model;

    public function __construct()
    {
        $this->model = new RepartidorModel();
    }

    /**
     * Endpoint para que el repartidor actualice su ubicación (vía POST)
     * Espera JSON: { "latitud": 4.6097, "longitud": -74.0817 }
     */
    public function actualizarUbicacion()
    {
        try {
            $request = new Request();
            $response = new Response();

            // En una implementación real, aquí obtendrías el ID del repartidor autenticado
            // Por ahora, lo tomamos del cuerpo o de un parámetro fijo (para simulación)
            $idRepartidor = $_POST['id_repartidor'] ?? 1; // O desde sesión

            $data = $request->getJSON();
            $latitud = $data['latitud'] ?? null;
            $longitud = $data['longitud'] ?? null;

            if (!$latitud || !$longitud) {
                $response->status(400)->toJSON(['error' => 'Faltan latitud o longitud']);
                return;
            }

            $success = $this->model->actualizarUbicacion($idRepartidor, $latitud, $longitud);
            $response->toJSON(['success' => $success]);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Endpoint para obtener la ubicación de un repartidor (GET)
     * @param int $idRepartidor
     */
    public function getUbicacion($idRepartidor)
    {
        try {
            $response = new Response();
            $ubicacion = $this->model->getUbicacionRepartidor((int) $idRepartidor);
            if (!$ubicacion) {
                $response->status(404)->toJSON(['error' => 'Ubicación no disponible']);
                return;
            }
            $response->toJSON($ubicacion);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}

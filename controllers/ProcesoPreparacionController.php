<?php
class ProcesoPreparacionController
{
    private $model;

    public function __construct()
    {
        $this->model = new ProcesoPreparacionModel();
    }

    // GET /APILATOSTELERIA/ProcesoPreparacion
    // Lista todos los procesos con nombre del producto y total de estaciones
    public function index()
    {
        $procesos = $this->model->all();

        if ($procesos) {
            $json = [
                'status' => 200,
                'result' => $procesos
            ];
        } else {
            $json = [
                'status' => 404,
                'result' => 'No se encontraron procesos de preparación'
            ];
        }

        echo json_encode($json, http_response_code($json['status']));
    }

    // GET /APILATOSTELERIA/ProcesoPreparacion/show/{producto_id}
    // Detalle de un proceso: nombre del producto + estaciones ordenadas
    public function show($producto_id)
    {
        $proceso = $this->model->get($producto_id);

        if ($proceso) {
            $json = [
                'status' => 200,
                'result' => $proceso
            ];
        } else {
            $json = [
                'status' => 404,
                'result' => 'Proceso no encontrado para el producto indicado'
            ];
        }

        echo json_encode($json, http_response_code($json['status']));
    }
}

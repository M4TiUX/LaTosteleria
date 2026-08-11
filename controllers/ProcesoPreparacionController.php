<?php

class ProcesoPreparacionController
{
    private $model;

    public function __construct()
    {
        $this->model = new ProcesoPreparacionModel();
    }

    // =========================================================
    // GET - LISTAR PROCESOS
    // =========================================================
    public function index()
    {
        $procesos = $this->model->all();

        $json = [
            'status' => 200,
            'result' => $procesos ?: []
        ];

        echo json_encode(
            $json,
            http_response_code($json['status'])
        );
    }

    // =========================================================
    // GET - DETALLE
    // =========================================================
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
                'result' =>
                'Proceso no encontrado para el producto indicado'
            ];
        }

        echo json_encode(
            $json,
            http_response_code($json['status'])
        );
    }

    // =========================================================
    // GET - ESTACIONES
    // =========================================================
    public function estaciones()
    {
        $estaciones =
            $this->model->getEstaciones();

        $json = [
            'status' => 200,
            'result' => $estaciones ?: []
        ];

        echo json_encode(
            $json,
            http_response_code(200)
        );
    }

    // =========================================================
    // GET - PRODUCTOS
    // =========================================================
    public function productos()
    {
        $productos =
            $this->model->getProductos();

        $json = [
            'status' => 200,
            'result' => $productos ?: []
        ];

        echo json_encode(
            $json,
            http_response_code(200)
        );
    }

    // =========================================================
    // POST - CREAR
    // =========================================================
    public function create()
    {
        $input = json_decode(
            file_get_contents("php://input")
        );

        if (
            !$input ||
            empty($input->producto_id) ||
            empty($input->estaciones) ||
            !is_array($input->estaciones)
        ) {
            $this->response(
                400,
                'Debe seleccionar un producto y agregar al menos una estación.'
            );
            return;
        }

        $producto_id =
            intval($input->producto_id);

        if ($this->model->exists($producto_id)) {
            $this->response(
                400,
                'El producto seleccionado ya tiene un proceso de preparación.'
            );
            return;
        }

        foreach ($input->estaciones as $estacion) {

            if (
                empty($estacion->estacion_id) ||
                !isset($estacion->tiempo_estimado_minutos) ||
                intval(
                    $estacion->tiempo_estimado_minutos
                ) <= 0
            ) {
                $this->response(
                    400,
                    'Todas las estaciones deben tener un tiempo estimado mayor a cero.'
                );
                return;
            }
        }

        $resultado =
            $this->model->create(
                $producto_id,
                $input->estaciones
            );

        if ($resultado) {
            $this->response(
                201,
                'Proceso de preparación registrado correctamente.'
            );
        } else {
            $this->response(
                500,
                'No fue posible registrar el proceso de preparación.'
            );
        }
    }

    // =========================================================
    // PUT - ACTUALIZAR
    // =========================================================
    public function update()
    {
        $input = json_decode(
            file_get_contents("php://input")
        );

        if (
            !$input ||
            empty($input->producto_id) ||
            empty($input->estaciones) ||
            !is_array($input->estaciones)
        ) {
            $this->response(
                400,
                'Debe indicar el producto y agregar al menos una estación.'
            );
            return;
        }

        foreach ($input->estaciones as $estacion) {

            if (
                empty($estacion->estacion_id) ||
                !isset($estacion->tiempo_estimado_minutos) ||
                intval(
                    $estacion->tiempo_estimado_minutos
                ) <= 0
            ) {
                $this->response(
                    400,
                    'Todas las estaciones deben tener un tiempo estimado mayor a cero.'
                );
                return;
            }
        }

        $resultado =
            $this->model->update(
                intval($input->producto_id),
                $input->estaciones
            );

        if ($resultado) {
            $this->response(
                200,
                'Proceso de preparación actualizado correctamente.'
            );
        } else {
            $this->response(
                500,
                'No fue posible actualizar el proceso de preparación.'
            );
        }
    }

    // =========================================================
    // DELETE
    // =========================================================
    public function delete($producto_id)
    {
        if (!$producto_id) {
            $this->response(
                400,
                'Debe indicar el producto.'
            );
            return;
        }

        $resultado =
            $this->model->delete(
                intval($producto_id)
            );

        if ($resultado !== false) {
            $this->response(
                200,
                'Proceso de preparación eliminado correctamente.'
            );
        } else {
            $this->response(
                500,
                'No fue posible eliminar el proceso de preparación.'
            );
        }
    }

    private function response($status, $result)
    {
        $json = [
            'status' => $status,
            'result' => $result
        ];

        echo json_encode(
            $json,
            http_response_code($status)
        );
    }
}

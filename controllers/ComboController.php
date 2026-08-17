<?php

class combo
{
    // GET listar combos
    public function index()
    {
        try {
            $response = new Response();

            $comboM = new ComboModel();

            $result = $comboM->all();

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // GET obtener combo por id
    public function get($id)
    {
        try {
            $response = new Response();

            $combo = new ComboModel();

            $result = $combo->get($id);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // POST crear combo
    public function create()
    {
        try {
            $response = new Response();

            // Crear objeto con los datos recibidos mediante FormData
            $inputData = new stdClass();

            $inputData->nombre_combo =
                $_POST["nombre_combo"] ?? "";

            $inputData->descripcion =
                $_POST["descripcion"] ?? "";

            $inputData->precio_especial =
                $_POST["precio_especial"] ?? 0;

            $inputData->categoria_id =
                $_POST["categoria_id"] ?? 0;

            /*
             * Los productos llegan como JSON porque cada elemento
             * contiene producto_id y cantidad.
             */
            $productosJSON =
                $_POST["productos"] ?? "[]";

            $inputData->productos =
                json_decode($productosJSON);

            if (!is_array($inputData->productos)) {
                $inputData->productos = [];
            }

            // Por defecto no hay imagen
            $inputData->imagen = null;

            // Verificar si se recibió una imagen
            if (
                isset($_FILES["imagen"]) &&
                $_FILES["imagen"]["error"] === UPLOAD_ERR_OK
            ) {
                $archivo = $_FILES["imagen"];

                $extension = strtolower(
                    pathinfo(
                        $archivo["name"],
                        PATHINFO_EXTENSION
                    )
                );

                $extensionesPermitidas = [
                    "jpg",
                    "jpeg",
                    "png",
                    "webp"
                ];

                if (
                    !in_array(
                        $extension,
                        $extensionesPermitidas
                    )
                ) {
                    throw new Exception(
                        "El formato de la imagen no es válido."
                    );
                }

                // Generar nombre único
                $nombreArchivo =
                    uniqid("combo_", true) .
                    "." .
                    $extension;

                // Misma carpeta utilizada por Productos
                $directorio =
                    __DIR__ .
                    "/../appLaTosteleria/public/images/";

                $rutaDestino =
                    $directorio . $nombreArchivo;

                if (
                    !move_uploaded_file(
                        $archivo["tmp_name"],
                        $rutaDestino
                    )
                ) {
                    throw new Exception(
                        "No fue posible guardar la imagen."
                    );
                }

                // Guardar solamente el nombre del archivo
                $inputData->imagen = $nombreArchivo;
            }

            $combo = new ComboModel();

            $result = $combo->create($inputData);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // POST actualizar combo
    public function update()
    {
        try {
            $response = new Response();

            $inputData = new stdClass();

            $inputData->id_combo =
                $_POST["id_combo"] ?? 0;

            $inputData->nombre_combo =
                $_POST["nombre_combo"] ?? "";

            $inputData->descripcion =
                $_POST["descripcion"] ?? "";

            $inputData->precio_especial =
                $_POST["precio_especial"] ?? 0;

            $inputData->categoria_id =
                $_POST["categoria_id"] ?? 0;

            $productosJSON =
                $_POST["productos"] ?? "[]";

            $inputData->productos =
                json_decode($productosJSON);

            if (!is_array($inputData->productos)) {
                $inputData->productos = [];
            }

            /*
             * Si no se selecciona una imagen nueva,
             * el modelo conservará la imagen existente.
             */
            $inputData->imagen = null;

            // Verificar si se recibió una imagen nueva
            if (
                isset($_FILES["imagen"]) &&
                $_FILES["imagen"]["error"] === UPLOAD_ERR_OK
            ) {
                $archivo = $_FILES["imagen"];

                $extension = strtolower(
                    pathinfo(
                        $archivo["name"],
                        PATHINFO_EXTENSION
                    )
                );

                $extensionesPermitidas = [
                    "jpg",
                    "jpeg",
                    "png",
                    "webp"
                ];

                if (
                    !in_array(
                        $extension,
                        $extensionesPermitidas
                    )
                ) {
                    throw new Exception(
                        "El formato de la imagen no es válido."
                    );
                }

                // Generar nombre único
                $nombreArchivo =
                    uniqid("combo_", true) .
                    "." .
                    $extension;

                $directorio =
                    __DIR__ .
                    "/../appLaTosteleria/public/images/";

                $rutaDestino =
                    $directorio . $nombreArchivo;

                if (
                    !move_uploaded_file(
                        $archivo["tmp_name"],
                        $rutaDestino
                    )
                ) {
                    throw new Exception(
                        "No fue posible guardar la imagen."
                    );
                }

                // Guardar solamente el nombre
                $inputData->imagen = $nombreArchivo;
            }

            $combo = new ComboModel();

            $result = $combo->update($inputData);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // PUT cambiar estado del combo
    public function changeStatus()
    {
        try {
            $request = new Request();
            $response = new Response();

            $inputJSON = $request->getJSON();

            $combo = new ComboModel();

            $result =
                $combo->changeStatus($inputJSON);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}

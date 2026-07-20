<?php

class producto
{
    // GET listar productos
    public function index()
    {
        try {
            $response = new Response();

            $productoM = new ProductoModel();

            $result = $productoM->all();

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // GET obtener producto por id
    public function get($id)
    {
        try {

            $response = new Response();

            $producto = new ProductoModel();

            $result = $producto->get($id);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // POST crear producto
    // POST crear producto
    public function create()
    {
        try {
            $response = new Response();

            // Crear objeto con los datos recibidos mediante FormData
            $inputData = new stdClass();

            $inputData->nombre_producto = $_POST["nombre_producto"] ?? "";
            $inputData->descripcion = $_POST["descripcion"] ?? "";
            $inputData->precio = $_POST["precio"] ?? 0;
            $inputData->categoria_id = $_POST["categoria_id"] ?? 0;
            $inputData->ingredientes = $_POST["ingredientes"] ?? [];

            // Por defecto, el producto no tiene imagen
            $inputData->imagen = null;

            // Verificar si se recibió una imagen
            if (
                isset($_FILES["imagen"]) &&
                $_FILES["imagen"]["error"] === UPLOAD_ERR_OK
            ) {
                $archivo = $_FILES["imagen"];

                // Obtener la extensión del archivo
                $extension = strtolower(
                    pathinfo($archivo["name"], PATHINFO_EXTENSION)
                );

                // Extensiones permitidas
                $extensionesPermitidas = [
                    "jpg",
                    "jpeg",
                    "png",
                    "webp"
                ];

                if (!in_array($extension, $extensionesPermitidas)) {
                    throw new Exception(
                        "El formato de la imagen no es válido."
                    );
                }

                // Generar un nombre único para evitar archivos duplicados
                $nombreArchivo =
                    uniqid("producto_", true) . "." . $extension;

                // Carpeta física donde se guardará la imagen
                $directorio =
                    __DIR__ . "/../appLaTosteleria/public/images/";

                // Ruta completa del archivo
                $rutaDestino =
                    $directorio . $nombreArchivo;

                // Guardar la imagen
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

                // Ruta que se guardará en la base de datos
                // Guardar solo el nombre del archivo en la base de datos
                $inputData->imagen = $nombreArchivo;
            }

            // Guardar producto en la base de datos
            $producto = new ProductoModel();

            $result = $producto->create($inputData);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // PUT actualizar producto
    // POST actualizar producto
    public function update()
    {
        try {
            $response = new Response();

            $inputData = new stdClass();

            $inputData->id_producto = $_POST["id_producto"] ?? 0;
            $inputData->nombre_producto = $_POST["nombre_producto"] ?? "";
            $inputData->descripcion = $_POST["descripcion"] ?? "";
            $inputData->precio = $_POST["precio"] ?? 0;
            $inputData->categoria_id = $_POST["categoria_id"] ?? 0;
            $inputData->ingredientes = $_POST["ingredientes"] ?? [];

            // Si no se selecciona una imagen nueva,
            // el modelo conservará la imagen existente.
            $inputData->imagen = null;

            // Verificar si se seleccionó una imagen nueva
            if (
                isset($_FILES["imagen"]) &&
                $_FILES["imagen"]["error"] === UPLOAD_ERR_OK
            ) {
                $archivo = $_FILES["imagen"];

                $extension = strtolower(
                    pathinfo($archivo["name"], PATHINFO_EXTENSION)
                );

                $extensionesPermitidas = [
                    "jpg",
                    "jpeg",
                    "png",
                    "webp"
                ];

                if (!in_array($extension, $extensionesPermitidas)) {
                    throw new Exception(
                        "El formato de la imagen no es válido."
                    );
                }

                // Crear nombre único
                $nombreArchivo =
                    uniqid("producto_", true) . "." . $extension;

                // Carpeta donde se guardan las imágenes
                $directorio =
                    __DIR__ . "/../appLaTosteleria/public/images/";

                $rutaDestino =
                    $directorio . $nombreArchivo;

                // Guardar nueva imagen
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

                // Guardar SOLO el nombre en la BD
                $inputData->imagen = $nombreArchivo;
            }

            $producto = new ProductoModel();

            $result = $producto->update($inputData);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}

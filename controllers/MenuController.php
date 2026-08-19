<?php

class menu
{
    public function index()
    {
        try {
            $response = new Response();
            $menuM = new MenuModel();

            $result = $menuM->all();

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $response = new Response();
            $menuM = new MenuModel();

            $result = $menuM->get($id);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function available()
    {
        try {
            $response = new Response();
            $menuM = new MenuModel();

            $result = $menuM->available();

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create()
    {
        try {
            $response = new Response();

            // ==========================================
            // DATOS DEL FORMULARIO
            // ==========================================

            $menu = new stdClass();

            $menu->nombre_menu =
                $_POST['nombre_menu'] ?? '';

            $menu->fecha_inicio =
                $_POST['fecha_inicio'] ?? '';

            $menu->fecha_fin =
                $_POST['fecha_fin'] ?? '';

            $menu->hora_inicio =
                $_POST['hora_inicio'] ?? '';

            $menu->hora_fin =
                $_POST['hora_fin'] ?? '';

            $menu->activo =
                isset($_POST['activo'])
                ? (int) $_POST['activo']
                : 1;

            /*
             * Productos y combos llegan como
             * JSON dentro del FormData.
             */
            $menu->productos =
                isset($_POST['productos'])
                ? json_decode(
                    $_POST['productos'],
                    true
                )
                : [];

            $menu->combos =
                isset($_POST['combos'])
                ? json_decode(
                    $_POST['combos'],
                    true
                )
                : [];

            // ==========================================
            // IMAGEN
            // ==========================================

            if (
                !isset($_FILES['imagen']) ||
                $_FILES['imagen']['error'] !==
                UPLOAD_ERR_OK
            ) {
                throw new Exception(
                    "Debe seleccionar una imagen para el menú."
                );
            }

            $menu->imagen =
                $this->guardarImagen(
                    $_FILES['imagen']
                );

            // ==========================================
            // CREAR MENÚ
            // ==========================================

            $menuM = new MenuModel();

            $result =
                $menuM->create($menu);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update()
    {
        try {
            $response = new Response();

            // ==========================================
            // DATOS DEL FORMULARIO
            // ==========================================

            $menu = new stdClass();

            $menu->id_menu =
                isset($_POST['id_menu'])
                ? (int) $_POST['id_menu']
                : 0;

            $menu->nombre_menu =
                $_POST['nombre_menu'] ?? '';

            $menu->fecha_inicio =
                $_POST['fecha_inicio'] ?? '';

            $menu->fecha_fin =
                $_POST['fecha_fin'] ?? '';

            $menu->hora_inicio =
                $_POST['hora_inicio'] ?? '';

            $menu->hora_fin =
                $_POST['hora_fin'] ?? '';

            $menu->activo =
                isset($_POST['activo'])
                ? (int) $_POST['activo']
                : 1;

            $menu->productos =
                isset($_POST['productos'])
                ? json_decode(
                    $_POST['productos'],
                    true
                )
                : [];

            $menu->combos =
                isset($_POST['combos'])
                ? json_decode(
                    $_POST['combos'],
                    true
                )
                : [];

            // ==========================================
            // NUEVA IMAGEN
            // ==========================================

            /*
             * En Update la imagen NO es obligatoria.
             *
             * Si llega una nueva imagen, se guarda.
             * Si no llega, MenuModel conservará
             * la imagen anterior.
             */
            if (
                isset($_FILES['imagen']) &&
                $_FILES['imagen']['error'] ===
                UPLOAD_ERR_OK
            ) {
                $menu->imagen =
                    $this->guardarImagen(
                        $_FILES['imagen']
                    );
            }

            // ==========================================
            // ACTUALIZAR MENÚ
            // ==========================================

            $menuM = new MenuModel();

            $result =
                $menuM->update($menu);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // ==============================================
    // GUARDAR IMAGEN
    // ==============================================

    private function guardarImagen($archivo)
    {
        /*
         * Tipos MIME permitidos.
         */
        $tiposPermitidos = [
            'image/jpeg',
            'image/png',
            'image/webp'
        ];

        if (
            !in_array(
                $archivo['type'],
                $tiposPermitidos,
                true
            )
        ) {
            throw new Exception(
                "El archivo seleccionado debe ser una imagen PNG, JPG, JPEG o WEBP."
            );
        }

        /*
         * Obtener extensión.
         */
        $extension =
            strtolower(
                pathinfo(
                    $archivo['name'],
                    PATHINFO_EXTENSION
                )
            );

        $extensionesPermitidas = [
            'jpg',
            'jpeg',
            'png',
            'webp'
        ];

        if (
            !in_array(
                $extension,
                $extensionesPermitidas,
                true
            )
        ) {
            throw new Exception(
                "El formato de la imagen no es válido."
            );
        }

        /*
         * Nombre único.
         */
        $nombreArchivo =
            'menu_' .
            uniqid() .
            '.' .
            $extension;

        /*
         * Usamos la misma carpeta de imágenes
         * que utiliza el resto del proyecto.
         */
        $directorio =
            __DIR__ .
            '/../appLaTosteleria/public/images/';

        if (!is_dir($directorio)) {
            if (
                !mkdir(
                    $directorio,
                    0777,
                    true
                )
            ) {
                throw new Exception(
                    "No fue posible crear el directorio de imágenes."
                );
            }
        }

        $rutaDestino =
            $directorio .
            $nombreArchivo;

        if (
            !move_uploaded_file(
                $archivo['tmp_name'],
                $rutaDestino
            )
        ) {
            throw new Exception(
                "No fue posible guardar la imagen del menú."
            );
        }

        return $nombreArchivo;
    }
}
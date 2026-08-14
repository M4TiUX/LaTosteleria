<?php

class RoutesController
{
    private $authMiddleware;

    public function __construct()
    {
        $this->authMiddleware =
            new AuthMiddleware();
    }

    // =========================================================
    // DETERMINAR SEGURIDAD DE LA RUTA
    // =========================================================

    private function authorizeRoute(
        $method,
        $controller,
        $action = null,
        $param1 = null
    ) {
        $controller =
            strtolower(
                (string) $controller
            );

        $action =
            strtolower(
                (string) $action
            );

        // =====================================================
        // PEDIDOS
        // =====================================================

        if ($controller === 'pedido') {

            // -----------------------------------------------
            // CONSULTAR PEDIDOS
            // GET /pedido
            // GET /pedido/8
            // GET /pedido/...
            // -----------------------------------------------

            if ($method === 'GET') {

                if ($action === 'dashboard') {
                    return $this
                        ->authMiddleware
                        ->handle([
                            'Administrador',
                            'Encargado'
                        ]);
                }

                return $this
                    ->authMiddleware
                    ->handle([
                        'Administrador',
                        'Encargado',
                        'Cliente'
                    ]);
            }

            // -----------------------------------------------
            // CREAR PEDIDO
            // -----------------------------------------------

            if ($method === 'POST') {

                return $this
                    ->authMiddleware
                    ->handle([
                        'Encargado',
                        'Cliente'
                    ]);
            }

            // -----------------------------------------------
            // ACTUALIZAR ESTADO
            // SOLO ADMIN / ENCARGADO
            // -----------------------------------------------

            if (
                $method === 'PUT' ||
                $method === 'PATCH'
            ) {

                return $this
                    ->authMiddleware
                    ->handle([
                        'Administrador',
                        'Encargado'
                    ]);
            }

            // -----------------------------------------------
            // ELIMINAR
            // -----------------------------------------------

            if ($method === 'DELETE') {

                return $this
                    ->authMiddleware
                    ->handle([
                        'Administrador'
                    ]);
            }
        }

        // =====================================================
        // MANTENIMIENTOS ADMINISTRATIVOS
        // =====================================================

        $adminControllers = [
            'producto',
            'categoria',
            'ingrediente',
            'combo',
            'menu',
            'estacion',
            'procesopreparacion'
        ];

        if (
            in_array(
                $controller,
                $adminControllers,
                true
            )
        ) {
            /*
             * Por ahora protegemos únicamente
             * las operaciones que modifican datos.
             *
             * Los GET pueden seguir siendo públicos
             * porque el menú necesita consultar
             * productos, combos, categorías, etc.
             */

            if (
                $method === 'POST' ||
                $method === 'PUT' ||
                $method === 'PATCH' ||
                $method === 'DELETE'
            ) {

                return $this
                    ->authMiddleware
                    ->handle([
                        'Administrador',
                        'Encargado'
                    ]);
            }
        }

        // =====================================================
        // DIRECCIONES DE ENVIO
        // =====================================================

        if ($controller === 'direccionenvio') {

            if (
                $method === 'GET' ||
                $method === 'POST' ||
                $method === 'PUT' ||
                $method === 'PATCH' ||
                $method === 'DELETE'
            ) {

                return $this
                    ->authMiddleware
                    ->handle([
                        'Administrador',
                        'Encargado',
                        'Cliente',
                        'Cocina'
                    ]);
            }
        }

        // =====================================================
        // SEGUIMIENTO DE PEDIDOS
        // =====================================================

        if ($controller === 'seguimientopedido') {

            if ($method === 'GET') {

                return $this
                    ->authMiddleware
                    ->handle([
                        'Administrador',
                        'Encargado',
                        'Cliente',
                        'Cocina'
                    ]);
            }

            if (
                $method === 'PUT' ||
                $method === 'PATCH'
            ) {

                return $this
                    ->authMiddleware
                    ->handle([
                        'Administrador',
                        'Encargado',
                        'Cocina'
                    ]);
            }

            if (
                $method === 'POST' &&
                $action === 'createdemo'
            ) {

                return $this
                    ->authMiddleware
                    ->handle([
                        'Administrador',
                        'Encargado'
                    ]);
            }
        }

        // =====================================================
        // USUARIOS
        // =====================================================

        if ($controller === 'user') {

            // Login publico
            if (
                $method === 'POST' &&
                $action === 'login'
            ) {
                return true;
            }

            // Registro publico (el rol se valida en controlador)
            if (
                $method === 'POST' &&
                !$action
            ) {
                return true;
            }

            if ($method === 'GET') {

                // Listado completo de usuarios: Administrador y Encargado
                if (!$action) {

                    return $this
                        ->authMiddleware
                        ->handle([
                            'Administrador',
                            'Encargado'
                        ]);
                }

                // Catalogo de clientes para operativa de pedidos
                if (
                    $action === 'allcustomer' ||
                    $action === 'customerbyshoprental'
                ) {

                    return $this
                        ->authMiddleware
                        ->handle([
                            'Administrador',
                            'Encargado'
                        ]);
                }

                // Consulta puntual: el controlador valida propiedad
                return $this
                    ->authMiddleware
                    ->handle([
                        'Administrador',
                        'Encargado',
                        'Cliente',
                        'Cocina'
                    ]);
            }
        }

        /*
         * Ruta sin protección adicional.
         */
        return true;
    }

    // =========================================================
    // OBTENER USUARIO AUTENTICADO
    // =========================================================

    public function getAuthenticatedUser()
    {
        return $this
            ->authMiddleware
            ->getAuthenticatedUser();
    }

    // =========================================================
    // ENRUTAMIENTO PRINCIPAL
    // =========================================================

    public function index()
    {
        if (
            isset($_SERVER['REQUEST_URI']) &&
            !empty($_SERVER['REQUEST_URI'])
        ) {

            $requestPath =
                parse_url(
                    $_SERVER['REQUEST_URI'],
                    PHP_URL_PATH
                );

            $requestPath =
                $requestPath ?: '/';

            // =================================================
            // GESTIÓN DE IMÁGENES
            // =================================================

            if (
                strpos(
                    $requestPath,
                    '/uploads/'
                ) === 0
            ) {

                $filePath =
                    __DIR__ .
                    $requestPath;

                if (
                    file_exists(
                        $filePath
                    )
                ) {

                    header(
                        'Content-Type: ' .
                        mime_content_type(
                            $filePath
                        )
                    );

                    readfile(
                        $filePath
                    );

                    exit;

                } else {

                    http_response_code(
                        404
                    );

                    echo
                        'Archivo no encontrado.';

                    return;
                }
            }

            // =================================================
            // PREFLIGHT CORS
            // =================================================

            if (
                $_SERVER[
                    'REQUEST_METHOD'
                ] === 'OPTIONS'
            ) {

                http_response_code(
                    200
                );

                exit();
            }

            // =================================================
            // PROCESAR URL
            // =================================================

            $routesArray =
                explode(
                    '/',
                    $requestPath
                );

            $routesArray =
                array_filter(
                    $routesArray
                );

            if (
                count(
                    $routesArray
                ) < 2
            ) {

                $json = [
                    'status' => 404,
                    'result' =>
                        'Controlador no especificado'
                ];

                echo json_encode(
                    $json,
                    http_response_code(
                        $json['status']
                    )
                );

                return;
            }

            if (
                isset(
                    $_SERVER[
                        'REQUEST_METHOD'
                    ]
                )
            ) {

                $method =
                    $_SERVER[
                        'REQUEST_METHOD'
                    ];

                /*
                 * Ejemplo:
                 *
                 * /apilatosteleria/pedido/update/8
                 *
                 * [1] apilatosteleria
                 * [2] pedido
                 * [3] update
                 * [4] 8
                 */

                $controller =
                    $routesArray[2] ??
                    null;

                $action =
                    $routesArray[3] ??
                    null;

                $param1 =
                    $routesArray[4] ??
                    null;

                $param2 =
                    $routesArray[5] ??
                    null;

                if (!$controller) {

                    $json = [
                        'status' => 404,
                        'result' =>
                            'Controlador o acción no especificados'
                    ];

                    echo json_encode(
                        $json,
                        http_response_code(
                            $json['status']
                        )
                    );

                    return;
                }

                // =================================================
                // SEGURIDAD BACKEND
                // =================================================

                $this->authorizeRoute(
                    $method,
                    $controller,
                    $action,
                    $param1
                );

                // =================================================
                // CONTROLADOR
                // =================================================

                try {

                    if (
                        class_exists(
                            $controller
                        )
                    ) {

                        $response =
                            new $controller();

                        switch ($method) {

                            // =====================================
                            // GET
                            // =====================================

                            case 'GET':

                                if (
                                    $param1 &&
                                    $param2
                                ) {

                                    $response
                                        ->$action(
                                            $param1,
                                            $param2
                                        );

                                } elseif (
                                    $param1 &&
                                    !isset(
                                        $action
                                    )
                                ) {

                                    $response
                                        ->get(
                                            $param1
                                        );

                                } elseif (
                                    $param1 &&
                                    isset(
                                        $action
                                    )
                                ) {

                                    $response
                                        ->$action(
                                            $param1
                                        );

                                } elseif (
                                    !isset(
                                        $action
                                    )
                                ) {

                                    $response
                                        ->index();

                                } elseif (
                                    $action
                                ) {

                                    if (
                                        method_exists(
                                            $controller,
                                            $action
                                        )
                                    ) {

                                        $response
                                            ->$action();

                                    } elseif (
                                        count(
                                            $routesArray
                                        ) == 3
                                    ) {

                                        $response
                                            ->get(
                                                $action
                                            );

                                    } else {

                                        $json = [
                                            'status' =>
                                                404,

                                            'result' =>
                                                'Acción no encontrada'
                                        ];

                                        echo json_encode(
                                            $json,
                                            http_response_code(
                                                $json[
                                                    'status'
                                                ]
                                            )
                                        );
                                    }
                                }

                                break;


                            // =====================================
                            // POST
                            // =====================================

                            case 'POST':

                                if ($action) {

                                    if (
                                        method_exists(
                                            $controller,
                                            $action
                                        )
                                    ) {

                                        $response
                                            ->$action();

                                    } else {

                                        $json = [
                                            'status' =>
                                                404,

                                            'result' =>
                                                'Acción no encontrada'
                                        ];

                                        echo json_encode(
                                            $json,
                                            http_response_code(
                                                $json[
                                                    'status'
                                                ]
                                            )
                                        );
                                    }

                                } else {

                                    $response
                                        ->create();
                                }

                                break;


                            // =====================================
                            // PUT / PATCH
                            // =====================================

                            case 'PUT':
                            case 'PATCH':

                                if ($param1) {

                                    /*
                                     * Ejemplo:
                                     *
                                     * /pedido/update/8
                                     *
                                     * llama:
                                     * update(8)
                                     */

                                    $response
                                        ->update(
                                            $param1
                                        );

                                } elseif (
                                    $action
                                ) {

                                    if (
                                        method_exists(
                                            $controller,
                                            $action
                                        )
                                    ) {

                                        $response
                                            ->$action();

                                    } else {

                                        $json = [
                                            'status' =>
                                                404,

                                            'result' =>
                                                'Acción no encontrada'
                                        ];

                                        echo json_encode(
                                            $json,
                                            http_response_code(
                                                $json[
                                                    'status'
                                                ]
                                            )
                                        );
                                    }

                                } else {

                                    $response
                                        ->update();
                                }

                                break;


                            // =====================================
                            // DELETE
                            // =====================================

                            case 'DELETE':

                                if ($param1) {

                                    $response
                                        ->delete(
                                            $param1
                                        );

                                } elseif (
                                    $action
                                ) {

                                    if (
                                        method_exists(
                                            $controller,
                                            $action
                                        )
                                    ) {

                                        $response
                                            ->$action();

                                    } else {

                                        $json = [
                                            'status' =>
                                                404,

                                            'result' =>
                                                'Acción no encontrada'
                                        ];

                                        echo json_encode(
                                            $json,
                                            http_response_code(
                                                $json[
                                                    'status'
                                                ]
                                            )
                                        );
                                    }

                                } else {

                                    $response
                                        ->delete();
                                }

                                break;


                            // =====================================
                            // MÉTODO NO SOPORTADO
                            // =====================================

                            default:

                                $json = [
                                    'status' =>
                                        405,

                                    'result' =>
                                        'Método HTTP no permitido'
                                ];

                                echo json_encode(
                                    $json,
                                    http_response_code(
                                        $json[
                                            'status'
                                        ]
                                    )
                                );

                                break;
                        }

                    } else {

                        $json = [
                            'status' => 404,
                            'result' =>
                                'Controlador no encontrado'
                        ];

                        echo json_encode(
                            $json,
                            http_response_code(
                                $json[
                                    'status'
                                ]
                            )
                        );
                    }

                } catch (
                    \Throwable $th
                ) {

                    $json = [
                        'status' => 404,
                        'result' =>
                            $th->getMessage()
                    ];

                    echo json_encode(
                        $json,
                        http_response_code(
                            $json[
                                'status'
                            ]
                        )
                    );
                }
            }
        }
    }
}
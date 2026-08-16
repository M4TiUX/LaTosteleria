<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class pedido
{
    public function dashboard()
    {
        try {
            $response = new Response();
            $pedidoModel = new PedidoModel();
            $result = $pedidoModel->getDashboardSummary();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // =========================================================
    // LISTAR PEDIDOS
    // =========================================================

    public function index()
    {
        try {

            $response =
                new Response();

            $pedidoModel =
                new PedidoModel();

            // Obtener usuario desde JWT
            $user =
                $this->getAuthenticatedUser();

            if (!$user) {
                $response
                    ->status(401)
                    ->toJSON([
                        'message' =>
                            'No fue posible identificar al usuario autenticado.'
                    ]);

                return;
            }

            $userId =
                isset($user->id)
                    ? (int) $user->id
                    : 0;

            $role =
                $user->rol->name ??
                '';

            // =================================================
            // CLIENTE
            // Solo puede consultar sus propios pedidos
            // =================================================

            if ($role === 'Cliente') {

                $result =
                    $pedidoModel->all(
                        $userId
                    );

                $response->toJSON(
                    $result
                );

                return;
            }

            // =================================================
            // ENCARGADO / ADMINISTRADOR
            // Pueden consultar todos
            // =================================================

            if (
                $role === 'Encargado' ||
                $role === 'Administrador'
            ) {

                $result =
                    $pedidoModel->all();

                $response->toJSON(
                    $result
                );

                return;
            }

            // =================================================
            // OTRO ROL
            // =================================================

            $response
                ->status(403)
                ->toJSON([
                    'message' =>
                        'No tiene permisos para consultar pedidos.'
                ]);

        } catch (Exception $e) {
            handleException($e);
        }
    }


    // =========================================================
    // OBTENER PEDIDO POR ID
    // =========================================================

    public function get($id)
    {
        try {

            $response =
                new Response();

            $pedidoModel =
                new PedidoModel();

            // -------------------------------------------------
            // Validar ID
            // -------------------------------------------------

            $pedidoId =
                (int) $id;

            if ($pedidoId <= 0) {

                $response
                    ->status(400)
                    ->toJSON([
                        'message' =>
                            'El identificador del pedido no es valido.'
                    ]);

                return;
            }

            // -------------------------------------------------
            // Obtener usuario autenticado
            // -------------------------------------------------

            $user =
                $this->getAuthenticatedUser();

            if (!$user) {

                $response
                    ->status(401)
                    ->toJSON([
                        'message' =>
                            'No fue posible identificar al usuario autenticado.'
                    ]);

                return;
            }

            $userId =
                isset($user->id)
                    ? (int) $user->id
                    : 0;

            $role =
                $user->rol->name ??
                '';

            // -------------------------------------------------
            // Obtener pedido
            // -------------------------------------------------

            $result =
                $pedidoModel->get(
                    $pedidoId
                );

            if ($result === null) {

                $response
                    ->status(404)
                    ->toJSON([
                        'message' =>
                            'No se encontro el pedido solicitado.'
                    ]);

                return;
            }

            // =================================================
            // CLIENTE
            // Debe ser dueño del pedido
            // =================================================

            if ($role === 'Cliente') {

                $clientePedidoId =
                    isset(
                        $result->cliente_id
                    )
                        ? (int)
                            $result->cliente_id
                        : 0;

                if (
                    $clientePedidoId !==
                    $userId
                ) {

                    $response
                        ->status(403)
                        ->toJSON([
                            'message' =>
                                'Acceso denegado: este pedido pertenece a otro cliente.'
                        ]);

                    return;
                }
            }

            // =================================================
            // VALIDAR ROL
            // =================================================

            if (
                $role !== 'Cliente' &&
                $role !== 'Encargado' &&
                $role !== 'Administrador'
            ) {

                $response
                    ->status(403)
                    ->toJSON([
                        'message' =>
                            'No tiene permisos para consultar este pedido.'
                    ]);

                return;
            }

            // -------------------------------------------------
            // Respuesta
            // -------------------------------------------------

            $response->toJSON(
                $result
            );

        } catch (Exception $e) {
            handleException($e);
        }
    }


    // =========================================================
    // CREAR PEDIDO
    // =========================================================

    public function create()
    {
        try {

            $request =
                new Request();

            $response =
                new Response();

            $pedidoModel =
                new PedidoModel();

            // -------------------------------------------------
            // Obtener JWT
            // -------------------------------------------------

            $user =
                $this->getAuthenticatedUser();

            if (!$user) {

                $response
                    ->status(401)
                    ->toJSON([
                        'message' =>
                            'No fue posible identificar al usuario autenticado.'
                    ]);

                return;
            }

            $userId =
                isset($user->id)
                    ? (int) $user->id
                    : 0;

            $role =
                $user->rol->name ??
                '';

            // -------------------------------------------------
            // Obtener JSON
            // -------------------------------------------------

            $inputJSON =
                $request->getJSON();

            if (!is_object($inputJSON)) {

                $response
                    ->status(400)
                    ->toJSON([
                        'message' =>
                            'Debe enviar la informacion del pedido.'
                    ]);

                return;
            }

            // =================================================
            // CLIENTE
            // El cliente_id SIEMPRE sale del JWT
            // =================================================

            if ($role === 'Cliente') {

                /*
                 * No confiamos en:
                 *
                 * cliente_id enviado por React.
                 *
                 * El backend establece el
                 * cliente según el JWT.
                 */

                $inputJSON->cliente_id =
                    $userId;

                /*
                 * Un cliente no puede
                 * establecerse como encargado.
                 */

                $inputJSON->encargado_id =
                    null;
            }

            // =================================================
            // ENCARGADO
            // Puede crear pedido para cliente
            // y queda registrado como encargado
            // =================================================

            elseif ($role === 'Encargado') {

                if (
                    !isset(
                        $inputJSON
                            ->cliente_id
                    ) ||
                    (int)
                    $inputJSON
                        ->cliente_id <= 0
                ) {

                    $response
                        ->status(400)
                        ->toJSON([
                            'message' =>
                                'Debe seleccionar el cliente del pedido.'
                        ]);

                    return;
                }

                $inputJSON
                    ->encargado_id =
                    $userId;
            }

            // =================================================
            // ADMINISTRADOR
            // No puede registrar pedidos
            // =================================================

            elseif (
                $role ===
                'Administrador'
            ) {

                $response
                    ->status(403)
                    ->toJSON([
                        'message' =>
                            'El rol Administrador no puede registrar pedidos.'
                    ]);

                return;
            }

            else {

                $response
                    ->status(403)
                    ->toJSON([
                        'message' =>
                            'No tiene permisos para registrar pedidos.'
                    ]);

                return;
            }

            // -------------------------------------------------
            // Crear pedido
            // -------------------------------------------------

            $result =
                $pedidoModel->create(
                    $inputJSON
                );

            $response
                ->status(201)
                ->toJSON(
                    $result
                );

        } catch (Exception $e) {
            handleException($e);
        }
    }


    // =========================================================
    // OBTENER USUARIO DEL JWT
    // =========================================================

    private function getAuthenticatedUser()
    {
        try {

            // -------------------------------------------------
            // Headers
            // -------------------------------------------------

            $headers = [];

            if (
                function_exists(
                    'apache_request_headers'
                )
            ) {
                $headers =
                    apache_request_headers();
            }

            $authHeader = '';

            // -------------------------------------------------
            // Buscar Authorization
            // sin importar mayúsculas/minúsculas
            // -------------------------------------------------

            foreach (
                $headers
                as $key => $value
            ) {

                if (
                    strtolower($key) ===
                    'authorization'
                ) {

                    $authHeader =
                        $value;

                    break;
                }
            }

            // -------------------------------------------------
            // Alternativa Apache
            // -------------------------------------------------

            if (
                !$authHeader &&
                isset(
                    $_SERVER[
                        'HTTP_AUTHORIZATION'
                    ]
                )
            ) {

                $authHeader =
                    $_SERVER[
                        'HTTP_AUTHORIZATION'
                    ];
            }

            // -------------------------------------------------
            // Extraer Bearer
            // -------------------------------------------------

            if (
                !$authHeader ||
                !preg_match(
                    '/Bearer\s+(\S+)/i',
                    $authHeader,
                    $matches
                )
            ) {

                return null;
            }

            $token =
                $matches[1];

            // -------------------------------------------------
            // Decodificar JWT
            // -------------------------------------------------

            return JWT::decode(
                $token,
                new Key(
                    config::get(
                        'SECRET_KEY'
                    ),
                    'HS256'
                )
            );

        } catch (Exception $e) {

            return null;
        }
    }
}
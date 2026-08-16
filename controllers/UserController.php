<?php
//Cargar todos los paquetes
require_once "vendor/autoload.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class user
{
    //Listar en el API
    public function index()
    {
        $response = new Response();

        $authUser = $this->getAuthenticatedUser();
        if (!$authUser) {
            $response->status(401)->toJSON(['message' => 'No autenticado.']);
            return;
        }

        $role = $authUser->rol->name ?? '';
        if ($role !== 'Administrador' && $role !== 'Encargado') {
            $response->status(403)->toJSON(['message' => 'No tiene permisos para consultar usuarios.']);
            return;
        }

        //Obtener el listado del Modelo
        $usuario = new UserModel();
        $result = $usuario->all();
        //Dar respuesta
        $response->toJSON($result);
    }
    public function get($param)
    {
        $response = new Response();

        $authUser = $this->getAuthenticatedUser();
        if (!$authUser) {
            $response->status(401)->toJSON(['message' => 'No autenticado.']);
            return;
        }

        $role = $authUser->rol->name ?? '';
        $requestedId = (int) $param;
        $authId = isset($authUser->id) ? (int) $authUser->id : 0;

        $canViewAny = ($role === 'Administrador' || $role === 'Encargado');
        $canViewOwn = ($requestedId > 0 && $requestedId === $authId);

        if (!$canViewAny && !$canViewOwn) {
            $response->status(403)->toJSON(['message' => 'No tiene permisos para consultar este usuario.']);
            return;
        }

        $usuario = new UserModel();
        $result = $usuario->get($param);
        //Dar respuesta
        $response->toJSON($result);
    }
    public function allCustomer()
    {
        $response = new Response();

        $authUser = $this->getAuthenticatedUser();
        if (!$authUser) {
            $response->status(401)->toJSON(['message' => 'No autenticado.']);
            return;
        }

        $role = $authUser->rol->name ?? '';
        if ($role !== 'Administrador' && $role !== 'Encargado') {
            $response->status(403)->toJSON(['message' => 'No tiene permisos para consultar clientes.']);
            return;
        }

        //Obtener el listado del Modelo
        $usuario = new UserModel();
        $result = $usuario->allCustomer();
        //Dar respuesta
        $response->toJSON($result);
    }
    public function customerbyShopRental($idShopRental)
    {
        $response = new Response();

        $authUser = $this->getAuthenticatedUser();
        if (!$authUser) {
            $response->status(401)->toJSON(['message' => 'No autenticado.']);
            return;
        }

        $role = $authUser->rol->name ?? '';
        if ($role !== 'Administrador' && $role !== 'Encargado') {
            $response->status(403)->toJSON(['message' => 'No tiene permisos para consultar clientes.']);
            return;
        }

        //Obtener el listado del Modelo
        $usuario = new UserModel();
        $result = $usuario->customerbyShopRental($idShopRental);
        //Dar respuesta
        $response->toJSON($result);
    }
    public function login()
    {
        try {
            $response = new Response();
            $request = new Request();
            $inputJSON = $request->getJSON();

            $usuario = new UserModel();
            $result = $usuario->login($inputJSON);

            if ($result !== false && !empty($result)) {
                $response->toJSON($result);
                return;
            }

            $response->status(401)->toJSON([
                'message' => 'Credenciales incorrectas. Verifique correo y contrasena.'
            ]);
        } catch (InvalidArgumentException $e) {
            (new Response())->status(400)->toJSON(['message' => $e->getMessage()]);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function create()
    {
        $response = new Response();
        $request = new Request();
        //Obtener json enviado
        $inputJSON = $request->getJSON();

        if (!is_object($inputJSON)) {
            $response->status(400)->toJSON(['message' => 'Debe enviar la informacion del usuario.']);
            return;
        }

        $authenticatedUser = $this->getAuthenticatedUser();

        // Registro publico: siempre Cliente (rol 2)
        if (!$authenticatedUser) {
            $inputJSON->rol_id = 2;
        } else {
            $creatorRole = $authenticatedUser->rol->name ?? '';
            $requestedRoleId = isset($inputJSON->rol_id) ? (int) $inputJSON->rol_id : 0;

            if ($creatorRole === 'Administrador') {
                if (!in_array($requestedRoleId, [3, 4], true)) {
                    $response->status(403)->toJSON([
                        'message' => 'Administrador solo puede crear usuarios Encargado o Cocina.'
                    ]);
                    return;
                }
            } else {
                $response->status(403)->toJSON([
                    'message' => 'No tiene permisos para crear usuarios con rol administrativo.'
                ]);
                return;
            }

            $inputJSON->rol_id = $requestedRoleId;
        }

        $usuario = new UserModel();
        try {
            $result = $usuario->create($inputJSON);
            $response->status(201)->toJSON($result);
        } catch (InvalidArgumentException $e) {
            $response->status(400)->toJSON(['message' => $e->getMessage()]);
        } catch (DomainException $e) {
            $response->status(409)->toJSON(['message' => $e->getMessage()]);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    private function getAuthenticatedUser()
    {
        try {
            $headers = function_exists('apache_request_headers')
                ? apache_request_headers()
                : [];

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

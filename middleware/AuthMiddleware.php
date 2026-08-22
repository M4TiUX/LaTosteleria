<?php

use Firebase\JWT\ExpiredException;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthMiddleware
{
    private $authenticatedUser = null;

    /**
     * Verifica token y rol.
     */
    public function handle($requiredRoles = [])
    {
        $token = $this->getTokenFromHeader();

        if (!$token) {
            return $this->errorResponse(
                401,
                'Acceso denegado: token no proporcionado.'
            );
        }

        $decodedToken = $this->verifyToken($token);

        if (!$decodedToken) {
            return $this->errorResponse(
                401,
                'Acceso denegado: token inválido o expirado.'
            );
        }

        $this->authenticatedUser = $decodedToken;

        if (!empty($requiredRoles)) {

            $userRole =
                $decodedToken->rol->name ?? null;

            if (
                !$userRole ||
                !$this->checkRole(
                    $userRole,
                    $requiredRoles
                )
            ) {
                return $this->errorResponse(
                    403,
                    'Acceso denegado: rol no autorizado.'
                );
            }
        }

        return true;
    }

    /**
     * Devuelve el usuario obtenido del JWT.
     */
    public function getAuthenticatedUser()
    {
        return $this->authenticatedUser;
    }

    /**
     * Obtener token Bearer.
     */
    private function getTokenFromHeader()
    {
        $headers = [];

        if (function_exists('getallheaders')) {
            $headers = getallheaders();
        }

        if (function_exists('apache_request_headers')) {
            $headers = array_merge($headers, apache_request_headers());
        }

        $authHeader = '';

        foreach ($headers as $key => $value) {
            if (
                strtolower($key) ===
                'authorization'
            ) {
                $authHeader = $value;
                break;
            }
        }

        /*
         * Alternativa para algunos
         * servidores/configuraciones Apache.
         */
        if (
            !$authHeader &&
            isset($_SERVER['HTTP_AUTHORIZATION'])
        ) {
            $authHeader =
                $_SERVER['HTTP_AUTHORIZATION'];
        }

        if (
            !$authHeader &&
            isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])
        ) {
            $authHeader =
                $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        }

        if (
            $authHeader &&
            preg_match(
                '/Bearer\s+(\S+)/i',
                $authHeader,
                $matches
            )
        ) {
            return $matches[1];
        }

        return null;
    }

    /**
     * Verificar JWT.
     */
    private function verifyToken($token)
    {
        try {
            return JWT::decode(
                $token,
                new Key(
                    config::get('SECRET_KEY'),
                    'HS256'
                )
            );
        } catch (ExpiredException $e) {
            return false;
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * Validar rol.
     */
    private function checkRole(
        $userRole,
        $requiredRoles
    ) {
        return in_array(
            $userRole,
            $requiredRoles,
            true
        );
    }

    /**
     * Respuesta de error.
     */
    private function errorResponse(
        $statusCode,
        $message
    ) {
        http_response_code($statusCode);

        header(
            'Content-Type: application/json; charset=utf-8'
        );

        echo json_encode([
            'status' => $statusCode,
            'result' => $message
        ]);

        exit;
    }
}

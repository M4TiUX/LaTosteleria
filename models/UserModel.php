<?php

use Firebase\JWT\JWT;

class UserModel
{
	public $enlace;
	public function __construct()
	{

		$this->enlace = new MySqlConnect();
	}
	public function all()
	{
		try {
			$vSql = "SELECT
					u.id_usuario AS id,
					u.nombre AS name,
					u.correo AS email,
					u.rol_id
				FROM usuarios u
				ORDER BY u.nombre ASC";

			return $this->enlace->ExecuteSQL($vSql);
		} catch (Exception $e) {
			handleException($e);
		}
	}

	public function get($id)
	{
		try {
			$rolM = new RolModel();
			$id = (int) $id;

			$vSql = "SELECT
					u.id_usuario AS id,
					u.nombre AS name,
					u.correo AS email,
					u.rol_id
				FROM usuarios u
				WHERE u.id_usuario = $id";

			$vResultado = $this->enlace->ExecuteSQL($vSql);
			if ($vResultado) {
				$vResultado = $vResultado[0];
				$rol = $rolM->getRolUser($id);
				$vResultado->rol = $rol;
				// Retornar el objeto
				return $vResultado;
			} else {
				return null;
			}
		} catch (Exception $e) {
			handleException($e);
		}
	}
	public function allCustomer()
	{
		try {
			$vSql = "SELECT
					u.id_usuario AS id,
					u.nombre AS name,
					u.correo AS email,
					u.rol_id
				FROM usuarios u
				WHERE u.rol_id = 2
				ORDER BY u.nombre ASC";

			return $this->enlace->ExecuteSQL($vSql);
		} catch (Exception $e) {
			handleException($e);
		}
	}
	public function customerbyShopRental($idShopRental)
	{
		try {
			return $this->allCustomer();
		} catch (Exception $e) {
			handleException($e);
		}
	}
	public function login($objeto)
	{
		try {
			if (!isset($objeto->email) || !isset($objeto->password)) {
				return false;
			}

			$email = $this->escape($objeto->email);

			$vSql = "SELECT
					u.id_usuario AS id,
					u.nombre AS name,
					u.correo AS email,
					u.contrasena AS password,
					u.rol_id
				FROM usuarios u
				WHERE u.correo = '$email'";

			$vResultado = $this->enlace->ExecuteSQL($vSql);
			if (is_array($vResultado) && !empty($vResultado) && is_object($vResultado[0])) {
				$user = $vResultado[0];
				if (password_verify($objeto->password, $user->password)) {
					$usuario = $this->get($user->id);
					if (!empty($usuario)) {
						// Datos para el token JWT
						$data = [
							'id' => $usuario->id,
							'name' => $usuario->name,
							'email' => $usuario->email,
							'rol' => $usuario->rol,
							'iat' => time(),  // Hora de emisión
							'exp' => time() + 3600 // Expiración en 1 hora
						];

						// Generar el token JWT
						$jwt_token = JWT::encode($data, config::get('SECRET_KEY'), 'HS256');

						// Enviar el token como respuesta
						return $jwt_token;
					}
				}

				return false;
			} else {
				return false;
			}
		} catch (Exception $e) {
			handleException($e);
		}
	}
	public function create($objeto)
	{
		try {
			if (isset($objeto->password) && $objeto->password != null) {
				$crypt = password_hash($objeto->password, PASSWORD_BCRYPT);
				$objeto->password = $crypt;
			}

			$name = $this->escape($objeto->name);
			$email = $this->escape($objeto->email);
			$password = $this->escape($objeto->password);
			$rolId = isset($objeto->rol_id) ? (int) $objeto->rol_id : 2;

			$vSql = "INSERT INTO usuarios (rol_id,nombre,correo,contrasena)" .
				" VALUES ($rolId,'$name','$email','$password')";

			$vResultado = $this->enlace->executeSQL_DML_last($vSql);

			return $this->get($vResultado);
		} catch (Exception $e) {
			handleException($e);
		}
	}

	private function escape($value)
	{
		return addslashes(trim((string) $value));
	}
}

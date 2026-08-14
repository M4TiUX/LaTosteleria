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
					u.rol_id,
					r.nombre_rol AS role_name
				FROM usuarios u
				INNER JOIN roles r
					ON r.id_rol = u.rol_id
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
			if (is_array($vResultado) && !empty($vResultado)) {
				$vResultado = $vResultado[0];
				$rol = $rolM->getRolUser($id);
				$vResultado->rol = $rol;
				return $vResultado;
			}

			return null;
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
					u.rol_id,
					r.nombre_rol AS role_name
				FROM usuarios u
				INNER JOIN roles r
					ON r.id_rol = u.rol_id
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
		if (!is_object($objeto)) {
			throw new InvalidArgumentException('Debe enviar las credenciales de acceso.');
		}

		$emailRaw = isset($objeto->email) ? (string) $objeto->email : '';
		$passwordRaw = isset($objeto->password) ? (string) $objeto->password : '';

		$email = strtolower(trim($emailRaw));
		$password = trim($passwordRaw);

		if ($email === '' || $password === '') {
			return false;
		}

		if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
			return false;
		}

		$emailEscaped = $this->escape($email);

		$vSql = "SELECT
					u.id_usuario AS id,
					u.contrasena AS password
				FROM usuarios u
				WHERE u.correo = '$emailEscaped'
				LIMIT 1";

		$vResultado = $this->enlace->ExecuteSQL($vSql);

		if (!is_array($vResultado) || empty($vResultado) || !is_object($vResultado[0])) {
			return false;
		}

		$user = $vResultado[0];

		if (!password_verify($password, $user->password)) {
			return false;
		}

		$usuario = $this->get((int) $user->id);
		if (empty($usuario)) {
			return false;
		}

		$data = [
			'id' => $usuario->id,
			'name' => $usuario->name,
			'email' => $usuario->email,
			'rol' => $usuario->rol,
			'iat' => time(),
			'exp' => time() + 3600
		];

		return JWT::encode($data, config::get('SECRET_KEY'), 'HS256');
	}

	public function create($objeto)
	{
		if (!is_object($objeto)) {
			throw new InvalidArgumentException('Debe enviar la informacion del usuario.');
		}

		$nameRaw = isset($objeto->name) ? (string) $objeto->name : '';
		$emailRaw = isset($objeto->email) ? (string) $objeto->email : '';
		$passwordRaw = isset($objeto->password) ? (string) $objeto->password : '';

		$name = trim($nameRaw);
		$email = strtolower(trim($emailRaw));
		$password = trim($passwordRaw);
		$rolId = isset($objeto->rol_id) ? (int) $objeto->rol_id : 2;

		if ($name === '' || $email === '' || $password === '') {
			throw new InvalidArgumentException('Todos los campos son obligatorios: nombre, correo y contrasena.');
		}

		if (mb_strlen($name) < 3 || mb_strlen($name) > 100) {
			throw new InvalidArgumentException('El nombre debe tener entre 3 y 100 caracteres.');
		}

		if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
			throw new InvalidArgumentException('El correo no tiene un formato valido.');
		}

		if (mb_strlen($email) > 150) {
			throw new InvalidArgumentException('El correo no puede superar los 150 caracteres.');
		}

		if (mb_strlen($password) < 8) {
			throw new InvalidArgumentException('La contrasena debe tener al menos 8 caracteres.');
		}

		if (!in_array($rolId, [1, 2, 3, 4], true)) {
			throw new InvalidArgumentException('El rol indicado no es valido.');
		}

		if ($this->existsByEmail($email)) {
			throw new DomainException('Ya existe un usuario registrado con ese correo.');
		}

		$crypt = password_hash($password, PASSWORD_BCRYPT);

		$nameEscaped = $this->escape($name);
		$emailEscaped = $this->escape($email);
		$passwordEscaped = $this->escape($crypt);

		$vSql = "INSERT INTO usuarios (rol_id,nombre,correo,contrasena)"
			. " VALUES ($rolId,'$nameEscaped','$emailEscaped','$passwordEscaped')";

		$vResultado = $this->enlace->executeSQL_DML_last($vSql);

		if ((int) $vResultado <= 0) {
			throw new RuntimeException('No fue posible registrar el usuario.');
		}

		return $this->get($vResultado);
	}

	private function existsByEmail($email)
	{
		$emailEscaped = $this->escape($email);
		$sql = "SELECT id_usuario FROM usuarios WHERE correo = '$emailEscaped' LIMIT 1";
		$result = $this->enlace->ExecuteSQL($sql);

		return is_array($result) && !empty($result);
	}

	private function escape($value)
	{
		return addslashes(trim((string) $value));
	}
}

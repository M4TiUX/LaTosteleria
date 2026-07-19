<?php
class RolModel
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
						id_rol AS id,
						nombre_rol AS name
					FROM roles
					ORDER BY nombre_rol ASC";

			return $this->enlace->ExecuteSQL($vSql);
		} catch (Exception $e) {
			handleException($e);
		}
	}

	public function get($id)
	{
		try {
			$id = (int) $id;
			$vSql = "SELECT
						id_rol AS id,
						nombre_rol AS name
					FROM roles
					WHERE id_rol = $id";

			$vResultado = $this->enlace->ExecuteSQL($vSql);

			return !empty($vResultado) ? $vResultado[0] : null;
		} catch (Exception $e) {
			handleException($e);
		}
	}

	public function getRolUser($idUser)
	{
		try {
			$idUser = (int) $idUser;
			$vSql = "SELECT
						r.id_rol AS id,
						r.nombre_rol AS name
					FROM roles r
					INNER JOIN usuarios u
						ON r.id_rol = u.rol_id
					WHERE u.id_usuario = $idUser";

			$vResultado = $this->enlace->ExecuteSQL($vSql);

			return !empty($vResultado) ? $vResultado[0] : null;
		} catch (Exception $e) {
			handleException($e);
		}
	}
}
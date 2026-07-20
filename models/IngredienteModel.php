<?php

class IngredienteModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        try {
            $vSQL = "SELECT
                        id_ingrediente,
                        nombre_ingrediente
                    FROM ingredientes
                    ORDER BY nombre_ingrediente ASC";

            return $this->enlace->ExecuteSQL($vSQL);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $id = (int) $id;

            $vSQL = "SELECT
                        id_ingrediente,
                        nombre_ingrediente
                    FROM ingredientes
                    WHERE id_ingrediente = $id";

            $resultado = $this->enlace->ExecuteSQL($vSQL);

            return !empty($resultado) ? $resultado[0] : null;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
<?php

class CategoriaModel
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
                        id_categoria,
                        nombre_categoria
                    FROM categorias
                    ORDER BY nombre_categoria ASC";

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
                        id_categoria,
                        nombre_categoria
                    FROM categorias
                    WHERE id_categoria = $id";

            $resultado = $this->enlace->ExecuteSQL($vSQL);

            return !empty($resultado) ? $resultado[0] : null;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
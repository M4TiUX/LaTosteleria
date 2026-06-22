<?php
class ProductoModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /**
     * Listar productos
     */
    public function all()
    {
        try {

            $vSQL = "SELECT
                    p.*,
                    c.nombre_categoria
                FROM productos p
                INNER JOIN categorias c
                    ON p.categoria_id = c.id_categoria
                ORDER BY p.nombre_producto ASC";

            $vResultado = $this->enlace->ExecuteSQL($vSQL);

            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Obtener un producto
     */
    public function get($id)
    {
        try {

            $vSQL = "SELECT
                    p.*,
                    c.nombre_categoria
                FROM productos p
                INNER JOIN categorias c
                    ON p.categoria_id = c.id_categoria
                WHERE p.id_producto = $id";

            $vResultado = $this->enlace->ExecuteSQL($vSQL);

            if (!empty($vResultado)) {
                $vResultado = $vResultado[0];
            }

            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}

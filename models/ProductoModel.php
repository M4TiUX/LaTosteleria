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

                $vSQLIngredientes = "SELECT
                                    i.id_ingrediente,
                                    i.nombre_ingrediente
                                FROM producto_ingrediente pi
                                INNER JOIN ingredientes i
                                    ON pi.ingrediente_id = i.id_ingrediente
                                WHERE pi.producto_id = $id";

                $vResultado->ingredientes = $this->enlace->ExecuteSQL($vSQLIngredientes);
            }

            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}

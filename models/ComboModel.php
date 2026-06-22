<?php
class ComboModel
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
                        co.*,
                        ca.nombre_categoria
                    FROM combos co
                    INNER JOIN categorias ca
                        ON co.categoria_id = ca.id_categoria
                    ORDER BY co.nombre_combo ASC";

            return $this->enlace->ExecuteSQL($vSQL);

        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $vSQL = "SELECT 
                        co.*,
                        ca.nombre_categoria
                    FROM combos co
                    INNER JOIN categorias ca
                        ON co.categoria_id = ca.id_categoria
                    WHERE co.id_combo = $id";

            $vResultado = $this->enlace->ExecuteSQL($vSQL);

            if (!empty($vResultado)) {
                $vResultado = $vResultado[0];

                $vSQLProductos = "SELECT 
                                    p.*,
                                    cp.cantidad
                                  FROM combo_producto cp
                                  INNER JOIN productos p
                                    ON cp.producto_id = p.id_producto
                                  WHERE cp.combo_id = $id";

                $vResultado->productos = $this->enlace->ExecuteSQL($vSQLProductos);
            }

            return $vResultado;

        } catch (Exception $e) {
            handleException($e);
        }
    }
}
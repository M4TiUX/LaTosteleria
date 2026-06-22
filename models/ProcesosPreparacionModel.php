<?php
class ProcesoPreparacionModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    // Retorna todos los productos que tienen proceso,
    // con el total de estaciones (pasos) de cada uno
    public function all()
    {
        try {
            $vSQL = "SELECT 
                        p.id_producto,
                        p.nombre_producto,
                        COUNT(pp.id_proceso) AS total_estaciones
                     FROM productos p
                     INNER JOIN procesos_preparacion pp
                         ON p.id_producto = pp.producto_id
                     GROUP BY p.id_producto, p.nombre_producto
                     ORDER BY p.nombre_producto ASC";

            return $this->enlace->ExecuteSQL($vSQL);

        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Retorna el nombre del producto y la lista completa
    // de estaciones con nombre y orden para un producto dado
    public function get($producto_id)
    {
        try {
            // Primero obtenemos el nombre del producto
            $vSQLProducto = "SELECT nombre_producto 
                             FROM productos 
                             WHERE id_producto = $producto_id";

            $producto = $this->enlace->ExecuteSQL($vSQLProducto);

            if (empty($producto)) {
                return null;
            }

            // Luego obtenemos sus estaciones ordenadas
            $vSQLEstaciones = "SELECT 
                                   e.id_estacion,
                                   e.nombre_estacion,
                                   pp.orden_paso,
                                   pp.tiempo_estimado_minutos
                               FROM procesos_preparacion pp
                               INNER JOIN estaciones e
                                   ON pp.estacion_id = e.id_estacion
                               WHERE pp.producto_id = $producto_id
                               ORDER BY pp.orden_paso ASC";

            $resultado = $producto[0];
            $resultado->estaciones = $this->enlace->ExecuteSQL($vSQLEstaciones);

            return $resultado;

        } catch (Exception $e) {
            handleException($e);
        }
    }
}
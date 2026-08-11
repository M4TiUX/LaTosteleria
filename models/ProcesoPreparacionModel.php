<?php

class ProcesoPreparacionModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    // =========================================================
    // LISTAR PROCESOS
    // =========================================================
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

    // =========================================================
    // OBTENER PROCESO POR PRODUCTO
    // =========================================================
    public function get($producto_id)
    {
        try {
            $producto_id = intval($producto_id);

            $vSQLProducto = "SELECT 
                                id_producto,
                                nombre_producto
                             FROM productos
                             WHERE id_producto = $producto_id";

            $producto = $this->enlace->ExecuteSQL($vSQLProducto);

            if (empty($producto)) {
                return null;
            }

            $vSQLEstaciones = "SELECT
                                pp.id_proceso,
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
            $resultado->estaciones =
                $this->enlace->ExecuteSQL($vSQLEstaciones);

            return $resultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // =========================================================
    // LISTAR ESTACIONES
    // =========================================================
    public function getEstaciones()
    {
        try {
            $vSQL = "SELECT
                        id_estacion,
                        nombre_estacion
                     FROM estaciones
                     ORDER BY nombre_estacion ASC";

            return $this->enlace->ExecuteSQL($vSQL);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // =========================================================
    // LISTAR PRODUCTOS
    // =========================================================
    public function getProductos()
    {
        try {
            $vSQL = "SELECT
                        id_producto,
                        nombre_producto
                     FROM productos
                     ORDER BY nombre_producto ASC";

            return $this->enlace->ExecuteSQL($vSQL);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // =========================================================
    // VERIFICAR SI UN PRODUCTO YA TIENE PROCESO
    // =========================================================
    public function exists($producto_id)
    {
        try {
            $producto_id = intval($producto_id);

            $vSQL = "SELECT COUNT(*) AS total
                     FROM procesos_preparacion
                     WHERE producto_id = $producto_id";

            $resultado = $this->enlace->ExecuteSQL($vSQL);

            return !empty($resultado)
                && intval($resultado[0]->total) > 0;
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }

    // =========================================================
    // CREAR PROCESO
    // =========================================================
    public function create($producto_id, $estaciones)
    {
        try {
            $producto_id = intval($producto_id);

            foreach ($estaciones as $index => $estacion) {

                $estacion_id =
                    intval($estacion->estacion_id);

                $tiempo =
                    intval($estacion->tiempo_estimado_minutos);

                // El orden depende de la posición en el formulario.
                $orden = $index + 1;

                $vSQL = "INSERT INTO procesos_preparacion
                            (
                                producto_id,
                                estacion_id,
                                orden_paso,
                                tiempo_estimado_minutos
                            )
                         VALUES
                            (
                                $producto_id,
                                $estacion_id,
                                $orden,
                                $tiempo
                            )";

                $this->enlace->executeSQL_DML($vSQL);
            }

            return true;
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }

    // =========================================================
    // ACTUALIZAR PROCESO
    // =========================================================
    public function update($producto_id, $estaciones)
    {
        try {
            $producto_id = intval($producto_id);

            // Eliminamos los pasos actuales.
            $vSQLDelete = "DELETE FROM procesos_preparacion
                           WHERE producto_id = $producto_id";

            $this->enlace->executeSQL_DML($vSQLDelete);

            // Volvemos a registrar la nueva estructura.
            foreach ($estaciones as $index => $estacion) {

                $estacion_id =
                    intval($estacion->estacion_id);

                $tiempo =
                    intval($estacion->tiempo_estimado_minutos);

                $orden = $index + 1;

                $vSQL = "INSERT INTO procesos_preparacion
                            (
                                producto_id,
                                estacion_id,
                                orden_paso,
                                tiempo_estimado_minutos
                            )
                         VALUES
                            (
                                $producto_id,
                                $estacion_id,
                                $orden,
                                $tiempo
                            )";

                $this->enlace->executeSQL_DML($vSQL);
            }

            return true;
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }

    // =========================================================
    // ELIMINAR PROCESO COMPLETO
    // =========================================================
    public function delete($producto_id)
    {
        try {
            $producto_id = intval($producto_id);

            $vSQL = "DELETE FROM procesos_preparacion
                     WHERE producto_id = $producto_id";

            return $this->enlace->executeSQL_DML($vSQL);
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }
}

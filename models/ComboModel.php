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

    public function create($objeto)
    {
        try {
            // Datos principales del combo
            $nombre_combo = $objeto->nombre_combo;
            $descripcion = $objeto->descripcion;
            $precio_especial = $objeto->precio_especial;
            $categoria_id = $objeto->categoria_id;

            // Insertar combo
            $vSQL = "INSERT INTO combos (
                    categoria_id,
                    nombre_combo,
                    descripcion,
                    precio_especial
                 )
                 VALUES (
                    '$categoria_id',
                    '$nombre_combo',
                    '$descripcion',
                    '$precio_especial'
                 )";

            // Ejecutar INSERT y obtener ID
            $idCombo = $this->enlace->executeSQL_DML_last(
                $vSQL
            );

            // Insertar productos del combo
            if (
                isset($objeto->productos) &&
                is_array($objeto->productos)
            ) {
                foreach ($objeto->productos as $producto) {

                    $producto_id = $producto->producto_id;
                    $cantidad = $producto->cantidad;

                    $vSQLProducto = "INSERT INTO combo_producto (
                                    combo_id,
                                    producto_id,
                                    cantidad
                                 )
                                 VALUES (
                                    '$idCombo',
                                    '$producto_id',
                                    '$cantidad'
                                 )";

                    $this->enlace->executeSQL_DML(
                        $vSQLProducto
                    );
                }
            }

            return $this->get($idCombo);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update($objeto)
    {
        try {
            $idCombo = (int) $objeto->id_combo;
            $categoriaId = (int) $objeto->categoria_id;
            $nombreCombo = $objeto->nombre_combo;
            $descripcion = $objeto->descripcion;
            $precioEspecial = (float) $objeto->precio_especial;

            // Actualizar datos principales del combo
            $vSQL = "UPDATE combos
                 SET
                    categoria_id = '$categoriaId',
                    nombre_combo = '$nombreCombo',
                    descripcion = '$descripcion',
                    precio_especial = '$precioEspecial'
                 WHERE id_combo = $idCombo";

            $this->enlace->executeSQL_DML($vSQL);

            // Eliminar relaciones anteriores
            $vSQLEliminar = "DELETE FROM combo_producto
                         WHERE combo_id = $idCombo";

            $this->enlace->executeSQL_DML($vSQLEliminar);

            // Insertar nuevamente los productos seleccionados
            if (
                isset($objeto->productos) &&
                is_array($objeto->productos)
            ) {
                foreach ($objeto->productos as $producto) {
                    $productoId = (int) $producto->producto_id;
                    $cantidad = (int) $producto->cantidad;

                    if ($productoId <= 0 || $cantidad <= 0) {
                        continue;
                    }

                    $vSQLProducto = "INSERT INTO combo_producto
                                (
                                    combo_id,
                                    producto_id,
                                    cantidad
                                )
                                VALUES
                                (
                                    $idCombo,
                                    $productoId,
                                    $cantidad
                                )";

                    $this->enlace->executeSQL_DML($vSQLProducto);
                }
            }

            return $this->get($idCombo);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Habilitar o inhabilitar combo.
     */
    public function changeStatus($combo)
    {
        try {
            $idCombo = (int) $combo->id_combo;
            $activo = (int) $combo->activo;

            if ($idCombo <= 0) {
                throw new Exception(
                    "El identificador del combo no es válido."
                );
            }

            if ($activo !== 0 && $activo !== 1) {
                throw new Exception(
                    "El estado del combo no es válido."
                );
            }

            $sql = "UPDATE combos
                SET activo = $activo
                WHERE id_combo = $idCombo";

            $this->enlace->executeSQL_DML($sql);

            return $this->get($idCombo);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}

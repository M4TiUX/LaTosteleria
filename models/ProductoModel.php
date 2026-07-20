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

    /**
     * Escapar texto para utilizarlo en consultas SQL.
     */
    private function escapar($valor)
    {
        return addslashes(trim((string) $valor));
    }

    /**
     * Verificar si existe otro producto con el mismo nombre.
     */
    private function nombreExiste($nombre, $idProducto = null)
    {
        $nombre = $this->escapar($nombre);

        $sql = "SELECT id_producto
            FROM productos
            WHERE LOWER(nombre_producto) = LOWER('$nombre')";

        if ($idProducto !== null) {
            $idProducto = (int) $idProducto;
            $sql .= " AND id_producto <> $idProducto";
        }

        $resultado = $this->enlace->ExecuteSQL($sql);

        return !empty($resultado);
    }

    /**
     * Crear un producto con sus ingredientes.
     */
    public function create($producto)
    {
        try {
            if (
                !isset($producto->nombre_producto) ||
                !isset($producto->descripcion) ||
                !isset($producto->precio) ||
                !isset($producto->categoria_id) ||
                !isset($producto->ingredientes)
            ) {
                throw new Exception(
                    "Faltan datos obligatorios para registrar el producto."
                );
            }

            $nombre = $this->escapar($producto->nombre_producto);
            $descripcion = $this->escapar($producto->descripcion);
            $precio = (float) $producto->precio;
            $categoriaId = (int) $producto->categoria_id;

            if ($nombre === "") {
                throw new Exception("El nombre del producto es obligatorio.");
            }

            if ($descripcion === "") {
                throw new Exception("La descripción del producto es obligatoria.");
            }

            if ($precio <= 0) {
                throw new Exception("El precio debe ser mayor que cero.");
            }

            if ($categoriaId <= 0) {
                throw new Exception("Debe seleccionar una categoría válida.");
            }

            if (
                !is_array($producto->ingredientes) ||
                count($producto->ingredientes) === 0
            ) {
                throw new Exception(
                    "Debe seleccionar al menos un ingrediente."
                );
            }

            if ($this->nombreExiste($nombre)) {
                throw new Exception(
                    "Ya existe un producto registrado con ese nombre."
                );
            }

            $imagen = null;

            if (isset($producto->imagen) && trim($producto->imagen) !== "") {
                $imagen = $this->escapar($producto->imagen);
            }

            $valorImagen = $imagen !== null
                ? "'$imagen'"
                : "NULL";

            $sql = "INSERT INTO productos
                    (
                        categoria_id,
                        nombre_producto,
                        descripcion,
                        precio,
                        imagen
                    )
                VALUES
                    (
                        $categoriaId,
                        '$nombre',
                        '$descripcion',
                        $precio,
                        $valorImagen
                    )";

            $idProducto = $this->enlace->executeSQL_DML_last($sql);

            foreach ($producto->ingredientes as $ingredienteId) {
                $ingredienteId = (int) $ingredienteId;

                if ($ingredienteId <= 0) {
                    continue;
                }

                $sqlIngrediente = "INSERT INTO producto_ingrediente
                                  (
                                      producto_id,
                                      ingrediente_id
                                  )
                              VALUES
                                  (
                                      $idProducto,
                                      $ingredienteId
                                  )";

                $this->enlace->executeSQL_DML($sqlIngrediente);
            }

            return $this->get($idProducto);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Actualizar producto.
     */
    public function update($producto)
    {
        try {
            $idProducto = (int) $producto->id_producto;
            $nombre = $producto->nombre_producto;
            $descripcion = $producto->descripcion;
            $precio = $producto->precio;
            $categoriaId = (int) $producto->categoria_id;

            $imagen = isset($producto->imagen)
                ? $producto->imagen
                : null;

            // Validar nombre único, excluyendo el producto actual.
            $sqlValidar = "SELECT id_producto
                       FROM productos
                       WHERE LOWER(nombre_producto) = LOWER('$nombre')
                       AND id_producto <> $idProducto";

            $productoExistente = $this->enlace->ExecuteSQL($sqlValidar);

            if (!empty($productoExistente)) {
                throw new Exception(
                    "Ya existe otro producto registrado con ese nombre."
                );
            }

            $sql = "UPDATE productos
                SET
                    nombre_producto = '$nombre',
                    descripcion = '$descripcion',
                    precio = $precio,
                    categoria_id = $categoriaId";

            if ($imagen !== null && $imagen !== "") {
                $sql .= ", imagen = '$imagen'";
            }

            $sql .= " WHERE id_producto = $idProducto";

            $this->enlace->executeSQL_DML($sql);

            // Eliminar ingredientes anteriores.
            $sqlEliminar = "DELETE FROM producto_ingrediente
                        WHERE producto_id = $idProducto";

            $this->enlace->executeSQL_DML($sqlEliminar);

            // Insertar ingredientes nuevos.
            if (
                isset($producto->ingredientes) &&
                is_array($producto->ingredientes)
            ) {
                foreach ($producto->ingredientes as $ingredienteId) {
                    $ingredienteId = (int) $ingredienteId;

                    $sqlIngrediente = "INSERT INTO producto_ingrediente
                                      (
                                          producto_id,
                                          ingrediente_id
                                      )
                                  VALUES
                                      (
                                          $idProducto,
                                          $ingredienteId
                                      )";

                    $this->enlace->executeSQL_DML($sqlIngrediente);
                }
            }

            return $this->get($idProducto);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Habilitar o inhabilitar producto.
     */
    public function changeStatus($producto)
    {
        try {
            $idProducto = (int) $producto->id_producto;
            $activo = (int) $producto->activo;

            if ($idProducto <= 0) {
                throw new Exception(
                    "El identificador del producto no es válido."
                );
            }

            if ($activo !== 0 && $activo !== 1) {
                throw new Exception(
                    "El estado del producto no es válido."
                );
            }

            $sql = "UPDATE productos
                SET activo = $activo
                WHERE id_producto = $idProducto";

            $this->enlace->executeSQL_DML($sql);

            return $this->get($idProducto);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}

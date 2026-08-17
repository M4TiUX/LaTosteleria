<?php

class ComboModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /**
     * Listar combos.
     */
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

    /**
     * Obtener combo por id.
     */
    public function get($id)
    {
        try {
            $id = (int) $id;

            $vSQL = "SELECT
                        co.*,
                        ca.nombre_categoria
                    FROM combos co
                    INNER JOIN categorias ca
                        ON co.categoria_id = ca.id_categoria
                    WHERE co.id_combo = $id";

            $vResultado =
                $this->enlace->ExecuteSQL($vSQL);

            if (!empty($vResultado)) {
                $vResultado = $vResultado[0];

                $vSQLProductos = "SELECT
                                    p.*,
                                    cp.cantidad
                                  FROM combo_producto cp
                                  INNER JOIN productos p
                                    ON cp.producto_id = p.id_producto
                                  WHERE cp.combo_id = $id";

                $vResultado->productos =
                    $this->enlace->ExecuteSQL(
                        $vSQLProductos
                    );
            }

            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Escapar texto.
     */
    private function escapar($valor)
    {
        return addslashes(
            trim((string) $valor)
        );
    }

    /**
     * Verificar si existe otro combo
     * con el mismo nombre.
     */
    private function nombreExiste(
        $nombre,
        $idCombo = null
    ) {
        $nombre = $this->escapar($nombre);

        $sql = "SELECT id_combo
                FROM combos
                WHERE LOWER(nombre_combo) =
                      LOWER('$nombre')";

        if ($idCombo !== null) {
            $idCombo = (int) $idCombo;

            $sql .=
                " AND id_combo <> $idCombo";
        }

        $resultado =
            $this->enlace->ExecuteSQL($sql);

        return !empty($resultado);
    }

    /**
     * Crear combo.
     */
    public function create($combo)
    {
        try {
            // Validar datos obligatorios
            if (
                !isset($combo->nombre_combo) ||
                !isset($combo->descripcion) ||
                !isset($combo->precio_especial) ||
                !isset($combo->categoria_id) ||
                !isset($combo->productos)
            ) {
                throw new Exception(
                    "Faltan datos obligatorios para registrar el combo."
                );
            }

            $nombre =
                $this->escapar(
                    $combo->nombre_combo
                );

            $descripcion =
                $this->escapar(
                    $combo->descripcion
                );

            $precioEspecial =
                (float) $combo->precio_especial;

            $categoriaId =
                (int) $combo->categoria_id;

            // Nombre
            if ($nombre === "") {
                throw new Exception(
                    "El nombre del combo es obligatorio."
                );
            }

            // Descripción
            if ($descripcion === "") {
                throw new Exception(
                    "La descripción del combo es obligatoria."
                );
            }

            // Precio
            if ($precioEspecial <= 0) {
                throw new Exception(
                    "El precio especial debe ser mayor que cero."
                );
            }

            // Categoría
            if ($categoriaId <= 0) {
                throw new Exception(
                    "Debe seleccionar una categoría válida."
                );
            }

            // Productos
            if (
                !is_array($combo->productos) ||
                count($combo->productos) === 0
            ) {
                throw new Exception(
                    "Debe seleccionar al menos un producto."
                );
            }

            // Nombre duplicado
            if ($this->nombreExiste($nombre)) {
                throw new Exception(
                    "Ya existe un combo registrado con ese nombre."
                );
            }

            /*
             * La imagen es obligatoria al crear.
             * Aunque SQL permita NULL para los registros
             * antiguos, los combos nuevos deben tener imagen.
             */
            if (
                !isset($combo->imagen) ||
                trim((string) $combo->imagen) === ""
            ) {
                throw new Exception(
                    "Debe seleccionar una imagen para el combo."
                );
            }

            $imagen =
                $this->escapar($combo->imagen);

            $sql = "INSERT INTO combos
                    (
                        categoria_id,
                        nombre_combo,
                        descripcion,
                        imagen,
                        precio_especial
                    )
                    VALUES
                    (
                        $categoriaId,
                        '$nombre',
                        '$descripcion',
                        '$imagen',
                        $precioEspecial
                    )";

            $idCombo =
                $this->enlace
                ->executeSQL_DML_last($sql);

            // Insertar productos
            foreach (
                $combo->productos as $producto
            ) {
                $productoId =
                    (int) $producto->producto_id;

                $cantidad =
                    (int) $producto->cantidad;

                if (
                    $productoId <= 0 ||
                    $cantidad <= 0
                ) {
                    continue;
                }

                $sqlProducto =
                    "INSERT INTO combo_producto
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

                $this->enlace
                    ->executeSQL_DML(
                        $sqlProducto
                    );
            }

            return $this->get($idCombo);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /**
     * Actualizar combo.
     */
    public function update($combo)
    {
        try {
            if (
                !isset($combo->id_combo) ||
                !isset($combo->nombre_combo) ||
                !isset($combo->descripcion) ||
                !isset($combo->precio_especial) ||
                !isset($combo->categoria_id) ||
                !isset($combo->productos)
            ) {
                throw new Exception(
                    "Faltan datos obligatorios para actualizar el combo."
                );
            }

            $idCombo =
                (int) $combo->id_combo;

            $nombre =
                $this->escapar(
                    $combo->nombre_combo
                );

            $descripcion =
                $this->escapar(
                    $combo->descripcion
                );

            $precioEspecial =
                (float) $combo->precio_especial;

            $categoriaId =
                (int) $combo->categoria_id;

            // ID
            if ($idCombo <= 0) {
                throw new Exception(
                    "El identificador del combo no es válido."
                );
            }

            // Nombre
            if ($nombre === "") {
                throw new Exception(
                    "El nombre del combo es obligatorio."
                );
            }

            // Descripción
            if ($descripcion === "") {
                throw new Exception(
                    "La descripción del combo es obligatoria."
                );
            }

            // Precio
            if ($precioEspecial <= 0) {
                throw new Exception(
                    "El precio especial debe ser mayor que cero."
                );
            }

            // Categoría
            if ($categoriaId <= 0) {
                throw new Exception(
                    "Debe seleccionar una categoría válida."
                );
            }

            // Productos
            if (
                !is_array($combo->productos) ||
                count($combo->productos) === 0
            ) {
                throw new Exception(
                    "Debe seleccionar al menos un producto."
                );
            }

            // Nombre duplicado
            if (
                $this->nombreExiste(
                    $nombre,
                    $idCombo
                )
            ) {
                throw new Exception(
                    "Ya existe otro combo registrado con ese nombre."
                );
            }

            // Imagen nueva opcional
            $imagen = null;

            if (
                isset($combo->imagen) &&
                trim((string) $combo->imagen) !== ""
            ) {
                $imagen =
                    $this->escapar(
                        $combo->imagen
                    );
            }

            $sql = "UPDATE combos
                    SET
                        categoria_id = $categoriaId,
                        nombre_combo = '$nombre',
                        descripcion = '$descripcion',
                        precio_especial = $precioEspecial";

            /*
             * Solo reemplazar imagen cuando
             * se recibió una nueva.
             */
            if ($imagen !== null) {
                $sql .=
                    ", imagen = '$imagen'";
            }

            $sql .=
                " WHERE id_combo = $idCombo";

            $this->enlace
                ->executeSQL_DML($sql);

            // Eliminar relaciones anteriores
            $sqlEliminar =
                "DELETE FROM combo_producto
                 WHERE combo_id = $idCombo";

            $this->enlace
                ->executeSQL_DML(
                    $sqlEliminar
                );

            // Registrar productos seleccionados
            foreach (
                $combo->productos as $producto
            ) {
                $productoId =
                    (int) $producto->producto_id;

                $cantidad =
                    (int) $producto->cantidad;

                if (
                    $productoId <= 0 ||
                    $cantidad <= 0
                ) {
                    continue;
                }

                $sqlProducto =
                    "INSERT INTO combo_producto
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

                $this->enlace
                    ->executeSQL_DML(
                        $sqlProducto
                    );
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
            $idCombo =
                (int) $combo->id_combo;

            $activo =
                (int) $combo->activo;

            if ($idCombo <= 0) {
                throw new Exception(
                    "El identificador del combo no es válido."
                );
            }

            if (
                $activo !== 0 &&
                $activo !== 1
            ) {
                throw new Exception(
                    "El estado del combo no es válido."
                );
            }

            $sql = "UPDATE combos
                    SET activo = $activo
                    WHERE id_combo = $idCombo";

            $this->enlace
                ->executeSQL_DML($sql);

            return $this->get($idCombo);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}

<?php

class MenuModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        try {
            $vSql = "SELECT
                        id_menu,
                        nombre_menu,
                        fecha_inicio,
                        fecha_fin,
                        hora_inicio,
                        hora_fin,
                        activo,
                        CASE
                            WHEN activo = 1
                                 AND CURDATE() BETWEEN fecha_inicio AND fecha_fin
                                 AND CURTIME() BETWEEN hora_inicio AND hora_fin
                            THEN 1
                            ELSE 0
                        END AS disponible
                    FROM menus
                    ORDER BY fecha_inicio DESC, hora_inicio DESC, id_menu DESC";

            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create($menu)
    {
        try {
            $this->validarMenu($menu);

            $nombre = $this->escapar($menu->nombre_menu);
            $fechaInicio = $this->escapar($menu->fecha_inicio);
            $fechaFin = $this->escapar($menu->fecha_fin);
            $horaInicio = $this->normalizarHora($menu->hora_inicio);
            $horaFin = $this->normalizarHora($menu->hora_fin);
            $activo = isset($menu->activo) ? (int) $menu->activo : 1;

            $sql = "INSERT INTO menus
                    (
                        nombre_menu,
                        fecha_inicio,
                        fecha_fin,
                        hora_inicio,
                        hora_fin,
                        activo
                    )
                VALUES
                    (
                        '$nombre',
                        '$fechaInicio',
                        '$fechaFin',
                        '$horaInicio',
                        '$horaFin',
                        $activo
                    )";

            $idMenu = $this->enlace->executeSQL_DML_last($sql);

            $this->guardarItems($idMenu, $menu->productos, $menu->combos);

            return $this->get($idMenu);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update($menu)
    {
        try {
            $idMenu = isset($menu->id_menu) ? (int) $menu->id_menu : 0;

            if ($idMenu <= 0) {
                throw new Exception("Debe indicar un menú válido para actualizar.");
            }

            $this->validarMenu($menu, $idMenu);

            $nombre = $this->escapar($menu->nombre_menu);
            $fechaInicio = $this->escapar($menu->fecha_inicio);
            $fechaFin = $this->escapar($menu->fecha_fin);
            $horaInicio = $this->normalizarHora($menu->hora_inicio);
            $horaFin = $this->normalizarHora($menu->hora_fin);
            $activo = isset($menu->activo) ? (int) $menu->activo : 1;

            $sql = "UPDATE menus
                    SET
                        nombre_menu = '$nombre',
                        fecha_inicio = '$fechaInicio',
                        fecha_fin = '$fechaFin',
                        hora_inicio = '$horaInicio',
                        hora_fin = '$horaFin',
                        activo = $activo
                    WHERE id_menu = $idMenu";

            $this->enlace->executeSQL_DML($sql);

            $sqlEliminar = "DELETE FROM menu_items WHERE menu_id = $idMenu";
            $this->enlace->executeSQL_DML($sqlEliminar);

            $this->guardarItems($idMenu, $menu->productos, $menu->combos);

            return $this->get($idMenu);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $menu = $this->getMenuRow($id);
            if (empty($menu)) {
                return null;
            }

            $menu->categorias = $this->getGroupedItems($id);

            return $menu;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function available()
    {
        try {
            $vSql = "SELECT
                        id_menu,
                        nombre_menu,
                        fecha_inicio,
                        fecha_fin,
                        hora_inicio,
                        hora_fin,
                        activo,
                        CASE
                            WHEN activo = 1
                                 AND CURDATE() BETWEEN fecha_inicio AND fecha_fin
                                 AND CURTIME() BETWEEN hora_inicio AND hora_fin
                            THEN 1
                            ELSE 0
                        END AS disponible
                    FROM menus
                    WHERE activo = 1
                      AND CURDATE() BETWEEN fecha_inicio AND fecha_fin
                      AND CURTIME() BETWEEN hora_inicio AND hora_fin
                                        ORDER BY fecha_inicio DESC, hora_inicio DESC, fecha_fin DESC, hora_fin DESC, id_menu DESC
                    LIMIT 1";

            $vResultado = $this->enlace->ExecuteSQL($vSql);
            if (!is_array($vResultado) || empty($vResultado)) {
                return null;
            }

            $menu = $vResultado[0];
            $menu->categorias = $this->getGroupedItems($menu->id_menu);

            return $menu;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    private function getMenuRow($id)
    {
        $id = (int) $id;

        $vSql = "SELECT
                    id_menu,
                    nombre_menu,
                    fecha_inicio,
                    fecha_fin,
                    hora_inicio,
                    hora_fin,
                    activo
                FROM menus
                WHERE id_menu = $id";

        $vResultado = $this->enlace->ExecuteSQL($vSql);

        if (is_array($vResultado) && !empty($vResultado)) {
            return $vResultado[0];
        }

        return null;
    }

    private function getGroupedItems($menuId)
    {
        $menuId = (int) $menuId;

        $vSql = "SELECT
                    COALESCE(c.nombre_categoria, 'Sin categoría') AS categoria_nombre,
                    item_tipo,
                    item_id,
                    item_nombre,
                    item_descripcion,
                    item_precio,
                    item_imagen
                FROM (
                    SELECT
                        'producto' AS item_tipo,
                        p.id_producto AS item_id,
                        p.nombre_producto AS item_nombre,
                        p.descripcion AS item_descripcion,
                        p.precio AS item_precio,
                        p.imagen AS item_imagen,
                        p.categoria_id AS categoria_id
                    FROM menu_items mi
                    INNER JOIN productos p ON mi.producto_id = p.id_producto
                    WHERE mi.menu_id = $menuId

                    UNION ALL

                    SELECT
                        'combo' AS item_tipo,
                        co.id_combo AS item_id,
                        co.nombre_combo AS item_nombre,
                        co.descripcion AS item_descripcion,
                        co.precio_especial AS item_precio,
                        NULL AS item_imagen,
                        co.categoria_id AS categoria_id
                    FROM menu_items mi
                    INNER JOIN combos co ON mi.combo_id = co.id_combo
                    WHERE mi.menu_id = $menuId
                ) AS items
                LEFT JOIN categorias c ON c.id_categoria = items.categoria_id
                ORDER BY categoria_nombre ASC, item_tipo ASC, item_nombre ASC";

        $vResultado = $this->enlace->ExecuteSQL($vSql);
        $categorias = [];

        if (!is_array($vResultado) || empty($vResultado)) {
            return [];
        }

        foreach ($vResultado as $item) {
            $categoriaNombre = $item->categoria_nombre;

            if (!isset($categorias[$categoriaNombre])) {
                $categorias[$categoriaNombre] = (object) [
                    'categoria_nombre' => $categoriaNombre,
                    'productos' => [],
                    'combos' => []
                ];
            }

            $elemento = (object) [
                'id' => $item->item_id,
                'nombre' => $item->item_nombre,
                'descripcion' => $item->item_descripcion,
                'precio' => $item->item_precio,
                'imagen' => $item->item_imagen
            ];

            if ($item->item_tipo === 'combo') {
                $categorias[$categoriaNombre]->combos[] = $elemento;
            } else {
                $categorias[$categoriaNombre]->productos[] = $elemento;
            }
        }

        return array_values($categorias);
    }

    private function escapar($valor)
    {
        return addslashes(trim((string) $valor));
    }

    private function normalizarHora($valor)
    {
        $valor = trim((string) $valor);

        if (preg_match('/^\d{2}:\d{2}$/', $valor)) {
            return $valor . ':00';
        }

        return $valor;
    }

    private function validarFecha($valor, $mensaje)
    {
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', (string) $valor)) {
            throw new Exception($mensaje);
        }

        $fecha = DateTime::createFromFormat('Y-m-d', $valor);

        if (!$fecha || $fecha->format('Y-m-d') !== $valor) {
            throw new Exception($mensaje);
        }

        return $fecha;
    }

    private function validarHora($valor, $mensaje)
    {
        $valor = trim((string) $valor);

        if (!preg_match('/^\d{2}:\d{2}(:\d{2})?$/', $valor)) {
            throw new Exception($mensaje);
        }

        $hora = strlen($valor) === 5 ? $valor . ':00' : $valor;
        $fecha = DateTime::createFromFormat('H:i:s', $hora);

        if (!$fecha || $fecha->format('H:i:s') !== $hora) {
            throw new Exception($mensaje);
        }

        return $hora;
    }

    private function validarMenu($menu, $idMenu = null)
    {
        if (!isset($menu->nombre_menu) || trim((string) $menu->nombre_menu) === '') {
            throw new Exception("El nombre del menú es obligatorio.");
        }

        $nombre = trim((string) $menu->nombre_menu);

        if (mb_strlen($nombre) < 3) {
            throw new Exception("El nombre del menú debe tener al menos 3 caracteres.");
        }

        if (mb_strlen($nombre) > 100) {
            throw new Exception("El nombre del menú no puede superar los 100 caracteres.");
        }

        if (!isset($menu->fecha_inicio) || !isset($menu->fecha_fin)) {
            throw new Exception("Debe indicar el rango de fechas del menú.");
        }

        $fechaInicio = $this->validarFecha($menu->fecha_inicio, "La fecha de inicio no tiene un formato válido.");
        $fechaFin = $this->validarFecha($menu->fecha_fin, "La fecha de fin no tiene un formato válido.");

        if ($fechaInicio > $fechaFin) {
            throw new Exception("La fecha de inicio no puede ser mayor que la fecha final.");
        }

        if (!isset($menu->hora_inicio) || !isset($menu->hora_fin)) {
            throw new Exception("Debe indicar el rango de horas del menú.");
        }

        $horaInicio = $this->validarHora($menu->hora_inicio, "La hora de inicio no tiene un formato válido.");
        $horaFin = $this->validarHora($menu->hora_fin, "La hora de fin no tiene un formato válido.");

        if ($fechaInicio == $fechaFin && $horaInicio > $horaFin) {
            throw new Exception("La hora de inicio no puede ser mayor que la hora final cuando las fechas son iguales.");
        }

        $productos = $this->normalizarIds(isset($menu->productos) ? $menu->productos : []);
        $combos = $this->normalizarIds(isset($menu->combos) ? $menu->combos : []);

        if (count($productos) === 0 && count($combos) === 0) {
            throw new Exception("Debe seleccionar al menos un producto o un combo.");
        }

        if ($idMenu !== null) {
            $menuExistente = $this->getMenuRow($idMenu);

            if (empty($menuExistente)) {
                throw new Exception("El menú seleccionado no existe.");
            }
        }
    }

    private function normalizarIds($items)
    {
        if (!is_array($items)) {
            return [];
        }

        $ids = [];

        foreach ($items as $item) {
            $id = (int) $item;

            if ($id > 0) {
                $ids[] = $id;
            }
        }

        return array_values(array_unique($ids));
    }

    private function guardarItems($menuId, $productos, $combos)
    {
        $menuId = (int) $menuId;
        $productos = $this->normalizarIds($productos);
        $combos = $this->normalizarIds($combos);

        foreach ($productos as $productoId) {
            $sqlItem = "INSERT INTO menu_items
                        (
                            menu_id,
                            producto_id,
                            combo_id
                        )
                    VALUES
                        (
                            $menuId,
                            $productoId,
                            NULL
                        )";

            $this->enlace->executeSQL_DML($sqlItem);
        }

        foreach ($combos as $comboId) {
            $sqlItem = "INSERT INTO menu_items
                        (
                            menu_id,
                            producto_id,
                            combo_id
                        )
                    VALUES
                        (
                            $menuId,
                            NULL,
                            $comboId
                        )";

            $this->enlace->executeSQL_DML($sqlItem);
        }
    }
}

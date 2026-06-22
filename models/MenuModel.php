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
                        activo
                    FROM menus
                    ORDER BY fecha_inicio DESC, hora_inicio DESC, id_menu DESC";

            return $this->enlace->ExecuteSQL($vSql);
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
                        activo
                    FROM menus
                    WHERE activo = 1
                      AND CURDATE() BETWEEN fecha_inicio AND fecha_fin
                      AND CURTIME() BETWEEN hora_inicio AND hora_fin
                    ORDER BY fecha_inicio DESC, hora_inicio DESC, id_menu DESC
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
}
